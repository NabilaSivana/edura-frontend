import { renderStudyMaterialSection } from "../../../component/studyMaterialSection.js";

const CourseView = {
  render(courseData) {
    const main = document.getElementById("main-content");
    if (!main) return;

    const { course, sessions, progress, isEligibleForFinalExam } = courseData;
    const checkpoint = progress.checkpoint;
    const percent = Math.round((checkpoint / sessions.length) * 100);
    const nextSession = checkpoint + 1;
    sessionStorage.setItem("current_session_number", nextSession);

    const sessionItems = sessions
      .map((session) => {
        const isLocked = session.session_number > nextSession;
        return `
        <li class="border rounded-md p-4 hover:shadow-md transition ${
          isLocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }"
            data-session="${session.session_number}">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="font-semibold text-lg">
                Chapter ${session.session_number}: ${session.title}
              </h3>
            </div>
            ${
              isLocked
                ? `<span class="text-gray-400 text-sm">Terkunci</span>`
                : `<span class="text-blue-600 text-sm hover:underline">Lanjut</span>`
            }
          </div>
        </li>
      `;
      })
      .join("");

    main.innerHTML = `
      <section class="max-w-4xl mx-auto p-6">
        <a href="#/dashboard" class="text-sm text-gray-600 hover:underline">&larr; Back to Dashboard</a>
        
        <!-- Banner + Progress -->
        <div class="flex items-center gap-6 border rounded p-6 mt-4">
          <img src="/knowledge.png" alt="Course Icon" class="w-28 h-28 object-contain" />
          <div class="flex-1">
            <h1 class="text-2xl font-bold mb-2">${course.title}</h1>
            <p class="text-gray-600 mb-3 whitespace-pre-line">${
              course.description
            }</p>
            <div>
              <div class="w-full bg-purple-100 h-2 rounded-full mb-1">
                <div class="h-2 bg-purple-600 rounded-full transition-all" style="width: ${percent}%;"></div>
              </div>
              <p class="text-sm text-purple-600 font-semibold">Total Chapter ${
                sessions.length
              }</p>
            </div>
          </div>
        </div>

        <div id="study-material-section" class="mt-6"></div>

        <h2 class="font-medium text-xl mt-10 mb-3">Chapter</h2>
        <ul id="session-list" class="space-y-4">
          ${sessionItems}
        </ul>

        ${
          isEligibleForFinalExam
            ? `<div class="text-center mt-8">
              <a href="#/course/exam" class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                Kerjakan Final Exam
              </a>
            </div>`
            : ""
        }
      </section>
    `;

    // Inject Study Material
    const studySection = document.getElementById("study-material-section");
    const studySectionEl = renderStudyMaterialSection(course.courseId, course);
    studySection.appendChild(studySectionEl);

    const listEl = document.getElementById("session-list");
    listEl.addEventListener("click", (e) => {
      const li = e.target.closest("li[data-session]");
      if (!li) return;
      const sessionNum = Number(li.dataset.session);
      if (sessionNum > nextSession) return;
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
