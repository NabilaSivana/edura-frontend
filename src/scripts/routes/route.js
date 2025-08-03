//routes/route.js
import EnvConfigPage from "../pages/admin/env-configs/page.js";
import AdminManageClassPage from "../pages/admin/manage-class/page.js";
import AdminCoursePage from "../pages/admin/manage-courses/page.js";
import ManagePaymentsPage from "../pages/admin/manage-payments/page.js";
import ManageUserPage from "../pages/admin/manage-user/page.js";
import MonitorPage from "../pages/admin/monitor-backend/page.js";
import TeacherRequestsPage from "../pages/admin/teacher-requests/page.js";
import ForgotPasswordPage from "../pages/auth/forgot-password/forgot-password-page.js";
import LoginPage from "../pages/auth/login/login-page.js";
import RegisterPage from "../pages/auth/register/register-page.js";
import ResetPasswordPage from "../pages/auth/reset-password/reset-password-page.js";
import VerifyEmailPage from "../pages/auth/verify-email/verify-email-page.js";
import OtpPage from "../pages/auth/verify-otp/otp-page.js";
import DashboardPage from "../pages/dashboard/dashboard-page.js";
import ProfilePage from "../pages/dashboard/profile/profile-page.js";
import BeTeacherPage from "../pages/landingpage/be-teacher.js";
import LandingPage from "../pages/landingpage/landing-page.js";
import TermsConditionsPage from "../pages/landingpage/terms.js";
import CourseNotesView from "../pages/student/course/course-notes-view.js";
import CoursePresenter from "../pages/student/course/presenter.js";
import CreateCoursePage from "../pages/student/create-course/page.js";
import FinalExamModel from "../pages/student/final-exam/final-exam-model.js";
import FinalExamPage from "../pages/student/final-exam/final-exam-page.js";
import FinalExamPresenter from "../pages/student/final-exam/final-exam-presenter.js";
import FlashcardPage from "../pages/student/flashcard/flashcard-page.js";
import QuizPage from "../pages/student/quiz/quiz-page.js";
import UpgradePage from "../pages/student/upgrade/upgrade-page.js";
import PaymentStatusPage from "../pages/student/upgrade/upgrade-success.js";
import TeacherClassPage from "../pages/teacher/class/page.js";
import CourseDetailPage from "../pages/teacher/detail-course/page.js";
import TeacherGradePage from "../pages/teacher/grade/page.js";
import { getLoadingAnimation } from "../utils/loading.js";

const routes = {
  "/": LandingPage,
  "/login": LoginPage,
  "/register": RegisterPage,
  "/verify": LoginPage,
  "/otp": {
    async render() {
      const { default: OtpPage } = await import("../pages/auth/verify-otp/otp-page.js");
      return await OtpPage.render();
    },

    async afterRender() {
      const { default: OtpPage } = await import("../pages/auth/verify-otp/otp-page.js");
      await OtpPage.afterRender();
    },

    destroy() {
      // Cleanup when leaving OTP page
      if (window.otpPageCleanup) {
        window.otpPageCleanup();
        delete window.otpPageCleanup;
      }
    }
  },

  "/dashboard": DashboardPage,
  "/forgot-password": ForgotPasswordPage,
  "/reset-password": ResetPasswordPage,
  "/verify-email": VerifyEmailPage,
  "/create": CreateCoursePage,
  "/course/notes": CourseNotesView,

  "/course/flashcards": {
    async render() {
      ////console.log("=== FLASHCARD ROUTE DEBUG ===");
      ////console.log("Full URL:", window.location.href);
      ////console.log("Hash:", window.location.hash);

      // Multiple ways to get course_id
      const hash = window.location.hash;
      let courseId = null;

      // Method 1: Split by ?
      if (hash.includes("?")) {
        const queryPart = hash.split("?")[1];
        ////console.log("Query part:", queryPart);

        const params = new URLSearchParams(queryPart);
        courseId = params.get("course_id");
        ////console.log("Method 1 courseId:", courseId);
      }

      // Method 2: Manual parsing (backup)
      if (!courseId) {
        const match = hash.match(/course_id=([^&]+)/);
        if (match) {
          courseId = match[1];
          ////console.log("Method 2 courseId:", courseId);
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
          ////console.log("Method 3 courseId:", courseId);
        } catch (e) {
          ////console.log("Method 3 failed:", e);
        }
      }

      ////console.log("Final courseId:", courseId);
      ////console.log("=== END DEBUG ===");

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
              <p class="text-sm">Query part: ${hash.includes("?") ? hash.split("?")[1] : "No query found"
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
        // console.error("Error rendering flashcard page:", error);
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
      const hash = window.location.hash;
      const courseId = new URLSearchParams(hash.split("?")[1]).get("course_id");
      const container = document.querySelector("#main-content");

      if (!courseId) {
        container.innerHTML = `
        <div class="min-h-screen flex items-center justify-center">
          <div class="text-center">
            <p class="text-red-500 text-xl">Error: Course ID tidak ditemukan.</p>
            <a href="#/course" class="text-blue-600 hover:underline mt-4 inline-block">Kembali ke Course</a>
          </div>
        </div>
      `;
        return;
      }

      try {
        const model = new FinalExamModel();
        const presenter = new FinalExamPresenter(model);
        const finalExamPage = new FinalExamPage(presenter);
        await finalExamPage.render(courseId);
      } catch (error) {
        // console.error("Error kritis saat merender final exam:", error);
        container.innerHTML = `
        <div class="min-h-screen flex items-center justify-center">
          <div class="text-center">
            <p class="text-red-500 text-xl">Gagal memuat komponen ujian.</p>
            <a href="#/course" class="text-blue-600 hover:underline mt-4 inline-block">Kembali ke Course</a>
          </div>
        </div>
      `;
      }
    },
    destroy() {
      // Cleanup when leaving the page
      const examPage = window.currentExamPage;
      if (examPage && examPage.destroy) {
        examPage.destroy();
      }
    }
  },
  "/course/quiz": QuizPage,
  "/profile": ProfilePage,
  "/upgrade": UpgradePage,
  "/manage-users": ManageUserPage,
  "/course": {
    async render() {
      const container = document.querySelector("#main-content");
      if (!container) return;

      // You can change the type: 'default', 'book', 'cards', 'skeleton', 'orb'
      container.innerHTML = getLoadingAnimation('cards');

      try {
        await CoursePresenter.init();
      } catch (error) {
        // console.error("Error loading courses:", error);
        container.innerHTML = `
        <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div class="text-center max-w-md">
            <div class="bg-red-100 dark:bg-red-900/20 rounded-full p-4 w-20 h-20 mx-auto mb-4">
              <svg class="w-12 h-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">Failed to Load Courses</h2>
            <p class="text-gray-600 dark:text-gray-400 mb-6">${error.message || 'An error occurred while loading your courses.'}</p>
            <button 
              onclick="location.reload()"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Try Again
            </button>
          </div>
        </div>
      `;
      }
    }
  },

  // Updated route definition for /course/session
  "/course/session": {
    async render() {
      //console.log('🔄 Course session route called');

      // Get session number from URL parameters
      const urlParams = new URLSearchParams(window.location.hash.split("?")[1]);
      const numberParam = urlParams.get("number");

      // Fallback to sessionStorage if URL param not found
      const currentSessionNumber = parseInt(numberParam) ||
        parseInt(sessionStorage.getItem("current_session_number")) || 1;

      //console.log(`📍 Session route: number=${numberParam}, resolved=${currentSessionNumber}`);

      if (!currentSessionNumber) {
        const container = document.querySelector("#main-content");
        container.innerHTML = `
        <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 px-4">
          <div class="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-sm w-full">
            <div class="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-800/30 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Sesi Tidak Dipilih</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Silakan pilih sesi yang ingin dipelajari.</p>
            <a href="#/course/notes" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Kembali ke Daftar
            </a>
          </div>
        </div>
      `;
        return;
      }

      // Update sessionStorage to match current session
      sessionStorage.setItem("current_session_number", currentSessionNumber);

      // Dynamic import SessionView
      try {
        const view = await import("../pages/student/course/sessions/view.js");
        //console.log(`🎯 Rendering session ${currentSessionNumber} via SessionView`);
        await view.default.render(currentSessionNumber);
      } catch (error) {
        console.error('❌ Error loading SessionView:', error);
        const container = document.querySelector("#main-content");
        container.innerHTML = `
        <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 px-4">
          <div class="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-sm w-full">
            <div class="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-800/30 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Gagal Memuat Sesi</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Terjadi kesalahan saat memuat halaman sesi: ${error.message}</p>
            <div class="space-y-2">
              <button 
                onclick="location.reload()"
                class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Muat Ulang
              </button>
              <a href="#/course/notes" class="block w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200 text-center">
                Kembali ke Daftar
              </a>
            </div>
          </div>
        </div>
      `;
      }
    },

    // Add cleanup method for when leaving the route
    destroy() {
      if (window.SessionView && window.SessionView.cleanup) {
        window.SessionView.cleanup();
      }
    }
  },
  "/teacher/course-detail": CourseDetailPage,
  "/status": PaymentStatusPage,
  "/class": TeacherClassPage,
  "/grade": TeacherGradePage,
  "/manage-courses": AdminCoursePage,
  "/manage-payments": ManagePaymentsPage,
  "/teacher-requests": TeacherRequestsPage,
  "/manage-class": AdminManageClassPage,
  "/env-config": EnvConfigPage,
  "/monitor-backend": MonitorPage,
  "/be-teacher": BeTeacherPage,
  "/terms": TermsConditionsPage,
  // Update di file routes/route.js - tambahkan/ganti route ini:

  "/setup-teacher-password": {
    async render() {
      // Import the page dynamically
      const { default: SetupTeacherPasswordPage } = await import("../pages/auth/setup-teacher-password/page.js");

      // Get container
      const container = document.querySelector("#main-content");
      if (!container) {
        console.error("❌ Main content container not found");
        return;
      }

      try {
        // Clear any existing content
        container.innerHTML = '';

        // Render the page
        const pageContent = await SetupTeacherPasswordPage.render();
        container.innerHTML = pageContent;

        // Initialize page after render
        await SetupTeacherPasswordPage.afterRender();

        //console.log("✅ Setup Teacher Password page rendered successfully");

      } catch (error) {
        console.error("❌ Error rendering Setup Teacher Password page:", error);
        container.innerHTML = `
        <div class="min-h-screen flex items-center justify-center bg-gray-50">
          <div class="max-w-md w-full bg-white rounded-lg shadow-md p-6">
            <div class="text-center">
              <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h2 class="text-xl font-bold text-gray-800 mb-2">Halaman Tidak Dapat Dimuat</h2>
              <p class="text-gray-600 mb-4">Terjadi kesalahan saat memuat halaman setup password.</p>
              <p class="text-sm text-red-600 mb-4">${error.message}</p>
              <div class="space-y-2">
                <button 
                  onclick="location.reload()"
                  class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                >
                  Muat Ulang Halaman
                </button>
                <a 
                  href="#/login" 
                  class="block w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-center"
                >
                  Kembali ke Login
                </a>
              </div>
            </div>
          </div>
        </div>
      `;
      }
    }
  },

  "/resend-teacher-setup": {
    async render() {
      // Import the page dynamically
      const { default: ResendTeacherSetupPage } = await import("../pages/auth/resend-teacher-setup/page.js");

      // Get container
      const container = document.querySelector("#main-content");
      if (!container) {
        console.error("❌ Main content container not found");
        return;
      }

      try {
        // Clear any existing content
        container.innerHTML = '';

        // Render the page
        const pageContent = await ResendTeacherSetupPage.render();
        container.innerHTML = pageContent;

        // Initialize page after render
        await ResendTeacherSetupPage.afterRender();

        //console.log("✅ Resend Teacher Setup page rendered successfully");

      } catch (error) {
        console.error("❌ Error rendering Resend Teacher Setup page:", error);
        container.innerHTML = `
        <div class="min-h-screen flex items-center justify-center bg-gray-50">
          <div class="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
            <h2 class="text-xl font-bold text-red-600 mb-4">Error</h2>
            <p class="text-gray-600 mb-4">Gagal memuat halaman kirim ulang link setup.</p>
            <a href="#/login" class="text-blue-600 hover:text-blue-800 font-medium">
              Kembali ke Login
            </a>
          </div>
        </div>
      `;
      }
    },
  },
};

export default routes;
