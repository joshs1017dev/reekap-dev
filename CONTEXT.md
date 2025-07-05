# BA Assistant Context & Architecture Guide

## Project Overview
**BA Assistant (formerly REEKAP)** is a comprehensive Business Analyst workflow automation tool that analyzes meeting transcripts using AI and generates various BA deliverables.

### Core Purpose
Transform meeting transcripts into structured BA artifacts including:
- Action items, decisions, risks, requirements
- Business Requirements Documents (BRD)
- Functional Requirements Specifications (FRS)
- User Stories with acceptance criteria
- Test cases from requirements
- Meeting history tracking

## Technical Stack
- **Frontend**: Alpine.js 3.x with modular components
- **Styling**: Tailwind CSS
- **Storage**: Browser localStorage with persistence
- **AI**: Google Gemini API (2.5 Flash/Pro models)
- **Deployment**: Vercel (serverless functions)
- **Additional Libraries**: 
  - Chart.js (ready for dashboards)
  - Mermaid.js (ready for process flows)
  - Alpine Persist plugin

## Architecture Decisions

### 1. Modular Component System
```
/js/
├── components/       # UI components as Alpine.js modules
├── services/         # Utility services (storage, etc.)
├── state/           # Centralized state management
└── templates/       # Document generation templates
```

**Why**: Maintainability, reusability, and clear separation of concerns.

### 2. State Management Pattern
- Centralized store in `/js/state/store.js`
- Uses Alpine.js reactivity with localStorage persistence
- Namespace: `ba_assistant` with versioning
- Auto-save on state changes
- 50-meeting history limit

### 3. API Structure
- Serverless functions in `/api/`
- Each endpoint is self-contained
- Environment variables for secrets
- Consistent error handling

## Key Components Explained

### 1. Main Application (`index.html`)
- Single-page application with tab navigation
- Alpine.js x-data initialization
- Modular component imports via ES6 modules
- Responsive design with Tailwind

### 2. State Store (`/js/state/store.js`)
**Purpose**: Central source of truth for all application data
- Meeting history management
- User preferences
- Authentication state
- Import/export functionality

**Key Methods**:
- `addMeetingToHistory()` - Saves analyzed meetings
- `loadState()` / `saveState()` - Persistence layer
- `exportData()` / `importData()` - Data portability

### 3. Document Generator (`/js/components/document-generator.js`)
**Purpose**: Generate professional BA documents from meeting data
- Multiple template support (BRD, FRS, User Stories)
- Single or multi-meeting aggregation
- Customizable output settings

**Key Features**:
- Template selection UI
- Version control
- Metadata inclusion options

### 4. Meeting History (`/js/components/meeting-history.js`)
**Purpose**: Track and manage all analyzed meetings
- Search and filter capabilities
- Bulk selection for operations
- Expandable detail views

**Key Features**:
- Real-time search
- Type-based filtering
- Age calculation
- Item count summaries

### 5. Test Generator (`/js/components/test-generator.js`)
**Purpose**: Auto-generate test cases from requirements
- Multiple test types (Happy, Edge, Negative)
- Various output formats (Standard, BDD, CSV)
- Test data suggestions

**Algorithm**:
- Analyzes requirement keywords
- Generates contextual test steps
- Creates appropriate test data

## API Endpoints

### `/api/analyze.js` (Original)
- **Purpose**: Analyze meeting transcripts
- **Method**: POST
- **Input**: meetingType, transcript, model
- **Output**: Structured meeting analysis
- **Auth**: x-passcode header

### `/api/generate-document.js`
- **Purpose**: Generate BA documents
- **Method**: POST
- **Input**: template, meetingData, settings
- **Output**: HTML/Markdown document
- **Features**: Multi-meeting aggregation

### `/api/create-test-cases.js`
- **Purpose**: Generate test cases
- **Method**: POST
- **Input**: requirements[], testTypes, format
- **Output**: Array of test cases
- **Intelligence**: Keyword analysis for test generation

## Environment Variables
```
GEMINI_API_KEY      # Google AI API key
SINGLE_PASSCODE     # Application access code
```

## Storage Schema

### Meeting Object Structure
```javascript
{
  id: "meeting_timestamp_random",
  timestamp: "ISO date",
  summary: "Executive summary",
  actionItems: [],
  decisions: [],
  risks: [],
  requirements: [],
  metadata: {
    meetingType: "standup|planning|etc",
    model: "gemini-model-name",
    meetingDate: "ISO date"
  }
}
```

### State Structure
```javascript
{
  version: "1.0",
  meetingHistory: [Meeting[]],
  selectedModel: "model-name",
  automationTools: {},
  lastUpdated: "ISO date"
}
```

## Pending Features (Foundation Ready)

### Process Flow Visualizer
- **Status**: UI disabled, foundation ready
- **Plan**: Use Mermaid.js for diagram generation
- **Implementation**: Parse keywords → Generate Mermaid syntax → Render

### RAID Log Aggregator
- **Status**: UI disabled, foundation ready
- **Plan**: Aggregate across meetings with deduplication
- **Implementation**: Extract RAID items → Deduplicate → Track status

## Development Guidelines

### Adding New Features
1. Create component in `/js/components/`
2. Add to store if needed
3. Create API endpoint if backend required
4. Import in index.html
5. Add tab/UI navigation

### Code Style
- ES6 modules for components
- Alpine.js reactive patterns
- Async/await for promises
- Descriptive function names
- Comment complex logic

### Testing Approach
- Manual testing primary
- Focus on user workflows
- Test error states
- Verify localStorage persistence
- Check responsive design

## Common Tasks

### Add New Document Template
1. Create template in `/templates/`
2. Import in `generate-document.js`
3. Add to switch statement
4. Update UI template list

### Add New Meeting Type
1. Update meeting type select options
2. Add prompt in `analyze.js`
3. Update type labels in components
4. Test analysis output

### Modify Storage Schema
1. Update version in store.js
2. Add migration logic
3. Handle backward compatibility
4. Test import/export

## Gotchas & Known Issues

1. **localStorage Limits**: ~5-10MB depending on browser
2. **CORS**: API endpoints need proper headers
3. **Alpine.js Order**: Persist plugin must load before Alpine
4. **Module Imports**: Use type="module" for ES6
5. **Gemini API**: Rate limits apply, handle errors

## Security Considerations

1. **Passcode**: Now uses environment variable
2. **API Keys**: Never commit, use env vars
3. **Input Validation**: Required for all user inputs
4. **XSS Prevention**: Sanitize generated HTML
5. **CORS**: Configure for production domain

## Deployment Notes

### Vercel Deployment
1. Set environment variables in dashboard
2. Serverless functions auto-detected from `/api`
3. Static files served from root
4. No build step required

### Local Development
1. Create `.env` file from `.env.example`
2. Use Vercel CLI: `vercel dev`
3. Or any static server for frontend only

## Future Enhancement Ideas

1. **Real-time Collaboration**: WebSocket support
2. **AI Model Selection**: Support OpenAI, Claude
3. **Export Formats**: Word, PDF generation
4. **Webhook Integration**: Slack, Teams notifications
5. **Analytics Dashboard**: Meeting insights over time
6. **Voice Input**: Direct audio transcription
7. **Template Marketplace**: Share custom templates

## Contact Points & Resources

- Original Requirements: `/ba-enhancements-plan.md`
- Implementation Log: `/ENHANCEMENTS-IMPLEMENTED.md`
- Deployment Guide: `/DEPLOY-OPTIONS.md`
- API Issue Notes: `/GEMINI_API_ISSUE.md`

---

This context should provide any LLM with sufficient understanding to:
- Navigate the codebase effectively
- Understand architectural decisions
- Continue development consistently
- Debug issues efficiently
- Add new features properly