# Deployment Options - Choose Your Preferred Method

## Option 1: Vercel (Recommended - Easiest)
**Best for:** Non-technical users who want server-side security

### What You Need:
- GitHub account (free)
- Vercel account (free)
- Gemini API key

### Steps:
1. **Upload to GitHub**
   - Create account at github.com
   - Click "New repository"
   - Upload these files: `index.html`, `vercel.json`, `api/analyze.js`

2. **Deploy on Vercel**
   - Go to vercel.com
   - Sign in with GitHub
   - Click "Import Project"
   - Select your repository
   - Add environment variables:
     - `GEMINI_API_KEY` = your API key
     - `SINGLE_PASSCODE` = your chosen password

3. **Done!** Share the URL and passcode with your team

## Option 2: GitHub Pages (100% Free Forever)
**Best for:** Maximum privacy - each user controls their own API key

### What You Need:
- GitHub account (free)
- That's it!

### Steps:
1. **Upload to GitHub**
   - Create repository
   - Upload only: `index-github-pages.html`
   - Rename it to `index.html`

2. **Enable GitHub Pages**
   - Go to Settings → Pages
   - Source: Deploy from branch
   - Branch: main, folder: / (root)
   - Save

3. **Share with Team**
   - URL: `https://[your-username].github.io/[repo-name]`
   - Each user enters their own Gemini API key
   - Key saves in their browser only

## Option 3: Run Locally (No Internet Needed)
**Best for:** Maximum security, no hosting

1. Save `index-github-pages.html` to desktop
2. Double-click to open in browser
3. Enter your API key
4. Use offline (after first setup)

## Comparison

| Feature | Vercel | GitHub Pages | Local |
|---------|---------|--------------|-------|
| Cost | Free | Free | Free |
| Setup Time | 10 min | 5 min | 1 min |
| API Key Storage | Server (secure) | User's browser | User's browser |
| Passcode | Yes | No (each user has own key) | No |
| Custom Domain | Yes ($) | Yes (free) | No |
| Works Offline | No | No | Yes |

## Which Should You Choose?

- **Vercel**: If you want one shared passcode for the whole team
- **GitHub Pages**: If each person should manage their own API key
- **Local**: If you don't want any online hosting