// Document Generator Component
export const DocumentGeneratorComponent = () => ({
    // Component state
    selectedTemplate: 'brd',
    includeMetadata: true,
    documentTitle: '',
    documentVersion: '1.0',
    generatingDoc: false,
    
    // Available templates
    templates: {
        brd: {
            name: 'Business Requirements Document',
            icon: '📄',
            sections: ['Executive Summary', 'Business Objectives', 'Scope', 'Requirements', 'Assumptions', 'Constraints']
        },
        frs: {
            name: 'Functional Requirements Specification',
            icon: '⚙️',
            sections: ['Overview', 'Functional Requirements', 'Non-Functional Requirements', 'Use Cases', 'Data Requirements']
        },
        userStory: {
            name: 'User Stories',
            icon: '👤',
            format: 'As a [role], I want [feature], so that [benefit]'
        }
    },
    
    // Initialize component
    init() {
        // Set default title based on meeting type
        this.$watch('selectedTemplate', () => {
            this.updateDocumentTitle();
        });
    },
    
    // Update document title
    updateDocumentTitle() {
        const template = this.templates[this.selectedTemplate];
        const date = new Date().toISOString().split('T')[0];
        this.documentTitle = `${template.name} - ${date}`;
    },
    
    // Generate document from current results
    async generateDocument() {
        if (!this.$parent.results) {
            alert('Please analyze a meeting first');
            return;
        }
        
        this.generatingDoc = true;
        
        try {
            // Prepare document data
            const docData = {
                template: this.selectedTemplate,
                title: this.documentTitle,
                version: this.documentVersion,
                includeMetadata: this.includeMetadata,
                meetingData: this.$parent.results,
                meetingType: this.$parent.meetingType,
                generatedDate: new Date().toISOString()
            };
            
            // Call API to generate document
            const response = await fetch('/api/generate-document', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-passcode': sessionStorage.getItem('ba_passcode')
                },
                body: JSON.stringify(docData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to generate document');
            }
            
            const result = await response.json();
            
            // Download the generated document
            this.downloadDocument(result);
            
        } catch (error) {
            console.error('Document generation error:', error);
            alert('Error generating document: ' + error.message);
        } finally {
            this.generatingDoc = false;
        }
    },
    
    // Generate from multiple meetings
    async generateFromMultiple() {
        // For now, just use current results
        const selectedData = this.$parent.results ? [this.$parent.results] : [];
        
        if (selectedData.length === 0) {
            alert('Please select meetings from history');
            return;
        }
        
        this.generatingDoc = true;
        
        try {
            const docData = {
                template: this.selectedTemplate,
                title: this.documentTitle,
                version: this.documentVersion,
                includeMetadata: this.includeMetadata,
                meetings: selectedData,
                generatedDate: new Date().toISOString(),
                aggregated: true
            };
            
            const response = await fetch('/api/generate-document', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-passcode': sessionStorage.getItem('ba_passcode')
                },
                body: JSON.stringify(docData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to generate document');
            }
            
            const result = await response.json();
            this.downloadDocument(result);
            
        } catch (error) {
            console.error('Document generation error:', error);
            alert('Error generating document: ' + error.message);
        } finally {
            this.generatingDoc = false;
        }
    },
    
    // Download generated document
    downloadDocument(data) {
        // Create blob based on format
        let blob;
        let filename;
        
        if (data.format === 'html') {
            blob = new Blob([data.content], { type: 'text/html' });
            filename = `${this.documentTitle}.html`;
        } else if (data.format === 'markdown') {
            blob = new Blob([data.content], { type: 'text/markdown' });
            filename = `${this.documentTitle}.md`;
        } else {
            // Default to JSON
            blob = new Blob([JSON.stringify(data.content, null, 2)], { type: 'application/json' });
            filename = `${this.documentTitle}.json`;
        }
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    },
    
    // Preview document
    previewDocument() {
        // Implementation for document preview modal
        console.log('Preview not yet implemented');
    },
    
    // Get requirements count
    get requirementsCount() {
        if (!this.$parent.results?.requirements) return 0;
        return this.$parent.results.requirements.length;
    },
    
    // Get selected meetings count  
    get selectedMeetingsCount() {
        return this.$parent.selectedMeetings?.length || 0;
    }
});