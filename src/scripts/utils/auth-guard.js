// utils/auth-guard.js
const AuthGuard = {
    isBlockedAuthRoute() {
        const token = localStorage.getItem("token");
        const currentRoute = window.location.hash.replace("#", "");
        const isAuthPage = ["/login", "/register", "/otp", "/verify-email", "/forgot-password"].includes(currentRoute);
        return token && isAuthPage;
    },

    isBlockedProtectedRoute() {
        const token = localStorage.getItem("token");
        const currentRoute = window.location.hash.replace("#", "");
        const protectedRoutes = ["/dashboard", "/create"]; // Bisa kamu tambah nanti
        return !token && protectedRoutes.includes(currentRoute);
    },
};

export default AuthGuard;
