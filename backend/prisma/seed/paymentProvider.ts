import * as chalk from 'chalk';
import { Seed } from './types';

export const seedPaymentProvider = async (seed: Seed) => {
  const { prisma, cuid } = seed;

  console.log(chalk.blue('\nSeeding PaymentProvider...'));
  const providerId = cuid.get();
  const stripeProvider = await prisma.paymentProvider.upsert({
    where: { id: providerId },
    update: {},
    create: {
      id: providerId,
      name: 'Stripe',
      type: 'CARD',
      acceptedCountries: ['US', 'MY'],
      denominations: ['USD'],
      website: 'https://stripe.com/docs/api',
      schema: {},
      version: 1,
    },
  });
  seed.paymentProvider = stripeProvider;
  console.log(chalk.green('\n[ OK ]  PaymentProvider seeded!'));
};
