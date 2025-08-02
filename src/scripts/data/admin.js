// src/scripts/data/admin.js - Admin-specific APIs
import coreAPI, { CACHE_TTL } from './core.js';
import CONFIG from './config.js';

export class AdminAPI extends coreAPI.constructor {
    constructor() {
        super();
    }

    // ============================================
    // USER MANAGEMENT APIs
    // ============================================

    // Get user by ID
    async getUserById(userId) {
        try {
            const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/management/user/${userId}`, {
                method: 'GET',
                headers: this._getHeaders()
            });

            return await response.json();
        } catch (error) {
            console.error('❌ Error fetching user:', error);
            throw error;
        }
    }

    // Create new user
    async createUser(userData) {
        try {
            if (!userData.full_name || !userData.email || !userData.role) {
                throw new Error('Nama, email, dan role wajib diisi');
            }

            const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/management/user`, {
                method: 'POST',
                headers: this._getHeaders(),
                body: JSON.stringify(userData)
            });

            const result = await response.json();

            // Invalidate user list cache
            await this._invalidateCache('management/list');

            return result;
        } catch (error) {
            console.error('❌ Error creating user:', error);
            throw error;
        }
    }

    // Update user
    async updateUser(userId, updateData) {
        try {
            if (!userId) {
                throw new Error('User ID diperlukan');
            }

            const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/management/user/${userId}`, {
                method: 'PUT',
                headers: this._getHeaders(),
                body: JSON.stringify(updateData)
            });

            const result = await response.json();

            // Invalidate user list cache
            await this._invalidateCache('management/list');

            return result;
        } catch (error) {
            console.error('❌ Error updating user:', error);
            throw error;
        }
    }

    // Delete user
    async deleteUser(userId) {
        try {
            if (!userId) {
                throw new Error('User ID diperlukan');
            }

            const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/management/user/${userId}`, {
                method: 'DELETE',
                headers: this._getHeaders()
            });

            const result = await response.json();

            // Invalidate user list cache
            await this._invalidateCache('management/list');

            return result;
        } catch (error) {
            console.error('❌ Error deleting user:', error);
            throw error;
        }
    }

    // Reset user password
    async resetUserPassword(userId, options = {}) {
        try {
            if (!userId) {
                throw new Error('User ID diperlukan');
            }

            const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/management/user/${userId}/reset-password`, {
                method: 'POST',
                headers: this._getHeaders(),
                body: JSON.stringify(options)
            });

            return await response.json();
        } catch (error) {
            console.error('❌ Error resetting password:', error);
            throw error;
        }
    }

    // Export users to CSV
    async exportUsers(role = 'all') {
        try {
            const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/management/export-users?role=${role}`, {
                method: 'GET',
                headers: this._getHeaders()
            });

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `users-${role}-${Date.now()}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            return { message: 'Export berhasil' };
        } catch (error) {
            console.error('❌ Error exporting users:', error);
            throw error;
        }
    }

    async getAllstudent(page = 1, limit = 10, search = "") {
        const params = { page, limit };
        if (search && search.trim() !== "") {
            params.search = search;
        }

        return this._getWithCache('/management/list-student', {
            params: params
        }, CACHE_TTL.STUDENTS);
    }

    async getAllteacher(page = 1, limit = 10, search = "") {
        const params = { page, limit };
        if (search && search.trim() !== "") {
            params.search = search;
        }

        return this._getWithCache('/management/list-teacher', {
            params: params
        }, CACHE_TTL.STUDENTS);
    }

    async getAlladmin(page = 1, limit = 10, search = "") {
        const params = { page, limit };
        if (search && search.trim() !== "") {
            params.search = search;
        }

        return this._getWithCache('/management/list-admin', {
            params: params
        }, CACHE_TTL.STUDENTS);
    }

    async importUsers(file) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/management/import-users`, {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                // Don't set Content-Type for FormData - let browser set it
            },
        });

        const result = await response.json();

        // Invalidate user lists cache
        await this._invalidateCache('management/list');

        return result;
    }

    // ============================================
    // TEACHER REQUEST MANAGEMENT APIs
    // ============================================

    // Get all teacher requests (admin only)
    async getTeacherRequests() {
        try {
            const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/teacher-requests`, {
                method: 'GET',
                headers: this._getHeaders()
            });

            const data = await response.json();
            console.log('✅ Teacher requests loaded:', data?.length || 0, 'items');

            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('❌ Error fetching teacher requests:', error);
            throw error;
        }
    }

    // Update teacher request status (admin only)
    async updateTeacherRequestStatus(id, status, rejectReason = null) {
        try {
            if (!id || !status) {
                throw new Error('ID dan status wajib diisi');
            }

            if (!['approved', 'rejected'].includes(status)) {
                throw new Error('Status harus approved atau rejected');
            }

            if (status === 'rejected' && (!rejectReason || rejectReason.trim().length === 0)) {
                throw new Error('Alasan penolakan wajib diisi');
            }

            const payload = { status };
            if (rejectReason) {
                payload.reject_reason = rejectReason.trim();
            }

            console.log(`📝 Updating teacher request ${id} to ${status}`, payload);

            const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/teacher-requests/${id}/status`, {
                method: 'PATCH',
                headers: this._getHeaders(),
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            console.log(`✅ Successfully updated request ${id} to ${status}`);

            // Invalidate cache
            await this._invalidateCache('teacher-requests');

            return result;
        } catch (error) {
            console.error('❌ Error updating teacher request status:', error);
            throw error;
        }
    }
    // ============================================
    // ADMIN CLASS MANAGEMENT APIs - FIXED VERSION
    // ============================================

    // Get all classes (admin view) with pagination and search
    async getAllClasses({ page = 1, limit = 20, search = "" } = {}) {
        try {
            const url = new URL(`${CONFIG.BASE_URL}/admin/classes`);
            url.searchParams.append("page", page);
            url.searchParams.append("limit", limit);
            if (search) url.searchParams.append("search", search);

            const response = await this._fetchWithOfflineSupport(url.toString(), {
                method: 'GET',
                headers: this._getHeaders()
            });

            const data = await response.json();
            console.log('✅ All classes loaded:', data?.classes?.length || data?.length || 0, 'items');

            return data;
        } catch (error) {
            console.error('❌ Error fetching all classes:', error);
            throw error;
        }
    }

    // Get all teachers for dropdown
    async getAllTeachers({ page = 1, limit = 100, search = "" } = {}) {
        try {
            const url = new URL(`${CONFIG.BASE_URL}/admin/teachers`);
            url.searchParams.append("page", page);
            url.searchParams.append("limit", limit);
            if (search) url.searchParams.append("search", search);

            const response = await this._fetchWithOfflineSupport(url.toString(), {
                method: 'GET',
                headers: this._getHeaders()
            });

            const data = await response.json();
            console.log('✅ All teachers loaded:', data?.teachers?.length || data?.length || 0, 'items');

            return data;
        } catch (error) {
            console.error('❌ Error fetching all teachers:', error);
            throw error;
        }
    }

    // Create class (admin)
    async createAdminClass(classData) {
        try {
            // Debug: Check token
            const token = localStorage.getItem('token');
            console.log('🔐 Token exists:', !!token);

            // Validate create class data
            const validation = this.validateAdminClassData(classData, 'create');
            if (!validation.isValid) {
                throw new Error(validation.errors.map(e => e.message).join(', '));
            }

            const payload = {
                name: classData.name.trim(),
                teacher_id: classData.teacher_id,
                program_studi: classData.program_studi?.trim() || '',
                perguruan_tinggi: classData.perguruan_tinggi?.trim() || ''
            };

            console.log('📤 Creating admin class:', payload);

            const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/admin/class`, {
                method: 'POST',
                headers: this._getHeaders(),
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            console.log('✅ Admin class created successfully:', result);

            // Invalidate cache
            await this._invalidateCache('admin/classes');

            return result;
        } catch (error) {
            console.error('❌ Error creating admin class:', error);
            throw error;
        }
    }

    // FIXED: Update class details only (NO TEACHER_ID)
    async updateAdminClass(classId, classData) {
        try {
            if (!classId) {
                throw new Error('Class ID diperlukan');
            }

            // IMPORTANT: Remove teacher_id from classData if present
            const { teacher_id, ...updateData } = classData;

            if (teacher_id) {
                console.warn('⚠️ teacher_id was removed from update data. Use transferClassOwnership() to change teacher.');
            }

            // Validate edit class data (without teacher_id)
            const validation = this.validateAdminClassData(updateData, 'edit');
            if (!validation.isValid) {
                throw new Error(validation.errors.map(e => e.message).join(', '));
            }

            const payload = {};

            // Only include fields that are provided and valid
            if (updateData.name && updateData.name.trim()) {
                payload.name = updateData.name.trim();
            }
            if (updateData.program_studi !== undefined) {
                payload.program_studi = updateData.program_studi?.trim() || '';
            }
            if (updateData.perguruan_tinggi !== undefined) {
                payload.perguruan_tinggi = updateData.perguruan_tinggi?.trim() || '';
            }

            // Ensure we have at least one field to update
            if (Object.keys(payload).length === 0) {
                throw new Error('Tidak ada data yang akan diupdate');
            }

            console.log(`📝 Updating admin class ${classId} (details only):`, payload);

            const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/admin/class/${classId}`, {
                method: 'PUT',
                headers: this._getHeaders(),
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            console.log(`✅ Admin class ${classId} details updated successfully`);

            // Invalidate cache
            await this._invalidateCache('admin/classes');

            return result;
        } catch (error) {
            console.error('❌ Error updating admin class:', error);
            throw error;
        }
    }

    // FIXED: Separate function for transferring class ownership
    async transferClassOwnership(classId, newTeacherId) {
        try {
            if (!classId || !newTeacherId) {
                throw new Error('Class ID dan Teacher ID diperlukan');
            }

            // Validate transfer data
            const validation = this.validateAdminClassData({ teacher_id: newTeacherId }, 'transfer');
            if (!validation.isValid) {
                throw new Error(validation.errors.map(e => e.message).join(', '));
            }

            const payload = {
                teacher_id: newTeacherId
            };

            console.log(`🔄 Transferring class ${classId} to teacher ${newTeacherId}`);

            const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/admin/class/${classId}/transfer`, {
                method: 'PATCH',
                headers: this._getHeaders(),
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            console.log(`✅ Class ${classId} transferred to teacher ${newTeacherId} successfully`);

            // Invalidate cache
            await this._invalidateCache('admin/classes');

            return result;
        } catch (error) {
            console.error('❌ Error transferring class ownership:', error);
            throw error;
        }
    }

    // Delete class (admin)
    async deleteAdminClass(classId) {
        try {
            if (!classId) {
                throw new Error('Class ID diperlukan');
            }

            console.log(`🗑️ Deleting admin class ${classId}`);

            const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/admin/class/${classId}`, {
                method: 'DELETE',
                headers: this._getHeaders()
            });

            const result = await response.json();
            console.log(`✅ Admin class ${classId} deleted successfully`);

            // Invalidate cache
            await this._invalidateCache('admin/classes');

            return result;
        } catch (error) {
            console.error('❌ Error deleting admin class:', error);
            throw error;
        }
    }

    // Get students in a class (admin view)
    async getAdminClassStudents(classId) {
        try {
            if (!classId) {
                throw new Error('Class ID diperlukan');
            }

            const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/admin/class/${classId}/students`, {
                method: 'GET',
                headers: this._getHeaders()
            });

            const data = await response.json();
            console.log(`✅ Students loaded for admin class ${classId}:`, data?.length || 0, 'students');

            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('❌ Error fetching admin class students:', error);
            throw error;
        }
    }

    // Remove student from class (admin)
    async removeStudentFromClassAdmin(classId, studentId) {
        try {
            if (!classId || !studentId) {
                throw new Error('Class ID dan Student ID diperlukan');
            }

            console.log(`🗑️ Admin removing student ${studentId} from class ${classId}`);

            const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/admin/class/${classId}/students/${studentId}`, {
                method: 'DELETE',
                headers: this._getHeaders()
            });

            const result = await response.json();
            console.log(`✅ Admin removed student ${studentId} from class ${classId}`);

            // Invalidate cache
            await this._invalidateCache(`admin/class/${classId}/students`);
            await this._invalidateCache('admin/classes');

            return result;
        } catch (error) {
            console.error('❌ Error removing student from class (admin):', error);
            throw error;
        }
    }

    // Get class management statistics for admin
    async getAdminClassStatistics() {
        try {
            const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/admin/classes/statistics`, {
                method: 'GET',
                headers: this._getHeaders()
            });

            if (!response.ok) {
                // If endpoint doesn't exist, calculate from getAllClasses
                const classesData = await this.getAllClasses({ limit: 1000 });
                const classes = classesData.classes || classesData;

                const totalClasses = classes.length;
                const totalStudents = classes.reduce((sum, cls) => sum + (cls.student_count || 0), 0);
                const averageStudentsPerClass = totalClasses > 0 ? Math.round(totalStudents / totalClasses) : 0;
                const activeClasses = classes.filter(cls => (cls.student_count || 0) > 0).length;
                const uniqueTeachers = new Set(classes.map(cls => cls.teacher_id)).size;

                return {
                    totalClasses,
                    totalStudents,
                    averageStudentsPerClass,
                    activeClasses,
                    uniqueTeachers
                };
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('❌ Error getting admin class statistics:', error);
            throw error;
        }
    }

    // ENHANCED: Validate admin class data with different modes
    validateAdminClassData(data, mode = 'create') {
        const errors = [];

        // Name validation (required for create and edit)
        if ((mode === 'create' || mode === 'edit') && data.name !== undefined) {
            if (!data.name || data.name.trim().length < 2) {
                errors.push({ field: 'name', message: 'Nama kelas minimal 2 karakter' });
            }

            if (data.name && data.name.trim().length > 100) {
                errors.push({ field: 'name', message: 'Nama kelas maksimal 100 karakter' });
            }
        }

        // Teacher validation - required for create and transfer
        if ((mode === 'create' || mode === 'transfer') && !data.teacher_id) {
            errors.push({ field: 'teacher_id', message: mode === 'create' ? 'Teacher harus dipilih' : 'Teacher tujuan harus dipilih' });
        }

        // Validate teacher_id format if provided
        if (data.teacher_id) {
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(data.teacher_id)) {
                errors.push({ field: 'teacher_id', message: 'Format Teacher ID tidak valid' });
            }
        }

        // Validate optional fields
        if (data.program_studi !== undefined && data.program_studi && data.program_studi.trim().length > 100) {
            errors.push({ field: 'program_studi', message: 'Program studi maksimal 100 karakter' });
        }

        if (data.perguruan_tinggi !== undefined && data.perguruan_tinggi && data.perguruan_tinggi.trim().length > 100) {
            errors.push({ field: 'perguruan_tinggi', message: 'Perguruan tinggi maksimal 100 karakter' });
        }

        // Mode-specific validations
        switch (mode) {
            case 'create':
                if (!data.name) {
                    errors.push({ field: 'name', message: 'Nama kelas wajib diisi' });
                }
                if (!data.teacher_id) {
                    errors.push({ field: 'teacher_id', message: 'Teacher wajib dipilih' });
                }
                break;

            case 'edit':
                // For edit, at least one field should be provided
                const editableFields = ['name', 'program_studi', 'perguruan_tinggi'];
                const hasEditableField = editableFields.some(field => data.hasOwnProperty(field));
                if (!hasEditableField) {
                    errors.push({ field: 'general', message: 'Minimal satu field harus diisi untuk update' });
                }
                break;

            case 'transfer':
                if (!data.teacher_id) {
                    errors.push({ field: 'teacher_id', message: 'Teacher tujuan wajib dipilih' });
                }
                break;
        }

        return {
            isValid: errors.length === 0,
            errors,
            mode
        };
    }

    // Helper method: Validate create class data
    validateCreateClassData(data) {
        return this.validateAdminClassData(data, 'create');
    }

    // Helper method: Validate edit class data
    validateEditClassData(data) {
        return this.validateAdminClassData(data, 'edit');
    }

    // Helper method: Validate transfer class data
    validateTransferClassData(data) {
        return this.validateAdminClassData(data, 'transfer');
    }
    // // ============================================
    // // ADMIN CLASS MANAGEMENT APIs
    // // ============================================

    // // Get all classes (admin view) with pagination and search
    // async getAllClasses({ page = 1, limit = 20, search = "" } = {}) {
    //     try {
    //         const url = new URL(`${CONFIG.BASE_URL}/admin/classes`);
    //         url.searchParams.append("page", page);
    //         url.searchParams.append("limit", limit);
    //         if (search) url.searchParams.append("search", search);

    //         const response = await this._fetchWithOfflineSupport(url.toString(), {
    //             method: 'GET',
    //             headers: this._getHeaders()
    //         });

    //         const data = await response.json();
    //         console.log('✅ All classes loaded:', data?.classes?.length || data?.length || 0, 'items');

    //         return data;
    //     } catch (error) {
    //         console.error('❌ Error fetching all classes:', error);
    //         throw error;
    //     }
    // }

    // // Get all teachers for dropdown
    // async getAllTeachers({ page = 1, limit = 100, search = "" } = {}) {
    //     try {
    //         const url = new URL(`${CONFIG.BASE_URL}/admin/teachers`);
    //         url.searchParams.append("page", page);
    //         url.searchParams.append("limit", limit);
    //         if (search) url.searchParams.append("search", search);

    //         const response = await this._fetchWithOfflineSupport(url.toString(), {
    //             method: 'GET',
    //             headers: this._getHeaders()
    //         });

    //         const data = await response.json();
    //         console.log('✅ All teachers loaded:', data?.teachers?.length || data?.length || 0, 'items');

    //         return data;
    //     } catch (error) {
    //         console.error('❌ Error fetching all teachers:', error);
    //         throw error;
    //     }
    // }

    // // Create class (admin)
    // async createAdminClass(classData) {
    //     try {
    //         // Debug: Check token
    //         const token = localStorage.getItem('token');
    //         console.log('🔐 Token exists:', !!token);

    //         if (!classData.name || classData.name.trim().length < 2) {
    //             throw new Error('Nama kelas minimal 2 karakter');
    //         }

    //         if (!classData.teacher_id) {
    //             throw new Error('Teacher harus dipilih');
    //         }

    //         const payload = {
    //             name: classData.name.trim(),
    //             teacher_id: classData.teacher_id,
    //             program_studi: classData.program_studi?.trim() || '',
    //             perguruan_tinggi: classData.perguruan_tinggi?.trim() || ''
    //         };

    //         console.log('📤 Creating admin class:', payload);

    //         const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/admin/class`, {
    //             method: 'POST',
    //             headers: this._getHeaders(),
    //             body: JSON.stringify(payload)
    //         });

    //         const result = await response.json();
    //         console.log('✅ Admin class created successfully:', result);

    //         // Invalidate cache
    //         await this._invalidateCache('admin/classes');

    //         return result;
    //     } catch (error) {
    //         console.error('❌ Error creating admin class:', error);
    //         throw error;
    //     }
    // }

    // // Update class (admin)
    // async updateAdminClass(classId, classData) {
    //     try {
    //         if (!classId) {
    //             throw new Error('Class ID diperlukan');
    //         }

    //         if (!classData.name || classData.name.trim().length < 2) {
    //             throw new Error('Nama kelas minimal 2 karakter');
    //         }

    //         const payload = {
    //             name: classData.name.trim()
    //         };

    //         // Add optional fields if provided
    //         if (classData.teacher_id) {
    //             payload.teacher_id = classData.teacher_id;
    //         }
    //         if (classData.program_studi) {
    //             payload.program_studi = classData.program_studi.trim();
    //         }
    //         if (classData.perguruan_tinggi) {
    //             payload.perguruan_tinggi = classData.perguruan_tinggi.trim();
    //         }

    //         console.log(`📝 Updating admin class ${classId}:`, payload);

    //         const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/admin/class/${classId}`, {
    //             method: 'PUT',
    //             headers: this._getHeaders(),
    //             body: JSON.stringify(payload)
    //         });

    //         const result = await response.json();
    //         console.log(`✅ Admin class ${classId} updated successfully`);

    //         // Invalidate cache
    //         await this._invalidateCache('admin/classes');

    //         return result;
    //     } catch (error) {
    //         console.error('❌ Error updating admin class:', error);
    //         throw error;
    //     }
    // }

    // // Delete class (admin)
    // async deleteAdminClass(classId) {
    //     try {
    //         if (!classId) {
    //             throw new Error('Class ID diperlukan');
    //         }

    //         console.log(`🗑️ Deleting admin class ${classId}`);

    //         const response = await this._fetchWithOfflineSupport(`${CONFIG.BASE_URL}/admin/class/${classId}`, {
    //             method: 'DELETE',
    //             headers: this._getHeaders()
    //         });

    //         const result = await response.json();
    //         console.log(`✅ Admin class ${classId} deleted successfully`);

    //         // Invalidate cache
    //         await this._invalidateCache('admin/classes');

    //         return result;
    //     } catch (error) {
    //         console.error('❌ Error deleting admin class:', error);
    //         throw error;
    //     }
    // }

    // // Transfer class ownership (admin)
    // async transferClassOwnership(classId, newTeacherId) {
    //     try {
    //         if (!classId || !newTeacherId) {
    //             throw new Error('Class ID dan Teacher ID diperlukan');
    //         }

    //         const payload = {
    //             teacher_id: newTeacherId
    //         };

    //         console.log(`🔄 Transferring class ${classId} to teacher ${newTeacherId}`);

    //         const response = await fetch(`${CONFIG.BASE_URL}/admin/class/${classId}/transfer`, {
    //             method: 'PATCH',
    //             headers: this._getHeaders(),
    //             body: JSON.stringify(payload)
    //         });

    //         if (!response.ok) {
    //             if (response.status === 401) {
    //                 localStorage.removeItem('token');
    //                 window.location.hash = '#/login';
    //                 throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
    //             }
    //             if (response.status === 403) {
    //                 throw new Error('Anda tidak memiliki akses untuk mentransfer kelas ini.');
    //             }
    //             if (response.status === 404) {
    //                 throw new Error('Kelas atau teacher tidak ditemukan.');
    //             }

    //             const errorData = await response.json().catch(() => ({}));
    //             throw new Error(errorData.message || 'Gagal mentransfer kelas');
    //         }

    //         const result = await response.json();
    //         console.log(`✅ Class ${classId} transferred to teacher ${newTeacherId}`);

    //         // Invalidate cache
    //         this._invalidateCache('admin/classes');

    //         return result;
    //     } catch (error) {
    //         console.error('❌ Error transferring class ownership:', error);
    //         throw error;
    //     }
    // }

    // // Get students in a class (admin view)
    // async getAdminClassStudents(classId) {
    //     try {
    //         if (!classId) {
    //             throw new Error('Class ID diperlukan');
    //         }

    //         const response = await fetch(`${CONFIG.BASE_URL}/admin/class/${classId}/students`, {
    //             method: 'GET',
    //             headers: this._getHeaders()
    //         });

    //         if (!response.ok) {
    //             if (response.status === 401) {
    //                 localStorage.removeItem('token');
    //                 window.location.hash = '#/login';
    //                 throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
    //             }
    //             if (response.status === 403) {
    //                 throw new Error('Anda tidak memiliki akses untuk melihat data siswa.');
    //             }
    //             if (response.status === 404) {
    //                 throw new Error('Kelas tidak ditemukan.');
    //             }

    //             const errorData = await response.json().catch(() => ({}));
    //             throw new Error(errorData.message || 'Gagal mengambil data siswa');
    //         }

    //         const data = await response.json();
    //         console.log(`✅ Students loaded for admin class ${classId}:`, data?.length || 0, 'students');

    //         return Array.isArray(data) ? data : [];
    //     } catch (error) {
    //         console.error('❌ Error fetching admin class students:', error);
    //         throw error;
    //     }
    // }

    // // Remove student from class (admin)
    // async removeStudentFromClassAdmin(classId, studentId) {
    //     try {
    //         if (!classId || !studentId) {
    //             throw new Error('Class ID dan Student ID diperlukan');
    //         }

    //         console.log(`🗑️ Admin removing student ${studentId} from class ${classId}`);

    //         const response = await fetch(`${CONFIG.BASE_URL}/admin/class/${classId}/students/${studentId}`, {
    //             method: 'DELETE',
    //             headers: this._getHeaders()
    //         });

    //         if (!response.ok) {
    //             if (response.status === 401) {
    //                 localStorage.removeItem('token');
    //                 window.location.hash = '#/login';
    //                 throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
    //             }
    //             if (response.status === 403) {
    //                 throw new Error('Anda tidak memiliki akses untuk mengeluarkan siswa.');
    //             }
    //             if (response.status === 404) {
    //                 throw new Error('Kelas atau siswa tidak ditemukan.');
    //             }

    //             const errorData = await response.json().catch(() => ({}));
    //             throw new Error(errorData.message || 'Gagal mengeluarkan siswa dari kelas');
    //         }

    //         const result = await response.json();
    //         console.log(`✅ Admin removed student ${studentId} from class ${classId}`);

    //         // Invalidate cache
    //         this._invalidateCache(`admin/class/${classId}/students`);
    //         this._invalidateCache('admin/classes');

    //         return result;
    //     } catch (error) {
    //         console.error('❌ Error removing student from class (admin):', error);
    //         throw error;
    //     }
    // }

    // // Get class management statistics for admin
    // async getAdminClassStatistics() {
    //     try {
    //         const response = await fetch(`${CONFIG.BASE_URL}/admin/classes/statistics`, {
    //             method: 'GET',
    //             headers: this._getHeaders()
    //         });

    //         if (!response.ok) {
    //             // If endpoint doesn't exist, calculate from getAllClasses
    //             const classesData = await this.getAllClasses({ limit: 1000 });
    //             const classes = classesData.classes || classesData;

    //             const totalClasses = classes.length;
    //             const totalStudents = classes.reduce((sum, cls) => sum + (cls.student_count || 0), 0);
    //             const averageStudentsPerClass = totalClasses > 0 ? Math.round(totalStudents / totalClasses) : 0;
    //             const activeClasses = classes.filter(cls => (cls.student_count || 0) > 0).length;
    //             const uniqueTeachers = new Set(classes.map(cls => cls.teacher_id)).size;

    //             return {
    //                 totalClasses,
    //                 totalStudents,
    //                 averageStudentsPerClass,
    //                 activeClasses,
    //                 uniqueTeachers
    //             };
    //         }

    //         const data = await response.json();
    //         return data;
    //     } catch (error) {
    //         console.error('❌ Error getting admin class statistics:', error);
    //         throw error;
    //     }
    // }

    // // Helper method: Validate admin class data
    // validateAdminClassData(data) {
    //     const errors = [];

    //     // Validate name
    //     if (!data.name || data.name.trim().length < 2) {
    //         errors.push({ field: 'name', message: 'Nama kelas minimal 2 karakter' });
    //     }

    //     if (data.name && data.name.trim().length > 100) {
    //         errors.push({ field: 'name', message: 'Nama kelas maksimal 100 karakter' });
    //     }

    //     // Validate teacher selection
    //     if (!data.teacher_id) {
    //         errors.push({ field: 'teacher_id', message: 'Teacher harus dipilih' });
    //     }

    //     // Validate optional fields
    //     if (data.program_studi && data.program_studi.trim().length > 100) {
    //         errors.push({ field: 'program_studi', message: 'Program studi maksimal 100 karakter' });
    //     }

    //     if (data.perguruan_tinggi && data.perguruan_tinggi.trim().length > 100) {
    //         errors.push({ field: 'perguruan_tinggi', message: 'Perguruan tinggi maksimal 100 karakter' });
    //     }

    //     return {
    //         isValid: errors.length === 0,
    //         errors
    //     };
    // }

    // ============================================
    // COURSE MANAGEMENT APIs
    // ============================================

    // Get all courses (admin)
    async getAdminCourses({ page = 1, limit = 10, search = "" } = {}) {
        const params = { page, limit };
        if (search && search.trim() !== "") {
            params.search = search;
        }

        return this._getWithCache('/admin/courses', {
            params: params
        }, CACHE_TTL.COURSES);
    }

    // Get course detail (admin)
    async getAdminCourseDetail(courseId) {
        if (!courseId) {
            throw new Error('Course ID diperlukan');
        }

        return this._getWithCache(`/admin/courses/${courseId}`, {}, CACHE_TTL.COURSE_CONTENT);
    }

    // Update course (admin)
    async updateAdminCourse(courseId, updateData) {
        try {
            if (!courseId) {
                throw new Error('Course ID diperlukan');
            }

            const response = await fetch(`${CONFIG.BASE_URL}/admin/courses/${courseId}`, {
                method: 'PUT',
                headers: this._getHeaders(),
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Gagal update course');
            }

            // Invalidate course cache
            this._invalidateCache('admin/courses');
            this._invalidateCache(`admin/courses/${courseId}`);

            return await response.json();
        } catch (error) {
            console.error('❌ Error updating course:', error);
            throw error;
        }
    }

    // Delete course (admin)
    async deleteAdminCourse(courseId) {
        try {
            if (!courseId) {
                throw new Error('Course ID diperlukan');
            }

            const response = await fetch(`${CONFIG.BASE_URL}/admin/courses/${courseId}`, {
                method: 'DELETE',
                headers: this._getHeaders()
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Gagal hapus course');
            }

            // Invalidate course cache
            this._invalidateCache('admin/courses');

            return await response.json();
        } catch (error) {
            console.error('❌ Error deleting course:', error);
            throw error;
        }
    }

    // Export courses (admin)
    async exportAdminCourses() {
        try {
            const response = await fetch(`${CONFIG.BASE_URL}/admin/courses/export`, {
                method: 'GET',
                headers: this._getHeaders()
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Gagal export courses');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `courses-${Date.now()}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            return { message: 'Export berhasil' };
        } catch (error) {
            console.error('❌ Error exporting courses:', error);
            throw error;
        }
    }

    // Get course statistics (admin)
    async getAdminCourseStatistics() {
        try {
            const response = await fetch(`${CONFIG.BASE_URL}/admin/courses/statistics`, {
                method: 'GET',
                headers: this._getHeaders()
            });

            if (!response.ok) {
                // Fallback: calculate from getAllCourses
                const coursesData = await this.getAdminCourses({ limit: 1000 });
                const courses = coursesData.data || [];

                return {
                    totalCourses: courses.length,
                    beginnerCourses: courses.filter(c => c.level === 'beginner').length,
                    intermediateCourses: courses.filter(c => c.level === 'intermediate').length,
                    expertCourses: courses.filter(c => c.level === 'expert').length,
                    verifiedCourses: courses.filter(c => c.is_verified).length
                };
            }

            return await response.json();
        } catch (error) {
            console.error('❌ Error getting course statistics:', error);
            return {
                totalCourses: 0,
                beginnerCourses: 0,
                intermediateCourses: 0,
                expertCourses: 0,
                verifiedCourses: 0
            };
        }
    }

    async getAllCourses() {
        return this._getWithCache('/management/list-course', {}, CACHE_TTL.COURSES);
    }
}

// Create singleton instance
const adminAPI = new AdminAPI();

export default adminAPI;