# CRITICAL REQUIREMENTS - DO NOT FORGET

## MODEL REQUIREMENT (EXTREMELY IMPORTANT)
- **MUST USE**: Gemini 2.5 Flash with Thinking
- **API MODEL NAME**: `gemini-2p5-flash`
- **REQUIRED PARAMETER**: `thinking_budget` in the request
- **NO OTHER MODEL IS ACCEPTABLE**

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
// CORRECT ENDPOINT
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2p5-flash:generateContent";

// CORRECT REQUEST BODY
{
  "model": "models/gemini-2p5-flash",
  "thinking_budget": 100,  // REQUIRED FOR "WITH THINKING" MODE
  // ... rest of config
}
```

## Environment Variables
- `GEMINI_API_KEY`: Your Gemini API key
- `SINGLE_PASSCODE`: Access passcode for the app

## DO NOT
- Use any other model besides gemini-2p5-flash
- Forget the thinking_budget parameter
- Add complex authentication
- Store any data
- Add features beyond core BA requirements