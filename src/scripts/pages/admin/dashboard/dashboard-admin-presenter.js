// File: src/scripts/pages/admin/dashboard-admin-presenter.js
import DashboardAdminModel from "./dashboard-admin-model.js";

const DashboardAdminPresenter = {
  async init() {
    const container = document.getElementById("admin-dashboard-container");
    if (!container) return;

    container.innerHTML = `
      <div class="text-center py-6 text-blue-600">Memuat ringkasan...</div>
    `;

    try {
      const stats = await DashboardAdminModel.getAllStats();
      const activities = await DashboardAdminModel.getRecentActivities();

      container.innerHTML = `
        <h1 class="text-2xl font-bold mb-4">Dashboard Admin</h1>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          ${this.renderStatCard(
            "Siswa",
            stats.totalStudents,
            "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
          )}
          ${this.renderStatCard(
            "Guru",
            stats.totalTeachers,
            "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
          )}
          ${this.renderStatCard(
            "Admin",
            stats.totalAdmins,
            "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
          )}
          ${this.renderStatCard(
            "Kursus",
            stats.totalCourses,
            "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
          )}
        </div>

        <div class="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 class="text-lg font-semibold mb-3">Aktivitas Terbaru</h2>
          <ul class="text-sm text-gray-700 dark:text-gray-200 space-y-2">
            ${activities
              .map(
                (act) => `
              <li class="border-b border-gray-200 dark:border-gray-700 pb-2">${act.message} <span class="text-xs text-gray-500">(${act.time})</span></li>
            `
              )
              .join("")}
          </ul>
        </div>
      `;
    } catch (err) {
      container.innerHTML = `<p class="text-red-600">Gagal memuat data dashboard: ${err.message}</p>`;
    }
  },

  renderStatCard(title, value, colorClass) {
    return `
      <div class="p-4 rounded shadow ${colorClass} dark:bg-opacity-30">
        <h3 class="text-sm font-semibold">${title}</h3>
        <p class="text-2xl font-bold">${value}</p>
      </div>
    `;
  },
};

export default DashboardAdminPresenter;
