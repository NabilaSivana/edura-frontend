import CourseModel from "./model.js";
import CourseView from "./view.js";

const CoursePresenter = {
  async init() {
    try {
      console.log("[CoursePresenter] Initializing course from session...");
      const data = await CourseModel.fetchCourseContent();

      sessionStorage.setItem(`course-${data.course.id}`, JSON.stringify(data));
      CourseView.render(data);
    } catch (e) {
      CourseView.showError(e.message);
    }
  }
};

export default CoursePresenter;
