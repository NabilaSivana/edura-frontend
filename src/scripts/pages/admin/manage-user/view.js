// === File: pages/admin/manage-user/view.js (FINAL CLEAN VERSION) ===
const ManageUserView = {
    render() {
        return `
            <div class="h-screen w-screen flex flex-col">
                <!-- Navbar Container -->
                <div id="navbar-container" class="shrink-0 z-50"></div>
                
                <!-- Main Content Area -->
                <div class="flex flex-1 overflow-hidden">
                    <!-- Sidebar Wrapper -->
                    <div id="sidebar-wrapper"></div>
                    
                    <!-- Main Content -->
                    <main class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
                        <div class="p-6 md:p-16">
                            <div class="max-w-7xl mx-auto">
                                <!-- Header -->
                                <div class="mb-8">
                                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div>
                                            <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                                <span class="text-2xl">👥</span>
                                                Manajemen Pengguna
                                            </h1>
                                            <p class="text-gray-600 dark:text-gray-400 mt-2">
                                                Kelola semua pengguna dalam sistem aplikasi
                                            </p>
                                        </div>
                                        <div class="flex gap-3">
                                            <button 
                                                id="create-user-btn" 
                                                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                                                       transition-colors flex items-center gap-2 font-medium"
                                            >
                                                <i class="fas fa-user-plus"></i>
                                                <span class="hidden sm:inline">Tambah User</span>
                                            </button>
                                            <button 
                                                id="import-btn" 
                                                class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg 
                                                       transition-colors flex items-center gap-2 font-medium"
                                            >
                                                <i class="fas fa-file-import"></i>
                                                <span class="hidden sm:inline">Import CSV</span>
                                            </button>
                                            <button 
                                                id="export-btn" 
                                                class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg 
                                                       transition-colors flex items-center gap-2 font-medium"
                                            >
                                                <i class="fas fa-file-export"></i>
                                                <span class="hidden sm:inline">Export</span>
                                            </button>
                                            <button 
                                                id="refresh-btn" 
                                                class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg 
                                                       transition-colors flex items-center gap-2"
                                            >
                                                <i class="fas fa-sync-alt"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Statistics Cards -->
                                <div id="statistics-container" class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                    <!-- Statistics will be rendered here -->
                                </div>

                                <!-- Filters -->
                                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
                                    <div class="flex flex-col sm:flex-row gap-4">
                                        <!-- Role Filter -->
                                        <div class="w-full sm:w-48">
                                            <label for="role-filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Filter Role
                                            </label>
                                            <select 
                                                id="role-filter" 
                                                name="role-filter"
                                                autocomplete="off"
                                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                                                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="student">Student</option>
                                                <option value="teacher">Teacher</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>

                                        <!-- Search -->
                                        <div class="flex-1">
                                            <label for="search-input" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Pencarian
                                            </label>
                                            <div class="relative">
                                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <i class="fas fa-search text-gray-400"></i>
                                                </div>
                                                <input 
                                                    type="text" 
                                                    id="search-input"
                                                    name="search"
                                                    autocomplete="off"
                                                    placeholder="Cari nama atau email..."
                                                    class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                                                           placeholder-gray-500 dark:placeholder-gray-400 
                                                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Users Table -->
                                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <!-- Loading State -->
                                    <div id="loading-container" class="hidden p-8 text-center">
                                        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        <p class="mt-2 text-gray-600 dark:text-gray-400">Memuat data...</p>
                                    </div>

                                    <!-- Error State -->
                                    <div id="error-container" class="hidden p-8 text-center">
                                        <div class="text-red-500 mb-2">
                                            <i class="fas fa-exclamation-triangle text-3xl"></i>
                                        </div>
                                        <p id="error-message" class="text-red-600 dark:text-red-400"></p>
                                    </div>

                                    <!-- Table -->
                                    <div id="table-container" class="overflow-x-auto">
                                        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead class="bg-gray-50 dark:bg-gray-900">
                                                <tr>
                                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                        User
                                                    </th>
                                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                        Role
                                                    </th>
                                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                                                        Plan
                                                    </th>
                                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                                                        Bergabung
                                                    </th>
                                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                        Aksi
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody id="users-tbody" class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                <!-- Table rows will be rendered here -->
                                            </tbody>
                                        </table>
                                    </div>

                                    <!-- Empty State -->
                                    <div id="empty-state" class="hidden p-8 text-center">
                                        <div class="text-gray-400 mb-4">
                                            <i class="fas fa-users text-6xl"></i>
                                        </div>
                                        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Belum Ada User</h3>
                                        <p class="text-gray-600 dark:text-gray-400 mb-4">Mulai dengan menambahkan user pertama</p>
                                        <button 
                                            class="create-user-trigger px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                        >
                                            Tambah User Pertama
                                        </button>
                                    </div>
                                </div>

                                <!-- Pagination -->
                                <div id="pagination-container" class="mt-6">
                                    <!-- Pagination will be rendered here -->
                                </div>

                                <!-- Import File Input (hidden) -->
                                <input type="file" id="csv-import" name="csv-import" accept=".csv" class="hidden" />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        `;
    },

    // MODAL SYSTEM WITH FORCED STYLES
    showModal(title, content, size = 'max-w-lg') {
        console.log('Creating modal:', title);

        // Remove any existing modal first
        this.hideModal();

        // Create modal container directly in body
        const modalContainer = document.createElement('div');
        modalContainer.id = 'modal-container';
        modalContainer.className = 'modal-overlay';

        modalContainer.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content-wrapper">
                <div class="modal-content ${size}">
                    <div class="modal-header">
                        <h3 class="modal-title">${title}</h3>
                        <button class="modal-close" aria-label="Close modal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                </div>
            </div>
        `;

        // Apply forced styles to ensure visibility
        this.applyModalStyles(modalContainer);

        // Append to body
        document.body.appendChild(modalContainer);

        // Add event listeners
        const backdrop = modalContainer.querySelector('.modal-backdrop');
        const closeBtn = modalContainer.querySelector('.modal-close');

        const closeModal = () => this.hideModal();

        backdrop?.addEventListener('click', closeModal);
        closeBtn?.addEventListener('click', closeModal);

        // ESC key to close
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        console.log('Modal created successfully');
        return modalContainer;
    },

    // Apply styles with !important to override any CSS conflicts
    applyModalStyles(modalContainer) {
        // Container styles
        modalContainer.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            z-index: 2147483647 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 1rem !important;
            visibility: visible !important;
            opacity: 1 !important;
        `;

        // Backdrop styles
        const backdrop = modalContainer.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.style.cssText = `
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                background-color: rgba(0, 0, 0, 0.7) !important;
                z-index: 1 !important;
            `;
        }

        // Content wrapper styles
        const contentWrapper = modalContainer.querySelector('.modal-content-wrapper');
        if (contentWrapper) {
            contentWrapper.style.cssText = `
                position: relative !important;
                z-index: 2 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                width: 100% !important;
                height: 100% !important;
                pointer-events: none !important;
            `;
        }

        // Modal content styles
        const content = modalContainer.querySelector('.modal-content');
        if (content) {
            const isDark = document.documentElement.classList.contains('dark');
            content.style.cssText = `
                background-color: ${isDark ? '#1f2937' : 'white'} !important;
                color: ${isDark ? '#f3f4f6' : '#111827'} !important;
                border-radius: 0.5rem !important;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3) !important;
                max-height: 90vh !important;
                max-width: 90vw !important;
                width: 100% !important;
                overflow: hidden !important;
                pointer-events: auto !important;
            `;
        }

        // Header styles
        const header = modalContainer.querySelector('.modal-header');
        if (header) {
            const isDark = document.documentElement.classList.contains('dark');
            header.style.cssText = `
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
                padding: 1.5rem !important;
                border-bottom: 1px solid ${isDark ? '#374151' : '#e5e7eb'} !important;
            `;
        }

        // Title styles
        const title = modalContainer.querySelector('.modal-title');
        if (title) {
            title.style.cssText = `
                font-size: 1.125rem !important;
                font-weight: 600 !important;
                margin: 0 !important;
            `;
        }

        // Close button styles
        const closeBtn = modalContainer.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.style.cssText = `
                background: none !important;
                border: none !important;
                font-size: 1.25rem !important;
                cursor: pointer !important;
                padding: 0.5rem !important;
                border-radius: 0.25rem !important;
                color: #6b7280 !important;
            `;

            closeBtn.addEventListener('mouseenter', () => {
                closeBtn.style.color = '#374151 !important';
            });

            closeBtn.addEventListener('mouseleave', () => {
                closeBtn.style.color = '#6b7280 !important';
            });
        }

        // Body styles
        const body = modalContainer.querySelector('.modal-body');
        if (body) {
            body.style.cssText = `
                padding: 1.5rem !important;
                max-height: calc(90vh - 120px) !important;
                overflow-y: auto !important;
            `;
        }
    },

    hideModal() {
        const modalContainer = document.getElementById('modal-container');
        if (modalContainer) {
            modalContainer.remove();
        }

        // Restore body scroll
        document.body.style.overflow = '';

        console.log('Modal removed');
    },

    showCreateUserModal() {
        const content = `
            <form id="create-user-form" style="display: flex; flex-direction: column; gap: 1rem;">
                <div>
                    <label for="create-full-name" style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.25rem; color: #374151;">
                        Nama Lengkap <span style="color: #dc2626;">*</span>
                    </label>
                    <input 
                        type="text" 
                        id="create-full-name"
                        name="full_name"
                        autocomplete="name"
                        required
                        placeholder="Masukkan nama lengkap"
                        style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; 
                               background-color: white; color: #111827; font-size: 0.875rem;"
                    />
                </div>
                
                <div>
                    <label for="create-email" style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.25rem; color: #374151;">
                        Email <span style="color: #dc2626;">*</span>
                    </label>
                    <input 
                        type="email" 
                        id="create-email"
                        name="email"
                        autocomplete="email"
                        required
                        placeholder="user@example.com"
                        style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; 
                               background-color: white; color: #111827; font-size: 0.875rem;"
                    />
                </div>
                
                <div>
                    <label for="create-role" style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.25rem; color: #374151;">
                        Role <span style="color: #dc2626;">*</span>
                    </label>
                    <select 
                        id="create-role"
                        name="role"
                        autocomplete="off"
                        required
                        style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; 
                               background-color: white; color: #111827; font-size: 0.875rem;"
                    >
                        <option value="">Pilih Role</option>
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                
                <div>
                    <label for="create-password" style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.25rem; color: #374151;">
                        Password
                    </label>
                    <input 
                        type="password" 
                        id="create-password"
                        name="password"
                        autocomplete="new-password"
                        placeholder="Biarkan kosong untuk generate otomatis"
                        style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; 
                               background-color: white; color: #111827; font-size: 0.875rem;"
                    />
                </div>
                
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <input 
                        type="checkbox" 
                        id="create-send-credentials"
                        name="send_credentials"
                        checked
                        style="width: 1rem; height: 1rem;"
                    />
                    <label for="create-send-credentials" style="font-size: 0.875rem; color: #374151;">
                        Kirim kredensial melalui email
                    </label>
                </div>
                
                <div style="display: flex; justify-content: flex-end; gap: 0.75rem; padding-top: 1rem;">
                    <button 
                        type="button"
                        class="modal-cancel"
                        style="padding: 0.5rem 1rem; background-color: #6b7280; color: white; border: none; 
                               border-radius: 0.5rem; cursor: pointer; font-size: 0.875rem;"
                    >
                        Batal
                    </button>
                    <button 
                        type="submit"
                        style="padding: 0.5rem 1rem; background-color: #2563eb; color: white; border: none; 
                               border-radius: 0.5rem; cursor: pointer; font-size: 0.875rem;"
                    >
                        Tambah User
                    </button>
                </div>
            </form>
        `;

        return this.showModal('Tambah User Baru', content);
    },

    showEditUserModal(user) {
        const content = `
            <form id="edit-user-form" style="display: flex; flex-direction: column; gap: 1rem;">
                <div>
                    <label for="edit-full-name" style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.25rem; color: #374151;">
                        Nama Lengkap <span style="color: #dc2626;">*</span>
                    </label>
                    <input 
                        type="text" 
                        id="edit-full-name"
                        name="full_name"
                        autocomplete="name"
                        required
                        value="${user.full_name || ''}"
                        style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; 
                               background-color: white; color: #111827; font-size: 0.875rem;"
                    />
                </div>
                
                <div>
                    <label for="edit-email" style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.25rem; color: #374151;">
                        Email <span style="color: #dc2626;">*</span>
                    </label>
                    <input 
                        type="email" 
                        id="edit-email"
                        name="email"
                        autocomplete="email"
                        required
                        value="${user.email || ''}"
                        style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; 
                               background-color: white; color: #111827; font-size: 0.875rem;"
                    />
                </div>
                
                <div>
                    <label for="edit-role" style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.25rem; color: #374151;">
                        Role <span style="color: #dc2626;">*</span>
                    </label>
                    <select 
                        id="edit-role"
                        name="role"
                        autocomplete="off"
                        required
                        style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; 
                               background-color: white; color: #111827; font-size: 0.875rem;"
                    >
                        <option value="student" ${user.role === 'student' ? 'selected' : ''}>Student</option>
                        <option value="teacher" ${user.role === 'teacher' ? 'selected' : ''}>Teacher</option>
                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                    </select>
                </div>
                
                <div>
                    <label for="edit-verified" style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.25rem; color: #374151;">
                        Status Verifikasi
                    </label>
                    <select 
                        id="edit-verified"
                        name="is_verified"
                        autocomplete="off"
                        style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; 
                               background-color: white; color: #111827; font-size: 0.875rem;"
                    >
                        <option value="true" ${user.is_verified ? 'selected' : ''}>Terverifikasi</option>
                        <option value="false" ${!user.is_verified ? 'selected' : ''}>Belum Verifikasi</option>
                    </select>
                </div>
                
                <div>
                    <label for="edit-plan" style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.25rem; color: #374151;">
                        Plan
                    </label>
                    <select 
                        id="edit-plan"
                        name="plan"
                        autocomplete="off"
                        style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; 
                               background-color: white; color: #111827; font-size: 0.875rem;"
                    >
                        <option value="free" ${user.plan === 'free' || !user.plan ? 'selected' : ''}>Free</option>
                        <option value="premium" ${user.plan === 'premium' ? 'selected' : ''}>Premium</option>
                    </select>
                </div>
                
                <div style="display: flex; justify-content: flex-end; gap: 0.75rem; padding-top: 1rem;">
                    <button 
                        type="button"
                        class="modal-cancel"
                        style="padding: 0.5rem 1rem; background-color: #6b7280; color: white; border: none; 
                               border-radius: 0.5rem; cursor: pointer; font-size: 0.875rem;"
                    >
                        Batal
                    </button>
                    <button 
                        type="submit"
                        style="padding: 0.5rem 1rem; background-color: #2563eb; color: white; border: none; 
                               border-radius: 0.5rem; cursor: pointer; font-size: 0.875rem;"
                    >
                        Simpan Perubahan
                    </button>
                </div>
            </form>
        `;

        return this.showModal('Edit User', content);
    },

    showConfirmModal(title, message, confirmText = 'Konfirmasi', cancelText = 'Batal', type = 'danger') {
        const buttonClass = type === 'danger'
            ? 'background-color: #dc2626; color: white;'
            : 'background-color: #2563eb; color: white;';

        const content = `
            <div style="margin-bottom: 1.5rem;">
                <p style="color: #374151; line-height: 1.5;">${message}</p>
            </div>
            
            <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
                <button 
                    type="button"
                    class="modal-cancel"
                    style="padding: 0.5rem 1rem; background-color: #6b7280; color: white; border: none; 
                           border-radius: 0.5rem; cursor: pointer; font-size: 0.875rem;"
                >
                    ${cancelText}
                </button>
                <button 
                    type="button"
                    class="modal-confirm"
                    style="padding: 0.5rem 1rem; ${buttonClass} border: none; 
                           border-radius: 0.5rem; cursor: pointer; font-size: 0.875rem;"
                >
                    ${confirmText}
                </button>
            </div>
        `;

        return this.showModal(title, content);
    },

    renderStatistics(stats) {
        const container = document.getElementById('statistics-container');
        if (!container) return;

        const cards = [
            {
                title: 'Total Users',
                value: stats.totalUsers || 0,
                icon: 'fas fa-users',
                color: 'bg-blue-500'
            },
            {
                title: 'Students',
                value: stats.students || 0,
                icon: 'fas fa-user-graduate',
                color: 'bg-green-500'
            },
            {
                title: 'Teachers',
                value: stats.teachers || 0,
                icon: 'fas fa-chalkboard-teacher',
                color: 'bg-purple-500'
            },
            {
                title: 'Admins',
                value: stats.admins || 0,
                icon: 'fas fa-user-shield',
                color: 'bg-orange-500'
            }
        ];

        container.innerHTML = cards.map(card => `
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">${card.title}</p>
                        <p class="text-2xl font-bold text-gray-900 dark:text-white">${card.value}</p>
                    </div>
                    <div class="${card.color} p-3 rounded-lg">
                        <i class="${card.icon} text-white text-xl"></i>
                    </div>
                </div>
            </div>
        `).join('');
    },

    renderUsersTable(users) {
        const tbody = document.getElementById('users-tbody');
        const emptyState = document.getElementById('empty-state');
        const tableContainer = document.getElementById('table-container');

        if (!tbody) return;

        if (users.length === 0) {
            if (emptyState) emptyState.classList.remove('hidden');
            if (tableContainer) tableContainer.classList.add('hidden');
            return;
        }

        if (emptyState) emptyState.classList.add('hidden');
        if (tableContainer) tableContainer.classList.remove('hidden');

        tbody.innerHTML = users.map(user => `
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                            <div class="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                <i class="fas fa-user text-gray-500 dark:text-gray-400"></i>
                            </div>
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900 dark:text-white">
                                ${user.full_name || 'N/A'}
                            </div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">
                                ${user.email || 'N/A'}
                            </div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${this.getRoleBadgeClass(user.role)}">
                        ${this.getRoleText(user.role)}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.is_verified
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }">
                        ${user.is_verified ? 'Terverifikasi' : 'Belum Verifikasi'}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                    ${user.plan || 'free'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                    ${this.formatDate(user.created_at)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex items-center gap-2">
                        <button 
                            class="edit-user-btn text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                            data-user-id="${user.id}"
                            title="Edit"
                            aria-label="Edit user ${user.full_name}"
                        >
                            <i class="fas fa-edit"></i>
                        </button>
                        <button 
                            class="reset-password-btn text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 p-1"
                            data-user-id="${user.id}"
                            title="Reset Password"
                            aria-label="Reset password for ${user.full_name}"
                        >
                            <i class="fas fa-key"></i>
                        </button>
                        <button 
                            class="delete-user-btn text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                            data-user-id="${user.id}"
                            title="Hapus"
                            aria-label="Delete user ${user.full_name}"
                        >
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    renderPagination(pagination) {
        const container = document.getElementById('pagination-container');
        if (!container) return;

        const { page, totalPages } = pagination;

        if (!totalPages || totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        let paginationHTML = '<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">';

        // Left side - page info
        paginationHTML += `
            <div class="text-sm text-gray-700 dark:text-gray-300">
                Halaman <span class="font-medium">${page}</span> dari <span class="font-medium">${totalPages}</span>
            </div>
        `;

        // Right side - page buttons
        paginationHTML += '<div class="flex gap-2">';

        // Previous button
        paginationHTML += `
            <button 
                class="pagination-btn px-3 py-1 rounded ${page === 1
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
            }"
                data-page="${page - 1}"
                ${page === 1 ? 'disabled' : ''}
                aria-label="Previous page"
            >
                <i class="fas fa-chevron-left"></i>
            </button>
        `;

        // Page numbers
        const maxButtons = 5;
        let startPage = Math.max(1, page - Math.floor(maxButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxButtons - 1);

        if (endPage - startPage + 1 < maxButtons) {
            startPage = Math.max(1, endPage - maxButtons + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button 
                    class="pagination-btn px-3 py-1 rounded ${i === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                }"
                    data-page="${i}"
                    aria-label="Page ${i}"
                    ${i === page ? 'aria-current="page"' : ''}
                >
                    ${i}
                </button>
            `;
        }

        // Next button
        paginationHTML += `
            <button 
                class="pagination-btn px-3 py-1 rounded ${page === totalPages
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
            }"
                data-page="${page + 1}"
                ${page === totalPages ? 'disabled' : ''}
                aria-label="Next page"
            >
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

        paginationHTML += '</div></div>';
        container.innerHTML = paginationHTML;
    },

    // Utility methods
    getRoleBadgeClass(role) {
        switch (role) {
            case 'admin':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
            case 'teacher':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            case 'student':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    },

    getRoleText(role) {
        switch (role) {
            case 'admin':
                return 'Admin';
            case 'teacher':
                return 'Teacher';
            case 'student':
                return 'Student';
            default:
                return role || 'Unknown';
        }
    },

    formatDate(dateString) {
        if (!dateString) return '-';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    },

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed !important;
            top: 5rem !important;
            right: 1rem !important;
            z-index: 2147483648 !important;
            padding: 1rem 1.5rem !important;
            border-radius: 0.5rem !important;
            color: white !important;
            font-weight: 500 !important;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
            transform: translateX(100%) !important;
            transition: transform 0.3s ease !important;
        `;

        const bgColor = type === 'success' ? '#16a34a' :
            type === 'error' ? '#dc2626' :
                type === 'warning' ? '#f59e0b' : '#2563eb';

        toast.style.backgroundColor = bgColor + ' !important';

        const iconClass = type === 'success' ? 'fa-check-circle' :
            type === 'error' ? 'fa-exclamation-circle' :
                type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';

        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <i class="fas ${iconClass}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
};

export default ManageUserView;