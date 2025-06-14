# Business Analyst Assistant

AI-powered meeting transcript analyzer using Gemini 2.5 Flash with Thinking.

## Setup Instructions

### 1. Get a Gemini API Key
- Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
- Create a new API key
- Save it securely

### 2. Deploy to Netlify

#### Option A: Quick Deploy
1. Drag and drop this folder to [Netlify Drop](https://app.netlify.com/drop)
2. Go to Site Settings → Environment Variables
3. Add these variables:
   - `GEMINI_API_KEY`: Your Gemini API key
   - `SINGLE_PASSCODE`: Choose a secure passcode (e.g., "BA2024Assistant")

#### Option B: Git Deploy
1. Push this code to a GitHub repository
2. Connect the repo to Netlify
3. Add the same environment variables as above

### 3. Install Dependencies (for local development)
```bash
npm install
```

### 4. Run Locally (optional)
```bash
# Create a .env file with your variables
GEMINI_API_KEY=your_key_here
SINGLE_PASSCODE=your_passcode_here

# Run the development server
npm run dev
```

## Usage

1. Navigate to your deployed app
2. Enter the passcode you set
3. Select the meeting type from dropdown
4. Paste transcript or upload .txt file
5. Click "Analyze Transcript"
6. View results in organized tabs
7. Export via:
   - Copy to clipboard
   - Download as .txt file
   - Send via email

## Meeting Types Supported
- Daily Stand-up
- Sprint Planning
- Sprint Review
- Requirements Elicitation
- Retrospective
- Backlog Refinement
- Stakeholder Meeting
- Other (generic)

## Output Includes
- Executive Summary
- Detailed Recap
- Action Items
- Decisions Made
- Risks & Issues
- Requirements
- Open Questions
- Dependencies
- Next Steps