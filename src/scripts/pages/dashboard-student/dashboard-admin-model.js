// src/scripts/pages/teacher/dashboard-admin-model.js
import Api from "../../data/api.js";

const DashboardAdminModel = {
    async getAllstudent({ page = 1, limit = 10, search = "" }) {
        return await Api.getAllstudent(page, limit, search);
    },

    async getAllteacher({ page = 1, limit = 10, search = "" }) {
        return await Api.getAllteacher(page, limit, search);
    },

    async getAlladmin({ page = 1, limit = 10, search = "" }) {
        return await Api.getAlladmin(page, limit, search);
    },

    // Optional: tetap simpan getAllUsers kalau kamu butuh fetch semua sekaligus di tempat lain
    async getAllUsers({ page = 1, limit = 10, search = "" }) {
        const [student, teacher, admin] = await Promise.all([
            Api.getAllstudent(page, limit, search),
            Api.getAllteacher(page, limit, search),
            Api.getAlladmin(page, limit, search),
        ]);
        return { student, teacher, admin };
    },
};

export default DashboardAdminModel;
