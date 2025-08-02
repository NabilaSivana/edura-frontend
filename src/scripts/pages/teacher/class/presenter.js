
// File: routes/class/presenter.js - Enhanced Version
import { showToastNotification } from "../../../utils/index.js";
import { getLoadingAnimation, hideLoadingOverlay, showLoadingOverlay } from "../../../utils/loading.js";
import TeacherClassModel from "./model.js";

const TeacherClassPresenter = {
  classes: [],
  filteredClasses: [],
  currentView: 'grid',

  async init() {
    this.setupEventListeners();
    this.setupSearch();
    await this.loadClasses();
  },

  setupEventListeners() {
    // Form submission
    const form = document.getElementById("create-class-form");
    form?.addEventListener("submit", (e) => this.handleCreateClass(e));
  },

  setupSearch() {
    const searchInput = document.getElementById("search-input");
    let searchTimeout;

    searchInput?.addEventListener("input", (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.filterClasses(e.target.value);
      }, 300);
    });
  },

  filterClasses(searchTerm) {
    const term = searchTerm.toLowerCase().trim();

    if (!term) {
      this.filteredClasses = this.classes;
    } else {
      this.filteredClasses = this.classes.filter(cls =>
        cls.name.toLowerCase().includes(term) ||
        cls.class_code.toLowerCase().includes(term) ||
        cls.perguruan_tinggi.toLowerCase().includes(term)
      );
    }

    this.renderClasses();
  },

  async loadClasses() {
    const loadingContainer = document.getElementById("class-loading");
    const listContainer = document.getElementById("class-list");
    const emptyState = document.getElementById("empty-state");
    const searchNotFound = document.getElementById("search-not-found");

    // Show loading animation
    loadingContainer.classList.remove("hidden");
    loadingContainer.innerHTML = getLoadingAnimation('cards', {
      title: 'Memuat Kelas',
      subtitle: 'Mengambil data kelas dan mahasiswa...'
    });

    listContainer.innerHTML = "";
    emptyState?.classList.add("hidden");
    searchNotFound?.classList.add("hidden");

    try {
      // Load classes
      this.classes = await TeacherClassModel.getClasses();
      this.filteredClasses = this.classes;

      if (!this.classes.length) {
        emptyState?.classList.remove("hidden");
        this.updateStats(0, 0, 0);
        return;
      }

      // Load students for each class
      let totalStudents = 0;
      for (const cls of this.classes) {
        cls.students = await TeacherClassModel.getClassStudents(cls.id);
        totalStudents += cls.students.length;
      }

      // Calculate average
      const avgStudents = this.classes.length > 0
        ? Math.round(totalStudents / this.classes.length)
        : 0;

      // Update stats with animation
      this.updateStats(this.classes.length, totalStudents, avgStudents);

      // Render classes
      this.renderClasses();

    } catch (error) {
      console.error("Error loading classes:", error);
      listContainer.innerHTML = this.renderErrorState();
    } finally {
      loadingContainer.classList.add("hidden");
    }
  },

  renderClasses() {
    const listContainer = document.getElementById("class-list");
    const emptyState = document.getElementById("empty-state");
    const searchNotFound = document.getElementById("search-not-found");
    const searchInput = document.getElementById("search-input");

    // Clear container
    listContainer.innerHTML = "";

    // Check if search returned no results
    if (this.filteredClasses.length === 0 && searchInput?.value.trim()) {
      searchNotFound.classList.remove("hidden");
      emptyState.classList.add("hidden");
      return;
    } else {
      searchNotFound.classList.add("hidden");
    }

    // Render each class with stagger animation
    this.filteredClasses.forEach((cls, index) => {
      const card = this.createClassCard(cls);
      listContainer.appendChild(card);

      // Add animation with stagger
      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, index * 100);
    });
  },

  updateStats(totalClasses, totalStudents, avgStudents) {
    // Animate counter
    this.animateCounter("total-classes", totalClasses, " Kelas");
    this.animateCounter("total-students", totalStudents, " Mahasiswa");
    this.animateCounter("avg-students", avgStudents, " Mhs/Kelas");
  },

  animateCounter(elementId, target, suffix = "") {
    const element = document.getElementById(elementId);
    if (!element) return;

    const duration = 1000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.round(current) + suffix;
    }, 16);
  },

  async handleCreateClass(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const messageEl = document.getElementById("form-message");
    const nameInput = document.getElementById("name");
    const name = nameInput.value.trim();

    if (!name) return;

    // Loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>Membuat...</span>
    `;

    try {
      await TeacherClassModel.createClass({ name });

      // Success message
      this.showMessage(messageEl, 'success', '✅ Kelas berhasil dibuat!');

      // Reset form
      form.reset();

      // Hide form after delay
      setTimeout(() => {
        document.getElementById("create-class-form-container").classList.add("hidden");
        messageEl.classList.add("hidden");
      }, 2000);

      // Reload classes
      await this.loadClasses();

    } catch (error) {
      console.error("Error creating class:", error);
      this.showMessage(messageEl, 'error', '❌ Gagal membuat kelas. Pastikan profil guru sudah lengkap.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        <span>Buat Kelas</span>
      `;
    }
  },

  showMessage(element, type, message) {
    element.classList.remove("hidden");
    element.className = `mt-4 p-4 rounded-xl flex items-center gap-3 ${type === 'success'
      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      }`;
    element.textContent = message;
  },

  createClassCard(cls) {
    const wrapper = document.createElement("div");
    const isListView = document.getElementById("class-list").classList.contains("space-y-4");

    // Initial state for animation
    wrapper.style.opacity = "0";
    wrapper.style.transform = "translateY(20px)";
    wrapper.style.transition = "all 0.3s ease-out";

    if (isListView) {
      wrapper.className = "bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden";
      wrapper.innerHTML = this.renderListView(cls);
    } else {
      wrapper.className = "bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group";
      wrapper.innerHTML = this.renderGridView(cls);
    }

    this.attachEventListeners(wrapper, cls);
    return wrapper;
  },

  renderGridView(cls) {
    const studentCount = cls.students?.length || 0;
    const gradientColor = this.getGradientByStudentCount(studentCount);

    return `
      <!-- Header dengan gradient -->
      <div class="relative h-32 bg-gradient-to-br ${gradientColor} p-6 overflow-hidden">
        <div class="absolute inset-0 bg-black/10"></div>
        <div class="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div class="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        
        <div class="relative z-10">
          <div class="flex items-start justify-between">
            <h3 class="text-xl font-bold text-white truncate flex-1" title="${cls.name}">
              ${cls.name}
            </h3>
            <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button class="edit-btn p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button class="delete-btn p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="mt-3 flex items-center gap-2">
            <button class="copy-code-btn px-3 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm 
              rounded-lg text-white text-sm font-mono transition-all flex items-center gap-2" 
              data-code="${cls.class_code}">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
              ${cls.class_code}
            </button>
          </div>
        </div>
      </div>

      <!-- Body -->
      <div class="p-6">
        <!-- Info -->
        <div class="flex items-center justify-between mb-4">
          <p class="text-sm text-gray-600 dark:text-gray-400 truncate" title="${cls.perguruan_tinggi}">
            🏫 ${cls.perguruan_tinggi}
          </p>
          <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium 
            text-gray-700 dark:text-gray-300">
            👥 ${studentCount} Mhs
          </span>
        </div>

        <!-- Student Preview -->
        ${this.renderStudentPreview(cls)}

        <!-- Actions -->
        <div class="mt-4 flex gap-2">
          ${studentCount > 0 ? `
            <button class="view-students-btn flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 
              text-white rounded-xl font-medium transition-all text-sm flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 4v16m8-8H4"></path>
              </svg>
              Undang Mahasiswa
            </button>
          `}
         
        </div>
      </div>
    `;
  },

  renderListView(cls) {
    const studentCount = cls.students?.length || 0;
    const gradientColor = this.getGradientByStudentCount(studentCount);

    return `
      <div class="flex flex-col sm:flex-row">
        <!-- Left gradient accent -->
        <div class="w-full sm:w-2 h-24 sm:h-auto bg-gradient-to-b sm:bg-gradient-to-b ${gradientColor}"></div>
        
        <!-- Content -->
        <div class="flex-1 p-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <!-- Class Info -->
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-xl font-bold text-gray-800 dark:text-white">${cls.name}</h3>
                <button class="copy-code-btn px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 
                  dark:hover:bg-gray-600 rounded-lg text-sm font-mono transition-all flex items-center gap-2" 
                  data-code="${cls.class_code}">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                  ${cls.class_code}
                </button>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">🏫 ${cls.perguruan_tinggi}</p>
              
              <!-- Student Summary -->
              <div class="flex items-center gap-4">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  👥 ${studentCount} Mahasiswa
                </span>
                ${studentCount > 0 ? `
                  <div class="flex -space-x-2">
                    ${cls.students.slice(0, 5).map(s => `
                      <div class="w-8 h-8 rounded-full bg-gradient-to-br ${this.getAvatarGradient(s.id)} 
                        flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-gray-800"
                        title="${s.full_name}">
                        ${s.full_name.charAt(0).toUpperCase()}
                      </div>
                    `).join('')}
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

            <!-- Actions -->
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
                dark:hover:bg-gray-700 rounded-lg transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button class="delete-btn p-2 text-gray-600 dark:text-gray-400 hover:bg-red-50 
                dark:hover:bg-red-900/20 hover:text-red-600 rounded-lg transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderStudentPreview(cls) {
    const students = cls.students || [];

    if (students.length === 0) {
      return `
        <div class="text-center py-8 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
          <div class="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full 
            flex items-center justify-center mb-3">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        ${displayStudents.map((student, index) => `
          <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 
            rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br ${this.getAvatarGradient(student.id)} 
                flex items-center justify-center text-white font-bold text-sm">
                ${student.full_name.charAt(0).toUpperCase()}
              </div>
              <div class="min-w-0 flex-1">
                <p class="font-medium text-gray-800 dark:text-gray-200 truncate">
                  ${student.full_name}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  ${student.nim} • ${student.program_studi}
                </p>
              </div>
            </div>
            <button class="kick-btn opacity-0 group-hover:opacity-100 p-1.5 text-red-500 
              hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
              data-sid="${student.id}" title="Keluarkan">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        `).join('')}
        
        ${students.length > 3 ? `
          <div class="text-center pt-2">
            <span class="text-sm text-gray-500 dark:text-gray-400">
              +${students.length - 3} mahasiswa lainnya
            </span>
          </div>
        ` : ''}
      </div>
    `;
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
    return gradients[id % gradients.length];
  },
  copyToClipboard(text, successCallback) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed"; // Mencegah scroll jump
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        successCallback();
      } else {
        showToastNotification(`Gagal menyalin. Kode: ${text}`, "error");
      }
    } catch (err) {
      showToastNotification(`Gagal menyalin. Kode: ${text}`, "error");
    }
    document.body.removeChild(textArea);
  },

  attachEventListeners(wrapper, cls) {
    // Copy code button
    wrapper.querySelector(".copy-code-btn")?.addEventListener("click", (e) => {
      e.stopPropagation();
      const code = e.currentTarget.dataset.code;
      const originalContent = e.currentTarget.innerHTML;

      this.copyToClipboard(code, () => {
        e.currentTarget.innerHTML = `
          <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Disalin!
        `;
        setTimeout(() => {
          e.currentTarget.innerHTML = originalContent;
        }, 2000);
      });
    });


    // Edit button
    wrapper.querySelector(".edit-btn")?.addEventListener("click", async (e) => {
      e.stopPropagation();
      const result = await this.showEditDialog(cls);
      if (result) {
        await this.loadClasses();
      }
    });

    // Delete button
    wrapper.querySelector(".delete-btn")?.addEventListener("click", async (e) => {
      e.stopPropagation();
      const result = await this.showConfirmDialog(
        "Hapus Kelas",
        `Apakah Anda yakin ingin menghapus kelas "${cls.name}"? Tindakan ini tidak dapat dibatalkan.`,
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
    });

    // View students button
    wrapper.querySelector(".view-students-btn")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.showStudentsModal(cls);
    });

    // Invite button
    wrapper.querySelector(".invite-btn")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.showInviteModal(cls);
    });

    // Manage button
    wrapper.querySelector(".manage-btn")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.showClassMenu(e.currentTarget, cls);
    });

    // Kick student buttons
    wrapper.querySelectorAll(".kick-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const studentId = btn.dataset.sid;
        const student = cls.students.find(s => s.id == studentId);

        const result = await this.showConfirmDialog(
          "Keluarkan Mahasiswa",
          `Apakah Anda yakin ingin mengeluarkan "${student.full_name}" dari kelas ini?`,
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
      });
    });
  },

  async showEditDialog(cls) {
    return new Promise((resolve) => {
      const modal = document.createElement("div");
      modal.className = "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4";
      modal.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl 
          transform transition-all animate-slide-down">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Edit Kelas</h3>
          
          <form id="edit-class-form">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nama Kelas
              </label>
              <input
                type="text"
                id="edit-class-name"
                value="${cls.name}"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 
                  rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div class="flex gap-3">
              <button
                type="submit"
                class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl 
                  font-medium transition-all"
              >
                Simpan
              </button>
              <button
                type="button"
                class="cancel-btn px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 
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

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const newName = nameInput.value.trim();

        if (newName && newName !== cls.name) {
          showLoadingOverlay("Menyimpan perubahan...");
          try {
            await TeacherClassModel.updateClass(cls.id, { name: newName });
            document.body.removeChild(modal);
            resolve(true);
          } catch (error) {
            console.error("Error updating class:", error);
            this.showToast("Gagal mengupdate kelas", "error");
          } finally {
            hideLoadingOverlay();
          }
        }
      });

      modal.querySelector(".cancel-btn").onclick = () => {
        document.body.removeChild(modal);
        resolve(false);
      };

      modal.onclick = (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal);
          resolve(false);
        }
      };

      // Focus input
      setTimeout(() => nameInput.focus(), 100);
    });
  },

  showStudentsModal(cls) {
    const modal = document.createElement("div");
    modal.className = "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4";

    const students = cls.students || [];

    modal.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <!-- Header -->
        <div class="bg-gradient-to-r ${this.getGradientByStudentCount(students.length)} p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-2xl font-bold mb-1">${cls.name}</h3>
              <p class="text-white/80">Kode Kelas: ${cls.class_code} • ${students.length} Mahasiswa</p>
            </div>
            <button class="close-btn p-2 hover:bg-white/20 rounded-lg transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="relative">
            <input
              type="text"
              id="modal-search"
              placeholder="Cari mahasiswa..."
              class="w-full px-4 py-2 pl-10 bg-gray-100 dark:bg-gray-900 rounded-xl 
                focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" 
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>

        <!-- Students List -->
        <div class="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
          ${students.length === 0 ? `
            <div class="text-center py-16">
              <div class="w-24 h-24 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full 
                flex items-center justify-center mb-4">
                <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
              <h4 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Belum Ada Mahasiswa
              </h4>
              <p class="text-gray-600 dark:text-gray-400 mb-6">
                Bagikan kode kelas <span class="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                ${cls.class_code}</span> untuk mengundang mahasiswa
              </p>
              <button class="share-code-btn px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white 
                rounded-xl font-medium transition-all" data-code="${cls.class_code}">
                Bagikan Kode Kelas
              </button>
            </div>
          ` : `
            <div id="students-grid" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${students.map((student, index) => `
                <div class="student-card flex items-center justify-between p-4 bg-gray-50 
                  dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 
                  transition-all group" data-name="${student.full_name.toLowerCase()}"
                  data-nim="${student.nim.toLowerCase()}">
                  <div class="flex items-center gap-4">
                    <div class="relative">
                      <div class="w-12 h-12 rounded-full bg-gradient-to-br ${this.getAvatarGradient(student.id)} 
                        flex items-center justify-center text-white font-bold text-lg">
                        ${student.full_name.charAt(0).toUpperCase()}
                      </div>
                      <span class="absolute -bottom-1 -right-1 w-6 h-6 bg-white dark:bg-gray-800 
                        rounded-full flex items-center justify-center text-xs font-bold text-gray-600 
                        dark:text-gray-400 border-2 border-gray-50 dark:border-gray-900">
                        ${index + 1}
                      </span>
                    </div>
                    <div>
                      <p class="font-semibold text-gray-800 dark:text-white">
                        ${student.full_name}
                      </p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        ${student.nim}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-500">
                        ${student.program_studi}
                      </p>
                    </div>
                  </div>
                  <button class="modal-kick-btn opacity-0 group-hover:opacity-100 p-2 
                    text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg 
                    transition-all" data-sid="${student.id}" data-name="${student.full_name}">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"></path>
                    </svg>
                  </button>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Total: <span class="font-semibold text-gray-800 dark:text-white">
              ${students.length} mahasiswa</span>
            </div>
            <button class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl 
              font-medium transition-all close-btn">
              Tutup
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Search functionality
    const searchInput = modal.querySelector("#modal-search");
    searchInput?.addEventListener("input", (e) => {
      const term = e.target.value.toLowerCase();
      modal.querySelectorAll(".student-card").forEach(card => {
        const name = card.dataset.name;
        const nim = card.dataset.nim;
        if (name.includes(term) || nim.includes(term)) {
          card.style.display = "";
        } else {
          card.style.display = "none";
        }
      });
    });

    // Share code button
    modal.querySelector(".share-code-btn")?.addEventListener("click", async (e) => {
      const code = e.currentTarget.dataset.code;
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Kode Kelas',
            text: `Bergabung ke kelas dengan kode: ${code}`,
          });
        } catch (err) {
          // User cancelled or error
        }
      } else {
        await navigator.clipboard.writeText(code);
        this.showToast("Kode kelas disalin!", "success");
      }
    });

    // Kick student from modal
    modal.querySelectorAll(".modal-kick-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const studentId = btn.dataset.sid;
        const studentName = btn.dataset.name;

        const result = await this.showConfirmDialog(
          "Keluarkan Mahasiswa",
          `Apakah Anda yakin ingin mengeluarkan "${studentName}" dari kelas ini?`,
          "Keluarkan",
          "Batal",
          true
        );

        if (result) {
          showLoadingOverlay("Mengeluarkan mahasiswa...");
          try {
            await TeacherClassModel.removeStudent(cls.id, studentId);
            document.body.removeChild(modal);
            await this.loadClasses();
            this.showToast("Mahasiswa berhasil dikeluarkan", "success");
          } catch (error) {
            console.error("Error removing student:", error);
            this.showToast("Gagal mengeluarkan mahasiswa", "error");
          } finally {
            hideLoadingOverlay();
          }
        }
      });
    });

    // Close buttons
    modal.querySelectorAll(".close-btn").forEach(btn => {
      btn.onclick = () => document.body.removeChild(modal);
    });

    modal.onclick = (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    };
  },

  showInviteModal(cls) {
    const modal = document.createElement("div");
    modal.className = "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4";

    modal.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Undang Mahasiswa
        </h3>
        
        <div class="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 mb-6 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Bagikan kode kelas ini kepada mahasiswa
          </p>
          <div class="text-3xl font-mono font-bold text-blue-600 dark:text-blue-400 mb-4">
            ${cls.class_code}
          </div>
          <button id="copy-invite-code" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 
            text-white rounded-xl font-medium transition-all w-full flex items-center 
            justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            Salin Kode
          </button>
        </div>
        
        <div class="text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Atau bagikan melalui:
          </p>
          <div class="flex justify-center gap-3">
            <button class="share-whatsapp p-3 bg-green-500 hover:bg-green-600 text-white 
              rounded-xl transition-all" title="Bagikan via WhatsApp">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </button>
            <button class="share-email p-3 bg-blue-500 hover:bg-blue-600 text-white 
              rounded-xl transition-all" title="Bagikan via Email">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <button class="close-btn mt-6 w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 
          text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 
          dark:hover:bg-gray-600 transition-all font-medium">
          Tutup
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    // 🚀 FIX: Menggunakan fungsi copyToClipboard yang sudah diperbaiki
    modal.querySelector("#copy-invite-code")?.addEventListener("click", (e) => {
      const code = cls.class_code;
      const btn = e.currentTarget;
      const originalContent = btn.innerHTML;

      this.copyToClipboard(code, () => {
        btn.innerHTML = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Berhasil Disalin!
        `;
        btn.classList.add("bg-green-600");
        setTimeout(() => {
          btn.innerHTML = originalContent;
          btn.classList.remove("bg-green-600");
        }, 2000);
      });
    });

    // Share via WhatsApp
    modal.querySelector(".share-whatsapp")?.addEventListener("click", () => {
      const text = `Bergabung ke kelas *${cls.name}*!\n\nKode Kelas: *${cls.class_code}*\n\nSilakan masukkan kode ini di aplikasi edura.web.id untuk bergabung.`;
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    });

    // Share via Email
    modal.querySelector(".share-email")?.addEventListener("click", () => {
      const subject = `Undangan Kelas: ${cls.name}`;
      const body = `Halo,\n\nAnda diundang untuk bergabung ke kelas "${cls.name}".\n\nKode Kelas: ${cls.class_code}\n\nSilakan masukkan kode ini di aplikasi untuk bergabung.\n\nTerima kasih.`;
      const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoLink;
    });

    // Close button
    modal.querySelector(".close-btn").onclick = () => document.body.removeChild(modal);

    modal.onclick = (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    };
  },

  showClassMenu(button, cls) {
    // Remove existing menu
    const existingMenu = document.querySelector(".class-menu");
    if (existingMenu) existingMenu.remove();

    const menu = document.createElement("div");
    menu.className = "class-menu absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50";

    menu.innerHTML = `
      <div class="py-2">
        <button class="menu-stats w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3">
          <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          <span class="text-gray-700 dark:text-gray-300">Statistik</span>
        </button>
        <button class="menu-export w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3">
          <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <span class="text-gray-700 dark:text-gray-300">Export Data</span>
        </button>
        <hr class="my-2 border-gray-200 dark:border-gray-700" />
        <button class="menu-settings w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3">
          <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span class="text-gray-700 dark:text-gray-300">Pengaturan</span>
        </button>
      </div>
    `;

    // Position menu
    const rect = button.getBoundingClientRect();
    button.parentElement.style.position = "relative";
    button.parentElement.appendChild(menu);

    // Menu actions
    menu.querySelector(".menu-stats").onclick = () => {
      menu.remove();
      this.showToast("Fitur statistik akan segera tersedia", "info");
    };

    menu.querySelector(".menu-export").onclick = () => {
      menu.remove();
      this.showToast("Fitur export akan segera tersedia", "info");
    };

    menu.querySelector(".menu-settings").onclick = () => {
      menu.remove();
      this.showToast("Fitur pengaturan akan segera tersedia", "info");
    };

    // Close menu when clicking outside
    setTimeout(() => {
      document.addEventListener("click", function closeMenu(e) {
        if (!menu.contains(e.target) && e.target !== button) {
          menu.remove();
          document.removeEventListener("click", closeMenu);
        }
      });
    }, 0);
  },

  async showConfirmDialog(title, message, confirmText, cancelText, isDanger = false) {
    return new Promise((resolve) => {
      const modal = document.createElement("div");
      modal.className = "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4";
      modal.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl 
          transform transition-all animate-slide-down">
          <div class="mb-6">
            <div class="w-12 h-12 mx-auto bg-${isDanger ? 'red' : 'yellow'}-100 dark:bg-${isDanger ? 'red' : 'yellow'}-900/20 
              rounded-full flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-${isDanger ? 'red' : 'yellow'}-600 dark:text-${isDanger ? 'red' : 'yellow'}-400" 
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-800 dark:text-white text-center mb-2">${title}</h3>
            <p class="text-gray-600 dark:text-gray-400 text-center">${message}</p>
          </div>
          
          <div class="flex gap-3">
            <button class="cancel-btn flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 
              text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 
              dark:hover:bg-gray-600 transition-all font-medium">
              ${cancelText}
            </button>
            <button class="confirm-btn flex-1 px-4 py-2 bg-${isDanger ? 'red' : 'blue'}-600 
              hover:bg-${isDanger ? 'red' : 'blue'}-700 text-white rounded-xl transition-all font-medium">
              ${confirmText}
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      modal.querySelector(".confirm-btn").onclick = () => {
        document.body.removeChild(modal);
        resolve(true);
      };

      modal.querySelector(".cancel-btn").onclick = () => {
        document.body.removeChild(modal);
        resolve(false);
      };

      modal.onclick = (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal);
          resolve(false);
        }
      };
    });
  },

  showToast(message, type = "info") {
    const toast = document.createElement("div");
    const icons = {
      success: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>`,
      error: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>`,
      info: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
             </svg>`
    };

    const colors = {
      success: "bg-green-500",
      error: "bg-red-500",
      info: "bg-blue-500"
    };

    toast.className = `fixed bottom-4 right-4 ${colors[type]} text-white px-6 py-4 rounded-xl 
      shadow-lg flex items-center gap-3 z-50 transform translate-y-full transition-all duration-300`;

    toast.innerHTML = `
      ${icons[type]}
      <span class="font-medium">${message}</span>
    `;

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.style.transform = "translateY(0)";
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.transform = "translateY(100%)";
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  },

  renderErrorState() {
    return `
      <div class="col-span-full text-center py-16">
        <div class="w-20 h-20 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full 
          flex items-center justify-center mb-4">
          <svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Gagal Memuat Kelas
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Terjadi kesalahan saat memuat data kelas
        </p>
        <button onclick="TeacherClassPresenter.loadClasses()" 
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl 
          font-medium transition-all inline-flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Coba Lagi
        </button>
      </div>
    `;
  }
};

export default TeacherClassPresenter;