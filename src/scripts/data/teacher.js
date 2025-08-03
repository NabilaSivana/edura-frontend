// src/scripts/data/teacher.js - Teacher-specific APIs (FIXED)
import CONFIG from './config.js';
import coreAPI, { CACHE_TTL } from './core.js';

export class TeacherAPI extends coreAPI.constructor {
    constructor() {
        super();
    }

    // Add missing isCacheValid method
    isCacheValid() {
        return this.profileCache.timestamp &&
            (Date.now() - this.profileCache.timestamp < this.CACHE_DURATION);
    }

    // ============================================
    // TEACHER PROFILE MANAGEMENT
    // ============================================

    async getTeacherProfile(forceRefresh = false) {
        //console.log('📋 Getting teacher profile...');

        if (!forceRefresh && this.profileCache.teacher && this.isCacheValid()) {
            //console.log('✅ Using cached teacher profile');
            return this.profileCache.teacher;
        }

        try {
            const profile = await this._getWithCache('/teacher/profile', {}, CACHE_TTL.PROFILE, forceRefresh);
            this.profileCache.teacher = profile;
            this.profileCache.timestamp = Date.now();
            return profile;
        } catch (error) {
            console.error('❌ Failed to get teacher profile:', error);
            if (error.message.includes('404')) {
                // Profile not found - teacher needs to create one
                return null;
            }
            throw error;
        }
    }

    async createTeacherProfile(data) {
        //console.log('📝 Creating teacher profile:', data);

        // Validate required fields
        const validation = this.validateTeacherProfileData(data);
        if (!validation.isValid) {
            throw new Error(validation.message);
        }

        try {
            const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/teacher/profile`, {
                method: "POST",
                headers: this._getHeaders(),
                body: JSON.stringify(data)
            });

            const result = await response.json();

            // Clear profile cache
            this.clearUserCache('teacher');

            //console.log('✅ Teacher profile created successfully');
            return result;
        } catch (error) {
            console.error('❌ Failed to create teacher profile:', error);
            throw error;
        }
    }

    async updateTeacherProfile(data) {
        //console.log('📝 Updating teacher profile:', data);

        try {
            const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/teacher/profile`, {
                method: 'PUT',
                headers: this._getHeaders(),
                body: JSON.stringify(data)
            });

            const result = await response.json();

            // Clear profile cache
            this.clearUserCache('teacher');

            //console.log('✅ Teacher profile updated successfully');
            return result;
        } catch (error) {
            console.error('❌ Failed to update teacher profile:', error);
            throw error;
        }
    }

    // ============================================
    // TEACHER COURSE MANAGEMENT
    // ============================================

    async getTeacherUnverifiedCourses() {
        return this._getWithCache('/teacher/courses/unverified', {}, CACHE_TTL.COURSES);
    }

    async getTeacherVerifiedCourses() {
        return this._getWithCache('/teacher/courses/verified', {}, CACHE_TTL.COURSES);
    }

    async getTeacherCourseDetail(courseId) {
        if (!courseId) throw new Error('Course ID is required');
        return this._getWithCache(`/teacher/courses/${courseId}/detail`, {}, CACHE_TTL.COURSE_DETAIL);
    }

    async verifyTeacherCourse(courseId) {
        if (!courseId) throw new Error('Course ID is required');

        const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/teacher/courses/${courseId}/verify`, {
            method: 'PUT',
            headers: this._getHeaders(),
            body: JSON.stringify({})
        });

        const result = await response.json();

        // Clear courses cache
        await this._invalidateCache('teacher/courses');

        return result;
    }

    async editTeacherCourse(courseId, data) {
        if (!courseId) throw new Error('Course ID is required');

        const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/teacher/courses/${courseId}`, {
            method: 'PUT',
            headers: this._getHeaders(),
            body: JSON.stringify(data)
        });

        const result = await response.json();

        // Clear course-related cache
        await this._invalidateCache(`teacher/courses/${courseId}`);
        await this._invalidateCache('teacher/courses');

        return result;
    }

    async revertTeacherCourse(courseId, data) {
        if (!courseId) throw new Error('Course ID is required');

        const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/teacher/courses/${courseId}/revert`, {
            method: 'PUT',
            headers: this._getHeaders(),
            body: JSON.stringify(data)
        });

        const result = await response.json();

        // Clear course-related cache
        await this._invalidateCache(`teacher/courses/${courseId}`);
        await this._invalidateCache('teacher/courses');

        return result;
    }

    async deleteTeacherCourseSession(courseId, sessionNumber) {
        if (!courseId || !sessionNumber) {
            throw new Error('Course ID and session number are required');
        }

        const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/teacher/courses/${courseId}/sessions/${sessionNumber}`, {
            method: 'DELETE',
            headers: this._getHeaders()
        });

        const result = await response.json();

        // Clear course-related cache
        await this._invalidateCache(`teacher/courses/${courseId}`);

        return result;
    }

    async editTeacherCourseSession(courseId, sessionNumber, data) {
        if (!courseId || !sessionNumber) {
            throw new Error('Course ID and session number are required');
        }

        const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/teacher/courses/${courseId}/sessions/${sessionNumber}`, {
            method: 'PUT',
            headers: this._getHeaders(),
            body: JSON.stringify(data)
        });

        const result = await response.json();

        // Clear course-related cache
        await this._invalidateCache(`teacher/courses/${courseId}`);

        return result;
    }

    // Alias for deleteTeacherCourseSession (backward compatibility)
    async deleteTeacherSession(courseId, sessionNumber) {
        return this.deleteTeacherCourseSession(courseId, sessionNumber);
    }

    // ============================================
    // TEACHER CLASS MANAGEMENT
    // ============================================

    async getTeacherClasses() {
        return this._getWithCache('/teacher/classes', {}, CACHE_TTL.CLASSES);
    }

    async createTeacherClass(data) {
        //console.log('📝 Creating teacher class:', data);

        const validation = this.validateTeacherClassData(data);
        if (!validation.isValid) {
            throw new Error(validation.message);
        }

        try {
            // 🔧 FIX: Ensure we send the right field name for backend
            const payload = {
                name: data.name || data.class_name // Backend expects 'name' field
            };

            const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/teacher/classes`, {
                method: 'POST',
                headers: this._getHeaders(),
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            // Clear classes cache
            await this._invalidateCache('teacher/classes');

            //console.log('✅ Teacher class created successfully');
            return result;
        } catch (error) {
            console.error('❌ Failed to create teacher class:', error);
            throw error;
        }
    }

    async updateTeacherClass(classId, data) {
        if (!classId) throw new Error('Class ID is required');

        // 🔧 FIX: Ensure we send the right field name for backend
        const payload = {
            name: data.name || data.class_name // Backend expects 'name' field
        };

        const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/teacher/class/${classId}`, {
            method: 'PUT',
            headers: this._getHeaders(),
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        // Clear classes cache
        await this._invalidateCache('teacher/classes');

        return result;
    }

    async deleteTeacherClass(classId) {
        if (!classId) throw new Error('Class ID is required');

        const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/teacher/class/${classId}`, {
            method: 'DELETE',
            headers: this._getHeaders()
        });

        const result = await response.json();

        // Clear classes cache
        await this._invalidateCache('teacher/classes');

        return result;
    }

    async getClassStudents(classId) {
        if (!classId) throw new Error('Class ID is required');
        return this._getWithCache(`/teacher/class/${classId}/students`, {}, CACHE_TTL.CLASS_DETAIL);
    }

    async removeStudentFromClass(classId, studentId) {
        if (!classId || !studentId) {
            throw new Error('Class ID and Student ID are required');
        }

        const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/teacher/class/${classId}/students/${studentId}`, {
            method: 'DELETE',
            headers: this._getHeaders()
        });

        const result = await response.json();

        // Clear class-related cache
        await this._invalidateCache(`teacher/classes/${classId}`);

        return result;
    }

    async getTeacherGrades(classId) {
        if (!classId) throw new Error('Class ID is required');
        return this._getWithCache(`/teacher/classes/${classId}/grades`, {}, CACHE_TTL.GRADES);
    }

    // ============================================
    // TEACHER REQUEST MANAGEMENT (Updated for new fields)
    // ============================================

    async submitTeacherRequest(data) {
        //console.log('📝 Submitting teacher request:', data);

        // Validate request data
        const validation = this.validateTeacherRequestData(data);
        if (!validation.isValid) {
            throw new Error(validation.message);
        }

        try {
            // Use _fetchWithOfflineSupport for public endpoint (no auth required)
            const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/teacher-requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                    // No Authorization header for public endpoint
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            //console.log('✅ Teacher request submitted successfully');
            return result;
        } catch (error) {
            console.error('❌ Failed to submit teacher request:', error);

            // Enhanced error handling for teacher requests
            if (error.message.includes('HTTP 400')) {
                if (error.message.includes('NIDN')) {
                    throw new Error('NIDN sudah terdaftar dalam pengajuan yang sedang diproses.');
                }
                if (error.message.includes('email')) {
                    throw new Error('Email sudah terdaftar dalam pengajuan lain.');
                }
            }

            if (error.message.includes('HTTP 409')) {
                throw new Error('NIDN sudah terdaftar dalam pengajuan yang sedang diproses.');
            }

            throw error;
        }
    }

    async checkTeacherRequestStatusByNIDN(nidn) {
        if (!nidn) throw new Error('NIDN is required');

        try {
            // Use _getWithCache for public endpoint
            const data = await this._getWithCache('/teacher-requests/my-status', {
                params: { nidn }
            }, CACHE_TTL.PROFILE);
            return data;
        } catch (error) {
            if (error.message.includes('404')) {
                return { status: 'not_found', message: 'Tidak ada pengajuan ditemukan dengan NIDN tersebut.' };
            }
            throw error;
        }
    }

    async checkTeacherRequestStatusByEmail(email) {
        if (!email) throw new Error('Email is required');

        try {
            // Use _getWithCache for public endpoint
            const data = await this._getWithCache('/teacher-requests/my-status', {
                params: { email }
            }, CACHE_TTL.PROFILE);
            return data;
        } catch (error) {
            if (error.message.includes('404')) {
                return { status: 'not_found', message: 'Tidak ada pengajuan ditemukan dengan email tersebut.' };
            }
            throw error;
        }
    }

    async getMyTeacherRequestStatus() {
        // This would require authentication to get current user's request
        try {
            const data = await this._getWithCache('/teacher-requests/my-status', {}, CACHE_TTL.PROFILE);
            return data;
        } catch (error) {
            if (error.message.includes('404')) {
                return { status: 'not_found', message: 'Anda belum memiliki pengajuan teacher request.' };
            }
            throw error;
        }
    }

    // ============================================
    // VALIDATION HELPERS (Updated)
    // ============================================

    validateTeacherRequestData(data) {
        if (!data) {
            return { isValid: false, message: 'Data pengajuan tidak boleh kosong' };
        }

        // Email validation
        if (!data.email || !data.email.trim()) {
            return { isValid: false, message: 'Email wajib diisi' };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email.trim())) {
            return { isValid: false, message: 'Format email tidak valid' };
        }

        // Full name validation
        if (!data.full_name || !data.full_name.trim()) {
            return { isValid: false, message: 'Nama lengkap wajib diisi' };
        }

        if (data.full_name.trim().length < 2) {
            return { isValid: false, message: 'Nama lengkap minimal 2 karakter' };
        }

        // NIDN validation
        if (!data.nidn || !data.nidn.trim()) {
            return { isValid: false, message: 'NIDN wajib diisi' };
        }

        if (!/^\d{10,18}$/.test(data.nidn.trim())) {
            return { isValid: false, message: 'NIDN harus berupa angka 10-18 digit' };
        }

        // Program Studi validation (NEW)
        if (!data.program_studi || !data.program_studi.trim()) {
            return { isValid: false, message: 'Program Studi wajib dipilih' };
        }

        // Perguruan Tinggi validation (NEW)
        if (!data.perguruan_tinggi || !data.perguruan_tinggi.trim()) {
            return { isValid: false, message: 'Perguruan Tinggi wajib dipilih' };
        }

        // Credential file validation (optional)
        if (data.credential_file && data.credential_file.trim()) {
            try {
                new URL(data.credential_file.trim());
            } catch {
                return { isValid: false, message: 'Format URL dokumen kredensial tidak valid' };
            }
        }

        return { isValid: true };
    }

    validateTeacherProfileData(data) {
        if (!data) {
            return { isValid: false, message: 'Data profil tidak boleh kosong' };
        }

        // NIDN validation
        if (data.nidn && !/^\d{10,18}$/.test(data.nidn.trim())) {
            return { isValid: false, message: 'Format NIDN tidak valid (10-18 digit angka)' };
        }

        // Program Studi validation
        if (data.program_studi && data.program_studi.trim().length === 0) {
            return { isValid: false, message: 'Program Studi tidak boleh kosong jika diisi' };
        }

        // Perguruan Tinggi validation
        if (data.perguruan_tinggi && data.perguruan_tinggi.trim().length === 0) {
            return { isValid: false, message: 'Perguruan Tinggi tidak boleh kosong jika diisi' };
        }

        // Fakultas validation (optional)
        if (data.fakultas && data.fakultas.trim().length === 0) {
            return { isValid: false, message: 'Fakultas tidak boleh kosong jika diisi' };
        }

        return { isValid: true };
    }

    validateTeacherClassData(data) {
        if (!data) {
            return { isValid: false, message: 'Data kelas tidak boleh kosong' };
        }

        // Support both 'name' and 'class_name' field formats for flexibility
        const className = data.name || data.class_name;
        if (!className || !className.trim()) {
            return { isValid: false, message: 'Nama kelas wajib diisi' };
        }

        // For create class, only name is required
        // program_studi and perguruan_tinggi are taken from teacher's profile on backend
        return { isValid: true };
    }

    // ============================================
    // CACHE MANAGEMENT
    // ============================================

    clearTeacherCache() {
        this.clearUserCache('teacher');
        this._invalidateCache('teacher/');
    }

    // ============================================
    // ENUM HELPERS  
    // ============================================

    // Get program studi options (for form dropdowns)
    async getProgramStudiOptions() {
        try {
            const { default: utilsAPI } = await import('./utils.js');
            const enums = await utilsAPI.getEnums();
            return enums.program_studi || [];
        } catch (error) {
            console.error('❌ Failed to get program studi options:', error);
            return [];
        }
    }

    // Get perguruan tinggi options (for form dropdowns)  
    async getPerguruanTinggiOptions() {
        try {
            const { default: utilsAPI } = await import('./utils.js');
            const enums = await utilsAPI.getEnums();
            return enums.perguruan_tinggi || [];
        } catch (error) {
            console.error('❌ Failed to get perguruan tinggi options:', error);
            return [];
        }
    }
}

// Create singleton instance
const teacherAPI = new TeacherAPI();

export default teacherAPI;