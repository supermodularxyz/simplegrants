import {
  randUser,
  randUuid,
  randQuote,
  randCountry,
  randImg,
  randText,
  randUrl,
  randUserName,
} from '@ngneat/falso';
import { Role } from '@prisma/client';
import * as cuid from 'cuid';
import { ExtendedGrant } from 'src/grants/grants.interface';
import { UserProfile } from 'src/users/users.interface';

// Creating a mock result
const users: UserProfile[] = [...Array(3)].map((_, index) => {
  const userData = randUser();

  return {
    id: cuid(),
    name: `${userData.firstName} ${userData.lastName}`,
    email: userData.email,
    emailVerified: null,
    visitorId: randUuid(),
    role: index % 2 === 0 ? Role.User : Role.Admin, // Every odd user is an admin
    flagged: false,
    image: userData.img,
    bio: randQuote(),
    twitter: userData.username,
    contributions: [
      {
        id: cuid(),
        userId: cuid(),
        grantId: cuid(),
        matchingRoundId: null,
        amount: 1000,
        denomination: 'USD',
        amountUsd: 1000,
        paymentMethodId: cuid(),
        flagged: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    grants: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
});

const grants: ExtendedGrant[] = [
  {
    id: cuid(),
    name: 'test one',
    description: randText(),
    image: randImg(),
    twitter: randUserName(),
    website: randUrl(),
    location: randCountry(),
    paymentAccountId: randUuid(),
    fundingGoal: 100,
    contributions: [
      {
        id: randUuid(),
        userId: randUuid(),
        amount: 100,
        denomination: 'USD',
        amountUsd: 100,
        grantId: 'cld1dnt1y000008m97yakhtrf',
        matchingRoundId: null,
        paymentMethodId: randUuid(),
        flagged: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    team: [users[0]],
    verified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: cuid(),
    name: 'test two',
    description: randText(),
    image: randImg(),
    twitter: randUserName(),
    website: randUrl(),
    location: randCountry(),
    paymentAccountId: randUuid(),
    fundingGoal: 100,
    contributions: [
      {
        id: randUuid(),
        userId: randUuid(),
        amount: 50,
        denomination: 'USD',
        amountUsd: 50,
        grantId: cuid(),
        matchingRoundId: null,
        paymentMethodId: randUuid(),
        flagged: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    team: [users[1]],
    verified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: cuid(),
    name: 'test three',
    description: randText(),
    image: randImg(),
    twitter: randUserName(),
    website: randUrl(),
    location: randCountry(),
    paymentAccountId: randUuid(),
    fundingGoal: 100,
    contributions: [],
    team: [users[2]],
    verified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const checkoutItems = {
  grants: [
    {
      id: 'cld2ilh7t000008l3g1qe3nla',
      amount: 100,
    },
    {
      id: 'cld1dnt1y000008m97yakhtrf',
      amount: 200,
    },
  ],
};

const checkoutInfo = {
  donated: 300,
  matched: 0,
  numberOfGrants: 2,
};

const checkoutPaymentSession = { url: 'checkoutlink' };

const prismaService = {
  user: {
    findUnique: jest.fn().mockResolvedValue(users[0]),
    update: jest.fn().mockResolvedValue(users[0]),
  },
  grant: {
    findMany: jest.fn().mockResolvedValue(grants),
    findUnique: jest.fn().mockResolvedValue(grants[0]),
    create: jest.fn().mockResolvedValue(grants[0]),
    update: jest.fn().mockResolvedValue(grants[0]),
  },
};

const providerService = {
  getProvider: jest.fn().mockResolvedValue({
    id: cuid(),
  }),
  createPaymentSession: jest.fn().mockResolvedValue(checkoutPaymentSession),
  handlePaymentWebhook: jest.fn().mockResolvedValue(undefined),
  retrieveCheckoutInfo: jest.fn().mockResolvedValue(checkoutInfo),
};

const usersService = {
  retrieveUserProfile: jest.fn().mockResolvedValue(users[0]),
  updateUserProfile: jest.fn().mockResolvedValue(users[0]),
};

const authService = {
  grantAdminPrivilege: jest.fn().mockResolvedValue(users[0]),
  revokeAdminPrivilege: jest.fn().mockResolvedValue(users[0]),
};

const grantsService = {
  getAllGrants: jest.fn().mockResolvedValue(grants),
  createGrant: jest.fn().mockResolvedValue(grants[0]),
  reviewGrant: jest.fn().mockResolvedValue(grants[0]),
  getGrant: jest.fn().mockResolvedValue(grants[0]),
  updateGrant: jest.fn().mockResolvedValue(grants[0]),
  resubmitGrant: jest.fn().mockResolvedValue(grants[0]),
  checkoutGrants: jest.fn().mockResolvedValue(checkoutPaymentSession),
};

export {
  users,
  grants,
  checkoutItems,
  checkoutInfo,
  checkoutPaymentSession,
  prismaService,
  providerService,
  usersService,
  authService,
  grantsService,
};
