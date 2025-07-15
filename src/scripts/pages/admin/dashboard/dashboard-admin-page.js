// File: routes/admin/dashboard-admin-page.js
const DashboardAdminPage = {
  async render() {
    return `
      <div class="h-screen w-screen flex flex-col">
        <div id="navbar-container" class="shrink-0 z-50"></div>
        <div class="flex flex-1 overflow-hidden">
          <div id="sidebar-wrapper"></div>

          <main class="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
            <h1 class="text-2xl font-bold mb-4">Dashboard Admin</h1>

            <!-- Tambahkan ini -->
            <div id="admin-dashboard-overview" class="space-y-6"></div>
          </main>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const sidebarWrapper = document.getElementById("sidebar-wrapper");
    sidebarWrapper.innerHTML = "";
    const sidebar = await createSidebar();
    sidebarWrapper.appendChild(sidebar);

    const navbarModule = (await import("../../../component/navbar.js")).default;
    const navbarContainer = document.getElementById("navbar-container");
    navbarContainer.innerHTML = navbarModule().render();
    navbarModule().afterRender();

    const presenter = (await import("./dashboard-admin-presenter.js")).default;
    presenter.init(); // <-- Pastikan ini dipanggil
  },
};

export default DashboardAdminPage;
