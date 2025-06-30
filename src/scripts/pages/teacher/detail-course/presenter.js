import CourseDetailModel from "./model.js";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const CourseDetailPresenter = {
  async init() {
    const courseId = sessionStorage.getItem("teacher_selected_course_id");
    if (!courseId) return this.showError("ID course tidak ditemukan.");

    try {
      const data = await CourseDetailModel.getCourseDetail(courseId);
      this.renderCourse(data);
    } catch (error) {
      this.showError(error.message);
    }
  },

  renderCourse(data) {
    const container = document.getElementById("course-detail-container");
    if (!container) return;

    const { course, sessions } = data;
    container.innerHTML = `
      <div class="mb-6">
        <div class="flex justify-between items-start mb-2">
          <h1 class="text-3xl font-bold">${escapeHtml(course.title)}</h1>
          <button id="edit-title" class="text-blue-600 hover:text-blue-800">
            <i class="fas fa-pen"></i>
          </button>
        </div>
        <div class="flex justify-between items-start">
          <p class="text-gray-700 whitespace-pre-line">${escapeHtml(course.description)}</p>
          <button id="edit-description" class="text-blue-600 hover:text-blue-800">
            <i class="fas fa-pen"></i>
          </button>
        </div>
      </div>

      <h2 class="text-xl font-semibold mb-4">Daftar Sesi</h2>
      <ul class="space-y-4 mb-6">
        ${sessions.map((s) => `
          <li class="border p-4 rounded-md">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-semibold text-lg">Chapter ${s.session_number}: ${escapeHtml(s.title)}</h3>
                <pre class="text-sm text-gray-700 whitespace-pre-wrap mt-2">${escapeHtml(s.content || "")}</pre>
              </div>
              <div class="space-x-2">
                <button class="text-blue-600 hover:text-blue-800 edit-session-btn" data-session="${s.session_number}">
                  <i class="fas fa-pen"></i>
                </button>
                <button class="text-red-600 hover:text-red-800 delete-session-btn" data-session="${s.session_number}">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </li>
        `).join("")}
      </ul>

      <div class="flex justify-end space-x-4">
        <button id="btn-revert" class="text-sm text-yellow-600 hover:underline">Reset</button>
        <button id="btn-verify" class="text-sm text-green-600 hover:underline">Verifikasi</button>
      </div>
    `;

    document.getElementById("edit-title").addEventListener("click", () => this.showModal("title", course));
    document.getElementById("edit-description").addEventListener("click", () => this.showModal("description", course));

    document.querySelectorAll(".edit-session-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const sessionNum = btn.getAttribute("data-session");
        const sessionData = sessions.find(s => s.session_number == sessionNum);
        this.showModal("session", sessionData);
      });
    });

    document.querySelectorAll(".delete-session-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const sessionNum = btn.getAttribute("data-session");
        if (confirm(`Yakin ingin menghapus sesi ${sessionNum}?`)) {
          await CourseDetailModel.deleteSession(course.id, sessionNum);
          await this.init();
        }
      });
    });

    document.getElementById("btn-revert").addEventListener("click", async () => {
      if (confirm("Yakin ingin me-reset kursus ini? Semua sesi akan dihapus.")) {
        await CourseDetailModel.revertCourse(course.id);
        await this.init();
      }
    });

    document.getElementById("btn-verify").addEventListener("click", async () => {
      if (confirm("Verifikasi kursus ini sekarang?")) {
        await CourseDetailModel.verifyCourse(course.id);
        alert("Kursus berhasil diverifikasi.");
        await this.init();
      }
    });
  },

  showModal(type, data) {
    const modal = document.getElementById("modal-container");
    const form = document.getElementById("modal-form");
    const title = document.getElementById("modal-title");
    form.innerHTML = "";

    if (type === "description") {
      title.textContent = "Edit Deskripsi Kursus";
      form.innerHTML = `
        <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
        <textarea name="description" class="w-full border px-3 py-2 rounded min-h-[200px]" rows="10" required>${escapeHtml(data.description)}</textarea>
      `;
    } else if (type === "title") {
      title.textContent = "Edit Judul Kursus";
      form.innerHTML = `
        <label class="block text-sm font-medium text-gray-700 mb-1">Judul</label>
        <input type="text" name="title" class="w-full border px-3 py-2 rounded" value="${escapeHtml(data.title)}" required />
      `;
    } else if (type === "session") {
      title.textContent = `Edit Chapter ${data.session_number}`;
      form.innerHTML = `
        <label class="block text-sm font-medium text-gray-700 mb-1">Judul</label>
        <input type="text" name="title" class="w-full border px-3 py-2 rounded" value="${escapeHtml(data.title)}" required />

        <label class="block text-sm font-medium text-gray-700 mt-4 mb-1">Konten (Materi & Latihan)</label>
        <textarea name="content" class="w-full border px-3 py-2 rounded min-h-[300px]" rows="12" required>${escapeHtml(data.content || "")}</textarea>
      `;
    }

    modal.classList.remove("hidden");
    document.getElementById("cancel-modal").onclick = () => modal.classList.add("hidden");

    form.onsubmit = async (e) => {
      e.preventDefault();
      const courseId = sessionStorage.getItem("teacher_selected_course_id");

      try {
        if (type === "description") {
          await CourseDetailModel.editCourse(courseId, {
            title: data.title,
            description: form.description.value,
          });
        } else if (type === "title") {
          await CourseDetailModel.editCourse(courseId, {
            title: form.title.value,
            description: data.description,
          });
        } else if (type === "session") {
          await CourseDetailModel.editSession(courseId, data.session_number, {
            title: form.title.value,
            content: form.content.value,
          });
        }
        modal.classList.add("hidden");
        await this.init();
      } catch (err) {
        alert("Gagal menyimpan perubahan.");
        console.error(err);
      }
    };
  },

  showError(msg) {
    const container = document.getElementById("course-detail-container");
    if (container) {
      container.innerHTML = `<p class="text-center text-red-500">${msg}</p>`;
    }
  },
};

export default CourseDetailPresenter;
