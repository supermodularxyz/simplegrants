import { Injectable } from '@nestjs/common';
import { PaymentProvider, User } from '@prisma/client';
import * as cuid from 'cuid';
import {
  FeeAllocationMethod,
  GrantWithFunding,
} from 'src/grants/grants.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { StripeProvider } from './adapter/stripe';
import { PaymentProviderAdapter } from './adapter/types';

@Injectable()
export class ProviderService {
  constructor(private readonly prisma: PrismaService) {
    this.paymentProvider = new StripeProvider(prisma, process.env.PAYMENT_KEY);
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
   * @param grantWithFunding
   * @param user
   * @returns
   */
  async createPaymentSession(
    grantWithFunding: GrantWithFunding[],
    feeAllocation: FeeAllocationMethod,
    user: User,
  ) {
    return await this.paymentProvider.createPayment(
      grantWithFunding,
      feeAllocation,
      user,
    );
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
