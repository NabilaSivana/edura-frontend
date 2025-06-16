import DashboardPresenter from "./dashboard-presenter.js";

const DashboardPage = {
  async render() {
    return `
      <div class="flex w-screen h-screen">
        <div id="sidebar-container"></div>
        <main class="flex-1 p-10 bg-gray-50 overflow-y-auto">
          <div id="welcome-container" class="mb-6"></div>
          <section class="mt-8" id="student-section">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold">Your Study Material</h2>
              <button id="refresh-courses" class="border border-blue-600 text-blue-600 px-3 py-1 rounded hover:bg-blue-50">Refresh</button>
            </div>
            <div id="course-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
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
    DashboardPresenter.init();
  },
};

export default DashboardPage;
