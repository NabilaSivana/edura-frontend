// === SessionView.js ===
import {
  hideLoadingScreen as hideGlobalLoading,
  showLoadingScreen as showGlobalLoading,
} from "../../../../component/loading-screen.js";
import CONFIG from "../../../../config.js";
import { showToastNotification } from "../../../../utils/index.js";

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
    const session = sessions.find(
      (s) => s.session_number === Number(sessionNumber)
    );

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

    // === Long Text Parsing ===
    let rawText = "";
    try {
      const parsed = JSON.parse(session.content || "{}");
      rawText = parsed.text || "";
    } catch (e) {
      console.warn("Gagal parse konten sesi sebagai JSON. Gunakan sebagai string biasa.");
      rawText = session.content || "";
    }

    const formattedContent = rawText
      ? `<div class="prose prose-blue max-w-none whitespace-pre-line">${rawText}</div>`
      : `<p class="text-gray-500">Konten tidak tersedia.</p>`;

    const hasNext = sessionNumber < sessions.length;
    const hasPrev = sessionNumber > 1;

    main.innerHTML = `
      <section class="max-w-3xl mx-auto p-6">
        <h1 class="text-3xl font-bold mb-6">Chapter ${sessionNumber}: ${session.title}</h1>
        ${formattedContent}
        <div class="mt-10 flex justify-between items-center">
          ${hasPrev
        ? `<button id="prev-btn" class="text-blue-600 hover:underline">← Sebelumnya</button>`
        : "<span></span>"
      }
          ${hasNext
        ? `<button id="next-btn" class="text-blue-600 hover:underline">Selanjutnya →</button>`
        : "<span></span>"
      }
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

    // === Tombol Complete ===
    const btn = document.getElementById("complete-btn");
    if (!isAlreadyCompleted) {
      btn.addEventListener("click", async () => {
        try {
          showGlobalLoading("Menandai selesai...");
          const res = await fetch(
            `${CONFIG.BASE_URL}/student/courses/${courseId}/checkpoint`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({ checkpoint: sessionNumber }),
            }
          );

          const result = await res.json();
          hideGlobalLoading();

          if (!res.ok) {
            alert(result.message || "Gagal update checkpoint.");
            return;
          }

          courseData.progress.checkpoint = sessionNumber;
          sessionStorage.setItem(
            `course-${courseId}`,
            JSON.stringify(courseData)
          );

          showToastNotification("Chapter ditandai selesai.","success");
          sessionStorage.setItem("current_session_number", sessionNumber + 1);
          window.location.reload();
          setTimeout(() => {
            window.location.hash = "#/course/session";
          }, 500);
        } catch (e) {
          hideGlobalLoading();
          console.error(e);
          alert("Terjadi kesalahan.");
        }
      });
    }

    // === Navigasi Prev/Next dengan loading screen ===
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        window.location.reload();
        sessionStorage.setItem("current_session_number", sessionNumber - 1);
        setTimeout(() => {
          window.location.hash = "#/course/session";
        }, 500);
      });
    }

    if (nextBtn && sessionNumber + 1 <= checkpoint + 1) {
      nextBtn.addEventListener("click", () => {
        if (sessionNumber > checkpoint) {
          console.log("Harap tandai sesi ini sebagai selesai terlebih dahulu sebelum melanjutkan.");
          return;
        }

        window.location.reload();
        sessionStorage.setItem("current_session_number", sessionNumber + 1);
        setTimeout(() => {
          window.location.hash = "#/course/session";
          window.location.reload();
        }, 300);
      });
    }

  },
};

export default SessionView;
