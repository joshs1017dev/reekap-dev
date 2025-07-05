// Test Case Generator Component
export const TestGeneratorComponent = () => ({
    // Component state
    selectedRequirements: [],
    testTypes: {
        happy: true,
        edge: true,
        negative: true
    },
    includeTestData: true,
    testFormat: 'standard', // standard, bdd, excel
    generatingTests: false,
    generatedTests: [],
    
    // Test formats
    formats: {
        standard: {
            name: 'Standard Test Cases',
            icon: '✓',
            fields: ['Test ID', 'Description', 'Preconditions', 'Steps', 'Expected Result']
        },
        bdd: {
            name: 'BDD Scenarios',
            icon: '🥒',
            format: 'Given/When/Then'
        },
        excel: {
            name: 'Excel/CSV Export',
            icon: '📊',
            fields: ['ID', 'Requirement', 'Scenario', 'Steps', 'Expected', 'Priority']
        }
    },
    
    // Initialize component
    init() {
        // Reset when switching tabs
        this.$watch('$store.baAssistant.activeTab', (newTab) => {
            if (newTab === 'tests') {
                this.loadRequirements();
            }
        });
    },
    
    // Load requirements from current results
    loadRequirements() {
        if (this.$store.baAssistant.results?.requirements) {
            this.selectedRequirements = [];
            // Auto-select all requirements initially
            this.$store.baAssistant.results.requirements.forEach((req, index) => {
                this.selectedRequirements.push(index);
            });
        }
    },
    
    // Toggle requirement selection
    toggleRequirement(index) {
        const pos = this.selectedRequirements.indexOf(index);
        if (pos > -1) {
            this.selectedRequirements.splice(pos, 1);
        } else {
            this.selectedRequirements.push(index);
        }
    },
    
    // Check if requirement is selected
    isRequirementSelected(index) {
        return this.selectedRequirements.includes(index);
    },
    
    // Generate test cases
    async generateTestCases() {
        if (this.selectedRequirements.length === 0) {
            alert('Please select at least one requirement');
            return;
        }
        
        this.generatingTests = true;
        this.generatedTests = [];
        
        try {
            // Get selected requirements
            const requirements = this.selectedRequirements.map(index => 
                this.$store.baAssistant.results.requirements[index]
            );
            
            // Prepare request data
            const requestData = {
                requirements: requirements,
                testTypes: this.testTypes,
                includeTestData: this.includeTestData,
                format: this.testFormat,
                meetingContext: {
                    type: this.$store.baAssistant.meetingType,
                    decisions: this.$store.baAssistant.results.decisions || [],
                    assumptions: this.$store.baAssistant.results.assumptions || []
                }
            };
            
            // Call API
            const response = await fetch('/api/create-test-cases', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-passcode': this.$store.baAssistant.passcode
                },
                body: JSON.stringify(requestData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to generate test cases');
            }
            
            const result = await response.json();
            this.generatedTests = result.testCases;
            
        } catch (error) {
            console.error('Test generation error:', error);
            alert('Error generating test cases: ' + error.message);
        } finally {
            this.generatingTests = false;
        }
    },
    
    // Export test cases
    exportTestCases() {
        if (this.generatedTests.length === 0) {
            alert('No test cases to export');
            return;
        }
        
        let content;
        let filename;
        let mimeType;
        
        switch (this.testFormat) {
            case 'excel':
                // Convert to CSV
                content = this.convertToCSV(this.generatedTests);
                filename = 'test_cases.csv';
                mimeType = 'text/csv';
                break;
                
            case 'bdd':
                // Convert to Gherkin format
                content = this.convertToGherkin(this.generatedTests);
                filename = 'test_scenarios.feature';
                mimeType = 'text/plain';
                break;
                
            default:
                // Standard format as JSON
                content = JSON.stringify(this.generatedTests, null, 2);
                filename = 'test_cases.json';
                mimeType = 'application/json';
        }
        
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    },
    
    // Convert to CSV format
    convertToCSV(tests) {
        const headers = ['Test ID', 'Requirement', 'Type', 'Description', 'Steps', 'Expected Result', 'Test Data'];
        const rows = [headers];
        
        tests.forEach(test => {
            const row = [
                test.id,
                test.requirement,
                test.type,
                test.description,
                test.steps.join(' | '),
                test.expectedResult,
                test.testData ? JSON.stringify(test.testData) : ''
            ];
            rows.push(row);
        });
        
        return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    },
    
    // Convert to Gherkin format
    convertToGherkin(tests) {
        let content = 'Feature: Generated Test Scenarios\n\n';
        
        tests.forEach(test => {
            content += `Scenario: ${test.description}\n`;
            if (test.given) content += `  Given ${test.given}\n`;
            if (test.when) content += `  When ${test.when}\n`;
            if (test.then) content += `  Then ${test.then}\n`;
            content += '\n';
        });
        
        return content;
    },
    
    // Copy test to clipboard
    copyTest(test) {
        const text = `Test: ${test.description}\nSteps:\n${test.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\nExpected: ${test.expectedResult}`;
        navigator.clipboard.writeText(text);
        alert('Test case copied to clipboard');
    },
    
    // Get test type icon
    getTestTypeIcon(type) {
        const icons = {
            happy: '😊',
            edge: '⚠️',
            negative: '❌'
        };
        return icons[type] || '📝';
    },
    
    // Select all requirements
    selectAllRequirements() {
        if (!this.$store.baAssistant.results?.requirements) return;
        
        this.selectedRequirements = this.$store.baAssistant.results.requirements.map((_, index) => index);
    },
    
    // Clear selection
    clearSelection() {
        this.selectedRequirements = [];
    }
});