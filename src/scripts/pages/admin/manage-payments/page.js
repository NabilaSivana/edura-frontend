// src/scripts/pages/admin/manage-payments/page.js
import ManagePaymentsPresenter from "./presenter.js";

const ManagePaymentsPage = {
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
          <main class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
            <!-- Add padding-top to account for fixed navbar height -->
            <div class="pt-16 p-6 md:p-16">
              <div class="max-w-7xl mx-auto">
                <!-- Header -->
                <div class="mb-6">
                  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Manajemen Pembayaran</h1>
                      <p class="text-gray-600 dark:text-gray-400 mt-1">Kelola dan monitoring semua transaksi pembayaran</p>
                    </div>
                    <div class="flex gap-3">
                      <button 
                        id="export-btn" 
                        class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                      >
                        <i class="fas fa-file-export"></i>
                        <span class="hidden sm:inline">Export</span>
                      </button>
                      <button 
                        id="refresh-btn" 
                        class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
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
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
                  <div class="flex flex-col lg:flex-row gap-4">
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
                          id="payment-search"
                          placeholder="Cari nama, email, atau order ID..."
                          class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <!-- Status Filter -->
                    <div class="w-full lg:w-48">
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Status
                      </label>
                      <select 
                        id="status-filter" 
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Semua Status</option>
                        <option value="settlement">Settlement</option>
                        <option value="pending">Pending</option>
                        <option value="expire">Expire</option>
                        <option value="cancel">Cancel</option>
                        <option value="failure">Failure</option>
                      </select>
                    </div>

                    <!-- Date Range -->
                    <div class="w-full lg:w-48">
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tanggal
                      </label>
                      <input 
                        type="date" 
                        id="date-filter"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <!-- Payments Table -->
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
                            Pengguna
                          </th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Order ID
                          </th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Produk
                          </th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Jumlah
                          </th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Tanggal
                          </th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody id="payments-tbody" class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        <!-- Table rows will be rendered here -->
                      </tbody>
                    </table>
                  </div>

                  <!-- Empty State -->
                  <div id="empty-state" class="hidden p-8 text-center">
                    <div class="text-gray-400 mb-4">
                      <i class="fas fa-credit-card text-6xl"></i>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Belum Ada Pembayaran</h3>
                    <p class="text-gray-600 dark:text-gray-400">Tidak ada data pembayaran yang ditemukan</p>
                  </div>
                </div>

                <!-- Pagination -->
                <div id="pagination-container" class="mt-6">
                  <!-- Pagination will be rendered here -->
                </div>

                <!-- Modals Container -->
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
    //console.log('🎯 Initializing Manage Payments Page...');

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
    ManagePaymentsPresenter.init(this);

    // Setup event listeners
    this.setupEventListeners();
  },

  setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('payment-search');
    if (searchInput) {
      let searchTimeout;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          if (this.onSearchChange) {
            this.onSearchChange(e.target.value);
          }
        }, 500); // Debounce search
      });
    }

    // Status filter
    const statusFilter = document.getElementById('status-filter');
    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        if (this.onFilterChange) {
          this.onFilterChange('status', e.target.value);
        }
      });
    }

    // Date filter
    const dateFilter = document.getElementById('date-filter');
    if (dateFilter) {
      dateFilter.addEventListener('change', (e) => {
        if (this.onFilterChange) {
          this.onFilterChange('date', e.target.value);
        }
      });
    }

    // Export button
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        if (this.onExportPayments) {
          this.onExportPayments();
        }
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
  },

  // Setup action button listeners after table is rendered
  setupTableActionListeners() {
    // View payment buttons
    const viewButtons = document.querySelectorAll('.view-payment-btn');
    viewButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const paymentId = button.getAttribute('data-payment-id');
        if (this.onViewPayment && paymentId) {
          this.onViewPayment(paymentId);
        }
      });
    });

    // Delete payment buttons
    const deleteButtons = document.querySelectorAll('.delete-payment-btn');
    deleteButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const paymentId = button.getAttribute('data-payment-id');
        if (this.onDeletePayment && paymentId) {
          this.onDeletePayment(paymentId);
        }
      });
    });
  },

  // Setup pagination listeners after pagination is rendered
  setupPaginationListeners() {
    const paginationButtons = document.querySelectorAll('.pagination-btn');
    paginationButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const page = parseInt(button.getAttribute('data-page'));
        if (this.onPageChange && page > 0) {
          this.onPageChange(page);
        }
      });
    });
  },

  // State management
  filters: {
    page: 1,
    limit: 10,
    search: '',
    status: '',
    date: ''
  },

  getFilters() {
    return this.filters;
  },

  updateFilters(updates) {
    this.filters = { ...this.filters, ...updates };
  },

  resetFilters() {
    this.filters = {
      page: 1,
      limit: 10,
      search: '',
      status: '',
      date: ''
    };
    this.updateFilterUI();
  },

  updateFilterUI() {
    const searchInput = document.getElementById('payment-search');
    const statusFilter = document.getElementById('status-filter');
    const dateFilter = document.getElementById('date-filter');

    if (searchInput) searchInput.value = this.filters.search;
    if (statusFilter) statusFilter.value = this.filters.status;
    if (dateFilter) dateFilter.value = this.filters.date;
  },

  // Event handlers (will be set by presenter)
  onSearchChange: null,
  onFilterChange: null,
  onPageChange: null,
  onViewPayment: null,
  onDeletePayment: null,
  onExportPayments: null,
  onRefresh: null,
  onConfirmDelete: null,

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
    const emptyState = document.getElementById('empty-state');

    if (errorMessage) errorMessage.textContent = message;
    if (errorContainer) errorContainer.classList.remove('hidden');
    if (loadingContainer) loadingContainer.classList.add('hidden');
    if (tableContainer) tableContainer.classList.add('hidden');
    if (emptyState) emptyState.classList.add('hidden');
  },

  showSuccess(message) {
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
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
  },

  // Render methods
  renderStatistics(stats) {
    const container = document.getElementById('statistics-container');
    if (!container) return;

    const statisticsCards = [
      {
        title: 'Total Transaksi',
        value: stats.totalTransactions || 0,
        icon: 'fas fa-credit-card',
        color: 'blue'
      },
      {
        title: 'Total Pendapatan',
        value: `Rp${(stats.totalRevenue || 0).toLocaleString()}`,
        icon: 'fas fa-money-bill-wave',
        color: 'green'
      },
      {
        title: 'Berhasil',
        value: stats.successfulPayments || 0,
        icon: 'fas fa-check-circle',
        color: 'emerald'
      },
      {
        title: 'Pending',
        value: stats.pendingPayments || 0,
        icon: 'fas fa-clock',
        color: 'yellow'
      }
    ];

    container.innerHTML = statisticsCards.map(stat => `
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">${stat.title}</p>
            <p class="text-xl font-bold text-gray-900 dark:text-white">${stat.value}</p>
          </div>
          <div class="p-3 bg-${stat.color}-100 dark:bg-${stat.color}-900 rounded-lg">
            <i class="${stat.icon} text-${stat.color}-600 dark:text-${stat.color}-400 text-xl"></i>
          </div>
        </div>
      </div>
    `).join('');
  },

  renderPayments(payments) {
    const tbody = document.getElementById('payments-tbody');
    const emptyState = document.getElementById('empty-state');
    const tableContainer = document.getElementById('table-container');

    if (!tbody) return;

    if (!payments || payments.length === 0) {
      if (emptyState) emptyState.classList.remove('hidden');
      if (tableContainer) tableContainer.classList.add('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    if (tableContainer) tableContainer.classList.remove('hidden');

    tbody.innerHTML = payments.map(payment => `
      <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mr-3">
              <i class="fas fa-user text-gray-500 dark:text-gray-400"></i>
            </div>
            <div>
              <div class="text-sm font-medium text-gray-900 dark:text-white">${payment.full_name}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">${payment.email}</div>
            </div>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm font-mono text-gray-900 dark:text-white">${payment.order_id || '-'}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900 dark:text-white">${payment.product || '-'}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm font-semibold text-gray-900 dark:text-white">
            Rp${(payment.amount || 0).toLocaleString()}
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-2 py-1 text-xs font-medium rounded-full ${this.getStatusBadgeClass(payment.status)}">
            ${this.formatStatus(payment.status)}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900 dark:text-white">${this.formatDate(payment.created_at)}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div class="flex items-center gap-2">
            <button 
              class="view-payment-btn text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/50"
              data-payment-id="${payment.id}"
              title="Lihat Detail"
            >
              <i class="fas fa-eye"></i>
            </button>
            <button 
              class="delete-payment-btn text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/50"
              data-payment-id="${payment.id}"
              title="Hapus"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    // Setup action button listeners after rendering
    this.setupTableActionListeners();
  },

  renderPagination(pagination) {
    const container = document.getElementById('pagination-container');
    if (!container || !pagination) return;

    const { currentPage, totalPages, totalItems, itemsPerPage } = pagination;

    if (totalPages <= 1) {
      container.innerHTML = '';
      return;
    }

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    let paginationHTML = `
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="text-sm text-gray-700 dark:text-gray-300">
          Menampilkan ${startItem} sampai ${endItem} dari ${totalItems} pembayaran
        </div>
        <div class="flex items-center gap-1">
    `;

    // Previous button
    paginationHTML += `
      <button 
        class="pagination-btn px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        data-page="${currentPage - 1}"
        ${currentPage === 1 ? 'disabled' : ''}
      >
        <i class="fas fa-chevron-left"></i>
      </button>
    `;

    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationHTML += `
        <button 
          class="pagination-btn px-3 py-2 text-sm font-medium ${i === currentPage
          ? 'text-blue-600 bg-blue-50 border border-blue-300 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-400'
          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700'
        }"
          data-page="${i}"
        >
          ${i}
        </button>
      `;
    }

    // Next button
    paginationHTML += `
      <button 
        class="pagination-btn px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        data-page="${currentPage + 1}"
        ${currentPage === totalPages ? 'disabled' : ''}
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    `;

    paginationHTML += `
        </div>
      </div>
    `;

    container.innerHTML = paginationHTML;

    // Setup pagination listeners after rendering
    this.setupPaginationListeners();
  },

  // Utility methods
  getStatusBadgeClass(status) {
    const classes = {
      settlement: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      expire: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      cancel: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      failure: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  },

  formatStatus(status) {
    const statuses = {
      settlement: 'Berhasil',
      pending: 'Pending',
      expire: 'Kadaluarsa',
      cancel: 'Dibatalkan',
      failure: 'Gagal'
    };
    return statuses[status] || status;
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
      return '-';
    }
  },

  // Modal methods
  showPaymentDetailModal(payment) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Detail Pembayaran</h3>
            <button 
              class="close-modal-btn text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>

          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Lengkap</label>
                <p class="text-sm text-gray-900 dark:text-white">${payment.full_name || '-'}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <p class="text-sm text-gray-900 dark:text-white">${payment.email || '-'}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Order ID</label>
                <p class="text-sm font-mono text-gray-900 dark:text-white">${payment.order_id || '-'}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <span class="px-2 py-1 text-xs font-medium rounded-full ${this.getStatusBadgeClass(payment.status)}">
                  ${this.formatStatus(payment.status)}
                </span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Produk</label>
                <p class="text-sm text-gray-900 dark:text-white">${payment.product || '-'}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Jumlah</label>
                <p class="text-sm font-semibold text-gray-900 dark:text-white">
                  Rp${(payment.amount || 0).toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Transaksi</label>
              <p class="text-sm text-gray-900 dark:text-white">${this.formatDate(payment.created_at)}</p>
            </div>

            ${payment.transaction_id ? `
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Transaction ID</label>
              <p class="text-sm font-mono text-gray-900 dark:text-white">${payment.transaction_id}</p>
            </div>
            ` : ''}

            ${payment.payment_type ? `
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Metode Pembayaran</label>
              <p class="text-sm text-gray-900 dark:text-white">${payment.payment_type}</p>
            </div>
            ` : ''}

            ${payment.va_number ? `
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">VA Number</label>
              <p class="text-sm font-mono text-gray-900 dark:text-white">${payment.va_number}</p>
            </div>
            ` : ''}

            ${payment.notes ? `
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Catatan</label>
              <p class="text-sm text-gray-900 dark:text-white">${payment.notes}</p>
            </div>
            ` : ''}
          </div>

          <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button 
              class="close-modal-btn px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Add event listeners to close buttons
    const closeButtons = modal.querySelectorAll('.close-modal-btn');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (modal.parentNode) {
          modal.parentNode.removeChild(modal);
        }
      });
    });

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        if (modal.parentNode) {
          modal.parentNode.removeChild(modal);
        }
      }
    });
  },

  showDeleteConfirmation(paymentId, paymentInfo) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mr-3">
              <i class="fas fa-exclamation-triangle text-red-600 dark:text-red-400"></i>
            </div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Konfirmasi Hapus</h3>
          </div>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Apakah Anda yakin ingin menghapus log pembayaran dari "<strong>${paymentInfo}</strong>"? 
            Tindakan ini tidak dapat dibatalkan.
          </p>
          <div class="flex gap-3 justify-end">
            <button 
              class="cancel-btn px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button 
              class="confirm-delete-btn px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              data-payment-id="${paymentId}"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Add event listeners
    const cancelBtn = modal.querySelector('.cancel-btn');
    cancelBtn.addEventListener('click', () => {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
    });

    const confirmBtn = modal.querySelector('.confirm-delete-btn');
    confirmBtn.addEventListener('click', () => {
      const paymentId = confirmBtn.getAttribute('data-payment-id');
      if (this.onConfirmDelete && paymentId) {
        this.onConfirmDelete(paymentId);
      }
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
    });

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        if (modal.parentNode) {
          modal.parentNode.removeChild(modal);
        }
      }
    });
  },

  confirmDelete(paymentId) {
    if (this.onConfirmDelete) {
      this.onConfirmDelete(paymentId);
    }
  },

  // Export functionality
  exportToCSV(payments) {
    const headers = ['Order ID', 'Nama', 'Email', 'Produk', 'Jumlah', 'Status', 'Tanggal'];
    const csvContent = [
      headers.join(','),
      ...payments.map(payment => [
        payment.order_id || '',
        `"${payment.full_name || ''}"`,
        `"${payment.email || ''}"`,
        `"${payment.product || ''}"`,
        payment.amount || 0,
        payment.status || '',
        payment.created_at || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `payments_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // Refresh button animation
  startRefreshAnimation() {
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
      const icon = refreshBtn.querySelector('i');
      if (icon) {
        icon.classList.add('animate-spin');
      }
    }
  },

  stopRefreshAnimation() {
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
      const icon = refreshBtn.querySelector('i');
      if (icon) {
        icon.classList.remove('animate-spin');
      }
    }
  },

  // Cleanup method
  cleanup() {
    // Remove any event listeners or cleanup resources
    this.onSearchChange = null;
    this.onFilterChange = null;
    this.onPageChange = null;
    this.onViewPayment = null;
    this.onDeletePayment = null;
    this.onExportPayments = null;
    this.onRefresh = null;
    this.onConfirmDelete = null;

    // Remove any existing modals
    const modals = document.querySelectorAll('.fixed.inset-0');
    modals.forEach(modal => modal.remove());
  }
};

export default ManagePaymentsPage;