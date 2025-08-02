// // File: src/scripts/pages/admin/manage-class/model.js
// import Api from '../../../data/api.js';

// class AdminManageClassModel {
//     constructor() {
//         this.classes = [];
//         this.teachers = [];
//         this.students = [];
//         this.loading = false;
//         this.error = null;
//         this.currentClass = null;
//         this.filters = {
//             search: '',
//             teacherFilter: 'all', // all, specific teacher id
//             sortBy: 'name', // name, created_at, student_count, teacher_name
//             sortOrder: 'asc' // asc, desc
//         };
//         this.pagination = {
//             page: 1,
//             limit: 20,
//             total: 0,
//             totalPages: 0
//         };
//         this.formMode = 'create'; // create, edit
//         this.selectedClassId = null;
//     }

//     // Fetch all classes (admin view)
//     async fetchAllClasses(page = 1, limit = 20, search = '') {
//         try {
//             this.loading = true;
//             this.error = null;

//             console.log('📋 Fetching all classes for admin...');

//             // Use getAllClasses API method with proper params
//             const data = await Api.getAllClasses({ 
//                 page, 
//                 limit, 
//                 search: search || '' 
//             });

//             // Handle response structure
//             if (data && data.classes) {
//                 this.classes = Array.isArray(data.classes) ? data.classes : [];
//                 this.pagination = {
//                     page: data.pagination?.page || page,
//                     limit: data.pagination?.limit || limit,
//                     total: data.pagination?.total || 0,
//                     totalPages: data.pagination?.totalPages || 0
//                 };
//             } else if (Array.isArray(data)) {
//                 // Fallback for simple array response
//                 this.classes = data;
//                 this.pagination = {
//                     page: 1,
//                     limit: data.length,
//                     total: data.length,
//                     totalPages: 1
//                 };
//             } else {
//                 this.classes = [];
//             }

//             // Enrich classes with teacher data if we have teachers loaded
//             if (this.teachers.length > 0) {
//                 this.classes = this.classes.map(cls => {
//                     const teacher = this.teachers.find(t => t.id === cls.teacher_id);
//                     return {
//                         ...cls,
//                         teacher_name: teacher?.full_name || 'Unknown Teacher',
//                         teacher_email: teacher?.email || '-'
//                     };
//                 });
//             }

//             console.log(`✅ Loaded ${this.classes.length} classes`);
//             return this.classes;
//         } catch (error) {
//             console.error('❌ Error fetching classes:', error);
//             this.error = error.message;
//             this.classes = [];
//             throw error;
//         } finally {
//             this.loading = false;
//         }
//     }

//     // Fetch all teachers for dropdown
//     async fetchAllTeachers() {
//         try {
//             console.log('👨‍🏫 Fetching all teachers...');

//             // Use getAllTeachers API method
//             const data = await Api.getAllTeachers({ 
//                 limit: 100 // Get more teachers for dropdown
//             });

//             // Handle response structure
//             if (data && data.teachers) {
//                 this.teachers = Array.isArray(data.teachers) ? data.teachers : [];
//             } else if (Array.isArray(data)) {
//                 this.teachers = data;
//             } else {
//                 this.teachers = [];
//             }

//             console.log(`✅ Loaded ${this.teachers.length} teachers`);
//             return this.teachers;
//         } catch (error) {
//             console.error('❌ Error fetching teachers:', error);
//             this.teachers = [];
//             throw error;
//         }
//     }

//     // Fetch students for a specific class
//     async fetchClassStudents(classId) {
//         try {
//             this.loading = true;
//             this.error = null;

//             console.log(`📋 Fetching students for class ${classId}...`);
//             const data = await Api.getAdminClassStudents(classId);

//             this.students = Array.isArray(data) ? data : [];
//             console.log(`✅ Loaded ${this.students.length} students`);

//             return this.students;
//         } catch (error) {
//             console.error('❌ Error fetching students:', error);
//             this.error = error.message;
//             this.students = [];
//             throw error;
//         } finally {
//             this.loading = false;
//         }
//     }

//     // Create new class (admin)
//     async createClass(classData) {
//         try {
//             this.loading = true;
//             this.error = null;

//             console.log('📝 Creating new class:', classData);
//             const result = await Api.createAdminClass(classData);

//             // Refresh classes list
//             await this.fetchAllClasses(this.pagination.page, this.pagination.limit, this.filters.search);

//             console.log('✅ Class created successfully');
//             return result;
//         } catch (error) {
//             console.error('❌ Error creating class:', error);
//             this.error = error.message;
//             throw error;
//         } finally {
//             this.loading = false;
//         }
//     }

//     // Update existing class (admin)
//     async updateClass(classId, classData) {
//         try {
//             this.loading = true;
//             this.error = null;

//             console.log(`📝 Updating class ${classId}:`, classData);
//             const result = await Api.updateAdminClass(classId, classData);

//             // Update local data
//             const classIndex = this.classes.findIndex(cls => cls.id === classId);
//             if (classIndex !== -1) {
//                 this.classes[classIndex] = { ...this.classes[classIndex], ...classData };
//             }

//             console.log('✅ Class updated successfully');
//             return result;
//         } catch (error) {
//             console.error('❌ Error updating class:', error);
//             this.error = error.message;
//             throw error;
//         } finally {
//             this.loading = false;
//         }
//     }

//     // Delete class (admin)
//     async deleteClass(classId) {
//         try {
//             this.loading = true;
//             this.error = null;

//             console.log(`🗑️ Deleting class ${classId}`);
//             const result = await Api.deleteAdminClass(classId);

//             // Remove from local data
//             this.classes = this.classes.filter(cls => cls.id !== classId);

//             console.log('✅ Class deleted successfully');
//             return result;
//         } catch (error) {
//             console.error('❌ Error deleting class:', error);
//             this.error = error.message;
//             throw error;
//         } finally {
//             this.loading = false;
//         }
//     }

//     // Transfer class ownership to another teacher
//     async transferClassOwnership(classId, newTeacherId) {
//         try {
//             this.loading = true;
//             this.error = null;

//             console.log(`🔄 Transferring class ${classId} to teacher ${newTeacherId}`);
//             const result = await Api.transferClassOwnership(classId, newTeacherId);

//             // Update local data
//             const classIndex = this.classes.findIndex(cls => cls.id === classId);
//             if (classIndex !== -1) {
//                 const newTeacher = this.teachers.find(t => t.id === newTeacherId);
//                 this.classes[classIndex] = {
//                     ...this.classes[classIndex],
//                     teacher_id: newTeacherId,
//                     teacher: newTeacher ? {
//                         id: newTeacher.id,
//                         full_name: newTeacher.full_name,
//                         email: newTeacher.email
//                     } : this.classes[classIndex].teacher
//                 };
//             }

//             console.log('✅ Class ownership transferred successfully');
//             return result;
//         } catch (error) {
//             console.error('❌ Error transferring class ownership:', error);
//             this.error = error.message;
//             throw error;
//         } finally {
//             this.loading = false;
//         }
//     }

//     // Remove student from class (admin)
//     async removeStudentFromClass(classId, studentId) {
//         try {
//             this.loading = true;
//             this.error = null;

//             console.log(`🗑️ Removing student ${studentId} from class ${classId}`);
//             const result = await Api.removeStudentFromClassAdmin(classId, studentId);

//             // Remove from local students data
//             this.students = this.students.filter(student => student.id !== studentId);

//             // Update class student count
//             const classIndex = this.classes.findIndex(cls => cls.id === classId);
//             if (classIndex !== -1 && this.classes[classIndex].student_count > 0) {
//                 this.classes[classIndex].student_count -= 1;
//             }

//             console.log('✅ Student removed successfully');
//             return result;
//         } catch (error) {
//             console.error('❌ Error removing student:', error);
//             this.error = error.message;
//             throw error;
//         } finally {
//             this.loading = false;
//         }
//     }

//     // Get filtered and sorted classes
//     getFilteredClasses() {
//         let filtered = [...this.classes];

//         // Apply search filter
//         if (this.filters.search.trim()) {
//             const searchTerm = this.filters.search.toLowerCase().trim();
//             filtered = filtered.filter(cls => {
//                 const teacherName = cls.teacher?.full_name || cls.teacher_name || '';
//                 const teacherEmail = cls.teacher?.email || cls.teacher_email || '';

//                 return (cls.name || '').toLowerCase().includes(searchTerm) ||
//                     teacherName.toLowerCase().includes(searchTerm) ||
//                     teacherEmail.toLowerCase().includes(searchTerm) ||
//                     (cls.program_studi || '').toLowerCase().includes(searchTerm) ||
//                     (cls.perguruan_tinggi || '').toLowerCase().includes(searchTerm);
//             });
//         }

//         // Apply teacher filter
//         if (this.filters.teacherFilter !== 'all') {
//             filtered = filtered.filter(cls => cls.teacher_id === this.filters.teacherFilter);
//         }

//         // Apply sorting
//         filtered.sort((a, b) => {
//             let aValue, bValue;

//             switch (this.filters.sortBy) {
//                 case 'name':
//                     aValue = (a.name || '').toLowerCase();
//                     bValue = (b.name || '').toLowerCase();
//                     break;
//                 case 'teacher_name':
//                     aValue = (a.teacher_name || '').toLowerCase();
//                     bValue = (b.teacher_name || '').toLowerCase();
//                     break;
//                 case 'created_at':
//                     aValue = new Date(a.created_at || 0);
//                     bValue = new Date(b.created_at || 0);
//                     break;
//                 case 'student_count':
//                     aValue = a.student_count || 0;
//                     bValue = b.student_count || 0;
//                     break;
//                 default:
//                     aValue = a.name || '';
//                     bValue = b.name || '';
//             }

//             if (this.filters.sortOrder === 'desc') {
//                 return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
//             } else {
//                 return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
//             }
//         });

//         return filtered;
//     }

//     // Get class by ID
//     getClassById(id) {
//         return this.classes.find(cls => cls.id === id);
//     }

//     // Get teacher by ID
//     getTeacherById(id) {
//         return this.teachers.find(teacher => teacher.id === id);
//     }

//     // Get student by ID
//     getStudentById(id) {
//         return this.students.find(student => student.id === id);
//     }

//     // Get class statistics
//     getClassStatistics() {
//         const totalClasses = this.classes.length;
//         const totalStudents = this.classes.reduce((sum, cls) => sum + (cls.student_count || 0), 0);
//         const averageStudentsPerClass = totalClasses > 0 ? Math.round(totalStudents / totalClasses) : 0;
//         const activeClasses = this.classes.filter(cls => (cls.student_count || 0) > 0).length;
//         const uniqueTeachers = new Set(this.classes.map(cls => cls.teacher_id)).size;

//         return {
//             totalClasses,
//             totalStudents,
//             averageStudentsPerClass,
//             activeClasses,
//             uniqueTeachers
//         };
//     }

//     // Set filter
//     setFilter(key, value) {
//         this.filters[key] = value;
//     }

//     // Clear filters
//     clearFilters() {
//         this.filters = {
//             search: '',
//             teacherFilter: 'all',
//             sortBy: 'name',
//             sortOrder: 'asc'
//         };
//     }

//     // Set form mode and selected class
//     setFormMode(mode, classId = null) {
//         this.formMode = mode;
//         this.selectedClassId = classId;
//         this.currentClass = classId ? this.getClassById(classId) : null;
//     }

//     // Validate class data (admin)
//     validateClassData(data) {
//         const errors = [];

//         if (!data.name || data.name.trim().length < 2) {
//             errors.push('Nama kelas minimal 2 karakter');
//         }

//         if (data.name && data.name.trim().length > 100) {
//             errors.push('Nama kelas maksimal 100 karakter');
//         }

//         if (!data.teacher_id) {
//             errors.push('Teacher harus dipilih');
//         }

//         // Check for duplicate names (excluding current class in edit mode)
//         const duplicateClass = this.classes.find(cls =>
//             cls.name.toLowerCase() === data.name.trim().toLowerCase() &&
//             cls.id !== this.selectedClassId
//         );

//         if (duplicateClass) {
//             errors.push('Nama kelas sudah digunakan');
//         }

//         return {
//             isValid: errors.length === 0,
//             errors
//         };
//     }

//     // Format date for display
//     formatDate(dateString) {
//         if (!dateString) return '-';

//         try {
//             const date = new Date(dateString);
//             return date.toLocaleDateString('id-ID', {
//                 year: 'numeric',
//                 month: 'short',
//                 day: 'numeric',
//                 hour: '2-digit',
//                 minute: '2-digit'
//             });
//         } catch (error) {
//             return dateString;
//         }
//     }

//     // Reset model state
//     reset() {
//         this.classes = [];
//         this.teachers = [];
//         this.students = [];
//         this.loading = false;
//         this.error = null;
//         this.currentClass = null;
//         this.selectedClassId = null;
//         this.clearFilters();
//         this.formMode = 'create';
//         this.pagination = {
//             page: 1,
//             limit: 20,
//             total: 0,
//             totalPages: 0
//         };
//     }
// }

// export default AdminManageClassModel;
// File: src/scripts/pages/admin/manage-class/model.js - Fixed version
import Api from '../../../data/api.js';

class AdminManageClassModel {
    constructor() {
        this.classes = [];
        this.teachers = [];
        this.students = [];
        this.loading = false;
        this.error = null;
        this.currentClass = null;
        this.filters = {
            search: '',
            teacherFilter: 'all', // all, specific teacher id
            sortBy: 'name', // name, created_at, student_count, teacher_name
            sortOrder: 'asc' // asc, desc
        };
        this.pagination = {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0
        };
        this.formMode = 'create'; // create, edit, transfer
        this.selectedClassId = null;
    }

    // Fetch all classes (admin view)
    async fetchAllClasses(page = 1, limit = 20, search = '') {
        try {
            this.loading = true;
            this.error = null;

            console.log('📋 Fetching all classes for admin...');

            // Use getAllClasses API method with proper params
            const data = await Api.getAllClasses({
                page,
                limit,
                search: search || ''
            });

            // Handle response structure
            if (data && data.classes) {
                this.classes = Array.isArray(data.classes) ? data.classes : [];
                this.pagination = {
                    page: data.pagination?.page || page,
                    limit: data.pagination?.limit || limit,
                    total: data.pagination?.total || 0,
                    totalPages: data.pagination?.totalPages || 0
                };
            } else if (Array.isArray(data)) {
                // Fallback for simple array response
                this.classes = data;
                this.pagination = {
                    page: 1,
                    limit: data.length,
                    total: data.length,
                    totalPages: 1
                };
            } else {
                this.classes = [];
            }

            // Enrich classes with teacher data if we have teachers loaded
            if (this.teachers.length > 0) {
                this.classes = this.classes.map(cls => {
                    const teacher = this.teachers.find(t => t.id === cls.teacher_id);
                    return {
                        ...cls,
                        teacher_name: teacher?.full_name || 'Unknown Teacher',
                        teacher_email: teacher?.email || '-'
                    };
                });
            }

            console.log(`✅ Loaded ${this.classes.length} classes`);
            return this.classes;
        } catch (error) {
            console.error('❌ Error fetching classes:', error);
            this.error = error.message;
            this.classes = [];
            throw error;
        } finally {
            this.loading = false;
        }
    }

    // Fetch all teachers for dropdown
    async fetchAllTeachers() {
        try {
            console.log('👨‍🏫 Fetching all teachers...');

            // Use getAllTeachers API method
            const data = await Api.getAllTeachers({
                limit: 100 // Get more teachers for dropdown
            });

            // Handle response structure
            if (data && data.teachers) {
                this.teachers = Array.isArray(data.teachers) ? data.teachers : [];
            } else if (Array.isArray(data)) {
                this.teachers = data;
            } else {
                this.teachers = [];
            }

            console.log(`✅ Loaded ${this.teachers.length} teachers`);
            return this.teachers;
        } catch (error) {
            console.error('❌ Error fetching teachers:', error);
            this.teachers = [];
            throw error;
        }
    }

    // Fetch students for a specific class
    async fetchClassStudents(classId) {
        try {
            this.loading = true;
            this.error = null;

            console.log(`📋 Fetching students for class ${classId}...`);
            const data = await Api.getAdminClassStudents(classId);

            this.students = Array.isArray(data) ? data : [];
            console.log(`✅ Loaded ${this.students.length} students`);

            return this.students;
        } catch (error) {
            console.error('❌ Error fetching students:', error);
            this.error = error.message;
            this.students = [];
            throw error;
        } finally {
            this.loading = false;
        }
    }

    // Create new class (admin)
    async createClass(classData) {
        try {
            this.loading = true;
            this.error = null;

            console.log('📝 Creating new class:', classData);
            const result = await Api.createAdminClass(classData);

            // Refresh classes list
            await this.fetchAllClasses(this.pagination.page, this.pagination.limit, this.filters.search);

            console.log('✅ Class created successfully');
            return result;
        } catch (error) {
            console.error('❌ Error creating class:', error);
            this.error = error.message;
            throw error;
        } finally {
            this.loading = false;
        }
    }

    // Update existing class (admin) - FIXED: Only for class details, not teacher
    async updateClass(classId, classData) {
        try {
            this.loading = true;
            this.error = null;

            console.log(`📝 Updating class ${classId}:`, classData);
            const result = await Api.updateAdminClass(classId, classData);

            // Update local data
            const classIndex = this.classes.findIndex(cls => cls.id === classId);
            if (classIndex !== -1) {
                this.classes[classIndex] = { ...this.classes[classIndex], ...classData };
            }

            console.log('✅ Class updated successfully');
            return result;
        } catch (error) {
            console.error('❌ Error updating class:', error);
            this.error = error.message;
            throw error;
        } finally {
            this.loading = false;
        }
    }

    // Delete class (admin)
    async deleteClass(classId) {
        try {
            this.loading = true;
            this.error = null;

            console.log(`🗑️ Deleting class ${classId}`);
            const result = await Api.deleteAdminClass(classId);

            // Remove from local data
            this.classes = this.classes.filter(cls => cls.id !== classId);

            console.log('✅ Class deleted successfully');
            return result;
        } catch (error) {
            console.error('❌ Error deleting class:', error);
            this.error = error.message;
            throw error;
        } finally {
            this.loading = false;
        }
    }

    // Transfer class ownership to another teacher
    async transferClassOwnership(classId, newTeacherId) {
        try {
            this.loading = true;
            this.error = null;

            console.log(`🔄 Transferring class ${classId} to teacher ${newTeacherId}`);
            const result = await Api.transferClassOwnership(classId, newTeacherId);

            // Update local data
            const classIndex = this.classes.findIndex(cls => cls.id === classId);
            if (classIndex !== -1) {
                const newTeacher = this.teachers.find(t => t.id === newTeacherId);
                this.classes[classIndex] = {
                    ...this.classes[classIndex],
                    teacher_id: newTeacherId,
                    teacher_name: newTeacher?.full_name || 'Unknown Teacher',
                    teacher_email: newTeacher?.email || '-'
                };
            }

            console.log('✅ Class ownership transferred successfully');
            return result;
        } catch (error) {
            console.error('❌ Error transferring class ownership:', error);
            this.error = error.message;
            throw error;
        } finally {
            this.loading = false;
        }
    }

    // Remove student from class (admin)
    async removeStudentFromClass(classId, studentId) {
        try {
            this.loading = true;
            this.error = null;

            console.log(`🗑️ Removing student ${studentId} from class ${classId}`);
            const result = await Api.removeStudentFromClassAdmin(classId, studentId);

            // Remove from local students data
            this.students = this.students.filter(student => student.id !== studentId);

            // Update class student count
            const classIndex = this.classes.findIndex(cls => cls.id === classId);
            if (classIndex !== -1 && this.classes[classIndex].student_count > 0) {
                this.classes[classIndex].student_count -= 1;
            }

            console.log('✅ Student removed successfully');
            return result;
        } catch (error) {
            console.error('❌ Error removing student:', error);
            this.error = error.message;
            throw error;
        } finally {
            this.loading = false;
        }
    }

    // Get filtered and sorted classes
    getFilteredClasses() {
        let filtered = [...this.classes];

        // Apply search filter
        if (this.filters.search.trim()) {
            const searchTerm = this.filters.search.toLowerCase().trim();
            filtered = filtered.filter(cls => {
                const teacherName = cls.teacher?.full_name || cls.teacher_name || '';
                const teacherEmail = cls.teacher?.email || cls.teacher_email || '';

                return (cls.name || '').toLowerCase().includes(searchTerm) ||
                    teacherName.toLowerCase().includes(searchTerm) ||
                    teacherEmail.toLowerCase().includes(searchTerm) ||
                    (cls.program_studi || '').toLowerCase().includes(searchTerm) ||
                    (cls.perguruan_tinggi || '').toLowerCase().includes(searchTerm);
            });
        }

        // Apply teacher filter
        if (this.filters.teacherFilter !== 'all') {
            filtered = filtered.filter(cls => cls.teacher_id === this.filters.teacherFilter);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aValue, bValue;

            switch (this.filters.sortBy) {
                case 'name':
                    aValue = (a.name || '').toLowerCase();
                    bValue = (b.name || '').toLowerCase();
                    break;
                case 'teacher_name':
                    aValue = (a.teacher_name || '').toLowerCase();
                    bValue = (b.teacher_name || '').toLowerCase();
                    break;
                case 'created_at':
                    aValue = new Date(a.created_at || 0);
                    bValue = new Date(b.created_at || 0);
                    break;
                case 'student_count':
                    aValue = a.student_count || 0;
                    bValue = b.student_count || 0;
                    break;
                default:
                    aValue = a.name || '';
                    bValue = b.name || '';
            }

            if (this.filters.sortOrder === 'desc') {
                return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
            } else {
                return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
            }
        });

        return filtered;
    }

    // Get class by ID
    getClassById(id) {
        return this.classes.find(cls => cls.id === id);
    }

    // Get teacher by ID
    getTeacherById(id) {
        return this.teachers.find(teacher => teacher.id === id);
    }

    // Get student by ID
    getStudentById(id) {
        return this.students.find(student => student.id === id);
    }

    // Get class statistics
    getClassStatistics() {
        const totalClasses = this.classes.length;
        const totalStudents = this.classes.reduce((sum, cls) => sum + (cls.student_count || 0), 0);
        const averageStudentsPerClass = totalClasses > 0 ? Math.round(totalStudents / totalClasses) : 0;
        const activeClasses = this.classes.filter(cls => (cls.student_count || 0) > 0).length;
        const uniqueTeachers = new Set(this.classes.map(cls => cls.teacher_id)).size;

        return {
            totalClasses,
            totalStudents,
            averageStudentsPerClass,
            activeClasses,
            uniqueTeachers
        };
    }

    // Set filter
    setFilter(key, value) {
        this.filters[key] = value;
    }

    // Clear filters
    clearFilters() {
        this.filters = {
            search: '',
            teacherFilter: 'all',
            sortBy: 'name',
            sortOrder: 'asc'
        };
    }

    // Set form mode and selected class
    setFormMode(mode, classId = null) {
        this.formMode = mode;
        this.selectedClassId = classId;
        this.currentClass = classId ? this.getClassById(classId) : null;
    }

    // FIXED: Validate class data - Different rules for create vs edit
    validateClassData(data, mode = 'create') {
        const errors = [];

        // Name validation (always required)
        if (!data.name || data.name.trim().length < 2) {
            errors.push('Nama kelas minimal 2 karakter');
        }

        if (data.name && data.name.trim().length > 100) {
            errors.push('Nama kelas maksimal 100 karakter');
        }

        // Teacher validation - Only for create mode
        if (mode === 'create') {
            if (!data.teacher_id) {
                errors.push('Teacher harus dipilih');
            }
        }

        // Transfer validation - Only for transfer mode
        if (mode === 'transfer') {
            if (!data.teacher_id) {
                errors.push('Teacher tujuan harus dipilih');
            }

            // Check if different from current teacher
            if (this.currentClass && data.teacher_id === this.currentClass.teacher_id) {
                errors.push('Teacher tujuan harus berbeda dari teacher saat ini');
            }
        }

        // Check for duplicate names
        if (data.name) {
            let duplicateClass = null;

            if (mode === 'create' && data.teacher_id) {
                // For create: check duplicates for the selected teacher
                duplicateClass = this.classes.find(cls =>
                    cls.name.toLowerCase() === data.name.trim().toLowerCase() &&
                    cls.teacher_id === data.teacher_id
                );
            } else if (mode === 'edit') {
                // For edit: check duplicates for the same teacher, excluding current class
                const currentClass = this.getClassById(this.selectedClassId);
                if (currentClass) {
                    duplicateClass = this.classes.find(cls =>
                        cls.name.toLowerCase() === data.name.trim().toLowerCase() &&
                        cls.teacher_id === currentClass.teacher_id &&
                        cls.id !== this.selectedClassId
                    );
                }
            } else if (mode === 'transfer' && data.teacher_id) {
                // For transfer: check if target teacher already has class with same name
                duplicateClass = this.classes.find(cls =>
                    cls.name.toLowerCase() === this.currentClass.name.toLowerCase() &&
                    cls.teacher_id === data.teacher_id &&
                    cls.id !== this.selectedClassId
                );

                if (duplicateClass) {
                    const targetTeacher = this.getTeacherById(data.teacher_id);
                    errors.push(`Teacher ${targetTeacher?.full_name || 'tersebut'} sudah memiliki kelas dengan nama yang sama`);
                }
            }

            if (duplicateClass && mode !== 'transfer') {
                errors.push('Nama kelas sudah digunakan oleh teacher ini');
            }
        }

        // Optional field validations
        if (data.program_studi && data.program_studi.length > 100) {
            errors.push('Program studi maksimal 100 karakter');
        }

        if (data.perguruan_tinggi && data.perguruan_tinggi.length > 100) {
            errors.push('Perguruan tinggi maksimal 100 karakter');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Validate create class data
    validateCreateClassData(data) {
        return this.validateClassData(data, 'create');
    }

    // Validate edit class data
    validateEditClassData(data) {
        return this.validateClassData(data, 'edit');
    }

    // Validate transfer class data
    validateTransferClassData(data) {
        console.log('🔄 DEBUG MODEL: validateTransferClassData called with:', data);

        const errors = [];

        // ONLY validate teacher_id - NO OTHER FIELDS
        if (!data.teacher_id) {
            errors.push('Teacher tujuan harus dipilih');
        }

        // Check if different from current teacher
        if (this.currentClass && data.teacher_id === this.currentClass.teacher_id) {
            errors.push('Teacher tujuan harus berbeda dari teacher saat ini');
        }

        const result = {
            isValid: errors.length === 0,
            errors
        };

        console.log('🔄 DEBUG MODEL: validateTransferClassData result:', result);
        return result;
    }

    // Format date for display
    formatDate(dateString) {
        if (!dateString) return '-';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return dateString;
        }
    }

    // Reset model state
    reset() {
        this.classes = [];
        this.teachers = [];
        this.students = [];
        this.loading = false;
        this.error = null;
        this.currentClass = null;
        this.selectedClassId = null;
        this.clearFilters();
        this.formMode = 'create';
        this.pagination = {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0
        };
    }

    // Get available teachers for transfer (excluding current teacher)
    getAvailableTeachersForTransfer(currentTeacherId) {
        return this.teachers.filter(teacher => teacher.id !== currentTeacherId);
    }

    // Check if a teacher has conflicts with class name
    checkTeacherClassNameConflict(teacherId, className, excludeClassId = null) {
        return this.classes.some(cls =>
            cls.teacher_id === teacherId &&
            cls.name.toLowerCase() === className.toLowerCase() &&
            cls.id !== excludeClassId
        );
    }

    // Get teacher's classes count
    getTeacherClassCount(teacherId) {
        return this.classes.filter(cls => cls.teacher_id === teacherId).length;
    }

    // Get teacher's students count
    getTeacherStudentCount(teacherId) {
        return this.classes
            .filter(cls => cls.teacher_id === teacherId)
            .reduce((sum, cls) => sum + (cls.student_count || 0), 0);
    }

    // Enhanced statistics for individual teachers
    getTeacherStatistics() {
        const teacherStats = {};

        this.teachers.forEach(teacher => {
            const teacherClasses = this.classes.filter(cls => cls.teacher_id === teacher.id);
            const totalStudents = teacherClasses.reduce((sum, cls) => sum + (cls.student_count || 0), 0);

            teacherStats[teacher.id] = {
                id: teacher.id,
                name: teacher.full_name,
                email: teacher.email,
                classCount: teacherClasses.length,
                studentCount: totalStudents,
                averageStudentsPerClass: teacherClasses.length > 0 ? Math.round(totalStudents / teacherClasses.length) : 0,
                classes: teacherClasses.map(cls => ({
                    id: cls.id,
                    name: cls.name,
                    studentCount: cls.student_count || 0
                }))
            };
        });

        return teacherStats;
    }

    // Search helpers
    searchClasses(searchTerm) {
        if (!searchTerm || !searchTerm.trim()) {
            return this.classes;
        }

        const term = searchTerm.toLowerCase().trim();
        return this.classes.filter(cls => {
            const teacherName = cls.teacher_name || '';
            const teacherEmail = cls.teacher_email || '';

            return (cls.name || '').toLowerCase().includes(term) ||
                teacherName.toLowerCase().includes(term) ||
                teacherEmail.toLowerCase().includes(term) ||
                (cls.program_studi || '').toLowerCase().includes(term) ||
                (cls.perguruan_tinggi || '').toLowerCase().includes(term) ||
                (cls.class_code || '').toLowerCase().includes(term);
        });
    }

    // Sort helpers
    sortClasses(classes, sortBy, sortOrder = 'asc') {
        const sorted = [...classes].sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case 'name':
                    aValue = (a.name || '').toLowerCase();
                    bValue = (b.name || '').toLowerCase();
                    break;
                case 'teacher_name':
                    aValue = (a.teacher_name || '').toLowerCase();
                    bValue = (b.teacher_name || '').toLowerCase();
                    break;
                case 'created_at':
                    aValue = new Date(a.created_at || 0);
                    bValue = new Date(b.created_at || 0);
                    break;
                case 'student_count':
                    aValue = a.student_count || 0;
                    bValue = b.student_count || 0;
                    break;
                case 'program_studi':
                    aValue = (a.program_studi || '').toLowerCase();
                    bValue = (b.program_studi || '').toLowerCase();
                    break;
                case 'perguruan_tinggi':
                    aValue = (a.perguruan_tinggi || '').toLowerCase();
                    bValue = (b.perguruan_tinggi || '').toLowerCase();
                    break;
                default:
                    aValue = (a.name || '').toLowerCase();
                    bValue = (b.name || '').toLowerCase();
            }

            if (sortOrder === 'desc') {
                return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
            } else {
                return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
            }
        });

        return sorted;
    }
}

export default AdminManageClassModel;