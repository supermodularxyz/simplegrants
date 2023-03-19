FROM node:18-slim AS base

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apt-get update && \
    apt-get install -y procps && \
    apt-get install -y openssl && \
    apt-get install -y libc6

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN npm shrinkwrap
RUN mv npm-shrinkwrap.json package-lock.json
RUN npm install --legacy-peer-deps

COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npx prisma generate
RUN yarn build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001

ENV PORT 3001

CMD ["yarn", "start"]