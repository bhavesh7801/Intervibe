# ==========================================
# Multi-Stage Frontend Dockerfile
# Stage 1: Build React/Vite Application
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies with caching
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build arguments for environment variables
ARG VITE_API_BASE_URL=""
ARG VITE_GOOGLE_CLIENT_ID="658426092732-l6odo2d5esndtljmu4brsvu31f3lp9kk.apps.googleusercontent.com"

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

# Build static production assets
RUN npm run build

# ==========================================
# Stage 2: Serve with Nginx Alpine
# ==========================================
FROM nginx:alpine

# Remove default nginx static html files
RUN rm -rf /usr/share/nginx/html/*

# Copy pre-compiled production build bundle from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration (SPA routing, API proxying & gzip)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Healthcheck for container orchestration
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
