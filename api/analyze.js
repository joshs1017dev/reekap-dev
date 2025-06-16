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
    
    training: `Extract the following from this BA-X training lecture:
      - Key concepts and methodologies taught
      - Learning objectives and skills covered
      - Practical examples or case studies presented
      - Tools, frameworks, or techniques demonstrated
      - Questions asked by participants and answers provided
      - Exercises, homework, or practice assignments given
      - Resources, references, or recommended reading
      - Best practices or lessons learned shared
      - Follow-up topics or advanced concepts mentioned`,
    
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
    const { meeting_type, transcript, model = 'gemini-2.5-flash-preview-05-20' } = req.body;
    
    if (!transcript || !meeting_type) {
      res.status(400).json({ error: 'Missing transcript or meeting type' });
      return;
    }

    // Model configuration
    const MODEL_CONFIGS = {
      'gemini-2.5-flash-preview-05-20': {
        thinkingBudget: 1024
      },
      'gemini-2.5-pro-preview-06-05': {
        thinkingBudget: 2048
      },
      // Alternative Pro model name format
      'gemini-2p5-pro': {
        thinkingBudget: 2048
      },
      'gemini-2.0-pro-exp': {
        thinkingBudget: 2048
      }
    };

    const modelConfig = MODEL_CONFIGS[model] || MODEL_CONFIGS['gemini-2.5-flash-preview-05-20'];

    // Build Gemini request
    const isTraining = meeting_type === 'training';
    
    const systemInstruction = isTraining 
      ? `You are an expert Business Analyst and Educational Content Analyst. Analyze training lecture transcripts and extract learning-focused information.
    
    IMPORTANT: You must ALWAYS return a valid JSON object with this exact structure:
    {
      "summary": "Overview of training topics and key takeaways (2-3 sentences)",
      "learning_objectives": ["What skills/knowledge the lecture aimed to teach"],
      "concepts_covered": ["Key BA concepts, methodologies, frameworks taught"],
      "tools_demonstrated": ["Specific tools, techniques, or software shown"],
      "examples_presented": ["Case studies, real-world scenarios used"],
      "exercises_assigned": ["Practice work, homework, hands-on activities"],
      "qa_highlights": ["Important questions from students and instructor answers"],
      "resources_shared": ["Books, articles, templates, reference materials"],
      "skill_assessments": ["How competency will be measured or evaluated"],
      "prerequisites": ["What knowledge was assumed coming in"],
      "follow_up_topics": ["What will be covered in future sessions"]
    }
    
    Focus on educational content, learning outcomes, and skill development.`
      : `You are an expert Business Analyst assistant. Analyze meeting transcripts and extract key information.
    
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
      system_instruction: {
        role: 'system',
        parts: [{
          text: systemInstruction
        }]
      },
      contents: [{
        role: 'user',
        parts: [{ text: userPrompt }]
      }],
      generationConfig: {
        temperature: 0.3,
        responseMimeType: "application/json"
      },
      thinkingConfig: {
        thinkingBudget: modelConfig.thinkingBudget
      }
    };

    // Call Gemini API
    console.log(`Calling Gemini API with model: ${model}`);
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiRequest)
      }
    );

    if (!geminiResponse.ok) {
      const error = await geminiResponse.text();
      console.error('Gemini API error:', error);
      console.error('Status:', geminiResponse.status);
      console.error('Model:', model);
      res.status(500).json({ 
        error: 'Failed to analyze transcript',
        model: model,
        status: geminiResponse.status,
        details: error.substring(0, 500) // First 500 chars of error
      });
      return;
    }

    const geminiData = await geminiResponse.json();
    
    // Log the full response structure for debugging
    console.log('Gemini response structure:', JSON.stringify(geminiData, null, 2));
    
    // Extract the JSON response
    const analysisText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!analysisText) {
      console.error('No text found in Gemini response');
      console.error('Full response:', JSON.stringify(geminiData));
      throw new Error('No response from Gemini');
    }

    // Parse the JSON response
    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw response text:', analysisText);
      throw new Error(`Failed to parse Gemini response: ${parseError.message}`);
    }
    
    // Add meeting type to response
    analysis.meeting_type = meeting_type;

    res.status(200).json(analysis);

  } catch (error) {
    console.error('Function error:', error);
    res.status(500).json({ 
      error: 'An error occurred while processing your request',
      details: error.message 
    });
  }
}