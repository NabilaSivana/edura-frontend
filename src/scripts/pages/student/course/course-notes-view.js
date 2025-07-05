import Api from "../../../data/api.js";

const CourseNotesView = {
  render() {
    const courseId = sessionStorage.getItem("current_course_id");
    const data = JSON.parse(sessionStorage.getItem(`course-${courseId}`));
    const { course, sessions, progress } = data;

    const main = document.getElementById("main-content");
    main.innerHTML = `
      <section class="max-w-4xl mx-auto p-6">
        <a href="#/course" class="text-sm text-gray-600 hover:underline">&larr; Back to Study Material</a>

        <div class="flex items-center gap-6 border rounded p-6 mt-4">
          <img src="/knowledge.png" alt="Course Icon" class="w-28 h-28 object-contain" />
          <div class="flex-1">
            <h1 class="text-2xl font-bold mb-2">${course.title}</h1>
            <p class="text-gray-600 mb-3 whitespace-pre-line">${
              course.description
            }</p>
            <div>
              <div class="w-full bg-purple-100 h-2 rounded-full mb-1">
                <div class="h-2 bg-purple-600 rounded-full" style="width: ${
                  (progress.checkpoint / sessions.length) * 100
                }%;"></div>
              </div>
              <p class="text-sm text-purple-600 font-semibold">Total Chapter ${
                sessions.length
              }</p>
            </div>
          </div>
        </div>

        <h2 class="text-lg font-semibold mt-8 mb-4">Notes/Chapter</h2>
        <div id="chapter-list" class="space-y-4"></div>
      </section>
    `;

    const list = document.getElementById("chapter-list");

    sessions.forEach((s) => {
      const done = s.session_number <= progress.checkpoint;
      const locked = s.session_number > progress.checkpoint + 1;

      const item = document.createElement("div");
      item.className = `p-4 border rounded-lg shadow-sm ${
        locked ? "opacity-50 cursor-not-allowed" : "bg-white hover:shadow-md"
      }`;

      // === Isi Konten Klikable ===
      const clickableContent = document.createElement("div");
      clickableContent.className =
        "flex justify-between items-center cursor-pointer";
      clickableContent.dataset.session = s.session_number;

      const titleDiv = document.createElement("div");
      titleDiv.innerHTML = `
        <h3 class="font-semibold ${locked ? "text-gray-400" : ""}">Chapter ${
        s.session_number
      }: ${s.title}</h3>
        <p class="text-sm text-gray-600">${s.overview || ""}</p>
      `;

      const btnDiv = document.createElement("div");
      btnDiv.innerHTML = locked
        ? `<span class="text-sm text-gray-400">Terkunci</span>`
        : `<button type="button" class="px-4 py-1 rounded text-sm ${
            done ? "bg-green-100 text-green-700" : "bg-blue-600 text-white"
          }">${done ? "Belajar lagi" : "Lanjut"}</button>`;

      clickableContent.appendChild(titleDiv);
      clickableContent.appendChild(btnDiv);
      item.appendChild(clickableContent);

      // Event listener hanya pada konten yang bisa diklik
      if (!locked) {
        clickableContent.addEventListener("click", () => {
          sessionStorage.setItem("current_session_number", s.session_number);
          window.location.hash = "#/course/session";
        });
      }

      // === Generate Quiz Button (jika sesi sudah selesai) ===
      if (done) {
        const quizBtn = document.createElement("button");
        quizBtn.innerText = "Generate Quiz";
        quizBtn.className =
          "mt-3 text-sm px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200";
        quizBtn.disabled = false;

        quizBtn.addEventListener("click", async (e) => {
          e.stopPropagation(); // Supaya tidak ikut membuka sesi
          quizBtn.disabled = true;
          quizBtn.innerText = "Generating...";

          try {
            await Api.generateQuiz(courseId, s.session_number);
            alert("Quiz berhasil digenerate.");
          } catch (err) {
            alert("Gagal generate quiz.");
            console.error(err);
          } finally {
            quizBtn.disabled = false;
            quizBtn.innerText = "Generate Quiz";
          }
        });

        item.appendChild(quizBtn);
      }

      list.appendChild(item);
    });
  },
};

export default CourseNotesView;
