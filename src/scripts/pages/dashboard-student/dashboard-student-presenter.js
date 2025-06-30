import DashboardStudentModel from "./dashboard-student-model.js";

const DashboardStudentPresenter = {
  async getCourses() {
    const courses = await DashboardStudentModel.getCourses();

    const isGenerating = localStorage.getItem("course_generating") === "true";
    const courseId = localStorage.getItem("generating_course_id");

    if (isGenerating && courseId) {
      const tempCourse = {
        course_id: courseId,
        title: localStorage.getItem("generating_course_title"),
        level: localStorage.getItem("generating_course_level"),
        checkpoint: 0,
        total_sessions: 0,
        is_completed: false,
        isGenerating: true,
      };

      courses.unshift(tempCourse);

      localStorage.removeItem("course_generating");
      localStorage.removeItem("generating_course_id");
      localStorage.removeItem("generating_course_title");
      localStorage.removeItem("generating_course_level");
    }

    return courses;
  },

  async getTotalCourses() {
    const courses = await this.getCourses();
    return courses.length;
  },
};

export default DashboardStudentPresenter;
