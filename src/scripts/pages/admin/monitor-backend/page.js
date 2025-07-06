// === File: pages/admin/monitor-backend/page.js ===
import createSidebar from "../../../component/sidebar.js";
import MonitorPresenter from "./presenter.js";

const MonitorPage = {
  async render() {
    return `
        <div id="page-monitor" class="h-screen w-screen flex flex-col">
            <div id="navbar-container" class="shrink-0 z-50"></div>

            <div class="flex flex-1 overflow-hidden">
                <div id="sidebar-wrapper"></div>

           <main class="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">


                    <h1 class="text-xl font-bold mb-4">📊 Monitor Aktivitas Backend</h1>

                    <div class="mb-4">
                        <label for="filter-date" class="block text-sm font-medium text-gray-700">Filter Tanggal:</label>
                        <input
                            type="date"
                            id="filter-date"
                            class="mt-1 border border-gray-300 px-3 py-2 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div id="monitor-log-list" class="space-y-4"></div>
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

    MonitorPresenter.init();
  },
};

export default MonitorPage;
