# 004 - Add Training Lecture
Date: 2025-01-16
Type: Feature

## What I Built
- Added "Training Lecture (BA-X)" as a new meeting type
- Separate output structure for educational content
- Conditional system instructions based on meeting type
- Dynamic tabs that change based on meeting type (business vs training)
- Training-specific UI sections for all educational fields

## Key Decisions
- Used separate output structure instead of forcing educational content into business format
- Training lectures get completely different JSON fields focused on learning
- Dynamic tab system shows appropriate tabs based on meeting_type in response
- Different formatResultsAsText output for training vs business

## Code Locations
- index.html:62: Added training option to meeting type dropdown
- index.html:299-312: Added trainingTabs and dynamic tabs getter
- index.html:274-373: Added all training-specific display sections
- index.html:488-560: Updated formatResultsAsText for both output types
- api/analyze.js:64-73: Added training prompt to MEETING_PROMPTS
- api/analyze.js:112-148: Conditional system instruction based on meeting type
- api/analyze.js:207: Added meeting_type to response

## Output Structure for Training
- summary: Overview of training topics
- learning_objectives: Skills/knowledge taught
- concepts_covered: BA concepts and methodologies
- tools_demonstrated: Tools and techniques shown
- examples_presented: Case studies used
- exercises_assigned: Homework and practice
- qa_highlights: Important Q&A
- resources_shared: Books, articles, templates
- skill_assessments: How competency is measured
- prerequisites: Assumed knowledge
- follow_up_topics: Future session topics

## Testing Notes
- Test with sample training lecture transcript
- Verify tabs switch correctly between meeting types
- Check all training fields display properly
- Ensure business meetings still work unchanged
- Test download/copy functions work with both formats

## Next Steps
- Consider adding more meeting types if needed
- Could add ability to save/export in different formats
- Might add template transcripts for testing