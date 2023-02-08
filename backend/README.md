# SimpleGrants Backend 📡

> ⚠️ **Important Note**:
> You have to use Node version >= 17.5! This is because the authentication system uses NextAuth which will require fetch (which is available above v17.5)

## Requirements 📝

- Docker & `docker compose`
- NodeJS (v17.5+)
- Prisma CLI

The backend utilizes Docker for ease of setup & deployment. You should ideally have Docker setup on your machine if you intend to run it locally.

## Installation & Setup 🧪

```bash
# To setup
$ npm install

# Copy .env over
$ cp .env.example .env

```

⚠️ **Make sure to update the .env file with your values!**

## Running the app 🚀

```bash
# development mode
$ npm run docker:dev:up

# production mode
$ npm run docker:up
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
