import { renderCourseList } from "../../component/courseList.js";
import {
  hideElementLoading,
  showElementLoading,
} from "../../component/loading-screen.js";
import WelcomeBanner from "../../component/welcome-banner.js";
import Api from "../../data/api.js";
import DashboardStudentPresenter from "../student/dashboard/dashboard-student-presenter.js";
import DashboardTeacherPresenter from "../teacher/dashboard/dashboard-teacher-presenter.js";
import RoleProfilePresenter from "./role-profile/role-profile-presenter.js";

const DashboardPresenter = {
  async init() {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.hash = "#/login";
      return;
    }

    // === CEK APAKAH SEDANG GENERATING COURSE ===
    const courseGenerating = localStorage.getItem("course_generating") === "true";
    const generatingId = localStorage.getItem("generating_course_id");
    const generatingTitle = localStorage.getItem("generating_course_title");
    const generatingLevel = localStorage.getItem("generating_course_level");

    if (courseGenerating && generatingId) {
      const genSection = document.getElementById("course-generating-section");
      const genTitleSpan = document.getElementById("generating-title");
      const genLevelSpan = document.getElementById("generating-level");

      if (genSection && genTitleSpan && genLevelSpan) {
        genTitleSpan.textContent = generatingTitle || "(tidak diketahui)";
        genLevelSpan.textContent = generatingLevel || "";
        genSection.style.display = "block";
      }

      const checkStatus = async () => {
        try {
          const status = await CreateCourseModel.checkGenerationStatus(generatingId);
          if (status.complete) {
            clearInterval(intervalId);
            // Bersihkan localStorage dan reload dashboard
            localStorage.removeItem("course_generating");
            localStorage.removeItem("generating_course_id");
            localStorage.removeItem("generating_course_title");
            localStorage.removeItem("generating_course_level");
            window.location.reload();
          }
        } catch (err) {
          console.warn("Gagal cek status generate:", err);
        }
      };

      // Polling setiap 7 detik
      const intervalId = setInterval(checkStatus, 7000);
      await checkStatus(); // cek pertama kali langsung

      // Tambahkan pesan bantuan jika lebih dari 2 menit belum selesai
      setTimeout(() => {
        const helpBox = document.getElementById("generation-help");
        if (helpBox) {
          helpBox.innerHTML = `
          🚨 Pembuatan course membutuhkan waktu lebih lama dari biasanya.<br>
          <a href="#/create" class="underline text-blue-600">Klik di sini untuk buat ulang</a>
          atau hubungi admin jika masalah berlanjut.
        `;
        }
      }, 120000); // 2 menit

      return; // hentikan render dashboard sampai selesai generate
    }

    // === CEK PROFIL USER ===
    let user;
    try {
      user = await Api.getProfile();
    } catch (err) {
      // console.error("Gagal ambil profil:", err);
      window.location.hash = "#/login";
      return;
    }

    const welcomeTarget = document.getElementById("welcome-container");
    if (welcomeTarget) {
      showElementLoading("welcome-container", "Memuat sambutan...");
      const banner = WelcomeBanner(user.full_name || "");
      welcomeTarget.innerHTML = "";
      welcomeTarget.appendChild(banner);
    }

    const modalContainer = document.getElementById("role-profile-modal-container");
    const needProfile = await this.checkRoleProfile(user.role, modalContainer);
    if (needProfile) return;

    await this.renderDashboardByRole(user.role);
  },

  async checkRoleProfile(role, container) {
    // 🔥 SKIP ROLE PROFILE CHECK UNTUK ADMIN DAN TEACHER
    // Teacher profile sudah auto-created saat approval di backend
    if (role === "admin" || role === "teacher") {
      console.log(`✅ Skipping role profile check for ${role} - profile auto-created`);
      return false;
    }

    // 🔥 HANYA CEK ROLE PROFILE UNTUK STUDENT
    if (role === "student") {
      await RoleProfilePresenter.checkAndRenderModal(role);
      return !!document.getElementById("role-profile-modal");
    }

    return false;
  },

  async renderDashboardByRole(role) {
    const studentSection = document.getElementById("student-section");
    const otherSection = document.getElementById("other-role-section");

    if (role === "student") {
      showElementLoading("course-container", "Memuat daftar kursus...");

      const courses = await DashboardStudentPresenter.getCourses();
      hideElementLoading("course-container");

      await renderCourseList("course-container", courses);

      const refreshBtn = document.getElementById("refresh-courses");
      if (refreshBtn) {
        refreshBtn.addEventListener("click", async () => {
          showElementLoading(
            "course-container",
            "Menyegarkan daftar kursus..."
          );
          const refreshedCourses = await DashboardStudentPresenter.getCourses();
          hideElementLoading("course-container");
          await renderCourseList("course-container", refreshedCourses);
        });
      }

      studentSection?.classList.remove("hidden");
      otherSection?.classList.add("hidden");

    } else if (role === "teacher") {
      studentSection?.classList.add("hidden");
      otherSection?.classList.remove("hidden");

      otherSection.innerHTML = `
        <div>
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Manajemen Kursus</h2>
            <button 
              id="refresh-teacher-courses" 
              class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh semua data kursus"
            >
              <svg id="refresh-icon" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              <span id="refresh-text">Refresh</span>
            </button>
          </div>

          <!-- Tab Navigation -->
          <div class="border-b border-gray-200 mb-6">
            <nav class="-mb-px flex space-x-8">
              <button 
                id="tab-unverified" 
                class="tab-button py-2 px-1 border-b-2 font-medium text-sm border-blue-500 text-blue-600" 
                data-target="unverified"
              >
                Belum Diverifikasi
              </button>
              <button 
                id="tab-verified" 
                class="tab-button py-2 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300" 
                data-target="verified"
              >
                Terverifikasi
              </button>
            </nav>
          </div>

          <!-- Tab Content -->
          <div id="teacher-course-container-unverified" class="tab-content"></div>
          <div id="teacher-course-container-verified" class="tab-content hidden"></div>
        </div>
      `;

      // Load initial unverified courses
      await DashboardTeacherPresenter.renderUnverifiedCourses("teacher-course-container-unverified");

      // Setup tab functionality
      this.setupTabs();

      // Setup refresh functionality
      this.setupTeacherRefresh();

    } else if (role === "admin") {
      studentSection?.classList.add("hidden");
      otherSection?.classList.remove("hidden");

      otherSection.innerHTML = `<div id="admin-dashboard-container"></div>`;
      const { default: AdminPresenter } = await import("../admin/dashboard/dashboard-admin-presenter.js");
      await AdminPresenter.init();
    } else {
      studentSection?.classList.add("hidden");
      otherSection?.classList.remove("hidden");

      otherSection.innerHTML = `<h2 class="text-xl font-semibold">Dashboard untuk Role Lain Akan Segera Hadir</h2>`;
    }
  },

  setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        const target = e.target.dataset.target;

        // Update button styles
        tabButtons.forEach(btn => {
          btn.classList.remove('border-blue-500', 'text-blue-600');
          btn.classList.add('border-transparent', 'text-gray-500');
        });

        e.target.classList.remove('border-transparent', 'text-gray-500');
        e.target.classList.add('border-blue-500', 'text-blue-600');

        // Show/hide content
        tabContents.forEach(content => {
          content.classList.add('hidden');
        });

        const targetContent = document.getElementById(`teacher-course-container-${target}`);
        targetContent.classList.remove('hidden');

        // Load verified courses when tab is clicked for the first time
        if (target === 'verified' && !targetContent.innerHTML.trim()) {
          await DashboardTeacherPresenter.renderVerifiedCourses("teacher-course-container-verified");
        }
      });
    });
  },

  setupTeacherRefresh() {
    const refreshBtn = document.getElementById("refresh-teacher-courses");
    const refreshIcon = document.getElementById("refresh-icon");
    const refreshText = document.getElementById("refresh-text");

    if (refreshBtn) {
      refreshBtn.addEventListener("click", async () => {
        // Disable button and show loading state
        refreshBtn.disabled = true;
        refreshIcon.classList.add("animate-spin");
        refreshText.textContent = "Refreshing...";

        try {
          console.log("🔄 Refreshing teacher courses...");

          // Clear cache dan refresh data
          await DashboardTeacherPresenter.refreshAllCourses();

          // Get current active tab
          const activeTab = document.querySelector('.tab-button.border-blue-500');
          const activeTarget = activeTab ? activeTab.dataset.target : 'unverified';

          // Refresh active tab
          if (activeTarget === 'unverified') {
            await DashboardTeacherPresenter.renderUnverifiedCourses("teacher-course-container-unverified", true);
          } else {
            await DashboardTeacherPresenter.renderVerifiedCourses("teacher-course-container-verified", true);
          }

          // Show success message
          this.showRefreshMessage("✅ Data kursus berhasil disegarkan!", "success");

        } catch (error) {
          console.error("❌ Failed to refresh teacher courses:", error);
          this.showRefreshMessage("❌ Gagal menyegarkan data. Coba lagi nanti.", "error");
        } finally {
          // Re-enable button and reset state
          refreshBtn.disabled = false;
          refreshIcon.classList.remove("animate-spin");
          refreshText.textContent = "Refresh";
        }
      });
    }
  },

  showRefreshMessage(message, type = "info") {
    // Create or update notification element
    let notification = document.getElementById("refresh-notification");

    if (!notification) {
      notification = document.createElement("div");
      notification.id = "refresh-notification";
      notification.className = "fixed top-4 right-4 z-50 max-w-sm";
      document.body.appendChild(notification);
    }

    const bgColor = type === "success" ? "bg-green-500" :
      type === "error" ? "bg-red-500" : "bg-blue-500";

    notification.innerHTML = `
      <div class="${bgColor} text-white px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-0">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium">${message}</span>
          <button onclick="this.parentElement.parentElement.style.transform='translateX(100%)'; setTimeout(() => this.parentElement.parentElement.remove(), 300)" class="ml-3 text-white hover:text-gray-200">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    `;

    // Auto remove after 3 seconds
    setTimeout(() => {
      if (notification && notification.parentNode) {
        notification.style.transform = "translateX(100%)";
        setTimeout(() => {
          if (notification && notification.parentNode) {
            notification.remove();
          }
        }, 300);
      }
    }, 3000);
  }
};

export default DashboardPresenter;