# SimpleGrants Backend 📡

> ⚠️ **Important Note**:
> You have to use Node version >= 17.5! This is because the authentication system uses NextAuth which will require fetch (which is available above v17.5)

## Description 📝

The backend utilizes Docker for ease of setup & deployment. You should ideally have Docker setup on your machine if you intend to run it locally.

## Installation 🧪

```bash
$ npm install
```

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
