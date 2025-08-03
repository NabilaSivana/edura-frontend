// page.js - Fixed version with separated edit and transfer functions
import AdminManageClassPresenter from './presenter';

const AdminManageClassPage = {
  // Instance properties
  presenter: null,
  _initialized: false,
  _eventListenersSetup: false,
  _isCleaningUp: false,

  async render() {
    // Clean up any existing state when rendering
    this.cleanup();

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
                      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Manage Classes</h1>
                      <p class="text-gray-600 dark:text-gray-400 mt-1">Kelola semua kelas dalam sistem</p>
                    </div>
                    <div class="flex gap-3">
                      <button 
                        id="create-class-btn" 
                        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                      >
                        <i class="fas fa-plus"></i>
                        <span class="hidden sm:inline">Buat Kelas</span>
                      </button>
                      <button 
                        id="refresh-btn" 
                        class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
                      >
                        <i class="fas fa-sync-alt"></i>
                        <span class="hidden sm:inline">Refresh</span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Statistics Cards -->
                <div id="statistics-container" class="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                  <!-- Statistics will be rendered here -->
                </div>

                <!-- Filters and Search -->
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
                          id="search-input"
                          placeholder="Cari nama kelas, teacher, program studi..."
                          class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <!-- Teacher Filter -->
                    <div class="w-full lg:w-64">
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Filter Teacher
                      </label>
                      <select 
                        id="teacher-filter" 
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">Semua Teacher</option>
                        <!-- Teacher options will be populated here -->
                      </select>
                    </div>

                    <!-- Sort Options -->
                    <div class="flex gap-2">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Urutkan
                        </label>
                        <select 
                          id="sort-select" 
                          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="name">Nama Kelas</option>
                          <option value="teacher_name">Nama Teacher</option>
                          <option value="created_at">Tanggal Dibuat</option>
                          <option value="student_count">Jumlah Siswa</option>
                        </select>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Arah
                        </label>
                        <select 
                          id="order-select" 
                          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="asc">A-Z</option>
                          <option value="desc">Z-A</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Classes Table -->
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
                            Kelas
                          </th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Teacher
                          </th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                            Program Studi
                          </th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Siswa
                          </th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                            Tanggal
                          </th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody id="classes-tbody" class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        <!-- Table rows will be rendered here -->
                      </tbody>
                    </table>
                  </div>

                  <!-- Empty State -->
                  <div id="empty-state" class="hidden p-8 text-center">
                    <div class="text-gray-400 mb-4">
                      <i class="fas fa-school text-6xl"></i>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Belum Ada Kelas</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-4">Mulai dengan membuat kelas pertama</p>
                    <button 
                      class="create-first-class-btn px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Buat Kelas Pertama
                    </button>
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
    //console.log('🎯 Initializing Admin Manage Class Page...');

    // Reset initialization flag to allow re-initialization
    this._initialized = false;
    this._eventListenersSetup = false;

    try {
      // Initialize presenter
      this.presenter = new AdminManageClassPresenter(this);

      // Import and render navbar
      const navbarModule = (await import("../../../component/navbar.js")).default;
      const navbarContainer = document.getElementById("navbar-container");
      if (navbarContainer) {
        navbarContainer.innerHTML = navbarModule().render();
        navbarModule().afterRender();
      }

      // Import and render sidebar
      const Api = (await import("../../../data/api.js")).default;
      const createSidebar = (await import("../../../component/sidebar.js")).default;

      const profile = await Api.getProfile();
      const sidebarWrapper = document.getElementById("sidebar-wrapper");
      if (sidebarWrapper) {
        sidebarWrapper.innerHTML = "";
        const sidebar = await createSidebar(0);
        sidebarWrapper.appendChild(sidebar);
      }

      // Setup event listeners
      this.setupEventListeners();

      // Mark as initialized
      this._initialized = true;

    } catch (error) {
      console.error('❌ Error initializing page:', error);
      this.showError('Gagal menginisialisasi halaman: ' + error.message);
    }
  },

  setupEventListeners() {
    // Prevent duplicate event listeners
    if (this._eventListenersSetup) {
      //console.log('Event listeners already setup, skipping...');
      return;
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
        }, 500); // Debounce search
      });
    }

    // Teacher filter
    const teacherFilter = document.getElementById('teacher-filter');
    if (teacherFilter) {
      teacherFilter.addEventListener('change', (e) => {
        if (this.onTeacherFilterChange) {
          this.onTeacherFilterChange(e.target.value);
        }
      });
    }

    // Sort options
    const sortSelect = document.getElementById('sort-select');
    const orderSelect = document.getElementById('order-select');

    if (sortSelect && orderSelect) {
      const handleSortChange = () => {
        if (this.onSortChange) {
          this.onSortChange(sortSelect.value, orderSelect.value);
        }
      };

      sortSelect.addEventListener('change', handleSortChange);
      orderSelect.addEventListener('change', handleSortChange);
    }

    // Create class button
    const createBtn = document.getElementById('create-class-btn');
    if (createBtn) {
      createBtn.addEventListener('click', () => {
        if (this.onShowCreateForm) {
          this.onShowCreateForm();
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

    // Empty state create button - use event delegation
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('create-first-class-btn')) {
        if (this.onShowCreateForm) {
          this.onShowCreateForm();
        }
      }
    });

    this._eventListenersSetup = true;
  },

  // Event handlers (will be set by presenter)
  onSearchChange: null,
  onTeacherFilterChange: null,
  onSortChange: null,
  onCreateClass: null,
  onEditClass: null,
  onDeleteClass: null,
  onViewClass: null,
  onTransferClass: null,
  onViewStudents: null,
  onRemoveStudent: null,
  onRefresh: null,
  onShowCreateForm: null,
  onShowEditForm: null,
  onShowTransferForm: null,
  onPageChange: null,

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
    this.showToast(message, 'success');
  },

  showValidationErrors(errors) {
    const errorMessage = errors.join(', ');
    this.showToast(errorMessage, 'error');
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

  renderStatistics(stats) {
    const container = document.getElementById('statistics-container');
    if (!container) return;

    const cards = [
      {
        title: 'Total Kelas',
        value: stats.totalClasses,
        icon: 'fas fa-school',
        color: 'bg-blue-500'
      },
      {
        title: 'Total Siswa',
        value: stats.totalStudents,
        icon: 'fas fa-users',
        color: 'bg-green-500'
      },
      {
        title: 'Rata-rata Siswa',
        value: stats.averageStudentsPerClass,
        icon: 'fas fa-chart-bar',
        color: 'bg-purple-500'
      },
      {
        title: 'Kelas Aktif',
        value: stats.activeClasses,
        icon: 'fas fa-check-circle',
        color: 'bg-orange-500'
      },
      {
        title: 'Teacher Aktif',
        value: stats.uniqueTeachers,
        icon: 'fas fa-chalkboard-teacher',
        color: 'bg-indigo-500'
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

  renderFilters(filters, teachers) {
    const searchInput = document.getElementById('search-input');
    const teacherFilter = document.getElementById('teacher-filter');
    const sortSelect = document.getElementById('sort-select');
    const orderSelect = document.getElementById('order-select');

    if (searchInput) searchInput.value = filters.search;
    if (sortSelect) sortSelect.value = filters.sortBy;
    if (orderSelect) orderSelect.value = filters.sortOrder;

    // Populate teacher filter
    if (teacherFilter && teachers) {
      teacherFilter.innerHTML = '<option value="all">Semua Teacher</option>';
      teachers.forEach(teacher => {
        const option = document.createElement('option');
        option.value = teacher.id;
        option.textContent = teacher.full_name || teacher.email;
        option.selected = filters.teacherFilter === teacher.id;
        teacherFilter.appendChild(option);
      });
    }
  },

  renderClassesTable(classes) {
    const tbody = document.getElementById('classes-tbody');
    const emptyState = document.getElementById('empty-state');
    const tableContainer = document.getElementById('table-container');

    if (!tbody) return;

    if (classes.length === 0) {
      if (emptyState) emptyState.classList.remove('hidden');
      if (tableContainer) tableContainer.classList.add('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    if (tableContainer) tableContainer.classList.remove('hidden');

    tbody.innerHTML = classes.map(cls => `
      <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        <td class="px-6 py-4 whitespace-nowrap">
          <div>
            <div class="text-sm font-medium text-gray-900 dark:text-white">
              ${cls.name}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              ${cls.class_code || '-'}
            </div>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div>
            <div class="text-sm font-medium text-gray-900 dark:text-white">
              ${cls.teacher_name || '-'}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              ${cls.teacher_email || '-'}
            </div>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
          <div>
            <div class="text-sm text-gray-900 dark:text-white">
              ${cls.program_studi || '-'}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              ${cls.perguruan_tinggi || '-'}
            </div>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls.student_count > 0 ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
      }">
            ${cls.student_count || 0} siswa
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
          ${this.formatDate(cls.created_at)}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div class="flex items-center gap-2">
            <button 
              class="class-action-btn text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/50"
              data-action="view-students" data-class-id="${cls.id}"
              title="Lihat Siswa"
            >
              <i class="fas fa-users"></i>
            </button>
            <button 
              class="class-action-btn text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 p-1 rounded hover:bg-yellow-50 dark:hover:bg-yellow-900/50"
              data-action="edit" data-class-id="${cls.id}"
              title="Edit Detail Kelas"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button 
              class="class-action-btn text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 p-1 rounded hover:bg-purple-50 dark:hover:bg-purple-900/50"
              data-action="transfer" data-class-id="${cls.id}"
              title="Transfer ke Teacher Lain"
            >
              <i class="fas fa-exchange-alt"></i>
            </button>
            <button 
              class="class-action-btn text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/50"
              data-action="delete" data-class-id="${cls.id}"
              title="Hapus"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    // Setup action button listeners
    this.setupActionButtonListeners();
  },

  setupActionButtonListeners() {
    const actionButtons = document.querySelectorAll('.class-action-btn');
    actionButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const action = button.getAttribute('data-action');
        const classId = button.getAttribute('data-class-id');

        switch (action) {
          case 'view-students':
            if (this.onViewStudents) this.onViewStudents(classId);
            break;
          case 'edit':
            if (this.onShowEditForm) this.onShowEditForm(classId);
            break;
          case 'transfer':
            if (this.onShowTransferForm) this.onShowTransferForm(classId);
            break;
          case 'delete':
            if (this.onDeleteClass) this.onDeleteClass(classId);
            break;
        }
      });
    });
  },

  renderPagination(pagination) {
    const container = document.getElementById('pagination-container');
    if (!container) return;

    const { page, totalPages } = pagination;

    if (totalPages <= 1) {
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
        data-page="${page - 1}" ${page === 1 ? 'disabled' : ''}
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
        data-page="${page + 1}" ${page === totalPages ? 'disabled' : ''}
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    `;

    paginationHTML += '</div></div>';
    container.innerHTML = paginationHTML;

    // Setup pagination listeners
    this.setupPaginationListeners();
  },

  setupPaginationListeners() {
    const paginationButtons = document.querySelectorAll('.pagination-btn');
    paginationButtons.forEach(button => {
      if (!button.disabled) {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          const page = parseInt(button.getAttribute('data-page'));
          if (this.onPageChange && page > 0) {
            this.onPageChange(page);
          }
        });
      }
    });
  },

  // Modal methods
  showCreateForm(teachers) {
    const modal = this.createModal(`
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Buat Kelas Baru</h3>
          <button 
            id="close-btn" 
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <form id="create-class-form">
          <div class="space-y-4">
            <div>
              <label for="create-class-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nama Kelas <span class="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                id="create-class-name"
                name="name"
                required
                placeholder="Contoh: Kelas A - Pemrograman Web"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label for="create-class-teacher" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Teacher <span class="text-red-500">*</span>
              </label>
              <select 
                id="create-class-teacher"
                name="teacher_id"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Pilih Teacher</option>
                ${teachers.map(t => `
                  <option value="${t.id}">${t.full_name} (${t.email})</option>
                `).join('')}
              </select>
            </div>
            
            <div>
              <label for="create-class-program" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Program Studi
              </label>
              <input 
                type="text" 
                id="create-class-program"
                name="program_studi"
                placeholder="Contoh: Teknik Informatika"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label for="create-class-institution" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Perguruan Tinggi
              </label>
              <input 
                type="text" 
                id="create-class-institution"
                name="perguruan_tinggi"
                placeholder="Contoh: Universitas Indonesia"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div class="mt-6 flex justify-end gap-3">
            <button 
              type="button"
              id="cancel-btn"
              class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Buat Kelas
            </button>
          </div>
        </form>
      </div>
    `);

    // Event listeners
    const closeBtn = modal.querySelector('#close-btn');
    const cancelBtn = modal.querySelector('#cancel-btn');
    const form = modal.querySelector('#create-class-form');

    closeBtn.addEventListener('click', () => this.closeModal(modal));
    cancelBtn.addEventListener('click', () => this.closeModal(modal));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);
      this.closeModal(modal);
      if (this.onCreateClass) {
        this.onCreateClass(data);
      }
    });
  },

  // FIXED: Edit form - NO TEACHER DROPDOWN
  showEditForm(classData) {
    const modal = this.createModal(`
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Edit Detail Kelas</h3>
          <button 
            id="close-btn" 
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <div class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
          <p class="text-sm text-blue-800 dark:text-blue-200">
            <i class="fas fa-info-circle mr-2"></i>
            Form ini hanya untuk mengubah detail kelas. Untuk mengubah teacher, gunakan fitur "Transfer" terpisah.
          </p>
        </div>

        <form id="edit-class-form">
          <div class="space-y-4">
            <div>
              <label for="edit-class-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nama Kelas <span class="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                id="edit-class-name"
                name="name"
                required
                value="${classData.name}"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <!-- Current Teacher Info (Read-only) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Teacher Saat Ini
              </label>
              <div class="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300">
                <div class="text-sm font-medium">${classData.teacher_name || 'Unknown Teacher'}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">${classData.teacher_email || '-'}</div>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Gunakan tombol "Transfer" untuk mengubah teacher
              </p>
            </div>
            
            <div>
              <label for="edit-class-program" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Program Studi
              </label>
              <input 
                type="text" 
                id="edit-class-program"
                name="program_studi"
                value="${classData.program_studi || ''}"
                placeholder="Contoh: Teknik Informatika"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label for="edit-class-institution" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Perguruan Tinggi
              </label>
              <input 
                type="text" 
                id="edit-class-institution"
                name="perguruan_tinggi"
                value="${classData.perguruan_tinggi || ''}"
                placeholder="Contoh: Universitas Indonesia"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div class="mt-6 flex justify-end gap-3">
            <button 
              type="button"
              id="cancel-btn"
              class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    `);

    // Event listeners
    const closeBtn = modal.querySelector('#close-btn');
    const cancelBtn = modal.querySelector('#cancel-btn');
    const form = modal.querySelector('#edit-class-form');

    closeBtn.addEventListener('click', () => this.closeModal(modal));
    cancelBtn.addEventListener('click', () => this.closeModal(modal));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);
      this.closeModal(modal);
      if (this.onEditClass) {
        this.onEditClass(classData.id, data);
      }
    });
  },

  showTransferForm(classData, availableTeachers) {
    const modal = this.createModal(`
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Transfer Kepemilikan Kelas</h3>
          <button 
            id="close-btn" 
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <div class="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
          <p class="text-sm text-yellow-800 dark:text-yellow-200">
            <i class="fas fa-exclamation-triangle mr-2"></i>
            Anda akan mentransfer kepemilikan kelas "${classData.name}" dari <strong>${classData.teacher_name}</strong> ke teacher lain.
          </p>
        </div>
        
        <form id="transfer-class-form">
          <div class="space-y-4">
            <!-- Current Teacher Info -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Teacher Saat Ini
              </label>
              <div class="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                <div class="text-sm font-medium text-gray-700 dark:text-gray-300">${classData.teacher_name}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">${classData.teacher_email || '-'}</div>
              </div>
            </div>

            <div>
              <label for="transfer-teacher" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Transfer ke Teacher <span class="text-red-500">*</span>
              </label>
              <select 
                id="transfer-teacher"
                name="teacher_id"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Pilih Teacher Tujuan</option>
                ${availableTeachers.map(t => `
                  <option value="${t.id}">${t.full_name} (${t.email})</option>
                `).join('')}
              </select>
              ${availableTeachers.length === 0 ? `
                <p class="text-xs text-red-500 mt-1">Tidak ada teacher lain yang tersedia</p>
              ` : ''}
            </div>
          </div>
          
          <div class="mt-6 flex justify-end gap-3">
            <button 
              type="button"
              id="cancel-btn"
              class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit"
              class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              ${availableTeachers.length === 0 ? 'disabled' : ''}
            >
              Transfer Kelas
            </button>
          </div>
        </form>
      </div>
    `);

    // Event listeners
    const closeBtn = modal.querySelector('#close-btn');
    const cancelBtn = modal.querySelector('#cancel-btn');
    const form = modal.querySelector('#transfer-class-form');

    closeBtn.addEventListener('click', () => this.closeModal(modal));
    cancelBtn.addEventListener('click', () => this.closeModal(modal));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const teacherId = formData.get('teacher_id');
      this.closeModal(modal);
      if (this.onTransferClass) {
        this.onTransferClass(classData.id, teacherId);
      }
    });
  },

  showStudentsModal(classData, students) {
    const modal = this.createModal(`
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-3xl mx-auto max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Siswa di ${classData.name}</h3>
          <button 
            id="close-btn" 
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <div class="mb-4">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Total: ${students.length} siswa | Teacher: ${classData.teacher_name}
          </p>
        </div>
        
        <div class="max-h-96 overflow-y-auto">
          ${students.length === 0 ? `
            <div class="text-center py-8">
              <i class="fas fa-users text-gray-400 text-4xl mb-2"></i>
              <p class="text-gray-500 dark:text-gray-400">Belum ada siswa di kelas ini</p>
            </div>
          ` : `
            <table class="w-full">
              <thead class="bg-gray-50 dark:bg-gray-700 sticky top-0">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Nama</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">NIM</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase hidden sm:table-cell">Email</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
                ${students.map(student => `
                  <tr>
                    <td class="px-4 py-2 text-sm text-gray-900 dark:text-white">
                      ${student.full_name}
                    </td>
                    <td class="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                      ${student.nim || '-'}
                    </td>
                    <td class="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                      ${student.email || '-'}
                    </td>
                    <td class="px-4 py-2 text-sm">
                      <button 
                        class="remove-student-btn text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/50"
                        data-class-id="${classData.id}" data-student-id="${student.id}" data-student-name="${student.full_name}"
                        title="Keluarkan dari kelas"
                      >
                        <i class="fas fa-user-times"></i>
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `}
        </div>
        
        <div class="mt-6 flex justify-end">
          <button 
            id="close-btn-bottom"
            class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    `);

    // Add data attribute to identify students modal
    modal.setAttribute('data-modal-type', 'students');

    // Event listeners
    const closeBtn = modal.querySelector('#close-btn');
    const closeBottomBtn = modal.querySelector('#close-btn-bottom');

    closeBtn.addEventListener('click', () => this.closeModal(modal));
    closeBottomBtn.addEventListener('click', () => this.closeModal(modal));

    // Setup remove student listeners
    const removeButtons = modal.querySelectorAll('.remove-student-btn');
    removeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const classId = button.getAttribute('data-class-id');
        const studentId = button.getAttribute('data-student-id');
        const studentName = button.getAttribute('data-student-name');

        // Show confirmation first
        this.showConfirmDialog(
          'Keluarkan Siswa',
          `Apakah Anda yakin ingin mengeluarkan "${studentName}" dari kelas ini?`,
          'Keluarkan',
          'Batal'
        ).then(confirmed => {
          if (confirmed && this.onRemoveStudent) {
            this.onRemoveStudent(classId, studentId);
          }
        });
      });
    });
  },

  isStudentsModalOpen() {
    return !!document.querySelector('[data-modal-type="students"]');
  },

  updateStudentsModal(classData, students) {
    const modal = document.querySelector('[data-modal-type="students"]');
    if (modal) {
      this.closeModal(modal);
      this.showStudentsModal(classData, students);
    }
  },

  showConfirmDialog(title, message, confirmText = 'Ya', cancelText = 'Batal') {
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

    document.getElementById('modals-container').appendChild(modal);

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
    if (modal && modal.parentNode) {
      modal.classList.add('opacity-0');
      setTimeout(() => {
        if (modal.parentNode) {
          modal.parentNode.removeChild(modal);
        }
      }, 200);
    }
  },

  hideCreateForm() {
    const modal = document.querySelector('#modals-container .fixed');
    if (modal) this.closeModal(modal);
  },

  hideEditForm() {
    const modal = document.querySelector('#modals-container .fixed');
    if (modal) this.closeModal(modal);
  },

  hideTransferForm() {
    const modal = document.querySelector('#modals-container .fixed');
    if (modal) this.closeModal(modal);
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

  // FIXED cleanup method - prevent circular reference
  cleanup() {
    // Prevent circular cleanup calls
    if (this._isCleaningUp) {
      return;
    }

    //console.log('🧹 Cleaning up Admin Manage Class Page...');
    this._isCleaningUp = true;

    try {
      // Close any open modals
      const modals = document.querySelectorAll('#modals-container .fixed');
      modals.forEach(modal => this.closeModal(modal));

      // Clean up presenter WITHOUT calling its cleanup method
      if (this.presenter) {
        // Just destroy the presenter, don't call view.cleanup()
        this.presenter.destroy();
        this.presenter = null;
      }

      // Clear event handlers
      this.onSearchChange = null;
      this.onTeacherFilterChange = null;
      this.onSortChange = null;
      this.onCreateClass = null;
      this.onEditClass = null;
      this.onDeleteClass = null;
      this.onViewClass = null;
      this.onTransferClass = null;
      this.onViewStudents = null;
      this.onRemoveStudent = null;
      this.onRefresh = null;
      this.onShowCreateForm = null;
      this.onShowEditForm = null;
      this.onShowTransferForm = null;
      this.onPageChange = null;

      // Reset flags
      this._initialized = false;
      this._eventListenersSetup = false;

    } finally {
      // Always reset the cleanup flag
      this._isCleaningUp = false;
    }
  }
};

export default AdminManageClassPage;