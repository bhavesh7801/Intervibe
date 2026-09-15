# ==========================================
# Stage 1: Build Frontend (Vite + React)
# ==========================================
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency definition files
COPY package.json package-lock.json ./

# Install dependencies cleanly with zero audit/fund overhead
RUN (npm ci --no-audit --no-fund || npm install --no-audit --no-fund) && npm cache clean --force

# Copy source code and build config
COPY . .

# Build production bundle
RUN npm run build

# ==========================================
# Stage 2: Production Nginx Server
# ==========================================
FROM nginx:alpine

# Remove default nginx html files
RUN rm -rf /usr/share/nginx/html/*

# Copy build artifacts from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
