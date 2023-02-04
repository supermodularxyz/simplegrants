import { GrantWithFunding } from 'src/grants/grants.interface';
import { PaymentProviderAdapter } from './types';
import Stripe from 'stripe';
import { PaymentProvider, User } from '@prisma/client';
import * as cuid from 'cuid';
import { PrismaService } from 'src/prisma/prisma.service';

export class StripeProvider implements PaymentProviderAdapter {
  constructor(private readonly prisma: PrismaService, apiKey: string) {
    this.stripe = new Stripe(apiKey, {
      apiVersion: '2022-11-15',
    });
  }
  private stripe: Stripe;

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
        await this.stripe.paymentIntents.create({
          amount: grant.amount,
          currency: provider.denominations[0],
          payment_method_types: ['card'],
          receipt_email: user.email,
          transfer_data: {
            destination: grant.paymentAccount.recipientAddress,
            amount: grant.amount,
          },
          transfer_group: transferGroup,
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
      },
      success_url: `${process.env.NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cancel`,
    });

    return session;
  }
}
