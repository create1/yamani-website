#!/bin/bash

# Yamani Website - Simple Vercel Deploy Script

echo "🚀 Deploying Yamani Website to Vercel..."
echo ""

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

cd "/Users/jonathanrowe/Code Projects/Yamani Website"

echo "📦 Project ready for deployment"
echo ""
echo "Choose deployment option:"
echo "1. Deploy with interactive prompts (recommended)"
echo "2. Quick deploy (uses defaults)"
echo ""

# Simple interactive deploy
vercel

echo ""
echo "✅ Deployment complete!"
echo "Your website is now live on Vercel!"
