# SimpleGrants Frontend 📱 <!-- omit from toc -->

## Table of Contents 📒 <!-- omit from toc -->

- [Requirements 📝](#requirements-%F0%9F%93%9D)
- [Installation \& Setup 🧪](#installation--setup-%F0%9F%A7%AA)
- [Running the app 🚀](#running-the-app-%F0%9F%9A%80)
  - [Local Development 👨🏻‍💻](#local-development-%F0%9F%91%A8%F0%9F%8F%BB%E2%80%8D%F0%9F%92%BB)
  - [Production Deployment 🔥](#production-deployment-%F0%9F%94%A5)
- [Additional Notes 🧠](#additional-notes-%F0%9F%A7%A0)
  - [Prisma Schema](#prisma-schema)
- [Deployment 🚀](#deployment-%F0%9F%9A%80)

## Requirements 📝

- NodeJS (v17.5+)
- yarn
- Prisma CLI

## Installation & Setup 🧪

The frontend utilizes NextAuth for authentication. You should update the [authentication providers](./pages/api/auth/[...nextauth].ts) based on your platform requirements.

```bash
# To setup
$ yarn install

# Copy .env over
$ cp .env.example .env.local

# If running for production, use .env.production
$ cp .env.example .env.production

```

⚠️ **Make sure to update the .env.local file with your values!**

## Running the app 🚀

> 💡 Before running the frontend, make sure that the backend is already running!

### Local Development 👨🏻‍💻

You should not need to run these commands. See [this section](../README.md#deployment-configuration-%F0%9F%9A%80) for more info.
If you are running locally for development, there are a few things to take note of:

1. Make sure that your Prisma schema is **always in sync** with the backend. To do this, run `npm run generate`.
2. Run the command below to get it started

```bash
# Development mode
$ yarn dev -p 3001
```

### Production Deployment 🔥

You should not need to run these commands. See [this section](../README.md#deployment-configuration-%F0%9F%9A%80) for more info.
If you are deploying this application for production, it is slightly easier to setup, but there are still some things to be aware of:

1. Make sure you have a `.env.production` setup as it will be used by the `docker-compose.yml` file.
2. Your `next.config.js` should include the domains & hostnames of where your image files are hosted.

```bash
# Production mode
$ yarn build && yarn start
```

## Additional Notes 🧠

### Prisma Schema

The frontend utilizes NextAuth, which shares a schema dependency with the backend. To ensure that the Prisma schemas are always in sync (locally), you should run `npm run generate` in the backend, which will copy the schema here and run Prisma generate. **This is only needed for local development. Make sure to commit this to ensure the production setup uses the up to date schema.**

## Deployment 🚀

The easiest way to deploy this app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details. However, there is a lot more setup that you will need to do to ensure it works with your backend.
