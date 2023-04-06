import * as chalk from 'chalk';
import { Seed } from './types';
import * as cuid from 'cuid';

export const seedInviteCodes = async (seed: Seed) => {
  const { prisma } = seed;

  console.log(chalk.blue('\nSeeding InviteCodes...'));
  await prisma.inviteCodes.createMany({
    data: [
      ...Array.from(Array(10).keys()).map((_) => {
        return {
          code: cuid(),
        };
      }),
    ],
    skipDuplicates: true,
  });
  console.log(chalk.green('\n[ OK ]  InviteCodes seeded!'));
};
