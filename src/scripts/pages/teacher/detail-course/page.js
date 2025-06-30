// src/scripts/pages/teacher/detail-page/page.js
import CourseDetailPresenter from "./presenter.js";

const CourseDetailPage = {
    async render() {
        return `
      <div class="max-w-6xl mx-auto p-6">
        <div id="course-detail-container" class="text-gray-700">Memuat...</div>

        <!-- Modal -->
        <div id="modal-container" class="fixed inset-0 bg-black/50 flex items-center justify-center hidden z-50">
          <div class="bg-white p-8 rounded-lg w-full max-w-4xl shadow-lg overflow-y-auto max-h-[90vh]">
            <h3 class="text-xl font-semibold mb-6" id="modal-title">Edit Data</h3>
            <form id="modal-form" class="space-y-6"></form>
            <div class="flex justify-end gap-2 mt-6">
              <button id="cancel-modal" type="button" class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">Batal</button>
              <button type="submit" form="modal-form" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Simpan</button>
            </div>
          </div>
        </div>
      </div>
    `;
    },

    async afterRender() {
        CourseDetailPresenter.init();
    }
};

export default CourseDetailPage;
