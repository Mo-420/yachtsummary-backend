#!/bin/bash
set -e

echo "🚀 Building and deploying YachtSummary PWA + Backend..."

# Build frontend
echo "📦 Building PWA..."
npm --prefix ../yacht-brokerage-pwa run build

# Sync build into backend/web
echo "📁 Copying build to backend..."
rm -rf web
mkdir -p web
cp -R ../yacht-brokerage-pwa/dist/* web/

echo "✅ Build complete! Files copied to web/ directory"
echo ""
echo "📋 Next steps:"
echo "1. Commit and push to your GitHub repository"
echo "2. Go to Render dashboard and trigger a new deployment"
echo "3. Or run: git add . && git commit -m 'Deploy combined PWA+API' && git push"
echo ""
echo "🌐 Once deployed, your PWA will be available at:"
echo "   https://yachtsummary-backend.onrender.com"
echo ""
echo "📱 Users can install the PWA from that URL and notifications will work!"
