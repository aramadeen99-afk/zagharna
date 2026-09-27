# ---------- Base ----------
FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

# ---------- Dependencies ----------
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm install

# ---------- Build ----------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# ---------- Production runner ----------
FROM base AS runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs
EXPOSE 3000
ENV PORT=3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
