// File: routes/class-page.js - Enhanced Version with Refresh Button
import createSidebar from "../../../component/sidebar.js";
import TeacherClassPresenter from "./presenter.js";

const TeacherClassPage = {
  async render() {
    return `
      <div class="h-screen w-screen flex flex-col">
        <div id="navbar-container" class="shrink-0 z-50"></div>
        
        <div class="flex flex-1 overflow-hidden">
          <div id="sidebar-wrapper" ></div>
          
          <!-- Main Content -->
          <main class="flex-1 overflow-y-auto p-4 md:p-6">
            <div class="max-w-7xl mx-auto">
              <!-- Header Section dengan animasi -->
              <div class="mb-4 sm:mb-6 mt-12 animate-fade-in">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-1 flex items-center gap-2">
                      <span class="text-2xl sm:text-2xl animate-bounce-slow">📚</span>
                      <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Manajemen Kelas
                      </span>
                    </h1>
                    <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      Kelola kelas dan mahasiswa dengan mudah dan efisien
                    </p>
                  </div>
                  
                  <!-- Quick Actions untuk desktop -->
                  <div class="hidden sm:flex gap-2">
                    <button id="refresh-btn" class="p-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Refresh Data">
                      <svg class="w-4 h-4 text-gray-600 dark:text-gray-300 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                    </button>
                    
                  </div>
                </div>
              </div>

              <!-- Stats Cards dengan animasi stagger -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <!-- Total Kelas Card -->
                <div class="stat-card bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 
                  hover:shadow-xl hover:-translate-y-1 transition-all duration-300" style="animation-delay: 100ms">
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <p class="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Total Kelas</p>
                      <p id="total-classes" class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                        <span class="loading-placeholder">--</span>
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span class="text-green-500">↑</span> Aktif
                      </p>
                    </div>
                    <div class="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                      <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- Total Mahasiswa Card -->
                <div class="stat-card bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 
                  hover:shadow-xl hover:-translate-y-1 transition-all duration-300" style="animation-delay: 200ms">
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <p class="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Total Mahasiswa</p>
                      <p id="total-students" class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                        <span class="loading-placeholder">--</span>
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span class="text-blue-500">●</span> Terdaftar
                      </p>
                    </div>
                    <div class="p-2 sm:p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg">
                      <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- Rata-rata Mahasiswa per Kelas -->
                <div class="stat-card bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 
                  hover:shadow-xl hover:-translate-y-1 transition-all duration-300" style="animation-delay: 300ms">
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <p class="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Rata-rata/Kelas</p>
                      <p id="avg-students" class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                        <span class="loading-placeholder">--</span>
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span class="text-purple-500">◆</span> Mahasiswa
                      </p>
                    </div>
                    <div class="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg">
                      <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- Quick Create Card -->
                <div class="stat-card bg-gradient-to-br from-blue-600 to-purple-600 p-3 sm:p-4 rounded-xl shadow-lg 
                  hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group" 
                  style="animation-delay: 400ms" id="quick-create-card">
                  <div class="flex items-center justify-between text-white">
                    <div class="flex-1">
                      <p class="text-xs font-medium text-blue-100 mb-1">Quick Action</p>
                      <p class="text-lg sm:text-xl font-bold mb-1">Buat Kelas</p>
                      <p class="text-xs text-blue-100 opacity-80">Klik untuk membuat</p>
                    </div>
                    <div class="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-lg group-hover:bg-white/30 transition-all">
                      <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Create Class Form (Hidden by default) -->
              <div id="create-class-form-container" class="hidden mb-4 sm:mb-6 animate-slide-down">
                <div class="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700">
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                      <span class="text-xl">🚀</span>
                      Buat Kelas Baru
                    </h3>
                    <button id="close-form-btn" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                  
                  <form id="create-class-form" class="space-y-3">
                    <div>
                      <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nama Kelas <span class="text-red-500">*</span>
                      </label>
                      <div class="relative">
                        <input
                          type="text"
                          id="name"
                          name="name"
                          class="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 
                            rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                            transition-all text-sm"
                          placeholder="Contoh: Kelas A - Pemrograman Web"
                          required
                        />
                        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                      </div>
                      <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Nama kelas akan digunakan untuk identifikasi
                      </p>
                    </div>
                    
                    <div class="flex flex-col sm:flex-row gap-3 pt-3">
                      <button
                        type="submit"
                        class="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg 
                          hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg hover:shadow-xl 
                          transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        <span>Buat Kelas</span>
                      </button>
                      <button
                        type="button"
                        id="cancel-create-btn"
                        class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                          rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all font-medium text-sm"
                      >
                        Batal
                      </button>
                    </div>
                    
                    <div id="form-message" class="hidden mt-3 p-3 rounded-lg flex items-center gap-2"></div>
                  </form>
                </div>
              </div>

              <!-- View Toggle dan Search -->
              <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <h2 class="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">Daftar Kelas</h2>
                
                <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <!-- Search Input -->
                  <div class="relative flex-1 sm:flex-initial">
                    <input
                      type="text"
                      id="search-input"
                      placeholder="Cari kelas..."
                      class="w-full sm:w-64 px-3 py-2 pl-9 bg-white dark:bg-gray-800 border border-gray-300 
                        dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                        text-sm transition-all"
                    />
                    <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  
                  <!-- View Toggle -->
                  <div class="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 shadow-inner">
                    <button
                      class="view-toggle px-3 py-1.5 rounded-md text-sm font-medium bg-white dark:bg-gray-700 
                        shadow text-gray-700 dark:text-white transition-all"
                      data-view="grid"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                      </svg>
                    </button>
                    <button
                      class="view-toggle px-3 py-1.5 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400 transition-all"
                      data-view="list"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M4 6h16M4 12h16M4 18h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Loading State -->
              <div id="class-loading" class="hidden"></div>

              <!-- Class List Container -->
              <div id="class-list" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4"></div>

              <!-- Empty State -->
              <div id="empty-state" class="text-center py-8 sm:py-12 hidden">
                <div class="max-w-md mx-auto">
                  <div class="mb-4 relative">
                    <div class="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 
                      rounded-full flex items-center justify-center">
                      <svg class="w-10 h-10 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                      </svg>
                    </div>
                    <div class="absolute -bottom-1 -right-1 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 
                      rounded-full opacity-20 animate-pulse"></div>
                  </div>
                  
                  <h3 class="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2">
                    Belum Ada Kelas
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                    Mulai perjalanan mengajar Anda dengan membuat kelas pertama. 
                    Mahasiswa dapat bergabung menggunakan kode kelas.
                  </p>
                  <button
                    id="create-first-class-btn"
                    class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg 
                      hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg hover:shadow-xl 
                      transform hover:-translate-y-0.5 inline-flex items-center gap-2 text-sm"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    <span>Buat Kelas Pertama</span>
                  </button>
                </div>
              </div>

              <!-- Search Not Found State -->
              <div id="search-not-found" class="text-center py-8 hidden">
                <div class="max-w-md mx-auto">
                  <div class="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  <h3 class="text-base font-semibold text-gray-800 dark:text-white mb-1">
                    Tidak ada hasil
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Coba kata kunci lain atau buat kelas baru
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <!-- Custom Styles -->
      <style>
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .animate-slide-down {
          animation: slide-down 0.4s ease-out forwards;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        .stat-card {
          opacity: 0;
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .loading-placeholder {
          display: inline-block;
          min-width: 2rem;
          background: linear-gradient(90deg, #e5e5e5 25%, #f0f0f0 50%, #e5e5e5 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
          color: transparent;
        }
        
        .dark .loading-placeholder {
          background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
          background-size: 200% 100%;
        }
        
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      </style>
    `;
  },

  async afterRender() {
    // Initialize sidebar - dengan layout normal
    const sidebarWrapper = document.getElementById("sidebar-wrapper");
    sidebarWrapper.innerHTML = "";
    const sidebar = await createSidebar();
    sidebarWrapper.appendChild(sidebar);

    // Initialize navbar - dengan layout normal  
    const navbarModule = (await import("../../../component/navbar.js")).default;
    const navbarContainer = document.getElementById("navbar-container");
    navbarContainer.innerHTML = navbarModule().render();
    navbarModule().afterRender();

    // Form controls
    const quickCreateCard = document.getElementById("quick-create-card");
    const createFirstClassBtn = document.getElementById("create-first-class-btn");
    const createClassFormContainer = document.getElementById("create-class-form-container");
    const cancelCreateBtn = document.getElementById("cancel-create-btn");
    const closeFormBtn = document.getElementById("close-form-btn");

    const showCreateForm = () => {
      createClassFormContainer.classList.remove("hidden");
      createClassFormContainer.scrollIntoView({ behavior: "smooth", block: "center" });
      document.getElementById("name").focus();
    };

    const hideCreateForm = () => {
      createClassFormContainer.classList.add("hidden");
      document.getElementById("create-class-form").reset();
      document.getElementById("form-message").classList.add("hidden");
    };

    quickCreateCard?.addEventListener("click", showCreateForm);
    createFirstClassBtn?.addEventListener("click", showCreateForm);
    cancelCreateBtn?.addEventListener("click", hideCreateForm);
    closeFormBtn?.addEventListener("click", hideCreateForm);

    // View toggle
    document.querySelectorAll(".view-toggle").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const view = e.currentTarget.dataset.view;
        const classList = document.getElementById("class-list");

        // Update button styles
        document.querySelectorAll(".view-toggle").forEach((b) => {
          b.classList.remove("bg-white", "dark:bg-gray-700", "shadow", "text-gray-700", "dark:text-white");
          b.classList.add("text-gray-500", "dark:text-gray-400");
        });

        e.currentTarget.classList.add("bg-white", "dark:bg-gray-700", "shadow", "text-gray-700", "dark:text-white");
        e.currentTarget.classList.remove("text-gray-500", "dark:text-gray-400");

        // Update grid layout
        if (view === "list") {
          classList.className = "space-y-3";
        } else {
          classList.className = "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4";
        }
      });
    });

    // 🔄 Enhanced Refresh button with proper functionality
    document.getElementById("refresh-btn")?.addEventListener("click", async () => {
      const btn = document.getElementById("refresh-btn");
      const icon = btn.querySelector("svg");
      
      // Disable button and show loading
      btn.disabled = true;
      icon.classList.add("animate-spin");
      btn.title = "Refreshing...";
      
      try {
        //console.log("🔄 User clicked refresh button");
        // Clear cache and refresh data
        await TeacherClassPresenter.refreshAllData();
      } catch (error) {
        console.error("❌ Refresh error:", error);
      } finally {
        // Re-enable button
        btn.disabled = false;
        icon.classList.remove("animate-spin");
        btn.title = "Refresh Data";
      }
    });

    // Search functionality
    const searchInput = document.getElementById("search-input");
    searchInput?.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const classCards = document.querySelectorAll(".class-card");
      let visibleCount = 0;

      classCards.forEach(card => {
        const className = card.querySelector(".class-name")?.textContent.toLowerCase() || "";
        const classCode = card.querySelector(".class-code")?.textContent.toLowerCase() || "";
        
        if (className.includes(searchTerm) || classCode.includes(searchTerm)) {
          card.style.display = "";
          visibleCount++;
        } else {
          card.style.display = "none";
        }
      });

      // Show/hide search not found state
      const searchNotFound = document.getElementById("search-not-found");
      const classList = document.getElementById("class-list");
      
      if (searchTerm && visibleCount === 0 && classCards.length > 0) {
        searchNotFound.classList.remove("hidden");
        classList.classList.add("hidden");
      } else {
        searchNotFound.classList.add("hidden");
        classList.classList.remove("hidden");
      }
    });

    // Initialize presenter
    TeacherClassPresenter.init();
  },

};

export default TeacherClassPage;