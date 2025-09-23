#!/bin/bash

# Meeting Notes Agent - Deployment Script
# This script pulls the latest changes from GitHub and deploys them to Google Apps Script

echo "🚀 Starting deployment process..."

# Check if clasp is installed
if ! command -v clasp &> /dev/null; then
    echo "❌ Error: clasp is not installed. Please run: npm install -g @google/clasp"
    exit 1
fi

# Check if we're logged in to clasp
if ! clasp status &> /dev/null; then
    echo "❌ Error: Not logged in to clasp. Please run: clasp login"
    exit 1
fi

# Pull latest changes from GitHub (if this is a git repository)
if [ -d ".git" ]; then
    echo "📥 Pulling latest changes from GitHub..."
    git pull origin main || echo "⚠️  Warning: Could not pull from GitHub (not a git repo or no remote?)"
fi

# Push to Google Apps Script
echo "📤 Deploying to Google Apps Script..."
if clasp push; then
    echo "✅ Deployment successful!"
    echo "🎉 Your Meeting Notes Agent add-on has been updated!"
else
    echo "❌ Deployment failed!"
    echo "💡 Try running 'clasp status' to check for issues"
    exit 1
fi

echo "✨ Deployment complete!"
