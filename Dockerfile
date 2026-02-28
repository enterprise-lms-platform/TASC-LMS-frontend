# ================================================================
# TASC LMS Frontend (Vite/React) - Docker Build + Optional Export
# ================================================================
# What this Dockerfile does:
# --------------------------
# ✅ Builds the Vite/React frontend into production-ready static files.
# ✅ Output artifacts live in: /app/dist (inside the build stage)
#
# By default, this file is "build-first" (CI/CD friendly).
# You can either:
#   1) Extract /app/dist to the host, OR
#   2) Use the exported /dist stage, OR
#   3) Extend later to serve with Nginx (runtime stage)
#
# Build artifacts location:
# -------------------------
#   /app/dist
#
# Typical usage (build-only):
# ---------------------------
# 1) Build image:
#    docker build -t tasc-frontend-builder .
#
# 2) Extract dist to host:
#    docker create --name tasc-fe-temp tasc-frontend-builder
#    docker cp tasc-fe-temp:/app/dist ./dist
#    docker rm tasc-fe-temp
#
# Notes for CI/CD:
# ---------------
# - This Dockerfile uses npm ci (reproducible installs).
# - Dependency layer caching is optimized by copying package*.json first.
# - Works best when package-lock.json is committed.
#
# ================================================================

# ------------------------------
# Stage 1: Builder
# ------------------------------
# Use Node.js LTS on Alpine for small images and fast builds.
FROM node:20-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy dependency manifests first for better Docker layer caching
# (rebuilds are faster when only source code changes)
COPY package.json package-lock.json ./

# Install dependencies (clean + reproducible)
# npm ci requires package-lock.json and installs exact versions.
RUN npm ci

# Copy the rest of the source code into the image
COPY . .

# Build the Vite app (outputs production build to /app/dist)
RUN npm run build

# ================================================================
# Build output is now in /app/dist
# ================================================================
# The dist folder contains:
# - index.html
# - assets/ (JS, CSS, images, fonts)
# - Static files ready to be served by Nginx/Apache/CDN/etc.
#
# ================================================================

# ------------------------------
# Stage 2: Export (optional)
# ------------------------------
# This stage exists ONLY to make it easy to "copy out" dist artifacts
# in CI/CD pipelines or local builds without shipping a full runtime image.
FROM scratch AS export

# Copy dist build artifacts to /dist in the final stage
COPY --from=builder /app/dist /dist

# ================================================================
# Export stage usage:
# ------------------
# docker build --target export -t tasc-frontend-export .
# docker create --name tasc-fe-export tasc-frontend-export
# docker cp tasc-fe-export:/dist ./dist
# docker rm tasc-fe-export
# ================================================================