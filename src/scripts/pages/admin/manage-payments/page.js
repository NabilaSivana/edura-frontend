// routes/manage-payments-page.js
import createSidebar from "../../../component/sidebar.js";
import ManagePaymentsPresenter from "./presenter.js";

const ManagePaymentsPage = {
    async render() {
        return `
    <div class="h-screen w-screen flex flex-col">
      <div id="navbar-container" class="shrink-0 z-50"></div>

      <div class="flex flex-1 overflow-hidden">
        <div id="sidebar-wrapper"></div>

        <main class="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50">
          <h1 class="text-xl font-bold mb-6">Manajemen Pembayaran</h1>

          <input
            type="text"
            id="payment-search"
            placeholder="Cari nama/email pengguna..."
            class="w-full max-w-md border px-3 py-2 mb-6 rounded"
          />

          <div id="payment-section">
            <div id="payment-list" class="grid gap-4"></div>
          </div>
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

        // Inisialisasi presenter
        ManagePaymentsPresenter.init();
    },
};

export default ManagePaymentsPage;
