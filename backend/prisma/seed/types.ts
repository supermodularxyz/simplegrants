import {
  Grant,
  PaymentMethod,
  PaymentProvider,
  PrismaClient,
  User,
} from '@prisma/client';
import { CUID } from './cuid';

export class Seed {
  public prisma: PrismaClient;
  public users: Partial<User>[];
  public admin: User;
  public grants: Grant[];
  public paymentProvider: PaymentProvider;
  public paymentMethod: PaymentMethod; // We can just use the same payment method for everything
  public cuid: CUID;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.users = [];
    this.grants = [];
    this.cuid = new CUID();
  }
}
