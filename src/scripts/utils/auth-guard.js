// // // // utils/auth-guard.js
// // // const AuthGuard = {
// // //     isBlockedAuthRoute() {
// // //         const token = localStorage.getItem("token");
// // //         const currentRoute = window.location.hash.replace("#", "");
// // //         const isAuthPage = [
// // //             "/login",
// // //             "/register",
// // //             "/otp",
// // //             "/verify-email",
// // //             "/forgot-password",
// // //             "/reset-password",
// // //             "/verify",
// // //         ].includes(currentRoute);

// // //         return token && isAuthPage;
// // //     },

// // //     isBlockedProtectedRoute() {
// // //         const token = localStorage.getItem("token");
// // //         const currentRoute = window.location.hash.replace("#", "");
// // //         const protectedRoutes = ["/dashboard", "/create", "/profile", "/upgrade", "/course", "/class", "/grade"];
// // //         return !token && protectedRoutes.includes(currentRoute);
// // //     },

// // //     shouldRedirectToOtp() {
// // //         const token = localStorage.getItem("token");
// // //         const email = sessionStorage.getItem("pendingOtpEmail");
// // //         const currentRoute = window.location.hash.replace("#", "");
// // //         return !token && email && currentRoute === "/login";
// // //     }
// // // };

// // // export default AuthGuard;

// // // utils/auth-guard.js
// // const AuthGuard = {
// //     // Route definitions with required roles
// //     ROUTE_PERMISSIONS: {
// //         // Public routes - no authentication required
// //         "/": null,
// //         "/be-teacher": null,
// //         "/terms": null,

// //         // Auth routes - should redirect if already logged in
// //         "/login": "auth_only",
// //         "/register": "auth_only",
// //         "/otp": "auth_only",
// //         "/verify-email": "auth_only",
// //         "/forgot-password": "auth_only",
// //         "/reset-password": "auth_only",
// //         "/verify": "auth_only",
// //         "/setup-teacher-password": "auth_only",
// //         "/resend-teacher-setup": "auth_only",

// //         // General protected routes - any authenticated user
// //         "/dashboard": ["student", "teacher", "admin"],
// //         "/profile": ["student", "teacher", "admin"],

// //         // Student specific routes
// //         "/create": ["student"],
// //         "/upgrade": ["student"],
// //         "/course": ["student"],
// //         "/course/notes": ["student"],
// //         "/course/flashcards": ["student"],
// //         "/course/final-exam": ["student"],
// //         "/course/quiz": ["student"],
// //         "/course/session": ["student"],
// //         "/status": ["student"],

// //         // Teacher specific routes
// //         "/class": ["teacher", "admin"],
// //         "/grade": ["teacher", "admin"],
// //         "/teacher/course-detail": ["teacher", "admin"],

// //         // Admin specific routes
// //         "/manage-users": ["admin"],
// //         "/manage-courses": ["admin"],
// //         "/manage-payments": ["admin"],
// //         "/teacher-requests": ["admin"],
// //         "/manage-class": ["admin"],
// //         "/env-config": ["admin"],
// //         "/monitor-backend": ["admin"],
// //     },

// //     isAuthenticated() {
// //         const token = localStorage.getItem("token");
// //         if (!token) return false;

// //         try {
// //             // Check if token is expired
// //             const payload = JSON.parse(atob(token.split('.')[1]));
// //             const now = Date.now() / 1000;

// //             if (payload.exp && payload.exp < now) {
// //                 // Token expired, remove it
// //                 localStorage.removeItem("token");
// //                 localStorage.removeItem("user_id");
// //                 localStorage.removeItem("user_role");
// //                 return false;
// //             }

// //             return true;
// //         } catch (error) {
// //             // Invalid token format
// //             console.error('Invalid token format:', error);
// //             localStorage.removeItem("token");
// //             localStorage.removeItem("user_id");
// //             localStorage.removeItem("user_role");
// //             return false;
// //         }
// //     },

// //     getCurrentUserRole() {
// //         if (!this.isAuthenticated()) return null;

// //         try {
// //             const token = localStorage.getItem("token");
// //             const payload = JSON.parse(atob(token.split('.')[1]));
// //             return payload.role;
// //         } catch (error) {
// //             console.error('Error getting user role:', error);
// //             return null;
// //         }
// //     },

// //     getCurrentUserId() {
// //         if (!this.isAuthenticated()) return null;

// //         try {
// //             const token = localStorage.getItem("token");
// //             const payload = JSON.parse(atob(token.split('.')[1]));
// //             return payload.id;
// //         } catch (error) {
// //             console.error('Error getting user ID:', error);
// //             return null;
// //         }
// //     },

// //     checkRouteAccess(route) {
// //         const routePermissions = this.ROUTE_PERMISSIONS[route];
// //         const isAuthenticated = this.isAuthenticated();
// //         const userRole = this.getCurrentUserRole();

// //         // Route not defined in permissions - allow access (for backward compatibility)
// //         if (routePermissions === undefined) {
// //             console.warn(`Route "${route}" not defined in ROUTE_PERMISSIONS`);
// //             return { allowed: true, reason: null };
// //         }

// //         // Public route - always allow
// //         if (routePermissions === null) {
// //             return { allowed: true, reason: null };
// //         }

// //         // Auth-only routes (login, register, etc.)
// //         if (routePermissions === "auth_only") {
// //             if (isAuthenticated) {
// //                 return { allowed: false, reason: "already_authenticated" };
// //             }
// //             return { allowed: true, reason: null };
// //         }

// //         // Protected routes - require authentication
// //         if (Array.isArray(routePermissions)) {
// //             if (!isAuthenticated) {
// //                 return { allowed: false, reason: "not_authenticated" };
// //             }

// //             if (!routePermissions.includes(userRole)) {
// //                 return { allowed: false, reason: "insufficient_role" };
// //             }

// //             return { allowed: true, reason: null };
// //         }

// //         // Default to allow if we can't determine
// //         return { allowed: true, reason: null };
// //     },

// //     isBlockedAuthRoute() {
// //         const currentRoute = window.location.hash.replace("#", "");
// //         const access = this.checkRouteAccess(currentRoute);

// //         return !access.allowed && access.reason === "already_authenticated";
// //     },

// //     isBlockedProtectedRoute() {
// //         const currentRoute = window.location.hash.replace("#", "");
// //         const access = this.checkRouteAccess(currentRoute);

// //         return !access.allowed && access.reason === "not_authenticated";
// //     },

// //     isForbiddenRoute() {
// //         const currentRoute = window.location.hash.replace("#", "");
// //         const access = this.checkRouteAccess(currentRoute);

// //         return !access.allowed && access.reason === "insufficient_role";
// //     },

// //     shouldRedirectToOtp() {
// //         const token = localStorage.getItem("token");
// //         const email = sessionStorage.getItem("pendingOtpEmail");
// //         const currentRoute = window.location.hash.replace("#", "");
// //         return !token && email && currentRoute === "/login";
// //     },

// //     // Helper method to get redirect destination
// //     getRedirectDestination() {
// //         const currentRoute = window.location.hash.replace("#", "");
// //         const access = this.checkRouteAccess(currentRoute);

// //         switch (access.reason) {
// //             case "already_authenticated":
// //                 return "#/dashboard";
// //             case "not_authenticated":
// //                 return "#/login";
// //             case "insufficient_role":
// //                 return "#/403";
// //             default:
// //                 return null;
// //         }
// //     },

// //     // Method to handle special OTP redirect logic
// //     handleOtpRedirect() {
// //         if (this.shouldRedirectToOtp()) {
// //             window.location.hash = "#/otp";
// //             return true;
// //         }
// //         return false;
// //     }
// // };

// // export default AuthGuard;
// // utils/auth-guard.js
// const AuthGuard = {
//     // Route definitions with required roles
//     ROUTE_PERMISSIONS: {
//         // Public routes - no authentication required
//         "/": null,
//         "/be-teacher": null,
//         "/terms": null,

//         // Auth routes - should redirect if already logged in
//         "/login": "auth_only",
//         "/register": "auth_only",
//         "/otp": "auth_only",
//         "/verify-email": "auth_only",
//         "/forgot-password": "auth_only",
//         "/reset-password": "auth_only",
//         "/verify": "auth_only",
//         "/setup-teacher-password": "auth_only",
//         "/resend-teacher-setup": "auth_only",

//         // General protected routes - any authenticated user
//         "/dashboard": ["student", "teacher", "admin"],
//         "/profile": ["student", "teacher", "admin"],

//         // Student specific routes
//         "/create": ["student"],
//         "/upgrade": ["student"],
//         "/course": ["student"],
//         "/course/notes": ["student"],
//         "/course/flashcards": ["student"],
//         "/course/final-exam": ["student"],
//         "/course/quiz": ["student"],
//         "/course/session": ["student"],
//         "/status": ["student"],

//         // Teacher specific routes
//         "/class": ["teacher", "admin"],
//         "/grade": ["teacher", "admin"],
//         "/teacher/course-detail": ["teacher", "admin"],

//         // Admin specific routes
//         "/manage-users": ["admin"],
//         "/manage-courses": ["admin"],
//         "/manage-payments": ["admin"],
//         "/teacher-requests": ["admin"],
//         "/manage-class": ["admin"],
//         "/env-config": ["admin"],
//         "/monitor-backend": ["admin"],
//     },

//     // Helper method to extract base route from URL with query parameters
//     getBaseRoute(route) {
//         // Remove query parameters and fragments
//         return route.split('?')[0].split('#')[0];
//     },

//     isAuthenticated() {
//         const token = localStorage.getItem("token");
//         if (!token) return false;

//         try {
//             // Check if token is expired
//             const payload = JSON.parse(atob(token.split('.')[1]));
//             const now = Date.now() / 1000;

//             if (payload.exp && payload.exp < now) {
//                 // Token expired, remove it
//                 localStorage.removeItem("token");
//                 localStorage.removeItem("user_id");
//                 localStorage.removeItem("user_role");
//                 return false;
//             }

//             return true;
//         } catch (error) {
//             // Invalid token format
//             console.error('Invalid token format:', error);
//             localStorage.removeItem("token");
//             localStorage.removeItem("user_id");
//             localStorage.removeItem("user_role");
//             return false;
//         }
//     },

//     getCurrentUserRole() {
//         if (!this.isAuthenticated()) return null;

//         try {
//             const token = localStorage.getItem("token");
//             const payload = JSON.parse(atob(token.split('.')[1]));
//             return payload.role;
//         } catch (error) {
//             console.error('Error getting user role:', error);
//             return null;
//         }
//     },

//     getCurrentUserId() {
//         if (!this.isAuthenticated()) return null;

//         try {
//             const token = localStorage.getItem("token");
//             const payload = JSON.parse(atob(token.split('.')[1]));
//             return payload.id;
//         } catch (error) {
//             console.error('Error getting user ID:', error);
//             return null;
//         }
//     },

//     checkRouteAccess(route) {
//         // Extract base route without query parameters
//         const baseRoute = this.getBaseRoute(route);
//         const routePermissions = this.ROUTE_PERMISSIONS[baseRoute];
//         const isAuthenticated = this.isAuthenticated();
//         const userRole = this.getCurrentUserRole();

//         // Route not defined in permissions - allow access (for backward compatibility)
//         if (routePermissions === undefined) {
//             console.warn(`Route "${baseRoute}" not defined in ROUTE_PERMISSIONS (original route: "${route}")`);
//             return { allowed: true, reason: null };
//         }

//         // Public route - always allow
//         if (routePermissions === null) {
//             return { allowed: true, reason: null };
//         }

//         // Auth-only routes (login, register, etc.)
//         if (routePermissions === "auth_only") {
//             if (isAuthenticated) {
//                 return { allowed: false, reason: "already_authenticated" };
//             }
//             return { allowed: true, reason: null };
//         }

//         // Protected routes - require authentication
//         if (Array.isArray(routePermissions)) {
//             if (!isAuthenticated) {
//                 return { allowed: false, reason: "not_authenticated" };
//             }

//             if (!routePermissions.includes(userRole)) {
//                 return { allowed: false, reason: "insufficient_role" };
//             }

//             return { allowed: true, reason: null };
//         }

//         // Default to allow if we can't determine
//         return { allowed: true, reason: null };
//     },

//     isBlockedAuthRoute() {
//         const currentRoute = window.location.hash.replace("#", "");
//         const access = this.checkRouteAccess(currentRoute);

//         return !access.allowed && access.reason === "already_authenticated";
//     },

//     isBlockedProtectedRoute() {
//         const currentRoute = window.location.hash.replace("#", "");
//         const access = this.checkRouteAccess(currentRoute);

//         return !access.allowed && access.reason === "not_authenticated";
//     },

//     isForbiddenRoute() {
//         const currentRoute = window.location.hash.replace("#", "");
//         const access = this.checkRouteAccess(currentRoute);

//         return !access.allowed && access.reason === "insufficient_role";
//     },

//     shouldRedirectToOtp() {
//         const token = localStorage.getItem("token");
//         const email = sessionStorage.getItem("pendingOtpEmail");
//         const currentRoute = window.location.hash.replace("#", "");
//         const baseRoute = this.getBaseRoute(currentRoute);
//         return !token && email && baseRoute === "/login";
//     },

//     // Helper method to get redirect destination
//     getRedirectDestination() {
//         const currentRoute = window.location.hash.replace("#", "");
//         const access = this.checkRouteAccess(currentRoute);

//         switch (access.reason) {
//             case "already_authenticated":
//                 return "#/dashboard";
//             case "not_authenticated":
//                 return "#/login";
//             case "insufficient_role":
//                 return "#/403";
//             default:
//                 return null;
//         }
//     },

//     // Method to handle special OTP redirect logic
//     handleOtpRedirect() {
//         if (this.shouldRedirectToOtp()) {
//             window.location.hash = "#/otp";
//             return true;
//         }
//         return false;
//     }
// };

// export default AuthGuard;
const AuthGuard = {
    // Route definitions with required roles
    ROUTE_PERMISSIONS: {
        // Public routes - no authentication required
        "/": null,
        "/be-teacher": null,
        "/terms": null,

        // Auth routes - should redirect if already logged in
        "/login": "auth_only",
        "/register": "auth_only",
        "/otp": "auth_only",
        "/verify-email": "auth_only",
        "/forgot-password": "auth_only",
        "/reset-password": "auth_only",
        "/verify": "auth_only",
        "/setup-teacher-password": "auth_only",
        "/resend-teacher-setup": "auth_only",

        // General protected routes - any authenticated user
        "/dashboard": ["student", "teacher", "admin"],
        "/profile": ["student", "teacher", "admin"],

        // Student specific routes
        "/create": ["student"],
        "/upgrade": ["student"],
        "/course": ["student"],
        "/course/notes": ["student"],
        "/course/flashcards": ["student"],
        "/course/final-exam": ["student"],
        "/course/quiz": ["student"],
        "/course/session": ["student"],
        "/status": ["student"],

        // Teacher specific routes
        "/class": ["teacher", "admin"],
        "/grade": ["teacher", "admin"],
        "/teacher/course-detail": ["teacher", "admin"],

        // Admin specific routes
        "/manage-users": ["admin"],
        "/manage-courses": ["admin"],
        "/manage-payments": ["admin"],
        "/teacher-requests": ["admin"],
        "/manage-class": ["admin"],
        "/env-config": ["admin"],
        "/monitor-backend": ["admin"],
    },

    // Helper method to extract base route from URL with query parameters
    getBaseRoute(route) {
        // Handle empty route or just "/"
        if (!route || route === '' || route === '/') {
            return "/";
        }

        // Remove query parameters and fragments
        return route.split('?')[0].split('#')[0];
    },

    isAuthenticated() {
        const token = localStorage.getItem("token");
        if (!token) return false;

        try {
            // Check if token is expired
            const payload = JSON.parse(atob(token.split('.')[1]));
            const now = Date.now() / 1000;

            if (payload.exp && payload.exp < now) {
                // Token expired, remove it
                localStorage.removeItem("token");
                localStorage.removeItem("user_id");
                localStorage.removeItem("user_role");
                return false;
            }

            return true;
        } catch (error) {
            // Invalid token format
            console.error('Invalid token format:', error);
            localStorage.removeItem("token");
            localStorage.removeItem("user_id");
            localStorage.removeItem("user_role");
            return false;
        }
    },

    getCurrentUserRole() {
        if (!this.isAuthenticated()) return null;

        try {
            const token = localStorage.getItem("token");
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.role;
        } catch (error) {
            console.error('Error getting user role:', error);
            return null;
        }
    },

    getCurrentUserId() {
        if (!this.isAuthenticated()) return null;

        try {
            const token = localStorage.getItem("token");
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.id;
        } catch (error) {
            console.error('Error getting user ID:', error);
            return null;
        }
    },

    checkRouteAccess(route) {
        // Extract base route without query parameters
        const baseRoute = this.getBaseRoute(route);
        const routePermissions = this.ROUTE_PERMISSIONS[baseRoute];
        const isAuthenticated = this.isAuthenticated();
        const userRole = this.getCurrentUserRole();

        // Route not defined in permissions - allow access (for backward compatibility)
        if (routePermissions === undefined) {
            console.warn(`Route "${baseRoute}" not defined in ROUTE_PERMISSIONS (original route: "${route}")`);
            return { allowed: true, reason: null };
        }

        // Public route - always allow
        if (routePermissions === null) {
            return { allowed: true, reason: null };
        }

        // Auth-only routes (login, register, etc.)
        if (routePermissions === "auth_only") {
            if (isAuthenticated) {
                return { allowed: false, reason: "already_authenticated" };
            }
            return { allowed: true, reason: null };
        }

        // Protected routes - require authentication
        if (Array.isArray(routePermissions)) {
            if (!isAuthenticated) {
                return { allowed: false, reason: "not_authenticated" };
            }

            if (!routePermissions.includes(userRole)) {
                return { allowed: false, reason: "insufficient_role" };
            }

            return { allowed: true, reason: null };
        }

        // Default to allow if we can't determine
        return { allowed: true, reason: null };
    },

    isBlockedAuthRoute() {
        const currentRoute = window.location.hash.replace("#", "") || "/";
        const access = this.checkRouteAccess(currentRoute);

        return !access.allowed && access.reason === "already_authenticated";
    },

    isBlockedProtectedRoute() {
        const currentRoute = window.location.hash.replace("#", "") || "/";
        const access = this.checkRouteAccess(currentRoute);

        return !access.allowed && access.reason === "not_authenticated";
    },

    isForbiddenRoute() {
        const currentRoute = window.location.hash.replace("#", "") || "/";
        const access = this.checkRouteAccess(currentRoute);

        return !access.allowed && access.reason === "insufficient_role";
    },

    shouldRedirectToOtp() {
        const token = localStorage.getItem("token");
        const email = sessionStorage.getItem("pendingOtpEmail");
        const currentRoute = window.location.hash.replace("#", "") || "/";
        const baseRoute = this.getBaseRoute(currentRoute);
        return !token && email && baseRoute === "/login";
    },

    // Helper method to get redirect destination
    getRedirectDestination() {
        const currentRoute = window.location.hash.replace("#", "") || "/";
        const access = this.checkRouteAccess(currentRoute);

        switch (access.reason) {
            case "already_authenticated":
                return "#/dashboard";
            case "not_authenticated":
                return "#/login";
            case "insufficient_role":
                return "#/403";
            default:
                return null;
        }
    },

    // Method to handle special OTP redirect logic
    handleOtpRedirect() {
        if (this.shouldRedirectToOtp()) {
            window.location.hash = "#/otp";
            return true;
        }
        return false;
    }
};

export default AuthGuard;