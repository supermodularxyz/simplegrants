# SimpleGrants Backend 📡

> ⚠️ **Important Note**:
> You have to use Node version >= 17.5! This is because the authentication system uses NextAuth which will require fetch (which is available above v17.5)

## Requirements 📝

- Docker & `docker compose`
- NodeJS (v17.5+)

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

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Additional Notes 🧠

### Prisma Schema

The backend utilizes NextAuth, which is dependent on the frontend. To ensure that the Prisma schemas are always in sync (locally), you should run `npm run generate`, which will copy the schema to the frontend folder and run Prisma generate there. **This is only needed for local development.**

### Creating Admins

Because authentication relies on NextAuth, users will only be created when someone has logged in to the platform. Therefore, the best way to create the first admin is to login to the platform for the first time, and manually change the `Role` for the specific user to an `Admin`.
Subsequent admin changes can be done using the API, which is documented in Swagger.
