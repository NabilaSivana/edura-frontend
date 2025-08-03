// ===== FIXED: component/navbar.js =====
import Api from "../data/api.js";
import Cache from "../data/cache.js";

// Navbar state management
const NavbarState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  lastTokenCheck: null,
  authCheckPromise: null // Prevent multiple simultaneous auth checks
};

// Constants
const AUTH_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes
const TOKEN_VALIDATION_CACHE_KEY = 'token_validation_cache';

/**
 * Check if user is authenticated by validating token with /me endpoint
 * Returns: { isAuthenticated: boolean, user: object|null, error: string|null }
 */
async function checkAuthenticationStatus() {
  // Prevent multiple simultaneous auth checks
  if (NavbarState.authCheckPromise) {
    return NavbarState.authCheckPromise;
  }

  NavbarState.authCheckPromise = (async () => {
    try {
      // Step 1: Quick token existence check
      const token = localStorage.getItem('token');
      if (!token) {
        return {
          isAuthenticated: false,
          user: null,
          error: 'No token found'
        };
      }

      // Step 2: Check token expiration without API call
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Date.now() / 1000;
        
        if (payload.exp && payload.exp < now) {
          // Token expired, clean up
          clearAuthData();
          return {
            isAuthenticated: false,
            user: null,
            error: 'Token expired'
          };
        }
      } catch (tokenError) {
        // Invalid token format, clean up
        clearAuthData();
        return {
          isAuthenticated: false,
          user: null,
          error: 'Invalid token format'
        };
      }

      // Step 3: Check cache first to avoid unnecessary API calls
      const now = Date.now();
      const shouldSkipCheck = (
        NavbarState.lastTokenCheck &&
        (now - NavbarState.lastTokenCheck < AUTH_CHECK_INTERVAL) &&
        NavbarState.user &&
        NavbarState.isAuthenticated
      );

      if (shouldSkipCheck) {
        return {
          isAuthenticated: true,
          user: NavbarState.user,
          error: null
        };
      }

      // Step 4: Try to get user from cache
      const cachedUser = await Cache.get('api_/me');
      if (cachedUser && (now - NavbarState.lastTokenCheck < AUTH_CHECK_INTERVAL)) {
        NavbarState.user = cachedUser;
        NavbarState.isAuthenticated = true;
        NavbarState.lastTokenCheck = now;
        
        return {
          isAuthenticated: true,
          user: cachedUser,
          error: null
        };
      }

      // Step 5: Validate token with API call to /me
      NavbarState.isLoading = true;
      
      try {
        const user = await Api.getCurrentUser();
        
        // Success - update state and cache
        NavbarState.user = user;
        NavbarState.isAuthenticated = true;
        NavbarState.lastTokenCheck = now;
        
        // Cache the result
        await Cache.set('api_/me', user, 5 * 60 * 1000); // 5 minutes cache
        
        return {
          isAuthenticated: true,
          user: user,
          error: null
        };
        
      } catch (apiError) {
        console.warn('Token validation failed:', apiError.message);
        
        // Check if it's a network error vs auth error
        if (apiError.message?.includes('Network') || apiError.message?.includes('offline')) {
          // Network error - keep current state if we have cached data
          if (cachedUser) {
            return {
              isAuthenticated: true,
              user: cachedUser,
              error: null
            };
          }
        }
        
        // Auth error or no cache - clear auth data
        clearAuthData();
        
        return {
          isAuthenticated: false,
          user: null,
          error: apiError.message || 'Authentication failed'
        };
      }
      
    } catch (error) {
      console.error('Critical error in auth check:', error);
      
      // On critical error, clear auth data to be safe
      clearAuthData();
      
      return {
        isAuthenticated: false,
        user: null,
        error: 'Critical authentication error'
      };
      
    } finally {
      NavbarState.isLoading = false;
      NavbarState.authCheckPromise = null;
    }
  })();

  return NavbarState.authCheckPromise;
}

/**
 * Clear all authentication data
 */
function clearAuthData() {
  localStorage.removeItem('token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('user_role');
  NavbarState.user = null;
  NavbarState.isAuthenticated = false;
  NavbarState.lastTokenCheck = null;
  Cache.clear('api_/me');
}

/**
 * Check if current page is landing page
 */
function isLandingPage() {
  const currentHash = window.location.hash;
  const landingPages = ['#/', '#/home', '#/landing', '#/be-teacher', '#/terms'];
  return landingPages.includes(currentHash) || currentHash === '' || currentHash === '#';
}

/**
 * Render navbar HTML
 */
function renderNavbar() {
  // Determine initial state based on token and cache
  const hasToken = !!localStorage.getItem('token');
  const cachedUser = Cache.getFromMemory('api_/me');
  const shouldShowUser = hasToken && (NavbarState.isAuthenticated || cachedUser);
  
  const navbarContent = `
    <nav id="main-navbar" class="bg-white dark:bg-gray-800 shadow-md fixed top-0 left-0 w-full z-40 transition-all duration-300">
      <div class="px-4 py-3 flex justify-between items-center bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
        
        <div class="flex items-center gap-4">
          <!-- Universal Sidebar Toggle -->
          <button id="sidebar-toggle" class="flex items-center justify-center w-10 h-10 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <i class="fas fa-bars text-lg"></i>
          </button>
        </div>
        
        <div>
          <!-- Guest Links -->
          <div id="nav-guest" class="flex gap-4 ${shouldShowUser ? 'hidden' : ''}">
            <a href="/#/login" class="px-4 py-2 rounded border border-gray-300 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              Login
            </a>
            <a href="/#/register" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              Daftar
            </a>
          </div>
          
          <!-- User Profile -->
          <div id="nav-user" class="relative ${shouldShowUser ? '' : 'hidden'}">
            <button id="profile-toggle" class="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
              <i class="fa-solid fa-user"></i>
            </button>
            <div id="profile-popup" class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg shadow-lg hidden z-50">
              <div class="p-4 border-b dark:border-gray-600">
                <p id="profile-name" class="text-sm font-medium text-gray-700 dark:text-gray-200">Loading...</p>
                <p id="profile-role" class="text-xs text-gray-500 dark:text-gray-400">—</p>
              </div>
              <div class="py-2">
                <button id="logout-button" class="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <i class="fas fa-sign-out-alt mr-2"></i>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `;
  
  return navbarContent;
}

/**
 * Update navbar UI state
 */
function updateNavbarState(authResult) {
  const navGuest = document.getElementById("nav-guest");
  const navUser = document.getElementById("nav-user");
  const profileName = document.getElementById("profile-name");
  const profileRole = document.getElementById("profile-role");
  
  if (!navGuest || !navUser) return;
  
  if (authResult.isAuthenticated && authResult.user) {
    // Show user state
    navGuest.classList.add("hidden");
    navUser.classList.remove("hidden");
    
    // Update user info
    if (profileName) {
      profileName.textContent = authResult.user.full_name || authResult.user.name || "User";
    }
    if (profileRole) {
      profileRole.textContent = authResult.user.role ? authResult.user.role.charAt(0).toUpperCase() + authResult.user.role.slice(1) : "User";
    }
  } else {
    // Show guest state
    navUser.classList.add("hidden");
    navGuest.classList.remove("hidden");
  }
  
  // Update navbar position and sidebar visibility
  updateNavbarPosition();
  updateSidebarToggleVisibility();
}

/**
 * Update navbar position based on sidebar state
 */
function updateNavbarPosition() {
  const navbar = document.getElementById('main-navbar');
  const navUser = document.getElementById('nav-user');
  if (!navbar || !navUser) return;
  
  const isDesktop = window.innerWidth >= 768;
  const isLoggedIn = !navUser.classList.contains("hidden");
  const isLanding = isLandingPage();
  
  if (isDesktop && isLoggedIn && !isLanding) {
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    const sidebarWidth = isCollapsed ? '80px' : '256px';
    navbar.style.marginLeft = sidebarWidth;
    navbar.style.width = `calc(100% - ${sidebarWidth})`;
  } else {
    navbar.style.marginLeft = '0';
    navbar.style.width = '100%';
  }
}

/**
 * Update sidebar toggle visibility
 */
function updateSidebarToggleVisibility() {
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const navUser = document.getElementById("nav-user");
  if (!sidebarToggle || !navUser) return;
  
  const isLoggedIn = !navUser.classList.contains("hidden");
  const isLanding = isLandingPage();
  
  // Hide hamburger menu on landing page
  sidebarToggle.style.display = isLanding ? 'none' : 'flex';
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Sidebar toggle handler
  const sidebarToggle = document.getElementById("sidebar-toggle");
  if (sidebarToggle) {
    // Remove existing listeners
    const newToggle = sidebarToggle.cloneNode(true);
    sidebarToggle.parentNode.replaceChild(newToggle, sidebarToggle);
    
    newToggle.addEventListener("click", handleSidebarToggle);
  }
  
  // Profile popup handler
  const profileToggle = document.getElementById("profile-toggle");
  const profilePopup = document.getElementById("profile-popup");
  if (profileToggle && profilePopup) {
    // Remove existing listeners
    const newProfileToggle = profileToggle.cloneNode(true);
    profileToggle.parentNode.replaceChild(newProfileToggle, profileToggle);
    
    newProfileToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      profilePopup.classList.toggle("hidden");
    });
    
    // Close popup when clicking outside
    document.removeEventListener("click", window.navbarProfileClickHandler);
    window.navbarProfileClickHandler = (e) => {
      if (!profilePopup.contains(e.target) && e.target !== newProfileToggle) {
        profilePopup.classList.add("hidden");
      }
    };
    document.addEventListener("click", window.navbarProfileClickHandler);
  }
  
  // Logout handler
  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    // Remove existing listeners
    const newLogoutButton = logoutButton.cloneNode(true);
    logoutButton.parentNode.replaceChild(newLogoutButton, logoutButton);
    
    newLogoutButton.addEventListener("click", handleLogout);
  }
}

/**
 * Handle sidebar toggle
 */
function handleSidebarToggle(e) {
  e.preventDefault();
  e.stopPropagation();
  
  const isDesktop = window.innerWidth >= 768;
  const isLoggedIn = !document.getElementById("nav-user").classList.contains("hidden");
  const isLanding = isLandingPage();
  
  if (isLanding) return;
  
  if (isDesktop && isLoggedIn) {
    // Desktop: Toggle collapse/expand
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    const newState = !isCollapsed;
    localStorage.setItem('sidebarCollapsed', newState);
    
    // Update sidebar
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      if (newState) {
        sidebar.classList.add('sidebar-collapsed');
        sidebar.style.width = '80px';
      } else {
        sidebar.classList.remove('sidebar-collapsed');
        sidebar.style.width = '256px';
      }
    }
    
    // Update navbar position
    updateNavbarPosition();
    
    // Update toggle icon
    const icon = e.target.closest('button').querySelector('i');
    if (icon) {
      icon.className = newState ? 'fas fa-chevron-right text-lg' : 'fas fa-bars text-lg';
    }
    
    // Dispatch event
    window.dispatchEvent(new CustomEvent('sidebar-toggle', {
      detail: { collapsed: newState }
    }));
  } else {
    // Mobile: Toggle slide
    const sidebarWrapper = document.getElementById("sidebar-wrapper");
    const overlay = document.getElementById("sidebar-overlay");
    if (sidebarWrapper) {
      const sidebar = sidebarWrapper.querySelector("#sidebar");
      if (sidebar) {
        sidebar.classList.toggle("-translate-x-full");
        sidebar.classList.toggle("lg:translate-x-0");
        if (overlay) {
          overlay.classList.toggle("hidden");
        }
      }
    }
  }
}

/**
 * Handle logout
 */
async function handleLogout() {
  try {
    // Clear all data
    clearAuthData();
    Cache.clear();
    Api.clearAllCache();
    localStorage.removeItem("sidebarCollapsed");
    
    // Dispatch events
    window.dispatchEvent(new CustomEvent('clear-navigation-cache'));
    window.dispatchEvent(new CustomEvent('logout'));
    
    // Redirect
    window.location.hash = "#/login";
    window.location.reload();
  } catch (error) {
    console.error('Error during logout:', error);
    // Force reload on error
    window.location.reload();
  }
}

/**
 * Setup resize and hash change handlers
 */
function setupGlobalHandlers() {
  // Resize handler
  const handleResize = () => {
    updateNavbarPosition();
    updateSidebarToggleVisibility();
    
    // Update toggle icon
    const sidebarToggle = document.getElementById("sidebar-toggle");
    const isLoggedIn = !document.getElementById("nav-user").classList.contains("hidden");
    const isLanding = isLandingPage();
    
    if (sidebarToggle) {
      const icon = sidebarToggle.querySelector('i');
      if (window.innerWidth >= 768 && isLoggedIn && !isLanding) {
        const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (icon) {
          icon.className = isCollapsed ? 'fas fa-chevron-right text-lg' : 'fas fa-bars text-lg';
        }
      } else {
        if (icon) {
          icon.className = 'fas fa-bars text-lg';
        }
      }
    }
  };
  
  // Hash change handler
  const handleHashChange = () => {
    updateNavbarPosition();
    updateSidebarToggleVisibility();
  };
  
  // Remove existing handlers
  window.removeEventListener('resize', window.navbarResizeHandler);
  window.removeEventListener('hashchange', window.navbarHashChangeHandler);
  
  // Add new handlers
  window.navbarResizeHandler = handleResize;
  window.navbarHashChangeHandler = handleHashChange;
  window.addEventListener('resize', window.navbarResizeHandler);
  window.addEventListener('hashchange', window.navbarHashChangeHandler);
}

/**
 * Main after render function
 */
async function afterRenderNavbar() {
  try {
    // Setup event listeners
    setupEventListeners();
    
    // Setup global handlers
    setupGlobalHandlers();
    
    // Check authentication and update UI
    const authResult = await checkAuthenticationStatus();
    updateNavbarState(authResult);
    
    console.log('✅ Navbar initialized successfully', { 
      isAuthenticated: authResult.isAuthenticated,
      user: authResult.user?.full_name || 'None'
    });
    
  } catch (error) {
    console.error('❌ Error in navbar after render:', error);
    
    // Fallback to guest state on error
    updateNavbarState({
      isAuthenticated: false,
      user: null,
      error: error.message
    });
  }
}

// Listen for events
window.addEventListener('login-success', async () => {
  console.log('🔄 Login success detected, refreshing navbar');
  NavbarState.lastTokenCheck = null; // Force refresh
  setTimeout(async () => {
    const authResult = await checkAuthenticationStatus();
    updateNavbarState(authResult);
  }, 100);
});

window.addEventListener('logout', () => {
  console.log('🔄 Logout detected, updating navbar');
  clearAuthData();
  updateNavbarState({
    isAuthenticated: false,
    user: null,
    error: null
  });
});

window.addEventListener('profile-updated', async () => {
  console.log('🔄 Profile updated, refreshing navbar');
  Cache.clear('api_/me');
  NavbarState.lastTokenCheck = null; // Force refresh
  const authResult = await checkAuthenticationStatus();
  updateNavbarState(authResult);
});

window.addEventListener('sidebar-toggle', () => {
  updateNavbarPosition();
});

// Export navbar component
export default function navbar() {
  return {
    render: renderNavbar,
    afterRender: afterRenderNavbar,
    // Helper functions
    checkAuth: checkAuthenticationStatus,
    updateState: updateNavbarState,
    clearAuth: clearAuthData,
    // Force refresh function
    forceRefresh: async () => {
      NavbarState.lastTokenCheck = null;
      Cache.clear('api_/me');
      const authResult = await checkAuthenticationStatus();
      updateNavbarState(authResult);
    }
  };
}