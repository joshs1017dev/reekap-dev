// Simplified state management for BA Assistant - Database backed
export const createStore = () => {
    return {
        // Core state
        authenticated: false,
        passcode: '',
        authError: '',
        selectedModel: 'gemini-2.5-flash-preview-05-20',
        meetingType: '',
        transcript: '',
        loading: false,
        error: '',
        results: null,
        
        // UI state - no persistence needed
        selectedMeetings: [],
        activeTab: 'analyze',
        
        // Initialize (no localStorage)
        init() {
            // Nothing to load from localStorage anymore
        },
        
        // Clear current analysis
        clearAnalysis() {
            this.results = null;
            this.transcript = '';
            this.meetingType = '';
            this.error = '';
        }
    };
};