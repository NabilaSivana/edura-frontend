import UpgradePresenter from "./upgrade-presenter.js";
import createSidebar from "../../component/sidebar.js";

const UpgradePage = {
    async render() {
        return `
      <div class="flex w-screen h-screen">
        <div id="sidebar-container"></div>
        <main class="flex-1 p-10 bg-gray-50 overflow-y-auto">
          <h1 class="text-2xl font-bold mb-6">Upgrade Plan</h1>
          <div id="upgrade-form-section" class="bg-white shadow p-6 rounded-lg max-w-2xl">
            <p class="mb-4">Plan Premium memungkinkan Anda mengakses lebih dari 5 course, fitur tambahan, dan dukungan eksklusif.</p>
            <button id="upgrade-button" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Upgrade Sekarang (Rp 50.000)
            </button>
          </div>
        </main>
      </div>
    `;
    },

    async afterRender() {
        // render sidebar
        const sidebarTarget = document.getElementById("sidebar-container");
        if (sidebarTarget) sidebarTarget.appendChild(createSidebar());

        UpgradePresenter.init();
    },
};

export default UpgradePage;
