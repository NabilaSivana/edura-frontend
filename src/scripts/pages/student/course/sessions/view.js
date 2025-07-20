import {
  hideLoadingScreen as hideGlobalLoading,
  showLoadingScreen as showGlobalLoading,
} from "../../../../component/loading-screen.js";
import CONFIG from "../../../../config.js";
import { showToastNotification } from "../../../../utils/index.js";

const SessionView = {
  sidebarState: false, // Track sidebar state

  async render(sessionNumberRaw) {
    const main = document.getElementById("main-content");
    if (!main) return;

    const sessionNumber = Number(sessionNumberRaw);
    if (isNaN(sessionNumber)) {
      main.innerHTML = `
        <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 px-4">
          <div class="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-sm w-full">
            <div class="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-800/30 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Nomor Sesi Tidak Valid</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">Silakan periksa kembali nomor sesi yang diminta.</p>
          </div>
        </div>
      `;
      return;
    }

    const courseId = sessionStorage.getItem("current_course_id");
    const courseDataRaw = sessionStorage.getItem(`course-${courseId}`);

    if (!courseId || !courseDataRaw) {
      main.innerHTML = `
        <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 px-4">
          <div class="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-sm w-full">
            <div class="w-16 h-16 mx-auto mb-4 bg-orange-100 dark:bg-orange-800/30 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Data Kursus Tidak Ditemukan</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">Silakan kembali ke halaman utama dan pilih kursus.</p>
          </div>
        </div>
      `;
      return;
    }

    const courseData = JSON.parse(courseDataRaw);
    const sessions = courseData.sessions || [];
    const session = sessions.find((s) => s.session_number === sessionNumber);

    if (!session) {
      main.innerHTML = `
        <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
          <div class="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-sm w-full">
            <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700/30 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Sesi Tidak Ditemukan</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">Sesi yang diminta tidak tersedia dalam kursus ini.</p>
          </div>
        </div>
      `;
      return;
    }

    const checkpoint = Number(courseData?.progress?.checkpoint || 0);
    const isLocked = sessionNumber > checkpoint + 1;
    const isAlreadyCompleted = sessionNumber <= checkpoint;

    if (isLocked) {
      main.innerHTML = `
        <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/20 dark:to-amber-800/20 px-4">
          <div class="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
            <div class="w-20 h-20 mx-auto mb-6 bg-yellow-100 dark:bg-yellow-800/30 rounded-full flex items-center justify-center">
              <svg class="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Chapter ${sessionNumber} Terkunci</h2>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">Selesaikan chapter sebelumnya terlebih dahulu untuk membuka akses ke chapter ini.</p>
            <div>
              <a href="#/course/notes" class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium text-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Kembali ke Materi
              </a>
            </div>
          </div>
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
        <article class="prose prose-sm sm:prose-base lg:prose-lg prose-blue dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-pre:bg-gray-900 dark:prose-pre:bg-gray-800 prose-img:rounded-lg prose-img:shadow-sm">
          ${marked.parse(rawText)}
        </article>
      `
      : `
        <div class="text-center py-12">
          <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <p class="text-gray-500 dark:text-gray-400 text-base">Konten tidak tersedia untuk chapter ini.</p>
        </div>
      `;

    const hasNext = sessionNumber < sessions.length;
    const hasPrev = sessionNumber > 1;
    const progressPercentage = Math.round((checkpoint / sessions.length) * 100);

    // Reset sidebar state
    this.sidebarState = false;

    main.innerHTML = `
      <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <!-- Fixed Header -->
        <header class="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
          <div class="w-full px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-14 sm:h-16">
              <div class="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                <a href="#/course/notes" class="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 flex-shrink-0">
                  <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                  </svg>
                  <span class="hidden sm:inline">Kembali</span>
                </a>
                <div class="h-4 sm:h-6 w-px bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>
                <div class="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
                  <span class="text-xs font-medium px-1.5 sm:px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 flex-shrink-0">
                    Ch ${sessionNumber}
                  </span>
                  <h1 class="text-sm sm:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">${
                    session.title
                  }</h1>
                </div>
              </div>
              
              <button 
                id="toggle-sidebar" 
                type="button"
                class="relative inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-medium cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 text-xs sm:text-sm flex-shrink-0"
              >
                <svg id="sidebar-icon" class="w-3 h-3 sm:w-4 sm:h-4 pointer-events-none transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
                <span id="sidebar-text" class="hidden sm:inline pointer-events-none">Daftar Modul</span>
                <span id="sidebar-text-mobile" class="sm:hidden pointer-events-none">Menu</span>
              </button>
            </div>
          </div>
        </header>

        <div class="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <!-- Main Content -->
          <main class="w-full">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <!-- Chapter Header -->
              <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div class="min-w-0 flex-1">
                    <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 break-words">${
                      session.title
                    }</h1>
                    <div class="flex flex-wrap items-center gap-2 sm:gap-4 text-blue-100 text-sm">
                      <span>Chapter ${sessionNumber} dari ${
      sessions.length
    }</span>
                      <div class="hidden sm:block h-4 w-px bg-blue-300"></div>
                      <span>${progressPercentage}% Selesai</span>
                    </div>
                  </div>
                  <div class="hidden sm:block flex-shrink-0">
                    <div class="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <svg class="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Content Area -->
              <div class="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                ${formattedContent}
              </div>

              <!-- Footer Actions -->
              <div class="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                <!-- Navigation -->
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                  ${
                    hasPrev
                      ? `
                      <button id="prev-btn" class="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 font-medium text-sm w-full sm:w-auto">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                        <span class="hidden sm:inline">Chapter Sebelumnya</span>
                        <span class="sm:hidden">Sebelumnya</span>
                      </button>
                      `
                      : `<div class="hidden sm:block"></div>`
                  }
                  ${
                    hasNext
                      ? `
                      <button id="next-btn" class="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 font-medium text-sm w-full sm:w-auto order-first sm:order-last">
                        <span class="hidden sm:inline">Chapter Selanjutnya</span>
                        <span class="sm:hidden">Selanjutnya</span>
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </button>
                      `
                      : `<div class="hidden sm:block"></div>`
                  }
                </div>

                <!-- Complete Button -->
                <div class="text-center">
                  <button 
                    id="complete-btn"
                    class="inline-flex items-center justify-center gap-2 px-6 py-3 ${
                      isAlreadyCompleted
                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl"
                    } rounded-lg transition-all duration-200 font-medium text-sm sm:text-base w-full sm:w-auto"
                    ${isAlreadyCompleted ? "disabled" : ""}
                  >
                    ${
                      isAlreadyCompleted
                        ? `
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                        </svg>
                        Sudah Diselesaikan
                        `
                        : `
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Tandai Selesai
                        `
                    }
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>

        <!-- Enhanced Sidebar with Backdrop -->
        <div id="sidebar-backdrop" class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm opacity-0 invisible transition-all duration-300 ease-in-out"></div>
        
        <aside 
          id="module-sidebar"
          class="fixed top-0 right-0 w-full sm:w-96 h-full z-50 bg-white dark:bg-gray-800 shadow-2xl transform translate-x-full transition-all duration-300 ease-in-out"
        >
          <!-- Sidebar Header -->
          <div class="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 p-4 sm:p-6 z-10">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z"></path>
                  </svg>
                </div>
                <h2 class="text-lg sm:text-xl font-bold text-white">Daftar Modul</h2>
              </div>
              <button id="close-sidebar" class="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200">
                <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Progress Section -->
          <div class="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600">
            <div class="mb-4">
              <div class="flex items-center justify-between mb-3">
                <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">Progress Kursus</span>
                <span class="text-lg font-bold text-blue-600 dark:text-blue-400">${progressPercentage}%</span>
              </div>
              <div class="relative">
                <div class="w-full bg-gray-200 dark:bg-gray-600 h-3 sm:h-4 rounded-full overflow-hidden">
                  <div class="h-3 sm:h-4 rounded-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 transition-all duration-700 ease-out shadow-inner relative" style="width: ${progressPercentage}%">
                    <div class="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <span class="font-medium">${checkpoint} dari ${
      sessions.length
    } chapter</span>
              <span class="text-orange-600 dark:text-orange-400">${
                sessions.length - checkpoint
              } tersisa</span>
            </div>
          </div>

          <!-- Module List -->
          <div class="flex-1 overflow-y-auto p-3 sm:p-4" style="max-height: calc(100vh - 200px);">
            <div class="space-y-2 sm:space-y-3">
              ${sessions
                .map((s) => {
                  const isDone = s.session_number <= checkpoint;
                  const isCurrent = s.session_number === sessionNumber;
                  const isNext = s.session_number === checkpoint + 1;
                  const isLocked = s.session_number > checkpoint + 1;

                  let statusIcon = "";
                  let cardClasses = "";
                  let statusBadge = "";

                  if (isDone) {
                    statusIcon = `
                      <div class="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <svg class="w-3 h-3 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                        </svg>
                      </div>`;
                    cardClasses =
                      "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/20";
                    statusBadge = `<span class="text-xs font-medium px-1.5 py-0.5 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full">✓ Selesai</span>`;
                  } else if (isCurrent) {
                    statusIcon = `
                      <div class="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center animate-pulse">
                        <svg class="w-3 h-3 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd"></path>
                        </svg>
                      </div>`;
                    cardClasses =
                      "bg-blue-50 dark:bg-blue-900/10 border-blue-300 dark:border-blue-600 ring-2 ring-blue-200 dark:ring-blue-600/50";
                    statusBadge = `<span class="text-xs font-medium px-2 py-1 bg-blue-500 text-white rounded-full animate-pulse">● Sedang Aktif</span>`;
                  } else if (isNext) {
                    statusIcon = `
                      <div class="flex-shrink-0 w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                      </div>`;
                    cardClasses =
                      "bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-700 hover:bg-orange-100 dark:hover:bg-orange-900/20";
                    statusBadge = `<span class="text-xs font-medium px-2 py-1 bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-200 rounded-full">→ Selanjutnya</span>`;
                  } else {
                    statusIcon = `
                      <div class="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                      </div>`;
                    cardClasses =
                      "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-600 opacity-60";
                    statusBadge = `<span class="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">🔒 Terkunci</span>`;
                  }

                  return `
                    <div class="relative group">
                      <a href="#/course/session?number=${s.session_number}"
                        class="block p-4 rounded-xl border-2 ${cardClasses} transition-all duration-200 ${
                    isLocked
                      ? "cursor-not-allowed"
                      : "hover:scale-[1.02] hover:shadow-md"
                  }"
                        ${isLocked ? 'onclick="return false;"' : ""}
                      >
                        <div class="flex items-start gap-4">
                          ${statusIcon}
                          <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-2 mb-2">
                              <span class="text-xs font-bold px-2 py-1 rounded-md ${
                                isDone
                                  ? "bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100"
                                  : isCurrent
                                  ? "bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100"
                                  : isNext
                                  ? "bg-orange-200 dark:bg-orange-800 text-orange-900 dark:text-orange-100"
                                  : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                              }">
                                Chapter ${s.session_number}
                              </span>
                              ${statusBadge}
                            </div>
                            <h3 class="text-sm font-semibold ${
                              isCurrent
                                ? "text-blue-900 dark:text-blue-100"
                                : isLocked
                                ? "text-gray-500 dark:text-gray-400"
                                : "text-gray-800 dark:text-gray-200"
                            } line-clamp-2 leading-tight mb-1">
                              ${s.title}
                            </h3>
                            <div class="text-xs text-gray-500 dark:text-gray-400">
                              ${
                                isDone
                                  ? "Completed"
                                  : isCurrent
                                  ? "Currently studying"
                                  : isNext
                                  ? "Ready to start"
                                  : "Locked"
                              }
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  `;
                })
                .join("")}
            </div>
          </div>
        </aside>
      </div>
    `;

    // ✅ Panggil highlight setelah render
    document.querySelectorAll("pre code").forEach((el) => {
      hljs.highlightElement(el);
    });

    // Event Listeners
    const btn = document.getElementById("complete-btn");
    if (!isAlreadyCompleted) {
      btn?.addEventListener("click", async () => {
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
            showToastNotification(
              result.message || "Gagal update checkpoint.",
              "error"
            );
            return;
          }

          courseData.progress.checkpoint = sessionNumber;
          sessionStorage.setItem(
            `course-${courseId}`,
            JSON.stringify(courseData)
          );
          sessionStorage.setItem("current_session_number", sessionNumber + 1);

          showToastNotification(
            "Chapter berhasil ditandai selesai! 🎉",
            "success"
          );

          // Add a small delay before redirecting for better UX
          setTimeout(() => {
            location.hash = `#/course/session?number=${sessionNumber + 1}`;
          }, 1000);
        } catch (e) {
          hideGlobalLoading();
          console.error(e);
          showToastNotification(
            "Terjadi kesalahan saat memproses permintaan.",
            "error"
          );
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
        showToastNotification(
          "Tandai chapter ini selesai terlebih dahulu.",
          "warning"
        );
        return;
      }
      const next = sessionNumber + 1;
      sessionStorage.setItem("current_session_number", next);
      location.hash = `#/course/session?number=${next}`;
    });

    // Enhanced sidebar functionality
    const sidebar = document.getElementById("module-sidebar");
    const toggleBtn = document.getElementById("toggle-sidebar");
    const closeBtn = document.getElementById("close-sidebar");

    const toggleSidebar = () => {
      if (sidebar && toggleBtn) {
        const isOpen = !sidebar.classList.contains("translate-x-full");

        if (isOpen) {
          sidebar.classList.add("translate-x-full");
          toggleBtn.innerHTML = `
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
            <span class="hidden sm:inline">Daftar Modul</span>
          `;
        } else {
          sidebar.classList.remove("translate-x-full");
          toggleBtn.innerHTML = `
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <span class="hidden sm:inline">Tutup</span>
          `;
        }
      }
    };

    const closeSidebar = () => {
      if (sidebar && toggleBtn) {
        sidebar.classList.add("translate-x-full");
        toggleBtn.innerHTML = `
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
          <span class="hidden sm:inline">Daftar Modul</span>
        `;
      }
    };

    toggleBtn?.addEventListener("click", toggleSidebar);
    closeBtn?.addEventListener("click", closeSidebar);

    // Close sidebar on escape key and outside click
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeSidebar();
      }
    };

    const handleOutsideClick = (e) => {
      if (
        sidebar &&
        !sidebar.contains(e.target) &&
        !toggleBtn.contains(e.target)
      ) {
        if (!sidebar.classList.contains("translate-x-full")) {
          closeSidebar();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleOutsideClick);

    // Cleanup function to remove event listeners when component is destroyed
    const cleanup = () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleOutsideClick);
    };

    // Store cleanup function for potential use
    SessionView.cleanup = cleanup;

    // Auto-scroll to top when component loads
    window.scrollTo({ top: 0, behavior: "smooth" });
  },
};

export default SessionView;
