//routes/route.js
import AdminCoursePage from "../pages/admin/manage-courses/page.js";
import ManagePaymentsPage from "../pages/admin/manage-payments/page.js";
import ForgotPasswordPage from "../pages/auth/forgot-password/forgot-password-page.js";
import LoginPage from "../pages/auth/login/login-page.js";
import RegisterPage from "../pages/auth/register/register-page.js";
import ResetPasswordPage from "../pages/auth/reset-password/reset-password-page.js";
import VerifyEmailPage from "../pages/auth/verify-email/verify-email-page.js";
import OtpPage from "../pages/auth/verify-otp/otp-page.js";
import DashboardPage from "../pages/dashboard/dashboard-page.js";
import ProfilePage from "../pages/dashboard/profile/profile-page.js";
import LandingPage from "../pages/landingpage/landing-page.js";
import CoursePresenter from "../pages/student/course/presenter.js";
import CreateCoursePage from "../pages/student/create-course/page.js";
import UpgradePage from "../pages/student/upgrade/upgrade-page.js";
import PaymentSuccessPage from "../pages/student/upgrade/upgrade-success.js";
import TeacherClassPage from "../pages/teacher/class/page.js";
import CourseDetailPage from "../pages/teacher/detail-course/page.js";
import TeacherGradePage from "../pages/teacher/grade/page.js";
import EnvConfigPage from "../pages/admin/env-configs/page.js";
import MonitorPage from "../pages/admin/monitor-backend/page.js";

const routes = {
  "/": LandingPage,
  "/login": LoginPage,
  "/register": RegisterPage,
  "/verify": LoginPage,
  "/otp": OtpPage,
  "/dashboard": DashboardPage,
  "/forgot-password": ForgotPasswordPage,
  "/reset-password": ResetPasswordPage,
  "/verify-email": VerifyEmailPage,
  "/create": CreateCoursePage,
  "/profile": ProfilePage,
  "/upgrade": UpgradePage,
  "/course": {
    async render() {
      const container = document.querySelector("#main-content");
      if (!container) return;

      container.innerHTML = `<p class="text-gray-600 text-center">Loading kursus...</p>`;
      await CoursePresenter.init();
    }
  },

  "/course/session": {
    async render() {
      const view = await import("../pages/student/course/sessions/view.js");
      const currentSessionNumber = sessionStorage.getItem("current_session_number");

      if (!currentSessionNumber) {
        const container = document.querySelector("#main-content");
        container.innerHTML = `<p class="text-center text-red-500">Sesi belum dipilih.</p>`;
        return;
      }

      await view.default.render(parseInt(currentSessionNumber));
    }
  },
  "/teacher/course-detail": CourseDetailPage,
  "/payment-success": PaymentSuccessPage,
  "/class": TeacherClassPage,
  "/grade": TeacherGradePage,
  "/manage-courses" : AdminCoursePage,
  "/manage-payments" : ManagePaymentsPage,
  "/env-config": EnvConfigPage,
  "/monitor-backend": MonitorPage,
};

export default routes;

