# 003 - Add Model Selection
Date: 2025-01-16
Type: Feature

## What I Built
- Added model selection dropdown to UI
- Support for both Gemini 2.5 Flash Preview and Pro Preview models
- Dynamic thinkingBudget configuration based on selected model
- Flash: 1024 thinking budget (default)
- Pro: 2048 thinking budget (for more complex analysis)

## Key Decisions
- Made Flash the default model for backward compatibility
- Pro gets double the thinking budget for deeper analysis
- Model parameter is optional in API (defaults to Flash)
- Simple dropdown UI with clear labels about speed vs power

## Code Locations
- index.html:73-75: Added model selection dropdown
- index.html:282: Added selectedModel to Alpine.js data
- index.html:344: Include model in API request body
- api/analyze.js:81: Extract model from request with default
- api/analyze.js:89-98: MODEL_CONFIGS with thinkingBudget per model
- api/analyze.js:140: Dynamic thinkingBudget in generation config
- api/analyze.js:148: Dynamic model in API URL

## Testing Notes
- Test Flash model still works (existing functionality)
- Test Pro model with same transcript
- Verify thinkingBudget changes based on model
- Ensure default behavior when model not specified

## Next Steps
- Implement Training Lecture meeting type
- Add conditional output structure for training vs business meetings