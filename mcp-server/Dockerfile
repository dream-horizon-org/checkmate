# Dockerfile for Checkmate MCP Server
# Multi-stage build for optimized production image

# Stage 1: Build
FROM node:20.17.0-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy source code
COPY src ./src
COPY tsconfig.json ./

# Install dev dependencies for build
RUN npm install --save-dev typescript && \
    npm run build

# Stage 2: Production
FROM node:20.17.0-alpine

# Add labels for better container management
LABEL maintainer="DreamSportsLabs"
LABEL description="Checkmate MCP Server - Model Context Protocol server for Checkmate API"
LABEL version="1.0.0"

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && \
    npm cache clean --force

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

