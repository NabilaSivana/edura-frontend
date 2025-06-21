import DashboardPresenter from "./dashboard-presenter.js";
import createSidebar from "../../component/sidebar.js";
import DashboardStudentPresenter from "./dashboard-student-presenter.js";

const DashboardPage = {
  async render() {
    return `
      <div class="flex w-screen min-h-screen">
        <div id="sidebar-container"></div>
        <main class="flex-1 p-6 md:p-10 bg-gray-50 overflow-y-auto">
          <div id="welcome-container" class="mb-6"></div>

          <section class="mt-8" id="student-section">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-semibold">Your Study Material</h2>
              <button id="refresh-courses" class="border border-blue-600 text-blue-600 px-3 py-1 rounded hover:bg-blue-50">
                Refresh
              </button>
            </div>

            <!-- Kosongkan saja, grid akan ditambahkan di JS -->
            <div id="course-container"></div>
          </section>

          <section class="hidden mt-8" id="other-role-section">
            <h2 class="text-xl font-semibold">Dashboard untuk Role Lain Akan Segera Hadir</h2>
          </section>
        </main>
        <div id="role-profile-modal-container"></div>
      </div>
    `;
  },

  async afterRender() {
    const totalCourse = await DashboardStudentPresenter.getTotalCourses();
    const sidebarContainer = document.getElementById("sidebar-container");
    sidebarContainer.innerHTML = "";
    sidebarContainer.appendChild(createSidebar(totalCourse));
    DashboardPresenter.init();
  },
};

export default DashboardPage;
