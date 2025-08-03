// src/scripts/data/indexeddb.js
class IndexedDBManager {
    constructor() {
        this.dbName = 'EduraAppDB';
        this.version = 1;
        this.db = null;
        this.stores = {
            apiCache: 'api_cache',
            profiles: 'profiles',
            courses: 'courses',
            flashcards: 'flashcards',
            quiz: 'quiz',
            offlineQueue: 'offline_queue',
            staticAssets: 'static_assets'
        };
    }

    // Initialize IndexedDB
    async init() {
        // Jika DB sudah terbuka, langsung kembalikan
        if (this.db) {
            return this.db;
        }

        return new Promise((resolve, reject) => {
            // Menggunakan window.indexedDB untuk memastikan kita memanggil API browser
            const request = window.indexedDB.open(this.dbName, this.version);

            request.onerror = () => {
                console.error('❌ IndexedDB failed to open:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                //console.log('✅ IndexedDB opened successfully');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                //console.log('🔄 IndexedDB upgrade needed');
                const db = event.target.result;
                this.createStores(db);
            };
        });
    }
    // Create object stores
    createStores(db) {
        // API Cache store
        if (!db.objectStoreNames.contains(this.stores.apiCache)) {
            const apiCacheStore = db.createObjectStore(this.stores.apiCache, { keyPath: 'key' });
            apiCacheStore.createIndex('endpoint', 'endpoint', { unique: false });
            apiCacheStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Profiles store
        if (!db.objectStoreNames.contains(this.stores.profiles)) {
            const profileStore = db.createObjectStore(this.stores.profiles, { keyPath: 'type' });
        }

        // Courses store
        if (!db.objectStoreNames.contains(this.stores.courses)) {
            const coursesStore = db.createObjectStore(this.stores.courses, { keyPath: 'id' });
            coursesStore.createIndex('user_id', 'user_id', { unique: false });
            coursesStore.createIndex('updated_at', 'updated_at', { unique: false });
        }

        // Flashcards store
        if (!db.objectStoreNames.contains(this.stores.flashcards)) {
            const flashcardsStore = db.createObjectStore(this.stores.flashcards, { keyPath: 'course_id' });
        }

        // Quiz store
        if (!db.objectStoreNames.contains(this.stores.quiz)) {
            const quizStore = db.createObjectStore(this.stores.quiz, { keyPath: 'id' });
            quizStore.createIndex('course_id', 'course_id', { unique: false });
            quizStore.createIndex('session_number', 'session_number', { unique: false });
        }

        // Offline queue store
        if (!db.objectStoreNames.contains(this.stores.offlineQueue)) {
            const queueStore = db.createObjectStore(this.stores.offlineQueue, {
                keyPath: 'id',
                autoIncrement: true
            });
            queueStore.createIndex('timestamp', 'timestamp', { unique: false });
            queueStore.createIndex('priority', 'priority', { unique: false });
        }

        // Static assets store
        if (!db.objectStoreNames.contains(this.stores.staticAssets)) {
            const assetsStore = db.createObjectStore(this.stores.staticAssets, { keyPath: 'url' });
            assetsStore.createIndex('type', 'type', { unique: false });
            assetsStore.createIndex('size', 'size', { unique: false });
        }

        //console.log('✅ IndexedDB stores created successfully');
    }

    // Generic store operations
    async getFromStore(storeName, key) {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async addToStore(storeName, data) {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteFromStore(storeName, key) {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(key);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllFromStore(storeName) {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async clearStore(storeName) {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.clear();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // API Cache methods
    async cacheAPIResponse(key, endpoint, data, ttl = 300000) { // 5 minutes default
        const cacheData = {
            key,
            endpoint,
            data,
            timestamp: Date.now(),
            ttl,
            expires: Date.now() + ttl
        };

        try {
            await this.addToStore(this.stores.apiCache, cacheData);
            //console.log(`💾 API response cached: ${endpoint}`);
        } catch (error) {
            console.error('❌ Failed to cache API response:', error);
        }
    }

    async getCachedAPIResponse(key) {
        try {
            const cached = await this.getFromStore(this.stores.apiCache, key);

            if (!cached) return null;

            // Check if expired
            if (Date.now() > cached.expires) {
                await this.deleteFromStore(this.stores.apiCache, key);
                return null;
            }

            //console.log(`💾 Using cached API response: ${cached.endpoint}`);
            return cached.data;
        } catch (error) {
            console.error('❌ Failed to get cached API response:', error);
            return null;
        }
    }

    // Profile methods
    async cacheProfile(type, profileData) {
        const data = {
            type, // 'basic', 'student', 'teacher'
            data: profileData,
            timestamp: Date.now(),
            expires: Date.now() + (5 * 60 * 1000) // 5 minutes
        };

        try {
            await this.addToStore(this.stores.profiles, data);
            //console.log(`👤 Profile cached: ${type}`);
        } catch (error) {
            console.error('❌ Failed to cache profile:', error);
        }
    }

    async getCachedProfile(type) {
        try {
            const cached = await this.getFromStore(this.stores.profiles, type);

            if (!cached || Date.now() > cached.expires) {
                if (cached) await this.deleteFromStore(this.stores.profiles, type);
                return null;
            }

            return cached.data;
        } catch (error) {
            console.error('❌ Failed to get cached profile:', error);
            return null;
        }
    }

    // Course methods
    async cacheCourse(courseData) {
        const data = {
            ...courseData,
            cached_at: Date.now(),
            expires: Date.now() + (10 * 60 * 1000) // 10 minutes
        };

        try {
            await this.addToStore(this.stores.courses, data);
            //console.log(`📚 Course cached: ${courseData.id}`);
        } catch (error) {
            console.error('❌ Failed to cache course:', error);
        }
    }

    async getCachedCourse(courseId) {
        try {
            const cached = await this.getFromStore(this.stores.courses, courseId);

            if (!cached || Date.now() > cached.expires) {
                if (cached) await this.deleteFromStore(this.stores.courses, courseId);
                return null;
            }

            return cached;
        } catch (error) {
            console.error('❌ Failed to get cached course:', error);
            return null;
        }
    }

    async getCachedCourses() {
        try {
            const courses = await this.getAllFromStore(this.stores.courses);
            const validCourses = [];

            for (const course of courses) {
                if (Date.now() <= course.expires) {
                    validCourses.push(course);
                } else {
                    await this.deleteFromStore(this.stores.courses, course.id);
                }
            }

            return validCourses;
        } catch (error) {
            console.error('❌ Failed to get cached courses:', error);
            return [];
        }
    }

    // Offline queue methods
    async addToOfflineQueue(action, data, priority = 1) {
        const queueItem = {
            action,
            data,
            priority,
            timestamp: Date.now(),
            retries: 0,
            maxRetries: 3
        };

        try {
            await this.addToStore(this.stores.offlineQueue, queueItem);
            //console.log(`📥 Added to offline queue: ${action}`);
        } catch (error) {
            console.error('❌ Failed to add to offline queue:', error);
        }
    }

    async getOfflineQueue() {
        try {
            const queue = await this.getAllFromStore(this.stores.offlineQueue);
            return queue.sort((a, b) => b.priority - a.priority || a.timestamp - b.timestamp);
        } catch (error) {
            console.error('❌ Failed to get offline queue:', error);
            return [];
        }
    }

    async removeFromOfflineQueue(id) {
        try {
            await this.deleteFromStore(this.stores.offlineQueue, id);
            //console.log(`📤 Removed from offline queue: ${id}`);
        } catch (error) {
            console.error('❌ Failed to remove from offline queue:', error);
        }
    }

    // Static assets methods
    async cacheStaticAsset(url, blob, type, size) {
        const data = {
            url,
            blob,
            type,
            size,
            cached_at: Date.now()
        };

        try {
            await this.addToStore(this.stores.staticAssets, data);
            //console.log(`🖼️ Static asset cached: ${url}`);
        } catch (error) {
            console.error('❌ Failed to cache static asset:', error);
        }
    }

    async getCachedStaticAsset(url) {
        try {
            const cached = await this.getFromStore(this.stores.staticAssets, url);
            return cached ? cached.blob : null;
        } catch (error) {
            console.error('❌ Failed to get cached static asset:', error);
            return null;
        }
    }

    // Cleanup methods
    async cleanupExpiredCache() {
        try {
            //console.log('🧹 Starting cache cleanup...');

            // Clean API cache
            const apiCache = await this.getAllFromStore(this.stores.apiCache);
            for (const item of apiCache) {
                if (Date.now() > item.expires) {
                    await this.deleteFromStore(this.stores.apiCache, item.key);
                }
            }

            // Clean profiles
            const profiles = await this.getAllFromStore(this.stores.profiles);
            for (const profile of profiles) {
                if (Date.now() > profile.expires) {
                    await this.deleteFromStore(this.stores.profiles, profile.type);
                }
            }

            // Clean courses
            const courses = await this.getAllFromStore(this.stores.courses);
            for (const course of courses) {
                if (Date.now() > course.expires) {
                    await this.deleteFromStore(this.stores.courses, course.id);
                }
            }

            //console.log('✅ Cache cleanup completed');
        } catch (error) {
            console.error('❌ Cache cleanup failed:', error);
        }
    }

    // Database info
    async getDatabaseInfo() {
        if (!this.db) await this.init();

        const info = {
            name: this.dbName,
            version: this.version,
            stores: {}
        };

        for (const [key, storeName] of Object.entries(this.stores)) {
            try {
                const items = await this.getAllFromStore(storeName);
                info.stores[key] = {
                    name: storeName,
                    count: items.length,
                    size: JSON.stringify(items).length // Approximate size
                };
            } catch (error) {
                info.stores[key] = { name: storeName, count: 0, size: 0, error: error.message };
            }
        }

        return info;
    }

    // Clear all data
    async clearAllData() {
        try {
            for (const storeName of Object.values(this.stores)) {
                await this.clearStore(storeName);
            }
            //console.log('🗑️ All IndexedDB data cleared');
        } catch (error) {
            console.error('❌ Failed to clear all data:', error);
        }
    }
}

// Create singleton instance with a non-conflicting name
const dbManager = new IndexedDBManager();

// Auto cleanup every 30 minutes
setInterval(() => {
    dbManager.cleanupExpiredCache();
}, 30 * 60 * 1000);

export default dbManager;