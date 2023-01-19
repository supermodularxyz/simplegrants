import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const stripeProvider = await prisma.paymentProvider.upsert({
    where: { id: 'cld1ehocw000008k0a2u1e3z6' },
    update: {},
    create: {
      id: 'cld1ehocw000008k0a2u1e3z6',
      name: 'Stripe',
      type: 'CARD',
      acceptedCountries: ['US', 'MY'],
      denominations: ['USD'],
      website: 'https://stripe.com/docs/api',
      schema: {},
      version: 1,
    },
  });

  const firstGrant = await prisma.grant.upsert({
    where: { id: 'cld1dnt1y000008m97yakhtrf' },
    update: {},
    create: {
      id: 'cld1dnt1y000008m97yakhtrf',
      name: 'First Grant',
      description: 'This is the first grant in SimpleGrants',
      image: 'https://picsum.photos/200/300',
      twitter: 'testing',
      website: 'https://google.com',
      location: 'Malaysia',
      paymentAccount: {
        create: {
          recipientAddress: 'sample_stripe_id',
          provider: {
            connect: {
              id: stripeProvider.id,
            },
          },
        },
      },
      fundingGoal: 10000,
      verified: true,
    },
  });

  const secondGrant = await prisma.grant.upsert({
    where: { id: 'cld2ilh7t000008l3g1qe3nla' },
    update: {},
    create: {
      id: 'cld2ilh7t000008l3g1qe3nla',
      name: 'Second Grant',
      description: 'This is the second grant in SimpleGrants',
      image: 'https://picsum.photos/200/300',
      twitter: 'testing2',
      website: 'https://google.com',
      location: 'United States',
      paymentAccount: {
        create: {
          recipientAddress: 'sample_stripe_id2',
          provider: {
            connect: {
              id: stripeProvider.id,
            },
          },
        },
      },
      fundingGoal: 20000,
      verified: true,
    },
  });
  console.log({ firstGrant, secondGrant });
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
