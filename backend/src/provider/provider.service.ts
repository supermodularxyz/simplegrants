import { Injectable } from '@nestjs/common';
import { PaymentProvider, User } from '@prisma/client';
import { GrantWithFunding } from 'src/grants/grants.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { StripeProvider } from './adapter/stripe';
import { PaymentProviderAdapter } from './adapter/types';
import { PoolWithFunding } from 'src/pool/pool.interface';
import { FeeAllocationMethod } from './provider.interface';

@Injectable()
export class ProviderService {
  constructor(private readonly prisma: PrismaService) {
    this.paymentProvider = new StripeProvider({
      prisma,
      secret: process.env.PAYMENT_KEY,
      country: 'US',
    });
  }
  private paymentProvider: PaymentProviderAdapter;

  /**
   * We can assume that in v1, we can only have 1 payment provider
   * @returns Default payment provider
   */
  async getProvider(): Promise<PaymentProvider> {
    return await this.paymentProvider.getDetails();
  }

  /**
   * Create a payment session using the payment provider
   * @param itemWithFunding
   * @param user
   * @returns
   */
  async createPaymentSession(
    itemWithFunding: (GrantWithFunding | PoolWithFunding)[],
    feeAllocation: FeeAllocationMethod,
    user: User,
  ) {
    if (itemWithFunding instanceof GrantWithFunding)
      return await this.paymentProvider.createGrantPayment(
        itemWithFunding as GrantWithFunding[],
        feeAllocation,
        user,
      );
    return await this.paymentProvider.createPoolPayment(
      itemWithFunding as PoolWithFunding[],
      feeAllocation,
      user,
    );
  }

  /**
   * Transfers funds to a destination address
   *
   * This is used by the QF matching cron function
   */
  async initiateTransfer(to: string, amount: number) {
    return await this.paymentProvider.initiateTransfer(to, amount);
  }

  /**
   * Call the function to handle the payment webhook
   * If the adapter doesn't have a webhook, it just skips this function
   * @param data
   * @returns
   */
  async handlePaymentWebhook(data: any) {
    if (data && this.paymentProvider.handleWebhook) {
      return await this.paymentProvider.handleWebhook(data);
    }
  }

  /**
   * Retrieve information about the checkout by session ID
   * @param sessionId
   * @returns
   */
  async retrieveCheckoutInfo(sessionId: string) {
    if (this.paymentProvider.retrieveCheckoutInfo) {
      return await this.paymentProvider.retrieveCheckoutInfo(sessionId);
    }
  }
}
