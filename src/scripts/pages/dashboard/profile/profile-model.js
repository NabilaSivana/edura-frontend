// pages/dashboard/profile/profile-model.js
import Api from '../../../data/api.js';

class ProfileModel {
    constructor() {
        this.basicProfile = null;
        this.roleProfile = null;
        this.userRole = null;
        this.isLoading = false;
        this.errors = {};
    }

    // Get current user role
    async getCurrentUserRole() {
        try {
            const user = await Api.getCurrentUser();
            this.userRole = user?.role;
            return this.userRole;
        } catch (error) {
            console.error('❌ Error getting user role:', error);
            this.userRole = null;
            return null;
        }
    }

    // Load basic profile
    async loadBasicProfile(forceRefresh = false) {
        try {
            this.isLoading = true;
            
            const response = await Api.getProfile(forceRefresh);
            
            // Handle both formats:
            // 1. Backend format: { profile: {...} }
            // 2. Transformed format: {...} (direct object)
            if (response?.profile) {
                // Backend format
                this.basicProfile = response.profile;
                console.log('✅ Basic profile loaded (backend format)');
            } else if (response?.id && response?.email) {
                // Already transformed format - use directly
                this.basicProfile = response;
                console.log('✅ Basic profile loaded (direct format)');
            } else {
                this.basicProfile = null;
                console.warn('⚠️ Basic profile data format not recognized:', response);
            }
            
            return this.basicProfile;
        } catch (error) {
            console.error('❌ Error loading basic profile:', error);
            this.errors.basicProfile = error.message || 'Failed to load basic profile';
            this.basicProfile = null;
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    // Load role-specific profile
    async loadRoleProfile(forceRefresh = false) {
        try {
            if (!this.userRole) {
                await this.getCurrentUserRole();
            }

            if (this.userRole === 'student') {
                this.roleProfile = await Api.getStudentProfile(forceRefresh);
                console.log('✅ Student profile loaded');
            } else if (this.userRole === 'teacher') {
                this.roleProfile = await Api.getTeacherProfile(forceRefresh);
                console.log('✅ Teacher profile loaded');
            } else {
                this.roleProfile = null;
                return null;
            }

            return this.roleProfile;
        } catch (error) {
            console.error('❌ Error loading role profile:', error);
            // If profile doesn't exist (404), it's not an error - user just hasn't created it yet
            if (error.status === 404 || error.message?.includes('not found') || error.message?.includes('belum dibuat')) {
                console.log('ℹ️ Role profile not found - user needs to create it');
                this.roleProfile = null;
                return null;
            }
            this.errors.roleProfile = error.message || 'Failed to load role profile';
            throw error;
        }
    }

    // Update basic profile
    async updateBasicProfile(data) {
        try {
            this.isLoading = true;
            this.errors.basicProfile = null;

            const result = await Api.updateProfile(data);
            
            // Reload basic profile after update
            await this.loadBasicProfile(true);
            
            return result;
        } catch (error) {
            console.error('Error updating basic profile:', error);
            this.errors.basicProfile = error.message || 'Failed to update basic profile';
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    // Update or create student profile
    async updateStudentProfile(data, isCreate = false) {
        try {
            this.isLoading = true;
            this.errors.roleProfile = null;

            let result;
            if (isCreate) {
                result = await Api.createStudentProfile(data);
            } else {
                result = await Api.updateStudentProfile(data);
            }

            // Reload role profile after update
            await this.loadRoleProfile(true);
            
            return result;
        } catch (error) {
            console.error('Error updating student profile:', error);
            this.errors.roleProfile = error.message || 'Failed to update student profile';
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    // Update or create teacher profile
    async updateTeacherProfile(data, isCreate = false) {
        try {
            this.isLoading = true;
            this.errors.roleProfile = null;

            let result;
            if (isCreate) {
                result = await Api.createTeacherProfile(data);
            } else {
                result = await Api.updateTeacherProfile(data);
            }

            // Reload role profile after update
            await this.loadRoleProfile(true);
            
            return result;
        } catch (error) {
            console.error('Error updating teacher profile:', error);
            this.errors.roleProfile = error.message || 'Failed to update teacher profile';
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    // Student class operations
    async joinClass(classCode) {
        try {
            this.isLoading = true;
            const result = await Api.joinStudentClass(classCode);
            
            // Reload student profile after joining class
            await this.loadRoleProfile(true);
            
            return result;
        } catch (error) {
            console.error('Error joining class:', error);
            this.errors.classOperation = error.message || 'Failed to join class';
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    async leaveClass(className) {
        try {
            this.isLoading = true;
            const result = await Api.leaveStudentClass(className);
            
            // Reload student profile after leaving class
            await this.loadRoleProfile(true);
            
            return result;
        } catch (error) {
            console.error('Error leaving class:', error);
            this.errors.classOperation = error.message || 'Failed to leave class';
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    // Class code validation
    async validateClassCode(code) {
        if (!code || code.trim().length === 0) {
            return { valid: false, error: 'Class code is required' };
        }

        try {
            console.log('🔍 Validating class code:', code);
            
            // Use getClassCodeInfo to get class details
            const classInfo = await Api.getClassCodeInfo(code);
            console.log('✅ Class info retrieved:', classInfo);

            // Validate response structure
            if (classInfo && classInfo.program_studi && classInfo.perguruan_tinggi) {
                return {
                    valid: true,
                    classInfo: {
                        id: null, // Not provided by API
                        name: `Class ${code}`, // Generate a display name
                        program_studi: classInfo.program_studi,
                        perguruan_tinggi: classInfo.perguruan_tinggi,
                        class_code: code
                    }
                };
            } else {
                console.log('❌ Invalid class info structure:', classInfo);
                return { valid: false, error: 'Invalid class code response' };
            }

        } catch (error) {
            console.error('❌ Error validating class code:', error);
            
            // Handle specific error cases
            if (error.status === 404 || error.message?.includes('not found') || error.message?.includes('tidak ditemukan')) {
                return { valid: false, error: 'Class code not found' };
            }
            
            return { 
                valid: false, 
                error: error.message || 'Failed to validate class code'
            };
        }
    }

    // Check if class code provides complete info
    isClassCodeComplete(classInfo) {
        return classInfo && 
               classInfo.program_studi && 
               classInfo.perguruan_tinggi;
    }

    // Validation helpers
    validateBasicProfile(data) {
        const errors = {};

        if (data.full_name && data.full_name.trim().length < 3) {
            errors.full_name = 'Full name must be at least 3 characters';
        }

        if (data.email && !this.isValidEmail(data.email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (data.new_password && data.new_password.length < 6) {
            errors.new_password = 'Password must be at least 6 characters';
        }

        if (data.new_password && !data.old_password) {
            errors.old_password = 'Current password is required when changing password';
        }

        return Object.keys(errors).length > 0 ? errors : null;
    }

    validateStudentProfile(data) {
        const errors = {};

        if (!data.nim || data.nim.trim().length === 0) {
            errors.nim = 'NIM is required';
        }

        if (!data.full_name || data.full_name.trim().length === 0) {
            errors.full_name = 'Full name is required';
        }

        if (!data.jurusan || data.jurusan.trim().length === 0) {
            errors.jurusan = 'Jurusan is required';
        }

        return Object.keys(errors).length > 0 ? errors : null;
    }

    validateTeacherProfile(data) {
        const errors = {};

        if (!data.nidn || data.nidn.trim().length === 0) {
            errors.nidn = 'NIDN is required';
        }

        if (!data.full_name || data.full_name.trim().length === 0) {
            errors.full_name = 'Full name is required';
        }

        if (!data.fakultas || data.fakultas.trim().length === 0) {
            errors.fakultas = 'Fakultas is required';
        }

        if (!data.program_studi) {
            errors.program_studi = 'Program Studi is required';
        }

        if (!data.perguruan_tinggi) {
            errors.perguruan_tinggi = 'Perguruan Tinggi is required';
        }

        return Object.keys(errors).length > 0 ? errors : null;
    }

    // Utility methods
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Get error for specific field
    getError(section, field) {
        return this.errors[section]?.[field] || this.errors[field];
    }

    // Clear errors
    clearErrors() {
        this.errors = {};
    }

    clearError(section, field = null) {
        if (field) {
            if (this.errors[section]) {
                delete this.errors[section][field];
            }
        } else {
            delete this.errors[section];
        }
    }

    // Get constants for dropdowns
    async getConstants() {
        try {
            // Try to get enums from API first
            const enums = await Api.getEnums();
            console.log('✅ Enums loaded from API:', enums);
            
            return {
                PROGRAM_STUDI: enums.program_studi || this.getFallbackProgramStudi(),
                PERGURUAN_TINGGI: enums.perguruan_tinggi || this.getFallbackPerguruanTinggi()
            };
        } catch (error) {
            console.warn('⚠️ Failed to load enums from API, using fallback:', error);
            return {
                PROGRAM_STUDI: this.getFallbackProgramStudi(),
                PERGURUAN_TINGGI: this.getFallbackPerguruanTinggi()
            };
        }
    }

    getFallbackProgramStudi() {
        return [
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
        ];
    }

    getFallbackPerguruanTinggi() {
        return [
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
        ];
    }
}

export default ProfileModel;