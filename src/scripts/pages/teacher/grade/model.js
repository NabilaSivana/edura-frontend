import Api from "../../../data/api";

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
            return await Api.getTeacherGrades(classId); // endpoint ambil siswa satu kelas
        } catch (error) {
            console.error("[Model] Gagal mengambil siswa:", error);
            throw error;
        }
    },
};

export default TeacherGradeModel;
