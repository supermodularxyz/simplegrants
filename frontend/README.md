# SimpleGrants Frontend 📱 <!-- omit from toc -->

## Table of Contents 📒 <!-- omit from toc -->

- [Requirements 📝](#requirements-%F0%9F%93%9D)
- [Installation \& Setup 🧪](#installation--setup-%F0%9F%A7%AA)
- [Running the app 🚀](#running-the-app-%F0%9F%9A%80)
- [Additional Notes 🧠](#additional-notes-%F0%9F%A7%A0)
  - [Prisma Schema](#prisma-schema)
- [Deployment 🚀](#deployment-%F0%9F%9A%80)

## Requirements 📝

- NodeJS (v17.5+)
- pnpm
- Prisma CLI

## Installation & Setup 🧪

The frontend utilizes NextAuth for authentication. You should update the [authentication providers](./pages/api/auth/[...nextauth].ts) based on your platform requirements.

```bash
# To setup
$ pnpm install

# Copy .env over
$ cp .env.example .env.local

# If running for production, use .env.production
$ cp .env.example .env.production

```

⚠️ **Make sure to update the .env.local file with your values!**

## Running the app 🚀

> 💡 Before running the frontend, make sure that the backend is already running!

```bash
# development mode
$ pnpm dev -p 3001

# production mode
$ pnpm build && pnpm start
```

## Additional Notes 🧠

### Prisma Schema

The frontend utilizes NextAuth, which shares a schema dependency with the backend. To ensure that the Prisma schemas are always in sync (locally), you should run `npm run generate` in the backend, which will copy the schema here and run Prisma generate. **This is only needed for local development.**

## Deployment 🚀

The easiest way to deploy this app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
