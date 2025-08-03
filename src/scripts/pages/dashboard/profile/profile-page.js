// pages/dashboard/profile/profile-page.js
import createSidebar from "../../../component/sidebar.js";
import ProfilePresenter from "./profile-presenter.js";
import DashboardStudentPresenter from "../../student/dashboard/dashboard-student-presenter.js";

const ProfilePage = {
  presenter: null,

  async render() {
    return `
            <div class="h-screen w-screen flex flex-col">
                <!-- Loading Screen Overlay -->
                <div id="profile-loading-overlay" class="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center">
                    <div class="text-center">
                        <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                        <p class="text-gray-600 dark:text-gray-300 text-lg">Memuat Profile...</p>
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
                        <!-- Header -->
                        <div class="mb-8">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
                                    <p class="text-gray-600 dark:text-gray-400 mt-2">Manage your account information and preferences</p>
                                </div>
                                <button id="refresh-profile" class="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-800 transition-colors">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                    </svg>
                                    Refresh
                                </button>
                            </div>
                        </div>

                        <!-- Profile Content -->
                        <div id="profile-content">
                            ${this.renderLoadingContent()}
                        </div>
                    </main>
                </div>
            </div>
        `;
  },

  renderLoadingContent() {
    return `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Basic Profile Skeleton -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                    <div class="animate-pulse">
                        <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                        <div class="flex items-center space-x-4 mb-6">
                            <div class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            <div class="space-y-2">
                                <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                            </div>
                        </div>
                        <div class="space-y-4">
                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                    </div>
                </div>

                <!-- Role Profile Skeleton -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                    <div class="animate-pulse">
                        <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                        <div class="space-y-4">
                            <div class="grid grid-cols-2 gap-4">
                                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                            </div>
                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                            <div class="grid grid-cols-2 gap-4">
                                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
  },

  async afterRender() {
    console.log('🚀 Profile page afterRender started');

    try {
      // Paralel loading untuk performa yang lebih baik
      const [totalCourse, navbarModule] = await Promise.all([
        DashboardStudentPresenter.getTotalCourses().catch(() => 0), // Fallback to 0 if error
        import("../../../component/navbar.js").then((module) => module.default),
      ]);

      // Load sidebar dengan loading indicator
      const sidebarWrapper = document.getElementById("sidebar-wrapper");
      if (sidebarWrapper) {
        sidebarWrapper.innerHTML = "";
        const sidebar = await createSidebar(totalCourse);
        sidebarWrapper.appendChild(sidebar);
        console.log('✅ Sidebar loaded');
      }

      // Render navbar
      const navbarContainer = document.getElementById("navbar-container");
      if (navbarContainer && navbarModule) {
        navbarContainer.innerHTML = navbarModule().render();
        navbarModule().afterRender();
        console.log('✅ Navbar loaded');
      }

      // Initialize profile presenter
      this.presenter = new ProfilePresenter();
      await this.presenter.init();
      console.log('✅ Profile presenter initialized');

      // Sembunyikan loading screen setelah semua selesai
      this.hideLoadingScreen();
      console.log('✅ Profile page loaded successfully');

    } catch (error) {
      console.error('❌ Error loading profile page:', error);

      // Tampilkan error message
      this.showErrorMessage(error);

      // Tetap sembunyikan loading screen
      this.hideLoadingScreen();
    }
  },

  hideLoadingScreen() {
    const loadingOverlay = document.getElementById("profile-loading-overlay");
    if (loadingOverlay) {
      loadingOverlay.style.transition = "opacity 0.3s ease-out";
      loadingOverlay.style.opacity = "0";

      setTimeout(() => {
        loadingOverlay.remove();
      }, 300);
    }
  },

  showErrorMessage(error) {
    const profileContent = document.getElementById("profile-content");
    if (profileContent) {
      profileContent.innerHTML = `
                <div class="flex items-center justify-center min-h-96">
                    <div class="text-center p-8 max-w-md">
                        <div class="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg class="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                            Gagal Memuat Profile
                        </h2>
                        <p class="text-gray-600 dark:text-gray-300 mb-2">
                            Terjadi kesalahan saat memuat halaman profile.
                        </p>
                        <p class="text-sm text-red-600 dark:text-red-400 mb-6">
                            ${error.message || 'Unknown error occurred'}
                        </p>
                        <div class="space-y-3">
                            <button 
                                onclick="window.location.reload()" 
                                class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                </svg>
                                Muat Ulang Halaman
                            </button>
                            <a 
                                href="#/dashboard" 
                                class="block w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors text-center font-medium"
                            >
                                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                                </svg>
                                Kembali ke Dashboard
                            </a>
                        </div>
                    </div>
                </div>
            `;
    }
  },

  // Cleanup method - dipanggil saat user navigate away dari page ini
  destroy() {
    console.log('🧹 Cleaning up profile page...');

    if (this.presenter) {
      this.presenter.destroy();
      this.presenter = null;
    }

    // Remove any global event listeners
    const refreshBtn = document.getElementById('refresh-profile');
    if (refreshBtn) {
      refreshBtn.removeEventListener('click', this.handleRefresh);
    }

    console.log('✅ Profile page cleaned up');
  },

  // Method untuk debugging
  getPresenter() {
    return this.presenter;
  },

  // Method untuk force refresh (untuk debugging atau admin tools)
  async forceRefresh() {
    if (this.presenter) {
      await this.presenter.handleRefreshProfile();
    }
  }
};

export default ProfilePage;