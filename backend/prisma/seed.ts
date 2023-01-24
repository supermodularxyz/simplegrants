import { PrismaClient } from '@prisma/client';
import {
  randCatchPhrase,
  randCountry,
  randImg,
  randNumber,
  randQuote,
  randText,
  randUrl,
  randUser,
  randUserName,
  randUuid,
} from '@ngneat/falso';
import * as chalk from 'chalk';

const prisma = new PrismaClient();
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
   * Give admin privilege to a real user (aka me)
   */
  const admin = await prisma.user.upsert({
    where: { email: 'echai2905@gmail.com' },
    update: {
      role: 'Admin',
    },
    create: {
      email: 'echai2905@gmail.com',
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
      description: randText(),
      image: randImg(),
      twitter: randUserName(),
      website: randUrl(),
      location: randCountry(),
      paymentAccount: {
        connectOrCreate: {
          create: {
            recipientAddress: 'sample_stripe_id',
            provider: {
              connect: {
                id: stripeProvider.id,
              },
            },
          },
          where: {
            recipientAddress_providerId: {
              recipientAddress: 'sample_stripe_id',
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
      description: randText(),
      image: randImg(),
      twitter: randUserName(),
      website: randUrl(),
      location: randCountry(),
      paymentAccount: {
        connectOrCreate: {
          create: {
            recipientAddress: 'sample_stripe_id',
            provider: {
              connect: {
                id: stripeProvider.id,
              },
            },
          },
          where: {
            recipientAddress_providerId: {
              recipientAddress: 'sample_stripe_id',
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
              amount: 1000,
              denomination: 'USD',
              amountUsd: 1000,
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
      description: randText(),
      image: randImg(),
      twitter: randUserName(),
      website: randUrl(),
      location: randCountry(),
      paymentAccount: {
        connectOrCreate: {
          create: {
            recipientAddress: 'sample_stripe_id',
            provider: {
              connect: {
                id: stripeProvider.id,
              },
            },
          },
          where: {
            recipientAddress_providerId: {
              recipientAddress: 'sample_stripe_id',
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
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
