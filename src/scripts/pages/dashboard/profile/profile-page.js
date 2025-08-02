// // src/scripts/pages/dashboard/profile/profile-page.js
// import createSidebar from "../../../component/sidebar.js";
// import ProfileView from "./view.js";
// import ProfilePresenter from "./presenter.js";

// const ProfilePage = {
//   // Page state
//   _isInitialized: false,
//   _cleanup: null,

//   async render() {
//     console.log('🎨 Rendering Profile Page...');
//     return ProfileView.render();
//   },

//   async afterRender() {
//     try {
//       console.log('⚙️ Initializing Profile Page components...');

//       // Setup layout components
//       await this.setupSidebar();
//       await this.setupNavbar();

//       // Initialize presenter (this will load data and setup UI)
//       await ProfilePresenter.init();

//       // Setup page-specific features
//       this.setupPageFeatures();

//       this._isInitialized = true;
//       console.log('✅ Profile Page initialized successfully');

//     } catch (error) {
//       console.error('❌ Error initializing Profile Page:', error);
//       this.showInitializationError(error);
//     }
//   },

//   async setupSidebar() {
//     try {
//       const sidebarWrapper = document.getElementById("sidebar-wrapper");
//       if (!sidebarWrapper) return;

//       sidebarWrapper.innerHTML = "";

//       // Get total courses for credit display (for students)
//       let totalCourses = 0;
//       try {
//         const Api = (await import("../../../data/api.js")).default;
//         const user = await Api.utils.getCurrentUser();

//         if (user?.role === 'student') {
//           const courses = await Api.student.getStudentCourses();
//           totalCourses = Array.isArray(courses) ? courses.length : 0;
//         }
//       } catch (error) {
//         console.warn('⚠️ Could not get course count for sidebar:', error);
//         // Continue without course count - sidebar will handle gracefully
//       }

//       const sidebar = await createSidebar(totalCourses);
//       sidebarWrapper.appendChild(sidebar);

//       console.log('✅ Sidebar setup complete');
//     } catch (error) {
//       console.error('❌ Error setting up sidebar:', error);
//       // Don't throw, continue with page initialization
//     }
//   },

//   async setupNavbar() {
//     try {
//       const navbarModule = (await import("../../../component/navbar.js")).default;
//       const navbarContainer = document.getElementById("navbar-container");

//       if (navbarContainer && navbarModule) {
//         navbarContainer.innerHTML = navbarModule().render();
//         navbarModule().afterRender();
//         console.log('✅ Navbar setup complete');
//       }
//     } catch (error) {
//       console.error('❌ Error setting up navbar:', error);
//       // Don't throw, continue with page initialization
//     }
//   },

//   setupPageFeatures() {
//     try {
//       // Setup keyboard shortcuts
//       this.setupKeyboardShortcuts();

//       // Setup theme change listener
//       this.setupThemeChangeListener();

//       // Setup responsive handlers
//       this.setupResponsiveHandlers();

//       // Setup auto-save protection
//       this.setupAutoSaveProtection();

//       console.log('✅ Page features setup complete');

//     } catch (error) {
//       console.warn('⚠️ Error setting up page features:', error);
//       // Don't throw, this is optional functionality
//     }
//   },

//   setupKeyboardShortcuts() {
//     const handleKeydown = (e) => {
//       // Ctrl/Cmd + S to save current focused section
//       if ((e.ctrlKey || e.metaKey) && e.key === 's') {
//         e.preventDefault();
//         this.handleQuickSave();
//       }

//       // Ctrl/Cmd + Shift + R to refresh profile data
//       if ((e.ctrlKey || e.metaKey) && e.key === 'r' && e.shiftKey) {
//         e.preventDefault();
//         this.refreshProfile();
//       }

//       // Escape to close modals
//       if (e.key === 'Escape') {
//         this.closeActiveModals();
//       }
//     };

//     document.addEventListener('keydown', handleKeydown);
//     this._keydownHandler = handleKeydown;
//   },

//   setupThemeChangeListener() {
//     const handleThemeChange = (e) => {
//       console.log('🎨 Theme changed:', e.detail?.isDark ? 'dark' : 'light');

//       // Update any theme-dependent elements
//       this.updateThemeElements();
//     };

//     window.addEventListener('themechange', handleThemeChange);
//     this._themeChangeHandler = handleThemeChange;
//   },

//   setupResponsiveHandlers() {
//     const handleResize = () => {
//       // Handle responsive layout changes
//       this.updateResponsiveElements();
//     };

//     window.addEventListener('resize', handleResize);
//     this._resizeHandler = handleResize;

//     // Initial responsive setup
//     this.updateResponsiveElements();
//   },

//   setupAutoSaveProtection() {
//     // Warn user about unsaved changes when leaving
//     const handleBeforeUnload = (e) => {
//       if (this.hasUnsavedChanges()) {
//         e.preventDefault();
//         e.returnValue = '';
//         return 'You have unsaved changes. Are you sure you want to leave?';
//       }
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);
//     this._beforeUnloadHandler = handleBeforeUnload;
//   },

//   // ============================================
//   // HELPER METHODS
//   // ============================================

//   handleQuickSave() {
//     // Determine which section to save based on focus
//     const activeElement = document.activeElement;
//     if (!activeElement) return;

//     const elementId = activeElement.id;

//     if (elementId.startsWith('basic-')) {
//       const saveBtn = document.getElementById('save-basic-profile');
//       if (saveBtn && !saveBtn.disabled) {
//         saveBtn.click();
//       }
//     } else if (elementId.startsWith('teacher-')) {
//       const saveBtn = document.getElementById('save-teacher-profile');
//       if (saveBtn && !saveBtn.disabled) {
//         saveBtn.click();
//       }
//     } else if (elementId.startsWith('student-')) {
//       const saveBtn = document.getElementById('save-student-profile');
//       if (saveBtn && !saveBtn.disabled) {
//         saveBtn.click();
//       }
//     }
//   },

//   async refreshProfile() {
//     try {
//       console.log('🔄 Manual refresh triggered...');

//       if (ProfilePresenter && ProfilePresenter.refreshProfile) {
//         await ProfilePresenter.refreshProfile();
//         this.showNotification('Profile data refreshed!', 'success');
//       }
//     } catch (error) {
//       console.error('❌ Error during refresh:', error);
//       this.showNotification('Failed to refresh profile data', 'error');
//     }
//   },

//   closeActiveModals() {
//     // Close join class modal
//     const joinModal = document.getElementById('join-class-modal');
//     if (joinModal && !joinModal.classList.contains('hidden')) {
//       joinModal.classList.add('hidden');
//       joinModal.classList.remove('flex');
//     }

//     // Close any other modals that might be open
//     const modals = document.querySelectorAll('.modal, [role="dialog"]');
//     modals.forEach(modal => {
//       if (modal.classList.contains('flex') || !modal.classList.contains('hidden')) {
//         modal.classList.add('hidden');
//         modal.classList.remove('flex');
//       }
//     });
//   },

//   updateThemeElements() {
//     // Update any elements that need special theme handling
//     // This could include charts, custom graphics, etc.

//     // Example: Update completion card gradient based on theme
//     const completionCards = document.querySelectorAll('.bg-gradient-to-br');
//     completionCards.forEach(card => {
//       // Theme-specific updates if needed
//     });
//   },

//   updateResponsiveElements() {
//     // Handle responsive-specific updates
//     const width = window.innerWidth;

//     // Example: Adjust layout for mobile
//     if (width < 768) {
//       // Mobile-specific adjustments
//       this.adjustForMobile();
//     } else {
//       // Desktop-specific adjustments
//       this.adjustForDesktop();
//     }
//   },

//   adjustForMobile() {
//     // Mobile-specific UI adjustments
//     const cards = document.querySelectorAll('.grid');
//     cards.forEach(card => {
//       // Ensure single column on mobile
//       card.classList.remove('lg:grid-cols-2');
//       card.classList.add('grid-cols-1');
//     });
//   },

//   adjustForDesktop() {
//     // Desktop-specific UI adjustments
//     const cards = document.querySelectorAll('.grid');
//     cards.forEach(card => {
//       // Restore multi-column layout on desktop
//       if (card.classList.contains('grid-cols-1')) {
//         card.classList.add('lg:grid-cols-2');
//       }
//     });
//   },

//   hasUnsavedChanges() {
//     // Check if any form fields have been modified
//     const inputs = document.querySelectorAll('#profile-container input, #profile-container select');

//     for (let input of inputs) {
//       if (input.dataset.originalValue !== undefined && 
//           input.value !== input.dataset.originalValue) {
//         return true;
//       }
//     }

//     return false;
//   },

//   showNotification(message, type = 'info') {
//     // Use ProfilePresenter's toast system if available
//     if (ProfilePresenter) {
//       if (type === 'success' && ProfilePresenter.showSuccessToast) {
//         ProfilePresenter.showSuccessToast(message);
//       } else if (type === 'error' && ProfilePresenter.showErrorToast) {
//         ProfilePresenter.showErrorToast(message);
//       }
//     } else {
//       // Fallback notification
//       console.log(`${type.toUpperCase()}: ${message}`);
//     }
//   },

//   showInitializationError(error) {
//     const container = document.querySelector("main") || document.body;

//     if (container) {
//       container.innerHTML = `
//         <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
//           <div class="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
//             <div class="text-center">
//               <div class="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <i class="fas fa-exclamation-triangle text-red-600 dark:text-red-400 text-lg sm:text-2xl"></i>
//               </div>
//               <h2 class="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2">
//                 Profile Tidak Dapat Dimuat
//               </h2>
//               <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
//                 Terjadi kesalahan saat memuat halaman profile Anda.
//               </p>
//               <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-6">
//                 <p class="text-xs sm:text-sm text-red-700 dark:text-red-400">
//                   <strong>Error:</strong> ${error.message || 'Kesalahan tidak dikenal'}
//                 </p>
//               </div>
//               <div class="space-y-3">
//                 <button 
//                   onclick="location.reload()"
//                   class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 flex items-center justify-center text-sm"
//                 >
//                   <i class="fas fa-sync-alt mr-2"></i>
//                   Muat Ulang Halaman
//                 </button>
//                 <button 
//                   onclick="window.history.back()"
//                   class="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 flex items-center justify-center text-sm"
//                 >
//                   <i class="fas fa-arrow-left mr-2"></i>
//                   Kembali
//                 </button>
//                 <a 
//                   href="#/dashboard" 
//                   class="block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 text-center text-sm"
//                 >
//                   <i class="fas fa-home mr-2"></i>
//                   Dashboard
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       `;
//     }
//   },

//   // ============================================
//   // LIFECYCLE METHODS
//   // ============================================

//   destroy() {
//     try {
//       console.log('🧹 Cleaning up Profile Page...');

//       // Cleanup presenter
//       if (ProfilePresenter && ProfilePresenter.destroy) {
//         ProfilePresenter.destroy();
//       }

//       // Remove global event listeners
//       this.removeGlobalListeners();

//       // Clear state
//       this._isInitialized = false;

//       console.log('✅ Profile Page cleanup complete');

//     } catch (error) {
//       console.error('❌ Error during Profile Page cleanup:', error);
//     }
//   },

//   removeGlobalListeners() {
//     // Remove keyboard shortcut listener
//     if (this._keydownHandler) {
//       document.removeEventListener('keydown', this._keydownHandler);
//       this._keydownHandler = null;
//     }

//     // Remove theme change listener
//     if (this._themeChangeHandler) {
//       window.removeEventListener('themechange', this._themeChangeHandler);
//       this._themeChangeHandler = null;
//     }

//     // Remove resize listener
//     if (this._resizeHandler) {
//       window.removeEventListener('resize', this._resizeHandler);
//       this._resizeHandler = null;
//     }

//     // Remove beforeunload listener
//     if (this._beforeUnloadHandler) {
//       window.removeEventListener('beforeunload', this._beforeUnloadHandler);
//       this._beforeUnloadHandler = null;
//     }
//   },

//   // ============================================
//   // PUBLIC API
//   // ============================================

//   // Get current page state (useful for debugging)
//   getState() {
//     try {
//       return {
//         isInitialized: this._isInitialized,
//         presenterData: ProfilePresenter.getCurrentData(),
//         completionPercentage: ProfilePresenter.getProfileCompletion(),
//         isProfileComplete: ProfilePresenter.isProfileComplete(),
//         hasUnsavedChanges: this.hasUnsavedChanges(),
//         timestamp: new Date().toISOString()
//       };
//     } catch (error) {
//       return {
//         error: error.message,
//         timestamp: new Date().toISOString()
//       };
//     }
//   },

//   // Check if profile is complete
//   isProfileComplete() {
//     try {
//       return ProfilePresenter.isProfileComplete();
//     } catch (error) {
//       console.error('❌ Error checking profile completion:', error);
//       return false;
//     }
//   },

//   // Export profile data (for debugging or backup)
//   async exportProfileData() {
//     try {
//       const data = ProfilePresenter.getCurrentData();
//       if (!data) {
//         throw new Error('No profile data available');
//       }

//       const exportData = {
//         basic: data.basic,
//         role: data.role,
//         userRole: data.userRole,
//         exportedAt: new Date().toISOString(),
//         version: '1.0'
//       };

//       // Create downloadable JSON file
//       const blob = new Blob([JSON.stringify(exportData, null, 2)], {
//         type: 'application/json'
//       });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `profile-data-${new Date().toISOString().split('T')[0]}.json`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       URL.revokeObjectURL(url);

//       console.log('✅ Profile data exported successfully');
//       this.showNotification('Profile data exported!', 'success');

//     } catch (error) {
//       console.error('❌ Error exporting profile data:', error);
//       this.showNotification('Failed to export profile data', 'error');
//     }
//   },

//   // Force refresh profile data
//   async forceRefresh() {
//     try {
//       await this.refreshProfile();
//     } catch (error) {
//       console.error('❌ Error during force refresh:', error);
//       this.showNotification('Failed to refresh profile', 'error');
//     }
//   },

//   // Check if page is ready
//   isReady() {
//     return this._isInitialized && ProfilePresenter.isInitialized;
//   }
// };

// // Make page available globally for debugging in development
// if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
//   window.ProfilePage = ProfilePage;
// }

// export default ProfilePage;
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