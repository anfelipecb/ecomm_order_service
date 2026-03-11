# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files first (better layer caching)
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy source
COPY . .

# Production stage
FROM node:24-alpine

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Copy from builder
COPY --from=builder --chown=nodejs:nodejs /app .

USER nodejs

EXPOSE 3002

ENV NODE_ENV=production
ENV PORT=3002

CMD ["node", "src/index.js"]
