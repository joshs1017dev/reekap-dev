# Gemini API Integration Issue - Deep Research Request

## Context
We're building a Business Analyst Assistant web application that analyzes meeting transcripts using Google's Gemini 2.5 Flash model. The application encounters API errors when attempting to use the model's advanced features.

## Primary Issue
The Gemini 2.5 Flash API is rejecting our requests with two specific errors:

1. **System Instruction Format Error**: Invalid value at 'system_instruction'
2. **Thinking Budget Parameter Error**: Unknown name "thinking_budget" at 'generation_config'

## Current Implementation Details

### API Endpoint
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-2p5-flash:generateContent
```

### Request Structure Attempted
```json
{
  "model": "models/gemini-2p5-flash",
  "system_instruction": {
    "parts": {
      "text": "System prompt text here"
    }
  },
  "generationConfig": {
    "temperature": 0.3,
    "responseMimeType": "application/json",
    "thinkingConfig": {
      "thinkingBudget": 100
    }
  },
  "contents": [{
    "role": "user",
    "parts": [{ "text": "User prompt" }]
  }]
}
```

## Research Questions

1. **Thinking Mode Support**: 
   - Does Gemini 2.5 Flash support "thinking mode" or "thinking budget" parameters?
   - If yes, what is the correct API structure for enabling this feature?
   - Are there specific API versions or endpoints required?

2. **System Instructions**:
   - What is the correct format for system instructions in Gemini 2.5 Flash?
   - Should it be `system_instruction`, `systemInstruction`, or another field name?
   - What is the correct structure for the parts array?

3. **Model Capabilities**:
   - What are the latest features available in Gemini 2.5 Flash?
   - Are there beta features that require special API access or configuration?
   - Is there a difference between the public API and any preview/experimental APIs?

4. **API Versioning**:
   - Are we using the correct API version (v1beta)?
   - Are there newer API versions that support additional features?
   - Is there documentation for experimental or preview features?

## Expected Outcomes

We need to determine:
1. The correct API request structure for Gemini 2.5 Flash
2. Whether "thinking mode" is available and how to enable it
3. The proper format for system instructions
4. Any authentication or access requirements for advanced features

## Technical Requirements

- Must use Gemini 2.5 Flash model specifically
- Need to return structured JSON responses
- Require system-level instructions for consistent output format
- Want to leverage any available "thinking" or reasoning capabilities

## Additional Context

- Using Next.js/Vercel for deployment
- API key is properly configured and basic requests work
- The error suggests the parameters exist but in a different format
- Documentation seems outdated or incomplete for these features

Please research the most current Gemini 2.5 Flash API documentation, developer forums, and official Google AI announcements to provide accurate implementation guidance.