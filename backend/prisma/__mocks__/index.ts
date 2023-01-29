import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { join } from 'path';
import { URL } from 'url';
import * as cuid from 'cuid';

/**
 * Generates a URL to push the schema to, so it doesn't affect our database
 * @param schema
 * @returns
 */
const generateDatabaseURL = (schema: string) => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable required');
  }
  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.append('schema', schema);
  return url.toString();
};

/**
 * A breakdown of what's happening:
 * 1. Before each test, it generates a random test schemaID. e.g. `test-cuid123123`
 * 2. The `prisma db push` command will push the Prisma schema into the DB with the random name as the PostgresQL schema name
 * 3. Tests will be run
 * 4. After each test, PostgresQL schema is dropped & prisma client is disconnected
 */
const schemaId = `test-${cuid()}`;
const prismaBinary = join(
  __dirname,
  '..',
  '..',
  'node_modules',
  '.bin',
  'prisma',
);

const url = generateDatabaseURL(schemaId);
process.env.DATABASE_URL = url;
export const prisma = new PrismaClient({
  datasources: { db: { url } },
});

beforeEach(() => {
  execSync(`\"${prismaBinary}\" db push`, {
    env: {
      ...process.env,
      DATABASE_URL: generateDatabaseURL(schemaId),
    },
  });
});

/**
 * Step 4:
 * Drop schema & disconnect prisma
 */
afterEach(async () => {
  await prisma.$executeRawUnsafe(
    `DROP SCHEMA IF EXISTS "${schemaId}" CASCADE;`,
  );
  await prisma.$disconnect();
});
