FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache dumb-init

# Set resource limits
ENV NODE_OPTIONS="--max-old-space-size=256"

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy only what's needed
COPY --chown=nodejs:nodejs package*.json ./
RUN npm install --omit=dev && npm cache clean --force

# Install TypeScript runtime tools for running user code
RUN npm install -g typescript ts-node tsx

USER nodejs

CMD ["dumb-init", "node", "--"]
