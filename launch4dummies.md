# 🚀 Launch Guide for Non-Technical Users

This guide will help you get your Business Analyst Assistant online in 15 minutes!

## What You'll Need
- A computer with internet
- A Google account (for the AI key)
- That's it!

## Step 1: Get Your AI Key (5 minutes)
1. Go to: https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click the "Create API Key" button
4. Copy the long text that appears (starts with "AIza...")
5. Save it in a safe place (like a password manager)

## Step 2: Upload to Netlify (5 minutes)
1. Go to: https://app.netlify.com/drop
2. You'll see a big dotted box that says "Drag and drop your site folder here"
3. Find the REEKAP folder on your computer
4. Drag the entire folder into that dotted box
5. Wait for upload (about 30 seconds)
6. You'll get a weird website name like "amazing-curie-a1b2c3"

## Step 3: Add Your Secret Keys (5 minutes)
1. Click "Site settings" button
2. On the left menu, click "Environment variables"
3. Click "Add a variable" button
4. Add these TWO variables:

   **First Variable:**
   - Key: `GEMINI_API_KEY`
   - Value: (paste the long AI key from Step 1)
   - Click "Create variable"

   **Second Variable:**
   - Key: `SINGLE_PASSCODE`
   - Value: Make up a password like `MyTeam2024!`
   - Click "Create variable"

5. Go back to your site (click site name at top)
6. Click the green link to open your app!

## How to Use Your App
1. Open the website link
2. Enter your passcode (the one you made up)
3. Pick meeting type from dropdown
4. Copy/paste meeting transcript from Teams/Zoom
5. Click "Analyze Transcript"
6. Get your professional BA summary!

## Sharing With Your Team
- Website link: Share the netlify link
- Passcode: Share the password you created
- That's all they need!

## Troubleshooting

**"Invalid passcode" error**
- Check you typed the exact passcode you set in Step 3
- Capital letters matter!

**"Failed to analyze transcript"**
- Check your AI key is correct
- Make sure you selected a meeting type
- Try a shorter transcript first

**Can't find the REEKAP folder**
- It's wherever you saved these files
- Usually in Downloads or Desktop

## Need a Custom Domain?
Instead of "amazing-curie-a1b2c3.netlify.app", want "ba-assistant.com"?
1. In Netlify, go to "Domain management"
2. Click "Add a domain"
3. Follow the steps (costs ~$15/year)

## Questions?
- Netlify has great support chat
- The app works on phones too!
- No monthly fees with Netlify free plan
- Gemini API is free for light usage

## Security Notes
- Your transcripts are NOT stored anywhere
- Only people with the passcode can access
- Data goes directly to Google's AI and back
- Nothing is saved after you close the page

---
💡 **Pro Tip**: Bookmark the site after entering your passcode so you don't have to type it again!