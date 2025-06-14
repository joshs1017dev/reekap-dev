export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-passcode');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const MEETING_PROMPTS = {
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

  try {
    // Validate passcode
    const passcode = req.headers['x-passcode'] || '';
    if (passcode !== process.env.SINGLE_PASSCODE) {
      res.status(401).json({ error: 'Invalid passcode' });
      return;
    }

    // Parse request
    const { meeting_type, transcript } = req.body;
    
    if (!transcript || !meeting_type) {
      res.status(400).json({ error: 'Missing transcript or meeting type' });
      return;
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
      system_instruction: {
        parts: {
          text: systemInstruction
        }
      },
      generationConfig: {
        temperature: 0.3,
        responseMimeType: "application/json",
        thinkingConfig: {
          thinkingBudget: 100
        }
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
      res.status(500).json({ error: 'Failed to analyze transcript' });
      return;
    }

    const geminiData = await geminiResponse.json();
    
    // Extract the JSON response
    const analysisText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!analysisText) {
      throw new Error('No response from Gemini');
    }

    // Parse the JSON response
    const analysis = JSON.parse(analysisText);

    res.status(200).json(analysis);

  } catch (error) {
    console.error('Function error:', error);
    res.status(500).json({ 
      error: 'An error occurred while processing your request',
      details: error.message 
    });
  }
}