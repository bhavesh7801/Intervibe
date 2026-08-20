# ==========================================
# React + Vite Frontend Multi-Stage Dockerfile
# ==========================================

# Stage 1: Build static assets using Node.js
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package descriptors first for layer caching
COPY package*.json ./

# Install npm dependencies cleanly with no audit and cleaned cache
RUN npm ci --legacy-peer-deps --no-audit && npm cache clean --force

# Copy application source code
COPY . .

# Build arguments for Vite compilation
ARG VITE_GOOGLE_CLIENT_ID=658426092732-l6odo2d5esndtljmu4brsvu31f3lp9kk.apps.googleusercontent.com
ARG VITE_BACKEND_URL=""
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# Build production bundle using Vite with memory optimization
ENV NODE_OPTIONS="--max-old-space-size=1024"
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
