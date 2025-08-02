import TeacherRequestsPresenter from './presenter';

const TeacherRequestsPage = {
    async render() {
        return `
      <div class="h-screen w-screen flex flex-col">
        <!-- Navbar Container -->
        <div id="navbar-container" class="shrink-0 z-50"></div>
        
        <!-- Main Content Area -->
        <div class="flex flex-1 overflow-hidden">
          <!-- Sidebar Wrapper -->
          <div id="sidebar-wrapper"></div>
          
          <!-- Main Content -->
          <main class="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
            <!-- Add padding-top to account for fixed navbar height -->
            <div class="pt-16 p-6 md:p-10">
              <div class="max-w-7xl mx-auto">
              <!-- Header -->
              <div class="mb-6">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Teacher Requests</h1>
                    <p class="text-gray-600 dark:text-gray-400 mt-1">Kelola pengajuan menjadi dosen</p>
                  </div>
                  <div class="flex gap-3">
                    <button 
                      id="refresh-btn" 
                      class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <i class="fas fa-sync-alt"></i>
                      <span class="hidden sm:inline">Refresh</span>
                    </button>
                    <button 
                      id="export-btn" 
                      class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <i class="fas fa-download"></i>
                      <span class="hidden sm:inline">Export</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Statistics Cards -->
              <div id="statistics-container" class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <!-- Statistics will be rendered here -->
              </div>

              <!-- Filters -->
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
                <div class="flex flex-col sm:flex-row gap-4">
                  <!-- Status Filter -->
                  <div class="w-full sm:w-48">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Filter Status
                    </label>
                    <select 
                      id="status-filter" 
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">Semua Status</option>
                      <option value="pending">Menunggu Review</option>
                      <option value="approved">Disetujui</option>
                      <option value="rejected">Ditolak</option>
                    </select>
                  </div>

                  <!-- Search -->
                  <div class="flex-1">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Pencarian
                    </label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i class="fas fa-search text-gray-400"></i>
                      </div>
                      <input 
                        type="text" 
                        id="search-input"
                        placeholder="Cari nama, email, NIDN, program studi, atau perguruan tinggi..."
                        class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Requests Table -->
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
                          Pengaju
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          NIDN
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                          Program Studi
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden xl:table-cell">
                          Perguruan Tinggi
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                          Tanggal
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody id="requests-tbody" class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      <!-- Table rows will be rendered here -->
                    </tbody>
                  </table>
                </div>

                <!-- Empty State -->
                <div id="empty-state" class="hidden p-8 text-center">
                  <div class="text-gray-400 mb-2">
                    <i class="fas fa-inbox text-4xl"></i>
                  </div>
                  <p class="text-gray-600 dark:text-gray-400">Tidak ada data pengajuan ditemukan</p>
                </div>
              </div>

              <!-- Modals -->
              <div id="modals-container">
                <!-- Modals will be rendered here -->
              </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    `;
    },

    async afterRender() {
        console.log('🎯 Initializing Teacher Requests Page...');

        // Import and render navbar
        const navbarModule = (await import("../../../component/navbar.js")).default;
        const navbarContainer = document.getElementById("navbar-container");
        navbarContainer.innerHTML = navbarModule().render();
        navbarModule().afterRender();

        // Import and render sidebar
        const Api = (await import("../../../data/api.js")).default;
        const createSidebar = (await import("../../../component/sidebar.js")).default;

        const profile = await Api.getProfile();
        const sidebarWrapper = document.getElementById("sidebar-wrapper");
        sidebarWrapper.innerHTML = "";
        const sidebar = await createSidebar(0); // Admin doesn't need course count
        sidebarWrapper.appendChild(sidebar);

        // Initialize presenter
        this.presenter = new TeacherRequestsPresenter(this);

        // Setup event listeners
        this.setupEventListeners();
    },

    setupEventListeners() {
        // Status filter
        const statusFilter = document.getElementById('status-filter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                if (this.onStatusFilterChange) {
                    this.onStatusFilterChange(e.target.value);
                }
            });
        }

        // Search input
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    if (this.onSearchChange) {
                        this.onSearchChange(e.target.value);
                    }
                }, 300); // Debounce search
            });
        }

        // Refresh button
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                if (this.onRefresh) {
                    this.onRefresh();
                }
            });
        }

        // Export button
        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                if (this.onExport) {
                    this.onExport();
                }
            });
        }
    },

    // Event handlers (will be set by presenter)
    onStatusFilterChange: null,
    onSearchChange: null,
    onApproveRequest: null,
    onRejectRequest: null,
    onViewRequest: null,
    onRefresh: null,
    onExport: null,

    // View methods
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

    showSuccess(message) {
        // Create toast notification
        this.showToast(message, 'success');
    },

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `fixed top-20 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;

        const bgColor = type === 'success' ? 'bg-green-500' :
            type === 'error' ? 'bg-red-500' : 'bg-blue-500';
        toast.className += ` ${bgColor} text-white`;

        toast.innerHTML = `
      <div class="flex items-center gap-3">
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
      </div>
    `;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 100);

        // Auto remove
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    },

    renderStatistics(stats) {
        const container = document.getElementById('statistics-container');
        if (!container) return;

        const cards = [
            {
                title: 'Total Pengajuan',
                value: stats.total,
                icon: 'fas fa-file-alt',
                color: 'bg-blue-500'
            },
            {
                title: 'Menunggu Review',
                value: stats.pending,
                icon: 'fas fa-clock',
                color: 'bg-yellow-500'
            },
            {
                title: 'Disetujui',
                value: stats.approved,
                icon: 'fas fa-check-circle',
                color: 'bg-green-500'
            },
            {
                title: 'Ditolak',
                value: stats.rejected,
                icon: 'fas fa-times-circle',
                color: 'bg-red-500'
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

    renderFilters(filters) {
        const statusFilter = document.getElementById('status-filter');
        const searchInput = document.getElementById('search-input');

        if (statusFilter) statusFilter.value = filters.status;
        if (searchInput) searchInput.value = filters.search;
    },

    renderRequestsTable(requests) {
        const tbody = document.getElementById('requests-tbody');
        const emptyState = document.getElementById('empty-state');
        const tableContainer = document.getElementById('table-container');

        if (!tbody) return;

        if (requests.length === 0) {
            if (emptyState) emptyState.classList.remove('hidden');
            if (tableContainer) tableContainer.classList.add('hidden');
            return;
        }

        if (emptyState) emptyState.classList.add('hidden');
        if (tableContainer) tableContainer.classList.remove('hidden');

        tbody.innerHTML = requests.map(request => `
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
                ${request.full_name || 'N/A'}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                ${request.email || 'N/A'}
              </div>
            </div>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900 dark:text-white">
            ${request.nidn || 'N/A'}
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
          <div class="text-sm text-gray-900 dark:text-white">
            ${request.program_studi || '-'}
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap hidden xl:table-cell">
          <div class="text-sm text-gray-900 dark:text-white">
            ${request.perguruan_tinggi || '-'}
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${this.getStatusBadgeClass(request.status)}">
            ${this.getStatusText(request.status)}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
          <div>Diajukan: ${this.formatDate(request.created_at)}</div>
          ${request.reviewed_at ? `<div>Direview: ${this.formatDate(request.reviewed_at)}</div>` : ''}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div class="flex items-center gap-2">
            <button 
              onclick="teacherRequestsPage.handleViewRequest('${request.id}')"
              class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
              title="Lihat Detail"
            >
              <i class="fas fa-eye"></i>
            </button>
            ${request.status === 'pending' ? `
              <button 
                onclick="teacherRequestsPage.handleApproveRequest('${request.id}')"
                class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                title="Setujui"
              >
                <i class="fas fa-check"></i>
              </button>
              <button 
                onclick="teacherRequestsPage.handleRejectRequest('${request.id}')"
                class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                title="Tolak"
              >
                <i class="fas fa-times"></i>
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `).join('');

        // Expose methods to global scope for onclick handlers
        window.teacherRequestsPage = {
            handleViewRequest: (id) => this.handleViewRequest(id),
            handleApproveRequest: (id) => this.handleApproveRequest(id),
            handleRejectRequest: (id) => this.handleRejectRequest(id)
        };
    },

    handleViewRequest(requestId) {
        if (this.onViewRequest) {
            this.onViewRequest(requestId);
        }
    },

    handleApproveRequest(requestId) {
        if (this.onApproveRequest) {
            this.onApproveRequest(requestId);
        }
    },

    handleRejectRequest(requestId) {
        if (this.onRejectRequest) {
            this.onRejectRequest(requestId);
        }
    },

    getStatusBadgeClass(status) {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'approved':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'rejected':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    },

    getStatusText(status) {
        switch (status) {
            case 'pending':
                return 'Menunggu Review';
            case 'approved':
                return 'Disetujui';
            case 'rejected':
                return 'Ditolak';
            default:
                return status;
        }
    },

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
    },

    async showConfirmDialog(title, message, confirmText = 'Ya', cancelText = 'Batal') {
        return new Promise((resolve) => {
            const modal = this.createModal(`
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
          <div class="flex items-center mb-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <i class="fas fa-question-circle text-blue-600 dark:text-blue-400"></i>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">${title}</h3>
            </div>
          </div>
          <p class="text-gray-600 dark:text-gray-400 mb-6">${message}</p>
          <div class="flex justify-end gap-3">
            <button 
              id="cancel-btn" 
              class="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              ${cancelText}
            </button>
            <button 
              id="confirm-btn" 
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              ${confirmText}
            </button>
          </div>
        </div>
      `);

            const confirmBtn = modal.querySelector('#confirm-btn');
            const cancelBtn = modal.querySelector('#cancel-btn');

            confirmBtn.addEventListener('click', () => {
                this.closeModal(modal);
                resolve(true);
            });

            cancelBtn.addEventListener('click', () => {
                this.closeModal(modal);
                resolve(false);
            });
        });
    },

    async showRejectDialog(applicantName) {
        return new Promise((resolve) => {
            const modal = this.createModal(`
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
          <div class="flex items-center mb-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <i class="fas fa-times-circle text-red-600 dark:text-red-400"></i>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Tolak Pengajuan</h3>
            </div>
          </div>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Berikan alasan penolakan untuk pengajuan dari <strong>${applicantName}</strong>:
          </p>
          <textarea 
            id="reject-reason" 
            rows="4" 
            placeholder="Masukkan alasan penolakan..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
          ></textarea>
          <div class="flex justify-end gap-3 mt-6">
            <button 
              id="cancel-btn" 
              class="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Batal
            </button>
            <button 
              id="reject-btn" 
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              Tolak
            </button>
          </div>
        </div>
      `);

            const rejectBtn = modal.querySelector('#reject-btn');
            const cancelBtn = modal.querySelector('#cancel-btn');
            const reasonTextarea = modal.querySelector('#reject-reason');

            rejectBtn.addEventListener('click', () => {
                const reason = reasonTextarea.value.trim();
                if (!reason) {
                    reasonTextarea.focus();
                    reasonTextarea.classList.add('border-red-500');
                    return;
                }
                this.closeModal(modal);
                resolve(reason);
            });

            cancelBtn.addEventListener('click', () => {
                this.closeModal(modal);
                resolve(null);
            });

            // Auto focus
            setTimeout(() => reasonTextarea.focus(), 100);
        });
    },

    showRequestDetails(request) {
        const credentialFileSection = request.credential_file ? `
      <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">File Kredensial</h4>
        <a 
          href="${request.credential_file}" 
          target="_blank"
          class="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          <i class="fas fa-file-download"></i>
          <span>Unduh File</span>
        </a>
      </div>
    ` : '';

        const rejectReasonSection = request.status === 'rejected' && request.reject_reason ? `
      <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Alasan Penolakan</h4>
        <p class="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
          ${request.reject_reason}
        </p>
      </div>
    ` : '';

        const modal = this.createModal(`
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Detail Pengajuan</h3>
          <button 
            id="close-btn" 
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <div class="space-y-4">
          <!-- Status Badge -->
          <div class="flex items-center gap-3 mb-4">
            <span class="inline-flex px-3 py-1 text-sm font-semibold rounded-full ${this.getStatusBadgeClass(request.status)}">
              ${this.getStatusText(request.status)}
            </span>
            <span class="text-sm text-gray-500 dark:text-gray-400">
              Diajukan: ${this.formatDate(request.created_at)}
            </span>
          </div>

          <!-- Personal Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Lengkap</label>
              <p class="text-sm text-gray-900 dark:text-white mt-1">${request.full_name || 'N/A'}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <p class="text-sm text-gray-900 dark:text-white mt-1">${request.email || 'N/A'}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">NIDN</label>
              <p class="text-sm text-gray-900 dark:text-white mt-1">${request.nidn || 'N/A'}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Program Studi</label>
              <p class="text-sm text-gray-900 dark:text-white mt-1">${request.program_studi || '-'}</p>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Perguruan Tinggi</label>
              <p class="text-sm text-gray-900 dark:text-white mt-1">${request.perguruan_tinggi || '-'}</p>
            </div>
          </div>

          ${credentialFileSection}
          ${rejectReasonSection}

          <!-- Review Info -->
          ${request.reviewed_at ? `
            <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Informasi Review</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Direview pada: ${this.formatDate(request.reviewed_at)}
              </p>
            </div>
          ` : ''}

          <!-- Actions -->
          ${request.status === 'pending' ? `
            <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div class="flex justify-end gap-3">
                <button 
                  id="approve-btn" 
                  class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
                >
                  <i class="fas fa-check"></i>
                  <span>Setujui</span>
                </button>
                <button 
                  id="reject-btn" 
                  class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2"
                >
                  <i class="fas fa-times"></i>
                  <span>Tolak</span>
                </button>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `);

        // Event listeners
        const closeBtn = modal.querySelector('#close-btn');
        closeBtn.addEventListener('click', () => this.closeModal(modal));

        const approveBtn = modal.querySelector('#approve-btn');
        if (approveBtn) {
            approveBtn.addEventListener('click', () => {
                this.closeModal(modal);
                this.handleApproveRequest(request.id);
            });
        }

        const rejectBtn = modal.querySelector('#reject-btn');
        if (rejectBtn) {
            rejectBtn.addEventListener('click', () => {
                this.closeModal(modal);
                this.handleRejectRequest(request.id);
            });
        }
    },

    createModal(content) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50 overflow-y-auto';
        modal.innerHTML = `
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" id="modal-backdrop"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom sm:align-middle transition-all transform" id="modal-content">
          ${content}
        </div>
      </div>
    `;

        document.body.appendChild(modal);

        // Close on backdrop click
        const backdrop = modal.querySelector('#modal-backdrop');
        backdrop.addEventListener('click', () => this.closeModal(modal));

        // Animate in
        setTimeout(() => {
            modal.classList.add('opacity-100');
        }, 10);

        return modal;
    },

    closeModal(modal) {
        modal.classList.add('opacity-0');
        setTimeout(() => {
            if (modal.parentNode) {
                document.body.removeChild(modal);
            }
        }, 200);
    },

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    cleanup() {
        // Remove global methods
        if (window.teacherRequestsPage) {
            delete window.teacherRequestsPage;
        }

        // Clean up presenter
        if (this.presenter) {
            this.presenter.destroy();
        }
    }
};

export default TeacherRequestsPage;