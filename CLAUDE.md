# CRITICAL REQUIREMENTS - DO NOT FORGET

## MODEL REQUIREMENT (EXTREMELY IMPORTANT)
- **SUPPORTED MODELS**: 
  - Gemini 2.5 Flash Preview: `gemini-2.5-flash-preview-05-20` (Default)
  - Gemini 2.5 Pro Preview: `gemini-2.5-pro-preview-06-05` (Enhanced analysis)
- **API CONFIG**: No special configuration needed - thinking is enabled by default
- **API STRUCTURE**: Uses nested system_instruction format

## Core Requirements
1. **Authentication**: Simple passcode only (no login flow)
2. **Input**: Upload or paste meeting transcriptions (unlabeled)
3. **Meeting Types**: Dropdown selection
4. **Output**: Business Analyst artifacts (see below)

## Required Output Fields
- summary: Executive summary
- recap: Detailed narrative
- action_items: Array of actions
- decisions: Array of decisions made
- risks: Array of identified risks
- requirements: Array of business/functional requirements
- open_questions: Array of unresolved items
- dependencies: Array of dependencies
- next_steps: Array of planned activities

## API Configuration
```javascript
// ENDPOINT FORMAT
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

// REQUEST STRUCTURE (Vercel)
{
  "system_instruction": {
    "role": "system",
    "parts": [{ "text": systemPrompt }]
  },
  "contents": [{
    "role": "user",
    "parts": [{ "text": userPrompt }]
  }],
  "generationConfig": {
    "temperature": 0.3,
    "responseMimeType": "application/json"
  }
}
```

## Environment Variables
- `GEMINI_API_KEY`: Your Gemini API key
- `SINGLE_PASSCODE`: Access passcode for the app

## DO NOT
- Use models other than the two supported Gemini models
- Add complex authentication
- Store any data
- Break existing functionality when adding features

---

# Project Configuration for Claude Code

## Project Overview
Project: REEKAP - Business Analyst Meeting Recap Tool
Tech Stack: HTML/CSS/JavaScript (Frontend), Node.js/Serverless Functions (Backend), Gemini 2.5 Flash API
Description: Web app that analyzes meeting transcriptions and generates structured BA artifacts using AI

## Core Principles
- Think deeply before implementing (use THINK HARDER when needed)
- Make small, incremental changes
- Test all changes manually (no test suite currently)
- Follow existing patterns in the codebase
- Prioritize simplicity and maintainability
- Always use Gemini 2.5 Flash or Pro models (thinking is enabled by default)

## Build & Development Commands
```bash
# Development
# No build step - pure HTML/CSS/JS
# For local testing, use a simple HTTP server:
python -m http.server 8000

# Deployment
# Vercel: Push to main branch (auto-deploys)
# GitHub Pages: Deprecated - uses index-github-pages.html

# Git workflow
git checkout -b feature/[name]  # Create feature branch
git commit -m "[type]: [description]"  # Commit format
```

## Code Style Guidelines
- Use vanilla JavaScript (no TypeScript compilation)
- Use ES modules where supported
- Keep functions pure and focused
- Use descriptive variable names
- Maintain consistent formatting with existing code
- Keep API logic in serverless functions

## Testing Practices
- Manual testing only (no automated test suite)
- Test with various meeting transcription formats
- Verify all meeting types produce correct outputs
- Test error handling (API failures, invalid inputs)
- Check responsive design on mobile

## Project Structure
```
/
├── index.html                  # Main app (Vercel)
├── index-github-pages.html     # GitHub Pages version (deprecated)
├── api/
│   └── analyze.js             # Vercel serverless function
├── netlify-deprecated/         # Old Netlify deployment (no longer used)
│   └── functions/
│       └── analyze.ts         
├── CLAUDE.md                  # This file - AI instructions
└── _logs/                     # Progress tracking
    └── 001_planning_new_features.md
```

## Error Handling Patterns
- Show user-friendly error messages
- Never expose API keys in errors
- Log errors to console for debugging
- Provide fallback behavior when API fails
- Clear error states when retrying

## Security Considerations
- API keys only in server-side functions
- Passcode validation on both client and server
- No data persistence (stateless)
- Sanitize transcription input
- Rate limiting on API endpoints

## Performance Guidelines
- Minimize API calls (batch when possible)
- Show loading states during processing
- Keep frontend bundle minimal
- Optimize for mobile devices

## Workflow Patterns
1. **Adding a new meeting type:**
   - Add option to all HTML dropdowns
   - Create specialized prompt in MEETING_PROMPTS
   - Test with sample transcriptions
   - Verify output mapping makes sense

2. **Fixing bugs:**
   - Reproduce in browser
   - Check browser console for errors
   - Fix in all deployment versions
   - Test fix across different inputs

## Common Pitfalls to Avoid
- Don't forget to update BOTH index.html files
- Gemini 2.5 models have thinking enabled by default (no config needed)
- Keep prompts consistent across all backend files
- Don't add complex features beyond BA needs
- Remember there's no database - everything is stateless

## Useful Context
- Main entry: index.html
- API handler: /api/analyze.js (Vercel)
- Deployment: Vercel only (primary)
- Simple passcode auth - no user accounts
- Output format is standardized JSON (business meetings) or educational JSON (training lectures)

## Iteration Guidelines
- Make one logical change at a time
- Test manually after each change
- Commit working code frequently
- If stuck after 3 attempts, ask for clarification
- Update all deployment versions consistently

## Extended Thinking Triggers
Use extended thinking for:
- Designing new meeting type outputs (like Training Lectures)
- Crafting effective prompts for Gemini
- Architecture decisions (changing output structure)
- Security-sensitive code
- Major feature additions

## Team Conventions
- Solo project - maintain consistency
- Comment only when logic is complex
- Keep git history clean
- Update CLAUDE.md when patterns change
- Document in _logs/ folder

---

# Solo Developer Configuration - Progress & Debug Tracking

## Core Philosophy
- Solo project needs clear history of changes
- Every significant change gets a numbered log file
- When issues arise, can trace back through logs
- AI can read previous logs to understand project evolution

## Progress Tracking System

### Automatic File Creation
After each significant task, create:
```
project/
├── _logs/
│   ├── 001_initial_mvp.md
│   ├── 002_add_meeting_types.md
│   ├── 003_fix_gemini_timeout.md
│   ├── 004_add_error_handling.md
│   └── 005_add_training_lecture.md
```

### File Naming Convention
- Progress: `XXX_feature_name.md` (what we built)
- Debugging: `XXX_fix_issue_name.md` (what we fixed)
- Always increment numbers
- Use descriptive names

## Progress File Template
```markdown
# XXX - Feature Name
Date: YYYY-MM-DD
Type: Feature/Debug

## What I Built/Fixed
- 

## Key Decisions
- 

## Code Locations
- 

## Testing Notes
- 

## Next Steps
- 
```

## Implementation Rules

### When to Create Logs
1. **Feature Complete**: After implementing any feature
2. **Bug Fixed**: After debugging any issue
3. **Major Refactor**: When changing architecture
4. **Performance Fix**: After optimization
5. **Breaking Change**: When output format changes

### What to Include
✅ What changed and why
✅ Where the code lives
✅ How to test it works
✅ What might break it
✅ Related decisions

## Using Logs for Debugging

When something breaks:
- Check _logs/ for similar issues
- Review recent changes
- Understand system evolution

## Benefits
1. **Perfect Memory**: Every decision is logged
2. **Fast Debugging**: Search previous issues
3. **Progress Tracking**: See evolution over time
4. **AI Context**: Claude understands project history
5. **Solo Timeline**: Your development story

Remember: These logs are YOUR memory. When returning to the project after time away, these breadcrumbs guide you back.