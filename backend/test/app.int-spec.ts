import { prisma } from '../prisma';
import { Role, User } from '@prisma/client';
import { randUser, randQuote } from '@ngneat/falso';
import * as cuid from 'cuid';
import { getSession } from 'next-auth/react';

/**
 * The main points to test for the integration testing are:
 * 1. Backend can connect to DB through Prisma
 *  - This is verified by the Jest mock, which connects and
 *    disconnects the DB before each test utilizing Prisma
 * 2. CRUD functions work
 * 3. Backend can connect to frontend for NextAuth
 *  - We do not necessarily need to test for sessions,
 *    since that will be tested in the e2e tests.
 */
describe('SimpleGrants (Integration Testing)', () => {
  // let app: INestApplication;

  // beforeEach(async () => {
  //   const moduleFixture: TestingModule = await Test.createTestingModule({
  //     imports: [AppModule],
  //   }).compile();

  //   app = moduleFixture.createNestApplication();
  //   await app.init();
  // });

  describe('CRUD Operations', () => {
    let user: User;

    beforeEach(async () => {
      const userData = randUser();
      user = await prisma.user.create({
        data: {
          id: cuid(),
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          image: userData.img,
          bio: randQuote(),
          twitter: userData.username,
        },
      });
    });

    it('should retrieve the user', async () => {
      const result = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
      });

      expect(result).toEqual(user);
    });

    it('should update the user', async () => {
      const result = await prisma.user.update({
        data: {
          role: Role.Admin,
        },
        where: {
          id: user.id,
        },
      });

      expect(result).toEqual({
        ...user,
        role: Role.Admin, // The point is to ensure that this property is updated
        updatedAt: result.updatedAt, // Doing it this way because prisma automatically changes the updatedAt property
      });
    });

    it('should delete the user', async () => {
      await prisma.user.delete({
        where: {
          id: user.id,
        },
      });

      const result = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
      });

      expect(result).toBe(null);
    });
  });

  describe('NextAuth Integration', () => {
    it('should set NEXTAUTH_URL env', () => {
      expect(process.env.NEXTAUTH_URL).toBeDefined();
    });

    it('can fetch the frontend', async () => {
      await expect(
        fetch(`${process.env.NEXTAUTH_URL}/api/auth/session`),
      ).resolves.not.toThrowError();
    });

    it('should be able to make a request to the frontend to check for the session', async () => {
      const req: any = {
        headers: {
          cookie: 'next-auth.session-token=invalid session',
        },
      };

      await expect(getSession({ req })).not.toThrowError();
      const session = await getSession({ req });
      expect(session).toBe(null);
    });
  });
});
