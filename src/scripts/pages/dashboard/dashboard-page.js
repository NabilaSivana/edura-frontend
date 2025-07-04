// dashboard-page.js
import createSidebar from "../../component/sidebar.js";
import DashboardStudentPresenter from "../student/dashboard/dashboard-student-presenter.js";
import DashboardPresenter from "./dashboard-presenter.js";

const DashboardPage = {
  async render() {
    return `
  <div class="h-screen w-screen flex flex-col">
    <!-- Navbar -->
    <div id="navbar-container" class="shrink-0 z-50"></div>

    <!-- Layout: Sidebar + Content -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <div id="sidebar-wrapper"></div>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50">
        <div id="welcome-container" class="mb-6"></div>

        <section class="mt-8" id="student-section">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold">Your Study Material</h2>
            <button id="refresh-courses" class="border border-blue-600 text-blue-600 px-3 py-1 rounded hover:bg-blue-50">
              Refresh
            </button>
          </div>
          <div id="course-container" class="w-full"></div>
        </section>

        <section class="hidden mt-8" id="other-role-section">
          <h2 class="text-xl font-semibold">Dashboard untuk Role Lain Akan Segera Hadir</h2>
        </section>
      </main>

      <div id="role-profile-modal-container"></div>
    </div>
  </div>
<section class="mt-8" id="course-generating-section" style="display: none;">
  <div class="text-center py-10 px-4 border border-blue-100 rounded bg-blue-50">
    <h2 class="text-xl font-bold text-blue-700 mb-2">Sedang Membuat Course...</h2>
    <p class="text-gray-700 mb-1">
      Course dengan topik "<span id="generating-title" class="font-semibold"></span>"
      (<span id="generating-level" class="text-sm font-medium text-gray-600"></span>)
      sedang dibuat.
    </p>
    <p class="text-sm text-gray-500">Tunggu beberapa detik. Sistem akan otomatis memuat ulang.</p>

    <div class="mt-4 flex justify-center gap-2 items-center text-blue-600">
      <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
      <span>Generating...</span>
    </div>

    <!-- Help message ditambahkan via JS jika proses terlalu lama -->
    <div id="generation-help" class="mt-4 text-sm text-red-600"></div>
  </div>
</section>
`;
  },

  async afterRender() {
    const totalCourse = await DashboardStudentPresenter.getTotalCourses();

    const sidebarWrapper = document.getElementById("sidebar-wrapper");
    sidebarWrapper.innerHTML = "";

    const sidebar = await createSidebar(totalCourse); // <- pakai await
    sidebarWrapper.appendChild(sidebar); // <- sekarang ini valid

    const navbarModule = (await import("../../component/navbar.js")).default;
    const navbarContainer = document.getElementById("navbar-container");
    navbarContainer.innerHTML = navbarModule().render();
    navbarModule().afterRender();

    DashboardPresenter.init();
  }

};

export default DashboardPage;
