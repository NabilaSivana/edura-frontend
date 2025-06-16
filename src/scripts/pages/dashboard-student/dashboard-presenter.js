import { renderCourseList } from "../../component/courseList.js";
import createSidebar from "../../component/sidebar.js";
import WelcomeBanner from "../../component/wellcome-banner.js";
import Api from "../../data/api.js";
import RoleProfilePresenter from "../role-profile/role-profile-presenter.js";
import RoleProfileView from "../role-profile/role-profile-view.js";

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
      localStorage.removeItem("token");
      window.location.hash = "#/login";
      return;
    }

    const sidebarTarget = document.getElementById("sidebar-container");
    const welcomeTarget = document.getElementById("welcome-container");
    if (sidebarTarget) sidebarTarget.appendChild(createSidebar());
    if (welcomeTarget) welcomeTarget.appendChild(WelcomeBanner(user.full_name || ""));

    const modalContainer = document.getElementById("role-profile-modal-container");

    const needProfile = await this.checkRoleProfile(user.role, modalContainer);
    if (needProfile) return;

    await this.renderDashboardByRole(user.role);
  },

  async checkRoleProfile(role, container) {
    try {
      if (role === "student") {
        await Api.getStudentProfile();
      } else if (role === "teacher") {
        await Api.getTeacherProfile();
      }
      return false;
    } catch (error) {
      if (role === "student") {
        RoleProfileView.renderStudentForm(container);
        RoleProfilePresenter.handleStudentSubmit();
      } else {
        RoleProfileView.renderTeacherForm(container);
        RoleProfilePresenter.handleTeacherSubmit();
      }
      return true;
    }
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
    } else {
      studentSection?.classList.add("hidden");
      otherSection?.classList.remove("hidden");
    }
  },
};

export default DashboardPresenter;
