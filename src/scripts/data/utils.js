// src/scripts/data/utils.js - Utility functions and common APIs
import coreAPI, { CACHE_TTL } from './core.js';
import CONFIG from './config.js';

export class UtilsAPI extends coreAPI.constructor {
    constructor() {
        super();
    }

    // ============================================
    // UTILITY APIs
    // ============================================

    async getSnapToken() {
        return this._getWithCache('/payment/snap-token', {}, CACHE_TTL.DEFAULT);
    }

    async getCurrentUser() {
        return this._getWithCache('/me', {}, CACHE_TTL.PROFILE);
    }

    // Enhanced getEnums with fallback data
    async getEnums() {
        try {
            const data = await this._getWithCache('/enums', {}, CACHE_TTL.ENUMS);

            // Validate and ensure data has required structure
            const validatedData = {
                program_studi: Array.isArray(data.program_studi) ? data.program_studi : [
                    'Teknik Informatika',
                    'Teknik Listrik',
                    'Teknik Elektronika',
                    'Teknik Mesin',
                    'Administrasi Bisnis',
                    'Akuntansi',
                    'Arsitektur',
                    'Periklanan',
                    'Manajemen',
                    'Teknik Industri',
                    'Pendidikan Biologi',
                    'Pendidikan Matematika',
                    'Kehutanan',
                    'Farmasi',
                    'Demografi',
                    'Geografi',
                    'Keperawatan',
                    'Gizi'
                ],
                perguruan_tinggi: Array.isArray(data.perguruan_tinggi) ? data.perguruan_tinggi : [
                    'Politeknik Negeri Semarang',
                    'Politeknik Negeri Batam',
                    'Politeknik Negeri Madiun',
                    'Politeknik Negeri Pontianak',
                    'Politeknik Negeri Ketapang',
                    'Politeknik Negeri Sambas',
                    'Universitas Diponegoro',
                    'Universitas Negeri Semarang',
                    'Universitas Dian Nuswantoro',
                    'Politeknik Media Kreatif',
                    'Universitas Muhammadiyah Semarang',
                    'Universitas PGRI Semarang',
                    'Universitas Islam Negeri Semarang',
                    'Universitas Sultan Ageng Tirtayasa',
                    'Universitas Gadjah Mada',
                    'Universitas Negeri Sebelas Maret',
                    'Universitas Negeri Yogyakarta',
                    'Bina Sarana Informatika'
                ]
            };

            console.log('✅ Enums data loaded successfully:', validatedData);
            return validatedData;

        } catch (error) {
            console.warn('⚠️ Failed to fetch enums, using fallback data:', error);

            // Return fallback data if API fails
            return {
                program_studi: [
                    'Teknik Informatika',
                    'Teknik Listrik',
                    'Teknik Elektronika',
                    'Teknik Mesin',
                    'Administrasi Bisnis',
                    'Akuntansi',
                    'Arsitektur',
                    'Periklanan',
                    'Manajemen',
                    'Teknik Industri',
                    'Pendidikan Biologi',
                    'Pendidikan Matematika',
                    'Kehutanan',
                    'Farmasi',
                    'Demografi',
                    'Geografi',
                    'Keperawatan',
                    'Gizi'
                ],
                perguruan_tinggi: [
                    'Politeknik Negeri Semarang',
                    'Politeknik Negeri Batam',
                    'Politeknik Negeri Madiun',
                    'Politeknik Negeri Pontianak',
                    'Politeknik Negeri Ketapang',
                    'Politeknik Negeri Sambas',
                    'Universitas Diponegoro',
                    'Universitas Negeri Semarang',
                    'Universitas Dian Nuswantoro',
                    'Politeknik Media Kreatif',
                    'Universitas Muhammadiyah Semarang',
                    'Universitas PGRI Semarang',
                    'Universitas Islam Negeri Semarang',
                    'Universitas Sultan Ageng Tirtayasa',
                    'Universitas Gadjah Mada',
                    'Universitas Negeri Sebelas Maret',
                    'Universitas Negeri Yogyakarta',
                    'Bina Sarana Informatika'
                ]
            };
        }
    }

    // ============================================
    // CLASS CODE UTILITIES
    // ============================================

    async getClassCodeInfo(code) {
        // This is a public endpoint - no auth needed
        const response = await fetch(`${CONFIG.BASE_URL}/public/class-code-info?code=${code}`);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Invalid class code');
        }

        return response.json();
    }

    async checkClassCode(code) {
        // Alias for getClassCodeInfo
        return this.getClassCodeInfo(code);
    }

    // ============================================
    // OFFLINE-FIRST API METHODS
    // ============================================

    // Get profile with offline-first strategy
    async getProfileOfflineFirst() {
        try {
            const { default: offlineManager } = await import('../utils/offline-manager.js');
            return await offlineManager.getProfileOfflineFirst();
        } catch (error) {
            console.error('❌ Failed to get profile offline-first:', error);
            throw error;
        }
    }

    // Get courses with offline-first strategy
    async getCoursesOfflineFirst() {
        try {
            const { default: offlineManager } = await import('../utils/offline-manager.js');
            return await offlineManager.getCoursesOfflineFirst();
        } catch (error) {
            console.error('❌ Failed to get courses offline-first:', error);
            throw error;
        }
    }

    // Safe write operation with offline support
    async safeWriteOperation(action, data, priority = 1) {
        try {
            const { default: offlineManager } = await import('../utils/offline-manager.js');
            return await offlineManager.safeWriteOperation(action, data, priority);
        } catch (error) {
            console.error('❌ Safe write operation failed:', error);
            throw error;
        }
    }

    // ============================================
    // VALIDATION HELPERS
    // ============================================

    // Email validation
    validateEmail(email) {
        if (!email) return { isValid: false, message: 'Email wajib diisi' };
        if (!/\S+@\S+\.\S+/.test(email.trim())) {
            return { isValid: false, message: 'Format email tidak valid' };
        }
        return { isValid: true };
    }

    // NIDN validation
    validateNIDN(nidn) {
        if (!nidn) return { isValid: false, message: 'NIDN wajib diisi' };
        if (!/^\d{10,18}$/.test(nidn.trim())) {
            return { isValid: false, message: 'NIDN harus berupa 10-18 digit angka' };
        }
        return { isValid: true };
    }

    // NIP validation
    validateNIP(nip) {
        if (!nip) return { isValid: true }; // NIP is optional
        if (!/^\d{10,18}$/.test(nip.trim())) {
            return { isValid: false, message: 'NIP harus berupa 10-18 digit angka' };
        }
        return { isValid: true };
    }

    // Phone validation
    validatePhone(phone) {
        if (!phone) return { isValid: false, message: 'Nomor telepon wajib diisi' };
        const cleanPhone = phone.replace(/[^0-9]/g, '');
        if (cleanPhone.length < 10 || cleanPhone.length > 15) {
            return { isValid: false, message: 'Nomor telepon harus 10-15 digit' };
        }
        return { isValid: true };
    }

    // ============================================
    // FORMAT HELPERS
    // ============================================

    // Format phone number
    formatPhone(phone) {
        if (!phone) return '';
        const cleanPhone = phone.replace(/[^0-9]/g, '');

        // Add country code if not present
        if (cleanPhone.startsWith('8')) {
            return '+62' + cleanPhone;
        } else if (cleanPhone.startsWith('0')) {
            return '+62' + cleanPhone.substring(1);
        } else if (cleanPhone.startsWith('62')) {
            return '+' + cleanPhone;
        }

        return cleanPhone;
    }

    // Format date
    formatDate(date, options = {}) {
        if (!date) return '';

        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'Asia/Jakarta'
        };

        const finalOptions = { ...defaultOptions, ...options };

        try {
            return new Date(date).toLocaleDateString('id-ID', finalOptions);
        } catch (error) {
            console.warn('Invalid date format:', date);
            return date;
        }
    }

    // Format currency
    formatCurrency(amount, currency = 'IDR') {
        if (amount === null || amount === undefined) return '';

        try {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(amount);
        } catch (error) {
            console.warn('Invalid currency format:', amount);
            return amount;
        }
    }

    // ============================================
    // CACHE UTILITIES
    // ============================================

    // Clear all cache
    async clearAllCache() {
        try {
            const Cache = (await import('./cache.js')).default;
            await Cache.clear();
            this.profileCache = { basic: null, student: null, teacher: null, timestamp: null };
            console.log('✅ All cache cleared');
        } catch (error) {
            console.error('❌ Failed to clear cache:', error);
        }
    }

    // Clear cache by pattern
    async clearCachePattern(pattern) {
        try {
            const Cache = (await import('./cache.js')).default;
            await Cache.clearPattern(pattern);
            console.log(`✅ Cache pattern cleared: ${pattern}`);
        } catch (error) {
            console.error(`❌ Failed to clear cache pattern ${pattern}:`, error);
        }
    }

    // Get cache statistics
    async getCacheStats() {
        try {
            const Cache = (await import('./cache.js')).default;
            return await Cache.getStats();
        } catch (error) {
            console.error('❌ Failed to get cache stats:', error);
            return null;
        }
    }

    // ============================================
    // NETWORK UTILITIES
    // ============================================

    // Check network status
    getNetworkStatus() {
        return {
            isOnline: navigator.onLine,
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt,
                saveData: navigator.connection.saveData
            } : null,
            timestamp: Date.now()
        };
    }

    // Wait for network connection
    async waitForNetwork(timeout = 30000) {
        if (navigator.onLine) {
            return true;
        }

        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                window.removeEventListener('online', onlineHandler);
                reject(new Error('Network timeout'));
            }, timeout);

            const onlineHandler = () => {
                clearTimeout(timeoutId);
                window.removeEventListener('online', onlineHandler);
                resolve(true);
            };

            window.addEventListener('online', onlineHandler);
        });
    }

    // ============================================
    // ERROR HANDLING UTILITIES
    // ============================================

    // Enhanced error handler
    handleAPIError(error, context = '') {
        console.error(`❌ API Error${context ? ` in ${context}` : ''}:`, error);

        // Extract meaningful error message
        let message = error.message || 'Terjadi kesalahan tidak dikenal';

        // Handle specific error types
        if (error.name === 'NetworkError' || !navigator.onLine) {
            message = 'Tidak ada koneksi internet. Periksa koneksi Anda dan coba lagi.';
        } else if (message.includes('401')) {
            message = 'Sesi Anda telah berakhir. Silakan login kembali.';
            // Auto redirect to login
            setTimeout(() => {
                localStorage.removeItem('token');
                window.location.hash = '#/login';
            }, 2000);
        } else if (message.includes('403')) {
            message = 'Anda tidak memiliki izin untuk melakukan operasi ini.';
        } else if (message.includes('404')) {
            message = 'Data yang diminta tidak ditemukan.';
        } else if (message.includes('429')) {
            message = 'Terlalu banyak permintaan. Silakan tunggu sebentar dan coba lagi.';
        } else if (message.includes('500')) {
            message = 'Terjadi kesalahan server. Silakan coba lagi nanti.';
        }

        return {
            originalError: error,
            message,
            code: this.extractErrorCode(error),
            timestamp: Date.now(),
            context
        };
    }

    // Extract error code from error
    extractErrorCode(error) {
        if (error.message) {
            const match = error.message.match(/HTTP (\d+)/);
            if (match) {
                return parseInt(match[1]);
            }
        }
        return null;
    }

    // ============================================
    // RETRY UTILITIES
    // ============================================

    // Retry with exponential backoff
    async retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000, context = '') {
        let lastError;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`🔄 Attempt ${attempt}/${maxRetries}${context ? ` for ${context}` : ''}`);
                const result = await fn();
                if (attempt > 1) {
                    console.log(`✅ Success on attempt ${attempt}${context ? ` for ${context}` : ''}`);
                }
                return result;
            } catch (error) {
                lastError = error;
                console.warn(`❌ Attempt ${attempt} failed${context ? ` for ${context}` : ''}:`, error.message);

                if (attempt === maxRetries) {
                    break;
                }

                // Calculate delay with exponential backoff and jitter
                const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
                console.log(`⏳ Waiting ${Math.round(delay)}ms before retry...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        console.error(`❌ All ${maxRetries} attempts failed${context ? ` for ${context}` : ''}`);
        throw this.handleAPIError(lastError, context);
    }

    // ============================================
    // PERFORMANCE UTILITIES
    // ============================================

    // Debounce function
    debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ============================================
    // LOGGING UTILITIES
    // ============================================

    // Enhanced logger
    log(level, message, data = null) {
        const timestamp = new Date().toISOString();
        const logData = {
            timestamp,
            level,
            message,
            data,
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        switch (level) {
            case 'error':
                console.error(`[${timestamp}] ERROR:`, message, data);
                break;
            case 'warn':
                console.warn(`[${timestamp}] WARN:`, message, data);
                break;
            case 'info':
                console.info(`[${timestamp}] INFO:`, message, data);
                break;
            case 'debug':
                console.debug(`[${timestamp}] DEBUG:`, message, data);
                break;
            default:
                console.log(`[${timestamp}] LOG:`, message, data);
        }

        // In production, you might want to send logs to a logging service
        if (level === 'error' && import.meta.env.PROD) {
            // Send to logging service
            this.sendToLoggingService(logData).catch(err => {
                console.warn('Failed to send log to service:', err);
            });
        }
    }

    // Send logs to external service (placeholder)
    async sendToLoggingService(logData) {
        // Implement your logging service integration here
        // Example: send to Sentry, LogRocket, etc.
        console.debug('Sending log to service:', logData);
    }
}

// Create singleton instance
const utilsAPI = new UtilsAPI();

export default utilsAPI;