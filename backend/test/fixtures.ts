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
import { Contribution, Grant, Role, User } from '@prisma/client';
import * as cuid from 'cuid';
import { PaymentAccount } from 'src/payment-accounts/payment-accounts.interface';
import { UserProfile } from 'src/users/users.interface';

// Creating a mock result
// TODO: Change & fix types
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
        grant: {
          id: cuid(),
          name: 'test one',
          description: randText(),
          image: randImg(),
          twitter: randUserName(),
          website: randUrl(),
          location: randCountry(),
          paymentAccountId: randUuid(),
          fundingGoal: 100,
          contributions: [],
          team: [],
          verified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
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
    totalDonated: 1000,
    totalRaised: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
});

const grants: (Grant & {
  team: User[];
  contributions: Contribution[];
  paymentAccount: PaymentAccount;
})[] = [
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
    paymentAccount: {
      id: 'clg4zguri0002s5nnydvf9ido',
      recipientAddress: 'acct_1MdDqePwtixIFqie',
      providerId: 'clg4zguri0002s5nnydvf9ido',
      provider: {
        id: 'clg4zguri0002s5nnydvf9ido',
        name: 'Stripe',
        type: 'CARD',
        acceptedCountries: ['US', 'MY'],
        denominations: ['USD'],
        website: '',
        schema: {},
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
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
    paymentAccount: {
      id: 'clg4zguri0002s5nnydvf9ido',
      recipientAddress: 'acct_1MdDqePwtixIFqie',
      providerId: 'clg4zguri0002s5nnydvf9ido',
      provider: {
        id: 'clg4zguri0002s5nnydvf9ido',
        name: 'Stripe',
        type: 'CARD',
        acceptedCountries: ['US', 'MY'],
        denominations: ['USD'],
        website: '',
        schema: {},
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
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
    paymentAccount: {
      id: 'clg4zguri0002s5nnydvf9ido',
      recipientAddress: 'acct_1MdDqePwtixIFqie',
      providerId: 'clg4zguri0002s5nnydvf9ido',
      provider: {
        id: 'clg4zguri0002s5nnydvf9ido',
        name: 'Stripe',
        type: 'CARD',
        acceptedCountries: ['US', 'MY'],
        denominations: ['USD'],
        website: '',
        schema: {},
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    verified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const ecosystemBuilder = {
  id: 'id',
  userId: 'userId',
  matchingRounds: [],
  inviteCodesId: 'inviteCodeId',
  createdAt: new Date(),
  updatedAt: new Date(),
};

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
  numberOfItems: 2,
};

const checkoutPaymentSession = { url: 'checkoutlink' };

const claimedCode = {
  code: 'clfsbx7bb0000pd0kjloobn8a',
  claimed: true,
};

const inviteCode = {
  id: 'clfsbx7bb0000pd0kjloobn8a',
  code: 'clfsbx7bb0000pd0kjloobn8a',
  claimed: false,
  claimedById: undefined,
  claimedBy: undefined,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const claimedInviteCode = {
  id: 'clfsbx7bb0000pd0kjloobn8a',
  code: 'clfsbx7bb0000pd0kjloobn8a',
  claimed: true,
  claimedById: undefined,
  claimedBy: undefined,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const matchingRound = {
  id: 'clg3bs7400017x6s5e7t96pzk',
  name: 'Matching Round',
  verified: true,
  startDate: new Date(),
  endDate: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

const uploadedFileUrl = 'https://bucket.s3.us-1.amazonaws.com/file';

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
  ecosystemBuilder: {
    findUnique: jest.fn().mockResolvedValue(ecosystemBuilder),
  },
  inviteCodes: {
    findUnique: jest.fn().mockResolvedValue(inviteCode),
    update: jest.fn().mockResolvedValue(claimedInviteCode),
  },
  matchingRound: {
    findFirst: jest.fn().mockResolvedValue(matchingRound),
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

const invitesService = {
  claimInviteCode: jest.fn().mockResolvedValue(claimedCode),
};

const qfService = {
  getActiveMatchingRoundByGrant: jest.fn().mockResolvedValue(matchingRound),
  // estimateMatchedAmount: jest.fn().mockResolvedValue(), // TODO
  // calculateQuadraticFundingAmount: jest.fn().mockResolvedValue(), // TODO
  // distributeMatchedFunds: jest.fn().mockResolvedValue(null), // TODO
};

const awsService = {
  uploadFile: jest.fn().mockResolvedValue(uploadedFileUrl),
};

export {
  users,
  grants,
  checkoutItems,
  checkoutInfo,
  checkoutPaymentSession,
  claimedCode,
  ecosystemBuilder,
  inviteCode,
  claimedInviteCode,
  matchingRound,
  uploadedFileUrl,
  prismaService,
  providerService,
  usersService,
  authService,
  grantsService,
  invitesService,
  qfService,
  awsService,
};
