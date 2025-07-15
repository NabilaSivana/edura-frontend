import createSidebar from "../../../component/sidebar.js";
import EnvConfigPresenter from "./presenter.js";

const EnvConfigPage = {
  async render() {
    return `
      <div class="h-screen w-screen flex flex-col">
        <div id="navbar-container" class="shrink-0 z-50"></div>
        <div class="flex flex-1 overflow-hidden">
          <div id="sidebar-wrapper"></div>
          <main class="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
            <h1 class="text-2xl font-bold mb-6">Konfigurasi Environment (.env)</h1>
            <div id="env-config-container" class="space-y-6 max-w-4xl"></div>
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

    EnvConfigPresenter.init();
  },
};

export default EnvConfigPage;
