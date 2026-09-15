# ==========================================
# Lightweight Nginx Frontend
# Copies pre-built dist/ from git repo
# Build happens locally, NOT on EC2
# ==========================================
FROM nginx:alpine

# Remove default nginx static html files
RUN rm -rf /usr/share/nginx/html/*

# Copy pre-compiled production build bundle from git repo
COPY dist /usr/share/nginx/html

# Copy custom nginx configuration (SPA routing, API proxying & gzip)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]

