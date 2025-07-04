import CONFIG from "../../../config.js";

const CourseModel = {
  async fetchCourseContent() {
    const courseId = sessionStorage.getItem("current_course_id");
    if (!courseId) throw new Error("ID kursus tidak ditemukan di session");

    console.log("[CourseModel] Fetching content for course ID:", courseId);

    const res = await fetch(`${CONFIG.BASE_URL}/student/courses/${courseId}/content`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    if (!res.ok) {
      console.error("[CourseModel] Fetch failed:", res.status, res.statusText);
      throw new Error("Gagal mengambil konten kursus");
    }

    try {
      const data = await res.json();
      console.log("[CourseModel] Fetched data:", data);
      return data;
    } catch (err) {
      console.error("[CourseModel] Failed to parse JSON:", err);
      throw new Error("Format data tidak valid");
    }
  }
};

export default CourseModel;
