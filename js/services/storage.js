// Storage utilities for BA Assistant
export const StorageService = {
    // Check if localStorage is available
    isAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    },
    
    // Safe get from localStorage
    get(key, defaultValue = null) {
        if (!this.isAvailable()) return defaultValue;
        
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Storage get error:', error);
            return defaultValue;
        }
    },
    
    // Safe set to localStorage
    set(key, value) {
        if (!this.isAvailable()) return false;
        
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage set error:', error);
            // Handle quota exceeded error
            if (error.name === 'QuotaExceededError') {
                this.cleanup();
                // Try again
                try {
                    localStorage.setItem(key, JSON.stringify(value));
                    return true;
                } catch (e) {
                    return false;
                }
            }
            return false;
        }
    },
    
    // Remove item
    remove(key) {
        if (!this.isAvailable()) return;
        
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Storage remove error:', error);
        }
    },
    
    // Clear all BA Assistant data
    clearNamespace(namespace = 'ba_assistant') {
        if (!this.isAvailable()) return;
        
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(namespace)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.error('Storage clear error:', error);
        }
    },
    
    // Cleanup old data
    cleanup() {
        if (!this.isAvailable()) return;
        
        try {
            const now = Date.now();
            const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
            
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith('ba_assistant')) {
                    try {
                        const data = JSON.parse(localStorage.getItem(key));
                        if (data.lastUpdated) {
                            const age = now - new Date(data.lastUpdated).getTime();
                            if (age > maxAge) {
                                localStorage.removeItem(key);
                            }
                        }
                    } catch (e) {
                        // Invalid data, remove it
                        localStorage.removeItem(key);
                    }
                }
            });
        } catch (error) {
            console.error('Storage cleanup error:', error);
        }
    },
    
    // Get storage size
    getSize() {
        if (!this.isAvailable()) return 0;
        
        let size = 0;
        try {
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key) && key.startsWith('ba_assistant')) {
                    size += localStorage.getItem(key).length + key.length;
                }
            }
        } catch (error) {
            console.error('Storage size error:', error);
        }
        return size;
    },
    
    // Create namespaced storage
    createNamespace(namespace) {
        return {
            get: (key, defaultValue) => this.get(`${namespace}_${key}`, defaultValue),
            set: (key, value) => this.set(`${namespace}_${key}`, value),
            remove: (key) => this.remove(`${namespace}_${key}`),
            clear: () => this.clearNamespace(namespace)
        };
    }
};