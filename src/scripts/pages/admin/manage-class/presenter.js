// // presenter.js - Fixed version
// import AdminManageClassModel from './model';

// class AdminManageClassPresenter {
//     constructor(view) {
//         this.view = view;
//         this.model = new AdminManageClassModel();
//         this._destroyed = false; // Add flag to prevent multiple cleanup calls

//         this.init();
//     }

//     async init() {
//         console.log('🎯 Initializing Admin Manage Class Presenter...');

//         // Set up event handlers
//         this.setupEventHandlers();

//         // Load initial data
//         await this.loadInitialData();
//     }

//     setupEventHandlers() {
//         // Search and filter handlers
//         this.view.onSearchChange = (searchTerm) => {
//             this.handleSearchChange(searchTerm);
//         };

//         this.view.onTeacherFilterChange = (teacherId) => {
//             this.handleTeacherFilterChange(teacherId);
//         };

//         this.view.onSortChange = (sortBy, sortOrder) => {
//             this.handleSortChange(sortBy, sortOrder);
//         };

//         // Class management handlers
//         this.view.onCreateClass = (classData) => {
//             this.handleCreateClass(classData);
//         };

//         this.view.onEditClass = (classId, classData) => {
//             this.handleEditClass(classId, classData);
//         };

//         this.view.onDeleteClass = (classId) => {
//             this.handleDeleteClass(classId);
//         };

//         this.view.onViewClass = (classId) => {
//             this.handleViewClass(classId);
//         };

//         this.view.onTransferClass = (classId, newTeacherId) => {
//             this.handleTransferClass(classId, newTeacherId);
//         };

//         // Student management handlers
//         this.view.onViewStudents = (classId) => {
//             this.handleViewStudents(classId);
//         };

//         this.view.onRemoveStudent = (classId, studentId) => {
//             this.handleRemoveStudent(classId, studentId);
//         };

//         // UI handlers
//         this.view.onRefresh = () => {
//             this.handleRefresh();
//         };

//         this.view.onShowCreateForm = () => {
//             this.handleShowCreateForm();
//         };

//         this.view.onShowEditForm = (classId) => {
//             this.handleShowEditForm(classId);
//         };

//         this.view.onShowTransferForm = (classId) => {
//             this.handleShowTransferForm(classId);
//         };

//         // Pagination handlers
//         this.view.onPageChange = (page) => {
//             this.handlePageChange(page);
//         };
//     }

//     // Load initial data
//     async loadInitialData() {
//         try {
//             this.view.showLoading();

//             // Load teachers first for dropdowns
//             console.log('📋 Loading teachers...');
//             await this.model.fetchAllTeachers();

//             // Then load classes
//             console.log('📋 Loading classes...');
//             await this.model.fetchAllClasses();

//             this.render();
//             console.log('✅ Initial data loaded successfully');
//         } catch (error) {
//             console.error('❌ Error loading initial data:', error);
//             this.view.showError('Gagal memuat data: ' + error.message);
//         } finally {
//             this.view.hideLoading();
//         }
//     }

//     // Load classes data
//     async loadClasses() {
//         try {
//             this.view.showLoading();
//             await this.model.fetchAllClasses(
//                 this.model.pagination.page,
//                 this.model.pagination.limit,
//                 this.model.filters.search
//             );
//             this.render();
//         } catch (error) {
//             console.error('❌ Error loading classes:', error);
//             this.view.showError('Gagal memuat data kelas: ' + error.message);
//         } finally {
//             this.view.hideLoading();
//         }
//     }

//     // Handle search change
//     handleSearchChange(searchTerm) {
//         console.log('🔍 Search term changed to:', searchTerm);
//         this.model.setFilter('search', searchTerm);
//         this.model.pagination.page = 1; // Reset to first page
//         this.loadClasses();
//     }

//     // Handle teacher filter change
//     handleTeacherFilterChange(teacherId) {
//         console.log('👨‍🏫 Teacher filter changed to:', teacherId);
//         this.model.setFilter('teacherFilter', teacherId);
//         this.render();
//     }

//     // Handle sort change
//     handleSortChange(sortBy, sortOrder) {
//         console.log('📊 Sort changed to:', sortBy, sortOrder);
//         this.model.setFilter('sortBy', sortBy);
//         this.model.setFilter('sortOrder', sortOrder);
//         this.render();
//     }

//     // Handle create class
//     async handleCreateClass(classData) {
//         try {
//             console.log('➕ Creating new class:', classData);

//             // Validate data
//             const validation = this.model.validateClassData(classData);
//             if (!validation.isValid) {
//                 this.view.showValidationErrors(validation.errors);
//                 return;
//             }

//             this.view.showLoading();

//             // Create the class
//             const newClass = await this.model.createClass(classData);

//             this.view.showSuccess('Kelas berhasil dibuat!');
//             this.view.hideCreateForm();

//             // Option 1: Just add the new class to the existing list
//             if (newClass && newClass.id) {
//                 // Enrich with teacher data
//                 const teacher = this.model.teachers.find(t => t.id === newClass.teacher_id);
//                 if (teacher) {
//                     newClass.teacher_name = teacher.full_name;
//                     newClass.teacher_email = teacher.email;
//                 }

//                 // Add to model
//                 this.model.classes.unshift(newClass);

//                 // Re-render without fetching
//                 this.render();
//             } else {
//                 // Option 2: Only reload if we don't have the new class data
//                 await this.loadClasses();
//             }

//         } catch (error) {
//             console.error('❌ Error creating class:', error);
//             this.view.showError('Gagal membuat kelas: ' + error.message);
//         } finally {
//             this.view.hideLoading();
//         }
//     }

//     // Handle edit class
//     async handleEditClass(classId, classData) {
//         try {
//             console.log('✏️ Editing class:', classId, classData);

//             // Set model for editing
//             this.model.setFormMode('edit', classId);

//             // Validate data
//             const validation = this.model.validateClassData(classData);
//             if (!validation.isValid) {
//                 this.view.showValidationErrors(validation.errors);
//                 return;
//             }

//             this.view.showLoading();

//             await this.model.updateClass(classId, classData);

//             this.view.showSuccess('Kelas berhasil diperbarui!');
//             this.view.hideEditForm();

//             // Reload data to get updated list
//             await this.loadClasses();

//         } catch (error) {
//             console.error('❌ Error updating class:', error);
//             this.view.showError('Gagal memperbarui kelas: ' + error.message);
//         } finally {
//             this.view.hideLoading();
//         }
//     }

//     // Handle delete class
//     async handleDeleteClass(classId) {
//         try {
//             console.log('🗑️ Deleting class:', classId);

//             const classData = this.model.getClassById(classId);
//             if (!classData) {
//                 throw new Error('Kelas tidak ditemukan');
//             }

//             // Show confirmation
//             const confirmed = await this.view.showConfirmDialog(
//                 'Hapus Kelas',
//                 `Apakah Anda yakin ingin menghapus kelas "${classData.name}"? Semua siswa akan dikeluarkan dari kelas ini dan data tidak dapat dikembalikan.`,
//                 'Hapus',
//                 'Batal'
//             );

//             if (!confirmed) {
//                 console.log('🚫 Delete cancelled by user');
//                 return;
//             }

//             this.view.showLoading();

//             await this.model.deleteClass(classId);

//             this.view.showSuccess(`Kelas "${classData.name}" berhasil dihapus!`);

//             // Reload data
//             await this.loadClasses();

//         } catch (error) {
//             console.error('❌ Error deleting class:', error);
//             this.view.showError('Gagal menghapus kelas: ' + error.message);
//         } finally {
//             this.view.hideLoading();
//         }
//     }

//     // Handle transfer class ownership
//     async handleTransferClass(classId, newTeacherId) {
//         try {
//             console.log('🔄 Transferring class:', classId, 'to teacher:', newTeacherId);

//             const classData = this.model.getClassById(classId);
//             const newTeacher = this.model.getTeacherById(newTeacherId);

//             if (!classData || !newTeacher) {
//                 throw new Error('Data kelas atau teacher tidak ditemukan');
//             }

//             // Show confirmation
//             const confirmed = await this.view.showConfirmDialog(
//                 'Transfer Kelas',
//                 `Apakah Anda yakin ingin memindahkan kelas "${classData.name}" ke ${newTeacher.full_name}?`,
//                 'Transfer',
//                 'Batal'
//             );

//             if (!confirmed) {
//                 console.log('🚫 Transfer cancelled by user');
//                 return;
//             }

//             this.view.showLoading();

//             await this.model.transferClassOwnership(classId, newTeacherId);

//             this.view.showSuccess(`Kelas "${classData.name}" berhasil dipindahkan ke ${newTeacher.full_name}!`);
//             this.view.hideTransferForm();

//             // Reload data
//             await this.loadClasses();

//         } catch (error) {
//             console.error('❌ Error transferring class:', error);
//             this.view.showError('Gagal memindahkan kelas: ' + error.message);
//         } finally {
//             this.view.hideLoading();
//         }
//     }

//     // Handle view class details
//     handleViewClass(classId) {
//         console.log('👁️ Viewing class details:', classId);
//         const classData = this.model.getClassById(classId);
//         if (classData) {
//             this.view.showClassDetails(classData);
//         }
//     }

//     // Handle view students
//     async handleViewStudents(classId) {
//         try {
//             console.log('👥 Loading students for class:', classId);

//             const classData = this.model.getClassById(classId);
//             if (!classData) {
//                 throw new Error('Kelas tidak ditemukan');
//             }

//             this.view.showLoading();

//             await this.model.fetchClassStudents(classId);

//             this.view.showStudentsModal(classData, this.model.students);

//         } catch (error) {
//             console.error('❌ Error loading students:', error);
//             this.view.showError('Gagal memuat data siswa: ' + error.message);
//         } finally {
//             this.view.hideLoading();
//         }
//     }

//     // Handle remove student
//     async handleRemoveStudent(classId, studentId) {
//         try {
//             console.log('🗑️ Removing student:', studentId, 'from class:', classId);

//             const student = this.model.getStudentById(studentId);
//             if (!student) {
//                 throw new Error('Siswa tidak ditemukan');
//             }

//             // Show confirmation
//             const confirmed = await this.view.showConfirmDialog(
//                 'Keluarkan Siswa',
//                 `Apakah Anda yakin ingin mengeluarkan "${student.full_name}" dari kelas ini?`,
//                 'Keluarkan',
//                 'Batal'
//             );

//             if (!confirmed) {
//                 console.log('🚫 Remove student cancelled by user');
//                 return;
//             }

//             this.view.showLoading();

//             await this.model.removeStudentFromClass(classId, studentId);

//             this.view.showSuccess(`${student.full_name} berhasil dikeluarkan dari kelas!`);

//             // Refresh students list if modal is open
//             if (this.view.isStudentsModalOpen()) {
//                 await this.model.fetchClassStudents(classId);
//                 const classData = this.model.getClassById(classId);
//                 this.view.updateStudentsModal(classData, this.model.students);
//             }

//             // Refresh classes list to update student count
//             await this.loadClasses();

//         } catch (error) {
//             console.error('❌ Error removing student:', error);
//             this.view.showError('Gagal mengeluarkan siswa: ' + error.message);
//         } finally {
//             this.view.hideLoading();
//         }
//     }

//     // Handle page change
//     async handlePageChange(page) {
//         console.log('📄 Page changed to:', page);
//         this.model.pagination.page = page;
//         await this.loadClasses();
//     }

//     // Handle refresh
//     async handleRefresh() {
//         console.log('🔄 Refreshing data...');

//         // Add refresh animation
//         const refreshBtn = document.getElementById('refresh-btn');
//         if (refreshBtn) {
//             const icon = refreshBtn.querySelector('i');
//             if (icon) {
//                 icon.classList.add('animate-spin');
//             }
//         }

//         try {
//             await this.loadInitialData();
//             this.view.showSuccess('Data berhasil dimuat ulang');
//         } catch (error) {
//             console.error('❌ Error refreshing data:', error);
//             this.view.showError('Gagal memuat ulang data: ' + error.message);
//         } finally {
//             // Remove refresh animation
//             if (refreshBtn) {
//                 const icon = refreshBtn.querySelector('i');
//                 if (icon) {
//                     icon.classList.remove('animate-spin');
//                 }
//             }
//         }
//     }

//     // Handle show create form
//     handleShowCreateForm() {
//         console.log('➕ Showing create form');
//         this.model.setFormMode('create');
//         this.view.showCreateForm(this.model.teachers);
//     }

//     // Handle show edit form
//     handleShowEditForm(classId) {
//         console.log('✏️ Showing edit form for class:', classId);
//         const classData = this.model.getClassById(classId);
//         if (classData) {
//             this.model.setFormMode('edit', classId);
//             this.view.showEditForm(classData, this.model.teachers);
//         } else {
//             this.view.showError('Kelas tidak ditemukan');
//         }
//     }

//     // Handle show transfer form
//     handleShowTransferForm(classId) {
//         console.log('🔄 Showing transfer form for class:', classId);
//         const classData = this.model.getClassById(classId);
//         if (classData) {
//             // Filter out current teacher from list
//             const availableTeachers = this.model.teachers.filter(t => t.id !== classData.teacher_id);

//             if (availableTeachers.length === 0) {
//                 this.view.showError('Tidak ada teacher lain yang tersedia untuk transfer');
//                 return;
//             }

//             this.view.showTransferForm(classData, availableTeachers);
//         } else {
//             this.view.showError('Kelas tidak ditemukan');
//         }
//     }

//     // Main render method
//     render() {
//         if (this.model.loading) {
//             return; // Don't render while loading
//         }

//         if (this.model.error) {
//             this.view.showError(this.model.error);
//             return;
//         }

//         // Get filtered and sorted data
//         const filteredClasses = this.model.getFilteredClasses();
//         const statistics = this.model.getClassStatistics();

//         // Render components
//         this.view.renderStatistics(statistics);
//         this.view.renderFilters(this.model.filters, this.model.teachers);
//         this.view.renderClassesTable(filteredClasses);
//         this.view.renderPagination(this.model.pagination);

//         console.log(`📊 Rendered ${filteredClasses.length} classes`);
//     }

//     // Get current model state for debugging
//     getModelState() {
//         return {
//             classes: this.model.classes.length,
//             teachers: this.model.teachers.length,
//             students: this.model.students.length,
//             loading: this.model.loading,
//             error: this.model.error,
//             filters: this.model.filters,
//             pagination: this.model.pagination,
//             formMode: this.model.formMode,
//             selectedClassId: this.model.selectedClassId
//         };
//     }

//     // Cleanup - FIXED to prevent circular calls
//     destroy() {
//         // Prevent multiple destruction calls
//         if (this._destroyed) {
//             return;
//         }

//         console.log('🧹 Cleaning up Admin Manage Class Presenter...');
//         this._destroyed = true;

//         // Reset model
//         if (this.model && this.model.reset) {
//             this.model.reset();
//         }

//         // Clear references without calling view.cleanup()
//         this.view = null;
//         this.model = null;
//     }
// }

// export default AdminManageClassPresenter;
// presenter.js - Fixed version with separated edit and transfer functions
import AdminManageClassModel from './model';

class AdminManageClassPresenter {
    constructor(view) {
        this.view = view;
        this.model = new AdminManageClassModel();
        this._destroyed = false; // Add flag to prevent multiple cleanup calls

        this.init();
    }

    async init() {
        console.log('🎯 Initializing Admin Manage Class Presenter...');

        // Set up event handlers
        this.setupEventHandlers();

        // Load initial data
        await this.loadInitialData();
    }

    setupEventHandlers() {
        // Search and filter handlers
        this.view.onSearchChange = (searchTerm) => {
            this.handleSearchChange(searchTerm);
        };

        this.view.onTeacherFilterChange = (teacherId) => {
            this.handleTeacherFilterChange(teacherId);
        };

        this.view.onSortChange = (sortBy, sortOrder) => {
            this.handleSortChange(sortBy, sortOrder);
        };

        // Class management handlers
        this.view.onCreateClass = (classData) => {
            this.handleCreateClass(classData);
        };

        this.view.onEditClass = (classId, classData) => {
            this.handleEditClass(classId, classData);
        };

        this.view.onDeleteClass = (classId) => {
            this.handleDeleteClass(classId);
        };

        this.view.onViewClass = (classId) => {
            this.handleViewClass(classId);
        };

        this.view.onTransferClass = (classId, newTeacherId) => {
            this.handleTransferClass(classId, newTeacherId);
        };

        // Student management handlers
        this.view.onViewStudents = (classId) => {
            this.handleViewStudents(classId);
        };

        this.view.onRemoveStudent = (classId, studentId) => {
            this.handleRemoveStudent(classId, studentId);
        };

        // UI handlers
        this.view.onRefresh = () => {
            this.handleRefresh();
        };

        this.view.onShowCreateForm = () => {
            this.handleShowCreateForm();
        };

        this.view.onShowEditForm = (classId) => {
            this.handleShowEditForm(classId);
        };

        this.view.onShowTransferForm = (classId) => {
            this.handleShowTransferForm(classId);
        };

        // Pagination handlers
        this.view.onPageChange = (page) => {
            this.handlePageChange(page);
        };
    }

    // Load initial data
    async loadInitialData() {
        try {
            this.view.showLoading();

            // Load teachers first for dropdowns
            console.log('📋 Loading teachers...');
            await this.model.fetchAllTeachers();

            // Then load classes
            console.log('📋 Loading classes...');
            await this.model.fetchAllClasses();

            this.render();
            console.log('✅ Initial data loaded successfully');
        } catch (error) {
            console.error('❌ Error loading initial data:', error);
            this.view.showError('Gagal memuat data: ' + error.message);
        } finally {
            this.view.hideLoading();
        }
    }

    // Load classes data
    async loadClasses() {
        try {
            this.view.showLoading();
            await this.model.fetchAllClasses(
                this.model.pagination.page,
                this.model.pagination.limit,
                this.model.filters.search
            );
            this.render();
        } catch (error) {
            console.error('❌ Error loading classes:', error);
            this.view.showError('Gagal memuat data kelas: ' + error.message);
        } finally {
            this.view.hideLoading();
        }
    }

    // Handle search change
    handleSearchChange(searchTerm) {
        console.log('🔍 Search term changed to:', searchTerm);
        this.model.setFilter('search', searchTerm);
        this.model.pagination.page = 1; // Reset to first page
        this.loadClasses();
    }

    // Handle teacher filter change
    handleTeacherFilterChange(teacherId) {
        console.log('👨‍🏫 Teacher filter changed to:', teacherId);
        this.model.setFilter('teacherFilter', teacherId);
        this.render();
    }

    // Handle sort change
    handleSortChange(sortBy, sortOrder) {
        console.log('📊 Sort changed to:', sortBy, sortOrder);
        this.model.setFilter('sortBy', sortBy);
        this.model.setFilter('sortOrder', sortOrder);
        this.render();
    }

    // Handle create class
    async handleCreateClass(classData) {
        try {
            console.log('➕ Creating new class:', classData);

            // Set form mode for validation
            this.model.setFormMode('create');

            // Validate data using create-specific validation
            const validation = this.model.validateCreateClassData(classData);
            if (!validation.isValid) {
                this.view.showValidationErrors(validation.errors);
                return;
            }

            this.view.showLoading();

            // Create the class
            const newClass = await this.model.createClass(classData);

            this.view.showSuccess('Kelas berhasil dibuat!');
            this.view.hideCreateForm();

            // Option 1: Just add the new class to the existing list
            if (newClass && newClass.data && newClass.data.id) {
                const classData = newClass.data;
                // Enrich with teacher data
                const teacher = this.model.teachers.find(t => t.id === classData.teacher_id);
                if (teacher) {
                    classData.teacher_name = teacher.full_name;
                    classData.teacher_email = teacher.email;
                }

                // Add to model
                this.model.classes.unshift(classData);

                // Re-render without fetching
                this.render();
            } else {
                // Option 2: Only reload if we don't have the new class data
                await this.loadClasses();
            }

        } catch (error) {
            console.error('❌ Error creating class:', error);
            this.view.showError('Gagal membuat kelas: ' + error.message);
        } finally {
            this.view.hideLoading();
        }
    }

    // FIXED: Handle edit class - Only for class details, no teacher change
    async handleEditClass(classId, classData) {
        try {
            console.log('✏️ Editing class details:', classId, classData);

            // Set model for editing
            this.model.setFormMode('edit', classId);

            // Validate data using edit-specific validation (no teacher_id validation)
            const validation = this.model.validateEditClassData(classData);
            if (!validation.isValid) {
                this.view.showValidationErrors(validation.errors);
                return;
            }

            this.view.showLoading();

            // Update class details only (no teacher_id)
            await this.model.updateClass(classId, classData);

            this.view.showSuccess('Detail kelas berhasil diperbarui!');
            this.view.hideEditForm();

            // Reload data to get updated list
            await this.loadClasses();

        } catch (error) {
            console.error('❌ Error updating class:', error);
            this.view.showError('Gagal memperbarui kelas: ' + error.message);
        } finally {
            this.view.hideLoading();
        }
    }

    // Handle delete class
    async handleDeleteClass(classId) {
        try {
            console.log('🗑️ Deleting class:', classId);

            const classData = this.model.getClassById(classId);
            if (!classData) {
                throw new Error('Kelas tidak ditemukan');
            }

            // Show confirmation with more details
            const studentCount = classData.student_count || 0;
            const confirmMessage = studentCount > 0
                ? `Apakah Anda yakin ingin menghapus kelas "${classData.name}"?\n\n⚠️ ${studentCount} siswa akan dikeluarkan dari kelas ini dan data tidak dapat dikembalikan.`
                : `Apakah Anda yakin ingin menghapus kelas "${classData.name}"?\n\nData tidak dapat dikembalikan.`;

            const confirmed = await this.view.showConfirmDialog(
                'Hapus Kelas',
                confirmMessage,
                'Hapus',
                'Batal'
            );

            if (!confirmed) {
                console.log('🚫 Delete cancelled by user');
                return;
            }

            this.view.showLoading();

            await this.model.deleteClass(classId);

            const successMessage = studentCount > 0
                ? `Kelas "${classData.name}" berhasil dihapus dan ${studentCount} siswa telah dikeluarkan!`
                : `Kelas "${classData.name}" berhasil dihapus!`;

            this.view.showSuccess(successMessage);

            // Reload data
            await this.loadClasses();

        } catch (error) {
            console.error('❌ Error deleting class:', error);
            this.view.showError('Gagal menghapus kelas: ' + error.message);
        } finally {
            this.view.hideLoading();
        }
    }

    // FIXED: Handle transfer class ownership - Separate from edit
    async handleTransferClass(classId, newTeacherId) {
        try {
            console.log('🔄 DEBUG: Starting transfer process');
            console.log('🔄 DEBUG: Class ID:', classId);
            console.log('🔄 DEBUG: New Teacher ID:', newTeacherId);

            const classData = this.model.getClassById(classId);
            const newTeacher = this.model.getTeacherById(newTeacherId);

            console.log('🔄 DEBUG: Class Data:', classData);
            console.log('🔄 DEBUG: New Teacher:', newTeacher);

            if (!classData || !newTeacher) {
                throw new Error('Data kelas atau teacher tidak ditemukan');
            }

            // Set model for transfer validation
            this.model.setFormMode('transfer', classId);

            // CRITICAL: Only validate teacher_id for transfer
            const transferData = { teacher_id: newTeacherId };
            console.log('🔄 DEBUG: Transfer Data to Validate:', transferData);

            if (!newTeacherId) {
                this.view.showValidationErrors(['Teacher tujuan harus dipilih']);
                return;
            }

            if (classData.teacher_id === newTeacherId) {
                this.view.showValidationErrors(['Teacher tujuan harus berbeda dari teacher saat ini']);
                return;
            }

            // Show confirmation
            const confirmed = await this.view.showConfirmDialog(
                'Transfer Kelas',
                `Transfer kelas "${classData.name}" ke ${newTeacher.full_name}?`,
                'Transfer',
                'Batal'
            );

            if (!confirmed) {
                console.log('🚫 DEBUG: Transfer cancelled by user');
                return;
            }

            this.view.showLoading();

            console.log('🔄 DEBUG: Calling transferClassOwnership API');
            await this.model.transferClassOwnership(classId, newTeacherId);

            this.view.showSuccess(`Kelas "${classData.name}" berhasil dipindahkan ke ${newTeacher.full_name}!`);
            this.view.hideTransferForm();

            // Reload data
            await this.loadClasses();

        } catch (error) {
            console.error('❌ DEBUG: Error in transfer:', error);
            console.error('❌ DEBUG: Error stack:', error.stack);
            this.view.showError('Gagal memindahkan kelas: ' + error.message);
        } finally {
            this.view.hideLoading();
        }
    }

    // Handle view class details
    handleViewClass(classId) {
        console.log('👁️ Viewing class details:', classId);
        const classData = this.model.getClassById(classId);
        if (classData) {
            this.view.showClassDetails(classData);
        }
    }

    // Handle view students
    async handleViewStudents(classId) {
        try {
            console.log('👥 Loading students for class:', classId);

            const classData = this.model.getClassById(classId);
            if (!classData) {
                throw new Error('Kelas tidak ditemukan');
            }

            this.view.showLoading();

            await this.model.fetchClassStudents(classId);

            this.view.showStudentsModal(classData, this.model.students);

        } catch (error) {
            console.error('❌ Error loading students:', error);
            this.view.showError('Gagal memuat data siswa: ' + error.message);
        } finally {
            this.view.hideLoading();
        }
    }

    // Handle remove student
    async handleRemoveStudent(classId, studentId) {
        try {
            console.log('🗑️ Removing student:', studentId, 'from class:', classId);

            const student = this.model.getStudentById(studentId);
            const classData = this.model.getClassById(classId);

            if (!student) {
                throw new Error('Siswa tidak ditemukan');
            }

            if (!classData) {
                throw new Error('Kelas tidak ditemukan');
            }

            // Show enhanced confirmation
            const confirmMessage = `Apakah Anda yakin ingin mengeluarkan "${student.full_name}" dari kelas "${classData.name}"?\n\n⚠️ Siswa akan kehilangan akses ke semua materi kelas ini.`;

            const confirmed = await this.view.showConfirmDialog(
                'Keluarkan Siswa',
                confirmMessage,
                'Keluarkan',
                'Batal'
            );

            if (!confirmed) {
                console.log('🚫 Remove student cancelled by user');
                return;
            }

            this.view.showLoading();

            await this.model.removeStudentFromClass(classId, studentId);

            this.view.showSuccess(`${student.full_name} berhasil dikeluarkan dari kelas ${classData.name}!`);

            // Refresh students list if modal is open
            if (this.view.isStudentsModalOpen()) {
                await this.model.fetchClassStudents(classId);
                const updatedClassData = this.model.getClassById(classId);
                this.view.updateStudentsModal(updatedClassData, this.model.students);
            }

            // Refresh classes list to update student count
            await this.loadClasses();

        } catch (error) {
            console.error('❌ Error removing student:', error);
            this.view.showError('Gagal mengeluarkan siswa: ' + error.message);
        } finally {
            this.view.hideLoading();
        }
    }

    // Handle page change
    async handlePageChange(page) {
        console.log('📄 Page changed to:', page);
        this.model.pagination.page = page;
        await this.loadClasses();
    }

    // Handle refresh
    async handleRefresh() {
        console.log('🔄 Refreshing data...');

        // Add refresh animation
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            const icon = refreshBtn.querySelector('i');
            if (icon) {
                icon.classList.add('animate-spin');
            }
        }

        try {
            await this.loadInitialData();
            this.view.showSuccess('Data berhasil dimuat ulang');
        } catch (error) {
            console.error('❌ Error refreshing data:', error);
            this.view.showError('Gagal memuat ulang data: ' + error.message);
        } finally {
            // Remove refresh animation
            if (refreshBtn) {
                const icon = refreshBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('animate-spin');
                }
            }
        }
    }

    // Handle show create form
    handleShowCreateForm() {
        console.log('➕ Showing create form');
        this.model.setFormMode('create');
        this.view.showCreateForm(this.model.teachers);
    }

    // FIXED: Handle show edit form - Only shows class details form
    handleShowEditForm(classId) {
        console.log('✏️ Showing edit form for class:', classId);
        const classData = this.model.getClassById(classId);
        if (classData) {
            this.model.setFormMode('edit', classId);

            // Enrich class data with teacher info for display
            const teacher = this.model.getTeacherById(classData.teacher_id);
            const enrichedClassData = {
                ...classData,
                teacher_name: teacher?.full_name || classData.teacher_name || 'Unknown Teacher',
                teacher_email: teacher?.email || classData.teacher_email || '-'
            };

            // Show edit form without teacher dropdown
            this.view.showEditForm(enrichedClassData);
        } else {
            this.view.showError('Kelas tidak ditemukan');
        }
    }

    // FIXED: Handle show transfer form - Separate function for transfer
    handleShowTransferForm(classId) {
        console.log('🔄 Showing transfer form for class:', classId);
        const classData = this.model.getClassById(classId);
        if (classData) {
            // Get available teachers (excluding current teacher)
            const availableTeachers = this.model.getAvailableTeachersForTransfer(classData.teacher_id);

            if (availableTeachers.length === 0) {
                this.view.showError('Tidak ada teacher lain yang tersedia untuk transfer');
                return;
            }

            // Enrich class data with teacher info
            const currentTeacher = this.model.getTeacherById(classData.teacher_id);
            const enrichedClassData = {
                ...classData,
                teacher_name: currentTeacher?.full_name || classData.teacher_name || 'Unknown Teacher',
                teacher_email: currentTeacher?.email || classData.teacher_email || '-'
            };

            this.model.setFormMode('transfer', classId);
            this.view.showTransferForm(enrichedClassData, availableTeachers);
        } else {
            this.view.showError('Kelas tidak ditemukan');
        }
    }

    // Main render method
    render() {
        if (this.model.loading) {
            return; // Don't render while loading
        }

        if (this.model.error) {
            this.view.showError(this.model.error);
            return;
        }

        // Get filtered and sorted data
        const filteredClasses = this.model.getFilteredClasses();
        const statistics = this.model.getClassStatistics();

        // Render components
        this.view.renderStatistics(statistics);
        this.view.renderFilters(this.model.filters, this.model.teachers);
        this.view.renderClassesTable(filteredClasses);
        this.view.renderPagination(this.model.pagination);

        console.log(`📊 Rendered ${filteredClasses.length} classes`);
    }

    // Enhanced model state for debugging
    getModelState() {
        return {
            classes: this.model.classes.length,
            teachers: this.model.teachers.length,
            students: this.model.students.length,
            loading: this.model.loading,
            error: this.model.error,
            filters: this.model.filters,
            pagination: this.model.pagination,
            formMode: this.model.formMode,
            selectedClassId: this.model.selectedClassId,
            currentClass: this.model.currentClass,
            statistics: this.model.getClassStatistics(),
            teacherStats: this.model.getTeacherStatistics()
        };
    }

    // Get detailed class information
    getClassDetails(classId) {
        const classData = this.model.getClassById(classId);
        if (!classData) return null;

        const teacher = this.model.getTeacherById(classData.teacher_id);
        return {
            ...classData,
            teacher: teacher ? {
                id: teacher.id,
                name: teacher.full_name,
                email: teacher.email,
                totalClasses: this.model.getTeacherClassCount(teacher.id),
                totalStudents: this.model.getTeacherStudentCount(teacher.id)
            } : null
        };
    }

    // Get teacher transfer options
    getTransferOptions(classId) {
        const classData = this.model.getClassById(classId);
        if (!classData) return [];

        const availableTeachers = this.model.getAvailableTeachersForTransfer(classData.teacher_id);

        return availableTeachers.map(teacher => ({
            ...teacher,
            hasNameConflict: this.model.checkTeacherClassNameConflict(teacher.id, classData.name),
            classCount: this.model.getTeacherClassCount(teacher.id),
            studentCount: this.model.getTeacherStudentCount(teacher.id)
        }));
    }

    // Bulk operations helpers
    async bulkDeleteClasses(classIds) {
        try {
            this.view.showLoading();
            const results = [];

            for (const classId of classIds) {
                try {
                    await this.model.deleteClass(classId);
                    results.push({ classId, success: true });
                } catch (error) {
                    results.push({ classId, success: false, error: error.message });
                }
            }

            const successCount = results.filter(r => r.success).length;
            const failCount = results.filter(r => !r.success).length;

            if (successCount > 0) {
                this.view.showSuccess(`${successCount} kelas berhasil dihapus${failCount > 0 ? `, ${failCount} gagal` : ''}`);
            }

            if (failCount > 0) {
                const failedClasses = results.filter(r => !r.success);
                console.error('Failed to delete classes:', failedClasses);
            }

            await this.loadClasses();
            return results;

        } catch (error) {
            console.error('❌ Error in bulk delete:', error);
            this.view.showError('Gagal menghapus kelas: ' + error.message);
            throw error;
        } finally {
            this.view.hideLoading();
        }
    }

    // Advanced search and filtering
    performAdvancedSearch(criteria) {
        console.log('🔍 Performing advanced search:', criteria);

        let results = [...this.model.classes];

        // Apply multiple filters
        if (criteria.name) {
            results = results.filter(cls =>
                cls.name.toLowerCase().includes(criteria.name.toLowerCase())
            );
        }

        if (criteria.teacherId) {
            results = results.filter(cls => cls.teacher_id === criteria.teacherId);
        }

        if (criteria.programStudi) {
            results = results.filter(cls =>
                (cls.program_studi || '').toLowerCase().includes(criteria.programStudi.toLowerCase())
            );
        }

        if (criteria.perguruanTinggi) {
            results = results.filter(cls =>
                (cls.perguruan_tinggi || '').toLowerCase().includes(criteria.perguruanTinggi.toLowerCase())
            );
        }

        if (criteria.minStudents !== undefined) {
            results = results.filter(cls => (cls.student_count || 0) >= criteria.minStudents);
        }

        if (criteria.maxStudents !== undefined) {
            results = results.filter(cls => (cls.student_count || 0) <= criteria.maxStudents);
        }

        if (criteria.dateFrom) {
            results = results.filter(cls => new Date(cls.created_at) >= new Date(criteria.dateFrom));
        }

        if (criteria.dateTo) {
            results = results.filter(cls => new Date(cls.created_at) <= new Date(criteria.dateTo));
        }

        return results;
    }

    // Export data helpers
    exportClassData(format = 'json') {
        const data = {
            classes: this.model.classes,
            teachers: this.model.teachers,
            statistics: this.model.getClassStatistics(),
            exportDate: new Date().toISOString(),
            totalRecords: this.model.classes.length
        };

        switch (format.toLowerCase()) {
            case 'json':
                return JSON.stringify(data, null, 2);
            case 'csv':
                return this.convertToCSV(this.model.classes);
            default:
                return data;
        }
    }

    convertToCSV(classes) {
        const headers = ['ID', 'Nama Kelas', 'Teacher', 'Email Teacher', 'Program Studi', 'Perguruan Tinggi', 'Jumlah Siswa', 'Tanggal Dibuat'];
        const rows = classes.map(cls => [
            cls.id,
            cls.name,
            cls.teacher_name || '-',
            cls.teacher_email || '-',
            cls.program_studi || '-',
            cls.perguruan_tinggi || '-',
            cls.student_count || 0,
            cls.created_at ? new Date(cls.created_at).toLocaleDateString('id-ID') : '-'
        ]);

        return [headers, ...rows].map(row =>
            row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
        ).join('\n');
    }

    // Cleanup - FIXED to prevent circular calls
    destroy() {
        // Prevent multiple destruction calls
        if (this._destroyed) {
            return;
        }

        console.log('🧹 Cleaning up Admin Manage Class Presenter...');
        this._destroyed = true;

        // Reset model
        if (this.model && this.model.reset) {
            this.model.reset();
        }

        // Clear references without calling view.cleanup()
        this.view = null;
        this.model = null;
    }
}

export default AdminManageClassPresenter;