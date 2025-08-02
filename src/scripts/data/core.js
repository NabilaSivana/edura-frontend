// src/scripts/data/core.js - Core functionality and authentication
import CONFIG from "./config.js";
import Cache from "./cache.js";
import dbManager from "./indexeddb.js";

// Import offline manager dynamically to avoid circular dependency
let offlineManager = null;

const getOfflineManager = async () => {
    if (!offlineManager) {
        const { default: OfflineManager } = await import('../utils/offline-manager.js');
        offlineManager = OfflineManager;
    }
    return offlineManager;
};

// Cache TTLs (Time To Live) dalam milidetik
export const CACHE_TTL = {
    PROFILE: 5 * 60 * 1000,        // 5 menit
    COURSES: 10 * 60 * 1000,       // 10 menit
    COURSE_CONTENT: 15 * 60 * 1000, // 15 menit
    RECOMMENDATIONS: 30 * 60 * 1000, // 30 menit
    ENUMS: 60 * 60 * 1000,         // 1 jam
    CLASSES: 10 * 60 * 1000,       // 10 menit
    STUDENTS: 5 * 60 * 1000,       // 5 menit
    DEFAULT: 5 * 60 * 1000         // 5 menit default
};

export class CoreAPI {
    constructor() {
        // Variabel untuk cache profil (backward compatibility)
        this.profileCache = {
            basic: null,
            student: null,
            teacher: null,
            timestamp: null,
        };
        this.CACHE_DURATION = 5 * 60 * 1000;
    }

    // ============================================
    // CORE HELPERS & NETWORK UTILITIES
    // ============================================

    // Helper untuk mendapatkan headers
    _getHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
    }

    // Helper untuk membuat cache key
    _getCacheKey(endpoint, params = {}) {
        const paramStr = Object.keys(params)
            .sort()
            .map(key => `${key}=${params[key]}`)
            .join('&');
        return `api_${endpoint}${paramStr ? '_' + paramStr : ''}`;
    }

    // Check network status
    _isOnline() {
        return navigator.onLine;
    }

    // Enhanced fetch with offline support and retries
    async _fetchWithOfflineSupport(url, options = {}, retries = 3) {
        let lastError;

        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                const response = await fetch(url, options);

                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('token');
                        Cache.clear(); // Clear all cache on auth error
                        window.location.hash = '#/login';
                    }
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || `HTTP ${response.status}`);
                }

                return response;
            } catch (error) {
                lastError = error;

                // If network error and not last attempt, wait before retry
                if (!this._isOnline() || error.name === 'NetworkError') {
                    if (attempt < retries - 1) {
                        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
                        continue;
                    }
                }

                // If not a network error, don't retry
                throw error;
            }
        }

        throw lastError;
    }

    // Helper untuk get dengan cache dan offline support
    async _getWithCache(endpoint, options = {}, ttl = CACHE_TTL.DEFAULT, forceRefresh = false) {
        const cacheKey = this._getCacheKey(endpoint, options.params);

        if (forceRefresh) {
            console.log(`🔄 Force Refresh: Invalidating cache for ${cacheKey}`);
            await this._invalidateCache(cacheKey);
        }

        // Try cache first
        const cachedData = await Cache.get(cacheKey);
        if (cachedData) {
            console.log(`[API Cache Hit] ${endpoint}`);

            // Background refresh if online
            if (this._isOnline()) {
                this._backgroundRefresh(endpoint, options, ttl, cacheKey);
            }

            return cachedData;
        }

        console.log(`[API Cache Miss] ${endpoint} - fetching from server`);

        // If offline and no cache, throw error
        if (!this._isOnline()) {
            throw new Error(`Data tidak tersedia offline untuk ${endpoint}`);
        }

        // Build URL with params
        let url = `${CONFIG.BASE_URL}${endpoint}`;
        if (options.params) {
            const params = new URLSearchParams(options.params);
            url += `?${params}`;
        }

        // Fetch from API with offline support
        const response = await this._fetchWithOfflineSupport(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                ...options.headers
            }
        });

        const data = await response.json();

        // Save to cache
        await Cache.set(cacheKey, data, ttl);

        return data;
    }

    // Background refresh for cache
    async _backgroundRefresh(endpoint, options, ttl, cacheKey) {
        try {
            // Build URL with params
            let url = `${CONFIG.BASE_URL}${endpoint}`;
            if (options.params) {
                const params = new URLSearchParams(options.params);
                url += `?${params}`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    ...options.headers
                }
            });

            if (response.ok) {
                const data = await response.json();
                await Cache.set(cacheKey, data, ttl);
                console.log(`[Background Refresh] ${endpoint} updated`);
            }
        } catch (error) {
            console.warn(`[Background Refresh Failed] ${endpoint}:`, error);
        }
    }

    // Enhanced write operation with offline queue support
    async _writeWithOfflineSupport(endpoint, data, method = 'POST', priority = 1) {
        const url = `${CONFIG.BASE_URL}${endpoint}`;
        const options = {
            method: method,
            headers: this._getHeaders(),
            body: JSON.stringify(data)
        };

        // Try immediate execution if online
        if (this._isOnline()) {
            try {
                const response = await this._fetchWithOfflineSupport(url, options);
                return await response.json();
            } catch (error) {
                // If failed but online, queue for retry
                console.warn(`⚠️ Online operation failed, queuing for retry: ${endpoint}`, error);

                const offlineManager = await getOfflineManager();
                await offlineManager.queueOperation({
                    action: this._getActionFromEndpoint(endpoint, method),
                    data: data,
                    priority: priority
                });

                return {
                    queued: true,
                    message: 'Operasi gagal tetapi telah dijadwalkan untuk dicoba ulang'
                };
            }
        } else {
            // Queue for later execution
            console.log(`📴 Offline - queuing operation: ${endpoint}`);

            const offlineManager = await getOfflineManager();
            await offlineManager.queueOperation({
                action: this._getActionFromEndpoint(endpoint, method),
                data: data,
                priority: priority
            });

            return {
                queued: true,
                message: 'Operasi dijadwalkan untuk dieksekusi saat jaringan tersedia'
            };
        }
    }

    // Helper to map endpoint to action for offline queue
    _getActionFromEndpoint(endpoint, method) {
        const endpointMap = {
            '/student/quiz/submit': 'submit_quiz',
            '/student/final-exam/submit': 'submit_final_exam',
            '/student/courses/*/checkpoint': 'update_checkpoint',
            '/profile': 'update_profile',
            '/student/profile': 'update_student_profile',
            '/teacher/profile': 'update_teacher_profile',
            '/student/course/create': 'create_course',
            '/student/flashcards/generate': 'generate_flashcards'
        };

        // Check for exact match first
        if (endpointMap[endpoint]) {
            return endpointMap[endpoint];
        }

        // Check for pattern match with more specific patterns
        for (const [pattern, action] of Object.entries(endpointMap)) {
            if (pattern.includes('*')) {
                const regex = new RegExp(pattern.replace('*', '\\d+'));
                if (endpoint.match(regex)) {
                    return action;
                }
            }
        }

        // Add method-specific logic for better mapping
        if (endpoint.includes('/student/profile') && method === 'PUT') {
            return 'update_student_profile';
        }

        if (endpoint.includes('/teacher/profile') && method === 'PUT') {
            return 'update_teacher_profile';
        }

        if (endpoint.includes('/profile') && method === 'PUT') {
            return 'update_profile';
        }

        // Default action based on method
        return method === 'POST' ? 'create_data' :
            method === 'PUT' ? 'update_data' :
                method === 'DELETE' ? 'delete_data' : 'unknown_action';
    }

    // Invalidate cache untuk endpoint tertentu
    async _invalidateCache(pattern) {
        await Cache.clearPattern(pattern);
    }

    // Helper method to enhance error messages
    _enhanceError(error) {
        let errorMessage = error.message || 'Gagal melakukan operasi';

        if (errorMessage.includes('429')) {
            if (errorMessage.includes('Course sedang digenerate') || errorMessage.includes('sedang digenerate')) {
                errorMessage = 'Course sedang digenerate. Tunggu selesai atau gunakan rekomendasi yang sudah ada.';
            } else if (errorMessage.includes('overload')) {
                errorMessage = 'Server sedang overload. Coba gunakan rekomendasi yang sudah ada atau tunggu beberapa menit.';
            } else {
                errorMessage = 'Terlalu banyak permintaan. Silakan tunggu sebentar sebelum mencoba lagi.';
            }
        } else if (errorMessage.includes('upgrade') || errorMessage.includes('kuota')) {
            // Keep quota messages as is
        } else if (errorMessage.includes('internet') || errorMessage.includes('network')) {
            errorMessage = 'Koneksi internet diperlukan untuk operasi ini.';
        } else if (errorMessage.includes('401')) {
            errorMessage = 'Sesi Anda telah berakhir. Silakan login kembali.';
        } else if (errorMessage.includes('400')) {
            errorMessage = 'Data yang dikirim tidak valid. Periksa kembali input Anda.';
        } else if (errorMessage.includes('500')) {
            errorMessage = 'Terjadi kesalahan server. Silakan coba lagi nanti.';
        }

        return new Error(errorMessage);
    }

    // ============================================
    // AUTHENTICATION APIs
    // ============================================

    async postSetupTeacherPassword(data) {
        try {
            const response = await fetch(`${CONFIG.BASE_URL}/setup-teacher-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Setup password failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Setup teacher password error:', error);
            throw error;
        }
    }

    async postResendTeacherSetupLink(data) {
        try {
            const response = await fetch(`${CONFIG.BASE_URL}/resend-teacher-setup-link`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Resend setup link failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Resend teacher setup link error:', error);
            throw error;
        }
    }

    async login({ email, password }) {
        const response = await fetch(`${CONFIG.BASE_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Email atau password salah");
        }

        // Clear all cache on login
        await Cache.clear();
        this.profileCache = { basic: null, student: null, teacher: null, timestamp: null };

        return response.json();
    }

    async register({ full_name, email, password, role }) {
        const response = await fetch(`${CONFIG.BASE_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ full_name, email, password, role }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        return response.json();
    }

    async forgotPassword(email) {
        const response = await fetch(`${CONFIG.BASE_URL}/forgot-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            throw new Error("Gagal mengirim email reset");
        }

        return response.json();
    }

    async postVerifyEmail({ token }) {
        const response = await fetch(
            `${CONFIG.BASE_URL}/verify-email?token=${token}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error("Verification failed.");
        }

        return response.json();
    }

    async getVerifyEmail(params) {
        try {
            const queryString = new URLSearchParams(params).toString();
            const response = await fetch(`${CONFIG.BASE_URL}/verify-email?${queryString}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Email verification failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Email verification error:', error);
            throw error;
        }
    }

    async postSendMagicLink(data) {
        try {
            const response = await fetch(`${CONFIG.BASE_URL}/send-magic-link`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Send magic link failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Send magic link error:', error);
            throw error;
        }
    }

    async postResetPassword({ token, new_password }) {
        const response = await fetch(`${CONFIG.BASE_URL}/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, new_password }),
        });

        if (!response.ok) {
            throw new Error("Reset password failed.");
        }

        return response.json();
    }

    async sendMagicLink(email) {
        const response = await fetch(`${CONFIG.BASE_URL}/send-magic-link`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            throw new Error("Gagal mengirim magic link");
        }

        return response.json();
    }


    async verifyOtp({ email, otp }) {
        const response = await fetch(`${CONFIG.BASE_URL}/verify-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, otp }),
        });

        const data = await response.json();

        return {
            status: response.status,
            ok: response.ok,
            data
        };
    }

    async resendOtp({ email }) {
        const response = await fetch(`${CONFIG.BASE_URL}/resend-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        return {
            status: response.status,
            ok: response.ok,
            data
        };
    }

    // ============================================
    // PROFILE APIs (Enhanced with Offline Support)
    // ============================================

    async getProfile(forceRefresh = false) {
        // Check memory cache first (backward compatibility)
        const now = Date.now();
        if (this.profileCache.basic && (now - this.profileCache.timestamp < this.CACHE_DURATION)) {
            return this.profileCache.basic;
        }

        try {
            const data = await this._getWithCache('/profile', {}, CACHE_TTL.PROFILE, forceRefresh);
            return data.profile;
        } catch (error) {
            // Try offline-first approach if failed
            if (!this._isOnline()) {
                try {
                    const offlineManager = await getOfflineManager();
                    return await offlineManager.getProfileOfflineFirst();
                } catch (offlineError) {
                    console.error('❌ Offline profile fetch failed:', offlineError);
                }
            }
            throw error;
        }
    }

    // Direct profile update
    async _updateProfileDirect(data) {
        try {
            const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/profile`, {
                method: 'PUT',
                headers: this._getHeaders(),
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('❌ Direct profile update failed:', error);
            throw error;
        }
    }

    async updateProfile(data) {
        try {
            if (navigator.onLine) {
                // Try direct execution first
                const result = await this._updateProfileDirect(data);
                await this._invalidateCache('profile');
                return result;
            } else {
                // Queue for offline execution
                const offlineManager = await getOfflineManager();
                return await offlineManager.safeWriteOperation('update_profile', data, 2);
            }
        } catch (error) {
            // If online but failed, try to queue for retry
            if (navigator.onLine) {
                console.warn('⚠️ Profile update failed, queuing for retry:', error);
                const offlineManager = await getOfflineManager();
                return await offlineManager.safeWriteOperation('update_profile', data, 2);
            }
            throw error;
        }
    }

    // ============================================
    // UTILITY METHODS
    // ============================================

    // Clear all cache
    clearAllCache() {
        Cache.clear();
        this.profileCache = { basic: null, student: null, teacher: null, timestamp: null };
    }

    // Clear cache for specific user type
    clearUserCache(userType) {
        switch (userType) {
            case 'student':
                this._invalidateCache('student');
                this.profileCache.student = null;
                break;
            case 'teacher':
                this._invalidateCache('teacher');
                this.profileCache.teacher = null;
                break;
            default:
                this._invalidateCache('profile');
                this.profileCache.basic = null;
        }
    }
}

// Create singleton instance
const coreAPI = new CoreAPI();

export default coreAPI;