import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';

interface AnalysisRequest {
  meeting_type: string;
  transcript: string;
}

interface AnalysisResponse {
  summary: string;
  recap: string;
  action_items: string[];
  decisions: string[];
  risks: string[];
  requirements: string[];
  open_questions: string[];
  dependencies: string[];
  next_steps: string[];
}

const MEETING_PROMPTS: Record<string, string> = {
  standup: `Extract the following from this daily standup meeting:
    - What was completed yesterday
    - What is planned for today
    - Any blockers or impediments
    - Team member updates and commitments`,
  
  planning: `Extract the following from this sprint planning meeting:
    - Sprint goal and objectives
    - Stories selected for the sprint with estimates
    - Capacity and velocity discussions
    - Commitments made by the team
    - Any concerns about the sprint scope`,
  
  review: `Extract the following from this sprint review meeting:
    - Stories demonstrated and their acceptance status
    - Stakeholder feedback on each demo
    - Items accepted vs rejected
    - Product decisions made
    - Next sprint priorities discussed`,
  
  elicitation: `Extract the following from this requirements elicitation meeting:
    - Business needs and objectives
    - Functional requirements identified
    - Non-functional requirements
    - Assumptions and constraints
    - Business rules discovered
    - User stories or features discussed`,
  
  retro: `Extract the following from this retrospective meeting:
    - What went well this sprint
    - What didn't go well
    - What can be improved
    - Action items for next sprint
    - Team morale and dynamics observations`,
  
  refinement: `Extract the following from this backlog refinement meeting:
    - Stories discussed and refined
    - Acceptance criteria added or modified
    - Story point estimates
    - Questions raised about stories
    - Dependencies identified
    - Definition of done updates`,
  
  stakeholder: `Extract the following from this stakeholder meeting:
    - Key decisions made
    - Stakeholder concerns raised
    - Approvals or sign-offs given
    - Strategic direction changes
    - Budget or timeline discussions`,
  
  other: `Extract the following from this business meeting:
    - Main topics discussed
    - Key decisions made
    - Action items assigned
    - Important concerns raised
    - Next steps planned`
};

export const handler: Handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-passcode',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Validate passcode
    const passcode = event.headers['x-passcode'] || '';
    if (passcode !== process.env.SINGLE_PASSCODE) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Invalid passcode' })
      };
    }

    // Parse request
    const { meeting_type, transcript }: AnalysisRequest = JSON.parse(event.body || '{}');
    
    if (!transcript || !meeting_type) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing transcript or meeting type' })
      };
    }

    // Build Gemini request
    const systemInstruction = `You are an expert Business Analyst assistant. Analyze meeting transcripts and extract key information.
    
    IMPORTANT: You must ALWAYS return a valid JSON object with this exact structure:
    {
      "summary": "Executive summary of the meeting (2-3 sentences)",
      "recap": "Detailed narrative of what was discussed (1-2 paragraphs)",
      "action_items": ["Array of specific action items with owner and deadline if mentioned"],
      "decisions": ["Array of decisions made with rationale"],
      "risks": ["Array of risks or issues identified"],
      "requirements": ["Array of business or functional requirements discussed"],
      "open_questions": ["Array of unresolved questions needing follow-up"],
      "dependencies": ["Array of dependencies mentioned"],
      "next_steps": ["Array of planned next steps or activities"]
    }
    
    Extract information even from unlabeled transcripts. Look for commitment language, decision indicators, and action-oriented phrases.`;

    const userPrompt = `Meeting Type: ${meeting_type.toUpperCase()}
    
    Special Instructions: ${MEETING_PROMPTS[meeting_type] || MEETING_PROMPTS.other}
    
    Transcript:
    ${transcript}`;

    const geminiRequest = {
      model: 'models/gemini-2p5-flash',
      system_instruction: systemInstruction,
      generation_config: {
        temperature: 0.3,
        thinking_budget: 100,
        response_mime_type: "application/json"
      },
      contents: [{
        role: 'user',
        parts: [{ text: userPrompt }]
      }]
    };

    // Call Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2p5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiRequest)
      }
    );

    if (!geminiResponse.ok) {
      const error = await geminiResponse.text();
      console.error('Gemini API error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to analyze transcript' })
      };
    }

    const geminiData = await geminiResponse.json();
    
    // Extract the JSON response
    const analysisText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!analysisText) {
      throw new Error('No response from Gemini');
    }

    // Parse the JSON response
    const analysis: AnalysisResponse = JSON.parse(analysisText);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(analysis)
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'An error occurred while processing your request',
        details: error.message 
      })
    };
  }
};