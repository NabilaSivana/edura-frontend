import createSidebar from "../../../component/sidebar.js";
import EnvConfigPresenter from "./presenter.js";

const EnvConfigPage = {
    async render() {
        return `
      <div class="h-screen w-screen flex flex-col">
        <div id="navbar-container" class="shrink-0 z-50"></div>
        <div class="flex flex-1 overflow-hidden">
          <div id="sidebar-wrapper"></div>
          <main class="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50">
            <h1 class="text-xl font-bold mb-6">Konfigurasi Environment (.env)</h1>
            <form id="env-config-form" class="space-y-6 max-w-3xl">
              <div id="env-fields" class="space-y-4"></div>
              <button
                type="submit"
                id="save-button"
                class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                disabled
              >Simpan Perubahan</button>
            </form>
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
