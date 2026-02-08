# ================================================================
# TASC LMS Frontend - Build-Only Dockerfile
# ================================================================
# This Dockerfile builds the React/Vite frontend into static files.
# It does NOT run a web server - it only produces the build artifacts.
#
# Build artifacts location: /app/dist
#
# Usage:
# ------
# 1. Build the Docker image:
#    docker build -t tasc-lms-frontend-builder .
#
# 2. Extract build output to your host filesystem:
#    docker create --name temp-builder tasc-lms-frontend-builder
#    docker cp temp-builder:/app/dist ./dist
#    docker rm temp-builder
#
# 3. Serve the static files with any web server:
#    - Nginx: Copy ./dist/* to /var/www/html
#    - Apache: Copy ./dist/* to /var/www/html
#    - Python: python -m http.server --directory ./dist
#    - Node: npx serve ./dist
#
# ================================================================

# Use Node.js LTS (Long Term Support) version
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first (for better layer caching)
COPY package.json package-lock.json ./

# Install dependencies
# --frozen-lockfile ensures exact versions from package-lock.json
RUN npm ci 

# Copy source code
COPY . .

# Build the Vite application
# This runs TypeScript compilation and Vite build
RUN npm run build

# ================================================================
# Build output is now in /app/dist
# ================================================================
# The dist folder contains:
# - index.html
# - assets/ (JS, CSS, images, fonts)
# - All static assets ready for deployment
#
# To extract the build:
#   docker create --name builder tasc-lms-frontend-builder
#   docker cp builder:/app/dist ./dist
#   docker rm builder
# ================================================================

# Optional: Verification stage to ensure build succeeded
FROM scratch AS export
COPY --from=builder /app/dist /dist
