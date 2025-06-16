# 001 - Planning New Features
Date: 2025-01-16
Type: Feature

## What I Built
- Set up progress tracking system with _logs directory
- Planned two major features: Model Selection and Training Lecture support
- Documented current system state and architecture decisions

## Key Decisions
- Use separate output structure for Training Lectures (not forcing into business meeting format)
- Support both Gemini 2.5 Flash Preview and Pro Preview models
- Deprecate Netlify deployment (focus on Vercel only)
- Implement features incrementally to avoid breaking changes

## Code Locations
- CLAUDE.md: Updated with project configuration and tracking system
- _logs/: New directory for progress tracking

## Current State
- Using model: gemini-2.5-flash-preview-05-20
- Deployment: Vercel only
- Meeting types: Business-focused (standup, planning, review, etc.)
- Output: Standardized business meeting fields

## Planned Features
1. **Model Selection**:
   - Add dropdown for Flash vs Pro
   - Pro model: gemini-2.5-pro-preview-06-05
   - Dynamic thinkingBudget based on model

2. **Training Lecture Support**:
   - New meeting type: "Training Lecture (BA-X)"
   - Educational output fields (learning_objectives, concepts_covered, etc.)
   - Conditional output structure based on meeting type

## Next Steps
- Update CLAUDE.md with correct model information
- Rename netlify folder to netlify-deprecated
- Implement model selection feature
- Implement training lecture feature