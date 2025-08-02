// File: src/scripts/pages/admin/dashboard-admin-page.js
import createSidebar from "../../../component/sidebar.js";

const DashboardAdminPage = {
  async render() {
    return `
      <div class="h-screen w-screen flex flex-col">
        <div id="navbar-container" class="shrink-0 z-50"></div>
        <div class="flex flex-1 overflow-hidden">
          <div id="sidebar-wrapper"></div>

          <main class="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
            <div id="admin-dashboard-container" class="space-y-6"></div>
          </main>
        </div>
      </div>
    `;
  },

  async afterRender() {
    // Sidebar
    const sidebarWrapper = document.getElementById("sidebar-wrapper");
    sidebarWrapper.innerHTML = "";
    const sidebar = await createSidebar();
    sidebarWrapper.appendChild(sidebar);

    // Navbar
    const navbarModule = (await import("../../../component/navbar.js")).default;
    const navbarContainer = document.getElementById("navbar-container");
    navbarContainer.innerHTML = navbarModule().render();
    navbarModule().afterRender();

    // Load presenter
    const presenter = (await import("./dashboard-admin-presenter.js")).default;
    presenter.init();
  },
};

export default DashboardAdminPage;