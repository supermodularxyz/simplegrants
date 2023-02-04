import { PaymentProvider, User } from '@prisma/client';
import { GrantWithFunding } from 'src/grants/grants.interface';
import { PrismaService } from 'src/prisma/prisma.service';

export interface PaymentProviderConstructorProps {
  prisma: PrismaService;
  apiKey: string;
}

export interface PaymentProviderAdapter {
  getDetails(): Promise<PaymentProvider>;
  createPayment(grantWithFunding: GrantWithFunding[], user: User): any;
}
