// === File: pages/admin/env-config/page.js ===
import createSidebar from "../../../component/sidebar.js";
import EnvConfigView from "./view.js";
import EnvConfigPresenter from "./presenter.js";

const EnvConfigPage = {
  async render() {
    return EnvConfigView.render();
  },

  async afterRender() {
    try {
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
      await EnvConfigPresenter.init();

    } catch (error) {
      console.error('Error initializing env config page:', error);
    }
  }
};

export default EnvConfigPage;