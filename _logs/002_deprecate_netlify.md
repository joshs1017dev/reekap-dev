# 002 - Deprecate Netlify
Date: 2025-01-16
Type: Refactor

## What I Built/Fixed
- Renamed netlify folder to netlify-deprecated
- Updated CLAUDE.md to reflect Vercel-only deployment
- Removed references to Netlify from documentation

## Key Decisions
- Focus on single deployment platform (Vercel) for simplicity
- Keep deprecated code for reference but clearly marked
- Simplify maintenance by having one source of truth

## Code Locations
- netlify/ → netlify-deprecated/ (folder rename)
- CLAUDE.md: Updated deployment sections and project structure

## Testing Notes
- No functional changes, only organizational
- Existing Vercel deployment continues to work

## Next Steps
- Implement model selection feature
- Add support for Gemini 2.5 Pro Preview model