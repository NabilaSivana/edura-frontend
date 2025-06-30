import Api from "../../data/api.js";

const DashboardStudentModel = {
  async getCourses() {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.hash = "#/login";
      return [];
    }
    const user = await Api.getProfile();
    if (user.role === 'student') {
      try {
        const courses = await Api.getStudentCourses();
        console.log("Data kursus:", courses); // Debugging
        return courses;
      } catch (error) {
        console.error("[DashboardStudentModel] Gagal mengambil kursus:", error.message);
        return [];
      }
    } else {
      return [];
    }
  },
};

export default DashboardStudentModel;
