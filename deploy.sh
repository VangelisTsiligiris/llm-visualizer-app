#!/bin/bash

# LLM Visualizer - GitHub & Netlify Deployment Script
# This script helps you deploy your app to GitHub and Netlify

echo "🚀 LLM Visualizer Deployment Helper"
echo "===================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git repository already initialized"
fi

# Check for GitHub remote
if ! git remote | grep -q "origin"; then
    echo ""
    echo "🔗 No GitHub remote found."
    echo "Please create a repository on GitHub first:"
    echo "   https://github.com/new"
    echo ""
    read -p "Enter your GitHub repository URL (e.g., https://github.com/username/llm-visualizer-app.git): " repo_url
    
    if [ -n "$repo_url" ]; then
        git remote add origin "$repo_url"
        echo "✅ Remote added"
    else
        echo "❌ No URL provided. Please add manually with:"
        echo "   git remote add origin YOUR_REPO_URL"
        exit 1
    fi
else
    echo "✅ GitHub remote already configured"
fi

# Stage all files
echo ""
echo "📝 Staging files..."
git add .

# Commit
read -p "Enter commit message (or press Enter for default): " commit_msg
if [ -z "$commit_msg" ]; then
    commit_msg="Update: LLM Processing Visualizer"
fi

git commit -m "$commit_msg"
echo "✅ Changes committed"

# Push
echo ""
echo "⬆️  Pushing to GitHub..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🎉 Next steps:"
    echo "1. Go to https://app.netlify.com"
    echo "2. Click 'Add new site' → 'Import an existing project'"
    echo "3. Choose GitHub and select your repository"
    echo "4. Netlify will auto-detect settings from netlify.toml"
    echo "5. Click 'Deploy site' and wait 2-3 minutes"
    echo ""
    echo "Your site will be live! 🌐"
else
    echo "❌ Push failed. Please check your GitHub credentials and try again."
    exit 1
fi
