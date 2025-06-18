import CreateCourseModel from "./model.js";

const CreateCoursePresenter = {
  init() {
    const form = document.getElementById("create-course-form");
    const recommendBtn = document.getElementById("recommend-btn");

    recommendBtn.addEventListener("click", async () => {
      try {
        const result = await CreateCourseModel.getRecommendation();
        this.renderRecommendation(result.titles);
      } catch (err) {
        alert("Gagal mengambil rekomendasi.");
        console.error(err);
      }
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const subject = form.subject.value.trim();
      const level = form.level.value;

      if (!subject || !level) return;

      try {
        await CreateCourseModel.submitCourse({ subject, level });
        alert("Course berhasil dibuat!");
        window.location.hash = "#/dashboard";
      } catch (err) {
        document.getElementById("create-error").classList.remove("hidden");
        console.error("Gagal membuat course:", err);
      }
    });
  },

  renderRecommendation(titles) {
    const container = document.getElementById("recommendation-list");
    container.innerHTML = "";

    if (titles.length === 0) {
      container.innerHTML = `<p class="text-gray-500">Tidak ada rekomendasi tersedia saat ini.</p>`;
      return;
    }

    titles.forEach(({ title, is_verified }) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "block w-full text-left border px-4 py-2 rounded hover:bg-gray-100";
      btn.innerHTML = `
        ${title} ${is_verified ? '<span class="text-green-600 text-sm ml-2">✔ Terverifikasi</span>' : ""}
      `;
      btn.addEventListener("click", () => {
        document.getElementById("subject").value = title;
      });
      container.appendChild(btn);
    });
  }
};

export default CreateCoursePresenter;
