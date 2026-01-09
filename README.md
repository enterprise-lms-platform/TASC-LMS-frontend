# TASC LMS Frontend

## Overview
TASC LMS Frontend is a React + TypeScript + Vite-based Learning Management System. This project provides a modern web interface for managing educational content, courses, and student interactions.

## Tech Stack
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Material-UI** for component library

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation & Local Setup
```bash
# Clone the repository
git clone <repo-url>
cd TASC-LMS-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Development Workflow

### Trunk-Based Development
This project uses **trunk-based development**. All feature work is done on local branches and merged to `main` via pull requests.

```bash
# Create a feature branch from main
git checkout -b feature/your-feature-name

# Push to your branch
git push origin feature/your-feature-name
```

## ⚠️ Warning
**DO NOT push directly to `main` branch.** All changes must go through:
1. Feature branch development
2. Pull request review
3. Merge approval

Violations of this policy may be subject to access restrictions.

## Building
```bash
npm run build
```
