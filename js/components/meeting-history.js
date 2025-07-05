// Meeting History Component - Database backed
export const MeetingHistoryComponent = () => ({
    // Component state
    searchQuery: '',
    filterType: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
    showDetails: {},
    dbResults: [],
    loadingResults: false,
    dbError: null,
    selectedMeetings: [],
    
    // Meeting type labels
    meetingTypeLabels: {
        standup: 'Daily Stand-up',
        planning: 'Sprint Planning',
        review: 'Sprint Review',
        elicitation: 'Requirements Elicitation',
        retro: 'Retrospective',
        refinement: 'Backlog Refinement',
        stakeholder: 'Stakeholder Meeting',
        training: 'Training Lecture',
        other: 'Other'
    },
    
    // Initialize component
    async init() {
        await this.loadDatabaseResults();
    },
    
    // Load results from database
    async loadDatabaseResults() {
        this.loadingResults = true;
        this.dbError = null;
        
        try {
            const response = await fetch('/api/results?limit=100', {
                headers: {
                    'x-passcode': sessionStorage.getItem('ba_passcode')
                }
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to load results');
            }
            
            this.dbResults = await response.json();
        } catch (error) {
            console.error('Error loading results:', error);
            this.dbError = error.message;
            // If database not configured, dbResults stays empty
            if (error.message.includes('Database not configured')) {
                this.dbError = 'Database not configured. Results will not persist.';
            }
        } finally {
            this.loadingResults = false;
        }
    },
    
    // Transform database results to consistent format
    get meetingHistory() {
        return this.dbResults.map(result => ({
            id: result.id,
            timestamp: result.created_at,
            summary: result.summary,
            recap: result.recap,
            actionItems: result.action_items || [],
            decisions: result.decisions || [],
            risks: result.risks || [],
            requirements: result.requirements || [],
            openQuestions: result.open_questions || [],
            dependencies: result.dependencies || [],
            importantDates: result.important_dates || [],
            nextSteps: result.next_steps || [],
            metadata: {
                meetingType: result.meeting_type,
                transcriptLength: result.transcript_length
            }
        }));
    },
    
    // Get filtered meetings
    get filteredMeetings() {
        let meetings = [...this.meetingHistory];
        
        // Filter by type
        if (this.filterType !== 'all') {
            meetings = meetings.filter(m => m.metadata?.meetingType === this.filterType);
        }
        
        // Filter by search query
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            meetings = meetings.filter(m => {
                // Search in summary
                if (m.summary?.toLowerCase().includes(query)) return true;
                // Search in action items
                if (m.actionItems?.some(item => item.toLowerCase().includes(query))) return true;
                // Search in requirements
                if (m.requirements?.some(req => req.toLowerCase().includes(query))) return true;
                // Search in decisions
                if (m.decisions?.some(dec => dec.toLowerCase().includes(query))) return true;
                return false;
            });
        }
        
        // Sort meetings
        meetings.sort((a, b) => {
            let compareValue = 0;
            
            switch (this.sortBy) {
                case 'date':
                    compareValue = new Date(b.timestamp) - new Date(a.timestamp);
                    break;
                case 'type':
                    compareValue = (a.metadata?.meetingType || '').localeCompare(b.metadata?.meetingType || '');
                    break;
                case 'items':
                    const aCount = (a.actionItems?.length || 0) + (a.requirements?.length || 0);
                    const bCount = (b.actionItems?.length || 0) + (b.requirements?.length || 0);
                    compareValue = bCount - aCount;
                    break;
            }
            
            return this.sortOrder === 'desc' ? compareValue : -compareValue;
        });
        
        return meetings;
    },
    
    // Toggle meeting details
    toggleDetails(meetingId) {
        this.showDetails[meetingId] = !this.showDetails[meetingId];
    },
    
    // Toggle meeting selection
    toggleSelection(meetingId) {
        const index = this.selectedMeetings.indexOf(meetingId);
        if (index > -1) {
            this.selectedMeetings.splice(index, 1);
        } else {
            this.selectedMeetings.push(meetingId);
        }
    },
    
    // Check if meeting is selected
    isSelected(meetingId) {
        return this.selectedMeetings.includes(meetingId);
    },
    
    // Delete meeting - NOT IMPLEMENTED for database
    deleteMeeting(meetingId) {
        alert('Delete functionality not available for database-stored results. Results are permanently stored.');
    },
    
    // Load meeting for analysis
    loadMeeting(meeting) {
        // Set the meeting data back to the main form
        this.$parent.meetingType = meeting.metadata?.meetingType || '';
        this.$parent.results = meeting;
        this.$parent.mainTab = 'analyze';
        
        // Scroll to top
        window.scrollTo(0, 0);
    },
    
    // Export selected meetings
    exportSelected() {
        const selectedData = this.meetingHistory.filter(m => 
            this.selectedMeetings.includes(m.id)
        );
        
        if (selectedData.length === 0) {
            alert('Please select meetings to export');
            return;
        }
        
        const exportData = {
            exportDate: new Date().toISOString(),
            meetings: selectedData,
            count: selectedData.length
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `selected_meetings_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    },
    
    // Refresh results from database
    async refreshResults() {
        await this.loadDatabaseResults();
    },
    
    // Get meeting age
    getMeetingAge(timestamp) {
        const now = new Date();
        const meetingDate = new Date(timestamp);
        const diffMs = now - meetingDate;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    },
    
    // Get item counts
    getItemCounts(meeting) {
        return {
            actions: meeting.actionItems?.length || 0,
            requirements: meeting.requirements?.length || 0,
            risks: meeting.risks?.length || 0,
            decisions: meeting.decisions?.length || 0
        };
    },
    
    // Clear all filters
    clearFilters() {
        this.searchQuery = '';
        this.filterType = 'all';
        this.sortBy = 'date';
        this.sortOrder = 'desc';
    }
});