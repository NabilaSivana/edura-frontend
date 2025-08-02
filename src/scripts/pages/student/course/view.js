// FILE: CourseView - Enhanced with robust features and modern UX
import { renderStudyMaterialSection } from "../../../component/studyMaterialSection.js";
import { toast } from "../../../utils/toast.js";

const CourseView = {
  // Theme detection and management
  getTheme() {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  },

  // Utility function for safe text rendering
  sanitizeText(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  // Generate responsive progress bar
  createProgressBar(checkpoint, total) {
    const percent = Math.round((checkpoint / total) * 100);
    const theme = this.getTheme();

    return `
      <div class="relative">
        <div class="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden shadow-inner">
          <div class="relative h-3 rounded-full bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 dark:from-purple-400 dark:via-purple-500 dark:to-indigo-500 transition-all duration-700 ease-out shadow-sm" 
               style="width: ${percent}%">
            <div class="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent rounded-full"></div>
            ${percent > 15 ? `<div class="absolute right-2 top-0 h-full flex items-center text-xs font-medium text-white">${percent}%</div>` : ''}
          </div>
        </div>
        ${percent <= 15 ? `<div class="absolute -right-0 -top-6 text-xs font-semibold text-purple-600 dark:text-purple-400">${percent}%</div>` : ''}
      </div>
    `;
  },

  // Generate stats cards
  createStatsCards(course, sessions, checkpoint) {
    const completed = checkpoint;
    const remaining = sessions.length - checkpoint;
    const completionRate = sessions.length > 0 ? Math.round((completed / sessions.length) * 100) : 0;

    return `
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 p-4 rounded-xl border border-green-200 dark:border-green-700">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-green-100 dark:bg-green-800/50 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div>
              <div class="text-2xl font-bold text-green-700 dark:text-green-300">${completed}</div>
              <div class="text-sm text-green-600 dark:text-green-400">Chapter Selesai</div>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/30 p-4 rounded-xl border border-orange-200 dark:border-orange-700">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-orange-100 dark:bg-orange-800/50 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div>
              <div class="text-2xl font-bold text-orange-700 dark:text-orange-300">${remaining}</div>
              <div class="text-sm text-orange-600 dark:text-orange-400">Chapter Tersisa</div>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 p-4 rounded-xl border border-blue-200 dark:border-blue-700">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-100 dark:bg-blue-800/50 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z"></path>
              </svg>
            </div>
            <div>
              <div class="text-2xl font-bold text-blue-700 dark:text-blue-300">${completionRate}%</div>
              <div class="text-sm text-blue-600 dark:text-blue-400">Tingkat Selesai</div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // Generate chapter cards with enhanced styling (READ-ONLY for completed chapters)
  createChapterCard(session, checkpoint) {
    const isCompleted = session.session_number <= checkpoint;
    const cardClass = isCompleted
      ? 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/10 dark:to-green-800/20 border-green-200 dark:border-green-700'
      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';

    const statusBadge = isCompleted
      ? '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200"><svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>Selesai</span>'
      : '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">Belum Selesai</span>';

    return `
      <div class="p-6 border-2 ${cardClass} rounded-xl transition-all duration-300">
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 ${isCompleted ? 'bg-green-100 dark:bg-green-800/50' : 'bg-gray-100 dark:bg-gray-700'} rounded-lg flex items-center justify-center flex-shrink-0">
              <span class="text-sm font-bold ${isCompleted ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'}">${session.session_number}</span>
            </div>
            <h3 class="font-bold text-lg ${isCompleted ? 'text-green-900 dark:text-green-100' : 'text-gray-900 dark:text-gray-100'} line-clamp-2">
              ${this.sanitizeText(session.title)}
            </h3>
          </div>
          ${statusBadge}
        </div>
        
        ${session.overview ? `
          <p class="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4 leading-relaxed">
            ${this.sanitizeText(session.overview)}
          </p>
        ` : ''}
        
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-500 dark:text-gray-400">Chapter ${session.session_number} dari ${session.total || 16}</span>
          <div class="flex items-center gap-2 text-gray-400">
          </div>
        </div>
      </div>
    `;
  },

  // Main render function with enhanced features
  render(courseData) {
    const main = document.getElementById("main-content");
    if (!main) {
      console.error('Main content container not found');
      this.showError('Kontainer utama tidak ditemukan');
      return;
    }

    // Validate courseData
    if (!courseData || !courseData.course || !courseData.sessions || !courseData.progress) {
      console.error('Invalid courseData provided', courseData);
      this.showError('Data course tidak valid atau tidak lengkap');
      return;
    }

    const { course, sessions, progress, isEligibleForFinalExam } = courseData;
    const checkpoint = progress.checkpoint || 0;
    const nextSession = checkpoint + 1;

    // Store session data safely
    try {
      sessionStorage.setItem("current_session_number", nextSession.toString());
      sessionStorage.setItem("current_course_id", course.id.toString());
    } catch (error) {
      console.warn('Failed to store session data:', error);
    }

    const progressBar = this.createProgressBar(checkpoint, sessions.length);
    const statsCards = this.createStatsCards(course, sessions, checkpoint);

    // Filter completed sessions safely
    const completedSessions = sessions
      .filter((s) => s && s.session_number <= checkpoint)
      .sort((a, b) => b.session_number - a.session_number);

    main.innerHTML = `
      <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          
          <!-- Back Navigation -->
          <nav class="mb-8" aria-label="Breadcrumb">
            <a href="#/dashboard" class="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 group">
              <svg class="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Kembali ke Dashboard
            </a>
          </nav>

          <!-- Course Header -->
          <header class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:p-8 mb-8 transition-colors duration-300">
            <div class="flex flex-col lg:flex-row gap-6 lg:gap-8">
              
              <!-- Course Icon -->
              <div class="flex-shrink-0 mx-auto lg:mx-0">
                <div class="relative group">
                  <div class="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-2xl p-4 lg:p-6 shadow-inner transition-transform duration-300 group-hover:scale-105">
                    <img src="/knowledge.png" alt="Course Icon" class="w-full h-full object-contain filter drop-shadow-sm" 
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                    <div class="hidden w-full h-full items-center justify-center">
                      <svg class="w-12 h-12 lg:w-16 lg:h-16 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Course Info -->
              <div class="flex-1 text-center lg:text-left">
                <h1 class="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                  ${this.sanitizeText(course.title)}
                </h1>
                
                <p class="text-gray-600 dark:text-gray-300 text-base lg:text-lg mb-6 leading-relaxed max-w-3xl">
                  ${this.sanitizeText(course.description)}
                </p>
                
                <!-- Progress Section -->
                <div class="space-y-4">
                  ${progressBar}
                  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
                    <span class="text-gray-600 dark:text-gray-400 font-medium">
                      Progress Pembelajaran: <span class="font-bold text-purple-600 dark:text-purple-400">${checkpoint} dari ${sessions.length} chapter</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <!-- Stats Cards -->
          ${statsCards}

          <!-- Study Material Section -->
          <section class="mb-10">
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
              <div class="p-6 lg:p-8 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-8 h-8 bg-blue-100 dark:bg-blue-800/30 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z"></path>
                    </svg>
                  </div>
                  <h2 class="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Materi Pembelajaran</h2>
                </div>
                <p class="text-gray-600 dark:text-gray-400 text-sm">Akses berbagai jenis materi untuk mengoptimalkan proses belajar Anda</p>
              </div>
              <div id="study-material-section" class="p-6 lg:p-8">
                <!-- Content will be injected here -->
              </div>
            </div>
          </section>

          <!-- Completed Chapters Section -->
          <section class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:p-8 transition-colors duration-300">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div class="w-8 h-8 bg-green-100 dark:bg-green-800/30 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                Riwayat Chapter Selesai
              </h2>
              <span class="text-sm font-medium px-3 py-1 bg-green-100 dark:bg-green-800/30 text-green-700 dark:text-green-300 rounded-full">
                ${completedSessions.length} chapter
              </span>
            </div>
            
            ${completedSessions.length > 0 ? `
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                ${completedSessions.map(session => this.createChapterCard(session, checkpoint)).join('')}
              </div>
            ` : `
              <div class="text-center py-12">
                <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Belum Ada Chapter yang Diselesaikan</h3>
                <p class="text-gray-500 dark:text-gray-400">Mulai belajar untuk melihat progress kamu di sini!</p>
              </div>
            `}
          </section>
        </div>
      </div>
    `;

    // Render study material section
    this.renderStudyMaterialSection(course);

    // Add event listeners
    this.addEventListeners(completedSessions, course.id);
  },

  // Render study material section with error handling
  renderStudyMaterialSection(course) {
    try {
      const studySection = document.getElementById("study-material-section");
      if (!studySection) {
        console.warn('Study material section container not found');
        return;
      }

      const studySectionEl = renderStudyMaterialSection(course.id, course);
      if (studySectionEl) {
        // Clear existing content and append new content
        studySection.innerHTML = '';
        studySection.appendChild(studySectionEl);
      } else {
        studySection.innerHTML = `
          <div class="text-center py-12">
            <div class="w-16 h-16 bg-yellow-100 dark:bg-yellow-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Materi Sedang Dimuat</h3>
            <p class="text-gray-500 dark:text-gray-400">Mohon tunggu sebentar, sistem sedang mempersiapkan materi pembelajaran Anda</p>
          </div>
        `;
      }
    } catch (error) {
      console.error('Error rendering study material section:', error);
      toast.error('Gagal memuat materi pembelajaran');
    }
  },


  addEventListeners(completedSessions, courseId) {
    // No click listeners for completed chapter cards - they are read-only

    // Add smooth scroll behavior
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // Enhanced error display with recovery options
  showError(message = "Terjadi kesalahan saat menampilkan konten.", details = null) {
    const main = document.getElementById("main-content");
    if (!main) return;

    console.error('CourseView Error:', message, details);

    main.innerHTML = `
      <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <div class="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div class="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Oops! Terjadi Kesalahan</h2>
          <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">${this.sanitizeText(message)}</p>
          
          ${details ? `
            <details class="mb-6 text-left">
              <summary class="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                Detail Error
              </summary>
              <pre class="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs overflow-auto">${this.sanitizeText(JSON.stringify(details, null, 2))}</pre>
            </details>
          ` : ''}
          
          <div class="space-y-3">
            <button 
              onclick="location.reload()" 
              class="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Muat Ulang Halaman
            </button>
            
            <a 
              href="#/dashboard" 
              class="block w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Kembali ke Dashboard
            </a>
            
            <a 
              href="#/course" 
              class="block w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium py-2 transition-colors duration-200"
            >
              Lihat Semua Course
            </a>
          </div>
        </div>
      </div>
    `;

    // Show toast notification
    toast.error('Gagal memuat halaman course');
  },

  // Cleanup method for memory management
  cleanup() {
    // Remove any remaining event listeners if needed
    const elements = document.querySelectorAll('[data-cleanup]');
    elements.forEach(element => {
      element.removeEventListener('click', element.clickHandler);
      element.removeEventListener('keydown', element.keydownHandler);
    });
  }
};

export default CourseView;