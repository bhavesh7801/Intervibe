# ==========================================
# React + Vite Frontend Multi-Stage Dockerfile
# ==========================================

# Stage 1: Build static assets using Node.js
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package descriptors first for layer caching
COPY package*.json ./

# Install npm dependencies cleanly
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Copy application source code
COPY . .

# Build production bundle using Vite
RUN npm run build

# Stage 2: Serve static production assets with Nginx
FROM nginx:alpine AS production

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy Nginx SPA routing configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Healthcheck endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
