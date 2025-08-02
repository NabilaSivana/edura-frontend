// src/scripts/pages/dashboard/teacher/dashboard-teacher-model.js
import Api from "../../../data/api.js";

const DashboardTeacherModel = {
    async fetchUnverifiedCourses() {
        try {
            const result = await Api.getTeacherUnverifiedCourses();
            //console.log(result);
            return result;
        } catch (error) {
            // console.error("Gagal mengambil daftar course:", error);
            throw error;
        }
    },
    async fetchVerifiedCourses() {
        try {
            const result = await Api.getTeacherVerifiedCourses();
            return result;
        } catch (error) {
            // console.error("Gagal mengambil daftar course yang sudah diverifikasi:", error);
            throw error;
        }
    },
    async fetchCourseDetail(courseId) {
        try {
            const data = await Api.getTeacherCourseDetail(courseId);
            //console.log("Data",data);
            return data;
        } catch (error) {
            // console.error("Gagal mengambil detail course:", error);
            throw error;
        }
    },

    async updateCourse(courseId, title, description) {
        try {
            return await Api.editTeacherCourse(courseId, { title, description });
        } catch (error) {
            // console.error("Gagal memperbarui course:", error);
            throw error;
        }
    },

    async revertCourse(courseId) {
        try {
            return await Api.revertTeacherCourse(courseId);
        } catch (error) {
            // console.error("Gagal mengatur ulang course:", error);
            throw error;
        }
    },

    async updateSession(courseId, sessionNumber, title, content) {
        try {
            return await Api.editTeacherSession(courseId, sessionNumber, { title, content });
        } catch (error) {
            // console.error("Gagal memperbarui sesi:", error);
            throw error;
        }
    },

    async deleteSession(courseId, sessionNumber) {
        try {
            return await Api.deleteTeacherSession(courseId, sessionNumber);
        } catch (error) {
            // console.error("Gagal menghapus sesi:", error);
            throw error;
        }
    },

    async verifyCourse(courseId) {
        try {
            return await Api.verifyTeacherCourse(courseId);
        } catch (error) {
            // console.error("Gagal verifikasi course:", error);
            throw error;
        }
    }
};

export default DashboardTeacherModel;
