# NextGenRail Web Dockerfile
# Multi-stage build for optimized production image

# Stage 1: Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production --silent

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production stage with nginx
FROM nginx:alpine AS production

# Install curl for health checks
RUN apk add --no-cache curl

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy PWA service worker and manifest
COPY --from=builder /app/dist/sw.js /usr/share/nginx/html/sw.js 2>/dev/null || :
COPY --from=builder /app/dist/manifest.json /usr/share/nginx/html/manifest.json 2>/dev/null || :

# Create nginx cache directories
RUN mkdir -p /var/cache/nginx/client_temp /var/cache/nginx/proxy_temp \
    /var/cache/nginx/fastcgi_temp /var/cache/nginx/uwsgi_temp \
    /var/cache/nginx/scgi_temp

# Set proper permissions
RUN chown -R nginx:nginx /var/cache/nginx /usr/share/nginx/html \
    && chmod -R 755 /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:80/ || exit 1

# Switch to nginx user
USER nginx

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

# Labels for better container management
LABEL maintainer="NextGenRail Team <support@nextgenrail.com>"
LABEL version="1.0.0"
LABEL description="NextGenRail Web - Production-grade IRCTC clone frontend"