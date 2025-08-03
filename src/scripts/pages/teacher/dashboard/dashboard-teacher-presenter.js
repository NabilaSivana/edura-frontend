import DashboardTeacherModel from "./dashboard-teacher-model.js";

const DashboardTeacherPresenter = {
  async renderUnverifiedCourses(containerId, forceRefresh = false) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
      const courses = await DashboardTeacherModel.fetchUnverifiedCourses(forceRefresh);

      if (!Array.isArray(courses) || courses.length === 0) {
        container.innerHTML = `<p class="text-center text-gray-600 dark:text-gray-300">Belum ada kursus yang menunggu verifikasi.</p>`;
        return;
      }

      container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${courses
            .map(
              (course) => `
            <div class="bg-white dark:bg-gray-800 shadow rounded p-4 relative">
              <div class="absolute top-2 right-2 flex items-center text-sm text-gray-500 dark:text-gray-300">
                <i class="fas fa-user mr-1"></i> ${course.student_count || 0}
              </div>

              <h3 class="font-bold text-lg mb-1 text-gray-800 dark:text-white">${
                course.title
              }</h3>

              <div class="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Subject: ${course.subject || "-"} | Level: ${
                course.level || "-"
              }
              </div>

              <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 truncate">
                ${course.description || "(Tidak ada deskripsi)"}
              </p>

              <div class="flex gap-2">
                <button class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors" 
                        data-course-id="${course.id}">
                  Detail
                </button>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      `;

      container.querySelectorAll("button[data-course-id]").forEach((button) => {
        button.addEventListener("click", (e) => {
          const courseId = e.currentTarget.dataset.courseId;
          sessionStorage.setItem("teacher_selected_course_id", courseId);
          window.location.hash = `#/teacher/course-detail`;
        });
      });
    } catch (error) {
      console.error("Gagal memuat kursus guru:", error);
      container.innerHTML = `<p class="text-center text-red-500">Gagal memuat data kursus.</p>`;
    }
  },

  async renderVerifiedCourses(containerId, forceRefresh = false) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
      const courses = await DashboardTeacherModel.fetchVerifiedCourses(forceRefresh);
      if (!Array.isArray(courses) || courses.length === 0) {
        container.innerHTML = `<p class="text-center text-gray-600 dark:text-gray-300">Belum ada kursus yang sudah diverifikasi.</p>`;
        return;
      }

      container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${courses
            .map(
              (course) => `
            <div class="bg-white dark:bg-gray-800 shadow rounded p-4 relative">
              <div class="absolute top-2 right-2 flex items-center text-sm text-gray-500 dark:text-gray-300">
                <i class="fas fa-user mr-1"></i> ${course.student_count || 0}
              </div>

              <h3 class="font-bold text-lg mb-1 text-gray-800 dark:text-white">${
                course.title
              }</h3>

              <div class="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Subject: ${course.subject || "-"} | Level: ${
                course.level || "-"
              }
              </div>

              <p class="text-sm text-gray-600 dark:text-gray-300 mb-2 truncate">
                ${course.description || "(Tidak ada deskripsi)"}
              </p>

              <p class="text-xs text-gray-500 dark:text-gray-400 italic">
                Diverifikasi oleh: ${course.verified_by || "Admin"}
              </p>
            </div>
          `
            )
            .join("")}
        </div>
      `;
    } catch (error) {
      console.error("Gagal memuat kursus terverifikasi:", error);
      container.innerHTML = `<p class="text-center text-red-500">Gagal memuat data kursus.</p>`;
    }
  },

  // 🔄 NEW: Refresh functionality
  async refreshAllCourses() {
    //console.log("🧹 Clearing teacher courses cache...");
    
    try {
      // Clear cache dari Teacher API
      await DashboardTeacherModel.clearCache();
      
      //console.log("✅ Teacher courses cache cleared successfully");
    } catch (error) {
      console.error("❌ Failed to clear teacher courses cache:", error);
      throw error;
    }
  },

  // 🔄 NEW: Refresh specific tab
  async refreshTab(tabType) {
    if (tabType === 'unverified') {
      const container = document.getElementById("teacher-course-container-unverified");
      if (container) {
        container.innerHTML = `<div class="text-center text-gray-500">Memuat ulang...</div>`;
        await this.renderUnverifiedCourses("teacher-course-container-unverified", true);
      }
    } else if (tabType === 'verified') {
      const container = document.getElementById("teacher-course-container-verified");
      if (container) {
        container.innerHTML = `<div class="text-center text-gray-500">Memuat ulang...</div>`;
        await this.renderVerifiedCourses("teacher-course-container-verified", true);
      }
    }
  },

  // 🔄 NEW: Get fresh data for both tabs
  async getLatestCoursesData() {
    try {
      const [unverifiedCourses, verifiedCourses] = await Promise.all([
        DashboardTeacherModel.fetchUnverifiedCourses(true),
        DashboardTeacherModel.fetchVerifiedCourses(true)
      ]);

      return {
        unverified: unverifiedCourses,
        verified: verifiedCourses
      };
    } catch (error) {
      console.error("❌ Failed to get latest courses data:", error);
      throw error;
    }
  }
};

export default DashboardTeacherPresenter;