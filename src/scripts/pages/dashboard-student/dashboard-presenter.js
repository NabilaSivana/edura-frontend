import { renderCourseList } from "../../component/courseList.js";
import WelcomeBanner from "../../component/wellcome-banner.js";
import Api from "../../data/api.js";
import RoleProfilePresenter from "../role-profile/role-profile-presenter.js";
import RoleProfileView from "../role-profile/role-profile-view.js";
import DashboardTeacherPresenter from "./dashboard-teacher-presenter.js";

const DashboardPresenter = {
  async init() {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.hash = "#/login";
      return;
    }

    let user;
    try {
      user = await Api.getProfile();
    } catch (err) {
      console.error("Gagal ambil profil:", err);
      window.location.hash = "#/login";
      return;
    }

    const welcomeTarget = document.getElementById("welcome-container");
    if (welcomeTarget) welcomeTarget.appendChild(WelcomeBanner(user.full_name || ""));

    const modalContainer = document.getElementById("role-profile-modal-container");

    const needProfile = await this.checkRoleProfile(user.role, modalContainer);
    if (needProfile) return;

    await this.renderDashboardByRole(user.role);
  },

  async checkRoleProfile(role, container) {
    if (role === "admin") return false;

    await RoleProfilePresenter.checkAndRenderModal(role);
    return !!document.getElementById("role-profile-modal");
  },

  async renderDashboardByRole(role) {
    const studentSection = document.getElementById("student-section");
    const otherSection = document.getElementById("other-role-section");

    if (role === "student") {
      await renderCourseList("course-container");

      const refreshBtn = document.getElementById("refresh-courses");
      if (refreshBtn) {
        refreshBtn.addEventListener("click", async () => {
          await renderCourseList("course-container");
        });
      }

      studentSection?.classList.remove("hidden");
      otherSection?.classList.add("hidden");

    } else if (role === "teacher") {
      studentSection?.classList.add("hidden");
      otherSection?.classList.remove("hidden");

      otherSection.innerHTML = `
        <div>
          <h2 class="text-xl font-semibold mb-4">Kursus Belum Diverifikasi</h2>
          <label class="inline-flex items-center mb-4 cursor-pointer">
            <input type="checkbox" id="toggle-verified-courses" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 relative transition-all duration-300">
              <span class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></span>
            </div>
            <span class="ml-3 text-sm font-medium">Tampilkan Kursus Terverifikasi</span>
          </label>
          <div id="teacher-course-container"></div>
          <div id="teacher-course-container-verified" class="hidden"></div>
        </div>
      `;

      await DashboardTeacherPresenter.renderUnverifiedCourses("teacher-course-container");

      const toggle = document.getElementById("toggle-verified-courses");
      toggle?.addEventListener("change", async (e) => {
        const verifiedContainer = document.getElementById("teacher-course-container-verified");
        const unverifiedContainer = document.getElementById("teacher-course-container");

        if (e.target.checked) {
          verifiedContainer.classList.remove("hidden");
          unverifiedContainer.classList.add("hidden");
          if (!verifiedContainer.innerHTML.trim()) {
            await DashboardTeacherPresenter.renderVerifiedCourses("teacher-course-container-verified");
          }
        } else {
          verifiedContainer.classList.add("hidden");
          unverifiedContainer.classList.remove("hidden");
        }
      });

    } else if (role === "admin") {
      studentSection?.classList.add("hidden");
      otherSection?.classList.remove("hidden");

      otherSection.innerHTML = `<div id="admin-dashboard-container"></div>`;
      const { default: AdminPresenter } = await import("./dashboard-admin-presenter.js");
      await AdminPresenter.init();
    } else {
      studentSection?.classList.add("hidden");
      otherSection?.classList.remove("hidden");

      otherSection.innerHTML = `<h2 class="text-xl font-semibold">Dashboard untuk Role Lain Akan Segera Hadir</h2>`;
    }
  },
};

export default DashboardPresenter;
