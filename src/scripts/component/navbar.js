// // FILE: component/navbar.js
// import Api from "../data/api.js";
// import Cache from "../data/cache.js";

// // Custom function untuk navbar yang tidak redirect
// async function getCurrentUserForNavbar() {
//   const cacheKey = 'api_/me';

//   // Check cache first
//   const cachedData = Cache.get(cacheKey);
//   if (cachedData) {
//     //console.log('[Navbar] Using cached user data');
//     return cachedData;
//   }

//   // If no cache, fetch manually without redirect
//   const token = localStorage.getItem('token');
//   if (!token) {
//     throw new Error('No token');
//   }

//   const response = await fetch(`${CONFIG.BASE_URL}/me`, {
//     headers: {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     }
//   });

//   if (!response.ok) {
//     throw new Error('Not authenticated');
//   }

//   const userData = await response.json();

//   // Cache the result
//   Cache.set(cacheKey, userData, 5 * 60 * 1000); // 5 minutes

//   return userData;
// }

// // Function to check if current page is landing page
// function isLandingPage() {
//   const currentHash = window.location.hash;
//   // Daftar halaman yang dianggap sebagai landing page
//   const landingPages = ['#/', '#/home', '#/landing', '#/be-teacher','#/terms'];
//   return landingPages.includes(currentHash) || currentHash === '' || currentHash === '#';
// }

// function renderNavbar() {
//   return `
//     <nav id="main-navbar" class="bg-white dark:bg-gray-800 shadow-md fixed top-0 left-0 w-full z-40 transition-all duration-300">
//       <div class="px-4 py-3 flex justify-between items-center bg-white dark:bg-gray-800 text-gray-800 dark:text-white">

//         <div class="flex items-center gap-4">
//           <!-- Universal Sidebar Toggle - akan disembunyikan di landing page saat login -->
//           <button id="sidebar-toggle" class="flex items-center justify-center w-10 h-10 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
//             <i class="fas fa-bars text-lg"></i>
//           </button>


//         </div>

//         <div>
//           <!-- Guest Links -->
//           <div id="nav-guest" class="flex gap-4 hidden">
//             <a href="/#/login" class="px-4 py-2 rounded border border-gray-300 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">Login</a>
//             <a href="/#/register" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Daftar</a>
//           </div>

//           <!-- User Profile -->
//           <div id="nav-user" class="relative hidden">
//             <button id="profile-toggle" class="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center">
//               <i class="fa-solid fa-user"></i>
//             </button>
//             <div id="profile-popup" class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded shadow-lg hidden z-50">
//               <div class="p-4 border-b dark:border-gray-600">
//                 <p id="profile-name" class="text-sm font-medium text-gray-700 dark:text-gray-200">—</p>
//               </div>
//               <button id="logout-button" class="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-600">
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>

//       </div>
//     </nav>
//   `;
// }

// // Function to update navbar position based on sidebar state
// function updateNavbarPosition() {
//   const navbar = document.getElementById('main-navbar');
//   const navUser = document.getElementById('nav-user');

//   // 🚀 FIX: Guard clause untuk menghentikan eksekusi jika elemen navbar tidak ada
//   if (!navbar || !navUser) {
//     return; // Keluar dari fungsi jika elemen tidak ditemukan
//   }

//   const isDesktop = window.innerWidth >= 768;
//   const isLoggedIn = !navUser.classList.contains("hidden"); // Baris ini sekarang aman
//   const isLanding = isLandingPage();

//   if (isDesktop && isLoggedIn && !isLanding) {
//     const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
//     const sidebarWidth = isCollapsed ? '80px' : '256px';

//     navbar.style.marginLeft = sidebarWidth;
//     navbar.style.width = `calc(100% - ${sidebarWidth})`;
//   } else {
//     navbar.style.marginLeft = '0';
//     navbar.style.width = '100%';
//   }
// }

// function updateSidebarToggleVisibility() {
//   const sidebarToggle = document.getElementById("sidebar-toggle");
//   const navUser = document.getElementById("nav-user");

//   // 🚀 FIX: Guard clause untuk menghentikan eksekusi jika elemen navbar tidak ada
//   if (!sidebarToggle || !navUser) {
//     return; // Keluar dari fungsi jika elemen tidak ditemukan
//   }

//   const isLoggedIn = !navUser.classList.contains("hidden");
//   const isLanding = isLandingPage();

//   if (isLoggedIn && isLanding) {
//     sidebarToggle.style.display = 'none';
//   } else {
//     sidebarToggle.style.display = 'flex';
//   }
// }
// async function afterRenderNavbar() {
//   // Universal Sidebar Toggle Handler
//   const sidebarToggle = document.getElementById("sidebar-toggle");
//   if (sidebarToggle) {
//     sidebarToggle.addEventListener("click", () => {
//       const isDesktop = window.innerWidth >= 768;
//       const isLoggedIn = !document.getElementById("nav-user").classList.contains("hidden");
//       const isLanding = isLandingPage();

//       // Jangan lakukan apa-apa jika di landing page saat login
//       if (isLanding && isLoggedIn) {
//         return;
//       }

//       if (isDesktop && isLoggedIn) {
//         // Desktop: Toggle collapse/expand
//         const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
//         const newState = !isCollapsed;
//         localStorage.setItem('sidebarCollapsed', newState);

//         // Update sidebar state
//         const sidebar = document.getElementById('sidebar');
//         if (sidebar) {
//           if (newState) {
//             sidebar.classList.add('sidebar-collapsed');
//             sidebar.style.width = '80px';
//           } else {
//             sidebar.classList.remove('sidebar-collapsed');
//             sidebar.style.width = '256px';
//           }
//         }

//         // Update navbar position
//         updateNavbarPosition();

//         // Update icon
//         const icon = sidebarToggle.querySelector('i');
//         if (icon) {
//           icon.className = newState ? 'fas fa-chevron-right text-lg' : 'fas fa-bars text-lg';
//         }

//         // Dispatch event untuk sidebar component
//         window.dispatchEvent(new CustomEvent('sidebar-toggle', {
//           detail: { collapsed: newState }
//         }));
//       } else {
//         // Mobile: Toggle slide in/out
//         const sidebarWrapper = document.getElementById("sidebar-wrapper");
//         const overlay = document.getElementById("sidebar-overlay");

//         if (sidebarWrapper) {
//           const sidebar = sidebarWrapper.querySelector("#sidebar");

//           if (sidebar) {
//             sidebar.classList.toggle("-translate-x-full");
//             sidebar.classList.toggle("lg:translate-x-0");

//             if (overlay) {
//               overlay.classList.toggle("hidden");
//             }
//           }
//         }
//       }
//     });
//   }

//   // 2. Cek login via API dengan cache (tanpa redirect)
//   try {
//     const user = await getCurrentUserForNavbar();

//     // Hide guest panel, show user panel
//     document.getElementById("nav-guest").classList.add("hidden");
//     const navUser = document.getElementById("nav-user");
//     navUser.classList.remove("hidden");
//     document.getElementById("profile-name").textContent = user.full_name;

//     // Update navbar position untuk desktop
//     updateNavbarPosition();

//     // Update sidebar toggle visibility
//     updateSidebarToggleVisibility();

//     // Set initial sidebar toggle icon for desktop when logged in
//     const sidebarToggle = document.getElementById("sidebar-toggle");
//     if (sidebarToggle && window.innerWidth >= 768) {
//       const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
//       const isLanding = isLandingPage();
//       const icon = sidebarToggle.querySelector('i');

//       if (icon && !isLanding) {
//         icon.className = isCollapsed ? 'fas fa-chevron-right text-lg' : 'fas fa-bars text-lg';
//       }
//     }

//     // Profile popup toggle
//     const toggleBtn = document.getElementById("profile-toggle");
//     const popup = document.getElementById("profile-popup");
//     toggleBtn.addEventListener("click", () => popup.classList.toggle("hidden"));
//     document.addEventListener("click", (e) => {
//       if (!popup.contains(e.target) && e.target !== toggleBtn) {
//         popup.classList.add("hidden");
//       }
//     });

//     // Logout
//     document.getElementById("logout-button").addEventListener("click", () => {
//       // Clear cache saat logout
//       Cache.clear();
//       Api.clearAllCache();
//       localStorage.removeItem("token");
//       localStorage.removeItem("sidebarCollapsed"); // Clear sidebar state
//       window.location.hash = "#/login";
//       window.location.reload();
//     });

//   } catch {
//     // Show guest panel, hide user panel
//     document.getElementById("nav-user").classList.add("hidden");
//     document.getElementById("nav-guest").classList.remove("hidden");

//     // Reset navbar position when not logged in
//     updateNavbarPosition();

//     // Update sidebar toggle visibility
//     updateSidebarToggleVisibility();

//     // Reset sidebar toggle icon to hamburger when not logged in
//     const sidebarToggle = document.getElementById("sidebar-toggle");
//     if (sidebarToggle) {
//       const icon = sidebarToggle.querySelector('i');
//       if (icon) {
//         icon.className = 'fas fa-bars text-lg';
//       }
//     }
//   }

//   // Handle window resize untuk responsive behavior
//   window.addEventListener('resize', () => {
//     const sidebarToggle = document.getElementById("sidebar-toggle");
//     const isLoggedIn = !document.getElementById("nav-user").classList.contains("hidden");
//     const isLanding = isLandingPage();

//     // Update navbar position
//     updateNavbarPosition();

//     // Update sidebar toggle visibility
//     updateSidebarToggleVisibility();

//     if (sidebarToggle) {
//       const icon = sidebarToggle.querySelector('i');
//       if (window.innerWidth >= 768 && isLoggedIn && !isLanding) {
//         // Desktop mode when logged in and not landing page
//         const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
//         if (icon) {
//           icon.className = isCollapsed ? 'fas fa-chevron-right text-lg' : 'fas fa-bars text-lg';
//         }
//       } else {
//         // Mobile mode, not logged in, atau landing page
//         if (icon) {
//           icon.className = 'fas fa-bars text-lg';
//         }
//       }
//     }
//   });

//   // Handle hash change untuk update navbar saat navigasi
//   window.addEventListener('hashchange', () => {
//     updateNavbarPosition();
//     updateSidebarToggleVisibility();
//   });
// }

// // Listen for profile updates to refresh navbar
// window.addEventListener('profile-updated', async () => {
//   // Clear user cache
//   Cache.clear('api_/me');

//   // Re-run afterRenderNavbar to update UI
//   afterRenderNavbar();
// });

// // Listen for sidebar toggle events
// window.addEventListener('sidebar-toggle', (e) => {
//   updateNavbarPosition();
// });

// export default function navbar() {
//   return {
//     render: renderNavbar,
//     afterRender: afterRenderNavbar,
//   };
// }
// ===== OPTIMIZED: component/navbar.js =====
import Api from "../data/api.js";
import Cache from "../data/cache.js";

// Cached user data to prevent repeated API calls
let cachedNavbarUser = null;
let lastNavbarRender = null;

// Custom function untuk navbar yang tidak redirect
async function getCurrentUserForNavbar() {
  const cacheKey = 'api_/me';

  // Check memory cache first
  if (cachedNavbarUser) {
    return cachedNavbarUser;
  }

  // Check storage cache
  const cachedData = Cache.get(cacheKey);
  if (cachedData) {
    cachedNavbarUser = cachedData;
    return cachedData;
  }

  // If no cache, fetch manually without redirect
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token');
  }

  const response = await fetch(`${CONFIG.BASE_URL}/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Not authenticated');
  }

  const userData = await response.json();

  // Cache the result
  Cache.set(cacheKey, userData, 5 * 60 * 1000); // 5 minutes
  cachedNavbarUser = userData;

  return userData;
}

// Function to check if current page is landing page
function isLandingPage() {
  const currentHash = window.location.hash;
  const landingPages = ['#/', '#/home', '#/landing', '#/be-teacher', '#/terms'];
  return landingPages.includes(currentHash) || currentHash === '' || currentHash === '#';
}

function renderNavbar() {
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
          <div id="nav-guest" class="flex gap-4 hidden">
            <a href="/#/login" class="px-4 py-2 rounded border border-gray-300 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">Login</a>
            <a href="/#/register" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Daftar</a>
          </div>

          <!-- User Profile -->
          <div id="nav-user" class="relative hidden">
            <button id="profile-toggle" class="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center">
              <i class="fa-solid fa-user"></i>
            </button>
            <div id="profile-popup" class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded shadow-lg hidden z-50">
              <div class="p-4 border-b dark:border-gray-600">
                <p id="profile-name" class="text-sm font-medium text-gray-700 dark:text-gray-200">—</p>
              </div>
              <button id="logout-button" class="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-600">
                Logout
              </button>
            </div>
          </div>
        </div>

      </div>
    </nav>
  `;

  // Cache the render result
  lastNavbarRender = navbarContent;
  return navbarContent;
}

// Optimized navbar position update with throttling
let updatePositionTimeout = null;
function updateNavbarPosition() {
  if (updatePositionTimeout) {
    return; // Skip if update is already scheduled
  }

  updatePositionTimeout = setTimeout(() => {
    const navbar = document.getElementById('main-navbar');
    const navUser = document.getElementById('nav-user');

    if (!navbar || !navUser) {
      updatePositionTimeout = null;
      return;
    }

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

    updatePositionTimeout = null;
  }, 16); // ~60fps throttling
}

function updateSidebarToggleVisibility() {
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const navUser = document.getElementById("nav-user");

  if (!sidebarToggle || !navUser) {
    return;
  }

  const isLoggedIn = !navUser.classList.contains("hidden");
  const isLanding = isLandingPage();

  if (isLoggedIn && isLanding) {
    sidebarToggle.style.display = 'none';
  } else {
    sidebarToggle.style.display = 'flex';
  }
}

// Optimized afterRender with better event handling
async function afterRenderNavbar() {
  // Clear previous event listeners to prevent duplicates
  const existingToggle = document.getElementById("sidebar-toggle");
  if (existingToggle) {
    existingToggle.replaceWith(existingToggle.cloneNode(true));
  }

  // Universal Sidebar Toggle Handler
  const sidebarToggle = document.getElementById("sidebar-toggle");
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const isDesktop = window.innerWidth >= 768;
      const isLoggedIn = !document.getElementById("nav-user").classList.contains("hidden");
      const isLanding = isLandingPage();

      // Don't do anything if on landing page when logged in
      if (isLanding && isLoggedIn) {
        return;
      }

      if (isDesktop && isLoggedIn) {
        // Desktop: Toggle collapse/expand
        const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        const newState = !isCollapsed;
        localStorage.setItem('sidebarCollapsed', newState);

        // Update sidebar state
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

        // Update icon
        const icon = sidebarToggle.querySelector('i');
        if (icon) {
          icon.className = newState ? 'fas fa-chevron-right text-lg' : 'fas fa-bars text-lg';
        }

        // Dispatch event untuk sidebar component
        window.dispatchEvent(new CustomEvent('sidebar-toggle', {
          detail: { collapsed: newState }
        }));
      } else {
        // Mobile: Toggle slide in/out
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
    });
  }

  // Check login status
  try {
    const user = await getCurrentUserForNavbar();

    // Hide guest panel, show user panel
    document.getElementById("nav-guest").classList.add("hidden");
    const navUser = document.getElementById("nav-user");
    navUser.classList.remove("hidden");

    const profileName = document.getElementById("profile-name");
    if (profileName && profileName.textContent !== user.full_name) {
      profileName.textContent = user.full_name;
    }

    // Update navbar position for desktop
    updateNavbarPosition();
    updateSidebarToggleVisibility();

    // Set initial sidebar toggle icon for desktop when logged in
    const sidebarToggle = document.getElementById("sidebar-toggle");
    if (sidebarToggle && window.innerWidth >= 768) {
      const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
      const isLanding = isLandingPage();
      const icon = sidebarToggle.querySelector('i');

      if (icon && !isLanding) {
        icon.className = isCollapsed ? 'fas fa-chevron-right text-lg' : 'fas fa-bars text-lg';
      }
    }

    // Profile popup toggle (remove existing listeners first)
    const toggleBtn = document.getElementById("profile-toggle");
    const popup = document.getElementById("profile-popup");

    if (toggleBtn && popup) {
      // Clone to remove existing listeners
      const newToggleBtn = toggleBtn.cloneNode(true);
      toggleBtn.parentNode.replaceChild(newToggleBtn, toggleBtn);

      newToggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        popup.classList.toggle("hidden");
      });

      // Document click handler (remove existing first)
      document.removeEventListener("click", window.profilePopupClickHandler);
      window.profilePopupClickHandler = (e) => {
        if (!popup.contains(e.target) && e.target !== newToggleBtn) {
          popup.classList.add("hidden");
        }
      };
      document.addEventListener("click", window.profilePopupClickHandler);
    }

    // Logout (remove existing listeners first)
    const logoutBtn = document.getElementById("logout-button");
    if (logoutBtn) {
      const newLogoutBtn = logoutBtn.cloneNode(true);
      logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);

      newLogoutBtn.addEventListener("click", () => {
        // Clear all caches
        Cache.clear();
        Api.clearAllCache();
        cachedNavbarUser = null;
        lastNavbarRender = null;

        localStorage.removeItem("token");
        localStorage.removeItem("sidebarCollapsed");

        // Clear navigation cache
        window.dispatchEvent(new CustomEvent('clear-navigation-cache'));

        window.location.hash = "#/login";
        window.location.reload();
      });
    }

  } catch {
    // Show guest panel, hide user panel
    document.getElementById("nav-user").classList.add("hidden");
    document.getElementById("nav-guest").classList.remove("hidden");

    // Reset navbar position when not logged in
    updateNavbarPosition();
    updateSidebarToggleVisibility();

    // Reset sidebar toggle icon to hamburger when not logged in
    const sidebarToggle = document.getElementById("sidebar-toggle");
    if (sidebarToggle) {
      const icon = sidebarToggle.querySelector('i');
      if (icon) {
        icon.className = 'fas fa-bars text-lg';
      }
    }
  }

  // Throttled resize handler
  let resizeTimeout = null;
  const handleResize = () => {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }

    resizeTimeout = setTimeout(() => {
      const sidebarToggle = document.getElementById("sidebar-toggle");
      const isLoggedIn = !document.getElementById("nav-user").classList.contains("hidden");
      const isLanding = isLandingPage();

      updateNavbarPosition();
      updateSidebarToggleVisibility();

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
    }, 100);
  };

  // Remove existing resize listener
  window.removeEventListener('resize', window.navbarResizeHandler);
  window.navbarResizeHandler = handleResize;
  window.addEventListener('resize', window.navbarResizeHandler);

  // Hash change handler
  const handleHashChange = () => {
    updateNavbarPosition();
    updateSidebarToggleVisibility();
  };

  window.removeEventListener('hashchange', window.navbarHashChangeHandler);
  window.navbarHashChangeHandler = handleHashChange;
  window.addEventListener('hashchange', window.navbarHashChangeHandler);
}

// Listen for profile updates to refresh navbar
window.addEventListener('profile-updated', async () => {
  // Clear user cache
  Cache.clear('api_/me');
  cachedNavbarUser = null;

  // Re-run afterRenderNavbar to update UI
  afterRenderNavbar();
});

// Listen for sidebar toggle events
window.addEventListener('sidebar-toggle', (e) => {
  updateNavbarPosition();
});

export default function navbar() {
  return {
    render: renderNavbar,
    afterRender: afterRenderNavbar,
  };
}