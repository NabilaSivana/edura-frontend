//routes/route.js
import CreateCoursePage from "../pages/create-course/page.js";
import DashboardPage from "../pages/dashboard-student/dashboard-page.js";
import ForgotPasswordPage from "../pages/forgot-password/forgot-password-page.js";
import LandingPage from "../pages/landingpage/landing-page.js";
import LoginPage from "../pages/login/login-page.js";
import ProfilePage from "../pages/profile/profile-page.js";
import RegisterPage from "../pages/register/register-page.js";
import ResetPasswordPage from "../pages/reset-password/reset-password-page.js";
import UpgradePage from "../pages/upgrade/upgrade-page.js";
import VerifyEmailPage from "../pages/verify-email/verify-email-page.js";
import OtpPage from "../pages/verify-otp/otp-page.js";

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
  "/upgrade": UpgradePage
};

export default routes;
