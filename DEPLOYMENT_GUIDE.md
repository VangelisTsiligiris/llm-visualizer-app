# 🚀 Quick Deployment Guide

Follow these steps to deploy your LLM Visualizer to Netlify via GitHub.

## Prerequisites
- Git installed on your computer
- GitHub account (https://github.com)
- Netlify account (https://netlify.com) - free tier is fine!

## Step-by-Step Instructions

### 1️⃣ Extract the Project
1. Download `llm-visualizer-app.zip`
2. Extract it to a folder on your computer
3. Open Terminal (Mac/Linux) or Command Prompt (Windows)
4. Navigate to the extracted folder:
   ```bash
   cd path/to/llm-visualizer-app
   ```

### 2️⃣ Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `llm-visualizer-app` (or any name you like)
3. Description: "Interactive LLM Processing Visualizer"
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"
7. Copy your repository URL (e.g., `https://github.com/username/llm-visualizer-app.git`)

### 3️⃣ Push to GitHub

**Option A: Use the automated script (Mac/Linux)**
```bash
./deploy.sh
```
Follow the prompts!

**Option B: Manual commands (All platforms)**
```bash
git init
git add .
git commit -m "Initial commit: LLM Processing Visualizer"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/llm-visualizer-app.git
git push -u origin main
```

### 4️⃣ Deploy to Netlify

1. **Login to Netlify**
   - Go to https://app.netlify.com
   - Sign in with GitHub

2. **Import Project**
   - Click "Add new site" button
   - Select "Import an existing project"
   - Choose "Deploy with GitHub"
   - Authorize Netlify (if first time)

3. **Select Repository**
   - Find and click on `llm-visualizer-app`

4. **Configure (Auto-detected)**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Deploy site"

5. **Wait for Deployment** ⏰
   - Takes 2-3 minutes
   - Watch the build logs
   - Once complete, you'll get a live URL!

### 5️⃣ Get Your API Keys

You'll need at least one API key to use the app:

**Claude (Recommended)** ✅
- Website: https://console.anthropic.com/
- Free credit: $5
- Works everywhere!

**Gemini** 
- Website: https://makersuite.google.com/app/apikey
- Free tier: 60 requests/minute

**ChatGPT**
- Website: https://platform.openai.com/api-keys
- Pay-as-you-go pricing

### 6️⃣ Use Your App! 🎉

1. Open your Netlify URL (looks like `https://your-app-name.netlify.app`)
2. Select an LLM provider
3. Paste your API key
4. Type a prompt
5. Click Submit and watch the visualization!

## 🎨 Customize Your Domain (Optional)

1. In Netlify dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Enter your domain name
4. Follow DNS configuration instructions

## 📱 Share Your App

Your app is now live! Share it with:
- Friends and colleagues
- Social media
- Your portfolio
- GitHub README

## 🔄 Making Updates

To update your deployed app:

```bash
# Make your changes to the code
git add .
git commit -m "Description of changes"
git push

# Netlify will automatically rebuild and deploy!
```

## ❓ Troubleshooting

**Build fails?**
- Check the build logs in Netlify
- Make sure all files were committed to Git

**CORS errors?**
- Claude API works everywhere
- Gemini/OpenAI may have CORS issues locally but work on Netlify

**API not working?**
- Verify your API key is correct
- Check you have credits/quota remaining
- Look at browser console (F12) for error messages

## 🆘 Need Help?

- Check the main README.md for detailed documentation
- Open an issue on GitHub
- Review Netlify documentation: https://docs.netlify.com

## 🎉 Success!

Congratulations! Your LLM Visualizer is now live on the internet! 

Share your creation and enjoy watching AI process prompts in real-time! ✨
