# --- Stage 1: Build Dependencies ---
FROM node:20-alpine AS builder
WORKDIR /app
# Copy package files first to leverage Docker cache
COPY package*.json ./
# Install production dependencies only
RUN npm ci --only=production

# --- Stage 2: Production Image ---
FROM node:20-alpine
WORKDIR /app

# Security: Create a non-root user and group
RUN addgroup -S nodeapp && adduser -S appuser -G nodeapp

# Copy production node_modules from builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy application code
COPY . .

# Change ownership to the non-root user
RUN chown -R rod:rod /app

# Switch to non-root user
USER rod

# Expose the port your Express app runs on (assuming 3000 based on previous context)
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]