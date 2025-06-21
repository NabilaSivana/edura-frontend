import CreateCourseModel from "./model.js";

const CreateCoursePresenter = {
    init() {
        const form = document.getElementById("create-course-form");
        const recommendBtn = document.getElementById("recommend-btn");
        const recommendationSection = document.getElementById("recommendation-list");

        recommendBtn.addEventListener("click", async () => {
            try {
                const result = await CreateCourseModel.getRecommendation();
                this.renderRecommendation(result.recommendations);
                form.classList.add("hidden");
                recommendationSection.classList.remove("hidden");
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

    renderRecommendation(courses) {
        const container = document.getElementById("recommendation-list");
        container.innerHTML = "<h2 class='text-lg font-semibold mb-2'>Pilih Rekomendasi:</h2>";

        if (!courses || courses.length === 0) {
            container.innerHTML += `
            <p class="text-gray-500 mb-4">Tidak ada rekomendasi tersedia saat ini.</p>
            <button id="back-to-form-btn" class="bg-gray-300 text-black px-4 py-2 rounded">Kembali Isi Manual</button>
        `;

            // Tambahkan event listener untuk tombol kembali
            setTimeout(() => {
                const backBtn = document.getElementById("back-to-form-btn");
                backBtn?.addEventListener("click", () => {
                    container.classList.add("hidden");
                    document.getElementById("create-course-form").classList.remove("hidden");
                });
            }, 0);
            return;
        }

        // Jika ada rekomendasi
        courses.forEach(({ subject, level, is_verified }) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "block w-full text-left border px-4 py-2 rounded hover:bg-gray-100";
            btn.innerHTML = `
            ${subject} (${level}) ${is_verified ? '<span class="text-green-600 text-sm ml-2">✔ Terverifikasi</span>' : ""}
        `;
            btn.addEventListener("click", () => {
                document.getElementById("subject").value = subject;
                document.getElementById("level").value = level;
                document.getElementById("create-course-form").classList.remove("hidden");
                container.classList.add("hidden");
            });
            container.appendChild(btn);
        });
    }

};

export default CreateCoursePresenter;
