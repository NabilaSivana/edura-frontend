
// === File: pages/admin/manage-user/presenter.js (FINAL CLEAN VERSION) ===
import ManageUserModel from "./model.js";
import ManageUserView from "./view.js";

const ManageUserPresenter = {
    view: ManageUserView,
    currentFilters: {
        role: 'student',
        page: 1,
        limit: 10,
        search: ''
    },

    async init() {
        this.setupEventListeners();
        await this.loadInitialData();
    },

    setupEventListeners() {
        // Role filter
        const roleFilter = document.getElementById('role-filter');
        if (roleFilter) {
            roleFilter.addEventListener('change', (e) => {
                this.handleRoleChange(e.target.value);
            });
        }

        // Search input
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.handleSearchChange(e.target.value);
                }, 500);
            });
        }

        // Create user button
        const createBtn = document.getElementById('create-user-btn');
        if (createBtn) {
            createBtn.addEventListener('click', () => {
                this.handleShowCreateForm();
            });
        }

        // Create user triggers (for empty state)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('create-user-trigger')) {
                this.handleShowCreateForm();
            }
        });

        // Import button
        const importBtn = document.getElementById('import-btn');
        const fileInput = document.getElementById('csv-import');

        if (importBtn && fileInput) {
            importBtn.addEventListener('click', () => {
                fileInput.click();
            });

            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.handleImportUsers(e.target.files[0]);
                    e.target.value = '';
                }
            });
        }

        // Export button
        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.handleExportUsers();
            });
        }

        // Refresh button
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadUsers();
            });
        }

        // Table action buttons (using event delegation)
        document.addEventListener('click', (e) => {
            const userId = e.target.closest('[data-user-id]')?.dataset.userId;
            if (!userId) return;

            if (e.target.closest('.edit-user-btn')) {
                this.handleShowEditForm(userId);
            } else if (e.target.closest('.delete-user-btn')) {
                this.handleDeleteUser(userId);
            } else if (e.target.closest('.reset-password-btn')) {
                this.handleResetPassword(userId);
            }
        });

        // Pagination buttons (using event delegation)
        document.addEventListener('click', (e) => {
            if (e.target.closest('.pagination-btn')) {
                const page = parseInt(e.target.closest('.pagination-btn').dataset.page);
                if (page && !isNaN(page)) {
                    this.handlePageChange(page);
                }
            }
        });

        // Modal event delegation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-cancel')) {
                this.view.hideModal();
            }
        });
    },

    async loadInitialData() {
        try {
            this.showLoading();

            // Load statistics
            const stats = await ManageUserModel.getUserStatistics();
            this.view.renderStatistics(stats);

            // Load users
            await this.loadUsers();
        } catch (error) {
            console.error('Error loading initial data:', error);
            this.showError('Gagal memuat data pengguna');
        }
    },

    async loadUsers() {
        try {
            this.showLoading();

            const { role, page, limit, search } = this.currentFilters;
            let result;

            switch (role) {
                case 'student':
                    result = await ManageUserModel.getAllstudent({ page, limit, search });
                    break;
                case 'teacher':
                    result = await ManageUserModel.getAllteacher({ page, limit, search });
                    break;
                case 'admin':
                    result = await ManageUserModel.getAlladmin({ page, limit, search });
                    break;
                default:
                    result = await ManageUserModel.getAllstudent({ page, limit, search });
            }

            this.view.renderUsersTable(result.data || []);
            this.view.renderPagination(result.pagination || {});
            this.hideLoading();
        } catch (error) {
            console.error('Error loading users:', error);
            this.showError('Gagal memuat data pengguna');
        }
    },

    async handleRoleChange(role) {
        this.currentFilters.role = role;
        this.currentFilters.page = 1;
        await this.loadUsers();
    },

    async handleSearchChange(search) {
        this.currentFilters.search = search;
        this.currentFilters.page = 1;
        await this.loadUsers();
    },

    async handlePageChange(page) {
        this.currentFilters.page = page;
        await this.loadUsers();
    },

    async handleShowCreateForm() {
        const modal = this.view.showCreateUserModal();
        if (!modal) return;

        // Setup form submission
        const form = modal.querySelector('#create-user-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleCreateUser(form);
            });

            // Auto-focus first field
            setTimeout(() => {
                const firstInput = form.querySelector('#create-full-name');
                if (firstInput) firstInput.focus();
            }, 100);
        }

        // Setup cancel button
        const cancelBtn = modal.querySelector('.modal-cancel');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.view.hideModal();
            });
        }
    },

    async handleShowEditForm(userId) {
        try {
            const user = await ManageUserModel.getUserById(userId);
            const modal = this.view.showEditUserModal(user);
            if (!modal) return;

            // Setup form submission
            const form = modal.querySelector('#edit-user-form');
            if (form) {
                form.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    await this.handleEditUser(userId, form);
                });

                // Auto-focus first field
                setTimeout(() => {
                    const firstInput = form.querySelector('#edit-full-name');
                    if (firstInput) firstInput.focus();
                }, 100);
            }

            // Setup cancel button
            const cancelBtn = modal.querySelector('.modal-cancel');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    this.view.hideModal();
                });
            }
        } catch (error) {
            console.error('Error loading user details:', error);
            this.view.showToast('Gagal memuat detail user', 'error');
        }
    },

    async handleCreateUser(form) {
        try {
            // Disable submit button to prevent double submission
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Menyimpan...';
            }

            const formData = new FormData(form);
            const userData = {
                full_name: formData.get('full_name'),
                email: formData.get('email'),
                role: formData.get('role'),
                password: formData.get('password') || null,
                send_credentials: formData.get('send_credentials') === 'on'
            };

            await ManageUserModel.createUser(userData);
            this.view.showToast('User berhasil dibuat', 'success');
            this.view.hideModal();
            await this.loadUsers();

            // Update statistics
            const stats = await ManageUserModel.getUserStatistics();
            this.view.renderStatistics(stats);
        } catch (error) {
            console.error('Error creating user:', error);
            this.view.showToast(error.message || 'Gagal membuat user', 'error');
        } finally {
            // Re-enable submit button
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Tambah User';
            }
        }
    },

    async handleEditUser(userId, form) {
        try {
            // Disable submit button to prevent double submission
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Menyimpan...';
            }

            const formData = new FormData(form);
            const updateData = {
                full_name: formData.get('full_name'),
                email: formData.get('email'),
                role: formData.get('role'),
                is_verified: formData.get('is_verified') === 'true',
                plan: formData.get('plan')
            };

            await ManageUserModel.updateUser(userId, updateData);
            this.view.showToast('User berhasil diperbarui', 'success');
            this.view.hideModal();
            await this.loadUsers();
        } catch (error) {
            console.error('Error updating user:', error);
            this.view.showToast(error.message || 'Gagal memperbarui user', 'error');
        } finally {
            // Re-enable submit button
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Simpan Perubahan';
            }
        }
    },

    async handleDeleteUser(userId) {
        const modal = this.view.showConfirmModal(
            'Hapus User',
            'Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak dapat dibatalkan.',
            'Hapus',
            'Batal',
            'danger'
        );

        if (!modal) return;

        // Setup confirm button
        const confirmBtn = modal.querySelector('.modal-confirm');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', async () => {
                try {
                    confirmBtn.disabled = true;
                    confirmBtn.textContent = 'Menghapus...';

                    await ManageUserModel.deleteUser(userId);
                    this.view.showToast('User berhasil dihapus', 'success');
                    this.view.hideModal();
                    await this.loadUsers();

                    // Update statistics
                    const stats = await ManageUserModel.getUserStatistics();
                    this.view.renderStatistics(stats);
                } catch (error) {
                    console.error('Error deleting user:', error);
                    this.view.showToast(error.message || 'Gagal menghapus user', 'error');
                } finally {
                    confirmBtn.disabled = false;
                    confirmBtn.textContent = 'Hapus';
                }
            });
        }
    },

    async handleResetPassword(userId) {
        const modal = this.view.showConfirmModal(
            'Reset Password',
            'Apakah Anda yakin ingin mereset password user ini? Password baru akan dikirim melalui email.',
            'Reset',
            'Batal'
        );

        if (!modal) return;

        // Setup confirm button
        const confirmBtn = modal.querySelector('.modal-confirm');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', async () => {
                try {
                    confirmBtn.disabled = true;
                    confirmBtn.textContent = 'Mereset...';

                    await ManageUserModel.resetUserPassword(userId, { send_email: true });
                    this.view.showToast('Password berhasil direset. Email telah dikirim ke user.', 'success');
                    this.view.hideModal();
                } catch (error) {
                    console.error('Error resetting password:', error);
                    this.view.showToast(error.message || 'Gagal reset password', 'error');
                } finally {
                    confirmBtn.disabled = false;
                    confirmBtn.textContent = 'Reset';
                }
            });
        }
    },

    async handleImportUsers(file) {
        try {
            const result = await ManageUserModel.importUsers(file);
            this.view.showToast(result.message || 'Import berhasil', 'success');
            await this.loadUsers();

            // Update statistics
            const stats = await ManageUserModel.getUserStatistics();
            this.view.renderStatistics(stats);
        } catch (error) {
            console.error('Error importing users:', error);
            this.view.showToast(error.message || 'Gagal import users', 'error');
        }
    },

    async handleExportUsers() {
        try {
            const { role } = this.currentFilters;
            await ManageUserModel.exportUsers(role);
            this.view.showToast('Export berhasil', 'success');
        } catch (error) {
            console.error('Error exporting users:', error);
            this.view.showToast(error.message || 'Gagal export users', 'error');
        }
    },

    // View helper methods
    showLoading() {
        const loadingContainer = document.getElementById('loading-container');
        const tableContainer = document.getElementById('table-container');
        const errorContainer = document.getElementById('error-container');
        const emptyState = document.getElementById('empty-state');

        if (loadingContainer) loadingContainer.classList.remove('hidden');
        if (tableContainer) tableContainer.classList.add('hidden');
        if (errorContainer) errorContainer.classList.add('hidden');
        if (emptyState) emptyState.classList.add('hidden');
    },

    hideLoading() {
        const loadingContainer = document.getElementById('loading-container');
        const tableContainer = document.getElementById('table-container');

        if (loadingContainer) loadingContainer.classList.add('hidden');
        if (tableContainer) tableContainer.classList.remove('hidden');
    },

    showError(message) {
        const errorContainer = document.getElementById('error-container');
        const errorMessage = document.getElementById('error-message');
        const loadingContainer = document.getElementById('loading-container');
        const tableContainer = document.getElementById('table-container');

        if (errorMessage) errorMessage.textContent = message;
        if (errorContainer) errorContainer.classList.remove('hidden');
        if (loadingContainer) loadingContainer.classList.add('hidden');
        if (tableContainer) tableContainer.classList.add('hidden');
    },

    destroy() {
        // Cleanup if needed
        this.view.hideModal();
    }
};

export default ManageUserPresenter;