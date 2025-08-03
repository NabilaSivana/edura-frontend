import Api from "../../../data/api.js";

const DashboardTeacherModel = {
    async fetchUnverifiedCourses(forceRefresh = false) {
        try {
            if (forceRefresh) {
                //console.log("🔄 Force refreshing unverified courses from server...");
                // Clear specific cache untuk unverified courses
                await Api.teacher._invalidateCache('teacher/courses/unverified');
            }
            
            const result = await Api.getTeacherUnverifiedCourses();
            ////console.log(result);
            return result;
        } catch (error) {
            console.error("Gagal mengambil daftar course:", error);
            throw error;
        }
    },

    async fetchVerifiedCourses(forceRefresh = false) {
        try {
            if (forceRefresh) {
                //console.log("🔄 Force refreshing verified courses from server...");
                // Clear specific cache untuk verified courses
                await Api.teacher._invalidateCache('teacher/courses/verified');
            }
            
            const result = await Api.getTeacherVerifiedCourses();
            return result;
        } catch (error) {
            console.error("Gagal mengambil daftar course yang sudah diverifikasi:", error);
            throw error;
        }
    },

    async fetchCourseDetail(courseId, forceRefresh = false) {
        try {
            if (forceRefresh) {
                //console.log(`🔄 Force refreshing course detail ${courseId} from server...`);
                await Api.teacher._invalidateCache(`teacher/courses/${courseId}`);
            }
            
            const data = await Api.getTeacherCourseDetail(courseId);
            ////console.log("Data",data);
            return data;
        } catch (error) {
            console.error("Gagal mengambil detail course:", error);
            throw error;
        }
    },

    async updateCourse(courseId, title, description) {
        try {
            return await Api.editTeacherCourse(courseId, { title, description });
        } catch (error) {
            console.error("Gagal memperbarui course:", error);
            throw error;
        }
    },

    async revertCourse(courseId) {
        try {
            return await Api.revertTeacherCourse(courseId);
        } catch (error) {
            console.error("Gagal mengatur ulang course:", error);
            throw error;
        }
    },

    async updateSession(courseId, sessionNumber, title, content) {
        try {
            return await Api.editTeacherSession(courseId, sessionNumber, { title, content });
        } catch (error) {
            console.error("Gagal memperbarui sesi:", error);
            throw error;
        }
    },

    async deleteSession(courseId, sessionNumber) {
        try {
            return await Api.deleteTeacherSession(courseId, sessionNumber);
        } catch (error) {
            console.error("Gagal menghapus sesi:", error);
            throw error;
        }
    },

    async verifyCourse(courseId) {
        try {
            return await Api.verifyTeacherCourse(courseId);
        } catch (error) {
            console.error("Gagal verifikasi course:", error);
            throw error;
        }
    },

    // 🔄 NEW: Clear all teacher courses cache
    async clearCache() {
        try {
            //console.log("🧹 Clearing all teacher courses cache...");
            
            // Clear teacher cache menggunakan method dari teacher API
            Api.teacher.clearTeacherCache();
            
            // Juga clear specific cache patterns
            await Api.teacher._invalidateCache('teacher/courses/unverified');
            await Api.teacher._invalidateCache('teacher/courses/verified');
            await Api.teacher._invalidateCache('teacher/courses');
            
            //console.log("✅ Teacher courses cache cleared successfully");
        } catch (error) {
            console.error("❌ Failed to clear teacher courses cache:", error);
            throw error;
        }
    },

    // 🔄 NEW: Clear specific course cache
    async clearCourseCache(courseId) {
        try {
            //console.log(`🧹 Clearing cache for course ${courseId}...`);
            
            await Api.teacher._invalidateCache(`teacher/courses/${courseId}`);
            
            //console.log(`✅ Course ${courseId} cache cleared successfully`);
        } catch (error) {
            console.error(`❌ Failed to clear course ${courseId} cache:`, error);
            throw error;
        }
    },

    // 🔄 NEW: Force refresh all courses data
    async refreshAllData() {
        try {
            //console.log("🔄 Force refreshing all teacher courses data...");
            
            // Clear cache terlebih dahulu
            await this.clearCache();
            
            // Fetch fresh data dari server
            const [unverifiedCourses, verifiedCourses] = await Promise.all([
                this.fetchUnverifiedCourses(true),
                this.fetchVerifiedCourses(true)
            ]);
            
            //console.log("✅ All teacher courses data refreshed successfully");
            
            return {
                unverified: unverifiedCourses,
                verified: verifiedCourses
            };
        } catch (error) {
            console.error("❌ Failed to refresh all teacher courses data:", error);
            throw error;
        }
    }
};

export default DashboardTeacherModel;