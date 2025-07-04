import Api from "../../../data/api.js";

const CreateCourseModel = {
  async submitCourse({ subject, level }) {
    const response = await Api.createCourse({ subject, level });

    // Kita hanya butuh info awal (misalnya course_id)
    return response;
  },
  async getRecommendation() {
    try {
      return await Api.getCourseRecommendations();
    } catch (error) {
      console.error("[CreateCourseModel] Gagal mengambil rekomendasi:", error);
      return { recommendations: [] };
    }
  },

  // Add this new method to check generation status
  async checkGenerationStatus(courseId) {
    try {
      return await Api.checkCourseGenerationStatus(courseId);
    } catch (error) {
      console.error("[CreateCourseModel] Gagal memeriksa status:", error);
      return { complete: false };
    }
  },
};

export default CreateCourseModel;
