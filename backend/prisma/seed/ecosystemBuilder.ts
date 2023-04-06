import * as chalk from 'chalk';
import { Seed } from './types';
import {
  randCatchPhrase,
  randCountry,
  randNumber,
  randParagraph,
  randUrl,
  randUserName,
} from '@ngneat/falso';
import * as cuidgenerator from 'cuid';

export const seedEcosystemBuilder = async (seed: Seed) => {
  const { prisma, cuid, users, grants, paymentMethod } = seed;

  console.log(chalk.blue('\nSeeding EcosystemBuilder...'));
  const ecosystemBuilderId = cuid.get();
  const ecosystemBuilder = await prisma.ecosystemBuilder.upsert({
    where: {
      id: ecosystemBuilderId,
    },
    update: {},
    create: {
      id: ecosystemBuilderId,
      user: {
        connect: {
          id: users[Math.floor(Math.random() * users.length)].id,
        },
      },
      inviteCode: {
        create: {
          code: cuidgenerator(),
        },
      },
    },
  });
  console.log(chalk.green('\n[ OK ]  EcosystemBuilder seeded!'));

  console.log(chalk.blue('\nSeeding MatchingRound...'));
  const matchingRoundId = cuid.get();
  const matchingRound = await prisma.matchingRound.upsert({
    where: { id: matchingRoundId },
    update: {},
    create: {
      id: matchingRoundId,
      name: 'First Matching Round',
      contributions: {
        createMany: {
          data: Array.from(Array(10).keys()).map((_) => {
            const amount = randNumber({ min: 5000, max: 10000 });
            return {
              userId: users[Math.floor(Math.random() * users.length)].id,
              amount: amount,
              denomination: 'USD',
              amountUsd: amount,
              paymentMethodId: paymentMethod.id,
              flagged: false,
            };
          }),
        },
      },
      grants: {
        connect: [
          {
            id: grants[0].id,
          },
          {
            id: grants[1].id,
          },
        ],
      },
      verified: true,
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 240000),
    },
  });

  let grantId = cuid.get();
  const grantA = await prisma.grant.upsert({
    where: { id: grantId },
    update: {},
    create: {
      id: grantId,
      name: randCatchPhrase(),
      description: randParagraph({ length: 3 }).join(' '),
      image: `https://picsum.photos/seed/${grantId}/1000/600.jpg`,
      twitter: randUserName(),
      website: randUrl(),
      location: randCountry(),
      paymentAccount: {
        connectOrCreate: {
          create: {
            recipientAddress: 'acct_1MWsgbKMcPvbzDpI',
            provider: {
              connect: {
                id: seed.paymentProvider.id,
              },
            },
          },
          where: {
            recipientAddress_providerId: {
              recipientAddress: 'acct_1MWsgbKMcPvbzDpI',
              providerId: seed.paymentProvider.id,
            },
          },
        },
      },
      team: {
        connect: {
          id: seed.users[0].id,
        },
      },
      contributions: {
        createMany: {
          data: Array.from(Array(10).keys()).map((_) => {
            const amount = 1;
            return {
              userId: users[Math.floor(Math.random() * users.length)].id,
              amount: amount,
              denomination: 'USD',
              amountUsd: amount,
              paymentMethodId: seed.paymentMethod.id,
              flagged: false,
            };
          }),
        },
      },
      fundingGoal: randNumber({ min: 1000, max: 50000 }),
      verified: true,
    },
  });

  grantId = cuid.get();
  const grantB = await prisma.grant.upsert({
    where: { id: grantId },
    update: {},
    create: {
      id: grantId,
      name: randCatchPhrase(),
      description: randParagraph({ length: 3 }).join(' '),
      image: `https://picsum.photos/seed/${grantId}/1000/600.jpg`,
      twitter: randUserName(),
      website: randUrl(),
      location: randCountry(),
      paymentAccount: {
        connectOrCreate: {
          create: {
            recipientAddress: 'acct_1MWsgbKMcPvbzDpI',
            provider: {
              connect: {
                id: seed.paymentProvider.id,
              },
            },
          },
          where: {
            recipientAddress_providerId: {
              recipientAddress: 'acct_1MWsgbKMcPvbzDpI',
              providerId: seed.paymentProvider.id,
            },
          },
        },
      },
      team: {
        connect: {
          id: seed.users[0].id,
        },
      },
      contributions: {
        createMany: {
          data: Array.from(Array(3).keys()).map((_, index) => {
            const amount = 1 + index;
            return {
              userId: users[Math.floor(Math.random() * users.length)].id,
              amount: amount,
              denomination: 'USD',
              amountUsd: amount,
              paymentMethodId: seed.paymentMethod.id,
              flagged: false,
            };
          }),
        },
      },
      fundingGoal: randNumber({ min: 1000, max: 50000 }),
      verified: true,
    },
  });

  grantId = cuid.get();
  const grantC = await prisma.grant.upsert({
    where: { id: grantId },
    update: {},
    create: {
      id: grantId,
      name: randCatchPhrase(),
      description: randParagraph({ length: 3 }).join(' '),
      image: `https://picsum.photos/seed/${grantId}/1000/600.jpg`,
      twitter: randUserName(),
      website: randUrl(),
      location: randCountry(),
      paymentAccount: {
        connectOrCreate: {
          create: {
            recipientAddress: 'acct_1MWsgbKMcPvbzDpI',
            provider: {
              connect: {
                id: seed.paymentProvider.id,
              },
            },
          },
          where: {
            recipientAddress_providerId: {
              recipientAddress: 'acct_1MWsgbKMcPvbzDpI',
              providerId: seed.paymentProvider.id,
            },
          },
        },
      },
      team: {
        connect: {
          id: seed.users[0].id,
        },
      },
      contributions: {
        createMany: {
          data: Array.from(Array(1).keys()).map((_) => {
            const amount = 10;
            return {
              userId: users[Math.floor(Math.random() * users.length)].id,
              amount: amount,
              denomination: 'USD',
              amountUsd: amount,
              paymentMethodId: seed.paymentMethod.id,
              flagged: false,
            };
          }),
        },
      },
      fundingGoal: randNumber({ min: 1000, max: 50000 }),
      verified: true,
    },
  });

  grantId = cuid.get();
  const grantD = await prisma.grant.upsert({
    where: { id: grantId },
    update: {},
    create: {
      id: grantId,
      name: randCatchPhrase(),
      description: randParagraph({ length: 3 }).join(' '),
      image: `https://picsum.photos/seed/${grantId}/1000/600.jpg`,
      twitter: randUserName(),
      website: randUrl(),
      location: randCountry(),
      paymentAccount: {
        connectOrCreate: {
          create: {
            recipientAddress: 'acct_1MWsgbKMcPvbzDpI',
            provider: {
              connect: {
                id: seed.paymentProvider.id,
              },
            },
          },
          where: {
            recipientAddress_providerId: {
              recipientAddress: 'acct_1MWsgbKMcPvbzDpI',
              providerId: seed.paymentProvider.id,
            },
          },
        },
      },
      team: {
        connect: {
          id: seed.users[0].id,
        },
      },
      contributions: {
        createMany: {
          data: Array.from(Array(2).keys()).map((_) => {
            const amount = 5;
            return {
              userId: users[Math.floor(Math.random() * users.length)].id,
              amount: amount,
              denomination: 'USD',
              amountUsd: amount,
              paymentMethodId: seed.paymentMethod.id,
              flagged: false,
            };
          }),
        },
      },
      fundingGoal: randNumber({ min: 1000, max: 50000 }),
      verified: true,
    },
  });

  const meticulousMatchingRoundId = cuid.get();
  const meticulousMatchingRound = await prisma.matchingRound.upsert({
    where: { id: meticulousMatchingRoundId },
    update: {},
    create: {
      id: meticulousMatchingRoundId,
      name: 'Meticulous Matching Round',
      contributions: {
        createMany: {
          data: [
            {
              userId: users[Math.floor(Math.random() * users.length)].id,
              amount: 100,
              denomination: 'USD',
              amountUsd: 100,
              paymentMethodId: paymentMethod.id,
              flagged: false,
            },
            {
              userId: users[Math.floor(Math.random() * users.length)].id,
              amount: 200,
              denomination: 'USD',
              amountUsd: 200,
              paymentMethodId: paymentMethod.id,
              flagged: false,
            },
            {
              userId: users[Math.floor(Math.random() * users.length)].id,
              amount: 300,
              denomination: 'USD',
              amountUsd: 300,
              paymentMethodId: paymentMethod.id,
              flagged: false,
            },
            {
              userId: users[Math.floor(Math.random() * users.length)].id,
              amount: 50,
              denomination: 'USD',
              amountUsd: 50,
              paymentMethodId: paymentMethod.id,
              flagged: false,
            },
            {
              userId: users[Math.floor(Math.random() * users.length)].id,
              amount: 150,
              denomination: 'USD',
              amountUsd: 150,
              paymentMethodId: paymentMethod.id,
              flagged: false,
            },
            {
              userId: users[Math.floor(Math.random() * users.length)].id,
              amount: 200,
              denomination: 'USD',
              amountUsd: 200,
              paymentMethodId: paymentMethod.id,
              flagged: false,
            },
          ],
        },
      },
      grants: {
        connect: [
          {
            id: grantA.id,
          },
          {
            id: grantB.id,
          },
          {
            id: grantC.id,
          },
          {
            id: grantD.id,
          },
        ],
      },
      verified: true,
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 240000),
    },
  });
  console.log({ meticulousMatchingRound });

  console.log(chalk.green('\n[ OK ]  MatchingRound seeded!'));
};
