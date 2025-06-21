// === CourseView.js ===
const CourseView = {
    render(courseData) {
        const main = document.getElementById("main-content");
        if (!main) return;

        if (!courseData || typeof courseData !== "object") {
            return this.showError("Data kursus tidak valid");
        }

        const { course, sessions, progress, isEligibleForFinalExam } = courseData;

        if (!course || !Array.isArray(sessions) || !progress) {
            return this.showError("Data kursus tidak lengkap");
        }

        const checkpoint = progress.checkpoint;
        const percent = Math.round((checkpoint / sessions.length) * 100);
        const nextSession = checkpoint + 1;

        // Simpan sesi berikutnya ke sessionStorage
        sessionStorage.setItem("current_session_number", nextSession);

        const sessionItems = sessions.map((session) => {
            const isLocked = session.session_number > nextSession;
            return `
        <li 
          class="border rounded-md p-4 hover:shadow-md transition ${isLocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }"
          data-session="${session.session_number}"
        >
          <div class="flex justify-between items-center">
            <div>
              <h3 class="font-semibold text-lg">
                Chapter ${session.session_number}: ${session.title}
              </h3>
            </div>
            ${isLocked
                    ? `<span class="text-gray-400 text-sm">Terkunci</span>`
                    : `<span class="text-blue-600 text-sm hover:underline">Lanjut</span>`
                }
          </div>
        </li>
      `;
        }).join("");

        main.innerHTML = `
      <section class="max-w-4xl mx-auto p-6">
        <div class="mb-6">
          <h1 class="text-3xl font-bold mb-2">${course.title}</h1>
          <p class="text-gray-600 whitespace-pre-line">${course.description}</p>
        </div>

        <div class="mb-6">
          <p class="font-medium text-gray-700">Progress: ${percent}%</p>
          <div class="w-full bg-gray-200 h-2 rounded-full mt-1">
            <div class="h-2 rounded-full bg-blue-600 transition-all" style="width: ${percent}%;"></div>
          </div>
        </div>

        <ul id="session-list" class="space-y-4">
          ${sessionItems}
        </ul>

        ${isEligibleForFinalExam
                ? `
          <div class="text-center mt-8">
            <a href="#/course/exam" class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
              Kerjakan Final Exam
            </a>
          </div>
        `
                : ""
            }
      </section>
    `;

        // Event listener pada <li> tanpa onclick inline
        const listEl = document.getElementById("session-list");
        listEl.addEventListener("click", (e) => {
            const li = e.target.closest("li[data-session]");
            if (!li) return;

            const sessionNum = Number(li.dataset.session);
            if (sessionNum > nextSession) return; // locked

            sessionStorage.setItem("current_session_number", sessionNum);
            window.location.hash = "#/course/session";
        });
    },

    showError(message = "Terjadi kesalahan saat menampilkan konten.") {
        const main = document.getElementById("main-content");
        if (!main) return;
        main.innerHTML = `
      <div class="text-center p-10 text-red-500">
        ${message}
      </div>
    `;
    },
};

export default CourseView;
