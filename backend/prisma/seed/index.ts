import { PrismaClient } from '@prisma/client';
import { seedPaymentProvider } from './paymentProvider';
import { Seed } from './types';
import { seedUsers } from './users';
import { seedGrants } from './grants';
import { seedEcosystemBuilder } from './ecosystemBuilder';
import { seedInviteCodes } from './inviteCodes';

const prisma = new PrismaClient();

/**
 * The seeded data here is only used for manual & integration testing during local development.
 * In a production environment, the only seeded data should ideally be the `PaymentProvider`
 * and nothing more.
 */
async function main() {
  const seed = new Seed(prisma);
  await seedPaymentProvider(seed);

  if (process.env.NODE_ENV !== 'production') {
    await seedUsers(seed);
    await seedGrants(seed);
    await seedEcosystemBuilder(seed);
    await seedInviteCodes(seed);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
