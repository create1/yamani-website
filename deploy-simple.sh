#!/bin/bash

# Simple deployment workflow for Apotheos Website

echo "🚀 Apotheos Website - Quick Deploy"
echo "================================="
echo ""

# Navigate to project
cd "/Users/jonathanrowe/Code Projects/Apotheos Website"

# 1. Stage all changes
echo "📦 Staging changes..."
git add -A

# 2. Commit with timestamp
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
git commit -m "Update: $TIMESTAMP" || echo "No changes to commit"

# 3. Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

# 4. Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod --yes

echo ""
echo "✅ Deployment complete!"
echo "🌐 Live at: https://apotheos.org"
