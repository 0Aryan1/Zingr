#!/bin/bash

# Quick Deployment Script
# This script helps you prepare your project for deployment

echo "🚀 Preparing project for Vercel deployment..."
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Git repository not found. Please initialize git first."
    exit 1
fi

echo "✅ Git repository found"
echo ""

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo "⚠️  You have uncommitted changes. Please commit them first."
    echo ""
    echo "Run these commands:"
    echo "  git add ."
    echo "  git commit -m 'Prepare for deployment'"
    echo "  git push origin main"
    echo ""
    exit 1
fi

echo "✅ No uncommitted changes"
echo ""

# Check if Backend/vercel.json exists
if [ ! -f Backend/vercel.json ]; then
    echo "❌ Backend/vercel.json not found"
    exit 1
fi

echo "✅ Backend vercel.json found"
echo ""

# Check if environment example files exist
if [ ! -f Backend/.env.example ]; then
    echo "⚠️  Backend/.env.example not found"
fi

if [ ! -f Frontend/.env.example ]; then
    echo "⚠️  Frontend/.env.example not found"
fi

echo ""
echo "📋 Pre-deployment Checklist:"
echo ""
echo "Backend Requirements:"
echo "  ✓ MongoDB Atlas connection string"
echo "  ✓ JWT_SECRET key"
echo "  ✓ ImageKit credentials"
echo ""
echo "Frontend Requirements:"
echo "  ✓ Backend API URL (after backend is deployed)"
echo ""
echo "🎯 Next Steps:"
echo ""
echo "1. Go to https://vercel.com/new"
echo "2. Import your GitHub repository"
echo "3. Deploy Backend first (Root: Backend/)"
echo "4. Deploy Frontend second (Root: Frontend/)"
echo "5. Set environment variables in Vercel dashboard"
echo ""
echo "📖 For detailed instructions, see: DEPLOYMENT_GUIDE.md"
echo ""
