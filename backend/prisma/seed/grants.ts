import {
  randCatchPhrase,
  randCountry,
  randNumber,
  randParagraph,
  randUrl,
  randUserName,
} from '@ngneat/falso';
import * as chalk from 'chalk';
import { Seed } from './types';

export const seedGrants = async (seed: Seed) => {
  const { prisma, cuid, users } = seed;
  const NUMBER_OF_GRANTS = 10;

  console.log(chalk.blue('\nSeeding Grants...'));
  const emptyGrantId = cuid.get();
  const emptyGrant = await prisma.grant.upsert({
    where: { id: emptyGrantId },
    update: {},
    create: {
      id: emptyGrantId,
      name: randCatchPhrase(),
      description: randParagraph({ length: 3 }).join(' '),
      image: `https://picsum.photos/seed/${emptyGrantId}/1000/600.jpg`,
      twitter: randUserName(),
      website: randUrl(),
      location: randCountry(),
      paymentAccount: {
        connectOrCreate: {
          create: {
            recipientAddress: 'acct_1MYrcZPueme0IGVy',
            provider: {
              connect: {
                id: seed.paymentProvider.id,
              },
            },
          },
          where: {
            recipientAddress_providerId: {
              recipientAddress: 'acct_1MYrcZPueme0IGVy',
              providerId: seed.paymentProvider.id,
            },
          },
        },
      },
      team: {
        connect: {
          id: seed.admin.id,
        },
      },
      fundingGoal: randNumber({ min: 1000, max: 50000 }),
      verified: true,
    },
  });

  const contributedGrantId = cuid.get();
  const contributedGrant = await prisma.grant.upsert({
    where: { id: contributedGrantId },
    update: {},
    create: {
      id: contributedGrantId,
      name: randCatchPhrase(),
      description: randParagraph({ length: 3 }).join(' '),
      image: `https://picsum.photos/seed/${contributedGrantId}/1000/600.jpg`,
      twitter: randUserName(),
      website: randUrl(),
      location: randCountry(),
      paymentAccount: {
        connectOrCreate: {
          create: {
            recipientAddress: 'acct_1MdDqePwtixIFqie',
            provider: {
              connect: {
                id: seed.paymentProvider.id,
              },
            },
          },
          where: {
            recipientAddress_providerId: {
              recipientAddress: 'acct_1MdDqePwtixIFqie',
              providerId: seed.paymentProvider.id,
            },
          },
        },
      },
      team: {
        connect: [
          {
            id: seed.users[0].id,
          },
          {
            id: seed.admin.id,
          },
        ],
      },
      contributions: {
        createMany: {
          data: [
            {
              userId: seed.users[0].id,
              amount: 3500,
              denomination: 'USD',
              amountUsd: 3500,
              paymentMethodId: seed.paymentMethod.id,
              flagged: false,
            },
          ],
        },
      },
      fundingGoal: randNumber({ min: 1000, max: 50000 }),
      verified: true,
    },
  });

  const fundedGrantId = cuid.get();
  const fundedGrant = await prisma.grant.upsert({
    where: { id: fundedGrantId },
    update: {},
    create: {
      id: fundedGrantId,
      name: randCatchPhrase(),
      description: randParagraph({ length: 2 }).join(' '),
      image: `https://picsum.photos/seed/${fundedGrantId}/1000/600.jpg`,
      twitter: randUserName(),
      website: randUrl(),
      location: randCountry(),
      paymentAccount: {
        connectOrCreate: {
          create: {
            recipientAddress: 'acct_1MdDqePwtixIFqie',
            provider: {
              connect: {
                id: seed.paymentProvider.id,
              },
            },
          },
          where: {
            recipientAddress_providerId: {
              recipientAddress: 'acct_1MdDqePwtixIFqie',
              providerId: seed.paymentProvider.id,
            },
          },
        },
      },
      team: {
        connect: [
          {
            id: seed.users[0].id,
          },
          {
            id: seed.admin.id,
          },
        ],
      },
      contributions: {
        createMany: {
          data: Array.from(Array(10).keys()).map((_) => {
            const amount = randNumber({ min: 5000, max: 10000 });
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

  const fundedGrant2Id = cuid.get();
  const fundedGrant2 = await prisma.grant.upsert({
    where: { id: fundedGrant2Id },
    update: {},
    create: {
      id: fundedGrant2Id,
      name: randCatchPhrase(),
      description: randParagraph({ length: 2 }).join(' '),
      image: `https://picsum.photos/seed/${fundedGrant2Id}/1000/600.jpg`,
      twitter: randUserName(),
      website: randUrl(),
      location: randCountry(),
      paymentAccount: {
        connectOrCreate: {
          create: {
            recipientAddress: 'acct_1MdDqePwtixIFqie',
            provider: {
              connect: {
                id: seed.paymentProvider.id,
              },
            },
          },
          where: {
            recipientAddress_providerId: {
              recipientAddress: 'acct_1MdDqePwtixIFqie',
              providerId: seed.paymentProvider.id,
            },
          },
        },
      },
      team: {
        connect: [
          {
            id: seed.users[0].id,
          },
          {
            id: seed.admin.id,
          },
        ],
      },
      contributions: {
        createMany: {
          data: Array.from(Array(20).keys()).map((_) => {
            const amount = randNumber({ min: 2000, max: 5000 });
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

  const unverifiedGrantId = cuid.get();
  const unverifiedGrant = await prisma.grant.upsert({
    where: { id: unverifiedGrantId },
    update: {},
    create: {
      id: unverifiedGrantId,
      name: randCatchPhrase(),
      description: randParagraph({ length: 3 }).join(' '),
      image: `https://picsum.photos/seed/${unverifiedGrantId}/1000/600.jpg`,
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
      fundingGoal: randNumber({ min: 1000, max: 50000 }),
      verified: false,
    },
  });

  for (let i = 0; i < NUMBER_OF_GRANTS; i++) {
    const grantId = cuid.get();
    const grant = await prisma.grant.upsert({
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
            data: Array.from(Array(20).keys()).map((_) => {
              const amount = randNumber({ min: 2000, max: 5000 });
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
    seed.grants.push(grant);
  }

  console.log(chalk.green('\n[ OK ] Grants seeded!'));
};
