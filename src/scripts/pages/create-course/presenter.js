import CreateCourseModel from "./model.js";

const CreateCoursePresenter = {
    init() {
        const form = document.getElementById("create-course-form");
        const generateBtn = document.getElementById("generate-btn");
        const subjectInput = form.subject;
        const levelSelect = form.level;

        function validateForm() {
            const subjectFilled = subjectInput.value.trim().length > 0;
            const levelValid = ["beginner", "intermediate", "advanced"].includes(
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

        recommendBtn.addEventListener("click", async () => {
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
            btn.innerHTML = `
        ${cleanSubject} (${level}) ${is_verified ? '<span class="ml-2 text-green-600 text-xs">✔</span>' : ""
                }
      `;
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
