### Multi-stage Dockerfile for Next.js frontend
FROM node:18-bullseye-slim AS builder
WORKDIR /app

# install deps
COPY package.json package-lock.json ./
RUN npm ci

# copy source and build
COPY . .
RUN npm run build


FROM node:18-bullseye-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy only production files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

EXPOSE 3000
CMD ["npm", "start"]
