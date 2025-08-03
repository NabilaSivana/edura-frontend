import { promptTextarea } from "../../../utils/prompt.js";
import TeacherGradeModel from "./model.js";

const TeacherGradePresenter = {
  studentsData: [],
  filteredData: [],
  sortAsc: true,
  currentClassId: null,
  currentClassName: "",
  selectedStudents: new Set(),

  async init() {
    this.loadClassList();
    this.loadExcelLibrary();
  },

  // 🔄 NEW: Refresh all data functionality
  async refreshAllData() {
    //console.log("🔄 Refreshing all grade data...");
    
    try {
      // Show refresh notification
      this.showRefreshNotification("🔄 Menyegarkan data kelas...", "info");
      
      // Check if we're in detail view
      const isDetailView = !document.getElementById("grade-detail-section").classList.contains("hidden");
      
      if (isDetailView && this.currentClassId) {
        // Refresh current class detail
        await this.refreshClassDetail();
      } else {
        // Refresh class list
        await this.refreshClassList();
      }
      
      // Show success notification
      this.showRefreshNotification("✅ Data berhasil disegarkan!", "success");
      
      //console.log("✅ All grade data refreshed successfully");
    } catch (error) {
      console.error("❌ Failed to refresh grade data:", error);
      this.showRefreshNotification("❌ Gagal menyegarkan data. Coba lagi nanti.", "error");
      throw error;
    }
  },

  // 🔄 NEW: Refresh class list
  async refreshClassList() {
    try {
      // Clear cache and reload class list
      TeacherGradeModel.clearCache();
      await this.loadClassList(true);
    } catch (error) {
      console.error("❌ Failed to refresh class list:", error);
      throw error;
    }
  },

  // 🔄 NEW: Refresh current class detail
  async refreshClassDetail() {
    if (!this.currentClassId || !this.currentClassName) {
      console.warn("⚠️ No current class to refresh");
      return;
    }

    try {
      // Clear specific class cache
      TeacherGradeModel.clearClassCache(this.currentClassId);
      
      // Reload class detail with same parameters
      await this.loadClassDetail(this.currentClassId, this.currentClassName, true);
    } catch (error) {
      console.error("❌ Failed to refresh class detail:", error);
      throw error;
    }
  },

  // 🔄 NEW: Show refresh notification
  showRefreshNotification(message, type = "info") {
    // Remove existing notification
    const existing = document.getElementById("refresh-notification");
    if (existing) existing.remove();

    const notification = document.createElement("div");
    notification.id = "refresh-notification";
    notification.className = "fixed top-4 right-4 z-50 max-w-sm";

    const bgColor = type === "success" ? "bg-green-500" : 
                   type === "error" ? "bg-red-500" : "bg-blue-500";

    notification.innerHTML = `
      <div class="${bgColor} text-white px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-0">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium">${message}</span>
          <button onclick="this.parentElement.parentElement.remove()" class="ml-3 text-white hover:text-gray-200">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds for non-loading messages
    if (type !== "info") {
      setTimeout(() => {
        if (notification && notification.parentNode) {
          notification.style.transform = "translateX(100%)";
          setTimeout(() => {
            if (notification && notification.parentNode) {
              notification.remove();
            }
          }, 300);
        }
      }, 3000);
    }
  },

  async loadExcelLibrary() {
    if (typeof XLSX === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
      script.onload = () => //console.log('✅ XLSX library loaded');
      script.onerror = () => console.warn('⚠️ Failed to load XLSX library');
      document.head.appendChild(script);
    }
  },

  async loadClassList(forceRefresh = false) {
    const wrapper = document.getElementById("class-list");
    const loading = document.getElementById("class-loading");

    try {
      const classes = await TeacherGradeModel.getClasses(forceRefresh);
      if (loading) loading.style.display = "none";

      if (!classes.length) {
        wrapper.innerHTML = `
          <div class="col-span-full text-center py-16">
            <div class="mx-auto w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
              <i class="fas fa-chalkboard-teacher text-4xl text-blue-400"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Belum Ada Kelas</h3>
            <p class="text-gray-500 dark:text-gray-400">Anda belum memiliki kelas untuk dikelola nilai siswanya.</p>
          </div>
        `;
        return;
      }

      wrapper.innerHTML = "";
      classes.forEach((cls) => {
        const card = document.createElement("div");
        card.className = `
          group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 
          shadow-sm hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600
          transition-all duration-300 cursor-pointer overflow-hidden
        `;

        card.innerHTML = `
          <div class="p-6">
            <!-- Header Section -->
            <div class="flex items-center justify-between mb-4">
              <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <i class="fas fa-graduation-cap text-white text-xl"></i>
              </div>
              <span class="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium border border-blue-200 dark:border-blue-700">
                ${cls.class_code}
              </span>
            </div>

            <!-- Class Info -->
            <div class="mb-6">
              <h3 class="text-xl font-bold mb-3 text-gray-800 dark:text-white leading-tight">
                ${cls.name}
              </h3>
              <div class="space-y-2">
                <div class="flex items-center text-gray-600 dark:text-gray-300">
                  <i class="fas fa-book-open w-5 text-blue-500 mr-3"></i>
                  <span class="text-sm font-medium">${cls.program_studi}</span>
                </div>
                <div class="flex items-center text-gray-600 dark:text-gray-300">
                  <i class="fas fa-university w-5 text-blue-500 mr-3"></i>
                  <span class="text-sm">${cls.perguruan_tinggi}</span>
                </div>
              </div>
            </div>

            <!-- Action Button -->
            <button class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl group-hover:scale-[1.02]">
              <i class="fas fa-chart-line mr-3"></i>
              <span class="text-base">Kelola Nilai Siswa</span>
            </button>
          </div>
        `;

        card.addEventListener("click", () => this.loadClassDetail(cls.id, cls.name));
        wrapper.appendChild(card);
      });
    } catch (err) {
      wrapper.innerHTML = `
        <div class="col-span-full text-center py-16">
          <div class="mx-auto w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
            <i class="fas fa-exclamation-triangle text-4xl text-red-500"></i>
          </div>
          <h3 class="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Gagal Memuat Kelas</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-4">Terjadi kesalahan saat mengambil data kelas</p>
          <button onclick="location.reload()" class="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
            <i class="fas fa-redo mr-2"></i>
            Coba Lagi
          </button>
        </div>
      `;
    }
  },

  async loadClassDetail(classId, className, forceRefresh = false) {
    this.currentClassId = classId;
    this.currentClassName = className;
    this.selectedStudents.clear();

    document.getElementById("grade-class-list-section").classList.add("hidden");
    document.getElementById("grade-detail-section").classList.remove("hidden");

    // Setup back button
    const backButton = document.getElementById("back-to-class-list");
    if (backButton) {
      backButton.onclick = () => {
        document.getElementById("grade-detail-section").classList.add("hidden");
        document.getElementById("grade-class-list-section").classList.remove("hidden");
        this.selectedStudents.clear();
        // Clear current class info when going back
        this.currentClassId = null;
        this.currentClassName = "";
      };
    }

    // 🔥 FIX: Setup enhanced UI dengan force update header
    this.setupEnhancedUI(className, true);

    // Show loading
    const tbody = document.getElementById("grade-detail-body");
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="px-6 py-16 text-center">
          <div class="flex flex-col items-center space-y-4">
            <div class="animate-spin w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
            <p class="text-lg text-gray-600 dark:text-gray-400 font-medium">Memuat data siswa...</p>
          </div>
        </td>
      </tr>
    `;

    try {
      const students = await TeacherGradeModel.getStudentsByClass(classId, forceRefresh);

      // 🔥 FILTER: Hanya siswa yang sudah mengikuti course
      const activeStudents = students.filter(student =>
        student.courses && student.courses.length > 0
      );

      this.studentsData = activeStudents;
      this.filteredData = [...activeStudents];

      if (activeStudents.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="8" class="px-6 py-16 text-center">
              <div class="flex flex-col items-center space-y-4">
                <div class="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <i class="fas fa-user-graduate text-3xl text-gray-400"></i>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Belum Ada Siswa Aktif</h3>
                  <p class="text-gray-500 dark:text-gray-400">Tidak ada siswa yang mengikuti course di kelas ini.</p>
                </div>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      this.renderTable();
      this.setupEventListeners(className);
      this.updateStats();
    } catch (error) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="px-6 py-16 text-center">
            <div class="flex flex-col items-center space-y-4">
              <i class="fas fa-exclamation-circle text-red-500 text-4xl"></i>
              <div>
                <h3 class="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Gagal Memuat Data</h3>
                <p class="text-gray-500 dark:text-gray-400 mb-4">Terjadi kesalahan saat mengambil data siswa</p>
                <button onclick="location.reload()" class="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
                  <i class="fas fa-redo mr-2"></i>
                  Coba Lagi
                </button>
              </div>
            </div>
          </td>
        </tr>
      `;
    }
  },

  setupEnhancedUI(className, forceUpdate = false) {
    // Add class header with force update option
    this.addClassHeader(className, forceUpdate);
    // Add enhanced controls
    this.addEnhancedControls();
    // Add stats container
    this.addStatsContainer();
  },

  // 🔥 FIX: Update addClassHeader to always update when needed
  addClassHeader(className, forceUpdate = false) {
    const detailSection = document.getElementById("grade-detail-section");
    if (!detailSection) return;

    const existingHeader = document.getElementById("class-header");
    
    // Remove existing header if force update or if updating with different class name
    if (forceUpdate && existingHeader) {
      existingHeader.remove();
    }

    // Create header if it doesn't exist or was removed
    if (!document.getElementById("class-header")) {
      const headerContainer = document.createElement("div");
      headerContainer.id = "class-header";
      headerContainer.className = "mb-8";

      headerContainer.innerHTML = `
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 class="text-2xl font-bold mb-2">${className}</h2>
              <p class="text-blue-100 text-lg">Manajemen Nilai & Progress Siswa</p>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-right">
                <p class="text-blue-100 text-sm">Total Siswa Aktif</p>
                <p class="text-3xl font-bold" id="header-student-count">-</p>
              </div>
            </div>
          </div>
        </div>
      `;

      const backButton = document.getElementById("back-to-class-list");
      if (backButton && backButton.parentNode) {
        backButton.parentNode.insertBefore(headerContainer, backButton.nextSibling);
      }
    } else if (existingHeader) {
      // Update existing header content
      const titleElement = existingHeader.querySelector("h2");
      if (titleElement) {
        titleElement.textContent = className;
      }
    }
  },

  addStatsContainer() {
    const detailSection = document.getElementById("grade-detail-section");
    if (detailSection && !document.getElementById("class-stats")) {
      const statsContainer = document.createElement("div");
      statsContainer.id = "class-stats";
      statsContainer.className = "mb-8";

      const table = document.querySelector("table");
      if (table && table.parentNode) {
        table.parentNode.insertBefore(statsContainer, table);
      }
    }
  },

  addEnhancedControls() {
    const table = document.querySelector("table");
    if (table && table.parentNode && !document.getElementById("enhanced-controls")) {
      const controlsContainer = document.createElement("div");
      controlsContainer.id = "enhanced-controls";
      controlsContainer.className = "mb-6";

      controlsContainer.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div class="flex flex-col lg:flex-row lg:items-center gap-4">
            <!-- Search -->
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <i class="fas fa-search mr-2"></i>Cari Siswa
              </label>
              <div class="relative">
                <input type="text" id="enhanced-search" placeholder="Cari nama siswa, NIM, atau program studi..." 
                       class="w-full pl-4 pr-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              </div>
            </div>

            <!-- Filters and Actions -->
            <div class="flex flex-col sm:flex-row gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <i class="fas fa-filter mr-2"></i>Filter Status
                </label>
                <select id="status-filter" class="px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-w-[150px]">
                  <option value="all">Semua Status</option>
                  <option value="completed">Sudah Selesai</option>
                  <option value="ongoing">Sedang Berlangsung</option>
                </select>
              </div>

              <!-- 🔄 NEW: Class Refresh Button -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <i class="fas fa-sync-alt mr-2"></i>Refresh
                </label>
                <button id="refresh-class-detail" class="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium text-base">
                  <i class="fas fa-sync-alt mr-2"></i>
                  Refresh Kelas
                </button>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <i class="fas fa-download mr-2"></i>Export Data
                </label>
                <button id="download-excel" class="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium text-base">
                  <i class="fas fa-file-excel mr-2"></i>
                  Download Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      table.parentNode.insertBefore(controlsContainer, table);
    }
  },

  setupEventListeners(className) {
    // Enhanced search
    const enhancedSearch = document.getElementById("enhanced-search");
    if (enhancedSearch) {
      enhancedSearch.addEventListener("input", (e) => {
        const keyword = e.target.value.toLowerCase();
        this.filteredData = this.studentsData.filter(s =>
          s.full_name.toLowerCase().includes(keyword) ||
          s.nim.toLowerCase().includes(keyword) ||
          s.program_studi.toLowerCase().includes(keyword)
        );
        this.renderTable();
        this.updateStats();
      });
    }

    // Status filter
    const statusFilter = document.getElementById("status-filter");
    if (statusFilter) {
      statusFilter.addEventListener("change", (e) => {
        const status = e.target.value;
        if (status === "all") {
          this.filteredData = [...this.studentsData];
        } else {
          this.filteredData = this.studentsData.filter(student => {
            const hasCompletedCourse = student.courses?.some(course => course.is_completed);
            return status === "completed" ? hasCompletedCourse : !hasCompletedCourse;
          });
        }
        this.renderTable();
        this.updateStats();
      });
    }

    // Sort by name
    const sortHeader = document.getElementById("sort-by-name");
    if (sortHeader) {
      sortHeader.addEventListener("click", () => {
        this.sortAsc = !this.sortAsc;
        this.filteredData.sort((a, b) => {
          return this.sortAsc
            ? a.full_name.localeCompare(b.full_name)
            : b.full_name.localeCompare(a.full_name);
        });
        this.renderTable();
      });
    }

    // 🔄 NEW: Class detail refresh button
    const refreshClassBtn = document.getElementById("refresh-class-detail");
    if (refreshClassBtn) {
      refreshClassBtn.addEventListener("click", async () => {
        const originalText = refreshClassBtn.innerHTML;
        refreshClassBtn.disabled = true;
        refreshClassBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Refreshing...';
        
        try {
          await this.refreshClassDetail();
          this.showNotification("✅ Data kelas berhasil disegarkan!", "success");
        } catch (error) {
          this.showNotification("❌ Gagal menyegarkan data kelas", "error");
        } finally {
          refreshClassBtn.disabled = false;
          refreshClassBtn.innerHTML = originalText;
        }
      });
    }

    // Excel download
    const downloadButton = document.getElementById("download-excel");
    if (downloadButton) {
      downloadButton.onclick = () => {
        this.exportToExcel(`${className}_nilai_siswa.xlsx`, this.filteredData);
      };
    }
  },

  renderTable() {
    const tbody = document.getElementById("grade-detail-body");
    tbody.innerHTML = "";

    if (!this.filteredData.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="px-6 py-12 text-center">
            <div class="flex flex-col items-center space-y-3">
              <i class="fas fa-search text-gray-400 text-3xl"></i>
              <p class="text-lg text-gray-500 dark:text-gray-400">Tidak ada data yang ditemukan</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    this.filteredData.forEach((student, index) => {
      // Render setiap course sebagai row terpisah
      student.courses.forEach((course, courseIndex) => {
        const isFirstCourse = courseIndex === 0;
        this.renderStudentRow(student, course, index, isFirstCourse, student.courses.length);
      });
    });
  },

  renderStudentRow(student, course, studentIndex, showStudentInfo, totalCourses = 1) {
    const tbody = document.getElementById("grade-detail-body");
    const tr = document.createElement("tr");
    tr.className = `
      hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-200
      ${studentIndex % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}
      border-b border-gray-200 dark:border-gray-700
    `;

    // Student info cells (tampil hanya untuk course pertama)
    const studentInfoCells = showStudentInfo ? `
      <td class="px-4 py-4 align-top" ${totalCourses > 1 ? `rowspan="${totalCourses}"` : ''}>
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            ${student.full_name.charAt(0).toUpperCase()}
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-base font-semibold text-gray-900 dark:text-white">${student.full_name}</p>
          </div>
        </div>
      </td>
      <td class="px-4 py-4 align-top" ${totalCourses > 1 ? `rowspan="${totalCourses}"` : ''}>
        <span class="font-mono text-base bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg">${student.nim}</span>
      </td>
      <td class="px-4 py-4 align-top text-base text-gray-700 dark:text-gray-300" ${totalCourses > 1 ? `rowspan="${totalCourses}"` : ''}>
        ${student.program_studi}
      </td>
    ` : '';

    // Course info
    const courseCell = `
      <td class="px-4 py-4 align-top">
        <div class="max-w-xs">
          <p class="text-base font-medium text-gray-800 dark:text-white leading-tight">${course.course_title}</p>
        </div>
      </td>
    `;

    // Grade
    const gradeCell = `
      <td class="px-4 py-4 align-top text-center">
        ${course.score_final_exam !== null && course.score_final_exam !== undefined ?
        (() => {
          const grade = course.score_final_exam;
          let colorClass = "bg-gray-100 text-gray-800";
          if (grade >= 85) colorClass = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
          else if (grade >= 70) colorClass = "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
          else if (grade >= 60) colorClass = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
          else colorClass = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
          return `<span class="inline-flex items-center px-3 py-1.5 rounded-lg text-base font-semibold ${colorClass}">${grade}</span>`;
        })()
        : '<span class="text-gray-400 text-base">-</span>'
      }
      </td>
    `;

    // Progress
    const progressCell = `
      <td class="px-4 py-4 align-top">
        <div class="flex items-center space-x-3">
          <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div class="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300" style="width: ${course.progress_percent || 0}%"></div>
          </div>
          <span class="text-base text-gray-600 dark:text-gray-400 min-w-[45px] font-medium">${course.progress_percent || 0}%</span>
        </div>
      </td>
    `;

    // Status
    const statusCell = `
      <td class="px-4 py-4 align-top text-center">
        ${course.status_kelulusan ?
        (() => {
          const isLulus = course.status_kelulusan.toLowerCase().includes('lulus');
          return `<span class="inline-flex items-center px-3 py-1.5 rounded-lg text-base font-medium ${isLulus
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }">
              ${course.status_kelulusan}
            </span>`;
        })()
        : `<span class="inline-flex items-center px-3 py-1.5 rounded-lg text-base font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
               Berlangsung
             </span>`
      }
      </td>
    `;

    // Actions
    const actionCell = `
      <td class="px-4 py-4 align-top">
        <div class="flex flex-col space-y-2">
          ${course.is_completed && course.score_final_exam !== null ?
        `<button 
              class="print-cert-btn inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium min-w-[120px]"
              data-course="${course.course_id}"
              data-student="${student.student_id}"
              data-class="${this.currentClassId}">
              <i class="fas fa-certificate mr-2"></i>
              Kirim Sertifikat
            </button>` : ''
      }
          ${(course.score_final_exam === null || course.score_final_exam === undefined) && student.email ?
        `<button 
              class="notify-student-btn inline-flex items-center justify-center px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium min-w-[120px]"
              data-email="${student.email}"
              data-name="${student.full_name}"
              data-course="${course.course_id}">
              <i class="fas fa-envelope mr-2"></i>
              Kirim Notifikasi
            </button>` : ''
      }
        </div>
      </td>
    `;

    tr.innerHTML = `${studentInfoCells}${courseCell}${gradeCell}${progressCell}${statusCell}${actionCell}`;
    tbody.appendChild(tr);
    this.attachActionListeners(tr);
  },

  attachActionListeners(row) {
    // Certificate buttons
    row.querySelectorAll(".print-cert-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Mengirim...';

        const payload = {
          course_id: btn.dataset.course,
          student_id: btn.dataset.student,
          class_id: btn.dataset.class,
        };

        try {
          const result = await TeacherGradeModel.sendStudentCertificateByTeacher(payload);
          this.showNotification("✅ Sertifikat berhasil dikirim ke email siswa", "success");
        } catch (err) {
          this.showNotification(`❌ Gagal mengirim sertifikat: ${err.message}`, "error");
        } finally {
          btn.disabled = false;
          btn.innerHTML = originalText;
        }
      });
    });

    // Notification buttons  
    row.querySelectorAll(".notify-student-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const email = btn.dataset.email;
        const name = btn.dataset.name;
        const courseId = btn.dataset.course;

        try {
          const reason = await promptTextarea(
            `Kirim pesan pengingat untuk ${name}:`,
            'Mohon segera menyelesaikan course untuk mendapatkan sertifikat.'
          );

          if (!reason || reason.trim().length === 0) {
            this.showNotification("❌ Pesan tidak boleh kosong", "error");
            return;
          }

          const originalText = btn.innerHTML;
          btn.disabled = true;
          btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Mengirim...';

          const result = await TeacherGradeModel.notifyStudent({
            email, name, reason, course_id: courseId
          });

          this.showNotification("✅ Notifikasi berhasil dikirim ke email siswa", "success");
        } catch (err) {
          this.showNotification(`❌ Gagal mengirim notifikasi: ${err.message}`, "error");
        } finally {
          btn.disabled = false;
          btn.innerHTML = originalText;
        }
      });
    });
  },

  updateStats() {
    const statsContainer = document.getElementById("class-stats");
    const headerCount = document.getElementById("header-student-count");

    const totalStudents = this.filteredData.length;
    const completedStudents = this.filteredData.filter(s =>
      s.courses?.some(c => c.is_completed)
    ).length;

    // Calculate average score for completed courses
    let totalScores = 0;
    let scoreCount = 0;
    this.filteredData.forEach(s => {
      s.courses?.forEach(c => {
        if (c.score_final_exam !== null && c.score_final_exam !== undefined) {
          totalScores += c.score_final_exam;
          scoreCount++;
        }
      });
    });
    const averageScore = scoreCount > 0 ? (totalScores / scoreCount).toFixed(1) : 0;

    // Update header count
    if (headerCount) {
      headerCount.textContent = totalStudents;
    }

    if (statsContainer) {
      statsContainer.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-100 text-sm font-medium">Siswa Selesai</p>
                <p class="text-3xl font-bold">${completedStudents}</p>
                <p class="text-green-100 text-sm">dari ${totalStudents} siswa</p>
              </div>
              <i class="fas fa-check-circle text-4xl text-green-200"></i>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-100 text-sm font-medium">Rata-rata Nilai</p>
                <p class="text-3xl font-bold">${averageScore}</p>
                <p class="text-blue-100 text-sm">dari ${scoreCount} nilai</p>
              </div>
              <i class="fas fa-chart-line text-4xl text-blue-200"></i>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-purple-100 text-sm font-medium">Tingkat Kelulusan</p>
                <p class="text-3xl font-bold">${totalStudents > 0 ? Math.round((completedStudents / totalStudents) * 100) : 0}%</p>
                <p class="text-purple-100 text-sm">dari total siswa</p>
              </div>
              <i class="fas fa-graduation-cap text-4xl text-purple-200"></i>
            </div>
          </div>
        </div>
      `;
    }
  },

  exportToExcel(filename, data) {
    if (!data || data.length === 0) {
      this.showNotification("❌ Tidak ada data untuk diekspor", "error");
      return;
    }

    if (typeof XLSX === 'undefined') {
      this.showNotification("⚠️ Sedang memuat library Excel...", "warning");
      setTimeout(() => this.exportToExcel(filename, data), 2000);
      return;
    }

    try {
      const excelData = [];

      data.forEach((student) => {
        student.courses.forEach((course) => {
          excelData.push({
            "Nama Siswa": student.full_name,
            "NIM": student.nim,
            "Program Studi": student.program_studi,
            "Judul Course": course.course_title,
            "Nilai Akhir": course.score_final_exam !== null ? course.score_final_exam : "-",
            "Progress (%)": course.progress_percent || 0,
            "Status": course.is_completed ? "Selesai" : "Berlangsung",
            "Kelulusan": course.status_kelulusan || "Menunggu"
          });
        });
      });

      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();

      // Set column widths
      ws['!cols'] = [
        { wch: 25 }, // Nama Siswa
        { wch: 15 }, // NIM
        { wch: 25 }, // Program Studi
        { wch: 40 }, // Judul Course
        { wch: 12 }, // Nilai Akhir
        { wch: 12 }, // Progress
        { wch: 15 }, // Status
        { wch: 15 }  // Kelulusan
      ];

      XLSX.utils.book_append_sheet(wb, ws, "Data Nilai Siswa");
      XLSX.writeFile(wb, filename);

      this.showNotification(`✅ File Excel berhasil diunduh: ${filename}`, "success");
    } catch (error) {
      console.error("Export error:", error);
      this.showNotification("❌ Gagal mengekspor file Excel", "error");
    }
  },

  showNotification(message, type = "info") {
    // Remove existing notifications
    document.querySelectorAll('.notification-toast').forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification-toast fixed top-6 right-6 z-50 p-4 rounded-xl shadow-2xl transform transition-all duration-300 translate-x-full max-w-md`;

    let bgColor, textColor, icon;
    switch (type) {
      case 'success':
        bgColor = 'bg-green-500';
        textColor = 'text-white';
        icon = 'fas fa-check-circle';
        break;
      case 'error':
        bgColor = 'bg-red-500';
        textColor = 'text-white';
        icon = 'fas fa-exclamation-circle';
        break;
      case 'warning':
        bgColor = 'bg-yellow-500';
        textColor = 'text-white';
        icon = 'fas fa-exclamation-triangle';
        break;
      default:
        bgColor = 'bg-blue-500';
        textColor = 'text-white';
        icon = 'fas fa-info-circle';
    }

    notification.className += ` ${bgColor} ${textColor}`;
    notification.innerHTML = `
      <div class="flex items-start space-x-3">
        <i class="${icon} text-xl mt-0.5"></i>
        <div class="flex-1">
          <p class="font-medium text-base leading-relaxed">${message}</p>
        </div>
        <button class="hover:bg-black hover:bg-opacity-10 rounded-lg p-1 transition-colors" onclick="this.parentElement.parentElement.remove()">
          <i class="fas fa-times text-lg"></i>
        </button>
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.remove('translate-x-full'), 100);
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }
};

export default TeacherGradePresenter;