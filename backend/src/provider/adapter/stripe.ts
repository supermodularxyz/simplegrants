import { GrantWithFunding } from 'src/grants/grants.interface';
import { PaymentProviderAdapter } from './types';
import Stripe from 'stripe';
import { PaymentProvider, Prisma, User } from '@prisma/client';
import * as cuid from 'cuid';
import { PrismaService } from 'src/prisma/prisma.service';
import { Logger, LoggerService } from '@nestjs/common';

export interface PaymentIntentEventWebhookBody {
  id: string;
  object: string;
  api_version: string;
  created: number;
  data: {
    object: {
      id: string;
      object: string;
      last_payment_error: any;
      livemode: boolean;
      next_action: any;
      status: string;
      amount: number;
      amount_capturable: number;
      amount_details: {
        tip: any;
      };
      amount_received: number;
      application: any;
      application_fee_amount: any;
      automatic_payment_methods: any;
      canceled_at: any;
      cancellation_reason: any;
      capture_method: string;
      client_secret: string;
      confirmation_method: string;
      created: number;
      currency: string;
      customer: any;
      description: any;
      invoice: any;
      latest_charge: string;
      metadata: {
        userId: string;
        denomination: string;
      };
      on_behalf_of: any;
      payment_method: string;
      payment_method_options: {
        card: {
          installments: any;
          mandate_options: any;
          network: any;
          request_three_d_secure: string;
        };
      };
      payment_method_types: string[];
      processing: any;
      receipt_email: any;
      review: any;
      setup_future_usage: any;
      shipping: any;
      source: any;
      statement_descriptor: any;
      statement_descriptor_suffix: any;
      transfer_data: any;
      transfer_group: string;
    };
  };
  livemode: boolean;
  pending_webhooks: number;
  request: { id: any; idempotency_key: any };
  type: string;
}

export class StripeProvider implements PaymentProviderAdapter {
  constructor(private readonly prisma: PrismaService, apiKey: string) {
    this.stripe = new Stripe(apiKey, {
      apiVersion: '2022-11-15',
    });
  }
  private stripe: Stripe;
  private logger: LoggerService = new Logger(StripeProvider.name);

  /**
   * We can assume that in v1, we can only have 1 payment provider
   * @returns Default payment provider
   */
  async getDetails(): Promise<PaymentProvider> {
    return await this.prisma.paymentProvider.findFirst();
  }

  /**
   * Initiate a payment process with Stripe
   * @param grantWithFunding
   * @param user
   * @returns
   */
  async createPayment(grantWithFunding: GrantWithFunding[], user: User) {
    const provider = await this.getDetails();
    const transferGroup = cuid();

    for await (const grant of grantWithFunding) {
      if (grant.amount > 0) {
        await this.prisma.checkout.create({
          data: {
            user: {
              connect: {
                id: user.id,
              },
            },
            amount: grant.amount,
            denomination: provider.denominations[0],
            grant: {
              connect: {
                id: grant.id,
              },
            },
            groupId: transferGroup,
          },
        });
      }
    }

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: grantWithFunding.map((grant) => {
        return {
          price_data: {
            currency: provider.denominations[0],
            product_data: {
              name: grant.name,
              description: grant.description,
            },
            unit_amount: grant.amount * 100,
          },
          quantity: 1,
        };
      }),
      payment_intent_data: {
        transfer_group: transferGroup,
        metadata: {
          userId: user.id,
          denomination: provider.denominations[0],
        },
      },
      success_url: `${process.env.NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cancel`,
    });

    return session;
  }

  /**
   * We need to retrieve all checkout items tied to the specific transfer_group
   * Also need to retrieve & store the payment method to the table
   * Then we create a transfer for each item, and save the info into contributions
   * @param data
   */
  async handleWebhook(body: PaymentIntentEventWebhookBody): Promise<void> {
    const paymentProvider = await this.getDetails();
    const data = body.data.object;

    if (body.type != 'payment_intent.succeeded') return;
    this.logger.log('Received webhook for successful payment intent!');

    /**
     * Retrieve payment method
     */
    const stripePaymentMethod = await this.stripe.paymentMethods.retrieve(
      data.payment_method,
    );

    this.logger.log('Payment Method retrieved from Stripe!');
    /**
     * Save the payment method to the user
     * If the user already has a payment method, we update it.
     * Only if we find another user with the same payment fingerprint, we flag the account
     *
     * We also assume they will pay by card
     * TODO: Check for same payment fingerprint and flag the accounts
     */
    const userPaymentMethod = await this.prisma.paymentMethod.upsert({
      create: {
        uniqueId: stripePaymentMethod.card.fingerprint,
        displayInfo: stripePaymentMethod.card.last4,
        denomination: data.metadata.denomination,
        provider: {
          connect: {
            id: paymentProvider.id,
          },
        },
        metadata: {
          ...stripePaymentMethod.card,
        } as any,
        user: {
          connect: {
            id: data.metadata.userId,
          },
        },
      },
      update: {},
      where: {
        uniqueId: stripePaymentMethod.card.fingerprint,
      },
    });

    await this.prisma.user.update({
      data: {
        paymentMethods: {
          connect: {
            id: userPaymentMethod.id,
          },
        },
      },
      where: {
        id: data.metadata.userId,
      },
    });

    this.logger.log('User payment method saved!');
    this.logger.log('Retrieving checkout items...');

    /**
     * Create transfers
     */
    const transferGroup = data.transfer_group;
    const checkoutsToProcess = await this.prisma.checkout.findMany({
      where: {
        groupId: transferGroup,
      },
      include: {
        grant: {
          include: {
            paymentAccount: true,
          },
        },
      },
    });

    this.logger.log(`${checkoutsToProcess.length} items to process`);
    this.logger.log('Creating transfers...');

    for await (const checkout of checkoutsToProcess) {
      const a = await this.stripe.transfers.create({
        amount: checkout.amount,
        currency: checkout.denomination,
        destination: checkout.grant.paymentAccount.recipientAddress,
        transfer_group: transferGroup,
      });
    }

    this.logger.log('Transfers made!');

    /**
     * Store contributions
     */
    await this.prisma.contribution.createMany({
      data: checkoutsToProcess.map((checkout) => {
        return {
          userId: data.metadata.userId,
          amount: checkout.amount,
          denomination: checkout.denomination,
          amountUsd: checkout.amount,
          paymentMethodId: userPaymentMethod.id,
          grantId: checkout.grantId,
          flagged: false,
        };
      }),
    });

    this.logger.log('Contributions saved to database!');
    this.logger.log('Webhook run complete ✅');
  }
}
