# Dockerfile for Checkmate MCP Server
# Multi-stage build for optimized production image

# Stage 1: Build
FROM node:20.17.0-alpine AS builder

# Install yarn
RUN corepack enable && corepack prepare yarn@1.22.19 --activate

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install all dependencies (including dev for build)
RUN yarn install --frozen-lockfile && \
    yarn cache clean

# Copy source code
COPY src ./src
COPY tsconfig.json ./

# Build the application
RUN yarn build

# Stage 2: Production
FROM node:20.17.0-alpine

# Install yarn
RUN corepack enable && corepack prepare yarn@1.22.19 --activate

# Add labels for better container management
LABEL maintainer="Dream Horizon"
LABEL description="Checkmate MCP Server - Model Context Protocol server for Checkmate API"
LABEL version="1.0.0"

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install only production dependencies
RUN yarn install --frozen-lockfile --production && \
    yarn cache clean

# Copy built application from builder stage
COPY --from=builder /app/build ./build

# Create non-root user for security
RUN addgroup -g 1001 -S mcpuser && \
    adduser -S -u 1001 -G mcpuser mcpuser && \
    chown -R mcpuser:mcpuser /app

# Switch to non-root user
USER mcpuser

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD node -e "process.exit(0)"

# Set environment variables
ENV NODE_ENV=production

# The MCP server uses stdio transport, so no port needs to be exposed
# It will be accessed via the main app

# Start the MCP server
CMD ["node", "build/index.js"]

