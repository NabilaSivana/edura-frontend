// File: src/scripts/pages/student/course/sessions/view.js
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

    // === Parsing konten long-text / JSON ===
    let rawText = "";
    try {
      const parsed = JSON.parse(session.content || "{}");
      rawText = parsed.text || "";
    } catch (e) {
      rawText = session.content || "";
    }

    const formattedContent = rawText
      ? `<div class="prose prose-blue max-w-none whitespace-pre-line">${rawText}</div>`
      : `<p class="text-gray-500">Konten tidak tersedia.</p>`;

    const hasNext = sessionNumber < sessions.length;
    const hasPrev = sessionNumber > 1;

    // === RENDER HTML ===
main.innerHTML = `
  <section class="flex flex-col lg:flex-row gap-4 relative">
    <!-- Tombol Toggle Sidebar di Mobile -->
    <button id="toggle-sidebar" class="lg:hidden absolute top-4 right-4 z-20 bg-white border px-2 py-1 rounded shadow text-sm">
      📘 Daftar Modul
    </button>

    <!-- Konten Utama -->
    <div class="flex-1 p-6">
      <div class="mb-4">
        <a href="#/course/notes" class="text-sm text-gray-600 hover:underline">← Back to Study Material</a>
      </div>

      <h1 class="text-2xl lg:text-3xl font-bold mb-6">${session.title}</h1>

      ${formattedContent}

      <div class="flex justify-between mt-10">
        ${
          hasPrev
            ? `<button id="prev-btn" class="px-4 py-2 border rounded text-sm hover:bg-gray-100">← Chapter Sebelumnya</button>`
            : `<span></span>`
        }
        ${
          hasNext
            ? `<button id="next-btn" class="px-4 py-2 border rounded text-sm hover:bg-gray-100">Chapter Selanjutnya →</button>`
            : `<span></span>`
        }
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

    <!-- Sidebar Modul -->
    <aside 
      id="module-sidebar"
      class="fixed top-0 right-0 w-72 max-w-[90%] h-full z-30 bg-white p-5 border-l shadow-lg transform translate-x-full lg:static lg:translate-x-0 transition-transform duration-300 overflow-hidden"
    >
      <!-- Header Sidebar -->
      <div class="flex justify-between items-center mb-4 lg:hidden">
        <h2 class="text-lg font-semibold">Daftar Modul</h2>
        <button id="close-sidebar" class="text-xl">✖</button>
      </div>

      <div class="hidden lg:block font-semibold text-lg mb-4">Daftar Modul</div>
      
      <!-- Progress Bar -->
      <div class="mb-4">
        <div class="w-full bg-gray-200 h-2 rounded">
          <div class="h-2 rounded bg-blue-500" style="width: ${Math.round(
            (checkpoint / sessions.length) * 100
          )}%"></div>
        </div>
        <p class="text-sm text-gray-500 mt-1">${Math.round(
          (checkpoint / sessions.length) * 100
        )}% Selesai</p>
      </div>

      <!-- Scrollable List -->
      <div class="overflow-y-auto pr-2" style="max-height: calc(100vh - 180px);">
        <ul class="relative pl-5 border-l-2 border-gray-300 space-y-6">
          ${sessions
            .map((s) => {
              const isDone = s.session_number <= checkpoint;
              const isCurrent = s.session_number === sessionNumber;
              return `
                <li class="relative">
                  <div class="absolute -left-[13px] w-4 h-4 rounded-full ${
                    isDone ? "bg-blue-500" : "bg-gray-300"
                  }"></div>
                  <a href="#/course/session?number=${s.session_number}" class="${
                isCurrent
                  ? "font-bold text-blue-600"
                  : isDone
                  ? "text-gray-800 hover:underline"
                  : "text-gray-400"
              }">
                    ${s.title}
                  </a>
                </li>
              `;
            })
            .join("")}
        </ul>
      </div>
    </aside>
  </section>
`;


    // === Tombol Tandai Selesai ===
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
          sessionStorage.setItem("current_session_number", sessionNumber + 1);

          showToastNotification("Chapter ditandai selesai.", "success");
          window.location.reload();
        } catch (e) {
          hideGlobalLoading();
          console.error(e);
          alert("Terjadi kesalahan.");
        }
      });
    }

    // === Navigasi Prev / Next ===
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    // === Toggle Sidebar di layar kecil ===
    const toggleBtn = document.getElementById("toggle-sidebar");
    const closeBtn = document.getElementById("close-sidebar");
    const sidebar = document.getElementById("module-sidebar");

    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener("click", () => {
        sidebar.classList.remove("translate-x-full");
      });
    }

    if (closeBtn && sidebar) {
      closeBtn.addEventListener("click", () => {
        sidebar.classList.add("translate-x-full");
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        const prevNumber = sessionNumber - 1;
        sessionStorage.setItem("current_session_number", prevNumber);
        window.location.href = `#/course/session?number=${prevNumber}`;
      });
    }

    if (nextBtn && sessionNumber + 1 <= sessions.length) {
      nextBtn.addEventListener("click", () => {
        if (sessionNumber > checkpoint) {
          alert("Tandai sesi ini selesai terlebih dahulu.");
          return;
        }
        const nextNumber = sessionNumber + 1;
        sessionStorage.setItem("current_session_number", nextNumber);
        window.location.href = `#/course/session?number=${nextNumber}`;
      });
    }
  },
};

export default SessionView;
