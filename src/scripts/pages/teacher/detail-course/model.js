// model.js
import Api from "../../../data/api.js";

const CourseDetailModel = {
    async getCourseDetail(courseId) {
        try {
            return await Api.getTeacherCourseDetail(courseId);
        } catch (error) {
            // console.error("[Model] Gagal ambil detail course:", error);
            throw error;
        }
    },

    async editCourse(courseId, payload) {
        try {
            return await Api.editTeacherCourse(courseId, payload);
        } catch (error) {
            // console.error("[Model] Gagal edit course:", error);
            throw error;
        }
    },

    async revertCourse(courseId, payload = { title: "", description: "" }) {
        try {
            return await Api.revertTeacherCourse(courseId, payload);
        } catch (error) {
            // console.error("[Model] Gagal revert course:", error);
            throw error;
        }
    },

    async editSession(courseId, sessionNumber, payload) {
        try {
            return await Api.editTeacherCourseSession(courseId, sessionNumber, {
                title: payload.title,
                content: payload.content,
            });
        } catch (error) {
            // console.error("[Model] Gagal edit sesi:", error);
            throw error;
        }
    },

    async deleteSession(courseId, sessionNumber) {
        try {
            return await Api.deleteTeacherCourseSession(courseId, sessionNumber);
        } catch (error) {
            // console.error("[Model] Gagal hapus sesi:", error);
            throw error;
        }
    },

    async verifyCourse(courseId) {
        try {
            return await Api.verifyTeacherCourse(courseId);
        } catch (error) {
            // console.error("[Model] Gagal verifikasi course:", error);
            throw error;
        }
    },
};

export default CourseDetailModel;