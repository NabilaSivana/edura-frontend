import DashboardStudentModel from "./dashboard-student-model.js";

const DashboardStudentPresenter = {
  async getCourses() {
    return await DashboardStudentModel.getCourses();
  },
};

export default DashboardStudentPresenter;
