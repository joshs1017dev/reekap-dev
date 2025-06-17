# 008 - Clarify Thinking Behavior Documentation
Date: 2025-01-17
Type: Documentation

## What I Fixed
- Corrected CLAUDE.md to accurately describe thinking behavior for each model
- Previous docs incorrectly stated "thinking enabled by default" for both models
- Updated to reflect actual behavior differences between Flash and Pro

## Key Discoveries
- **Gemini 2.5 Flash**: Uses "Auto" thinking mode by default
  - Dynamically adjusts thinking based on task complexity
  - Can be controlled with thinkingConfig (0-24,576 tokens)
  - Can be turned off completely with thinking_budget=0
  
- **Gemini 2.5 Pro**: Always has thinking enabled
  - Cannot be turned off
  - No control over thinking behavior
  - Designed as a reasoning model

## Code Locations
- `/CLAUDE.md`: Updated API config section (line 7)
- `/CLAUDE.md`: Updated core principles section (line 75)
- `/CLAUDE.md`: Updated common pitfalls section (line 158)

## Testing Notes
- Both models work without thinkingConfig parameter
- Flash auto-adjusts thinking for complex prompts
- Pro always applies thinking regardless of complexity

## Next Steps
- Monitor if Flash's auto-thinking provides sufficient quality
- If needed, could add thinkingConfig back for Flash only
- Keep watching for API updates on thinking control