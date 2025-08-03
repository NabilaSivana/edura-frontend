// === File: pages/admin/manage-user/page.js (Updated) ===
import createSidebar from "../../../component/sidebar.js";
import ManageUserPresenter from "./presenter.js";
import ManageUserView from "./view.js";

const ManageUserPage = {
  async render() {
    return ManageUserView.render();
  },

  async afterRender() {
    try {
      //console.log('🎯 Initializing Manage User Page...');

      // Setup sidebar
      const sidebarWrapper = document.getElementById("sidebar-wrapper");
      if (sidebarWrapper) {
        sidebarWrapper.innerHTML = "";
        const sidebar = await createSidebar();
        sidebarWrapper.appendChild(sidebar);
      }

      // Setup navbar
      const navbarModule = (await import("../../../component/navbar.js")).default;
      const navbarContainer = document.getElementById("navbar-container");
      if (navbarContainer && navbarModule) {
        navbarContainer.innerHTML = navbarModule().render();
        navbarModule().afterRender();
      }

      // Initialize presenter
      await ManageUserPresenter.init();

    } catch (error) {
      console.error('Error initializing manage user page:', error);
    }
  },

  cleanup() {
    if (ManageUserPresenter) {
      ManageUserPresenter.destroy();
    }
  }
};

export default ManageUserPage;