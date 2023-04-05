import { randUser, randQuote, randUuid } from '@ngneat/falso';
import * as chalk from 'chalk';
import { Seed } from './types';
import { Role } from '@prisma/client';

export const seedUsers = async (seed: Seed) => {
  const { prisma, cuid } = seed;
  const NUMBER_OF_USERS = 10;

  console.log(chalk.blue('\nSeeding Users...'));
  for (let i = 0; i < NUMBER_OF_USERS; i++) {
    const userData = randUser();
    const userId = cuid.get();
    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        image: userData.img,
        bio: randQuote(),
        twitter: userData.username,
      },
    });

    const paymentMethodId = cuid.get();
    const paymentMethod = await prisma.paymentMethod.upsert({
      where: { id: paymentMethodId },
      update: {},
      create: {
        id: paymentMethodId,
        user: {
          connect: {
            id: user.id,
          },
        },
        uniqueId: randUuid(),
        denomination: 'USD',
        provider: {
          connect: {
            id: seed.paymentProvider.id,
          },
        },
        metadata: {},
      },
    });

    seed.users.push(user);
    seed.paymentMethod = paymentMethod;
  }

  /**
   * Create admin strictly for testing
   * This account can never be logged in due to the way NextAuth works.
   */
  const adminData = randUser();
  const adminId = cuid.get();
  const admin = await prisma.user.upsert({
    where: { id: adminId },
    update: {},
    create: {
      id: adminId,
      name: `${adminData.firstName} ${adminData.lastName}`,
      email: adminData.email,
      image: adminData.img,
      bio: randQuote(),
      twitter: adminData.username,
      role: Role.Admin,
    },
  });
  seed.admin = admin;
  console.log(chalk.green('\n[ OK ] Users seeded!'));
};
