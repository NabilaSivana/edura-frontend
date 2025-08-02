// src/scripts/utils/offline-manager.js - Fixed for GET operations only
import Cache from '../data/cache.js';
import indexedDB from '../data/indexeddb.js';

class OfflineManager {
    constructor() {
        this.isOnline = navigator.onLine;
        this.queuedOperations = [];
        this.syncInProgress = false;

        this.init();
    }

    async init() {
        // Initialize IndexedDB
        await indexedDB.init();

        // Setup network event listeners
        this.setupNetworkListeners();

        // Process any pending queue on initialization
        if (this.isOnline) {
            await this.processPendingOperations();
        }

        console.log('🔄 Offline Manager initialized (GET operations only)');
    }

    setupNetworkListeners() {
        window.addEventListener('online', () => {
            console.log('🌐 Network: Online');
            this.isOnline = true;
            this.handleNetworkChange();
        });

        window.addEventListener('offline', () => {
            console.log('📴 Network: Offline');
            this.isOnline = false;
            this.handleNetworkChange();
        });
    }

    async handleNetworkChange() {
        if (this.isOnline) {
            // Process offline queue when coming back online
            await this.processPendingOperations();

            // Refresh critical data (GET operations only)
            await this.refreshCriticalData();

            // Emit online event
            this.emitNetworkEvent('online');
        } else {
            // Emit offline event
            this.emitNetworkEvent('offline');
        }
    }

    emitNetworkEvent(status) {
        window.dispatchEvent(new CustomEvent('networkchange', {
            detail: { isOnline: status === 'online', status }
        }));
    }

    // ============================================
    // OFFLINE QUEUE MANAGEMENT - ONLY FOR CRITICAL OPERATIONS
    // ============================================

    async queueOperation(operation) {
        const queueItem = {
            id: Date.now() + Math.random(),
            ...operation,
            timestamp: Date.now(),
            retries: 0,
            maxRetries: 3,
            priority: operation.priority || 1
        };

        try {
            await indexedDB.addToOfflineQueue(
                queueItem.action,
                queueItem.data,
                queueItem.priority
            );

            console.log(`📥 Queued offline operation: ${queueItem.action}`);
            return queueItem.id;
        } catch (error) {
            console.error('❌ Failed to queue operation:', error);
            throw error;
        }
    }

    async processPendingOperations() {
        if (this.syncInProgress || !this.isOnline) {
            return;
        }

        this.syncInProgress = true;

        try {
            const queue = await indexedDB.getOfflineQueue();
            if (queue.length === 0) {
                return;
            }

            console.log(`🔄 Processing ${queue.length} offline operations`);

            for (const item of queue) {
                try {
                    console.log(`🚀 Executing queued operation: ${item.action}`, item.data);
                    await this.executeQueuedOperation(item);
                    await indexedDB.removeFromOfflineQueue(item.id);
                    console.log(`✅ Processed: ${item.action}`);
                } catch (error) {
                    console.error(`❌ Failed to process ${item.action}:`, error);

                    // Handle retry logic
                    if (item.retries < item.maxRetries) {
                        item.retries++;
                        await indexedDB.addToStore(indexedDB.stores.offlineQueue, item);
                        console.log(`🔄 Retry ${item.retries}/${item.maxRetries} for ${item.action}`);
                    } else {
                        console.error(`❌ Max retries reached for ${item.action}, removing from queue`);
                        await indexedDB.removeFromOfflineQueue(item.id);
                    }
                }
            }

            // Emit sync complete event
            window.dispatchEvent(new CustomEvent('offlinesync', {
                detail: { processed: queue.length }
            }));

        } catch (error) {
            console.error('❌ Failed to process offline queue:', error);
        } finally {
            this.syncInProgress = false;
        }
    }

    async executeQueuedOperation(item) {
        const { action, data } = item;

        console.log(`🔧 Executing operation: ${action}`, data);

        // Import API dynamically to avoid circular dependency
        const { default: Api } = await import('../data/api.js');

        switch (action) {
            case 'update_checkpoint':
                console.log('📍 Updating checkpoint:', data);
                return await Api.updateStudentCheckpoint(data.courseId);

            case 'update_profile':
                console.log('👤 Updating profile:', data);
                return await Api._updateProfileDirect(data);

            case 'update_student_profile':
                console.log('👨‍🎓 Updating student profile:', data);
                return await Api._updateStudentProfileDirect(data);

            case 'update_teacher_profile':
                console.log('👨‍🏫 Updating teacher profile:', data);
                return await Api._updateTeacherProfileDirect(data);

            default:
                throw new Error(`Unknown offline action: ${action}`);
        }
    }

    // ============================================
    // CRITICAL OPERATIONS - NEVER QUEUE THESE
    // ============================================

    async directOperation(action, data) {
        console.log(`🚨 DIRECT: Critical operation ${action}`, data);

        if (!this.isOnline) {
            throw new Error('Cannot perform this operation while offline - please connect to internet');
        }

        try {
            const { default: Api } = await import('../data/api.js');

            switch (action) {
                case 'create_course':
                    console.log('🚨 DIRECT: Creating course');
                    return await Api.createCourse(data);

                case 'generate_flashcards':
                    console.log('🚨 DIRECT: Generating flashcards');
                    return await Api.generateFlashcards(data.courseId);

                case 'generate_final_exam':
                    console.log('🚨 DIRECT: Generating final exam');
                    return await Api.generateFinalExam(data.courseId);

                case 'submit_quiz':
                    console.log('🚨 DIRECT: Submitting quiz');
                    return await Api.submitQuiz(data.courseId, data.sessionNumber, data.answers, data.retry);

                case 'submit_final_exam':
                    console.log('🚨 DIRECT: Submitting final exam');
                    return await Api.submitFinalExam(data.courseId, data.answers);

                default:
                    throw new Error(`Direct operation not supported for action: ${action}`);
            }
        } catch (error) {
            console.error(`🚨 DIRECT OPERATION FAILED for ${action}:`, error);
            throw error;
        }
    }

    // ============================================
    // SAFE OPERATION WRAPPERS - ONLY FOR PROFILE UPDATES
    // ============================================

    async safeWriteOperation(action, data, priority = 1) {
        console.log(`🚀 SafeWriteOperation called: ${action}`, data);

        // Define which operations can be queued vs must be direct
        const queueableOperations = [
            'update_checkpoint',
            'update_profile',
            'update_student_profile',
            'update_teacher_profile'
        ];

        const criticalOperations = [
            'create_course',
            'generate_flashcards',
            'generate_final_exam',
            'submit_quiz',
            'submit_final_exam'
        ];

        // Critical operations - ALWAYS execute directly
        if (criticalOperations.includes(action)) {
            return await this.directOperation(action, data);
        }

        // Queueable operations - can be deferred
        if (queueableOperations.includes(action)) {
            try {
                if (this.isOnline) {
                    // Try to execute immediately when online
                    console.log(`🌐 Online - executing ${action} immediately`);
                    const { default: Api } = await import('../data/api.js');

                    let result;
                    switch (action) {
                        case 'update_checkpoint':
                            result = await Api.updateStudentCheckpoint(data.courseId);
                            break;
                        case 'update_profile':
                            result = await Api._updateProfileDirect(data);
                            break;
                        case 'update_student_profile':
                            result = await Api._updateStudentProfileDirect(data);
                            break;
                        case 'update_teacher_profile':
                            result = await Api._updateTeacherProfileDirect(data);
                            break;
                        default:
                            throw new Error(`Unknown action: ${action}`);
                    }

                    console.log(`✅ Operation ${action} completed successfully:`, result);
                    return result;
                } else {
                    // Queue for later when offline
                    console.log(`📴 Offline - queuing ${action} for later`);
                    await this.queueOperation({ action, data, priority });
                    return { queued: true, message: 'Operation queued for when network is available' };
                }
            } catch (error) {
                console.error(`❌ Operation ${action} failed:`, error);

                // If online but failed, queue it for retry
                if (this.isOnline) {
                    console.warn(`⚠️ Online operation ${action} failed, queuing for retry:`, error);
                    await this.queueOperation({ action, data, priority });
                    return {
                        queued: true,
                        message: 'Operation failed but queued for retry',
                        error: error.message
                    };
                }
                throw error;
            }
        }

        // Unknown operation
        throw new Error(`Unknown operation type: ${action}`);
    }

    // ============================================
    // DATA SYNCHRONIZATION - GET OPERATIONS ONLY
    // ============================================

    async refreshCriticalData() {
        try {
            console.log('🔄 Refreshing critical data (GET operations only)...');

            // Import API dynamically
            const { default: Api } = await import('../data/api.js');

            // Refresh profile data
            try {
                const profile = await Api.getProfile();
                await Cache.set('profile_basic', profile, 5 * 60 * 1000, true);
            } catch (error) {
                console.warn('⚠️ Failed to refresh basic profile:', error);
            }

            // Refresh student data if user is student
            try {
                const studentProfile = await Api.getStudentProfile();
                if (studentProfile) {
                    await Cache.set('profile_student', studentProfile, 5 * 60 * 1000, true);
                }
            } catch (error) {
                console.warn('⚠️ Failed to refresh student profile:', error);
            }

            // Refresh teacher data if user is teacher
            try {
                const teacherProfile = await Api.getTeacherProfile();
                if (teacherProfile) {
                    await Cache.set('profile_teacher', teacherProfile, 5 * 60 * 1000, true);
                }
            } catch (error) {
                console.warn('⚠️ Failed to refresh teacher profile:', error);
            }

            // Refresh courses
            try {
                const courses = await Api.getStudentCourses();
                for (const course of courses) {
                    await Cache.set(`course_${course.id}`, course, 10 * 60 * 1000, true);
                }
            } catch (error) {
                console.warn('⚠️ Failed to refresh courses:', error);
            }

            console.log('✅ Critical data refreshed');
        } catch (error) {
            console.error('❌ Failed to refresh critical data:', error);
        }
    }

    // ============================================
    // OFFLINE-FIRST GET API METHODS
    // ============================================

    async getProfileOfflineFirst() {
        try {
            // Try cache first
            let profile = await Cache.get('profile_basic', true);

            if (profile && this.isOnline) {
                // Background refresh if online
                this.backgroundRefreshProfile();
            } else if (!profile && this.isOnline) {
                // Fetch if not cached and online
                const { default: Api } = await import('../data/api.js');
                profile = await Api.getProfile();
                await Cache.set('profile_basic', profile, 5 * 60 * 1000, true);
            }

            return profile;
        } catch (error) {
            console.error('❌ Failed to get profile offline-first:', error);
            throw error;
        }
    }

    async getCoursesOfflineFirst() {
        try {
            // Try cache first
            const cachedCourses = await indexedDB.getCachedCourses();

            if (cachedCourses.length > 0 && this.isOnline) {
                // Background refresh if online
                this.backgroundRefreshCourses();
                return cachedCourses;
            } else if (cachedCourses.length === 0 && this.isOnline) {
                // Fetch if not cached and online
                const { default: Api } = await import('../data/api.js');
                const courses = await Api.getStudentCourses();

                // Cache each course
                for (const course of courses) {
                    await indexedDB.cacheCourse(course);
                }

                return courses;
            }

            return cachedCourses;
        } catch (error) {
            console.error('❌ Failed to get courses offline-first:', error);
            throw error;
        }
    }

    async backgroundRefreshProfile() {
        try {
            const { default: Api } = await import('../data/api.js');
            const profile = await Api.getProfile();
            await Cache.set('profile_basic', profile, 5 * 60 * 1000, true);
        } catch (error) {
            console.warn('⚠️ Background profile refresh failed:', error);
        }
    }

    async backgroundRefreshCourses() {
        try {
            const { default: Api } = await import('../data/api.js');
            const courses = await Api.getStudentCourses();

            for (const course of courses) {
                await indexedDB.cacheCourse(course);
            }
        } catch (error) {
            console.warn('⚠️ Background courses refresh failed:', error);
        }
    }

    // ============================================
    // UTILITY METHODS
    // ============================================

    getNetworkStatus() {
        return {
            isOnline: this.isOnline,
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt,
                saveData: navigator.connection.saveData
            } : null
        };
    }

    async getOfflineQueueStatus() {
        try {
            const queue = await indexedDB.getOfflineQueue();
            return {
                count: queue.length,
                items: queue.map(item => ({
                    id: item.id,
                    action: item.action,
                    timestamp: item.timestamp,
                    retries: item.retries,
                    priority: item.priority
                }))
            };
        } catch (error) {
            console.error('❌ Failed to get offline queue status:', error);
            return { count: 0, items: [] };
        }
    }

    async clearOfflineQueue() {
        try {
            await indexedDB.clearStore(indexedDB.stores.offlineQueue);
            console.log('🗑️ Offline queue cleared');
        } catch (error) {
            console.error('❌ Failed to clear offline queue:', error);
        }
    }

    async forceSyncNow() {
        if (!this.isOnline) {
            throw new Error('Cannot sync while offline');
        }

        await this.processPendingOperations();
        await this.refreshCriticalData();
    }
}

// Create singleton instance
const offlineManager = new OfflineManager();

export default offlineManager;