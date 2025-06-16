import DashboardStudentModel from "./dashboard-student-model.js";

const DashboardStudentPresenter = {
  async getCourses() {
    try {
      const courses = await DashboardStudentModel.getCourses();
      return courses;
    } catch (error) {
      console.error("Error fetching courses:", error);
      return [];
    }
  },
};

export default DashboardStudentPresenter;
