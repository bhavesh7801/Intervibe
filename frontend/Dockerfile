# ==========================================
# Production Nginx Server (Ultra-lightweight)
# Direct pre-compiled build injection (Zero npm install on EC2)
# ==========================================
FROM nginx:alpine

# Remove default nginx static html files
RUN rm -rf /usr/share/nginx/html/*

# Copy pre-compiled production build bundle directly
COPY dist /usr/share/nginx/html

# Copy custom nginx configuration (SPA routing & gzip)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
