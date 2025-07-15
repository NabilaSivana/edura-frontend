// File: src/scripts/pages/admin/dashboard-admin-model.js
import Api from "../../../data/api.js";

const DashboardAdminModel = {
  async getAllStats() {
    const [students, teachers, admins, courses] = await Promise.all([
      Api.getAllstudent(1, 1),
      Api.getAllteacher(1, 1),
      Api.getAlladmin(1, 1),
      Api.getTeacherVerifiedCourses(),
    ]);

    return {
      totalStudents: students.total || 0,
      totalTeachers: teachers.total || 0,
      totalAdmins: admins.total || 0,
      totalCourses: Array.isArray(courses) ? courses.length : 0,
    };
  },

  async getRecentActivities() {
    // You can replace this with a real endpoint if available
    return [
      {
        type: "user",
        message: "Siswa baru mendaftar - Ahmad",
        time: "1 menit lalu",
      },
      {
        type: "course",
        message: "Kursus 'Pemrograman js' dibuat oleh Budi",
        time: "10 menit lalu",
      },
      {
        type: "payment",
        message: "Pembayaran premium oleh user@example.com",
        time: "30 menit lalu",
      },
    ];
  },
};

export default DashboardAdminModel;
