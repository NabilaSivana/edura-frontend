import FinalExamPresenter from "./final-exam-presenter.js";
import { showToastNotification } from "../../../utils/index.js";

class FinalExamPage {
  constructor() {
    this.presenter = new FinalExamPresenter();
    this.courseId = null;
    this.isExamStarted = false;
    this.beforeUnloadHandler = null;
  }

  async render(courseId) {
    this.courseId = courseId;
    this.presenter.setView(this);

    const container = document.querySelector("#main-content");

    try {
      // Show loading state
      container.innerHTML = `
        <div class="container mx-auto px-4 py-8">
          <div class="max-w-4xl mx-auto text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600 dark:text-gray-300">Memuat final exam...</p>
          </div>
        </div>
      `;

      const result = await this.presenter.init(courseId);

      if (!result.success) {
        this.renderError(result.error);
        return;
      }

      // Check if there's saved progress
      const savedProgress = this.presenter.loadProgress(courseId);

      if (savedProgress && savedProgress.timeRemaining > 0) {
        this.renderResumeExam(savedProgress);
      } else {
        this.renderExamStart();
      }
    } catch (error) {
      console.error("Error rendering final exam page:", error);
      this.renderError(error.message || "Failed to load final exam");
    }
  }

  renderError(errorMessage) {
    const container = document.querySelector("#main-content");
    container.innerHTML = `
      <div class="container mx-auto px-4 py-8">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
              <svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h1 class="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h1>
          </div>
          
          <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
            <h3 class="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Failed to Load Final Exam</h3>
            <p class="text-red-700 dark:text-red-300 mb-4">${errorMessage}</p>
            
            <div class="flex flex-wrap gap-3">
              <button 
                id="retry-btn" 
                class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Try Again
              </button>
              <button 
                id="generate-exam-btn" 
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Generate New Exam
              </button>
            </div>
          </div>
          
          <div class="text-center">
            <a href="#/course" class="text-blue-600 hover:text-blue-800 underline font-medium">← Back to Course</a>
          </div>
        </div>
      </div>
    `;

    // Event listeners
    document.getElementById("retry-btn").addEventListener("click", () => {
      this.render(this.courseId);
    });

    document
      .getElementById("generate-exam-btn")
      .addEventListener("click", async () => {
        await this.presenter.generateExam(this.courseId);
        this.render(this.courseId);
      });
  }

  renderResumeExam(savedProgress) {
    const container = document.querySelector("#main-content");
    const timeFormatted = this.presenter.model.formatTime(
      savedProgress.timeRemaining
    );

    container.innerHTML = `
      <div class="container mx-auto px-4 py-8">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-4">Resume Final Exam</h1>
            <p class="text-gray-600 dark:text-gray-300">Anda memiliki ujian yang belum selesai</p>
          </div>
          
          <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-6">
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0">
                <svg class="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  Ada progres ujian yang tersimpan
                </h3>
                <p class="text-yellow-700 dark:text-yellow-300 mb-2">
                  Waktu tersisa: <strong class="text-xl">${timeFormatted}</strong>
                </p>
                <p class="text-yellow-600 dark:text-yellow-400 text-sm">
                  Anda dapat melanjutkan ujian dari terakhir kali atau memulai ulang.
                </p>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap justify-center gap-4">
            <button 
              id="resume-btn" 
              class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Lanjutkan Ujian</span>
            </button>
            
            <button 
              id="restart-btn" 
              class="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold flex items-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              <span>Mulai Ulang</span>
            </button>
            
            <a 
              href="#/course" 
              class="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold inline-flex items-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span>Kembali</span>
            </a>
          </div>
        </div>
      </div>
    `;

    // Event listeners
    document.getElementById("resume-btn").addEventListener("click", () => {
      this.resumeExam(savedProgress);
    });

    document.getElementById("restart-btn").addEventListener("click", () => {
      this.presenter.clearProgress(this.courseId);
      this.renderExamStart();
    });
  }

  renderExamStart() {
    const container = document.querySelector("#main-content");
    const examData = this.presenter.model.examData;
    const questionCount = Array.isArray(examData) ? examData.length : 0;
    const duration = 5400; // 90 minutes default
    const durationFormatted = this.presenter.model.formatTime(duration);

    container.innerHTML = `
      <div class="container mx-auto px-4 py-8">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-8"><h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-4">Final Exam</h1>
            <p class="text-gray-600 dark:text-gray-300">Siapkan diri Anda untuk mengerjakan final exam</p>
          </div>
          
          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
            <div class="grid md:grid-cols-3 gap-6">
              <div class="text-center">
                <div class="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full mb-3">
                  <svg class="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h3 class="font-semibold text-gray-800 dark:text-white mb-1">Total Soal</h3>
                <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">${questionCount}</p>
              </div>
              
              <div class="text-center">
                <div class="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full mb-3">
                  <svg class="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 class="font-semibold text-gray-800 dark:text-white mb-1">Waktu</h3>
                <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">${durationFormatted}</p>
              </div>
              
              <div class="text-center">
                <div class="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full mb-3">
                  <svg class="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
                <h3 class="font-semibold text-gray-800 dark:text-white mb-1">Status</h3>
                <p class="text-lg font-semibold text-green-600 dark:text-green-400">Siap</p>
              </div>
            </div>
          </div>
          
          <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 mb-8">
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0">
                <svg class="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-3">Petunjuk Ujian</h3>
                <ul class="space-y-2 text-amber-700 dark:text-amber-300">
                  <li class="flex items-start space-x-2">
                    <span class="text-amber-500 mt-1">•</span>
                    <span>Pastikan koneksi internet stabil selama ujian</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <span class="text-amber-500 mt-1">•</span>
                    <span>Ujian akan otomatis tersimpan setiap 30 detik</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <span class="text-amber-500 mt-1">•</span>
                    <span>Jangan menutup browser atau tab selama ujian</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <span class="text-amber-500 mt-1">•</span>
                    <span>Waktu akan terus berjalan setelah ujian dimulai</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <span class="text-amber-500 mt-1">•</span>
                    <span>Submit ujian sebelum waktu habis</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="flex flex-wrap justify-center gap-4">
            <button 
              id="start-exam-btn" 
              class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center space-x-2 text-lg"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Mulai Ujian</span>
            </button>
            
            <a 
              href="#/course" 
              class="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold inline-flex items-center space-x-2 text-lg"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span>Kembali</span>
            </a>
          </div>
        </div>
      </div>
    `;

    // Event listener
    document.getElementById("start-exam-btn").addEventListener("click", () => {
      this.startExam();
    });
  }

  startExam() {
    if (this.presenter.startExam()) {
      this.isExamStarted = true;
      this.setupBeforeUnloadWarning();
      this.renderExam();
    } else {
      showToastNotification("Gagal memulai ujian", "error");
    }
  }

  resumeExam(savedProgress) {
    // Restore exam state
    this.presenter.model.courseId = savedProgress.courseId;
    this.presenter.model.answers = savedProgress.answers;
    this.presenter.model.currentQuestionIndex =
      savedProgress.currentQuestionIndex;
    this.presenter.model.timeRemaining = savedProgress.timeRemaining;
    this.presenter.model.examStatus = "in_progress";

    this.isExamStarted = true;
    this.setupBeforeUnloadWarning();
    this.renderExam();

    // Start timer and auto-save
    this.presenter.startTimer();
    this.presenter.startAutoSave();
  }

  setupBeforeUnloadWarning() {
    this.beforeUnloadHandler = (e) => {
      if (
        this.isExamStarted &&
        this.presenter.model.examStatus === "in_progress"
      ) {
        const message =
          "Ujian sedang berlangsung. Yakin ingin meninggalkan halaman?";
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener("beforeunload", this.beforeUnloadHandler);
  }

  removeBeforeUnloadWarning() {
    if (this.beforeUnloadHandler) {
      window.removeEventListener("beforeunload", this.beforeUnloadHandler);
      this.beforeUnloadHandler = null;
    }
  }

  renderExam() {
    const container = document.querySelector("#main-content");
    const stats = this.presenter.getExamStats();

    container.innerHTML = `
      <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <!-- Header with timer and navigation -->
        <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
          <div class="container mx-auto px-4 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <h1 class="text-xl font-bold text-gray-800 dark:text-white">Final Exam</h1>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  Soal ${stats.currentQuestion} dari ${stats.totalQuestions}
                </div>
              </div>
              
              <div class="flex items-center space-x-4">
                <!-- Timer -->
                <div class="flex items-center space-x-2 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                  <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span id="timer-display" class="font-mono text-lg font-bold text-red-600 dark:text-red-400">
                    ${stats.timeFormatted}
                  </span>
                </div>
                
                <!-- Submit button -->
                <button 
                  id="submit-exam-btn" 
                  class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="container mx-auto px-4 py-6">
          <div class="grid lg:grid-cols-4 gap-6">
            <!-- Question navigation sidebar -->
            <div class="lg:col-span-1">
              <div class="bg-white dark:bg-gray-800 rounded-lg p-4 sticky top-24">
                <h3 class="font-semibold text-gray-800 dark:text-white mb-4">Navigasi Soal</h3>
                <div id="question-nav" class="grid grid-cols-5 lg:grid-cols-4 gap-2">
                  <!-- Question navigation buttons will be rendered here -->
                </div>
                
                <div class="mt-6 space-y-3">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600 dark:text-gray-400">Dijawab:</span>
                    <span class="font-semibold text-green-600 dark:text-green-400">${stats.answeredQuestions}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600 dark:text-gray-400">Belum dijawab:</span>
                    <span class="font-semibold text-red-600 dark:text-red-400">${stats.unansweredQuestions}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Main question area -->
            <div class="lg:col-span-3">
              <div class="bg-white dark:bg-gray-800 rounded-lg p-6">
                <div id="question-content">
                  <!-- Question content will be rendered here -->
                </div>
                
                <!-- Navigation buttons -->
                <div class="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button 
                    id="prev-btn" 
                    class="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors font-semibold flex items-center space-x-2"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    <span>Sebelumnya</span>
                  </button>
                  
                  <button 
                    id="next-btn" 
                    class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center space-x-2"
                  >
                    <span>Selanjutnya</span>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Submit loading overlay -->
        <div id="submit-loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
          <div class="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md mx-4">
            <div class="text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">Submitting Exam...</h3>
              <p class="text-gray-600 dark:text-gray-300">Mohon tunggu, ujian sedang disubmit.</p>
            </div>
          </div>
        </div>
      </div>
    `;

    // Render question navigation
    this.renderQuestionNavigation();

    // Render current question
    this.renderCurrentQuestion();

    // Setup event listeners
    this.setupExamEventListeners();
  }

  renderQuestionNavigation() {
    const container = document.getElementById("question-nav");
    const stats = this.presenter.getExamStats();
    let navHTML = "";

    for (let i = 0; i < stats.totalQuestions; i++) {
      const isAnswered =
        this.presenter.getAnswer(i) !== null &&
        this.presenter.getAnswer(i) !== undefined;
      const isCurrent = i === this.presenter.model.currentQuestionIndex;

      let buttonClass =
        "w-10 h-10 rounded-lg font-semibold text-sm transition-colors ";
      if (isCurrent) {
        buttonClass += "bg-blue-600 text-white border-2 border-blue-400";
      } else if (isAnswered) {
        buttonClass +=
          "bg-green-100 text-green-800 border border-green-300 hover:bg-green-200 dark:bg-green-800 dark:text-green-100";
      } else {
        buttonClass +=
          "bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600";
      }

      navHTML += `
            <button 
                class="${buttonClass}" 
                data-question-index="${i}"
            >
                ${i + 1}
            </button>
        `;
    }

    container.innerHTML = navHTML;

    // Add click listeners dengan update
    container.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = parseInt(e.target.dataset.questionIndex);
        this.presenter.goToQuestion(index);
        this.updateAfterNavigation(); // Tambah ini
      });
    });
  }

  renderCurrentQuestion() {
    const questionData = this.presenter.getCurrentQuestion();
    const container = document.getElementById("question-content");

    if (!questionData) {
      container.innerHTML = `
        <div class="text-center text-red-600 dark:text-red-400">
          <p>Error: Question not found</p>
        </div>
      `;
      return;
    }

    const currentAnswer = this.presenter.getAnswer(
      this.presenter.model.currentQuestionIndex
    );
    console.log("Current saved answer:", currentAnswer); // Debug

    // Handle nested question structure
    let actualQuestionData = questionData;
    if (questionData.question && typeof questionData.question === "object") {
      actualQuestionData = questionData.question;
    }

    // Handle berbagai format question text
    let questionText = "Question not available";
    if (typeof actualQuestionData.question === "string") {
      questionText = actualQuestionData.question;
    } else if (typeof actualQuestionData.question_text === "string") {
      questionText = actualQuestionData.question_text;
    } else if (typeof actualQuestionData.text === "string") {
      questionText = actualQuestionData.text;
    } else if (typeof actualQuestionData === "string") {
      questionText = actualQuestionData;
    }

    // Handle berbagai format options - prioritize nested question structure
    let optionsHTML = "";
    let options = [];

    // Check for options in nested question structure first
    if (
      actualQuestionData.options &&
      Array.isArray(actualQuestionData.options)
    ) {
      options = actualQuestionData.options;
    } else if (
      actualQuestionData.choices &&
      Array.isArray(actualQuestionData.choices)
    ) {
      options = actualQuestionData.choices;
    } else if (
      actualQuestionData.answers &&
      Array.isArray(actualQuestionData.answers)
    ) {
      options = actualQuestionData.answers;
    } else if (questionData.options && Array.isArray(questionData.options)) {
      options = questionData.options;
    } else if (questionData.choices && Array.isArray(questionData.choices)) {
      options = questionData.choices;
    } else if (questionData.answers && Array.isArray(questionData.answers)) {
      options = questionData.answers;
    }

    if (options.length > 0) {
      options.forEach((option, index) => {
        let optionText = option;
        let optionValue = option;

        if (typeof option === "object") {
          optionText =
            option.text ||
            option.label ||
            option.option ||
            JSON.stringify(option);
          optionValue =
            option.value ||
            option.text ||
            option.label ||
            option.option ||
            index;
        }

        if (typeof option === "string") {
          optionValue = index;
        }

        // PERBAIKAN: Cek dengan lebih tepat
        const isChecked =
          currentAnswer !== null &&
          currentAnswer !== undefined &&
          (currentAnswer === optionValue ||
            currentAnswer === option ||
            currentAnswer == index);

        const optionLetter = String.fromCharCode(65 + index);

        optionsHTML += `
                <label class="flex items-start space-x-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                    <input 
                        type="radio" 
                        name="answer" 
                        value="${optionValue}" 
                        ${isChecked ? "checked" : ""}
                        class="mt-1 text-blue-600 focus:ring-blue-500"
                    >
                    <span class="text-gray-800 dark:text-white flex-1">
                        <strong class="text-blue-600 dark:text-blue-400">${optionLetter}.</strong> ${optionText}
                    </span>
                </label>
            `;
      });
    } else {
      // Enhanced fallback with more debugging info
      optionsHTML = `
        <div class="text-center text-gray-500 dark:text-gray-400 p-8">
          <p class="text-red-600 dark:text-red-400 font-semibold mb-2">No options available for this question</p>
          <p class="text-sm mt-2">Please check the question data format</p>
          <details class="mt-4 text-left">
            <summary class="text-xs cursor-pointer">Raw Question Data</summary>
            <pre class="text-xs mt-2 bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto text-left">${JSON.stringify(
              questionData,
              null,
              2
            )}</pre>
          </details>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="mb-6">
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm font-medium text-blue-600 dark:text-blue-400">
            Soal ${this.presenter.model.currentQuestionIndex + 1}
          </span>
          ${
            currentAnswer !== null && currentAnswer !== undefined
              ? '<span class="text-sm text-green-600 dark:text-green-400 font-medium">✓ Dijawab</span>'
              : '<span class="text-sm text-gray-500 dark:text-gray-400">Belum dijawab</span>'
          }
        </div>
        
        <div class="text-lg text-gray-800 dark:text-white mb-6 leading-relaxed">
          ${questionText}
        </div>
      </div>
      
      <div class="space-y-3">
        ${optionsHTML}
      </div>
      
      ${
        process.env.NODE_ENV === "development"
          ? `
        <details class="mt-4">
          <summary class="text-xs text-gray-500 cursor-pointer">Debug Info</summary>
          <div class="text-xs text-gray-400 mt-2 bg-gray-100 dark:bg-gray-800 p-2 rounded">
            <div><strong>Current Answer:</strong> ${currentAnswer}</div>
            <div><strong>Options Found:</strong> ${options.length}</div>
            <pre class="mt-2 overflow-auto">${JSON.stringify(
              questionData,
              null,
              2
            )}</pre>
          </div>
        </details>
      `
          : ""
      }
    `;

    // Add answer selection listeners
    container.querySelectorAll('input[name="answer"]').forEach((input) => {
      input.addEventListener("change", (e) => {
        console.log("Answer selected:", e.target.value); // Debug
        this.presenter.setAnswer(
          this.presenter.model.currentQuestionIndex,
          e.target.value
        );
        this.updateQuestionStatus(); // Update status setelah jawab
      });
    });
  }

  setupExamEventListeners() {
    // Previous button
    document.getElementById("prev-btn").addEventListener("click", () => {
      this.presenter.previousQuestion();
      this.updateAfterNavigation(); // Tambah ini
    });

    // Next button - handle berbeda untuk soal terakhir
    document.getElementById("next-btn").addEventListener("click", () => {
      const currentIndex = this.presenter.model.currentQuestionIndex;
      const totalQuestions = this.presenter.model.examData.length;

      if (currentIndex === totalQuestions - 1) {
        // Soal terakhir - show submit confirmation
        this.showSubmitConfirmation();
      } else {
        // Bukan soal terakhir - next question
        this.presenter.nextQuestion();
        this.updateAfterNavigation(); // Tambah ini
      }
    });

    // Submit button
    document.getElementById("submit-exam-btn").addEventListener("click", () => {
      this.showSubmitConfirmation();
    });
  }
  updateAfterNavigation() {
    this.renderCurrentQuestion(); // Re-render question dengan jawaban tersimpan
    this.updateQuestionStatus(); // Update status dan counter
  }

  updateTimer(timeFormatted) {
    const timerElement = document.getElementById("timer-display");
    if (timerElement) {
      timerElement.textContent = timeFormatted;

      // Change color when time is running low
      const timeRemaining = this.presenter.model.timeRemaining;
      if (timeRemaining <= 300) {
        // 5 minutes
        timerElement.classList.add("text-red-600", "dark:text-red-400");
        timerElement.classList.remove(
          "text-orange-600",
          "dark:text-orange-400"
        );
      } else if (timeRemaining <= 900) {
        // 15 minutes
        timerElement.classList.add("text-orange-600", "dark:text-orange-400");
        timerElement.classList.remove("text-red-600", "dark:text-red-400");
      }
    }
  }

  updateQuestionStatus() {
    this.renderQuestionNavigation();

    // Update stats in sidebar
    const stats = this.presenter.getExamStats();

    // Update counter "Dijawab" dan "Belum dijawab"
    const answeredElements = document.querySelectorAll(
      ".text-green-600.dark\\:text-green-400"
    );
    const unansweredElements = document.querySelectorAll(
      ".text-red-600.dark\\:text-red-400"
    );

    answeredElements.forEach((el) => {
      if (el.textContent && !isNaN(parseInt(el.textContent))) {
        el.textContent = stats.answeredQuestions;
      }
    });

    unansweredElements.forEach((el) => {
      if (el.textContent && !isNaN(parseInt(el.textContent))) {
        el.textContent = stats.unansweredQuestions;
      }
    });
    const headerSoal = document.querySelector(
      ".text-sm.text-gray-500.dark\\:text-gray-400"
    );
    if (headerSoal && headerSoal.textContent.includes("Soal")) {
      headerSoal.textContent = `Soal ${stats.currentQuestion} dari ${stats.totalQuestions}`;
    }

    // Update tombol Next/Selesaikan Ujian
    this.updateNavigationButtons();
  }
  updateNavigationButtons() {
    const nextBtn = document.getElementById("next-btn");
    const currentIndex = this.presenter.model.currentQuestionIndex;
    const totalQuestions = this.presenter.model.examData.length;

    if (nextBtn) {
      if (currentIndex === totalQuestions - 1) {
        // Soal terakhir - ubah jadi "Selesaikan Ujian"
        nextBtn.innerHTML = `
                <span>Selesaikan Ujian</span>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            `;
        nextBtn.classList.remove("bg-blue-600", "hover:bg-blue-700");
        nextBtn.classList.add("bg-green-600", "hover:bg-green-700");
      } else {
        // Bukan soal terakhir - tetap "Selanjutnya"
        nextBtn.innerHTML = `
                <span>Selanjutnya</span>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            `;
        nextBtn.classList.remove("bg-green-600", "hover:bg-green-700");
        nextBtn.classList.add("bg-blue-600", "hover:bg-blue-700");
      }
    }

    // Update tombol Previous
    const prevBtn = document.getElementById("prev-btn");
    if (prevBtn) {
      prevBtn.disabled = currentIndex === 0;
      if (currentIndex === 0) {
        prevBtn.classList.add("opacity-50", "cursor-not-allowed");
      } else {
        prevBtn.classList.remove("opacity-50", "cursor-not-allowed");
      }
    }
  }
  showSubmitConfirmation() {
    const stats = this.presenter.getExamStats();
    const unansweredQuestions = stats.unansweredQuestions;

    let message = "Apakah Anda yakin ingin submit ujian?";
    if (unansweredQuestions > 0) {
      message += `\n\nAnda masih memiliki ${unansweredQuestions} soal yang belum dijawab.`;
    }

    if (confirm(message)) {
      this.presenter.submitExam();
    }
  }

  showSubmitLoading(show) {
    const overlay = document.getElementById("submit-loading");
    if (overlay) {
      overlay.classList.toggle("hidden", !show);
    }
  }

  showResult(result) {
    this.isExamStarted = false;
    this.removeBeforeUnloadWarning();

    const container = document.querySelector("#main-content");
    const percentage =
      result.percentage ||
      Math.round((result.correct_answers / result.total_questions) * 100);
    const isPassed = percentage >= 70;

    container.innerHTML = `
      <div class="container mx-auto px-4 py-8">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-20 h-20 ${
              isPassed
                ? "bg-green-100 dark:bg-green-900/30"
                : "bg-red-100 dark:bg-red-900/30"
            } rounded-full mb-6">
              ${
                isPassed
                  ? '<svg class="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
                  : '<svg class="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
              }
            </div>
            <h1 class="text-3xl font-bold ${
              isPassed
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            } mb-4">
              ${isPassed ? "Selamat!" : "Belum Lulus"}
            </h1>
            <p class="text-xl text-gray-600 dark:text-gray-300 mb-2">Final Exam Selesai</p>
            <p class="text-lg ${
              isPassed
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            } font-semibold">
              ${
                isPassed
                  ? "Anda telah lulus final exam!"
                  : "Anda belum mencapai nilai minimum (70%)."
              }
            </p>
          </div>
          
          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
              <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">${percentage}%</div>
              <div class="text-gray-600 dark:text-gray-300">Skor Akhir</div>
            </div>
            
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
              <div class="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">${
                result.correct_answers
              }</div>
              <div class="text-gray-600 dark:text-gray-300">Jawaban Benar</div>
            </div>
            
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
              <div class="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">${
                result.wrong_answers
              }</div>
              <div class="text-gray-600 dark:text-gray-300">Jawaban Salah</div>
            </div>
            
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
              <div class="text-3xl font-bold text-gray-600 dark:text-gray-300 mb-2">${
                result.total_questions
              }</div>
              <div class="text-gray-600 dark:text-gray-300">Total Soal</div>
            </div>
          </div>
          
          <div class="text-center">
            <a 
              href="#/course" 
              class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold inline-flex items-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span>Kembali ke Course</span>
            </a>
          </div>
        </div>
      </div>
    `;
  }

  destroy() {
    // Clean up
    this.removeBeforeUnloadWarning();
    if (this.presenter) {
      this.presenter.destroy();
    }
    this.isExamStarted = false;
  }
}

export default FinalExamPage;
