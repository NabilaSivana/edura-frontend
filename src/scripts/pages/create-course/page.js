import CreateCoursePresenter from "./presenter.js";

const CreateCoursePage = {
  async render() {
    return `
    <section class="max-w-2xl mx-auto py-10 px-4 text-center">
      <a href="#/dashboard" class="block text-left text-sm text-black mb-4">&larr; Kembali</a>
      <h1 class="text-3xl font-bold text-blue-700 mb-1">Start Building Your Personal Study Material</h1>
      <p class="text-gray-500 mb-8">Fill all details in order to generate material for your next project</p>

      <form id="create-course-form" class="space-y-6 text-left">
        <div>
          <label class="block font-medium text-gray-700 mb-1">
            Enter topic or paste the content for which you want to generate study material <span class="text-red-500">*</span>
          </label>
          <textarea id="subject" name="subject" required rows="3" placeholder="Start writing here"
            class="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"></textarea>
          <div class="flex justify-between items-center mb-2">
              <button type="button" id="recommend-btn" class="text-blue-600 text-sm hover:underline">Perlu Rekomendasi?</button>
            </div>
            <div id="recommendation-list" class="flex flex-wrap gap-2 mb-3"></div>       
          </div>
        </div>

        <div>
          <label for="level" class="block font-medium text-gray-700 mb-1">Select the difficulty Level <span class="text-red-500">*</span></label>
          <select id="level" name="level" required
            class="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700">
            <option value="" class="text-gray-400">Difficulty Level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advance</option>
          </select>
        </div>

        <div class="flex justify-end">
          <button type="submit" id="generate-btn" disabled
            class="bg-gray-300 text-white px-6 py-2 rounded cursor-not-allowed transition">
            Generate
          </button>
        </div>
      </form>

      <p id="create-error" class="text-red-600 mt-4 hidden text-center">Gagal membuat course. Coba lagi.</p>
    </section>
  `;
  },
  async afterRender() {
    CreateCoursePresenter.init();
  },
};

export default CreateCoursePage;
