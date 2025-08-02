
// File: src/scripts/pages/admin/dashboard-admin-presenter.js
import { showToastNotification } from "../../../utils/index.js";
import DashboardAdminModel from "./dashboard-admin-model.js";

const DashboardAdminPresenter = {
  async init() {
    const container = document.getElementById("admin-dashboard-container");
    if (!container) return;

    container.innerHTML = `
      <div class="text-center py-6">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Memuat dashboard...</p>
      </div>
    `;

    try {
      // Fetch all data
      const [stats, teacherRequests, activities] = await Promise.all([
        DashboardAdminModel.getAllStats(),
        DashboardAdminModel.getPendingTeacherRequests(),
        DashboardAdminModel.getRecentActivities()
      ]);

      container.innerHTML = `
        <div>
          <h1 class="text-3xl font-bold mb-2">Dashboard Admin</h1>
          <p class="text-gray-600 dark:text-gray-400 mb-6">Selamat datang di panel administrasi</p>
        </div>

        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          ${this.renderStatCard(
        "Total Siswa",
        stats.totalStudents,
        "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
        `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>`
      )}
          ${this.renderStatCard(
        "Total Guru",
        stats.totalTeachers,
        "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300",
        `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>`
      )}
          ${this.renderStatCard(
        "Total Admin",
        stats.totalAdmins,
        "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300",
        `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>`
      )}
          ${this.renderStatCard(
        "Total Kursus",
        stats.totalCourses,
        "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300",
        `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>`
      )}
        </div>

        <!-- Teacher Requests Section -->
        ${teacherRequests && teacherRequests.length > 0 ? `
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold">Pengajuan Guru Pending</h2>
              <span class="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-full text-sm font-medium">
                ${teacherRequests.length} Pending
              </span>
            </div>
            <div class="space-y-3">
              ${teacherRequests.slice(0, 5).map(req => this.renderTeacherRequest(req)).join('')}
            </div>
            ${teacherRequests.length > 5 ? `
              <div class="mt-4 text-center">
                <a href="#/teacher-requests" class="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                  Lihat semua pengajuan →
                </a>
              </div>
            ` : ''}
          </div>
        ` : ''}

        <!-- Recent Activities -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <h2 class="text-xl font-semibold mb-4">Aktivitas Terbaru</h2>
          <div class="space-y-3">
            ${activities.map(activity => this.renderActivity(activity)).join('')}
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold mb-4">Aksi Cepat</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${this.renderQuickAction(
        "Kelola Pengguna",
        "Lihat dan kelola semua pengguna",
        "#/manage-users",
        "text-blue-600 dark:text-blue-400"
      )}
            ${this.renderQuickAction(
        "Kelola Kursus",
        "Verifikasi dan kelola kursus",
        "#/manage-courses",
        "text-purple-600 dark:text-purple-400"
      )}
            ${this.renderQuickAction(
        "Kelola Pembayaran",
        "Lihat transaksi pembayaran",
        "#/manage-payments",
        "text-green-600 dark:text-green-400"
      )}
          </div>
        </div>
      `;

      // Add event listeners for teacher request actions
      this.attachTeacherRequestListeners();
    } catch (err) {
      console.error("Dashboard error:", err);
      container.innerHTML = `
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div class="flex items-center">
            <svg class="w-6 h-6 text-red-600 dark:text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-red-600 dark:text-red-400">Terjadi kesalahan saat memuat dashboard. Silakan coba lagi.</p>
          </div>
        </div>
      `;
    }
  },

  renderStatCard(title, value, colorClass, icon) {
    return `
      <div class="p-6 rounded-lg shadow-sm ${colorClass} border border-gray-200 dark:border-gray-700 transition-transform hover:scale-105">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium opacity-80">${title}</p>
            <p class="text-3xl font-bold mt-1">${value.toLocaleString('id-ID')}</p>
          </div>
          <div class="opacity-80">
            ${icon}
          </div>
        </div>
      </div>
    `;
  },

  renderTeacherRequest(request) {
    return `
      <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div>
          <p class="font-medium">${request.full_name || 'Nama tidak tersedia'}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            ${request.institusi || request.institution || 'Institusi tidak diketahui'} 
            • ${request.nidn || request.nip || 'No ID'}
          </p>
        </div>
        <div class="flex gap-2">
          <button 
            class="approve-teacher-btn px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition"
            data-id="${request.id}"
          >
            Setujui
          </button>
          <button 
            class="reject-teacher-btn px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition"
            data-id="${request.id}"
          >
            Tolak
          </button>
        </div>
      </div>
    `;
  },

  renderActivity(activity) {
    const iconMap = {
      user: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
      </svg>`,
      course: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
      </svg>`,
      info: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>`
    };

    return `
      <div class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
        <div class="flex-shrink-0 text-gray-400">
          ${iconMap[activity.icon] || iconMap.info}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-900 dark:text-gray-100">${activity.message}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">${activity.time}</p>
        </div>
      </div>
    `;
  },

  renderQuickAction(title, description, link, colorClass) {
    return `
      <a href="${link}" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition group">
        <h3 class="font-semibold ${colorClass} group-hover:underline">${title}</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">${description}</p>
      </a>
    `;
  },

  attachTeacherRequestListeners() {
    document.querySelectorAll('.approve-teacher-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        if (confirm('Setujui pengajuan guru ini?')) {
          try {
            await DashboardAdminModel.updateTeacherRequestStatus(id, 'approved');
            this.init(); // Refresh
          } catch (err) {
            showToastNotification('Gagal menyetujui: ' + err.message, 'error');
          }
        }
      });
    });

    document.querySelectorAll('.reject-teacher-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;

        try {
          const reason = await promptTextarea(
            'Masukkan alasan penolakan pengajuan guru:',
            ''
          );

          if (!reason) return; // User cancelled

          await DashboardAdminModel.updateTeacherRequestStatus(id, 'rejected', reason);
          this.init(); // Refresh
        } catch (err) {
          showToastNotification('Gagal menolak: ' + err.message, 'error');
        }
      });
    });
  }
};

export default DashboardAdminPresenter;