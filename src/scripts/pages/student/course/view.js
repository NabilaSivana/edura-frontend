import { renderStudyMaterialSection } from "../../../component/studyMaterialSection.js";
import Api from "../../../data/api.js";

const CourseView = {
  render(courseData) {
    const main = document.getElementById("main-content");
    if (!main) return;

    const { course, sessions, progress, isEligibleForFinalExam } = courseData;
    const checkpoint = progress.checkpoint;
    const percent = Math.round((checkpoint / sessions.length) * 100);
    const nextSession = checkpoint + 1;
    sessionStorage.setItem("current_session_number", nextSession);

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
    const studySectionEl = renderStudyMaterialSection(course.id, course);
    studySection.appendChild(studySectionEl);

    // Render Riwayat Selesai
    const historySection = document.createElement("div");
    historySection.className = "mt-10";
    const historyHeading = document.createElement("h2");
    historyHeading.innerText = "Riwayat Selesai";
    historyHeading.className = "font-semibold text-lg mb-3";
    historySection.appendChild(historyHeading);

    sessions
      .filter((s) => s.session_number <= checkpoint)
      .sort((a, b) => b.session_number - a.session_number)
      .forEach((s) => {
        const card = document.createElement("div");
        card.className = "border rounded-md p-4 mb-3 shadow-sm bg-white";

        card.innerHTML = `
          <h3 class="font-semibold text-md">Chapter ${s.session_number}: ${
          s.title
        }</h3>
          <p class="text-sm text-gray-600">${s.overview || ""}</p>
        `;

        historySection.appendChild(card);
      });

    main.querySelector("section").appendChild(historySection);
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
