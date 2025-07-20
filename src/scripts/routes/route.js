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
import CourseNotesView from "../pages/student/course/course-notes-view.js";
import SessionView from "../pages/student/course/sessions/view.js";
import UpgradePage from "../pages/student/upgrade/upgrade-page.js";
import PaymentStatusPage from "../pages/student/upgrade/upgrade-success.js";
import TeacherClassPage from "../pages/teacher/class/page.js";
import CourseDetailPage from "../pages/teacher/detail-course/page.js";
import TeacherGradePage from "../pages/teacher/grade/page.js";
import EnvConfigPage from "../pages/admin/env-configs/page.js";
import MonitorPage from "../pages/admin/monitor-backend/page.js";
import ManageUserPage from "../pages/admin/manage-user/manage-user-page.js";
import FlashcardPage from "../pages/student/flashcard/flashcard-page.js";
import QuizPage from "../pages/student/quiz/quiz-page.js";
import FinalExamPage from "../pages/student/final-exam/final-exam-page.js";

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
  "/course/notes": CourseNotesView,

  "/course/flashcards": {
    async render() {
      console.log("=== FLASHCARD ROUTE DEBUG ===");
      console.log("Full URL:", window.location.href);
      console.log("Hash:", window.location.hash);

      // Multiple ways to get course_id
      const hash = window.location.hash;
      let courseId = null;

      // Method 1: Split by ?
      if (hash.includes("?")) {
        const queryPart = hash.split("?")[1];
        console.log("Query part:", queryPart);

        const params = new URLSearchParams(queryPart);
        courseId = params.get("course_id");
        console.log("Method 1 courseId:", courseId);
      }

      // Method 2: Manual parsing (backup)
      if (!courseId) {
        const match = hash.match(/course_id=([^&]+)/);
        if (match) {
          courseId = match[1];
          console.log("Method 2 courseId:", courseId);
        }
      }

      // Method 3: Using URL constructor (backup)
      if (!courseId) {
        try {
          const fullUrl =
            window.location.origin +
            window.location.pathname +
            window.location.hash.substring(1);
          const url = new URL(fullUrl);
          courseId = url.searchParams.get("course_id");
          console.log("Method 3 courseId:", courseId);
        } catch (e) {
          console.log("Method 3 failed:", e);
        }
      }

      console.log("Final courseId:", courseId);
      console.log("=== END DEBUG ===");

      const container = document.querySelector("#main-content");

      if (!courseId) {
        container.innerHTML = `
        <div class="container mx-auto px-4 py-8">
          <div class="max-w-4xl mx-auto">
            <h1 class="text-3xl font-bold text-red-600 mb-4">Debug Info</h1>
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p><strong>Course ID is required</strong></p>
              <p class="text-sm mt-2">Full URL: ${window.location.href}</p>
              <p class="text-sm">Hash: ${window.location.hash}</p>
              <p class="text-sm">Query part: ${
                hash.includes("?") ? hash.split("?")[1] : "No query found"
              }</p>
            </div>
            <a href="#/course" class="text-blue-600 hover:underline">← Back to Course</a>
          </div>
        </div>
      `;
        return;
      }

      // Jika courseId ada, buat flashcard page
      try {
        const flashcardPage = new FlashcardPage();
        await flashcardPage.render(courseId);
      } catch (error) {
        console.error("Error rendering flashcard page:", error);
        container.innerHTML = `
        <div class="container mx-auto px-4 py-8">
          <div class="max-w-4xl mx-auto">
            <h1 class="text-3xl font-bold text-red-600 mb-4">Error</h1>
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>Error loading flashcard page: ${error.message}</p>
            </div>
            <a href="#/course" class="text-blue-600 hover:underline">← Back to Course</a>
          </div>
        </div>
      `;
      }
    },
  },

  "/course/final-exam": {
    async render() {
      console.log("=== FINAL EXAM ROUTE ===");
      console.log("Full URL:", window.location.href);
      console.log("Hash:", window.location.hash);

      const hash = window.location.hash;
      let courseId = null;

      // Method 1: Split by ? (sama seperti flashcard)
      if (hash.includes("?")) {
        const queryPart = hash.split("?")[1];
        console.log("Query part:", queryPart);

        const params = new URLSearchParams(queryPart);
        courseId = params.get("course_id");
        console.log("Method 1 courseId:", courseId);
      }

      // Method 2: Manual parsing (backup)
      if (!courseId) {
        const match = hash.match(/course_id=([^&]+)/);
        if (match) {
          courseId = match[1];
          console.log("Method 2 courseId:", courseId);
        }
      }

      // Method 3: Using URL constructor (backup)
      if (!courseId) {
        try {
          const fullUrl =
            window.location.origin +
            window.location.pathname +
            window.location.hash.substring(1);
          const url = new URL(fullUrl);
          courseId = url.searchParams.get("course_id");
          console.log("Method 3 courseId:", courseId);
        } catch (e) {
          console.log("Method 3 failed:", e);
        }
      }

      console.log("Final Exam courseId:", courseId);
      console.log("=== END FINAL EXAM DEBUG ===");

      const container = document.querySelector("#main-content");

      if (!courseId) {
        container.innerHTML = `
          <div class="container mx-auto px-4 py-8">
            <div class="max-w-4xl mx-auto">
              <h1 class="text-3xl font-bold text-red-600 mb-4">Debug Info</h1>
              <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p><strong>Course ID is required</strong></p>
                <p class="text-sm mt-2">Full URL: ${window.location.href}</p>
                <p class="text-sm">Hash: ${window.location.hash}</p>
                <p class="text-sm">Query part: ${
                  hash.includes("?") ? hash.split("?")[1] : "No query found"
                }</p>
              </div>
              <a href="#/course" class="text-blue-600 hover:underline">← Back to Course</a>
            </div>
          </div>
        `;
        return;
      }

      try {
        const finalExamPage = new FinalExamPage();
        await finalExamPage.render(courseId);
      } catch (error) {
        console.error("Error rendering final exam page:", error);
        container.innerHTML = `
          <div class="container mx-auto px-4 py-8">
            <div class="max-w-4xl mx-auto">
              <h1 class="text-3xl font-bold text-red-600 mb-4">Error</h1>
              <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>Error loading final exam page: ${error.message}</p>
                <p class="text-sm mt-2">Make sure FinalExamPage class is properly imported and instantiated</p>
              </div>
              <a href="#/course" class="text-blue-600 hover:underline">← Back to Course</a>
            </div>
          </div>
        `;
      }
    },
  },
  "/course/quiz": QuizPage,
  "/profile": ProfilePage,
  "/upgrade": UpgradePage,
  "/manage-users": ManageUserPage,
  "/course": {
    async render() {
      const container = document.querySelector("#main-content");
      if (!container) return;

      container.innerHTML = `<p class="text-gray-600 text-center">Loading kursus...</p>`;
      await CoursePresenter.init();
    },
  },

  "/course/session": {
    async render() {
      const view = await import("../pages/student/course/sessions/view.js");

      // Ambil query parameter jika ada
      const urlParams = new URLSearchParams(window.location.hash.split("?")[1]);
      const numberParam = urlParams.get("number");

      // Gunakan query param jika ada, fallback ke sessionStorage
      const currentSessionNumber =
        parseInt(numberParam) ||
        parseInt(sessionStorage.getItem("current_session_number"));

      if (!currentSessionNumber) {
        const container = document.querySelector("#main-content");
        container.innerHTML = `<p class="text-center text-red-500">Sesi belum dipilih.</p>`;
        return;
      }

      await view.default.render(currentSessionNumber);
    },
  },

  "/teacher/course-detail": CourseDetailPage,
  "/status": PaymentStatusPage,
  "/class": TeacherClassPage,
  "/grade": TeacherGradePage,
  "/manage-courses": AdminCoursePage,
  "/manage-payments": ManagePaymentsPage,

  "/env-config": EnvConfigPage,
  "/monitor-backend": MonitorPage,
};

export default routes;
