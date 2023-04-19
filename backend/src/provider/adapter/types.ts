import { PaymentProvider, User } from '@prisma/client';
import { GrantWithFunding } from 'src/grants/grants.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  FeeAllocationMethod,
  SuccessfulCheckoutInfo,
} from '../provider.interface';
import { PoolWithFunding } from 'src/pool/pool.interface';

export interface PaymentProviderConstructorProps {
  prisma: PrismaService;
  secret: string;
  /** ISO country code */
  country: string;
}

export interface PaymentProviderAdapter {
  getDetails(): Promise<PaymentProvider>;
  createGrantPayment(
    grantWithFunding: GrantWithFunding[],
    feeAllocation: FeeAllocationMethod,
    user: User,
  ): any;
  createPoolPayment(
    poolWithFunding: PoolWithFunding[],
    feeAllocation: FeeAllocationMethod,
    user: User,
  ): any;
  initiateTransfer(to: string, amount: number): Promise<any>;
  handleWebhook?(data: any): Promise<void>;
  retrieveCheckoutInfo?(sessionId: string): Promise<SuccessfulCheckoutInfo>;
}
