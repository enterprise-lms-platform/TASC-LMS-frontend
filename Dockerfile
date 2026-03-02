# ================================================================
# TASC LMS Frontend (Vite/React) - Dockerized Runtime Build
# ================================================================
# This Dockerfile:
# 1) Builds the Vite/React frontend into /app/dist
# 2) Serves the static files using Nginx inside the container
#
# Result:
# - Container listens on port 80
# - Host Nginx will reverse proxy to it (127.0.0.1:9010)
# ================================================================

# ------------------------------
# Stage 1: Build (Node)
# ------------------------------
    FROM node:20-alpine AS builder

    WORKDIR /app
    
    # Copy dependency manifests first for better caching
    COPY package.json package-lock.json ./
    
    # Install exact dependencies
    RUN npm ci
    
    # Copy the source code
    COPY . .
    
    # Build production bundle to /app/dist
    RUN npm run build
    
    # ------------------------------
    # Stage 2: Runtime (Nginx)
    # ------------------------------
    FROM nginx:alpine
    
    # Remove default nginx site config
    RUN rm /etc/nginx/conf.d/default.conf
    
    # Copy our SPA nginx config (you must add nginx.conf in repo root)
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    # Copy build output to Nginx web root
    COPY --from=builder /app/dist /usr/share/nginx/html
    
    EXPOSE 80
    
    # Start Nginx in foreground (required for containers)
    CMD ["nginx", "-g", "daemon off;"]