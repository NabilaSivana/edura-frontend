import Api from "../../../data/api.js";

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
        return courses;
      } catch (error) {
        return [];
      }
    } else {
      return [];
    }
  },
};

export default DashboardStudentModel;
