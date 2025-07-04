// === models/admin-course-model.js ===
import CONFIG from "../../../config";

const AdminCourseModel = {
    async getAllCourses({ page = 1, limit = 10, search = "" } = {}) {
        const url = new URL(`${CONFIG.BASE_URL}/admin/courses`);
        url.searchParams.append("page", page);
        url.searchParams.append("limit", limit);
        if (search) url.searchParams.append("search", search);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch courses");
        }
        return await response.json();
    },

    async getCourseDetail(courseId) {
        const response = await fetch(`${CONFIG.BASE_URL}/admin/courses/${courseId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch course detail");
        }
        return await response.json();
    },

    async deleteCourse(courseId) {
        const response = await fetch(`${CONFIG.BASE_URL}/admin/courses/${courseId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to delete course");
        }
        return await response.json();
    },

    async updateCourse(courseId, payload) {
        const response = await fetch(`${CONFIG.BASE_URL}/admin/courses/${courseId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            throw new Error("Failed to update course");
        }
        return await response.json();
    },
};

export default AdminCourseModel;