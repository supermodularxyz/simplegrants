FROM node:18-slim AS builder

# For compatibility with M1 Macs
RUN apt-get update && \
    apt-get install -y procps && \
    apt-get install -y openssl && \
    apt-get install -y libc6

# Create app directory
WORKDIR /app

# npm install files
COPY package*.json pnpm-lock.yaml ./
COPY prisma ./app/prisma/

# Install app dependencies
RUN npm install --production --legacy-peer-deps

COPY . .

RUN npx prisma generate
RUN npm run build

FROM node:18-slim

RUN apt-get update && \
    apt-get install -y procps && \
    apt-get install -y openssl && \
    apt-get install -y libc6

ENV NODE_ENV production

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

ARG FRONTEND_PORT

CMD npm run start -- -p $FRONTEND_PORT