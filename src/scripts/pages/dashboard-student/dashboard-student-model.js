import Api from "../../data/api.js";

const DashboardStudentModel = {
  async getCourses() {
    try {
      const courses = await Api.getStudentCourses();
      return courses;
    } catch (error) {
      console.error(
        "[DashboardStudentModel] Gagal mengambil kursus:",
        error.message
      );
      return [];
    }
  },
};

export default DashboardStudentModel;
