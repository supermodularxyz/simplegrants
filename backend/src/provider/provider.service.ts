import { Injectable } from '@nestjs/common';
import { PaymentProvider, User } from '@prisma/client';
import * as cuid from 'cuid';
import { GrantWithFunding } from 'src/grants/grants.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class ProviderService {
  constructor(private readonly prisma: PrismaService) {
    this.stripe = new Stripe(process.env.PAYMENT_KEY, {
      apiVersion: '2022-11-15',
    });
  }
  private stripe: Stripe;

  /**
   * We can assume that in v1, we can only have 1 payment provider
   * @returns Default payment provider
   */
  async getProvider(): Promise<PaymentProvider> {
    return await this.prisma.paymentProvider.findFirst();
  }

  async createPaymentSession(grantWithFunding: GrantWithFunding[], user: User) {
    const provider = await this.getProvider();
    const transferGroup = cuid();

    // const paymentIntent = await this.stripe.paymentIntents.create({
    //   amount,
    //   currency: provider.denominations[0],
    //   payment_method_types: ['card'],
    //   receipt_email: user.email,
    //   transfer_group: transferGroup,
    // });

    // for await (const grant of grantWithFunding) {
    //   if (grant.amount > 0) {
    //     await this.stripe.transfers.create({
    //       amount: grant.amount,
    //       currency: provider.denominations[0],
    //       destination: grant.paymentAccount.recipientAddress,
    //       transfer_group: transferGroup,
    //     });
    //   }
    // }

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
      success_url: 'https://localhost:3001/success',
      cancel_url: 'https://localhost:3001/cancel',
    });

    return session;
    // return paymentIntent;
  }
}
