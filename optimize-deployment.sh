#!/bin/bash

# RBSL Dhaka Unit - Namecheap "Stellar Plus" Deployment Optimization Script
# This script prepares a lightweight production bundle to avoid 2GB OOM errors.

echo "🚀 Starting RBSL Deployment Optimization..."

# 1. Backend Optimization
echo "📦 Building Backend (Medusa v2)..."
cd backend
npm run build
echo "💾 Creating Backend Bundle (dist + package.json)..."
zip -r ../rbsl-backend-deploy.zip dist package.json package-lock.json medusa-config.js
cd ..

# 2. Frontend Optimization
echo "🌐 Building Frontend (Next.js 15 Standalone)..."
cd frontend
npm run build
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/
echo "💾 Creating Frontend Bundle (standalone)..."
cd .next/standalone
zip -r ../../../rbsl-frontend-deploy.zip .
cd ../../..

echo "✅ Optimization Complete!"
echo "--------------------------------------------------"
echo "Files ready for upload to Namecheap:"
echo "- rbsl-backend-deploy.zip (Upload to /backend)"
echo "- rbsl-frontend-deploy.zip (Upload to /frontend)"
echo "--------------------------------------------------"
echo "Note: Next.js standalone mode is active. Run with 'node server.js'."
