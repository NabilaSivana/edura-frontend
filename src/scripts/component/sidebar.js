// // component/sidebar.js
// import Api from "../data/api.js";

// async function createSidebar(totalCourse = 0) {
//   const user = await Api.getCurrentUser();
//   const plan = user?.plan || "free";
//   const role = user?.role || "student";
//   const currentPath = window.location.hash;

//   const wrapper = document.createElement("div");
//   wrapper.className = "relative h-full";

//   const sidebar = document.createElement("div");
//   sidebar.id = "sidebar";
//   sidebar.className = `
//     h-full bg-white dark:bg-gray-900 text-gray-800 dark:text-white 
//     shadow-md p-5 z-50 flex flex-col gap-6 overflow-y-auto
//     fixed md:relative top-0 left-0 transform -translate-x-full md:translate-x-0 
//     transition-all duration-300 ease-in-out w-64
//   `;

//   // State untuk collapsed
//   let isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';

//   // Function untuk update sidebar state
//   const updateSidebarState = () => {
//     if (isCollapsed) {
//       sidebar.classList.add('sidebar-collapsed');
//       sidebar.style.width = '80px';
//     } else {
//       sidebar.classList.remove('sidebar-collapsed');
//       sidebar.style.width = '256px'; // w-64 = 256px
//     }
//   };

//   // === Logo
//   const logoWrapper = document.createElement("div");
//   logoWrapper.className = "flex items-center gap-2 mb-4";
//   const logoImg = document.createElement("img");
//   logoImg.src = "/logo2.png";
//   logoImg.alt = "logo";
//   logoImg.className = "w-10 h-10 object-contain flex-shrink-0";
//   const logoText = document.createElement("h1");
//   logoText.className = "text-xl font-semibold sidebar-text";
//   logoText.textContent = "EduraApp";
//   logoWrapper.appendChild(logoImg);
//   logoWrapper.appendChild(logoText);
//   sidebar.appendChild(logoWrapper);

//   // === Tombol Create New untuk Student
//   if (role === "student") {
//     const createLink = document.createElement("a");
//     createLink.href = "#/create";
//     createLink.className = "w-full";

//     const createBtn = document.createElement("button");
//     createBtn.className =
//       "w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

//     const createIcon = document.createElement("i");
//     createIcon.className = "fas fa-plus";
//     const createText = document.createElement("span");
//     createText.className = "sidebar-text";
//     createText.textContent = "Create New";

//     createBtn.appendChild(createIcon);
//     createBtn.appendChild(createText);

//     if (plan === "free" && totalCourse >= 5) {
//       createBtn.disabled = true;
//       createBtn.title =
//         "Batas maksimum kursus tercapai. Upgrade untuk menambah.";
//     }

//     createLink.appendChild(createBtn);
//     sidebar.appendChild(createLink);
//   }

//   // === Menu Navigasi
//   const menus = {
//     student: [
//       { name: "Dashboard", icon: "fas fa-chart-line", path: "#/dashboard" },
//       { name: "Upgrade", icon: "fas fa-crown", path: "#/upgrade" },
//       { name: "Profile", icon: "fas fa-user", path: "#/profile" },
//     ],
//     teacher: [
//       { name: "Dashboard", icon: "fas fa-chart-line", path: "#/dashboard" },
//       { name: "Class", icon: "fas fa-school", path: "#/class" },
//       { name: "Grade", icon: "fas fa-clipboard-list", path: "#/grade" },
//       { name: "Profile", icon: "fas fa-user", path: "#/profile" },
//     ],
//     admin: [
//       { name: "Dashboard", icon: "fas fa-chart-line", path: "#/dashboard" },
//       { name: "Manage Users", icon: "fas fa-users", path: "#/manage-users" },
//       { name: "Teacher Requests", icon: "fas fa-handshake", path: "#/teacher-requests" },
//       { name: "Manage Courses", icon: "fas fa-book", path: "#/manage-courses" },
//       { name: "Manage Classes", icon: "fas fa-landmark", path: "#/manage-class" },
//       { name: "Manage Payments", icon: "fas fa-credit-card", path: "#/manage-payments" },
//       { name: "Log Activities", icon: "fas fa-server", path: "#/monitor-backend" },
//       { name: "Config Envs", icon: "fas fa-cog", path: "#/env-config" },
//       { name: "Profile", icon: "fas fa-user", path: "#/profile" },
//     ],
//   };

//   const menuWrapper = document.createElement("div");
//   menuWrapper.className = "flex flex-col gap-2";
//   menus[role]?.forEach((menu) => {
//     const link = document.createElement("a");
//     link.href = menu.path;
//     const isActive = currentPath.startsWith(menu.path);
//     const item = document.createElement("div");
//     item.className = `flex gap-4 items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors ${isActive ? "bg-gray-100 dark:bg-gray-800" : ""
//       }`;

//     const icon = document.createElement("i");
//     icon.className = `${menu.icon} w-5 text-center flex-shrink-0`;

//     const label = document.createElement("h2");
//     label.textContent = menu.name;
//     label.className = "text-base sidebar-text";

//     // Tooltip untuk collapsed state
//     item.title = menu.name;

//     item.appendChild(icon);
//     item.appendChild(label);
//     link.appendChild(item);
//     menuWrapper.appendChild(link);
//   });

//   sidebar.appendChild(menuWrapper);

//   // === Kredit untuk Free Plan (Student only)
//   if (role === "student") {
//     const creditBox = document.createElement("div");
//     creditBox.className =
//       "border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mt-auto w-full text-sm sidebar-credit";

//     const title = document.createElement("h2");
//     title.className = "text-base font-semibold mb-2 sidebar-text";
//     title.textContent = "Available Credits";
//     creditBox.appendChild(title);

//     // Mini indicator untuk collapsed state
//     const miniIndicator = document.createElement("div");
//     miniIndicator.className = "credit-mini-indicator hidden text-center";
//     const miniIcon = document.createElement("i");
//     miniIcon.className = "fas fa-battery-three-quarters text-blue-500";
//     miniIndicator.appendChild(miniIcon);
//     creditBox.appendChild(miniIndicator);

//     if (plan === "free") {
//       const availableText = document.createElement("p");
//       availableText.textContent = `${5 - totalCourse} credits left`;
//       availableText.className = "text-gray-700 dark:text-gray-300 sidebar-text";
//       creditBox.appendChild(availableText);

//       const progressBar = document.createElement("div");
//       progressBar.className = "w-full h-2 bg-gray-300 dark:bg-gray-600 rounded mb-2 mt-2 sidebar-text";
//       const progress = document.createElement("div");
//       progress.className = "h-full bg-blue-500 rounded transition-all duration-300";
//       progress.style.width = `${(totalCourse / 5) * 100}%`;
//       progressBar.appendChild(progress);
//       creditBox.appendChild(progressBar);

//       const usedText = document.createElement("p");
//       usedText.className = "text-sm text-gray-600 dark:text-gray-400 sidebar-text";
//       usedText.textContent = `${totalCourse} of 5 used`;
//       creditBox.appendChild(usedText);

//       const upgradeLink = document.createElement("a");
//       upgradeLink.href = "#/upgrade";
//       upgradeLink.className = "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs mt-2 inline-block transition-colors sidebar-text";
//       upgradeLink.textContent = "Upgrade to unlock unlimited courses";
//       creditBox.appendChild(upgradeLink);

//       // Update mini indicator based on usage
//       if (totalCourse >= 4) {
//         miniIcon.className = "fas fa-battery-quarter text-red-500";
//       } else if (totalCourse >= 2) {
//         miniIcon.className = "fas fa-battery-half text-yellow-500";
//       }
//     } else {
//       const unlimitedText = document.createElement("p");
//       unlimitedText.className = "text-green-600 dark:text-green-400 font-semibold sidebar-text";
//       unlimitedText.textContent = "Unlimited 🚀";
//       creditBox.appendChild(unlimitedText);

//       const note = document.createElement("p");
//       note.className = "text-xs text-gray-500 dark:text-gray-400 mt-1 sidebar-text";
//       note.textContent = "You can create as many courses as you like!";
//       creditBox.appendChild(note);

//       // Mini indicator untuk unlimited
//       miniIcon.className = "fas fa-infinity text-green-500";
//     }

//     sidebar.appendChild(creditBox);
//   }

//   // === Theme Toggle
//   const themeToggle = document.createElement("button");
//   themeToggle.id = "theme-toggle-btn";
//   themeToggle.className = `
//     mt-4 text-xs border border-gray-300 dark:border-gray-600 
//     px-3 py-2 rounded-lg w-full flex items-center justify-center gap-2
//     hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors
//   `;

//   // Function to update theme toggle button
//   const updateThemeButton = () => {
//     const isDark = document.documentElement.classList.contains("dark");
//     const icon = isDark ? 'fas fa-sun text-yellow-500' : 'fas fa-moon text-gray-600';
//     const text = isDark ? 'Light Mode' : 'Dark Mode';

//     themeToggle.innerHTML = `<i class="${icon}"></i> <span class="sidebar-text">${text}</span>`;
//   };

//   // Initial button state
//   updateThemeButton();

//   // Theme toggle handler
//   themeToggle.onclick = () => {
//     document.documentElement.classList.toggle("dark");
//     const isDark = document.documentElement.classList.contains("dark");
//     localStorage.setItem("theme", isDark ? "dark" : "light");
//     updateThemeButton();
//     window.dispatchEvent(new CustomEvent('themechange', {
//       detail: { isDark }
//     }));
//   };

//   window.addEventListener('themechange', updateThemeButton);
//   sidebar.appendChild(themeToggle);

//   // === Overlay (Mobile)
//   const overlay = document.createElement("div");
//   overlay.id = "sidebar-overlay";
//   overlay.className =
//     "fixed inset-0 bg-black bg-opacity-30 z-40 hidden md:hidden";
//   overlay.addEventListener("click", () => {
//     sidebar.classList.add("-translate-x-full");
//     overlay.classList.add("hidden");
//   });

//   sidebar.addEventListener("transitionend", () => {
//     const isOpen = !sidebar.classList.contains("-translate-x-full");
//     overlay.classList.toggle("hidden", !isOpen);
//   });

//   wrapper.appendChild(overlay);
//   wrapper.appendChild(sidebar);

//   // Add method to toggle sidebar (for mobile)
//   wrapper.toggleSidebar = () => {
//     sidebar.classList.toggle("-translate-x-full");
//     const isOpen = !sidebar.classList.contains("-translate-x-full");
//     if (isOpen) {
//       overlay.classList.remove("hidden");
//     }
//   };

//   // Apply initial state
//   updateSidebarState();

//   // Add method to toggle collapsed state (untuk digunakan dari navbar)
//   wrapper.toggleCollapsed = () => {
//     isCollapsed = !isCollapsed;
//     localStorage.setItem('sidebarCollapsed', isCollapsed);
//     updateSidebarState();
//   };

//   return wrapper;
// }

// export default createSidebar;
// component/sidebar.js
import Api from "../data/api.js";

async function createSidebar(totalCourse = 0) {
  const user = await Api.getCurrentUser();
  const plan = user?.plan || "free";
  const role = user?.role || "student";
  const currentPath = window.location.hash;

  const wrapper = document.createElement("div");
  wrapper.className = "relative h-full";

  const sidebar = document.createElement("div");
  sidebar.id = "sidebar";
  sidebar.className = `
    h-full bg-white dark:bg-gray-900 text-gray-800 dark:text-white 
    shadow-md p-6 z-50 flex flex-col overflow-y-auto
    fixed md:relative top-0 left-0 transform -translate-x-full md:translate-x-0 
    transition-all duration-300 ease-in-out w-64
  `;

  // State untuk collapsed
  let isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';

  // Function untuk update sidebar state
  const updateSidebarState = () => {
    if (isCollapsed) {
      sidebar.classList.add('sidebar-collapsed');
      sidebar.style.width = '80px';
    } else {
      sidebar.classList.remove('sidebar-collapsed');
      sidebar.style.width = '256px'; // w-64 = 256px
    }
  };

  // === Logo dengan link ke home
  const logoWrapper = document.createElement("a");
  logoWrapper.href = "#";
  logoWrapper.className = "flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity cursor-pointer";
  const logoImg = document.createElement("img");
  logoImg.src = "/logo2.png";
  logoImg.alt = "logo";
  logoImg.className = "w-10 h-10 object-contain flex-shrink-0";
  const logoText = document.createElement("h1");
  logoText.className = "text-xl font-semibold sidebar-text";
  logoText.textContent = "EduraApp";
  logoWrapper.appendChild(logoImg);
  logoWrapper.appendChild(logoText);
  sidebar.appendChild(logoWrapper);

  // === Tombol Create New untuk Student
  if (role === "student") {
    const createLink = document.createElement("a");
    createLink.href = "#/create";
    createLink.className = "w-full mb-6";

    const createBtn = document.createElement("button");
    createBtn.className =
      "w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

    const createIcon = document.createElement("i");
    createIcon.className = "fas fa-plus";
    const createText = document.createElement("span");
    createText.className = "sidebar-text";
    createText.textContent = "Create New";

    createBtn.appendChild(createIcon);
    createBtn.appendChild(createText);

    if (plan === "free" && totalCourse >= 5) {
      createBtn.disabled = true;
      createBtn.title =
        "Batas maksimum kursus tercapai. Upgrade untuk menambah.";
    }

    createLink.appendChild(createBtn);
    sidebar.appendChild(createLink);
  }

  // === Menu Navigasi dengan flex-grow untuk mengisi ruang
  const menusContainer = document.createElement("div");
  menusContainer.className = "flex flex-col flex-grow";

  const menus = {
    student: [
      { name: "Dashboard", icon: "fas fa-chart-line", path: "#/dashboard" },
      { name: "Upgrade", icon: "fas fa-crown", path: "#/upgrade" },
      { name: "Profile", icon: "fas fa-user", path: "#/profile" },
    ],
    teacher: [
      { name: "Dashboard", icon: "fas fa-chart-line", path: "#/dashboard" },
      { name: "Class", icon: "fas fa-school", path: "#/class" },
      { name: "Grade", icon: "fas fa-clipboard-list", path: "#/grade" },
      { name: "Profile", icon: "fas fa-user", path: "#/profile" },
    ],
    admin: [
      { name: "Dashboard", icon: "fas fa-chart-line", path: "#/dashboard" },
      { name: "Manage Users", icon: "fas fa-users", path: "#/manage-users" },
      { name: "Teacher Requests", icon: "fas fa-handshake", path: "#/teacher-requests" },
      { name: "Manage Courses", icon: "fas fa-book", path: "#/manage-courses" },
      { name: "Manage Classes", icon: "fas fa-landmark", path: "#/manage-class" },
      { name: "Manage Payments", icon: "fas fa-credit-card", path: "#/manage-payments" },
      { name: "Log Activities", icon: "fas fa-server", path: "#/monitor-backend" },
      { name: "Config Envs", icon: "fas fa-cog", path: "#/env-config" },
      { name: "Profile", icon: "fas fa-user", path: "#/profile" },
    ],
  };

  const menuWrapper = document.createElement("div");
  menuWrapper.className = "flex flex-col gap-2 mb-6";
  menus[role]?.forEach((menu) => {
    const link = document.createElement("a");
    link.href = menu.path;
    const isActive = currentPath.startsWith(menu.path);
    const item = document.createElement("div");
    item.className = `flex gap-4 items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors duration-200 ${isActive ? "bg-gray-100 dark:bg-gray-800" : ""
      }`;

    const icon = document.createElement("i");
    icon.className = `${menu.icon} w-5 text-center flex-shrink-0`;

    const label = document.createElement("h2");
    label.textContent = menu.name;
    label.className = "text-base sidebar-text";

    // Tooltip untuk collapsed state
    item.title = menu.name;

    item.appendChild(icon);
    item.appendChild(label);
    link.appendChild(item);
    menuWrapper.appendChild(link);
  });

  menusContainer.appendChild(menuWrapper);

  // === Bottom Section Container untuk Credit dan Theme
  const bottomSection = document.createElement("div");
  bottomSection.className = "mt-auto flex flex-col gap-0 flex-shrink-0 pb-0";

  // === Kredit untuk Free Plan (Student only)
  if (role === "student") {
    const creditBox = document.createElement("div");
    creditBox.className =
      "border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg w-full text-sm sidebar-credit transition-all duration-300";

    const title = document.createElement("h2");
    title.className = "text-base font-semibold mb-2 sidebar-text";
    title.textContent = "Available Credits";
    creditBox.appendChild(title);

    // Mini indicator untuk collapsed state
    const miniIndicator = document.createElement("div");
    miniIndicator.className = "credit-mini-indicator hidden";
    const miniIcon = document.createElement("i");
    miniIcon.className = "fas fa-battery-three-quarters text-blue-500 text-xl";
    miniIcon.title = "Available Credits"; // Tooltip
    miniIndicator.appendChild(miniIcon);
    creditBox.appendChild(miniIndicator);

    if (plan === "free") {
      const availableText = document.createElement("p");
      availableText.textContent = `${5 - totalCourse} credits left`;
      availableText.className = "text-gray-700 dark:text-gray-300 sidebar-text";
      creditBox.appendChild(availableText);

      const progressBar = document.createElement("div");
      progressBar.className = "w-full h-2 bg-gray-300 dark:bg-gray-600 rounded mb-2 mt-2 sidebar-text";
      const progress = document.createElement("div");
      progress.className = "h-full bg-blue-500 rounded transition-all duration-300";
      progress.style.width = `${(totalCourse / 5) * 100}%`;
      progressBar.appendChild(progress);
      creditBox.appendChild(progressBar);

      const usedText = document.createElement("p");
      usedText.className = "text-sm text-gray-600 dark:text-gray-400 sidebar-text";
      usedText.textContent = `${totalCourse} of 5 used`;
      creditBox.appendChild(usedText);

      const upgradeLink = document.createElement("a");
      upgradeLink.href = "#/upgrade";
      upgradeLink.className = "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs mt-2 inline-block transition-colors sidebar-text";
      upgradeLink.textContent = "Upgrade to unlock unlimited courses";
      creditBox.appendChild(upgradeLink);

      // Update mini indicator based on usage
      if (totalCourse >= 4) {
        miniIcon.className = "fas fa-battery-quarter text-red-500";
      } else if (totalCourse >= 2) {
        miniIcon.className = "fas fa-battery-half text-yellow-500";
      }
    } else {
      const unlimitedText = document.createElement("p");
      unlimitedText.className = "text-green-600 dark:text-green-400 font-semibold sidebar-text";
      unlimitedText.textContent = "Unlimited 🚀";
      creditBox.appendChild(unlimitedText);

      const note = document.createElement("p");
      note.className = "text-xs text-gray-500 dark:text-gray-400 mt-1 sidebar-text";
      note.textContent = "You can create as many courses as you like!";
      creditBox.appendChild(note);

      // Mini indicator untuk unlimited
      miniIcon.className = "fas fa-infinity text-green-500";
    }

    bottomSection.appendChild(creditBox);
  }

  // === Theme Toggle - selalu di bagian paling bawah
  const themeToggle = document.createElement("button");
  themeToggle.id = "theme-toggle-btn";
  themeToggle.className = `
    text-xs border border-gray-300 dark:border-gray-600 
    px-3 py-2 rounded-lg w-full flex items-center justify-center gap-2
    hover:bg-gray-50 dark:hover:bg-gray-800 
    min-h-[40px] flex-shrink-0 mt-4 transition-colors duration-200
  `;

  // Function to update theme toggle button
  const updateThemeButton = () => {
    const isDark = document.documentElement.classList.contains("dark");
    const icon = isDark ? 'fas fa-sun text-yellow-500' : 'fas fa-moon text-gray-600';
    const text = isDark ? 'Light Mode' : 'Dark Mode';

    themeToggle.innerHTML = `<i class="${icon} flex-shrink-0"></i> <span class="sidebar-text">${text}</span>`;
    themeToggle.title = text; // Tooltip untuk collapsed state
  };

  // Initial button state
  updateThemeButton();

  // Theme toggle handler
  themeToggle.onclick = () => {
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    updateThemeButton();
    window.dispatchEvent(new CustomEvent('themechange', {
      detail: { isDark }
    }));
  };

  window.addEventListener('themechange', updateThemeButton);
  bottomSection.appendChild(themeToggle);

  // Tambahkan bottomSection ke menusContainer
  menusContainer.appendChild(bottomSection);
  sidebar.appendChild(menusContainer);

  // === Overlay (Mobile)
  const overlay = document.createElement("div");
  overlay.id = "sidebar-overlay";
  overlay.className =
    "fixed inset-0 bg-black bg-opacity-30 z-40 hidden md:hidden";
  overlay.addEventListener("click", () => {
    sidebar.classList.add("-translate-x-full");
    overlay.classList.add("hidden");
  });

  sidebar.addEventListener("transitionend", () => {
    const isOpen = !sidebar.classList.contains("-translate-x-full");
    overlay.classList.toggle("hidden", !isOpen);
  });

  wrapper.appendChild(overlay);
  wrapper.appendChild(sidebar);

  // Add method to toggle sidebar (for mobile)
  wrapper.toggleSidebar = () => {
    sidebar.classList.toggle("-translate-x-full");
    const isOpen = !sidebar.classList.contains("-translate-x-full");
    if (isOpen) {
      overlay.classList.remove("hidden");
    }
  };

  // Apply initial state
  updateSidebarState();

  // Add smooth CSS for collapsed state
  const style = document.createElement('style');
  style.textContent = `
    .sidebar-collapsed {
      overflow-x: hidden;
    }
    
    .sidebar-collapsed .sidebar-text {
      opacity: 0;
      width: 0;
      overflow: hidden;
      white-space: nowrap;
      transition: opacity 0.2s ease;
    }
    
    .sidebar-collapsed .sidebar-credit > *:not(.credit-mini-indicator) {
      display: none;
    }
    
    .sidebar-collapsed .credit-mini-indicator {
      display: flex !important;
      justify-content: center;
      align-items: center;
      height: 40px;
    }
    
    .sidebar-collapsed #theme-toggle-btn {
      width: 48px;
      height: 30px;
      padding: 8px;
      justify-content: center;
      margin-left: auto;
      margin-right: auto;
    }
    
    .sidebar-collapsed #theme-toggle-btn .sidebar-text {
      display: none;
    }
    
    .sidebar-collapsed .flex.gap-4.items-center {
      justify-content: center;
      padding-left: 12px;
      padding-right: 12px;
    }
    
    /* Smooth menu item transitions */
    .sidebar-collapsed .flex.gap-4.items-center:hover {
      background-color: rgb(243 244 246) !important;
    }
    
    .dark .sidebar-collapsed .flex.gap-4.items-center:hover {
      background-color: rgb(31 41 55) !important;
    }
    
    /* Bottom section positioning */
    .sidebar-collapsed .mt-auto {
      margin-top: auto;
      padding-top: 16px;
    }
  `;

  if (!document.head.querySelector('#sidebar-collapsed-styles')) {
    style.id = 'sidebar-collapsed-styles';
    document.head.appendChild(style);
  }

  // Add method to toggle collapsed state (untuk digunakan dari navbar)
  wrapper.toggleCollapsed = () => {
    isCollapsed = !isCollapsed;
    localStorage.setItem('sidebarCollapsed', isCollapsed);
    updateSidebarState();
  };

  return wrapper;
}

export default createSidebar;