// src/scripts/pages/admin/manage-courses/page.js
import AdminCoursePresenter from "./presenter.js";

const AdminCoursePage = {
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
                      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Manajemen Kursus</h1>
                      <p class="text-gray-600 dark:text-gray-400 mt-1">Kelola semua kursus dalam sistem</p>
                    </div>
                    <div class="flex gap-3">
                      <button 
                        id="add-course-btn" 
                        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                      >
                        <i class="fas fa-plus"></i>
                        <span class="hidden sm:inline">Tambah Kursus</span>
                      </button>
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
                <div id="statistics-container" class="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
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
                          id="search-input"
                          placeholder="Cari judul atau subjek kursus..."
                          class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <!-- Level Filter -->
                    <div class="w-full lg:w-48">
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Level
                      </label>
                      <select 
                        id="level-filter" 
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Semua Level</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>

                    <!-- Subject Filter -->
                    <div class="w-full lg:w-48">
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Subject
                      </label>
                      <select 
                        id="subject-filter" 
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Semua Subject</option>
                        <!-- Subject options will be populated here -->
                      </select>
                    </div>

                    <!-- Program Studi Filter -->
                    <div class="w-full lg:w-48">
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Program Studi
                      </label>
                      <select 
                        id="program-filter" 
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Semua Program</option>
                        <!-- Program options will be populated here -->
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Courses Table -->
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
                            Kursus
                          </th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Level
                          </th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                            Program Studi
                          </th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Verifikasi
                          </th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                            Dibuat
                          </th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody id="courses-tbody" class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        <!-- Table rows will be rendered here -->
                      </tbody>
                    </table>
                  </div>

                  <!-- Empty State -->
                  <div id="empty-state" class="hidden p-8 text-center">
                    <div class="text-gray-400 mb-4">
                      <i class="fas fa-book text-6xl"></i>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Belum Ada Kursus</h3>
                    <p class="text-gray-600 dark:text-gray-400">Tidak ada kursus yang ditemukan</p>
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
    console.log('🎯 Initializing Admin Course Page...');

    // Store reference to this instance globally for onclick handlers
    window.AdminCoursePageInstance = this;

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
    AdminCoursePresenter.init(this);

    // Setup event listeners
    this.setupEventListeners();
  },

  setupEventListeners() {
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

    // Level filter
    const levelFilter = document.getElementById('level-filter');
    if (levelFilter) {
      levelFilter.addEventListener('change', (e) => {
        if (this.onFilterChange) {
          this.onFilterChange('level', e.target.value);
        }
      });
    }

    // Subject filter
    const subjectFilter = document.getElementById('subject-filter');
    if (subjectFilter) {
      subjectFilter.addEventListener('change', (e) => {
        if (this.onFilterChange) {
          this.onFilterChange('subject', e.target.value);
        }
      });
    }

    // Program Studi filter
    const programFilter = document.getElementById('program-filter');
    if (programFilter) {
      programFilter.addEventListener('change', (e) => {
        if (this.onFilterChange) {
          this.onFilterChange('program_studi', e.target.value);
        }
      });
    }

    // Add course button
    const addCourseBtn = document.getElementById('add-course-btn');
    if (addCourseBtn) {
      addCourseBtn.addEventListener('click', () => {
        if (this.onAddCourse) {
          this.onAddCourse();
        }
      });
    }

    // Export button
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        if (this.onExportCourses) {
          this.onExportCourses();
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

  // State management
  filters: {
    page: 1,
    limit: 10,
    search: '',
    level: '',
    subject: '',
    program_studi: ''
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
      level: '',
      subject: '',
      program_studi: ''
    };
    this.updateFilterUI();
  },

  updateFilterUI() {
    const searchInput = document.getElementById('search-input');
    const levelFilter = document.getElementById('level-filter');
    const subjectFilter = document.getElementById('subject-filter');
    const programFilter = document.getElementById('program-filter');

    if (searchInput) searchInput.value = this.filters.search;
    if (levelFilter) levelFilter.value = this.filters.level;
    if (subjectFilter) subjectFilter.value = this.filters.subject;
    if (programFilter) programFilter.value = this.filters.program_studi;
  },

  // Event handlers (will be set by presenter)
  onSearchChange: null,
  onFilterChange: null,
  onPageChange: null,
  onViewCourse: null,
  onEditCourse: null,
  onDeleteCourse: null,
  onAddCourse: null,
  onExportCourses: null,
  onRefresh: null,
  onShowEditForm: null,

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
        title: 'Total Kursus',
        value: stats.total || 0,
        icon: 'fas fa-book',
        color: 'blue'
      },
      {
        title: 'Telah Diverifikasi',
        value: stats.active || 0,
        icon: 'fas fa-play-circle',
        color: 'green'
      },
      {
        title: 'Menunggu Diverifikasi',
        value: stats.draft || 0,
        icon: 'fas fa-edit',
        color: 'yellow'
      },
      {
        title: 'Kursus Bulan Ini',
        value: stats.thisMonth || 0,
        icon: 'fas fa-calendar',
        color: 'indigo'
      }
    ];

    container.innerHTML = statisticsCards.map(stat => `
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">${stat.title}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">${stat.value.toLocaleString()}</p>
          </div>
          <div class="p-3 bg-${stat.color}-100 dark:bg-${stat.color}-900 rounded-lg">
            <i class="${stat.icon} text-${stat.color}-600 dark:text-${stat.color}-400 text-xl"></i>
          </div>
        </div>
      </div>
    `).join('');
  },

  renderCourses(courses) {
    const tbody = document.getElementById('courses-tbody');
    const emptyState = document.getElementById('empty-state');
    const tableContainer = document.getElementById('table-container');

    if (!tbody) return;

    if (!courses || courses.length === 0) {
      if (emptyState) emptyState.classList.remove('hidden');
      if (tableContainer) tableContainer.classList.add('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    if (tableContainer) tableContainer.classList.remove('hidden');

    tbody.innerHTML = courses.map(course => `
      <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center mr-4">
              <i class="fas fa-book text-gray-500 dark:text-gray-400"></i>
            </div>
            <div>
              <div class="text-sm font-medium text-gray-900 dark:text-white">${course.title}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">${course.subject}</div>
            </div>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-2 py-1 text-xs font-medium rounded-full ${this.getLevelBadgeClass(course.level)}">
            ${this.formatLevel(course.level)}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
          <div class="text-sm text-gray-900 dark:text-white">${course.program_studi || '-'}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-2 py-1 text-xs font-medium rounded-full ${this.getVerificationBadgeClass(course.is_verified)}">
            ${this.formatVerificationStatus(course.is_verified)}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap hidden md:table-cell">
          <div class="text-sm text-gray-900 dark:text-white">${this.formatDate(course.created_at)}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div class="flex items-center gap-2">
            <button 
              class="course-action-btn text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/50"
              data-action="view" data-course-id="${course.id}"
              title="Lihat Detail"
            >
              <i class="fas fa-eye"></i>
            </button>
            <button 
              class="course-action-btn text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 p-2 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/50"
              data-action="edit" data-course-id="${course.id}"
              title="Edit"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button 
              class="course-action-btn text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/50"
              data-action="delete" data-course-id="${course.id}"
              title="Hapus"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    // Add event listeners for action buttons
    this.setupActionButtonListeners();
  },

  setupActionButtonListeners() {
    const actionButtons = document.querySelectorAll('.course-action-btn');
    actionButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const action = button.getAttribute('data-action');
        const courseId = button.getAttribute('data-course-id');

        switch (action) {
          case 'view':
            if (this.onViewCourse) this.onViewCourse(courseId);
            break;
          case 'edit':
            if (this.onEditCourse) this.onEditCourse(courseId);
            break;
          case 'delete':
            if (this.onDeleteCourse) this.onDeleteCourse(courseId);
            break;
        }
      });
    });
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
          Menampilkan ${startItem} sampai ${endItem} dari ${totalItems} kursus
        </div>
        <div class="flex items-center gap-1">
    `;

    // Previous button
    paginationHTML += `
      <button 
        class="pagination-btn px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}
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
        data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    `;

    paginationHTML += `
        </div>
      </div>
    `;

    container.innerHTML = paginationHTML;

    // Add event listeners for pagination buttons
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

  populateSubjectFilter(subjects) {
    const select = document.getElementById('subject-filter');
    if (!select) return;

    const currentValue = select.value;
    select.innerHTML = '<option value="">Semua Subject</option>';

    subjects.forEach(subject => {
      const option = document.createElement('option');
      option.value = subject;
      option.textContent = subject;
      select.appendChild(option);
    });

    select.value = currentValue;
  },

  populateProgramFilter(programs) {
    const select = document.getElementById('program-filter');
    if (!select) return;

    const currentValue = select.value;
    select.innerHTML = '<option value="">Semua Program</option>';

    programs.forEach(program => {
      const option = document.createElement('option');
      option.value = program;
      option.textContent = program;
      select.appendChild(option);
    });

    select.value = currentValue;
  },

  // Utility methods
  getLevelBadgeClass(level) {
    const classes = {
      beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      expert: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return classes[level] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  },

  getVerificationBadgeClass(isVerified) {
    return isVerified
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
  },

  getStatusBadgeClass(status) {
    const classes = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    };
    return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  },

  formatLevel(level) {
    const levels = {
      beginner: 'Pemula',
      intermediate: 'Menengah',
      expert: 'Ahli'
    };
    return levels[level] || level;
  },

  formatVerificationStatus(isVerified) {
    return isVerified ? 'Terverifikasi' : 'Belum Terverifikasi';
  },

  formatStatus(status) {
    const statuses = {
      active: 'Aktif',
      draft: 'Draft',
      inactive: 'Tidak Aktif'
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
        day: 'numeric'
      });
    } catch (error) {
      return '-';
    }
  },

  // Modal methods
  showDeleteConfirmation(courseId, courseTitle) {
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
            Apakah Anda yakin ingin menghapus kursus "<strong>${courseTitle}</strong>"? 
            Tindakan ini tidak dapat dibatalkan.
          </p>
          <div class="flex gap-3 justify-end">
            <button 
              class="modal-cancel-btn px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button 
              class="modal-confirm-btn px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              data-course-id="${courseId}"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Add event listeners
    const cancelBtn = modal.querySelector('.modal-cancel-btn');
    const confirmBtn = modal.querySelector('.modal-confirm-btn');

    cancelBtn.addEventListener('click', () => {
      modal.remove();
    });

    confirmBtn.addEventListener('click', () => {
      if (this.confirmDelete) {
        this.confirmDelete(courseId);
      }
      modal.remove();
    });

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  },

  showCourseModal(course = null) {
    const isEdit = !!course;
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              ${isEdit ? 'Edit Kursus' : 'Tambah Kursus Baru'}
            </h3>
            <button 
              class="modal-close-btn text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>

          <form id="course-form" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Judul Kursus *
              </label>
              <input 
                type="text" 
                id="course-title"
                value="${course?.title || ''}"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan judul kursus"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Deskripsi
              </label>
              <textarea 
                id="course-description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan deskripsi kursus"
              >${course?.description || ''}</textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject *
                </label>
                <input 
                  type="text" 
                  id="course-subject"
                  value="${course?.subject || ''}"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Contoh: Matematika"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Level *
                </label>
                <select 
                  id="course-level"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Pilih Level</option>
                  <option value="beginner" ${course?.level === 'beginner' ? 'selected' : ''}>Pemula</option>
                  <option value="intermediate" ${course?.level === 'intermediate' ? 'selected' : ''}>Menengah</option>
                  <option value="expert" ${course?.level === 'expert' ? 'selected' : ''}>Ahli</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Program Studi
              </label>
              <input 
                type="text" 
                id="course-program"
                value="${course?.program_studi || ''}"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contoh: Teknik Informatika"
              />
            </div>

            <div class="flex gap-3 justify-end pt-4">
              <button 
                type="button"
                class="modal-cancel-btn px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button 
                type="submit"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                ${isEdit ? 'Update' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Add event listeners
    const closeBtn = modal.querySelector('.modal-close-btn');
    const cancelBtn = modal.querySelector('.modal-cancel-btn');
    const form = modal.querySelector('#course-form');

    closeBtn.addEventListener('click', () => {
      modal.remove();
    });

    cancelBtn.addEventListener('click', () => {
      modal.remove();
    });

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });

    // Setup form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleCourseSubmit(course?.id);
      modal.remove();
    });
  },

  handleCourseSubmit(courseId = null) {
    const formData = {
      title: document.getElementById('course-title').value,
      description: document.getElementById('course-description').value,
      subject: document.getElementById('course-subject').value,
      level: document.getElementById('course-level').value,
      program_studi: document.getElementById('course-program').value
    };

    if (courseId) {
      if (this.onUpdateCourse) {
        this.onUpdateCourse(courseId, formData);
      }
    } else {
      if (this.onCreateCourse) {
        this.onCreateCourse(formData);
      }
    }
  },

  // Additional event handlers
  onUpdateCourse: null,
  onCreateCourse: null,

  confirmDelete(courseId) {
    if (this.onConfirmDelete) {
      this.onConfirmDelete(courseId);
    }
  },

  // Export functionality
  exportToCSV(courses) {
    const headers = ['ID', 'Judul', 'Subject', 'Level', 'Program Studi', 'Verifikasi', 'Dibuat'];
    const csvContent = [
      headers.join(','),
      ...courses.map(course => [
        course.id,
        `"${course.title}"`,
        `"${course.subject}"`,
        course.level,
        `"${course.program_studi || ''}"`,
        course.is_verified ? 'Terverifikasi' : 'Belum Terverifikasi',
        course.created_at
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `courses_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    // Remove global reference
    if (window.AdminCoursePageInstance === this) {
      delete window.AdminCoursePageInstance;
    }

    // Remove any event listeners or cleanup resources
    this.onSearchChange = null;
    this.onFilterChange = null;
    this.onPageChange = null;
    this.onViewCourse = null;
    this.onEditCourse = null;
    this.onDeleteCourse = null;
    this.onAddCourse = null;
    this.onExportCourses = null;
    this.onRefresh = null;
    this.onShowEditForm = null;
    this.onUpdateCourse = null;
    this.onCreateCourse = null;

    // Remove any existing modals
    const modals = document.querySelectorAll('.fixed.inset-0');
    modals.forEach(modal => modal.remove());
  }
};

export default AdminCoursePage;