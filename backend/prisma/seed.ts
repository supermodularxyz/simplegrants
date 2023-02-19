import { PrismaClient } from '@prisma/client';
import {
  randCatchPhrase,
  randCountry,
  randNumber,
  randQuote,
  randParagraph,
  randUrl,
  randUser,
  randUserName,
  randUuid,
} from '@ngneat/falso';
import * as chalk from 'chalk';

const prisma = new PrismaClient();

/**
 * The seeded data here is only used for manual & integration testing during local development.
 * In a production environment, the only seeded data should ideally be the `PaymentProvider`
 * and nothing more.
 */
async function main() {
  console.log(chalk.blue('\nSeeding PaymentProvider...'));
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
  console.log({ stripeProvider });

  if (process.env.NODE_ENV !== 'production') {
    console.log(chalk.blue('\nSeeding Users...'));
    /**
     * Generate a random user to test with
     */
    const userData = randUser();
    const user = await prisma.user.upsert({
      where: { id: 'cld9wbart000008mm079n9xpn' },
      update: {},
      create: {
        id: 'cld9wbart000008mm079n9xpn',
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        image: userData.img,
        bio: randQuote(),
        twitter: userData.username,
      },
    });

    const userPaymentMethod = await prisma.paymentMethod.upsert({
      where: { id: 'clda27mam000408l7hznt28wp' },
      update: {},
      create: {
        id: 'clda27mam000408l7hznt28wp',
        user: {
          connect: {
            id: user.id,
          },
        },
        uniqueId: randUuid(),
        denomination: 'USD',
        provider: {
          connect: {
            id: stripeProvider.id,
          },
        },
        metadata: {},
      },
    });

    /**
     * Create admin strictly for testing
     * This account can never be logged in due to the way NextAuth works.
     */
    const adminData = randUser();
    const admin = await prisma.user.upsert({
      where: { id: 'clda4z7rt000308l88i3i6ajs' },
      update: {},
      create: {
        id: 'clda4z7rt000308l88i3i6ajs',
        name: `${adminData.firstName} ${adminData.lastName}`,
        email: adminData.email,
        image: adminData.img,
        bio: randQuote(),
        twitter: adminData.username,
        role: 'Admin',
      },
    });
    console.log({ user, admin });

    console.log(chalk.blue('\nSeeding Grants...'));
    const emptyGrant = await prisma.grant.upsert({
      where: { id: 'cld1dnt1y000008m97yakhtrf' },
      update: {},
      create: {
        id: 'cld1dnt1y000008m97yakhtrf',
        name: randCatchPhrase(),
        description: randParagraph({ length: 3 }).join(' '),
        image: 'https://picsum.photos/seed/cld1dnt1y000008m97yakhtrf/1000/600',
        twitter: randUserName(),
        website: randUrl(),
        location: randCountry(),
        paymentAccount: {
          connectOrCreate: {
            create: {
              recipientAddress: 'acct_1MWyVDFcbjBUzcah',
              provider: {
                connect: {
                  id: stripeProvider.id,
                },
              },
            },
            where: {
              recipientAddress_providerId: {
                recipientAddress: 'acct_1MWyVDFcbjBUzcah',
                providerId: stripeProvider.id,
              },
            },
          },
        },
        team: {
          connect: {
            id: admin.id,
          },
        },
        fundingGoal: randNumber({ min: 1000, max: 50000 }),
        verified: true,
      },
    });

    const contributedGrant = await prisma.grant.upsert({
      where: { id: 'cld2ilh7t000008l3g1qe3nla' },
      update: {},
      create: {
        id: 'cld2ilh7t000008l3g1qe3nla',
        name: randCatchPhrase(),
        description: randParagraph({ length: 3 }).join(' '),
        image: 'https://picsum.photos/seed/cld2ilh7t000008l3g1qe3nla/1000/600',
        twitter: randUserName(),
        website: randUrl(),
        location: randCountry(),
        paymentAccount: {
          connectOrCreate: {
            create: {
              recipientAddress: 'acct_1MXdUaAM25Ajy0Ie',
              provider: {
                connect: {
                  id: stripeProvider.id,
                },
              },
            },
            where: {
              recipientAddress_providerId: {
                recipientAddress: 'acct_1MXdUaAM25Ajy0Ie',
                providerId: stripeProvider.id,
              },
            },
          },
        },
        team: {
          connect: [
            {
              id: user.id,
            },
            {
              id: admin.id,
            },
          ],
        },
        contributions: {
          createMany: {
            data: [
              {
                userId: user.id,
                amount: 3500,
                denomination: 'USD',
                amountUsd: 3500,
                paymentMethodId: userPaymentMethod.id,
                flagged: false,
              },
            ],
          },
        },
        fundingGoal: randNumber({ min: 1000, max: 50000 }),
        verified: true,
      },
    });

    const unverifiedGrant = await prisma.grant.upsert({
      where: { id: 'clda3184o000008mg5bqobymn' },
      update: {},
      create: {
        id: 'clda3184o000008mg5bqobymn',
        name: randCatchPhrase(),
        description: randParagraph({ length: 3 }).join(' '),
        image: 'https://picsum.photos/seed/clda3184o000008mg5bqobymn/1000/600',
        twitter: randUserName(),
        website: randUrl(),
        location: randCountry(),
        paymentAccount: {
          connectOrCreate: {
            create: {
              recipientAddress: 'acct_1MWsgbKMcPvbzDpI',
              provider: {
                connect: {
                  id: stripeProvider.id,
                },
              },
            },
            where: {
              recipientAddress_providerId: {
                recipientAddress: 'acct_1MWsgbKMcPvbzDpI',
                providerId: stripeProvider.id,
              },
            },
          },
        },
        team: {
          connect: {
            id: user.id,
          },
        },
        fundingGoal: randNumber({ min: 1000, max: 50000 }),
        verified: false,
      },
    });
    console.log({ emptyGrant, contributedGrant, unverifiedGrant });
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
