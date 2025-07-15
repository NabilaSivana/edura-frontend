// FILE: model.js
import Api from "../../../data/api";
import CONFIG from "../../../config.js";

const TeacherGradeModel = {
  async getClasses() {
    try {
      return await Api.getTeacherClasses();
    } catch (error) {
      console.error("[Model] Gagal mengambil kelas:", error);
      throw error;
    }
  },

  async getStudentsByClass(classId) {
    try {
      return await Api.getTeacherGrades(classId); // endpoint ambil nilai
    } catch (error) {
      console.error("[Model] Gagal mengambil siswa:", error);
      throw error;
    }
  },

  async sendStudentCertificateByTeacher(payload) {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/teacher/send-certificate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Gagal mengirim sertifikat');
      return result;
    } catch (error) {
      console.error("[Model] Gagal mengirim sertifikat:", error);
      throw error;
    }
  },
  async notifyStudent(payload) {
    const response = await fetch(`${CONFIG.BASE_URL}/teacher/notify-student`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal mengirim notifikasi');
    return result;
  }
};

export default TeacherGradeModel;
