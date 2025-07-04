// routes/class-page.js
import createSidebar from "../../../component/sidebar.js";
import TeacherGradePresenter from "./presenter.js";

const TeacherGradePage = {
    async render() {
        return `
    <div class="h-screen w-screen flex flex-col">
      <div id="navbar-container" class="shrink-0 z-50"></div>

      <div class="flex flex-1 overflow-hidden">
        <div id="sidebar-wrapper"></div>

        <main class="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50">
          <h1 class="text-xl font-bold mb-6">Manajemen Nilai</h1>

          <div id="class-section">
            <div id="class-loading" class="text-center py-6 text-blue-600">Memuat kelas...</div>
<div id="class-list" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"></div>
          </div>

        </main>
      </div>
    </div>`;
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
        TeacherGradePresenter.init();
    },
};

export default TeacherGradePage;
