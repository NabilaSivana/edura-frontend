import DashboardPresenter from "./dashboard-presenter.js";
import createSidebar from "../../component/sidebar.js";
import DashboardStudentPresenter from "./dashboard-student-presenter.js";

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
`;
  },

  async afterRender() {
    const totalCourse = await DashboardStudentPresenter.getTotalCourses();

    const sidebarWrapper = document.getElementById("sidebar-wrapper");
    sidebarWrapper.innerHTML = "";
    sidebarWrapper.appendChild(createSidebar(totalCourse));

    const navbarModule = (await import("../../component/navbar.js")).default;
    const navbarContainer = document.getElementById("navbar-container");
    navbarContainer.innerHTML = navbarModule().render();
    navbarModule().afterRender();

    DashboardPresenter.init();
  },
};

export default DashboardPage;
