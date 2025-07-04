// === routes/admin-course-page.js ===
import createSidebar from "../../../component/sidebar.js";
import AdminCoursePresenter from "./presenter.js";

const AdminCoursePage = {
    async render() {
        return `
    <div class="h-screen w-screen flex flex-col">
      <div id="navbar-container" class="shrink-0 z-50"></div>

      <div class="flex flex-1 overflow-hidden">
        <div id="sidebar-wrapper"></div>

        <main class="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50">
          <h1 class="text-xl font-bold mb-6">Manajemen Kursus</h1>

          <div id="course-section">
            <div id="course-loading" class="text-center py-6 text-blue-600">Memuat kursus...</div>
            <div id="course-list" class="grid gap-4"></div>
          </div>
        </main>
      </div>
    </div>`;
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

        AdminCoursePresenter.init();
    },
};

export default AdminCoursePage;
