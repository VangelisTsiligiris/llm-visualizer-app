# LLM Processing Visualizer

An interactive web application that visualizes how Large Language Models (LLMs) process prompts in real-time. Supports Claude (Anthropic), Gemini (Google), and ChatGPT (OpenAI).

![LLM Visualizer](https://img.shields.io/badge/React-18.2-blue) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC) ![License](https://img.shields.io/badge/license-MIT-green)

## Features

- 🎯 **Multi-LLM Support**: Toggle between Claude, Gemini, and ChatGPT
- 🎨 **Visual Processing Stages**: Watch tokenization, embedding, processing, generation, and completion
- ⚡ **Real-time Streaming**: See responses generate character by character
- 🎭 **Interactive Animations**: Beautiful animations for each processing stage
- 🔒 **Secure**: API keys stay in your browser, never stored on servers

## Live Demo

[View Live Demo](#) (Add your Netlify URL here after deployment)

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Anthropic API** - Claude
- **Google AI API** - Gemini
- **OpenAI API** - ChatGPT

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- npm or yarn package manager
- A GitHub account
- A Netlify account (free tier works!)

## Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/llm-visualizer-app.git
   cd llm-visualizer-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

## Deployment to Netlify via GitHub

### Step 1: Push to GitHub

1. **Create a new repository on GitHub**
   - Go to https://github.com/new
   - Name it `llm-visualizer-app` (or your preferred name)
   - Don't initialize with README (we already have one)
   - Click "Create repository"

2. **Initialize Git and push** (run these commands in your project directory)
   ```bash
   git init
   git add .
   git commit -m "Initial commit: LLM Processing Visualizer"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/llm-visualizer-app.git
   git push -u origin main
   ```

### Step 2: Deploy on Netlify

#### Option A: Netlify UI (Recommended for beginners)

1. **Log in to Netlify**
   - Go to https://app.netlify.com
   - Sign in with your GitHub account

2. **Import your project**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Authorize Netlify to access your repositories
   - Select your `llm-visualizer-app` repository

3. **Configure build settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - (These should be auto-detected from `netlify.toml`)

4. **Deploy!**
   - Click "Deploy site"
   - Wait 2-3 minutes for the build to complete
   - Your site will be live at a URL like `https://random-name-12345.netlify.app`

5. **Optional: Custom domain**
   - Go to Site settings → Domain management
   - Add your custom domain

#### Option B: Netlify CLI (For advanced users)

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

### Step 3: Get Your API Keys

To use the visualizer, you'll need at least one API key:

1. **Claude (Recommended - Works everywhere)**
   - Go to https://console.anthropic.com/
   - Sign up for an account
   - Generate an API key
   - Free tier: $5 credit

2. **Gemini**
   - Go to https://makersuite.google.com/app/apikey
   - Sign in with Google account
   - Create an API key
   - Free tier: 60 requests/minute

3. **ChatGPT**
   - Go to https://platform.openai.com/api-keys
   - Sign up for an account
   - Create an API key
   - Pay-as-you-go pricing

## Usage

1. Open the deployed website
2. Select your preferred LLM provider
3. Enter your API key (it's stored locally in your browser)
4. Type a prompt
5. Click "Submit" and watch the magic happen!

## Project Structure

```
llm-visualizer-app/
├── public/              # Static assets
├── src/
│   ├── App.jsx         # Main application component
│   ├── main.jsx        # React entry point
│   └── index.css       # Global styles with Tailwind
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── netlify.toml        # Netlify deployment configuration
└── README.md           # This file
```

## Configuration

### Environment Variables (Optional)

If you want to set default API keys (not recommended for security):

Create `.env.local`:
```
VITE_CLAUDE_API_KEY=your_key_here
VITE_GEMINI_API_KEY=your_key_here
VITE_OPENAI_API_KEY=your_key_here
```

## Troubleshooting

### CORS Errors
- **Claude API**: Should work everywhere
- **Gemini/OpenAI**: May be blocked by CORS in some environments
- **Solution**: These APIs work perfectly when deployed to Netlify

### Build Failures
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Netlify cache: Site settings → Build & deploy → Clear cache

### API Key Issues
- Make sure you're using the correct API key format
- Check your API quota/credits
- Verify the API key has proper permissions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with React and Vite
- Styled with Tailwind CSS
- Icons from Lucide React
- Powered by Claude (Anthropic), Gemini (Google), and ChatGPT (OpenAI)

## Support

If you have any questions or run into issues:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the troubleshooting section above

## Roadmap

- [ ] Add streaming support for real-time token generation
- [ ] Save conversation history
- [ ] Compare responses from multiple LLMs side-by-side
- [ ] Add more visualization options
- [ ] Dark/Light mode toggle
- [ ] Export conversations

---

Made with ❤️ by [Your Name]

⭐ Star this repo if you find it useful!
