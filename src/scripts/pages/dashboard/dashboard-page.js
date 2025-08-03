// // dashboard-page.js
// import createSidebar from "../../component/sidebar.js";
// import DashboardStudentPresenter from "../student/dashboard/dashboard-student-presenter.js";
// import DashboardPresenter from "./dashboard-presenter.js";

// const DashboardPage = {
//   async render() {
//     return `
//   <div class="h-screen w-screen flex flex-col">
//     <!-- Loading Screen Overlay -->
//     <div id="dashboard-loading-overlay" class="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center">
//       <div class="text-center">
//         <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
//         <p class="text-gray-600 dark:text-gray-300 text-lg">Memuat Dashboard...</p>
//         <p class="text-gray-500 dark:text-gray-400 text-sm mt-2">Mohon tunggu sebentar</p>
//       </div>
//     </div>

//     <!-- Navbar -->
//     <div id="navbar-container" class="shrink-0 z-50"></div>
    
//     <!-- Layout: Sidebar + Content -->
//     <div class="flex flex-1 overflow-hidden">
//       <!-- Sidebar -->
//       <div id="sidebar-wrapper"></div>
      
//       <!-- Main Content -->
//       <main class="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white mt-16">
//         <div id="welcome-container" class="mb-6"></div>
        
//         <section class="mt-8" id="student-section">
//           <div class="flex justify-between items-center mb-6">
//             <h2 class="text-xl font-semibold">Your Study Material</h2>
//             <button id="refresh-courses" class="border border-blue-600 text-blue-600 px-3 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-800">
//               Refresh
//             </button>
//           </div>
//           <div id="course-container" class="w-full"></div>
//         </section>
        
//         <section class="hidden mt-8" id="other-role-section">
//           <h2 class="text-xl font-semibold">Dashboard untuk Role Lain Akan Segera Hadir</h2>
//         </section>
//       </main>
      
//       <div id="role-profile-modal-container"></div>
//     </div>
//   </div>
  
//   <section class="mt-8" id="course-generating-section" style="display: none;">
//     <div class="text-center py-10 px-4 border border-blue-100 dark:border-blue-800 rounded bg-blue-50 dark:bg-blue-900">
//       <h2 class="text-xl font-bold text-blue-700 dark:text-blue-300 mb-2">Sedang Membuat Course...</h2>
//       <p class="text-gray-700 dark:text-gray-300 mb-1">
//         Course dengan topik "<span id="generating-title" class="font-semibold"></span>"
//         (<span id="generating-level" class="text-sm font-medium text-gray-600 dark:text-gray-400"></span>)
//         sedang dibuat.
//       </p>
//       <p class="text-sm text-gray-500 dark:text-gray-400">Tunggu beberapa detik. Sistem akan otomatis memuat ulang.</p>
//       <div class="mt-4 flex justify-center gap-2 items-center text-blue-600 dark:text-blue-300">
//         <svg class="animate-spin h-5 w-5 text-blue-600 dark:text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//           <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
//           <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
//         </svg>
//         <span>Generating...</span>
//       </div>
//       <!-- Help message ditambahkan via JS jika proses terlalu lama -->
//       <div id="generation-help" class="mt-4 text-sm text-red-600 dark:text-red-400"></div>
//     </div>
//   </section>
// `;
//   },

//   async afterRender() {
//     try {
//       // Loading screen sudah ditampilkan via render()

//       // Load sidebar dengan loading indicator
//       const sidebarWrapper = document.getElementById("sidebar-wrapper");
//       sidebarWrapper.innerHTML = "";

//       // Paralel loading untuk performa yang lebih baik
//       const [totalCourse, navbarModule] = await Promise.all([
//         DashboardStudentPresenter.getTotalCourses(),
//         import("../../component/navbar.js").then((module) => module.default),
//       ]);

//       // Render sidebar
//       const sidebar = await createSidebar(totalCourse);
//       sidebarWrapper.appendChild(sidebar);

//       // Render navbar
//       const navbarContainer = document.getElementById("navbar-container");
//       navbarContainer.innerHTML = navbarModule().render();
//       navbarModule().afterRender();

//       // Initialize dashboard presenter
//       await DashboardPresenter.init();

//       // Sembunyikan loading screen setelah semua selesai
//       this.hideLoadingScreen();
//     } catch (error) {
//       console.error("Error loading dashboard:", error);

//       // Tampilkan error message
//       this.showErrorMessage();

//       // Tetap sembunyikan loading screen
//       this.hideLoadingScreen();
//     }
//   },

//   hideLoadingScreen() {
//     const loadingOverlay = document.getElementById("dashboard-loading-overlay");
//     if (loadingOverlay) {
//       loadingOverlay.style.transition = "opacity 0.3s ease-out";
//       loadingOverlay.style.opacity = "0";

//       setTimeout(() => {
//         loadingOverlay.remove();
//       }, 300);
//     }
//   },

//   showErrorMessage() {
//     const main = document.querySelector("main");
//     if (main) {
//       main.innerHTML = `
//         <div class="flex items-center justify-center h-full">
//           <div class="text-center p-8">
//             <div class="text-red-500 text-6xl mb-4">⚠️</div>
//             <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">
//               Gagal Memuat Dashboard
//             </h2>
//             <p class="text-gray-600 dark:text-gray-300 mb-4">
//               Terjadi kesalahan saat memuat halaman dashboard.
//             </p>
//             <button 
//               onclick="window.location.reload()" 
//               class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
//             >
//               Muat Ulang
//             </button>
//           </div>
//         </div>
//       `;
//     }
//   },
// };

// export default DashboardPage;
// dashboard-page.js
import createSidebar from "../../component/sidebar.js";
import DashboardStudentPresenter from "../student/dashboard/dashboard-student-presenter.js";
import DashboardPresenter from "./dashboard-presenter.js";

const DashboardPage = {
  async render() {
    return `
  <div class="h-screen w-screen flex flex-col">
    <!-- Loading Screen Overlay -->
    <div id="dashboard-loading-overlay" class="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-300 text-lg">Memuat Dashboard...</p>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-2">Mohon tunggu sebentar</p>
      </div>
    </div>

    <!-- Navbar -->
    <div id="navbar-container" class="shrink-0 z-50"></div>
    
    <!-- Layout: Sidebar + Content -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <div id="sidebar-wrapper"></div>
      
      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white mt-16">
        <div id="welcome-container" class="mb-6"></div>
        
        <section class="mt-8" id="student-section">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold">Your Study Material</h2>
            <button id="refresh-courses" class="border border-blue-600 text-blue-600 px-3 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-800">
              Refresh
            </button>
          </div>
          <div id="course-container" class="w-full"></div>
        </section>
        
        <section class="hidden mt-8" id="other-role-section">
          <h2 class="text-xl font-semibold">Dashboard untuk Role Lain Akan Segera Hadir</h2>
        </section>
      </main>
      
      <div id="role-profile-modal-container"></div>
    </div>
  </div>
  
  <section class="mt-8" id="course-generating-section" style="display: none;">
    <div class="text-center py-10 px-4 border border-blue-100 dark:border-blue-800 rounded bg-blue-50 dark:bg-blue-900">
      <h2 class="text-xl font-bold text-blue-700 dark:text-blue-300 mb-2">Sedang Membuat Course...</h2>
      <p class="text-gray-700 dark:text-gray-300 mb-1">
        Course dengan topik "<span id="generating-title" class="font-semibold"></span>"
        (<span id="generating-level" class="text-sm font-medium text-gray-600 dark:text-gray-400"></span>)
        sedang dibuat.
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400">Tunggu beberapa detik. Sistem akan otomatis memuat ulang.</p>
      <div class="mt-4 flex justify-center gap-2 items-center text-blue-600 dark:text-blue-300">
        <svg class="animate-spin h-5 w-5 text-blue-600 dark:text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        <span>Generating...</span>
      </div>
      <!-- Help message ditambahkan via JS jika proses terlalu lama -->
      <div id="generation-help" class="mt-4 text-sm text-red-600 dark:text-red-400"></div>
    </div>
  </section>
`;
  },

  async afterRender() {
    try {
      console.log('🚀 Dashboard: Starting initialization...');
      
      // Quick token check to ensure we're authenticated
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn('❌ Dashboard: No token found, redirecting to login');
        window.location.hash = "#/login";
        return;
      }

      // Initialize navbar first with optimistic state
      console.log('🔄 Dashboard: Initializing navbar...');
      await this.initializeNavbar();

      // Load sidebar with loading indicator
      console.log('🔄 Dashboard: Loading sidebar...');
      await this.initializeSidebar();

      // Initialize dashboard presenter (this will load user and dispatch event)
      console.log('🔄 Dashboard: Loading dashboard content...');
      await DashboardPresenter.init();

      // Hide loading screen after everything is loaded
      console.log('✅ Dashboard: Initialization complete');
      this.hideLoadingScreen();
      
    } catch (error) {
      console.error("❌ Dashboard: Error during initialization:", error);
      this.showErrorMessage();
      this.hideLoadingScreen();
    }
  },

  async initializeNavbar() {
    try {
      const navbarModule = await import("../../component/navbar.js").then((module) => module.default);
      const navbarContainer = document.getElementById("navbar-container");
      
      if (navbarContainer) {
        navbarContainer.innerHTML = navbarModule().render();
        await navbarModule().afterRender();
        console.log('✅ Dashboard: Navbar initialized');
      }
    } catch (error) {
      console.error('❌ Dashboard: Failed to initialize navbar:', error);
      throw error;
    }
  },

  async initializeSidebar() {
    try {
      const sidebarWrapper = document.getElementById("sidebar-wrapper");
      if (sidebarWrapper) {
        sidebarWrapper.innerHTML = ""; // Clear any existing content
        
        // Get total courses for sidebar
        const totalCourse = await DashboardStudentPresenter.getTotalCourses();
        
        // Create and append sidebar
        const sidebar = await createSidebar(totalCourse);
        sidebarWrapper.appendChild(sidebar);
        
        console.log('✅ Dashboard: Sidebar initialized');
      }
    } catch (error) {
      console.error('❌ Dashboard: Failed to initialize sidebar:', error);
      // Don't throw error for sidebar - dashboard can still work without it
    }
  },

  hideLoadingScreen() {
    const loadingOverlay = document.getElementById("dashboard-loading-overlay");
    if (loadingOverlay) {
      loadingOverlay.style.transition = "opacity 0.3s ease-out";
      loadingOverlay.style.opacity = "0";

      setTimeout(() => {
        loadingOverlay.remove();
      }, 300);
    }
  },

  showErrorMessage() {
    const main = document.querySelector("main");
    if (main) {
      main.innerHTML = `
        <div class="flex items-center justify-center h-full">
          <div class="text-center p-8">
            <div class="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Gagal Memuat Dashboard
            </h2>
            <p class="text-gray-600 dark:text-gray-300 mb-4">
              Terjadi kesalahan saat memuat halaman dashboard.
            </p>
            <button 
              onclick="window.location.reload()" 
              class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Muat Ulang
            </button>
          </div>
        </div>
      `;
    }
  },
};

export default DashboardPage;