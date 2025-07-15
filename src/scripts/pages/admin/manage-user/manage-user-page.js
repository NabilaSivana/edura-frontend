// src/scripts/pages/admin/manage-user/manage-user-page.js
import ManageUserPresenter from "./manage-user-presenter.js";
import createSidebar from "../../../component/sidebar.js";

const ManageUserPage = {
  async render() {
    return `
      <div class="h-screen w-screen flex flex-col">
        <div id="navbar-container" class="shrink-0 z-50"></div>

        <div class="flex flex-1 overflow-hidden">
          <div id="sidebar-wrapper"></div>

          <main class="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
        
            <div id="manage-user-container"></div>
          </main>
        </div>
      </div>
    `;
  },

  async afterRender() {
    // Navbar
    const navbarModule = (await import("../../../component/navbar.js")).default;
    const navbarContainer = document.getElementById("navbar-container");
    navbarContainer.innerHTML = navbarModule().render();
    navbarModule().afterRender();

    // Sidebar
    const sidebarWrapper = document.getElementById("sidebar-wrapper");
    sidebarWrapper.innerHTML = "";
    const sidebar = await createSidebar();
    sidebarWrapper.appendChild(sidebar);

    // Load presenter
    await ManageUserPresenter.init();
  },
};

export default ManageUserPage;
