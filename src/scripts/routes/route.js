import LandingPage from "../pages/landingpage/landing-page.js";
import LoginPage from "../pages/login/login-page.js";
import RegisterPage from "../pages/register/register-page.js";
import OtpPage from "../pages/verify-otp/otp-page.js";
import DashboardPage from "../pages/dashboard-student/dashboard-page.js";

const routes = {
  "/": LandingPage,
  "/login": LoginPage,
  "/register": RegisterPage,
  "/verify": LoginPage,
  "/otp": OtpPage,
  "/dashboard": DashboardPage,
};

export default routes;
