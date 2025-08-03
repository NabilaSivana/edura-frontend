// src/scripts/data/cache.js - Enhanced version
import dbManager from './indexeddb.js';
const memoryCache = {};

const Cache = {
    // Initialize cache system
    async init() {
        try {
            await dbManager.init();
            console.log('✅ Cache system initialized');

            // Load critical data from dbManager to memory
            await this.loadCriticalDataToMemory();
        } catch (error) {
            console.warn('⚠️ dbManager not available, using memory cache only:', error);
        }
    },

    // Load critical data from dbManager to memory for faster access
    async loadCriticalDataToMemory() {
        try {
            // Load profiles
            const profiles = ['basic', 'student', 'teacher'];
            for (const type of profiles) {
                const cached = await dbManager.getCachedProfile(type);
                if (cached) {
                    memoryCache[`profile_${type}`] = {
                        value: cached,
                        timestamp: Date.now(),
                        ttl: 5 * 60 * 1000 // 5 minutes
                    };
                }
            }

            console.log('📝 Critical data loaded to memory cache');
        } catch (error) {
            console.error('❌ Failed to load critical data:', error);
        }
    },

    // Set data with optional TTL and persistence
    async set(key, value, ttl = null, persistTodbManager = true) {
        const data = {
            value: value,
            timestamp: Date.now(),
            ttl: ttl
        };

        // Always store in memory cache
        memoryCache[key] = data;

        // Optionally store in dbManager for persistence
        if (persistTodbManager && this.shouldPersist(key)) {
            try {
                await this.persistTodbManager(key, value, ttl);
            } catch (error) {
                console.warn('⚠️ Failed to persist to dbManager:', error);
            }
        }
    },

    // Get data from memory first, then dbManager
    async get(key, fallbackTodbManager = true) {
        // Check memory cache first
        const memoryData = this.getFromMemory(key);
        if (memoryData !== null) {
            return memoryData;
        }

        // Fallback to dbManager if enabled
        if (fallbackTodbManager) {
            try {
                const persistedData = await this.getFromdbManager(key);
                if (persistedData !== null) {
                    // Load back to memory cache
                    memoryCache[key] = {
                        value: persistedData,
                        timestamp: Date.now(),
                        ttl: this.getTTLForKey(key)
                    };
                    return persistedData;
                }
            } catch (error) {
                console.warn('⚠️ Failed to get from dbManager:', error);
            }
        }

        return null;
    },

    // Get from memory cache only
    getFromMemory(key) {
        const data = memoryCache[key];
        if (!data) return null;

        // Check if data has expired
        if (data.ttl && (Date.now() - data.timestamp) > data.ttl) {
            delete memoryCache[key];
            return null;
        }

        return data.value;
    },

    // Get from dbManager
    async getFromdbManager(key) {
        try {
            if (key.startsWith('api_')) {
                return await dbManager.getCachedAPIResponse(key);
            } else if (key.startsWith('profile_')) {
                const type = key.replace('profile_', '');
                return await dbManager.getCachedProfile(type);
            } else if (key.startsWith('course_')) {
                const courseId = key.replace('course_', '');
                const course = await dbManager.getCachedCourse(courseId);
                return course ? course : null;
            }

            return null;
        } catch (error) {
            console.error('❌ Failed to get from dbManager:', error);
            return null;
        }
    },

    // Persist data to dbManager based on key type
    async persistTodbManager(key, value, ttl) {
        try {
            if (key.startsWith('api_')) {
                const endpoint = this.extractEndpointFromKey(key);
                await dbManager.cacheAPIResponse(key, endpoint, value, ttl || 300000);
            } else if (key.startsWith('profile_')) {
                const type = key.replace('profile_', '');
                await dbManager.cacheProfile(type, value);
            } else if (key.startsWith('course_') && typeof value === 'object' && value.id) {
                await dbManager.cacheCourse(value);
            }
        } catch (error) {
            console.error('❌ Failed to persist to dbManager:', error);
        }
    },

    // Clear specific key or all cache
    async clear(key) {
        if (key) {
            delete memoryCache[key];

            // Also remove from dbManager
            try {
                if (key.startsWith('profile_')) {
                    const type = key.replace('profile_', '');
                    await dbManager.deleteFromStore(dbManager.stores.profiles, type);
                } else if (key.startsWith('course_')) {
                    const courseId = key.replace('course_', '');
                    await dbManager.deleteFromStore(dbManager.stores.courses, courseId);
                } else if (key.startsWith('api_')) {
                    await dbManager.deleteFromStore(dbManager.stores.apiCache, key);
                }
            } catch (error) {
                console.warn('⚠️ Failed to clear from dbManager:', error);
            }
        } else {
            // Clear all memory cache
            Object.keys(memoryCache).forEach(k => delete memoryCache[k]);

            // Clear all dbManager
            try {
                await dbManager.clearAllData();
            } catch (error) {
                console.warn('⚠️ Failed to clear dbManager:', error);
            }
        }
    },

    // Clear all cache for a specific pattern
    async clearPattern(pattern) {
        // Clear from memory
        Object.keys(memoryCache).forEach(key => {
            if (key.includes(pattern)) {
                delete memoryCache[key];
            }
        });

        // Clear from dbManager
        try {
            if (pattern.includes('profile')) {
                await dbManager.clearStore(dbManager.stores.profiles);
            } else if (pattern.includes('course')) {
                await dbManager.clearStore(dbManager.stores.courses);
            } else if (pattern.includes('api')) {
                await dbManager.clearStore(dbManager.stores.apiCache);
            }
        } catch (error) {
            console.warn('⚠️ Failed to clear pattern from dbManager:', error);
        }
    },

    // Remove specific key (alias for clear with key)
    async remove(key) {
        return this.clear(key);
    },

    // Check if cache exists and is valid
    async has(key) {
        const value = await this.get(key);
        return value !== null;
    },

    // Get cache age in milliseconds
    getAge(key) {
        const data = memoryCache[key];
        if (!data) return null;
        return Date.now() - data.timestamp;
    },

    // Get cache statistics
    async getStats() {
        const memoryKeys = Object.keys(memoryCache);
        const memorySize = JSON.stringify(memoryCache).length;

        let dbManagerInfo = null;
        try {
            dbManagerInfo = await dbManager.getDatabaseInfo();
        } catch (error) {
            console.warn('⚠️ Failed to get dbManager info:', error);
        }

        return {
            memory: {
                keys: memoryKeys.length,
                size: memorySize,
                items: memoryKeys.map(key => ({
                    key,
                    age: this.getAge(key),
                    size: JSON.stringify(memoryCache[key]).length
                }))
            },
            dbManager: dbManagerInfo
        };
    },

    // Clean up expired cache entries
    async cleanup() {
        console.log('🧹 Starting cache cleanup...');

        // Cleanup memory cache
        Object.keys(memoryCache).forEach(key => {
            this.getFromMemory(key); // This will auto-delete expired entries
        });

        // Cleanup dbManager
        try {
            await dbManager.cleanupExpiredCache();
        } catch (error) {
            console.warn('⚠️ dbManager cleanup failed:', error);
        }

        console.log('✅ Cache cleanup completed');
    },

    // Helper methods
    shouldPersist(key) {
        // Persist API responses, profiles, and courses
        return key.startsWith('api_') ||
            key.startsWith('profile_') ||
            key.startsWith('course_');
    },

    getTTLForKey(key) {
        if (key.startsWith('profile_')) return 5 * 60 * 1000; // 5 minutes
        if (key.startsWith('course_')) return 10 * 60 * 1000; // 10 minutes
        if (key.startsWith('api_')) return 5 * 60 * 1000; // 5 minutes
        return 5 * 60 * 1000; // Default 5 minutes
    },

    extractEndpointFromKey(key) {
        // Extract endpoint from API cache key
        if (key.startsWith('api_')) {
            return key.replace('api_', '').split('_')[0];
        }
        return key;
    },

    // Offline queue management
    async addToOfflineQueue(action, data, priority = 1) {
        try {
            await dbManager.addToOfflineQueue(action, data, priority);
        } catch (error) {
            console.error('❌ Failed to add to offline queue:', error);
        }
    },

    async processOfflineQueue() {
        try {
            const queue = await dbManager.getOfflineQueue();
            console.log(`📥 Processing ${queue.length} offline queue items`);

            for (const item of queue) {
                try {
                    await this.processOfflineQueueItem(item);
                    await dbManager.removeFromOfflineQueue(item.id);
                } catch (error) {
                    console.error('❌ Failed to process queue item:', error);
                    // Increment retry count
                    if (item.retries < item.maxRetries) {
                        item.retries++;
                        await dbManager.addToStore(dbManager.stores.offlineQueue, item);
                    } else {
                        await dbManager.removeFromOfflineQueue(item.id);
                        console.error('❌ Max retries reached, removing item from queue');
                    }
                }
            }
        } catch (error) {
            console.error('❌ Failed to process offline queue:', error);
        }
    },

    async processOfflineQueueItem(item) {
        // This should be implemented based on your specific offline actions
        console.log('Processing offline queue item:', item.action);

        switch (item.action) {
            case 'sync_profile':
                // Implement profile sync
                break;
            case 'sync_course_progress':
                // Implement course progress sync
                break;
            case 'submit_quiz':
                // Implement quiz submission
                break;
            default:
                console.warn('Unknown offline action:', item.action);
        }
    },

    // Check network status and process queue when online
    async handleNetworkChange() {
        if (navigator.onLine) {
            console.log('🌐 Network is online, processing offline queue');
            await this.processOfflineQueue();
        } else {
            console.log('📴 Network is offline, caching operations');
        }
    }
};

// Auto cleanup every 5 minutes
setInterval(() => Cache.cleanup(), 5 * 60 * 1000);

// Listen for network changes
window.addEventListener('online', () => Cache.handleNetworkChange());
window.addEventListener('offline', () => Cache.handleNetworkChange());

// Initialize cache system when module loads
Cache.init();

export default Cache;