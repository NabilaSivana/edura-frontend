// presenter.js - Simple interface for backward compatibility
import CreateCoursePresenter from "./create-course-presenter.js";

// Export the main presenter methods for your existing page structure
export default {
    init() {
        return CreateCoursePresenter.init();
    },

    destroy() {
        return CreateCoursePresenter.destroy();
    }
};