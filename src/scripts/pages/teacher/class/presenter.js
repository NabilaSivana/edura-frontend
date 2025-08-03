// File: routes/class/presenter.js - Fixed Version with Proper Error Boundary
import { getLoadingAnimation, hideLoadingOverlay, showLoadingOverlay } from "../../../utils/loading.js";
import TeacherClassModel from "./model.js";

const TeacherClassPresenter = {
  classes: [],
  filteredClasses: [],
  currentView: 'grid',
  searchTimeout: null,
  isLoading: false,

  async init() {
    this.setupEventListeners();
    this.setupSearch();
    await this.loadClasses();
  },

  // 🛡️ Safe appendChild utility
  safeAppendChild(parent, child) {
    if (!parent || !child) {
      console.warn("safeAppendChild: parent or child is null/undefined", { parent, child });
      return false;
    }

    if (!(parent instanceof Node)) {
      console.warn("safeAppendChild: parent is not a Node", parent);
      return false;
    }

    if (!(child instanceof Node)) {
      console.warn("safeAppendChild: child is not a Node", child);
      return false;
    }

    try {
      parent.appendChild(child);
      return true;
    } catch (error) {
      console.error("safeAppendChild: Failed to append child", error);
      return false;
    }
  },

  // 🛡️ Safe DOM removal utility
  safeRemoveElement(element) {
    if (element && element.parentNode) {
      try {
        element.parentNode.removeChild(element);
        return true;
      } catch (error) {
        console.warn("Failed to remove element safely:", error);
        // Fallback: try using remove() method
        if (element.remove) {
          element.remove();
          return true;
        }
      }
    }
    return false;
  },

  // 🛡️ Safe modal close utility
  createSafeCloseFunction(modal, onClose = null) {
    return () => {
      try {
        if (modal && document.body.contains(modal)) {
          modal.classList.add('animate-slide-up');
          setTimeout(() => {
            this.safeRemoveElement(modal);
            document.body.style.overflow = '';
            if (onClose) onClose();
          }, 300);
        } else {
          document.body.style.overflow = '';
          if (onClose) onClose();
        }
      } catch (error) {
        console.warn("Error closing modal:", error);
        document.body.style.overflow = '';
        if (onClose) onClose();
      }
    };
  },

  // 🔄 Enhanced Refresh with better error handling
  async refreshAllData() {
    if (this.isLoading) {
      this.showToast("Refresh sedang berlangsung...", "info");
      return;
    }

    //console.log("🔄 Refreshing all class data...");
    this.isLoading = true;

    try {
      this.showRefreshNotification("🔄 Menyegarkan data kelas...", "info");
      TeacherClassModel.clearCache();
      await this.loadClasses(true);
      this.showRefreshNotification("✅ Data kelas berhasil disegarkan!", "success");
      //console.log("✅ All class data refreshed successfully");
    } catch (error) {
      console.error("❌ Failed to refresh class data:", error);
      this.showRefreshNotification("❌ Gagal menyegarkan data. Coba lagi nanti.", "error");
      throw error;
    } finally {
      this.isLoading = false;
    }
  },

  // 🔄 Enhanced notification system with safe removal
  showRefreshNotification(message, type = "info") {
    const existing = document.getElementById("refresh-notification");
    if (existing) {
      this.safeRemoveElement(existing);
    }

    const notification = document.createElement("div");
    notification.id = "refresh-notification";
    notification.className = "fixed top-4 right-4 z-50 max-w-sm";

    const bgColor = {
      success: "bg-green-500",
      error: "bg-red-500",
      info: "bg-blue-500"
    }[type];

    notification.innerHTML = `
      <div class="${bgColor} text-white px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-0">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium">${message}</span>
          <button class="ml-3 text-white hover:text-gray-200 transition-colors" aria-label="Tutup notifikasi">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    `;

    // Add safe close handler
    const closeBtn = notification.querySelector('button');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.safeRemoveElement(notification);
      });
    }

    document.body.appendChild(notification);

    if (type !== "info") {
      setTimeout(() => {
        if (document.body.contains(notification)) {
          notification.style.transform = "translateX(100%)";
          setTimeout(() => {
            this.safeRemoveElement(notification);
          }, 300);
        }
      }, 3000);
    }
  },

  setupEventListeners() {
    const form = document.getElementById("create-class-form");
    if (form) {
      form.addEventListener("submit", (e) => this.handleCreateClass(e));
    }
  },

  setupSearch() {
    const searchInput = document.getElementById("search-input");
    if (!searchInput) return;

    searchInput.addEventListener("input", (e) => {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.filterClasses(e.target.value);
      }, 300);
    });
  },

  filterClasses(searchTerm) {
    const term = searchTerm.toLowerCase().trim();

    if (!term) {
      this.filteredClasses = [...this.classes];
    } else {
      this.filteredClasses = this.classes.filter(cls =>
        cls.name?.toLowerCase().includes(term) ||
        cls.class_code?.toLowerCase().includes(term) ||
        cls.perguruan_tinggi?.toLowerCase().includes(term)
      );
    }

    this.renderClasses();
  },

  async loadClasses(forceRefresh = false) {
    if (this.isLoading && !forceRefresh) return;

    this.isLoading = true;
    const loadingContainer = document.getElementById("class-loading");
    const listContainer = document.getElementById("class-list");
    const emptyState = document.getElementById("empty-state");
    const searchNotFound = document.getElementById("search-not-found");

    // Show loading state
    if (loadingContainer) {
      loadingContainer.classList.remove("hidden");
      loadingContainer.innerHTML = getLoadingAnimation('cards', {
        title: forceRefresh ? 'Menyegarkan Kelas' : 'Memuat Kelas',
        subtitle: forceRefresh ? 'Mengambil data terbaru dari server...' : 'Mengambil data kelas dan mahasiswa...'
      });
    }

    if (listContainer) listContainer.innerHTML = "";
    emptyState?.classList.add("hidden");
    searchNotFound?.classList.add("hidden");

    try {
      this.classes = await TeacherClassModel.getClasses(forceRefresh);
      this.filteredClasses = [...this.classes];

      if (!this.classes.length) {
        emptyState?.classList.remove("hidden");
        this.updateStats(0, 0, 0);
        return;
      }

      // Load students for each class with better error handling
      let totalStudents = 0;
      const classPromises = this.classes.map(async (cls) => {
        try {
          cls.students = await TeacherClassModel.getClassStudents(cls.id, forceRefresh);
          return cls.students?.length || 0;
        } catch (error) {
          console.warn(`Failed to load students for class ${cls.id}:`, error);
          cls.students = [];
          return 0;
        }
      });

      const studentCounts = await Promise.all(classPromises);
      totalStudents = studentCounts.reduce((sum, count) => sum + count, 0);

      const avgStudents = this.classes.length > 0
        ? Math.round(totalStudents / this.classes.length)
        : 0;

      this.updateStats(this.classes.length, totalStudents, avgStudents);
      this.renderClasses();

    } catch (error) {
      console.error("Error loading classes:", error);
      if (listContainer) {
        listContainer.innerHTML = this.renderErrorState();
      }
    } finally {
      loadingContainer?.classList.add("hidden");
      this.isLoading = false;
    }
  },

  renderClasses() {
    const listContainer = document.getElementById("class-list");
    const emptyState = document.getElementById("empty-state");
    const searchNotFound = document.getElementById("search-not-found");
    const searchInput = document.getElementById("search-input");

    if (!listContainer) return;

    // Clear previous content
    listContainer.innerHTML = "";

    // Handle empty search results
    if (this.filteredClasses.length === 0 && searchInput?.value.trim()) {
      searchNotFound?.classList.remove("hidden");
      emptyState?.classList.add("hidden");
      return;
    } else {
      searchNotFound?.classList.add("hidden");
    }

    // Render classes with staggered animation
    this.filteredClasses.forEach((cls, index) => {
      try {
        // Validate class object
        if (!this.validateClassObject(cls)) {
          console.warn("Skipping invalid class object:", cls);
          return;
        }

        const card = this.createClassCard(cls);

        // Validate that card is a valid Node
        if (!card || !(card instanceof Node)) {
          console.warn("createClassCard returned invalid Node:", card);
          return;
        }

        // Safe appendChild
        this.safeAppendChild(listContainer, card);

        // Staggered animation with safe style setting
        setTimeout(() => {
          this.safeSetStyle(card, 'opacity', '1');
          this.safeSetStyle(card, 'transform', 'translateY(0)');
        }, index * 100);
      } catch (error) {
        console.error(`Error rendering class card at index ${index}:`, error);
      }
    });
  },

  updateStats(totalClasses, totalStudents, avgStudents) {
    this.animateCounter("total-classes", totalClasses, " Kelas");
    this.animateCounter("total-students", totalStudents, " Mahasiswa");
    this.animateCounter("avg-students", avgStudents, " Mhs/Kelas");
  },

  animateCounter(elementId, target, suffix = "") {
    const element = document.getElementById(elementId);
    if (!element) return;

    const duration = 1000;
    const steps = 60;
    const stepValue = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      current += stepValue;
      step++;

      if (step >= steps) {
        current = target;
        clearInterval(timer);
      }

      element.textContent = Math.round(current) + suffix;
    }, duration / steps);
  },

  async handleCreateClass(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const messageEl = document.getElementById("form-message");
    const nameInput = document.getElementById("name");
    const name = nameInput?.value.trim();

    if (!name) {
      this.showMessage(messageEl, 'error', '❌ Nama kelas tidak boleh kosong');
      return;
    }

    // Prevent double submission
    if (submitBtn.disabled) return;

    submitBtn.disabled = true;
    const originalContent = submitBtn.innerHTML;

    submitBtn.innerHTML = `
      <svg class="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>Membuat...</span>
    `;

    try {
      await TeacherClassModel.createClass({ name });
      this.showMessage(messageEl, 'success', '✅ Kelas berhasil dibuat!');
      form.reset();

      setTimeout(() => {
        const container = document.getElementById("create-class-form-container");
        container?.classList.add("hidden");
        messageEl?.classList.add("hidden");
      }, 2000);

      await this.loadClasses();

    } catch (error) {
      console.error("Error creating class:", error);
      this.showMessage(messageEl, 'error', '❌ Gagal membuat kelas. Pastikan profil guru sudah lengkap.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalContent;
    }
  },

  showMessage(element, type, message) {
    if (!element) return;

    element.classList.remove("hidden");
    const bgClass = type === 'success'
      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';

    element.className = `mt-4 p-4 rounded-xl flex items-center gap-3 ${bgClass}`;
    element.textContent = message;
  },

  // ✅ FIXED: Synchronous createClassCard method
  createClassCard(cls) {
    try {
      const wrapper = document.createElement("div");
      const isListView = document.getElementById("class-list")?.classList.contains("space-y-4");

      wrapper.style.opacity = "0";
      wrapper.style.transform = "translateY(20px)";
      wrapper.style.transition = "all 0.3s ease-out";

      wrapper.className = "class-card bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group";

      wrapper.innerHTML = isListView
        ? this.renderListView(cls)
        : this.renderGridView(cls);

      this.attachEventListeners(wrapper, cls);
      return wrapper;
    } catch (error) {
      console.error("Error in createClassCard:", error);
      // Return a basic error element instead of throwing
      const errorElement = document.createElement("div");
      errorElement.className = "error-card p-4 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl";
      errorElement.textContent = "Error creating class card";
      return errorElement;
    }
  },

  renderGridView(cls) {
    try {
      // Validate input
      if (!cls || typeof cls !== 'object') {
        console.warn("renderGridView: Invalid class object", cls);
        return '<div class="error-card p-4 text-red-500">Error: Invalid class data</div>';
      }

      const studentCount = cls.students?.length || 0;
      const gradientColor = this.getGradientByStudentCount(studentCount);
      const className = cls.name || 'Nama Kelas';
      const classCode = cls.class_code || 'N/A';
      const university = cls.perguruan_tinggi || 'Perguruan Tinggi';

      return `
        <div class="relative h-32 bg-gradient-to-br ${gradientColor} p-6 overflow-hidden">
          <div class="absolute inset-0 bg-black/10"></div>
          <div class="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div class="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          
          <div class="relative z-10">
            <div class="flex items-start justify-between">
              <h3 class="class-name text-xl font-bold text-white truncate flex-1" title="${className}">
                ${className}
              </h3>
              <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button class="edit-btn p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors" title="Edit">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button class="delete-btn p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors" title="Hapus">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <div class="mt-3 flex items-center gap-2">
              <button class="copy-code-btn px-3 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm 
                rounded-lg text-white text-sm font-mono transition-all flex items-center gap-2" 
                data-code="${classCode}" title="Salin kode kelas">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                <span class="class-code">${classCode}</span>
              </button>
            </div>
          </div>
        </div>

        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <p class="text-sm text-gray-600 dark:text-gray-400 truncate" title="${university}">
              🏫 ${university}
            </p>
            <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium 
              text-gray-700 dark:text-gray-300">
              👥 ${studentCount} Mhs
            </span>
          </div>

          ${this.renderStudentPreview(cls)}

          <div class="mt-4 flex gap-2">
            ${studentCount > 0 ? `
              <button class="view-students-btn flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 
                text-white rounded-xl font-medium transition-all text-sm flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                Lihat Semua
              </button>
            ` : `
              <button class="invite-btn flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 
                hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all 
                text-sm flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M12 4v16m8-8H4"></path>
                </svg>
                Undang Mahasiswa
              </button>
            `}
          </div>
        </div>
      `;
    } catch (error) {
      console.error("Error in renderGridView:", error);
      return '<div class="error-card p-4 text-red-500">Error: Failed to render class card</div>';
    }
  },

  renderListView(cls) {
    try {
      // Validate input
      if (!cls || typeof cls !== 'object') {
        console.warn("renderListView: Invalid class object", cls);
        return '<div class="error-card p-4 text-red-500">Error: Invalid class data</div>';
      }

      const studentCount = cls.students?.length || 0;
      const gradientColor = this.getGradientByStudentCount(studentCount);
      const className = cls.name || 'Nama Kelas';
      const classCode = cls.class_code || 'N/A';
      const university = cls.perguruan_tinggi || 'Perguruan Tinggi';

      return `
        <div class="flex flex-col sm:flex-row">
          <div class="w-full sm:w-2 h-24 sm:h-auto bg-gradient-to-b sm:bg-gradient-to-b ${gradientColor}"></div>
          
          <div class="flex-1 p-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="class-name text-xl font-bold text-gray-800 dark:text-white">${className}</h3>
                  <button class="copy-code-btn px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 
                    dark:hover:bg-gray-600 rounded-lg text-sm font-mono transition-all flex items-center gap-2" 
                    data-code="${classCode}" title="Salin kode kelas">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                    <span class="class-code">${classCode}</span>
                  </button>
                </div>
                
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">🏫 ${university}</p>
                
                <div class="flex items-center gap-4">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    👥 ${studentCount} Mahasiswa
                  </span>
                  ${studentCount > 0 ? `
                    <div class="flex -space-x-2">
                      ${(cls.students || []).slice(0, 5).map(s => {
        const studentName = s?.full_name || 'Mahasiswa';
        const studentInitial = studentName.charAt(0).toUpperCase();
        const avatarGradient = this.getAvatarGradient(s?.id);
        return `
                          <div class="w-8 h-8 rounded-full bg-gradient-to-br ${avatarGradient} 
                            flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-gray-800"
                            title="${studentName}">
                            ${studentInitial}
                          </div>
                        `;
      }).join('')}
                      ${studentCount > 5 ? `
                        <div class="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center 
                          justify-center text-xs font-bold border-2 border-white dark:border-gray-800">
                          +${studentCount - 5}
                        </div>
                      ` : ''}
                    </div>
                  ` : `
                    <span class="text-sm text-gray-500 dark:text-gray-400 italic">
                      Belum ada mahasiswa
                    </span>
                  `}
                </div>
              </div>

              <div class="flex gap-2">
                ${studentCount > 0 ? `
                  <button class="view-students-btn px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white 
                    rounded-xl font-medium transition-all text-sm">
                    Lihat Detail
                  </button>
                ` : `
                  <button class="invite-btn px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 
                    hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all text-sm">
                    Undang
                  </button>
                `}
                <button class="edit-btn p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 
                  dark:hover:bg-gray-700 rounded-lg transition-colors" title="Edit">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button class="delete-btn p-2 text-gray-600 dark:text-gray-400 hover:bg-red-50 
                  dark:hover:bg-red-900/20 hover:text-red-600 rounded-lg transition-colors" title="Hapus">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    } catch (error) {
      console.error("Error in renderListView:", error);
      return '<div class="error-card p-4 text-red-500">Error: Failed to render class list view</div>';
    }
  },

  renderStudentPreview(cls) {
    try {
      // Validate input
      if (!cls || typeof cls !== 'object') {
        console.warn("renderStudentPreview: Invalid class object", cls);
        return '<div class="text-center py-4 text-red-500">Error: Invalid class data</div>';
      }

      const students = Array.isArray(cls.students) ? cls.students : [];

      if (students.length === 0) {
        return `
          <div class="text-center py-8 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
            <div class="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full 
              flex items-center justify-center mb-3">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Belum ada mahasiswa</p>
            <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Bagikan kode kelas untuk mengundang
            </p>
          </div>
        `;
      }

      const displayStudents = students.slice(0, 3);
      return `
        <div class="space-y-2">
          ${displayStudents.map((student) => {
        if (!student || typeof student !== 'object') {
          console.warn("Invalid student object:", student);
          return '';
        }

        const studentName = student.full_name || 'Nama Mahasiswa';
        const studentNim = student.nim || 'NIM';
        const studentProgram = student.program_studi || 'Program Studi';
        const studentId = student.id || Math.random();
        const studentInitial = studentName.charAt(0).toUpperCase();
        const avatarGradient = this.getAvatarGradient(studentId);

        return `
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 
                rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br ${avatarGradient} 
                    flex items-center justify-center text-white font-bold text-sm">
                    ${studentInitial}
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="font-medium text-gray-800 dark:text-gray-200 truncate">
                      ${studentName}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      ${studentNim} • ${studentProgram}
                    </p>
                  </div>
                </div>
                <button class="kick-btn opacity-0 group-hover:opacity-100 p-1.5 text-red-500 
                  hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                  data-sid="${studentId}" title="Keluarkan">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            `;
      }).filter(html => html !== '').join('')}
          
          ${students.length > 3 ? `
            <div class="text-center pt-2">
              <span class="text-sm text-gray-500 dark:text-gray-400">
                +${students.length - 3} mahasiswa lainnya
              </span>
            </div>
          ` : ''}
        </div>
      `;
    } catch (error) {
      console.error("Error in renderStudentPreview:", error);
      return '<div class="text-center py-4 text-red-500">Error: Failed to render student preview</div>';
    }
  },

  getGradientByStudentCount(count) {
    if (count === 0) return "from-gray-400 to-gray-500";
    if (count < 10) return "from-blue-500 to-blue-600";
    if (count < 20) return "from-green-500 to-emerald-600";
    if (count < 30) return "from-purple-500 to-purple-600";
    return "from-pink-500 to-rose-600";
  },

  getAvatarGradient(id) {
    const gradients = [
      "from-red-400 to-red-600",
      "from-blue-400 to-blue-600",
      "from-green-400 to-green-600",
      "from-purple-400 to-purple-600",
      "from-pink-400 to-pink-600",
      "from-indigo-400 to-indigo-600",
      "from-yellow-400 to-yellow-600",
      "from-teal-400 to-teal-600",
    ];
    return gradients[(id || 0) % gradients.length];
  },

  // Enhanced clipboard copy with better error handling
  copyToClipboard(text, successCallback, errorCallback) {
    if (navigator.clipboard && window.isSecureContext) {
      // Modern async clipboard API
      navigator.clipboard.writeText(text)
        .then(() => successCallback && successCallback())
        .catch(() => this.fallbackCopyToClipboard(text, successCallback, errorCallback));
    } else {
      // Fallback for older browsers
      this.fallbackCopyToClipboard(text, successCallback, errorCallback);
    }
  },

  fallbackCopyToClipboard(text, successCallback, errorCallback) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);

    try {
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      if (successful && successCallback) {
        successCallback();
      } else if (errorCallback) {
        errorCallback();
      } else {
        this.showToast(`Gagal menyalin. Kode: ${text}`, "error");
      }
    } catch (err) {
      if (errorCallback) {
        errorCallback();
      } else {
        this.showToast(`Gagal menyalin. Kode: ${text}`, "error");
      }
    } finally {
      this.safeRemoveElement(textArea);
    }
  },

  attachEventListeners(wrapper, cls) {
    // Copy code button
    const copyCodeBtn = wrapper.querySelector(".copy-code-btn");
    if (copyCodeBtn) {
      copyCodeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const code = e.currentTarget.dataset.code;
        if (!code) {
          this.showToast("Kode kelas tidak tersedia", "error");
          return;
        }

        const originalContent = e.currentTarget.innerHTML;

        this.copyToClipboard(code, () => {
          e.currentTarget.innerHTML = `
            <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Disalin!
          `;
          setTimeout(() => {
            e.currentTarget.innerHTML = originalContent;
          }, 2000);
        });
      });
    }

    // Edit button
    const editBtn = wrapper.querySelector(".edit-btn");
    if (editBtn) {
      editBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        try {
          const result = await this.showEditDialog(cls);
          if (result) {
            await this.loadClasses();
          }
        } catch (error) {
          console.error("Error in edit dialog:", error);
          this.showToast("Gagal membuka dialog edit", "error");
        }
      });
    }

    // Delete button
    const deleteBtn = wrapper.querySelector(".delete-btn");
    if (deleteBtn) {
      deleteBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        try {
          const result = await this.showConfirmDialog(
            "Hapus Kelas",
            `Apakah Anda yakin ingin menghapus kelas "${cls.name || 'ini'}"? Tindakan ini tidak dapat dibatalkan.`,
            "Hapus",
            "Batal",
            true
          );

          if (result) {
            showLoadingOverlay("Menghapus kelas...");
            try {
              await TeacherClassModel.deleteClass(cls.id);
              await this.loadClasses();
              this.showToast("Kelas berhasil dihapus", "success");
            } catch (error) {
              console.error("Error deleting class:", error);
              this.showToast("Gagal menghapus kelas", "error");
            } finally {
              hideLoadingOverlay();
            }
          }
        } catch (error) {
          console.error("Error in delete confirmation:", error);
          this.showToast("Gagal membuka dialog konfirmasi", "error");
        }
      });
    }

    // View students button
    const viewStudentsBtn = wrapper.querySelector(".view-students-btn");
    if (viewStudentsBtn) {
      viewStudentsBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.showStudentsModal(cls);
      });
    }

    // Invite button
    const inviteBtn = wrapper.querySelector(".invite-btn");
    if (inviteBtn) {
      inviteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.showInviteModal(cls);
      });
    }

    // Kick student buttons
    const kickBtns = wrapper.querySelectorAll(".kick-btn");
    kickBtns.forEach(btn => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const studentId = btn.dataset.sid;
        const student = cls.students?.find(s => s.id == studentId);

        if (!student) {
          this.showToast("Data mahasiswa tidak ditemukan", "error");
          return;
        }

        try {
          const result = await this.showConfirmDialog(
            "Keluarkan Mahasiswa",
            `Apakah Anda yakin ingin mengeluarkan "${student.full_name || 'mahasiswa ini'}" dari kelas ini?`,
            "Keluarkan",
            "Batal",
            true
          );

          if (result) {
            showLoadingOverlay("Mengeluarkan mahasiswa...");
            try {
              await TeacherClassModel.removeStudent(cls.id, studentId);
              await this.loadClasses();
              this.showToast("Mahasiswa berhasil dikeluarkan", "success");
            } catch (error) {
              console.error("Error removing student:", error);
              this.showToast("Gagal mengeluarkan mahasiswa", "error");
            } finally {
              hideLoadingOverlay();
            }
          }
        } catch (error) {
          console.error("Error in kick confirmation:", error);
          this.showToast("Gagal membuka dialog konfirmasi", "error");
        }
      });
    });
  },

  // Enhanced Students Modal with safe DOM handling
  showStudentsModal(cls) {
    const modal = document.createElement("div");
    modal.className = "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto";

    const students = cls.students || [];
    const studentCount = students.length;

    modal.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-2xl max-w-6xl w-full my-8 max-h-[95vh] flex flex-col shadow-2xl transform animate-slide-down overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r ${this.getGradientByStudentCount(studentCount)} p-6 text-white relative z-10">
          <div class="absolute inset-0 bg-black/10"></div>
          <div class="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          
          <div class="relative">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="text-2xl md:text-3xl font-bold mb-2">${cls.name || 'Kelas'}</h3>
                <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-white/90 text-sm md:text-base">
                  <span class="flex items-center gap-2">
                    <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                    </svg>
                    Kode: ${cls.class_code || 'N/A'}
                  </span>
                  <span class="flex items-center gap-2">
                    <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    ${cls.perguruan_tinggi || 'Perguruan Tinggi'}
                  </span>
                  <span class="flex items-center gap-2">
                    <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    ${studentCount} Mahasiswa
                  </span>
                </div>
              </div>
              <button class="close-btn p-2 md:p-3 hover:bg-white/20 rounded-xl transition-colors shrink-0">
                <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div id="students-content" class="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-800/50">
          ${studentCount > 0 ? this.renderStudentsList(students, cls) : this.renderEmptyStudents(cls)}
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Total: <span class="font-semibold">${studentCount} mahasiswa</span>
            </div>
            <div class="flex gap-3 w-full sm:w-auto">
              <button id="invite-more-btn" class="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Undang Lagi
              </button>
              <button class="close-btn flex-1 sm:flex-none px-6 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-all">
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.attachStudentsModalEvents(modal, cls);

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    // Create safe close function
    const closeModal = this.createSafeCloseFunction(modal);

    // Close button events
    modal.querySelectorAll('.close-btn').forEach(btn => {
      btn.addEventListener('click', closeModal);
    });

    // Click outside to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // ESC key to close
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  },

  renderStudentsList(students, cls) {
    if (!students || students.length === 0) {
      return this.renderEmptyStudents(cls);
    }

    return `
      <div class="h-full overflow-y-auto">
        <div id="students-list" class="p-4 md:p-6 space-y-4">
          ${students.map((student) => `
            <div class="student-item bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1" data-student-id="${student.id || ''}">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4 flex-1 min-w-0">
                  <!-- Avatar -->
                  <div class="relative flex-shrink-0">
                    <div class="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${this.getAvatarGradient(student.id)} flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg">
                      ${(student.full_name || 'M').charAt(0).toUpperCase()}
                    </div>
                    <div class="absolute -bottom-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full flex items-center justify-center">
                      <svg class="w-2 h-2 md:w-3 md:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  </div>

                  <!-- Student Info -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between mb-1">
                      <h4 class="text-lg font-bold text-gray-800 dark:text-white truncate">${student.full_name || 'Nama Mahasiswa'}</h4>
                      <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs font-medium rounded-full ml-2 flex-shrink-0">
                        Aktif
                      </span>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                        </svg>
                        <span class="font-medium truncate">${student.nim || 'NIM tidak tersedia'}</span>
                      </div>
                      
                      <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                        <span class="truncate">${student.program_studi || 'Program Studi'}</span>
                      </div>
                    </div>

                    <!-- Contact Info -->
                    ${student.email ? `
                      <div class="mt-3 flex items-center gap-2 text-sm">
                        <a href="mailto:${student.email}" class="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline truncate">
                          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                          </svg>
                          <span class="truncate">${student.email}</span>
                        </a>
                      </div>
                    ` : ''}
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center gap-2 ml-4">
                  ${student.email ? `
                    <a href="mailto:${student.email}" class="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" title="Kirim Email">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </a>
                  ` : ''}
                  
                  <button class="remove-student-btn p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" data-student-id="${student.id || ''}" title="Keluarkan dari Kelas">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderEmptyStudents(cls) {
    return `
      <div class="flex-1 flex items-center justify-center p-8 md:p-12">
        <div class="text-center max-w-md">
          <div class="w-24 h-24 md:w-32 md:h-32 mx-auto bg-gradient-to-br ${this.getGradientByStudentCount(0)} rounded-full flex items-center justify-center mb-6 shadow-2xl">
            <svg class="w-12 h-12 md:w-16 md:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
          </div>
          
          <h4 class="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Belum Ada Mahasiswa
          </h4>
          
          <p class="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            Kelas "${cls.name || 'ini'}" belum memiliki mahasiswa. Bagikan kode kelas <strong>${cls.class_code || 'N/A'}</strong> 
            kepada mahasiswa untuk bergabung.
          </p>
          
          <div class="space-y-3">
            <button id="share-code-btn" class="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
              </svg>
              Bagikan Kode Kelas
            </button>
          </div>
        </div>
      </div>
    `;
  },

  attachStudentsModalEvents(modal, cls) {
    // Invite more students
    const inviteBtn = modal.querySelector("#invite-more-btn");
    if (inviteBtn) {
      inviteBtn.addEventListener("click", () => {
        const closeModal = this.createSafeCloseFunction(modal, () => {
          this.showInviteModal(cls);
        });
        closeModal();
      });
    }

    // Share code button (empty state)
    const shareCodeBtn = modal.querySelector("#share-code-btn");
    if (shareCodeBtn) {
      shareCodeBtn.addEventListener("click", () => {
        const closeModal = this.createSafeCloseFunction(modal, () => {
          this.showInviteModal(cls);
        });
        closeModal();
      });
    }

    // Remove student buttons
    const removeStudentBtns = modal.querySelectorAll(".remove-student-btn");
    removeStudentBtns.forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const studentId = btn.dataset.studentId;
        const student = cls.students?.find(s => s.id == studentId);

        if (!student) {
          this.showToast("Data mahasiswa tidak ditemukan", "error");
          return;
        }

        try {
          const result = await this.showConfirmDialog(
            "Keluarkan Mahasiswa",
            `Apakah Anda yakin ingin mengeluarkan "${student.full_name || 'mahasiswa ini'}" dari kelas ini?`,
            "Keluarkan",
            "Batal",
            true
          );

          if (result) {
            try {
              showLoadingOverlay("Mengeluarkan mahasiswa...");
              await TeacherClassModel.removeStudent(cls.id, studentId);

              // Remove from current data
              cls.students = cls.students.filter(s => s.id != studentId);

              // Update modal
              const studentsContent = modal.querySelector("#students-content");
              if (studentsContent && document.body.contains(modal)) {
                studentsContent.innerHTML = cls.students.length > 0 ?
                  this.renderStudentsList(cls.students, cls) :
                  this.renderEmptyStudents(cls);

                // Re-attach events
                this.attachStudentsModalEvents(modal, cls);
              }

              this.showToast("Mahasiswa berhasil dikeluarkan", "success");
            } catch (error) {
              console.error("Error removing student:", error);
              this.showToast("Gagal mengeluarkan mahasiswa", "error");
            } finally {
              hideLoadingOverlay();
            }
          }
        } catch (error) {
          console.error("Error in remove confirmation:", error);
          this.showToast("Gagal membuka dialog konfirmasi", "error");
        }
      });
    });
  },

  // Enhanced Invite Modal with safe DOM handling
  showInviteModal(cls) {
    const modal = document.createElement("div");
    modal.className = "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto";

    // WhatsApp message text
    const whatsappMessage = `Bergabung ke kelas ${cls.name || 'ini'}!
Kode Kelas: ${cls.class_code || 'N/A'}
Silakan masukkan kode ini di aplikasi edura.web.id untuk bergabung.`;

    // WhatsApp URL with encoded message
    const inviteUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;

    modal.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full my-auto shadow-2xl transform animate-slide-down flex flex-col max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r ${this.getGradientByStudentCount(cls.students?.length || 0)} p-6 text-white relative">
        <div class="absolute inset-0 bg-black/10"></div>
        <div class="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div class="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        
        <div class="relative z-10">
          <div class="flex items-start justify-between">
            <div>
              <h3 class="text-xl md:text-2xl font-bold mb-2">🎓 Undang Mahasiswa</h3>
              <p class="text-white/90">Bagikan kelas "${cls.name || 'ini'}" kepada mahasiswa</p>
            </div>
            <button class="close-btn p-2 hover:bg-white/20 rounded-xl transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto">
        <div class="p-6">
          <!-- Class Code Display -->
          <div class="text-center mb-8">
            <div class="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">Kode Kelas</p>
              <div class="text-3xl md:text-4xl font-mono font-bold text-blue-600 dark:text-blue-400 mb-4 tracking-wider">${cls.class_code || 'N/A'}</div>
              <p class="text-xs text-gray-500 dark:text-gray-500">Bagikan kode ini kepada mahasiswa untuk bergabung</p>
            </div>
          </div>

          <!-- Share Options -->
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Cara Berbagi</h4>
            
            <!-- Copy Code -->
            <button id="copy-code-btn" class="w-full flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl transition-all border border-blue-200 dark:border-blue-800 group">
              <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div class="flex-1 text-left">
                <h5 class="font-semibold text-blue-800 dark:text-blue-400">Salin Kode Kelas</h5>
                <p class="text-sm text-blue-600 dark:text-blue-500">Salin kode dan bagikan via pesan atau chat</p>
              </div>
            </button>

            <!-- Share via WhatsApp -->
            <button id="copy-link-btn" class="w-full flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-xl transition-all border border-green-200 dark:border-green-800 group">
              <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                </svg>
              </div>
              <div class="flex-1 text-left">
                <h5 class="font-semibold text-green-800 dark:text-green-400">Bagikan via WhatsApp</h5>
                <p class="text-sm text-green-600 dark:text-green-500">Buka WhatsApp dengan pesan undangan siap kirim</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            💡 <strong>Tips:</strong> Bagikan kode untuk undangan yang mudah
          </div>
          <button class="close-btn px-6 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-all">
            Selesai
          </button>
        </div>
      </div>
    </div>
  `;

    document.body.appendChild(modal);
    this.attachInviteModalEvents(modal, cls, inviteUrl);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Create safe close function
    const closeModal = this.createSafeCloseFunction(modal);

    // Close button events
    modal.querySelectorAll('.close-btn').forEach(btn => {
      btn.addEventListener('click', closeModal);
    });

    // Click outside to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // ESC key to close
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  },

  attachInviteModalEvents(modal, cls, inviteUrl) {
    // Copy code button
    const copyCodeBtn = modal.querySelector("#copy-code-btn");
    if (copyCodeBtn) {
      copyCodeBtn.addEventListener("click", (e) => {
        if (!cls.class_code) {
          this.showToast("Kode kelas tidak tersedia", "error");
          return;
        }

        const btn = e.currentTarget;
        const originalContent = btn.innerHTML;

        this.copyToClipboard(cls.class_code, () => {
          btn.innerHTML = `
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div class="flex-1 text-left">
              <h5 class="font-semibold text-green-800 dark:text-green-400">Berhasil!</h5>
              <p class="text-sm text-green-600 dark:text-green-500">Kode telah disalin</p>
            </div>
          </div>
        `;

          setTimeout(() => {
            if (document.body.contains(modal)) {
              btn.innerHTML = originalContent;
            }
          }, 2000);
        });
      });
    }

    // WhatsApp share button
    const copyLinkBtn = modal.querySelector("#copy-link-btn");
    if (copyLinkBtn) {
      copyLinkBtn.addEventListener("click", (e) => {
        // Open WhatsApp with the invite message
        window.open(inviteUrl, '_blank');

        const btn = e.currentTarget;
        const originalContent = btn.innerHTML;

        // Show success feedback
        btn.innerHTML = `
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div class="flex-1 text-left">
            <h5 class="font-semibold text-green-800 dark:text-green-400">WhatsApp Terbuka!</h5>
            <p class="text-sm text-green-600 dark:text-green-500">Pesan undangan siap untuk dikirim</p>
          </div>
        </div>
      `;

        setTimeout(() => {
          if (document.body.contains(modal)) {
            btn.innerHTML = originalContent;
          }
        }, 2000);
      });
    }
  },
  // Enhanced Edit Dialog with safe DOM handling
  async showEditDialog(cls) {
    return new Promise((resolve) => {
      const modal = document.createElement("div");
      modal.className = "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4";

      modal.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all animate-slide-down">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            Edit Kelas
          </h3>
          
          <form id="edit-class-form">
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nama Kelas
              </label>
              <input
                type="text"
                id="edit-class-name"
                value="${cls.name || ''}"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 
                  rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  transition-all"
                placeholder="Masukkan nama kelas"
                required
                maxlength="100"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Maksimal 100 karakter</p>
            </div>
            
            <div class="flex gap-3">
              <button
                type="submit"
                class="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl 
                  font-medium transition-all flex items-center justify-center gap-2
                  disabled:opacity-50 disabled:cursor-not-allowed"
                id="save-btn"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Simpan
              </button>
              <button
                type="button"
                class="cancel-btn flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 
                  dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 
                  transition-all font-medium"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      `;

      document.body.appendChild(modal);

      const form = modal.querySelector("#edit-class-form");
      const nameInput = modal.querySelector("#edit-class-name");
      const saveBtn = modal.querySelector("#save-btn");

      // Real-time validation
      nameInput.addEventListener('input', () => {
        const value = nameInput.value.trim();
        saveBtn.disabled = !value || value === cls.name;
      });

      // Create safe close function
      const closeModal = this.createSafeCloseFunction(modal);

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const newName = nameInput.value.trim();

        if (newName && newName !== cls.name) {
          const originalSaveBtnContent = saveBtn.innerHTML;
          saveBtn.disabled = true;
          saveBtn.innerHTML = `
            <svg class="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Menyimpan...</span>
          `;

          try {
            await TeacherClassModel.updateClass(cls.id, { name: newName });
            closeModal();
            resolve(true);
          } catch (error) {
            console.error("Error updating class:", error);
            this.showToast("Gagal mengupdate kelas", "error");
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalSaveBtnContent;
          }
        } else {
          closeModal();
          resolve(false);
        }
      });

      modal.querySelector(".cancel-btn").addEventListener('click', () => {
        closeModal();
        resolve(false);
      });

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal();
          resolve(false);
        }
      });

      // ESC key to close
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          closeModal();
          resolve(false);
          document.removeEventListener('keydown', handleEscape);
        }
      };
      document.addEventListener('keydown', handleEscape);

      // Focus and select text
      setTimeout(() => {
        nameInput.focus();
        nameInput.select();
      }, 100);
    });
  },

  // Enhanced Confirm Dialog with safe DOM handling
  async showConfirmDialog(title, message, confirmText, cancelText, isDanger = false) {
    return new Promise((resolve) => {
      const modal = document.createElement("div");
      modal.className = "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4";

      const dangerColor = isDanger ? 'red' : 'blue';
      const warningColor = isDanger ? 'red' : 'yellow';

      modal.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all animate-slide-down">
          <div class="mb-6">
            <div class="w-16 h-16 mx-auto bg-${warningColor}-100 dark:bg-${warningColor}-900/20 
              rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-${warningColor}-600 dark:text-${warningColor}-400" 
                fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-800 dark:text-white text-center mb-3">${title}</h3>
            <p class="text-gray-600 dark:text-gray-400 text-center leading-relaxed">${message}</p>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-3">
            <button class="cancel-btn flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 
              text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 
              dark:hover:bg-gray-600 transition-all font-medium order-2 sm:order-1">
              ${cancelText}
            </button>
            <button class="confirm-btn flex-1 px-4 py-3 bg-${dangerColor}-600 
              hover:bg-${dangerColor}-700 text-white rounded-xl transition-all font-medium
              order-1 sm:order-2 flex items-center justify-center gap-2">
              ${isDanger ? `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              ` : ''}
              ${confirmText}
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      // Create safe close function
      const closeModal = this.createSafeCloseFunction(modal);

      modal.querySelector(".confirm-btn").addEventListener('click', () => {
        closeModal();
        resolve(true);
      });

      modal.querySelector(".cancel-btn").addEventListener('click', () => {
        closeModal();
        resolve(false);
      });

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal();
          resolve(false);
        }
      });

      // ESC key to close
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          closeModal();
          resolve(false);
          document.removeEventListener('keydown', handleEscape);
        }
      };
      document.addEventListener('keydown', handleEscape);

      // Focus confirm button if not dangerous, cancel if dangerous
      setTimeout(() => {
        const focusBtn = isDanger ? modal.querySelector(".cancel-btn") : modal.querySelector(".confirm-btn");
        focusBtn.focus();
      }, 100);
    });
  },

  // Enhanced Toast notification with safe DOM handling
  showToast(message, type = "info", duration = 3000) {
    // Remove existing toasts of the same type
    const existingToasts = document.querySelectorAll(`.toast-${type}`);
    existingToasts.forEach(toast => this.safeRemoveElement(toast));

    const toast = document.createElement("div");
    const icons = {
      success: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>`,
      error: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>`,
      info: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
             </svg>`,
      warning: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>`
    };

    const colors = {
      success: "bg-green-500",
      error: "bg-red-500",
      info: "bg-blue-500",
      warning: "bg-yellow-500"
    };

    toast.className = `toast-${type} fixed bottom-4 right-4 ${colors[type]} text-white px-6 py-4 rounded-xl 
      shadow-lg flex items-center gap-3 z-50 transform translate-y-full transition-all duration-300 max-w-sm`;

    toast.innerHTML = `
      ${icons[type]}
      <span class="font-medium flex-1">${message}</span>
      <button class="ml-2 hover:bg-white/20 rounded-lg p-1 transition-colors" aria-label="Tutup notifikasi">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    `;

    // Add safe close handler
    const closeBtn = toast.querySelector('button');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.safeRemoveElement(toast);
      });
    }

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.style.transform = "translateY(0)";
    }, 100);

    // Auto remove
    setTimeout(() => {
      if (document.body.contains(toast)) {
        toast.style.transform = "translateY(100%)";
        setTimeout(() => {
          this.safeRemoveElement(toast);
        }, 300);
      }
    }, duration);
  },

  // Enhanced error state rendering
  renderErrorState() {
    return `
      <div class="col-span-full text-center py-16">
        <div class="w-20 h-20 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full 
          flex items-center justify-center mb-6">
          <svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-3">
          Gagal Memuat Kelas
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Terjadi kesalahan saat memuat data kelas. Silakan coba lagi atau refresh halaman.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button onclick="TeacherClassPresenter.loadClasses()" 
            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl 
            font-medium transition-all inline-flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Coba Lagi
          </button>
          <button onclick="TeacherClassPresenter.refreshAllData()" 
            class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl 
            font-medium transition-all inline-flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Refresh Data
          </button>
        </div>
      </div>
    `;
  },

  // Enhanced refresh specific class students with safe DOM handling
  async refreshClassStudents(classId) {
    if (this.isLoading) {
      throw new Error("Refresh already in progress");
    }

    try {
      //console.log(`🔄 Refreshing students for class ${classId}...`);
      this.isLoading = true;

      TeacherClassModel.clearClassCache(classId);
      const students = await TeacherClassModel.getClassStudents(classId, true);

      const classObj = this.classes.find(c => c.id === classId);
      if (classObj) {
        classObj.students = students;
      }

      // Update filtered classes as well
      const filteredClassObj = this.filteredClasses.find(c => c.id === classId);
      if (filteredClassObj) {
        filteredClassObj.students = students;
      }

      this.renderClasses();

      //console.log(`✅ Students for class ${classId} refreshed successfully`);
      return students;
    } catch (error) {
      console.error(`❌ Failed to refresh students for class ${classId}:`, error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  },

  // 🛡️ Safe cleanup method
  destroy() {
    try {
      // Clear timeouts
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = null;
      }

      // Remove event listeners safely
      const form = document.getElementById("create-class-form");
      if (form) {
        form.removeEventListener("submit", this.handleCreateClass);
      }

      const searchInput = document.getElementById("search-input");
      if (searchInput) {
        searchInput.removeEventListener("input", this.filterClasses);
      }

      // Clean up any remaining notifications
      const notifications = document.querySelectorAll("#refresh-notification, .toast-success, .toast-error, .toast-info, .toast-warning");
      notifications.forEach(notification => {
        this.safeRemoveElement(notification);
      });

      // Reset body overflow
      document.body.style.overflow = '';

      // Reset properties
      this.classes = [];
      this.filteredClasses = [];
      this.isLoading = false;

      //console.log("🧹 TeacherClassPresenter cleanup completed");
    } catch (error) {
      console.warn("Error during cleanup:", error);
    }
  },

  // 🛡️ Safe initialization check
  isInitialized() {
    return Array.isArray(this.classes) && Array.isArray(this.filteredClasses);
  },

  // 🛡️ Safe DOM query utility
  safeQuerySelector(selector) {
    try {
      return document.querySelector(selector);
    } catch (error) {
      console.warn(`Failed to query selector: ${selector}`, error);
      return null;
    }
  },

  // 🛡️ Safe DOM query all utility
  safeQuerySelectorAll(selector) {
    try {
      return document.querySelectorAll(selector);
    } catch (error) {
      console.warn(`Failed to query selector all: ${selector}`, error);
      return [];
    }
  },

  // 🛡️ Safe element class manipulation
  safeToggleClass(element, className, force = null) {
    if (element && element.classList) {
      try {
        if (force !== null) {
          element.classList.toggle(className, force);
        } else {
          element.classList.toggle(className);
        }
        return true;
      } catch (error) {
        console.warn("Failed to toggle class:", error);
      }
    }
    return false;
  },

  // 🛡️ Safe event listener addition
  safeAddEventListener(element, event, handler, options = false) {
    if (element && typeof element.addEventListener === 'function') {
      try {
        element.addEventListener(event, handler, options);
        return true;
      } catch (error) {
        console.warn("Failed to add event listener:", error);
      }
    }
    return false;
  },

  // 🛡️ Safe event listener removal
  safeRemoveEventListener(element, event, handler, options = false) {
    if (element && typeof element.removeEventListener === 'function') {
      try {
        element.removeEventListener(event, handler, options);
        return true;
      } catch (error) {
        console.warn("Failed to remove event listener:", error);
      }
    }
    return false;
  },

  // 🛡️ Safe innerHTML setting
  safeSetInnerHTML(element, html) {
    if (element) {
      try {
        element.innerHTML = html;
        return true;
      } catch (error) {
        console.warn("Failed to set innerHTML:", error);
        // Fallback: try textContent for security
        try {
          element.textContent = html.replace(/<[^>]*>/g, '');
          return true;
        } catch (fallbackError) {
          console.warn("Failed to set textContent fallback:", fallbackError);
        }
      }
    }
    return false;
  },

  // 🛡️ Safe style setting
  safeSetStyle(element, property, value) {
    if (element && element.style) {
      try {
        element.style[property] = value;
        return true;
      } catch (error) {
        console.warn(`Failed to set style ${property}:`, error);
      }
    }
    return false;
  },

  // 🛡️ Safe attribute setting
  safeSetAttribute(element, attribute, value) {
    if (element && typeof element.setAttribute === 'function') {
      try {
        element.setAttribute(attribute, value);
        return true;
      } catch (error) {
        console.warn(`Failed to set attribute ${attribute}:`, error);
      }
    }
    return false;
  },

  // 🛡️ Safe data attribute getting
  safeGetDataAttribute(element, attribute) {
    if (element && element.dataset) {
      try {
        return element.dataset[attribute];
      } catch (error) {
        console.warn(`Failed to get data attribute ${attribute}:`, error);
      }
    }
    return null;
  },

  // 🛡️ Validate class object
  validateClassObject(cls) {
    if (!cls || typeof cls !== 'object') {
      console.warn("Invalid class object:", cls);
      return false;
    }

    // Check required properties
    const requiredProps = ['id', 'name'];
    for (const prop of requiredProps) {
      if (!cls.hasOwnProperty(prop)) {
        console.warn(`Class object missing required property: ${prop}`, cls);
        return false;
      }
    }

    return true;
  },

  // 🛡️ Validate student object
  validateStudentObject(student) {
    if (!student || typeof student !== 'object') {
      console.warn("Invalid student object:", student);
      return false;
    }

    // Check required properties
    const requiredProps = ['id'];
    for (const prop of requiredProps) {
      if (!student.hasOwnProperty(prop)) {
        console.warn(`Student object missing required property: ${prop}`, student);
        return false;
      }
    }

    return true;
  },

  // 🛡️ Enhanced error boundary - FIXED: Only for async operations
  withErrorBoundary(fn, context = 'Unknown') {
    return async (...args) => {
      try {
        return await fn.apply(this, args);
      } catch (error) {
        console.error(`Error in ${context}:`, error);
        this.showToast(`Terjadi kesalahan: ${error.message || 'Unknown error'}`, "error");

        // Don't rethrow for UI operations, but do for critical operations
        if (context.includes('load') || context.includes('save') || context.includes('delete')) {
          throw error;
        }
      }
    };
  },

  // 🛡️ Memory leak prevention
  preventMemoryLeaks() {
    // Clear any remaining timeouts
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = null;
    }

    // Remove any global event listeners that might have been added
    document.removeEventListener('keydown', this.handleGlobalKeydown);
    window.removeEventListener('beforeunload', this.handleBeforeUnload);

    // Clear any intervals
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  },

  // 🛡️ Global keydown handler for modal closing
  handleGlobalKeydown(e) {
    if (e.key === 'Escape') {
      const modals = document.querySelectorAll('.fixed.inset-0.z-50');
      if (modals.length > 0) {
        const lastModal = modals[modals.length - 1];
        if (lastModal) {
          TeacherClassPresenter.safeRemoveElement(lastModal);
          document.body.style.overflow = '';
        }
      }
    }
  },

  // 🛡️ Before unload handler for cleanup
  handleBeforeUnload() {
    TeacherClassPresenter.destroy();
  },

  // 🛡️ Enhanced initialization with error handling
  async safeInit() {
    try {
      //console.log("🚀 Initializing TeacherClassPresenter...");

      // Add global event listeners
      document.addEventListener('keydown', this.handleGlobalKeydown);
      window.addEventListener('beforeunload', this.handleBeforeUnload);

      await this.init();
      //console.log("✅ TeacherClassPresenter initialized successfully");
    } catch (error) {
      console.error("❌ Failed to initialize TeacherClassPresenter:", error);
      this.showToast("Gagal menginisialisasi aplikasi. Silakan refresh halaman.", "error");
      throw error;
    }
  }
};

// 🛡️ FIXED: Enhanced error handling wrapper - Only for async methods
const asyncMethods = [
  'init', 'refreshAllData', 'loadClasses', 'handleCreateClass',
  'refreshClassStudents', 'showEditDialog', 'showConfirmDialog', 'safeInit'
];

// Only wrap specific async methods, not all methods
asyncMethods.forEach(methodName => {
  if (typeof TeacherClassPresenter[methodName] === 'function') {
    const originalMethod = TeacherClassPresenter[methodName];
    TeacherClassPresenter[methodName] = TeacherClassPresenter.withErrorBoundary(
      originalMethod,
      methodName
    );
  }
});

export default TeacherClassPresenter;