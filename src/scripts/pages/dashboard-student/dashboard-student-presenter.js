import DashboardStudentModel from "./dashboard-student-model.js";

const DashboardStudentPresenter = {
  async getCourses() {
    return await DashboardStudentModel.getCourses();
  },

  async getTotalCourses() {
    const courses = await this.getCourses();
    return courses.length;
  },
};

export default DashboardStudentPresenter;
