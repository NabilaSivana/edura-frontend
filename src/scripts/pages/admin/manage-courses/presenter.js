// src/scripts/pages/admin/manage-courses/presenter.js
import AdminCourseModel from "./model.js";

const AdminCoursePresenter = {
  view: null,

  init(view) {
    this.view = view;
    this.setupEventHandlers();
    this.loadInitialData();
  },

  setupEventHandlers() {
    // Set event handlers on view
    this.view.onSearchChange = this.handleSearchChange.bind(this);
    this.view.onFilterChange = this.handleFilterChange.bind(this);
    this.view.onPageChange = this.handlePageChange.bind(this);
    this.view.onViewCourse = this.handleViewCourse.bind(this);
    this.view.onEditCourse = this.handleEditCourse.bind(this);
    this.view.onDeleteCourse = this.handleDeleteCourse.bind(this);
    this.view.onAddCourse = this.handleAddCourse.bind(this);
    this.view.onExportCourses = this.handleExportCourses.bind(this);
    this.view.onRefresh = this.handleRefresh.bind(this);
    this.view.onCreateCourse = this.handleCreateCourse.bind(this);
    this.view.onUpdateCourse = this.handleUpdateCourse.bind(this);
    this.view.onConfirmDelete = this.handleConfirmDelete.bind(this);
  },

  async loadInitialData() {
    try {
      //console.log('🔄 Loading initial data...');
      this.view.showLoading();

      // Load statistics
      const stats = await AdminCourseModel.getCourseStatistics();
      this.view.renderStatistics(stats);

      // Load filter options
      const [subjects, programStudi] = await Promise.all([
        AdminCourseModel.getUniqueSubjects(),
        AdminCourseModel.getUniqueProgramStudi()
      ]);

      // Populate filter dropdowns
      this.view.populateSubjectFilter(subjects);
      this.view.populateProgramFilter(programStudi);

      // Load courses
      await this.loadCourses();

      //console.log('✅ Initial data loaded successfully');
    } catch (error) {
      console.error('❌ Error loading initial data:', error);
      this.view.showError('Gagal memuat data kursus: ' + error.message);
    }
  },

  async loadCourses() {
    try {
      this.view.showLoading();

      const filters = this.view.getFilters();
      const result = await AdminCourseModel.getAllCourses(filters);

      this.view.renderCourses(result.data || []);

      if (result.total > 0) {
        this.view.renderPagination({
          currentPage: result.page || filters.page,
          totalPages: result.totalPages || 1,
          totalItems: result.total || 0,
          itemsPerPage: filters.limit || 10
        });
      } else {
        // Clear pagination if no data
        const paginationContainer = document.getElementById('pagination-container');
        if (paginationContainer) {
          paginationContainer.innerHTML = '';
        }
      }

      this.view.hideLoading();
    } catch (error) {
      console.error('❌ Error loading courses:', error);
      this.view.showError('Gagal memuat data kursus: ' + error.message);
    }
  },

  async handleSearchChange(search) {
    //console.log('🔍 Search changed:', search);
    this.view.updateFilters({ search, page: 1 });
    await this.loadCourses();
  },

  async handleFilterChange(filterType, value) {
    //console.log(`🔧 Filter changed: ${filterType} = ${value}`);
    const update = { page: 1 };
    update[filterType] = value;
    this.view.updateFilters(update);
    await this.loadCourses();
  },

  async handlePageChange(page) {
    //console.log('📄 Page changed:', page);
    this.view.updateFilters({ page });
    await this.loadCourses();
  },

  async handleViewCourse(courseId) {
    try {
      //console.log('👁️ Viewing course:', courseId);
      const courseDetail = await AdminCourseModel.getCourseDetail(courseId);

      // Create a proper course detail modal
      this.showCourseDetailModal(courseDetail);
    } catch (error) {
      console.error('❌ Error viewing course:', error);
      this.view.showError('Gagal memuat detail kursus: ' + error.message);
    }
  },

  showCourseDetailModal(courseDetail) {
    const { course, sessions } = courseDetail;

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Detail Kursus</h3>
            <button class="modal-close-btn text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Course Information -->
            <div class="space-y-4">
              <div>
                <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Informasi Kursus</h4>
                
                <div class="space-y-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Judul</label>
                    <p class="text-gray-900 dark:text-white">${course.title}</p>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Deskripsi</label>
                    <p class="text-gray-900 dark:text-white">${course.description || '-'}</p>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Subject</label>
                      <p class="text-gray-900 dark:text-white">${course.subject}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Level</label>
                      <span class="inline-block px-2 py-1 text-xs font-medium rounded-full ${this.view.getLevelBadgeClass(course.level)}">
                        ${this.view.formatLevel(course.level)}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Program Studi</label>
                    <p class="text-gray-900 dark:text-white">${course.program_studi || '-'}</p>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Status Verifikasi</label>
                      <span class="inline-block px-2 py-1 text-xs font-medium rounded-full ${this.view.getVerificationBadgeClass(course.is_verified)}">
                        ${this.view.formatVerificationStatus(course.is_verified)}
                      </span>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Dibuat</label>
                      <p class="text-gray-900 dark:text-white">${this.view.formatDate(course.created_at)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sessions Information -->
            <div>
              <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Sesi Pembelajaran (${sessions?.length || 0})
              </h4>
              
              <div class="space-y-3 max-h-96 overflow-y-auto">
                ${sessions && sessions.length > 0 ? sessions.map((session, index) => `
                  <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div class="flex items-center justify-between">
                      <h5 class="font-medium text-gray-900 dark:text-white">
                        ${index + 1}. ${session.title}
                      </h5>
                    
                    </div>
                    ${session.description ? `
                      <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        ${session.description}
                      </p>
                    ` : ''}
                  </div>
                `).join('') : `
                  <div class="text-center py-8">
                    <i class="fas fa-book-open text-gray-400 text-3xl mb-2"></i>
                    <p class="text-gray-500 dark:text-gray-400">Belum ada sesi pembelajaran</p>
                  </div>
                `}
              </div>
            </div>
          </div>

          <div class="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
            <button class="modal-close-btn px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
              Tutup
            </button>
            <button 
              class="edit-course-btn px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              data-course-id="${course.id}"
            >
              Edit Kursus
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Add event listeners
    const closeButtons = modal.querySelectorAll('.modal-close-btn');
    const editButton = modal.querySelector('.edit-course-btn');

    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        modal.remove();
      });
    });

    if (editButton) {
      editButton.addEventListener('click', () => {
        const courseId = editButton.getAttribute('data-course-id');
        modal.remove();
        this.handleEditCourse(courseId);
      });
    }

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  },

  async handleEditCourse(courseId) {
    try {
      //console.log('✏️ Editing course:', courseId);
      const courseDetail = await AdminCourseModel.getCourseDetail(courseId);
      this.view.showCourseModal(courseDetail.course);
    } catch (error) {
      console.error('❌ Error loading course for edit:', error);
      this.view.showError('Gagal memuat data kursus: ' + error.message);
    }
  },

  async handleDeleteCourse(courseId) {
    try {
      //console.log('🗑️ Delete course requested:', courseId);

      // Get course details for confirmation
      const courseDetail = await AdminCourseModel.getCourseDetail(courseId);
      this.view.showDeleteConfirmation(courseId, courseDetail.course.title);
    } catch (error) {
      console.error('❌ Error preparing delete:', error);
      this.view.showError('Gagal memuat data kursus: ' + error.message);
    }
  },

  async handleConfirmDelete(courseId) {
    try {
      //console.log('✅ Confirming delete course:', courseId);

      await AdminCourseModel.deleteCourse(courseId);
      this.view.showSuccess('Kursus berhasil dihapus');

      // Refresh data
      await this.loadCourses();

      // Update statistics
      const stats = await AdminCourseModel.getCourseStatistics();
      this.view.renderStatistics(stats);
    } catch (error) {
      console.error('❌ Error deleting course:', error);
      this.view.showError('Gagal menghapus kursus: ' + error.message);
    }
  },

  async handleAddCourse() {
    //console.log('➕ Add course requested');
    this.view.showCourseModal(); // Show empty modal for new course
  },

  async handleCreateCourse(formData) {
    try {
      //console.log('💾 Creating course:', formData);

      // Note: Backend belum ada endpoint create course
      // Implementasikan jika diperlukan
      this.view.showError('Fitur tambah kursus belum tersedia');

    } catch (error) {
      console.error('❌ Error creating course:', error);
      this.view.showError('Gagal membuat kursus: ' + error.message);
    }
  },

  async handleUpdateCourse(courseId, formData) {
    try {
      //console.log('💾 Updating course:', courseId, formData);

      await AdminCourseModel.updateCourse(courseId, formData);
      this.view.showSuccess('Kursus berhasil diperbarui');

      // Refresh data
      await this.loadCourses();

      // Update statistics
      const stats = await AdminCourseModel.getCourseStatistics();
      this.view.renderStatistics(stats);
    } catch (error) {
      console.error('❌ Error updating course:', error);
      this.view.showError('Gagal memperbarui kursus: ' + error.message);
    }
  },

  async handleExportCourses() {
    try {
      //console.log('📤 Exporting courses...');

      this.view.startRefreshAnimation();

      // Get all courses for export
      const filters = this.view.getFilters();
      const allCoursesFilter = { ...filters, limit: 1000, page: 1 }; // Get many courses for export
      const result = await AdminCourseModel.getAllCourses(allCoursesFilter);

      if (result.data && result.data.length > 0) {
        this.view.exportToCSV(result.data);
        this.view.showSuccess('Data kursus berhasil diekspor');
      } else {
        this.view.showError('Tidak ada data untuk diekspor');
      }
    } catch (error) {
      console.error('❌ Error exporting courses:', error);
      this.view.showError('Gagal export kursus: ' + error.message);
    } finally {
      this.view.stopRefreshAnimation();
    }
  },

  async handleRefresh() {
    try {
      //console.log('🔄 Refreshing data...');

      this.view.startRefreshAnimation();

      // Clear any existing cache if needed
      // Api.clearAllCache(); // uncomment if needed

      await this.loadInitialData();

      this.view.showSuccess('Data berhasil dimuat ulang');
    } catch (error) {
      console.error('❌ Error refreshing:', error);
      this.view.showError('Gagal memuat ulang data: ' + error.message);
    } finally {
      this.view.stopRefreshAnimation();
    }
  },

  destroy() {
    // Cleanup if needed
    if (this.view) {
      this.view.cleanup();
      this.view = null;
    }
  }
};

export default AdminCoursePresenter;