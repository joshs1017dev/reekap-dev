import { BRDTemplate } from '../templates/brd-template.js';

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

    // Validate passcode
    const passcode = req.headers['x-passcode'];
    if (passcode !== process.env.SINGLE_PASSCODE) {
        res.status(401).json({ error: 'Invalid passcode' });
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const { 
            template, 
            title, 
            version, 
            includeMetadata, 
            meetingData, 
            meetings, 
            generatedDate,
            aggregated = false
        } = req.body;

        // Aggregate data if multiple meetings
        let data = {
            title,
            version,
            includeMetadata,
            generatedDate,
            meetingType: meetingData?.metadata?.meetingType,
            aggregated
        };

        if (aggregated && meetings) {
            // Aggregate data from multiple meetings
            data.meetingData = aggregateMeetingData(meetings);
            data.meetings = meetings;
        } else {
            // Use single meeting data
            data.meetingData = meetingData;
        }

        let content = '';
        let format = 'html';

        // Generate document based on template
        switch (template) {
            case 'brd':
                content = BRDTemplate.generateHTML(data);
                break;
                
            case 'frs':
                content = generateFRS(data);
                break;
                
            case 'userStory':
                content = generateUserStories(data);
                break;
                
            default:
                throw new Error('Invalid template type');
        }

        res.status(200).json({
            success: true,
            format,
            content,
            title,
            template
        });

    } catch (error) {
        console.error('Document generation error:', error);
        res.status(500).json({ 
            error: 'Failed to generate document',
            details: error.message 
        });
    }
}

// Aggregate data from multiple meetings
function aggregateMeetingData(meetings) {
    const aggregated = {
        summary: 'This document aggregates requirements and decisions from multiple meetings.',
        requirements: [],
        decisions: [],
        risks: [],
        actionItems: [],
        assumptions: [],
        dependencies: [],
        open_questions: []
    };

    meetings.forEach(meeting => {
        if (meeting.requirements) {
            aggregated.requirements.push(...meeting.requirements);
        }
        if (meeting.decisions) {
            aggregated.decisions.push(...meeting.decisions);
        }
        if (meeting.risks) {
            aggregated.risks.push(...meeting.risks);
        }
        if (meeting.action_items || meeting.actionItems) {
            aggregated.actionItems.push(...(meeting.action_items || meeting.actionItems));
        }
        if (meeting.assumptions) {
            aggregated.assumptions.push(...meeting.assumptions);
        }
        if (meeting.dependencies) {
            aggregated.dependencies.push(...meeting.dependencies);
        }
        if (meeting.open_questions) {
            aggregated.open_questions.push(...meeting.open_questions);
        }
    });

    // Remove duplicates
    Object.keys(aggregated).forEach(key => {
        if (Array.isArray(aggregated[key])) {
            aggregated[key] = [...new Set(aggregated[key])];
        }
    });

    return aggregated;
}

// Generate FRS document
function generateFRS(data) {
    const { title, version, meetingData, includeMetadata, generatedDate } = data;
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1, h2, h3 { color: #2c3e50; }
        h1 { border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        h2 { border-bottom: 1px solid #ecf0f1; padding-bottom: 5px; margin-top: 30px; }
        .metadata {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 30px;
        }
        .requirement {
            background: #e8f4f8;
            padding: 15px;
            margin: 10px 0;
            border-left: 4px solid #3498db;
            border-radius: 0 5px 5px 0;
        }
        .requirement-id {
            font-weight: bold;
            color: #2980b9;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        th {
            background: #f4f4f4;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <h1>${title}</h1>
    
    ${includeMetadata ? `
    <div class="metadata">
        <p><strong>Version:</strong> ${version}</p>
        <p><strong>Generated:</strong> ${new Date(generatedDate).toLocaleDateString()}</p>
        <p><strong>Document Type:</strong> Functional Requirements Specification</p>
    </div>
    ` : ''}
    
    <h2>1. Overview</h2>
    <p>${meetingData.summary || 'This document specifies the functional requirements for the system.'}</p>
    
    <h2>2. Functional Requirements</h2>
    ${meetingData.requirements && meetingData.requirements.length > 0 ? 
        meetingData.requirements.map((req, index) => `
            <div class="requirement">
                <span class="requirement-id">FR-${String(index + 1).padStart(3, '0')}</span>
                <p>${req}</p>
                <p><strong>Priority:</strong> High</p>
                <p><strong>Status:</strong> To Be Implemented</p>
            </div>
        `).join('') : '<p>Functional requirements to be documented.</p>'}
    
    <h2>3. Non-Functional Requirements</h2>
    <div class="requirement">
        <span class="requirement-id">NFR-001</span>
        <p>Performance: The system shall respond to user requests within 3 seconds under normal load.</p>
    </div>
    <div class="requirement">
        <span class="requirement-id">NFR-002</span>
        <p>Security: All user data shall be encrypted at rest and in transit.</p>
    </div>
    
    <h2>4. Use Cases</h2>
    ${meetingData.decisions && meetingData.decisions.length > 0 ? `
        <p>Based on the decisions made, the following use cases have been identified:</p>
        <table>
            <thead>
                <tr>
                    <th>Use Case ID</th>
                    <th>Description</th>
                    <th>Actors</th>
                    <th>Preconditions</th>
                </tr>
            </thead>
            <tbody>
                ${meetingData.decisions.slice(0, 5).map((decision, index) => `
                    <tr>
                        <td>UC-${String(index + 1).padStart(3, '0')}</td>
                        <td>${decision}</td>
                        <td>User, System</td>
                        <td>User is authenticated</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    ` : '<p>Use cases to be defined based on requirements analysis.</p>'}
    
    <h2>5. Data Requirements</h2>
    <p>The system shall maintain the following data entities:</p>
    <ul>
        <li>User profiles with authentication credentials</li>
        <li>Transaction records with full audit trail</li>
        <li>System configuration parameters</li>
    </ul>
    
    <h2>6. Interface Requirements</h2>
    <p>The system shall provide the following interfaces:</p>
    <ul>
        <li>Web-based user interface accessible via modern browsers</li>
        <li>RESTful API for third-party integrations</li>
        <li>Administrative console for system management</li>
    </ul>
</body>
</html>
    `;
}

// Generate User Stories
function generateUserStories(data) {
    const { title, meetingData, includeMetadata, generatedDate } = data;
    
    const stories = meetingData.requirements?.map((req, index) => ({
        id: `US-${String(index + 1).padStart(3, '0')}`,
        story: convertToUserStory(req),
        acceptanceCriteria: generateAcceptanceCriteria(req)
    })) || [];
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .story-card {
            background: #f9f9f9;
            border: 1px solid #ddd;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .story-id {
            font-weight: bold;
            color: #2980b9;
            font-size: 14px;
        }
        .story-text {
            font-size: 16px;
            margin: 10px 0;
            font-style: italic;
        }
        .criteria {
            background: #e9f7ef;
            padding: 10px;
            border-left: 3px solid #27ae60;
            margin: 10px 0;
        }
        h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
    </style>
</head>
<body>
    <h1>${title}</h1>
    
    ${includeMetadata ? `
    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 30px;">
        <p><strong>Generated:</strong> ${new Date(generatedDate).toLocaleDateString()}</p>
        <p><strong>Total Stories:</strong> ${stories.length}</p>
    </div>
    ` : ''}
    
    ${stories.map(story => `
        <div class="story-card">
            <div class="story-id">${story.id}</div>
            <div class="story-text">${story.story}</div>
            <div class="criteria">
                <strong>Acceptance Criteria:</strong>
                <ul>
                    ${story.acceptanceCriteria.map(criteria => `<li>${criteria}</li>`).join('')}
                </ul>
            </div>
            <div style="margin-top: 10px;">
                <strong>Story Points:</strong> TBD | 
                <strong>Priority:</strong> Medium | 
                <strong>Sprint:</strong> Backlog
            </div>
        </div>
    `).join('')}
</body>
</html>
    `;
}

// Convert requirement to user story format
function convertToUserStory(requirement) {
    // Simple heuristic to convert requirements to user story format
    const lowerReq = requirement.toLowerCase();
    
    let role = 'user';
    let action = requirement;
    let benefit = 'achieve my goals efficiently';
    
    if (lowerReq.includes('admin')) {
        role = 'administrator';
    } else if (lowerReq.includes('manager')) {
        role = 'manager';
    } else if (lowerReq.includes('customer')) {
        role = 'customer';
    }
    
    if (lowerReq.includes('so that')) {
        const parts = requirement.split(/so that/i);
        action = parts[0].trim();
        benefit = parts[1].trim();
    }
    
    return `As a ${role}, I want ${action}, so that ${benefit}`;
}

// Generate acceptance criteria for a requirement
function generateAcceptanceCriteria(requirement) {
    const criteria = [];
    
    // Basic criteria
    criteria.push(`Given the ${requirement.split(' ')[0]} is available`);
    criteria.push('When the user performs the required action');
    criteria.push('Then the system should respond as expected');
    
    // Add specific criteria based on requirement keywords
    if (requirement.toLowerCase().includes('validate')) {
        criteria.push('And appropriate validation messages should be displayed');
    }
    
    if (requirement.toLowerCase().includes('save') || requirement.toLowerCase().includes('store')) {
        criteria.push('And the data should be persisted to the database');
    }
    
    if (requirement.toLowerCase().includes('display') || requirement.toLowerCase().includes('show')) {
        criteria.push('And the information should be clearly visible to the user');
    }
    
    return criteria;
}