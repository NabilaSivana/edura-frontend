import {
  hideLoadingScreen as hideGlobalLoading,
  showLoadingScreen as showGlobalLoading,
} from "../../../../component/loading-screen.js";
import CONFIG from "../../../../config.js";
import { showToastNotification } from "../../../../utils/index.js";

const SessionView = {
  async render(sessionNumberRaw) {
    const main = document.getElementById("main-content");
    if (!main) return;

    const sessionNumber = Number(sessionNumberRaw);
    if (isNaN(sessionNumber)) {
      main.innerHTML = `<p class="text-center text-red-500">Nomor sesi tidak valid.</p>`;
      return;
    }

    const courseId = sessionStorage.getItem("current_course_id");
    const courseDataRaw = sessionStorage.getItem(`course-${courseId}`);

    if (!courseId || !courseDataRaw) {
      main.innerHTML = `<p class="text-center text-red-500">Data kursus tidak ditemukan.</p>`;
      return;
    }

    const courseData = JSON.parse(courseDataRaw);
    const sessions = courseData.sessions || [];
    const session = sessions.find(
      (s) => s.session_number === sessionNumber
    );

    if (!session) {
      main.innerHTML = `<p class="text-center text-red-500">Sesi tidak ditemukan.</p>`;
      return;
    }

    const checkpoint = Number(courseData?.progress?.checkpoint || 0);
    const isLocked = sessionNumber > checkpoint + 1;
    const isAlreadyCompleted = sessionNumber <= checkpoint;

    if (isLocked) {
      main.innerHTML = `
        <div class="text-center p-10 text-yellow-600 dark:text-yellow-400">
          Chapter ${sessionNumber} masih terkunci.<br/>Selesaikan chapter sebelumnya terlebih dahulu.
        </div>
      `;
      return;
    }

    let rawText = "";
    try {
      const parsed = JSON.parse(session.content);
      rawText = parsed?.text || "";
    } catch {
      rawText = typeof session.content === "string" ? session.content : "";
    }

    const formattedContent = rawText
      ? `
        <article class="prose prose-blue dark:prose-invert max-w-none">
          ${marked.parse(rawText)}
        </article>
      `
      : `<p class="text-gray-500 dark:text-gray-400">Konten tidak tersedia.</p>`;

    const hasNext = sessionNumber < sessions.length;
    const hasPrev = sessionNumber > 1;

    main.innerHTML = `
      <section class="flex flex-col lg:flex-row gap-4 relative bg-white dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen">
        <button id="toggle-sidebar" class="lg:hidden absolute top-4 right-4 z-20 bg-white dark:bg-gray-800 border px-2 py-1 rounded shadow text-sm">
          📘 Daftar Modul
        </button>

        <div class="flex-1 p-6">
          <div class="mb-4">
            <a href="#/course/notes" class="text-sm text-gray-600 dark:text-gray-300 hover:underline">← Back to Study Material</a>
          </div>

          <h1 class="text-2xl lg:text-3xl font-bold mb-6">${session.title}</h1>

          ${formattedContent}

          <div class="flex justify-between mt-10">
            ${hasPrev
        ? `<button id="prev-btn" class="px-4 py-2 border rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-800">← Chapter Sebelumnya</button>`
        : `<span></span>`}
            ${hasNext
        ? `<button id="next-btn" class="px-4 py-2 border rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-800">Chapter Selanjutnya →</button>`
        : `<span></span>`}
          </div>

          <div class="mt-6 text-center">
            <button 
              id="complete-btn"
              class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              ${isAlreadyCompleted ? "disabled" : ""}
            >
              ${isAlreadyCompleted ? "Sudah Diselesaikan" : "Tandai Selesai"}
            </button>
          </div>
        </div>

        <aside 
          id="module-sidebar"
          class="fixed top-0 right-0 w-72 max-w-[90%] h-full z-30 bg-white dark:bg-gray-800 p-5 border-l shadow-lg transform translate-x-full lg:static lg:translate-x-0 transition-transform duration-300 overflow-hidden"
        >
          <div class="flex justify-between items-center mb-4 lg:hidden">
            <h2 class="text-lg font-semibold">Daftar Modul</h2>
            <button id="close-sidebar" class="text-xl">✖</button>
          </div>

          <div class="hidden lg:block font-semibold text-lg mb-4">Daftar Modul</div>
          
          <div class="mb-4">
            <div class="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded">
              <div class="h-2 rounded bg-blue-500" style="width: ${Math.round((checkpoint / sessions.length) * 100)}%"></div>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">${Math.round((checkpoint / sessions.length) * 100)}% Selesai</p>
          </div>

          <div class="overflow-y-auto pr-2" style="max-height: calc(100vh - 180px);">
            <ul class="relative pl-5 border-l-2 border-gray-300 dark:border-gray-600 space-y-6">
              ${sessions.map((s) => {
          const isDone = s.session_number <= checkpoint;
          const isCurrent = s.session_number === sessionNumber;
          return `
                  <li class="relative">
                    <div class="absolute -left-[13px] w-4 h-4 rounded-full ${isDone ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"}"></div>
                    <a href="#/course/session?number=${s.session_number}"
                      class="${isCurrent
              ? "font-bold text-blue-600"
              : isDone
                ? "text-gray-800 dark:text-white hover:underline"
                : "text-gray-400"
            }">
                      ${s.title}
                    </a>
                  </li>
                `;
        }).join("")}
            </ul>
          </div>
        </aside>
      </section>
    `;

    // ✅ Panggil highlight setelah render
    document.querySelectorAll("pre code").forEach((el) => {
      hljs.highlightElement(el);
    });

    const btn = document.getElementById("complete-btn");
    if (!isAlreadyCompleted) {
      btn?.addEventListener("click", async () => {
        try {
          showGlobalLoading("Menandai selesai...");
          const res = await fetch(`${CONFIG.BASE_URL}/student/courses/${courseId}/checkpoint`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ checkpoint: sessionNumber }),
          });

          const result = await res.json();
          hideGlobalLoading();

          if (!res.ok) {
            alert(result.message || "Gagal update checkpoint.");
            return;
          }

          courseData.progress.checkpoint = sessionNumber;
          sessionStorage.setItem(`course-${courseId}`, JSON.stringify(courseData));
          sessionStorage.setItem("current_session_number", sessionNumber + 1);

          showToastNotification("Chapter ditandai selesai.", "success");
          location.hash = `#/course/session?number=${sessionNumber + 1}`;
        } catch (e) {
          hideGlobalLoading();
          console.error(e);
          alert("Terjadi kesalahan.");
        }
      });
    }

    document.getElementById("prev-btn")?.addEventListener("click", () => {
      const prev = sessionNumber - 1;
      sessionStorage.setItem("current_session_number", prev);
      location.hash = `#/course/session?number=${prev}`;
    });

    document.getElementById("next-btn")?.addEventListener("click", () => {
      if (sessionNumber > checkpoint) {
        alert("Tandai sesi ini selesai terlebih dahulu.");
        return;
      }
      const next = sessionNumber + 1;
      sessionStorage.setItem("current_session_number", next);
      location.hash = `#/course/session?number=${next}`;
    });

    document.getElementById("toggle-sidebar")?.addEventListener("click", () => {
      document.getElementById("module-sidebar")?.classList.remove("translate-x-full");
    });

    document.getElementById("close-sidebar")?.addEventListener("click", () => {
      document.getElementById("module-sidebar")?.classList.add("translate-x-full");
    });
  },
};

export default SessionView;
