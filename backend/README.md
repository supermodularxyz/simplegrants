# SimpleGrants Backend 📡 <!-- omit from toc -->

> ⚠️ **Important Note**:
> You have to use Node version >= 17.5! This is because the authentication system uses NextAuth which will require fetch (which is available above v17.5)

## Table of Contents 📒 <!-- omit from toc -->

- [Requirements 📝](#requirements-%F0%9F%93%9D)
- [Installation \& Setup 🧪](#installation--setup-%F0%9F%A7%AA)
  - [Choosing your Payment Provider](#choosing-your-payment-provider)
  - [Setting up environment variables](#setting-up-environment-variables)
- [Running the app 🚀](#running-the-app-%F0%9F%9A%80)
  - [Local Development 👨🏻‍💻](#local-development-%F0%9F%91%A8%F0%9F%8F%BB%E2%80%8D%F0%9F%92%BB)
  - [Production Deployment 🔥](#production-deployment-%F0%9F%94%A5)
- [Test ✅](#test-%E2%9C%85)
  - [Unit Tests](#unit-tests)
  - [Integration Tests](#integration-tests)
  - [End-to-End (E2E) Tests](#end-to-end-e2e-tests)
  - [Test Coverage](#test-coverage)
- [Additional Notes 🧠](#additional-notes-%F0%9F%A7%A0)
  - [Prisma Schema](#prisma-schema)
  - [Creating Admins](#creating-admins)
  - [Payment Providers](#payment-providers)
    - [Stripe](#stripe)

## Requirements 📝

- Docker & `docker compose`
- NodeJS (v17.5+)
- Prisma CLI
- Stripe CLI (if using Stripe)

The backend utilizes Docker for ease of setup & deployment. You should ideally have Docker setup on your machine if you intend to run it locally.

## Installation & Setup 🧪

### Choosing your Payment Provider

At this point in time, only Stripe is accepted as a payment provider. The available payment providers can be found in the [adapter](./src/provider/adapter/) folder in the backend. In the future, more payment providers will be added.
To setup your payment provider, all you need to do is to change the payment provider in [`provider.service.ts`](./src/provider/provider.service.ts#L15) to the provider you want to use.

Then, pass in the required constructor values as below:

```typescript
{
    prisma: PrismaService,
    secret: String, // For Stripe, it would be your secret key
    country: String, // ISO country code. This is needed for calculating the payment provider fees if any
}
```

### Setting up environment variables

```bash
# To setup
$ npm install

# Copy .env over
$ cp .env.example .env
```

**⚠️ Make sure to update the .env file with your values!**

## Running the app 🚀

There are multiple ways of running this application, each with a slightly different method of setting things up.

### Local Development 👨🏻‍💻

If you are running locally for development, there are a few things to take note of:

1. Because of the way Docker networking works, if you need to run commands like `prisma migrate` or `prisma db seed`, you need to change the `DATABASE_CONTAINER` environment variable to `localhost`. Luckily, there is a simple script that helps you with that in `prisma-helper.sh`. Running `npm run migrate:dev` or `npm run setup` should automatically swap the .env variables for you.
2. Depending on how you choose to run this application, you may need to update `FRONTEND_URL` and `NEXTAUTH_URL` accordingly. It is important to note that the `NEXTAUTH_URL` has to be `http://host.docker.internal:3001` and **NOT** `http://localhost:3001` if you are running everything locally with Docker.
3. If you are using Stripe, **remember to configure your webhook**!

```bash
# Development mode
$ npm run docker:dev:up

# Run the seed and migration
$ npm run setup

# Listen for incoming webhooks via Stripe (if you are using Stripe)
$ stripe listen --forward-to localhost:3000/checkout/webhook
```

**⚠️ If you get a connection error 👉 Error: P1001: Can't reach database server at `simplegrants-database`:`5432`, all you need to do is to temporarily change `DATABASE_CONTAINER=localhost` in the .env and rerun the command. Make sure to remember to change it back once you are done!**

### Production Deployment 🔥

If you are deploying this application for production, it is slightly easier to setup, but there are still some things to be aware of:

1. The current `docker-compose.yml` assumes that you may be running a database locally. However, this is most likely not the case and you would be connecting to a database that is deployed separately. To achieve this configuration, remove the `simplegrants-database` entry in the `docker-compose.yml` and change `DATABASE_CONTAINER` in your .env to the database's URL.
2. Your `FRONTEND_URL` and `NEXTAUTH_URL` should point to a registered domain that matches your callback URLs that you configured in your OAuth providers.
3. If you are using Stripe, **remember to configure your webhook**!

```bash
# Production mode
$ npm run docker:up

# Run the seed and migration
$ npm run setup
```

## Test ✅

Testing is an essential part of software development, and this project includes several types of tests to ensure that the application is working as expected.

### Unit Tests

Unit tests are used to test the individual components and functions of the application. These tests are focused on the implementation details of the code and ensure that the code is working as expected.

To run unit tests, use the following command:

```bash
$ npm run test
```

### Integration Tests

Integration tests are used to test how different components and functions of the application work together. These tests ensure that the application is working as expected when all the different parts are put together.

To run integration tests, use the following command:

```bash
$ npm run test:integration
```

### End-to-End (E2E) Tests

E2E tests are used to test the application as a whole, simulating how a user would interact with the application. These tests ensure that the application is working as expected from the user's perspective.

To run e2e tests, use the following command:

```bash
$ npm run test:e2e
```

### Test Coverage

Test coverage is a measure of how much of the code is being tested. It helps to identify areas of the code that are not being tested and need more coverage.

To check test coverage, use the following command:

```bash
$ npm run test:cov
```

## Additional Notes 🧠

### Prisma Schema

The backend utilizes NextAuth, which is dependent on the frontend. To ensure that the Prisma schemas are always in sync (locally), you should run `npm run generate`, which will copy the schema to the frontend folder and run Prisma generate there. **This is only needed for local development.**

### Creating Admins

Because authentication relies on NextAuth, users will only be created when someone has logged in to the platform. Therefore, the best way to create the first admin is to login to the platform for the first time, and manually change the `Role` for the specific user to an `Admin`.
Subsequent admin changes can be done using the API, which is documented in Swagger.

### Payment Providers

#### Stripe

If you are using Stripe, it is **extremely important that you remember to configure your webhook**! If you do not do so, your backend will not detect any successful payments being made by your users.
