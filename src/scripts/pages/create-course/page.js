import CreateCoursePresenter from "./presenter.js";

const CreateCoursePage = {
  async render() {
    return `
      <section class="p-6 max-w-2xl mx-auto">
        <h1 class="text-2xl font-bold mb-4">Buat Course Baru</h1>

        <div id="recommendation-list" class="mb-4 space-y-2"></div>

        <form id="create-course-form" class="space-y-4">
          <div>
            <label for="subject" class="block text-sm font-medium">Subject</label>
            <input type="text" id="subject" name="subject" required class="mt-1 block w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label for="level" class="block text-sm font-medium">Level</label>
            <select id="level" name="level" required class="mt-1 block w-full border rounded px-3 py-2">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          <button type="button" id="recommend-btn" class="bg-green-600 text-white px-4 py-2 rounded">Butuh Rekomendasi</button>
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Buat Course</button>
        </form>

        <p id="create-error" class="text-red-600 mt-2 hidden">Gagal membuat course. Coba lagi.</p>
      </section>
    `;
  },

  async afterRender() {
    CreateCoursePresenter.init();
  }
};

export default CreateCoursePage;
