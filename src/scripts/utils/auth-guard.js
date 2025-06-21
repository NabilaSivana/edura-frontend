// utils/auth-guard.js
const AuthGuard = {
    isBlockedAuthRoute() {
        const token = localStorage.getItem("token");
        const currentRoute = window.location.hash.replace("#", "");
        const isAuthPage = [
            "/login",
            "/register",
            "/otp",
            "/verify-email",
            "/forgot-password"
        ].includes(currentRoute);

        return token && isAuthPage;
    },

    isBlockedProtectedRoute() {
        const token = localStorage.getItem("token");
        const currentRoute = window.location.hash.replace("#", "");
        const protectedRoutes = ["/dashboard", "/create"];
        return !token && protectedRoutes.includes(currentRoute);
    },

    shouldRedirectToOtp() {
        const token = localStorage.getItem("token");
        const email = sessionStorage.getItem("pendingOtpEmail");
        const currentRoute = window.location.hash.replace("#", "");
        return !token && email && currentRoute === "/login";
    }
};

export default AuthGuard;
