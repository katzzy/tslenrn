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

# Install minimal execution tools: compile TS with esbuild, run JS with node
RUN npm install -g esbuild

USER nodejs

CMD ["dumb-init", "node", "--"]
