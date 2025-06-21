// === SessionView.js ===
import CONFIG from "../../../config.js";

const SessionView = {
    async render(sessionNumber) {
        const main = document.getElementById("main-content");
        if (!main) return;

        const courseId = sessionStorage.getItem("current_course_id");
        const courseDataRaw = sessionStorage.getItem(`course-${courseId}`);

        if (!courseId || !courseDataRaw) {
            main.innerHTML = `<p class="text-center text-red-500">Data kursus tidak ditemukan.</p>`;
            return;
        }

        const courseData = JSON.parse(courseDataRaw);
        const sessions = courseData.sessions || [];
        const session = sessions.find(s => s.session_number === Number(sessionNumber));

        if (!session) {
            main.innerHTML = `<p class="text-center text-red-500">Sesi tidak ditemukan.</p>`;
            return;
        }

        const progress = courseData.progress || { checkpoint: 0 };
        const checkpoint = progress.checkpoint;

        const isLocked = sessionNumber > checkpoint + 1;
        const isAlreadyCompleted = sessionNumber <= checkpoint;

        if (isLocked) {
            main.innerHTML = `
        <div class="text-center p-10 text-yellow-600">
          Chapter ${sessionNumber} masih terkunci.<br/>Selesaikan chapter sebelumnya terlebih dahulu.
        </div>
      `;
            return;
        }

        const content = JSON.parse(session.content || '{}');
        const { overview = '', steps = [] } = content;

        const stepItems = steps.map((step, i) => `
      <div class="mb-6">
        <h4 class="text-xl font-semibold mb-2">${i + 1}. ${step.title}</h4>
        <p class="mb-2 text-gray-700">${step.description}</p>
        <ul class="list-disc ml-6 text-gray-600">
          ${(step.topics || []).map(topic => `<li>${topic}</li>`).join("")}
        </ul>
      </div>
    `).join("");

        const hasNext = sessionNumber < sessions.length;
        const hasPrev = sessionNumber > 1;

        main.innerHTML = `
      <section class="max-w-3xl mx-auto p-6">
        <h1 class="text-3xl font-bold mb-4">Chapter ${sessionNumber}: ${session.title}</h1>
        <p class="text-gray-600 mb-6">${overview}</p>

        ${stepItems}

        <div class="mt-10 flex justify-between items-center">
          ${hasPrev ? `<button id="prev-btn" class="text-blue-600 hover:underline">← Sebelumnya</button>` : '<span></span>'}
          ${hasNext ? `<button id="next-btn" class="text-blue-600 hover:underline">Selanjutnya →</button>` : '<span></span>'}
        </div>

        <div class="mt-10 text-center">
          <button 
            id="complete-btn"
            class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            ${isAlreadyCompleted ? "disabled" : ""}
          >
            ${isAlreadyCompleted ? "Sudah Diselesaikan" : "Tandai Selesai"}
          </button>
        </div>
      </section>
    `;

        const btn = document.getElementById("complete-btn");
        if (!isAlreadyCompleted) {
            btn.addEventListener("click", async () => {
                try {
                    const res = await fetch(`${CONFIG.BASE_URL}/student/courses/${courseId}/checkpoint`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        },
                        body: JSON.stringify({ checkpoint: sessionNumber })
                    });

                    const result = await res.json();

                    if (!res.ok) {
                        alert(result.message || "Gagal update checkpoint.");
                        return;
                    }

                    // Update local sessionStorage state
                    courseData.progress.checkpoint = sessionNumber;
                    sessionStorage.setItem(`course-${courseId}`, JSON.stringify(courseData));

                    alert("Chapter ditandai selesai.");
                    sessionStorage.setItem("current_session_number", sessionNumber + 1);
                    window.location.hash = "#/course/session";
                } catch (e) {
                    console.error(e);
                    alert("Terjadi kesalahan.");
                }
            });
        }

        const prevBtn = document.getElementById("prev-btn");
        const nextBtn = document.getElementById("next-btn");

        if (prevBtn) {
            prevBtn.addEventListener("click", () => {
                sessionStorage.setItem("current_session_number", sessionNumber - 1);
                window.location.hash = "#/course/session";
            });
        }

        if (nextBtn && sessionNumber + 1 <= checkpoint + 1) {
            nextBtn.addEventListener("click", () => {
                sessionStorage.setItem("current_session_number", sessionNumber + 1);
                window.location.hash = "#/course/session";
            });
        }
    }
};

export default SessionView;
