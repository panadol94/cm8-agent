FROM node:22-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat vips-dev
WORKDIR /app
COPY package.json ./
RUN npm install

FROM base AS builder
WORKDIR /app

ARG DATABASE_URL
ARG PAYLOAD_SECRET
ARG NEXT_PUBLIC_SITE_URL

ENV DATABASE_URL=${DATABASE_URL}
ENV PAYLOAD_SECRET=${PAYLOAD_SECRET}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NODE_OPTIONS=--no-deprecation

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY next.config.mjs ./
COPY next-sitemap.config.js ./
COPY tsconfig.json ./
COPY src ./src
COPY public ./public
COPY init-db.mjs ./init-db.mjs

RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NODE_OPTIONS=--no-deprecation

RUN apk add --no-cache libc6-compat vips-dev
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/init-db.mjs ./init-db.mjs

RUN mkdir -p /app/media && chown nextjs:nodejs /app/media

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["sh", "-c", "node init-db.mjs && node node_modules/.bin/next start"]
