import CreateCourseModel from "./model.js";

const CreateCoursePresenter = {
  init() {
    const form = document.getElementById("create-course-form");
    const generateBtn = document.getElementById("generate-btn");
    const subjectInput = form.subject;
    const levelSelect = form.level;

    function validateForm() {
      const subjectFilled = subjectInput.value.trim().length > 0;
      const levelValid = ["beginner", "intermediate", "expert"].includes(
        levelSelect.value
      );
      if (subjectFilled && levelValid) {
        generateBtn.disabled = false;
        generateBtn.classList.remove("bg-gray-300", "cursor-not-allowed");
        generateBtn.classList.add("bg-blue-600", "hover:bg-blue-700");
      } else {
        generateBtn.disabled = true;
        generateBtn.classList.add("bg-gray-300", "cursor-not-allowed");
        generateBtn.classList.remove("bg-blue-600", "hover:bg-blue-700");
      }
    }

    subjectInput.addEventListener("input", validateForm);
    levelSelect.addEventListener("change", validateForm);

    const recommendBtn = document.getElementById("recommend-btn");

    recommendBtn?.addEventListener("click", async () => {
      try {
        const result = await CreateCourseModel.getRecommendation();
        this.renderRecommendation(result.recommendations);
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

      // Spinner on button
      generateBtn.disabled = true;
      generateBtn.innerHTML = `
    <span class="flex items-center justify-center gap-2">
      <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
      Generating...
    </span>
  `;

      try {
        const result = await CreateCourseModel.submitCourse({ subject, level });

        // Simpan ID course ke localStorage
        localStorage.setItem("course_generating", "true");
        localStorage.setItem("generating_course_id", result.course_id);
        localStorage.setItem("generating_course_title", subject);
        localStorage.setItem("generating_course_level", level);

        // Langsung redirect ke dashboard
        window.location.hash = "#/dashboard";
      } catch (err) {
        console.error("Gagal membuat course:", err);
        alert("Gagal membuat kursus. Coba lagi sebentar.");
        generateBtn.disabled = false;
        generateBtn.textContent = "Generate";
      }
    });
  },

  renderRecommendation(recommendations) {
    const container = document.getElementById("recommendation-list");
    container.innerHTML = "";

    if (!recommendations || recommendations.length === 0) {
      container.innerHTML = `<p class="text-gray-500">Tidak ada rekomendasi tersedia saat ini.</p>`;
      return;
    }

    const label = document.createElement("p");
    label.className = "text-sm font-medium text-gray-800 mb-2";
    label.textContent = "Rekomendasi topic";
    container.appendChild(label);

    const wrapper = document.createElement("div");
    wrapper.className = "flex flex-wrap gap-3";

    recommendations.forEach(({ subject, level, is_verified }) => {
      const cleanSubject = subject.replace(/^\*\*\s*/, "").trim();

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "border border-gray-300 px-4 py-2 rounded shadow-sm bg-white hover:shadow-md transition text-sm";
      btn.innerHTML = `${cleanSubject} (${level}) ${
        is_verified ? '<span class="ml-2 text-green-600 text-xs">✔</span>' : ""
      }`;

      btn.addEventListener("click", () => {
        document.getElementById("subject").value = cleanSubject;
        document.getElementById("level").value = level;
      });

      wrapper.appendChild(btn);
    });

    container.appendChild(wrapper);
  },
};

export default CreateCoursePresenter;
