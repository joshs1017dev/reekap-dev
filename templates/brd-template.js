// Business Requirements Document Template
export const BRDTemplate = {
    generateHTML: (data) => {
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
        .metadata p { margin: 5px 0; }
        ul { padding-left: 30px; }
        li { margin-bottom: 8px; }
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
        .section { margin-bottom: 40px; }
        @media print {
            body { margin: 0; padding: 10px; }
            .metadata { break-inside: avoid; }
            .requirement { break-inside: avoid; }
        }
    </style>
</head>
<body>
    <h1>${title}</h1>
    
    ${includeMetadata ? `
    <div class="metadata">
        <p><strong>Version:</strong> ${version}</p>
        <p><strong>Generated:</strong> ${new Date(generatedDate).toLocaleDateString()}</p>
        <p><strong>Meeting Type:</strong> ${data.meetingType || 'N/A'}</p>
        ${data.aggregated ? `<p><strong>Source:</strong> Multiple meetings (${data.meetings?.length || 0})</p>` : ''}
    </div>
    ` : ''}
    
    <div class="section">
        <h2>1. Executive Summary</h2>
        <p>${meetingData.summary || 'This document outlines the business requirements gathered from stakeholder meetings and analysis sessions.'}</p>
    </div>
    
    <div class="section">
        <h2>2. Business Objectives</h2>
        ${meetingData.decisions && meetingData.decisions.length > 0 ? `
            <p>The following key business objectives have been identified:</p>
            <ul>
                ${meetingData.decisions.map(decision => `<li>${decision}</li>`).join('')}
            </ul>
        ` : '<p>Business objectives to be defined through further stakeholder engagement.</p>'}
    </div>
    
    <div class="section">
        <h2>3. Scope</h2>
        <h3>3.1 In Scope</h3>
        ${meetingData.requirements && meetingData.requirements.length > 0 ? `
            <p>The following items are within the scope of this project:</p>
            <ul>
                ${meetingData.requirements.slice(0, Math.ceil(meetingData.requirements.length / 2)).map(req => `<li>${req}</li>`).join('')}
            </ul>
        ` : '<p>Scope items to be defined.</p>'}
        
        <h3>3.2 Out of Scope</h3>
        <p>The following items are explicitly out of scope for this phase:</p>
        <ul>
            <li>Items to be determined based on stakeholder feedback</li>
        </ul>
    </div>
    
    <div class="section">
        <h2>4. Business Requirements</h2>
        ${meetingData.requirements && meetingData.requirements.length > 0 ? 
            meetingData.requirements.map((req, index) => `
                <div class="requirement">
                    <span class="requirement-id">BR-${String(index + 1).padStart(3, '0')}</span>
                    <p>${req}</p>
                </div>
            `).join('') : '<p>Requirements to be documented.</p>'}
    </div>
    
    <div class="section">
        <h2>5. Assumptions</h2>
        ${meetingData.assumptions && meetingData.assumptions.length > 0 ? `
            <ul>
                ${meetingData.assumptions.map(assumption => `<li>${assumption}</li>`).join('')}
            </ul>
        ` : '<p>No assumptions have been documented at this time.</p>'}
    </div>
    
    <div class="section">
        <h2>6. Constraints</h2>
        ${meetingData.risks && meetingData.risks.length > 0 ? `
            <ul>
                ${meetingData.risks.map(risk => `<li>${risk}</li>`).join('')}
            </ul>
        ` : '<p>No constraints have been identified at this time.</p>'}
    </div>
    
    <div class="section">
        <h2>7. Dependencies</h2>
        ${meetingData.dependencies && meetingData.dependencies.length > 0 ? `
            <ul>
                ${meetingData.dependencies.map(dep => `<li>${dep}</li>`).join('')}
            </ul>
        ` : '<p>Dependencies to be identified during detailed analysis.</p>'}
    </div>
    
    <div class="section">
        <h2>8. Next Steps</h2>
        ${meetingData.actionItems && meetingData.actionItems.length > 0 ? `
            <table>
                <thead>
                    <tr>
                        <th>Action Item</th>
                        <th>Owner</th>
                        <th>Due Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${meetingData.actionItems.map(item => `
                        <tr>
                            <td>${item}</td>
                            <td>TBD</td>
                            <td>TBD</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        ` : '<p>Next steps to be defined.</p>'}
    </div>
    
    <div class="section">
        <h2>9. Approval</h2>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Signature</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
            </tbody>
        </table>
    </div>
</body>
</html>
        `;
    },
    
    generateMarkdown: (data) => {
        const { title, version, meetingData, includeMetadata, generatedDate } = data;
        
        let markdown = `# ${title}\n\n`;
        
        if (includeMetadata) {
            markdown += `**Version:** ${version}  \n`;
            markdown += `**Generated:** ${new Date(generatedDate).toLocaleDateString()}  \n`;
            markdown += `**Meeting Type:** ${data.meetingType || 'N/A'}  \n`;
            if (data.aggregated) {
                markdown += `**Source:** Multiple meetings (${data.meetings?.length || 0})  \n`;
            }
            markdown += '\n---\n\n';
        }
        
        markdown += `## 1. Executive Summary\n\n`;
        markdown += `${meetingData.summary || 'This document outlines the business requirements gathered from stakeholder meetings and analysis sessions.'}\n\n`;
        
        markdown += `## 2. Business Objectives\n\n`;
        if (meetingData.decisions && meetingData.decisions.length > 0) {
            markdown += `The following key business objectives have been identified:\n\n`;
            meetingData.decisions.forEach(decision => {
                markdown += `- ${decision}\n`;
            });
        } else {
            markdown += `Business objectives to be defined through further stakeholder engagement.\n`;
        }
        markdown += '\n';
        
        markdown += `## 3. Scope\n\n`;
        markdown += `### 3.1 In Scope\n\n`;
        if (meetingData.requirements && meetingData.requirements.length > 0) {
            markdown += `The following items are within the scope of this project:\n\n`;
            meetingData.requirements.slice(0, Math.ceil(meetingData.requirements.length / 2)).forEach(req => {
                markdown += `- ${req}\n`;
            });
        } else {
            markdown += `Scope items to be defined.\n`;
        }
        markdown += '\n';
        
        markdown += `### 3.2 Out of Scope\n\n`;
        markdown += `The following items are explicitly out of scope for this phase:\n\n`;
        markdown += `- Items to be determined based on stakeholder feedback\n\n`;
        
        markdown += `## 4. Business Requirements\n\n`;
        if (meetingData.requirements && meetingData.requirements.length > 0) {
            meetingData.requirements.forEach((req, index) => {
                markdown += `**BR-${String(index + 1).padStart(3, '0')}**  \n${req}\n\n`;
            });
        } else {
            markdown += `Requirements to be documented.\n\n`;
        }
        
        markdown += `## 5. Assumptions\n\n`;
        if (meetingData.assumptions && meetingData.assumptions.length > 0) {
            meetingData.assumptions.forEach(assumption => {
                markdown += `- ${assumption}\n`;
            });
        } else {
            markdown += `No assumptions have been documented at this time.\n`;
        }
        markdown += '\n';
        
        markdown += `## 6. Constraints\n\n`;
        if (meetingData.risks && meetingData.risks.length > 0) {
            meetingData.risks.forEach(risk => {
                markdown += `- ${risk}\n`;
            });
        } else {
            markdown += `No constraints have been identified at this time.\n`;
        }
        markdown += '\n';
        
        markdown += `## 7. Dependencies\n\n`;
        if (meetingData.dependencies && meetingData.dependencies.length > 0) {
            meetingData.dependencies.forEach(dep => {
                markdown += `- ${dep}\n`;
            });
        } else {
            markdown += `Dependencies to be identified during detailed analysis.\n`;
        }
        markdown += '\n';
        
        markdown += `## 8. Next Steps\n\n`;
        if (meetingData.actionItems && meetingData.actionItems.length > 0) {
            markdown += `| Action Item | Owner | Due Date |\n`;
            markdown += `|-------------|-------|----------|\n`;
            meetingData.actionItems.forEach(item => {
                markdown += `| ${item} | TBD | TBD |\n`;
            });
        } else {
            markdown += `Next steps to be defined.\n`;
        }
        markdown += '\n';
        
        markdown += `## 9. Approval\n\n`;
        markdown += `| Name | Role | Signature | Date |\n`;
        markdown += `|------|------|-----------|------|\n`;
        markdown += `|      |      |           |      |\n`;
        markdown += `|      |      |           |      |\n`;
        
        return markdown;
    }
};