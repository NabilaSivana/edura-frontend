// src/scripts/pages/course/final-exam-page.js
// FIXED VERSION - Responsive & Bug-Free

import { showToastNotification } from "../../../utils/index.js";

class FinalExamPage {
  constructor(presenter) {
    this.presenter = presenter;
    this.container = null;
    this.courseId = null;
    this.keyboardListener = null;
    this.isMobile = false;
    this.isNavigationOpen = false;
  }

  async render(courseId) {
    this.courseId = courseId;
    this.container = document.querySelector("#main-content");
    this.presenter.setView(this);
    this._detectMobile();
    this.renderLoading();
    await this.presenter.initialize(courseId);
  }

  // ===== MOBILE DETECTION =====
  _detectMobile() {
    this.isMobile = window.innerWidth <= 768;
    // Update on resize
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 768;
    });
  }

  // ===== RENDER METHODS =====

  renderLoading() {
    this.container.innerHTML = `
      <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center p-4">
        <div class="text-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 max-w-sm w-full">
          <div class="relative">
            <div class="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4 sm:mb-6"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <svg class="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
          </div>
          <h3 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2">Loading Exam Data</h3>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">Please wait while we prepare your exam...</p>
        </div>
      </div>
    `;
  }

  renderError(message) {
    this.container.innerHTML = `
      <div class="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-red-900 flex items-center justify-center px-4">
        <div class="text-center max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
          <div class="bg-red-100 dark:bg-red-900/30 rounded-full p-4 sm:p-6 w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 animate-pulse">
            <svg class="w-8 h-8 sm:w-12 sm:h-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-3">Oops! Something went wrong</h2>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8">${message}</p>
          <a href="#/course" class="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Course
          </a>
        </div>
      </div>
    `;
  }

  renderGeneratePrompt() {
    this.container.innerHTML = `
      <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center px-4">
        <div class="text-center max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
          <div class="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full p-4 sm:p-6 w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 animate-bounce">
            <svg class="w-8 h-8 sm:w-12 sm:h-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Generate Your Final Exam
          </h2>
          <p class="text-sm sm:text-lg text-gray-600 dark:text-gray-400 mb-6 sm:mb-8">
            Ready to test your knowledge? Let's create a personalized final exam just for you!
          </p>
          <button 
            id="generate-exam-btn"
            class="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold text-base sm:text-lg"
          >
            <svg class="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            Generate Exam Now
          </button>
        </div>
      </div>
    `;

    document.getElementById('generate-exam-btn').addEventListener('click', () => {
      this.presenter.generateExam();
    });
  }

  renderGenerating() {
    this.container.innerHTML = `
      <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-purple-900 flex items-center justify-center px-4">
        <div class="text-center max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
          <div class="relative mb-6 sm:mb-8">
            <div class="animate-pulse bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full p-6 sm:p-8 w-24 h-24 sm:w-32 sm:h-32 mx-auto">
              <svg class="w-12 h-12 sm:w-16 sm:h-16 text-purple-600 dark:text-purple-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="animate-spin rounded-full h-32 w-32 sm:h-40 sm:w-40 border-4 border-purple-200 border-t-purple-600"></div>
            </div>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Creating Your Exam
          </h2>
          <p class="text-sm sm:text-lg text-gray-600 dark:text-gray-400 mb-4">
            Our AI is crafting personalized questions based on your learning journey...
          </p>
          <div class="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            <div class="animate-pulse">⚡ Analyzing content</div>
            <div class="animate-pulse delay-100">🧠 Generating questions</div>
            <div class="animate-pulse delay-200">✨ Finalizing exam</div>
          </div>
        </div>
      </div>
    `;
  }

  renderStartExam() {
    const stats = this.presenter.getExamStats();

    this.container.innerHTML = `
      <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-900 dark:to-green-900">
        <div class="container mx-auto px-4 py-6 sm:py-8">
          <div class="max-w-6xl mx-auto">
            <!-- Header -->
            <div class="text-center mb-6 sm:mb-10">
              <h1 class="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
                Final Exam
              </h1>
              <p class="text-lg sm:text-xl text-gray-600 dark:text-gray-400">Course: ${this.courseId}</p>
              <div class="mt-4 inline-flex items-center px-3 sm:px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm sm:text-base">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Ready to begin your final assessment
              </div>
            </div>
            
            <!-- Exam Info Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-10">
              <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 text-center transform hover:scale-105 transition-all duration-200 border border-blue-100 dark:border-blue-800">
                <div class="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl p-3 sm:p-4 w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4">
                  <svg class="w-8 h-8 sm:w-12 sm:h-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
                <h3 class="text-sm sm:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Total Questions</h3>
                <p class="text-2xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400">${stats.totalQuestions}</p>
              </div>
              
              <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 text-center transform hover:scale-105 transition-all duration-200 border border-green-100 dark:border-green-800">
                <div class="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl p-3 sm:p-4 w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4">
                  <svg class="w-8 h-8 sm:w-12 sm:h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 class="text-sm sm:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Duration</h3>
                <p class="text-2xl sm:text-4xl font-bold text-green-600 dark:text-green-400">90 min</p>
              </div>
              
              <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 text-center transform hover:scale-105 transition-all duration-200 border border-purple-100 dark:border-purple-800">
                <div class="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl p-3 sm:p-4 w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4">
                  <svg class="w-8 h-8 sm:w-12 sm:h-12 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 class="text-sm sm:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Passing Score</h3>
                <p class="text-2xl sm:text-4xl font-bold text-purple-600 dark:text-purple-400">70%</p>
              </div>
            </div>
            
            <!-- Instructions -->
            <div class="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4 sm:p-8 mb-6 sm:mb-10">
              <div class="flex flex-col sm:flex-row sm:items-start">
                <div class="bg-yellow-100 dark:bg-yellow-900/30 rounded-full p-3 mb-4 sm:mb-0 sm:mr-4 flex-shrink-0 mx-auto sm:mx-0">
                  <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div class="flex-1">
                  <h3 class="text-lg sm:text-xl font-semibold text-yellow-800 dark:text-yellow-200 mb-4 text-center sm:text-left">Important Instructions & Features</h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-yellow-700 dark:text-yellow-300">
                    <div>
                      <h4 class="font-semibold mb-2">⏱️ Exam Rules:</h4>
                      <ul class="space-y-1 text-sm">
                        <li>• Timer cannot be paused once started</li>
                        <li>• Auto-save every 30 seconds</li>
                        <li>• Navigate between questions freely</li>
                        <li>• Auto-submit when time expires</li>
                      </ul>
                    </div>
                    <div>
                      <h4 class="font-semibold mb-2">🎯 Smart Features:</h4>
                      <ul class="space-y-1 text-sm">
                        <li>• Mark questions as doubtful (D key)</li>
                        <li>• Keyboard shortcuts (Arrow keys, 1-4)</li>
                        <li>• Smart progress tracking</li>
                        <li>• Review doubtful questions</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <button 
                id="start-exam-btn"
                class="px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold text-lg sm:text-xl flex items-center justify-center"
              >
                <svg class="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01m4 0h.01M12 17h.01M12 21a9 9 0 110-18 9 9 0 010 18z"></path>
                </svg>
                Start Exam
              </button>
              <a 
                href="#/course"
                class="px-8 sm:px-10 py-3 sm:py-4 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold text-lg sm:text-xl flex items-center justify-center"
              >
                <svg class="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Back to Course
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('start-exam-btn').addEventListener('click', () => {
      this.presenter.startExam();
    });
  }

  renderResumeDialog(savedProgress) {
    const timeFormatted = this.presenter.model.formatTime(savedProgress.timeRemaining);
    const answeredCount = Object.values(savedProgress.answers).filter(a => a !== null && a !== undefined).length;
    const totalQuestions = Object.keys(savedProgress.answers).length;
    const doubtfulCount = Object.values(savedProgress.doubtFlags || {}).filter(d => d === true).length;

    this.container.innerHTML = `
      <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center px-4">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full p-6 sm:p-8 border border-blue-200 dark:border-blue-800">
          <div class="text-center mb-6 sm:mb-8">
            <div class="bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-full p-4 sm:p-6 w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 animate-pulse">
              <svg class="w-8 h-8 sm:w-12 sm:h-12 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">Resume Your Exam?</h2>
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">We found your previous exam session</p>
          </div>
          
          <div class="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700/50 dark:to-blue-900/20 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-200 dark:border-gray-600">
            <div class="space-y-3 sm:space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400 flex items-center text-sm sm:text-base">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Time Remaining:
                </span>
                <span class="font-bold text-lg text-red-600 dark:text-red-400">${timeFormatted}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400 flex items-center text-sm sm:text-base">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Answered:
                </span>
                <span class="font-semibold text-green-600 dark:text-green-400">${answeredCount} / ${totalQuestions}</span>
              </div>
              ${doubtfulCount > 0 ? `
              <div class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400 flex items-center text-sm sm:text-base">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Doubtful:
                </span>
                <span class="font-semibold text-yellow-600 dark:text-yellow-400">${doubtfulCount}</span>
              </div>
              ` : ''}
              <div class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400 flex items-center text-sm sm:text-base">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                  </svg>
                  Current Question:
                </span>
                <span class="font-semibold text-blue-600 dark:text-blue-400">#${savedProgress.currentQuestionIndex + 1}</span>
              </div>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button 
              id="resume-btn"
              class="flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 font-semibold flex items-center justify-center text-sm sm:text-base"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01m4 0h.01M12 17h.01M12 21a9 9 0 110-18 9 9 0 010 18z"></path>
              </svg>
              Resume Exam
            </button>
            <button 
              id="restart-btn"
              class="flex-1 px-4 sm:px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-200 transform hover:scale-105 font-semibold flex items-center justify-center text-sm sm:text-base"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Start New
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('resume-btn').addEventListener('click', () => {
      this.presenter.resumeExam(savedProgress);
    });

    document.getElementById('restart-btn').addEventListener('click', () => {
      this.presenter.clearProgress();
      this.renderStartExam();
    });
  }

  renderExam() {
    this.container.innerHTML = `
      <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        <!-- Mobile-First Fixed Header -->
        <div class="bg-white dark:bg-gray-800 shadow-lg fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-gray-700">
          <div class="px-4 py-3 sm:py-4">
            <div class="flex items-center justify-between">
              <!-- Mobile Navigation Toggle -->
              <div class="flex items-center space-x-2 sm:space-x-6">
                <button 
                  id="mobile-nav-toggle" 
                  class="lg:hidden bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                >
                  <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                </button>
                
                <div>
                  <h1 class="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Final Exam
                  </h1>
                  <div id="question-counter" class="text-xs sm:text-lg text-gray-600 dark:text-gray-400 font-medium"></div>
                </div>
              </div>
              
              <!-- Timer and Submit -->
              <div class="flex items-center space-x-2 sm:space-x-4">
                <div id="timer-container" class="flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl border border-red-200 dark:border-red-800">
                  <svg class="w-4 h-4 sm:w-6 sm:h-6 text-red-600 dark:text-red-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span id="timer" class="font-mono font-bold text-red-600 dark:text-red-400 text-sm sm:text-lg">00:00</span>
                </div>
                <button 
                  id="submit-btn"
                  class="px-3 sm:px-6 py-1 sm:py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg sm:rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 font-semibold shadow-lg text-sm sm:text-base"
                >
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span class="hidden sm:inline">Submit</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Mobile Navigation Overlay -->
        <div id="mobile-nav-overlay" class="fixed inset-0 bg-black bg-opacity-50 z-40 hidden lg:hidden">
          <div id="mobile-nav-panel" class="bg-white dark:bg-gray-800 w-80 max-w-sm h-full shadow-xl transform -translate-x-full transition-transform duration-300 border-r border-gray-200 dark:border-gray-700">
            <div class="p-4">
              <div class="flex items-center justify-between mb-6">
                <h3 class="font-bold text-gray-800 dark:text-white text-lg">Navigation</h3>
                <button id="mobile-nav-close" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <!-- Mobile Question Navigation -->
              <div id="mobile-question-nav" class="grid grid-cols-5 gap-2 mb-6"></div>
              
              <!-- Mobile Progress Stats -->
              <div id="mobile-progress-stats" class="space-y-3 text-sm border-t border-gray-200 dark:border-gray-700 pt-4"></div>
              
              <!-- Mobile Doubt Review Button -->
              <button 
                id="mobile-doubt-review-btn"
                class="w-full mt-4 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-lg text-sm font-medium hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-all"
              >
                Review Doubts
              </button>
            </div>
          </div>
        </div>
        
        <!-- Main Content -->
        <div class="pt-16 sm:pt-20 lg:pt-24 pb-8">
          <div class="px-4">
            <div class="max-w-7xl mx-auto">
              <div class="grid lg:grid-cols-4 gap-6 lg:gap-8">
                <!-- Desktop Navigation Sidebar -->
                <div class="hidden lg:block lg:col-span-1">
                  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-28 border border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-between mb-6">
                      <h3 class="font-bold text-gray-800 dark:text-white text-lg">Navigation</h3>
                      <button 
                        id="doubt-review-btn"
                        class="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-lg text-sm font-medium hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-all"
                      >
                        Review Doubts
                      </button>
                    </div>
                    
                    <!-- Desktop Status Legend -->
                    <div class="mb-6 text-xs space-y-2">
                      <div class="flex items-center space-x-2">
                        <div class="w-4 h-4 bg-blue-600 rounded-lg animate-pulse ring-2 ring-blue-300"></div>
                        <span class="text-gray-600 dark:text-gray-400">Current</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <div class="w-4 h-4 bg-green-500 rounded-lg"></div>
                        <span class="text-gray-600 dark:text-gray-400">Answered</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <div class="w-4 h-4 bg-yellow-500 rounded-lg relative">
                          <div class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full transform translate-x-1 -translate-y-1"></div>
                        </div>
                        <span class="text-gray-600 dark:text-gray-400">Answered + Doubt</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <div class="w-4 h-4 bg-orange-500 rounded-lg relative">
                          <div class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full transform translate-x-1 -translate-y-1"></div>
                        </div>
                        <span class="text-gray-600 dark:text-gray-400">Doubt Only</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <div class="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
                        <span class="text-gray-600 dark:text-gray-400">Unanswered</span>
                      </div>
                    </div>
                    
                    <div id="question-nav" class="grid grid-cols-5 gap-2 mb-6"></div>
                    <div id="progress-stats" class="space-y-3 text-sm border-t border-gray-200 dark:border-gray-700 pt-4"></div>
                    
                    <!-- Desktop Keyboard Shortcuts -->
                    <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <h4 class="font-semibold text-blue-800 dark:text-blue-300 mb-2 text-sm">Keyboard Shortcuts</h4>
                      <div class="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                        <div>← → Navigate questions</div>
                        <div>1-4 Select answers A-D</div>
                        <div>D Toggle doubt flag</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Question Content -->
                <div class="lg:col-span-3">
                  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-200 dark:border-gray-700">
                    <div id="question-content" class="mb-6 sm:mb-8"></div>
                    
                    <!-- Navigation Buttons -->
                    <div class="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-700">
                      <button 
                        id="prev-btn"
                        class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-200 transform hover:scale-105 font-semibold flex items-center justify-center shadow-lg order-3 sm:order-1"
                      >
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                        Previous
                      </button>
                      
                      <!-- Mobile-Friendly Doubt Toggle -->
                      <button 
                        id="doubt-toggle-btn"
                        class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-xl hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-all duration-200 transform hover:scale-105 font-semibold flex items-center justify-center border border-yellow-300 dark:border-yellow-600 order-2"
                      >
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span id="doubt-btn-text">Mark as Doubtful</span>
                      </button>
                      
                      <button 
                        id="next-btn"
                        class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 font-semibold flex items-center justify-center shadow-lg order-1 sm:order-3"
                      >
                        Next
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Submit Loading Modal -->
        <div id="submit-loading" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 hidden">
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 max-w-sm w-full mx-4 shadow-2xl border border-gray-200 dark:border-gray-700">
            <div class="text-center">
              <div class="relative mb-4 sm:mb-6">
                <div class="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                  <svg class="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <h3 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2">Submitting Your Exam</h3>
              <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">Please wait while we process your answers...</p>
              <div class="mt-4 flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500">
                <div class="animate-pulse">📊 Calculating score</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.updateQuestion();
    this.updateNavigationButtons();
    this.updateProgress();
    this.setupExamEventListeners();
    this.setupKeyboardShortcuts();
    this.setupMobileNavigation();
  }

  // ===== MOBILE NAVIGATION SETUP =====
  setupMobileNavigation() {
    const mobileToggle = document.getElementById('mobile-nav-toggle');
    const mobileOverlay = document.getElementById('mobile-nav-overlay');
    const mobilePanel = document.getElementById('mobile-nav-panel');
    const mobileClose = document.getElementById('mobile-nav-close');

    const openMobileNav = () => {
      mobileOverlay.classList.remove('hidden');
      setTimeout(() => {
        mobilePanel.classList.remove('-translate-x-full');
      }, 10);
      this.isNavigationOpen = true;
    };

    const closeMobileNav = () => {
      mobilePanel.classList.add('-translate-x-full');
      setTimeout(() => {
        mobileOverlay.classList.add('hidden');
      }, 300);
      this.isNavigationOpen = false;
    };

    mobileToggle?.addEventListener('click', openMobileNav);
    mobileClose?.addEventListener('click', closeMobileNav);
    mobileOverlay?.addEventListener('click', (e) => {
      if (e.target === mobileOverlay) {
        closeMobileNav();
      }
    });

    // Update mobile navigation content
    this.updateMobileNavigation();
  }

  updateMobileNavigation() {
    const mobileQuestionNav = document.getElementById('mobile-question-nav');
    const mobileProgressStats = document.getElementById('mobile-progress-stats');
    const mobileDoubtReviewBtn = document.getElementById('mobile-doubt-review-btn');

    if (mobileQuestionNav) {
      // Copy navigation from desktop
      const desktopNav = document.getElementById('question-nav');
      if (desktopNav) {
        mobileQuestionNav.innerHTML = desktopNav.innerHTML;
      }
    }

    if (mobileProgressStats) {
      // Copy progress stats from desktop
      const desktopStats = document.getElementById('progress-stats');
      if (desktopStats) {
        mobileProgressStats.innerHTML = desktopStats.innerHTML;
      }
    }

    // Mobile doubt review button
    mobileDoubtReviewBtn?.addEventListener('click', () => {
      this.presenter.reviewDoubtfulQuestions();
      this.closeMobileNavigation();
    });
  }

  closeMobileNavigation() {
    const mobileOverlay = document.getElementById('mobile-nav-overlay');
    const mobilePanel = document.getElementById('mobile-nav-panel');
    
    if (mobilePanel) {
      mobilePanel.classList.add('-translate-x-full');
      setTimeout(() => {
        mobileOverlay?.classList.add('hidden');
      }, 300);
    }
    this.isNavigationOpen = false;
  }

  // ===== ENHANCED UPDATE QUESTION METHOD (BUG FIX) =====
  updateQuestion() {
    const current = this.presenter.model.getCurrentQuestion();
    if (!current) return;

    const questionEl = document.getElementById('question-content');
    const counterEl = document.getElementById('question-counter');
    const doubtBtn = document.getElementById('doubt-toggle-btn');

    // Update counter
    if (counterEl) {
      counterEl.textContent = `Question ${current.index + 1} of ${current.total}`;
    }

    // Get current answer and doubt status - CRITICAL FIX
    const currentAnswer = this.presenter.model.getAnswer(current.index);
    const isDoubtful = this.presenter.model.getDoubtFlag(current.index);

    //console.log(`🔍 Question ${current.index + 1}: currentAnswer = ${currentAnswer} (type: ${typeof currentAnswer})`);

    // Render question with COMPLETELY FIXED answer selection logic
    if (questionEl) {
      questionEl.innerHTML = `
        <div class="mb-6 sm:mb-8">
          <div class="flex flex-col sm:flex-row sm:items-start justify-between mb-4 sm:mb-6">
            <h3 class="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white leading-relaxed pr-0 sm:pr-4 mb-4 sm:mb-0">
              ${current.question.question}
            </h3>
            ${isDoubtful ? `
              <div class="bg-yellow-100 dark:bg-yellow-900/30 rounded-full p-2 animate-pulse flex-shrink-0 self-start sm:self-center">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            ` : ''}
          </div>
        </div>
        <div class="space-y-3 sm:space-y-4" id="options-container">
          ${current.question.options.map((option, idx) => {
            // CRITICAL FIX: Handle all possible data types and null/undefined
            let isSelected = false;
            if (currentAnswer !== null && currentAnswer !== undefined) {
              // Convert both to strings for safe comparison
              isSelected = String(currentAnswer).trim() === String(idx).trim();
            }
            
            const optionLetter = String.fromCharCode(65 + idx);

            //console.log(`   Option ${optionLetter} (index ${idx}): isSelected = ${isSelected}, currentAnswer = "${currentAnswer}"`);

            return `
              <div class="option-wrapper" data-option-index="${idx}">
                <label 
                  class="option-label group block p-4 sm:p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg
                    ${isSelected
                      ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-lg ring-2 ring-blue-200 dark:ring-blue-800 selected-option'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10'
                    }"
                  data-question="${current.index}"
                  data-answer="${idx}"
                >
                  <div class="flex items-center">
                    <div class="relative flex-shrink-0">
                      <input 
                        type="radio" 
                        name="q${current.index}_answer" 
                        value="${idx}"
                        ${isSelected ? 'checked' : ''}
                        class="sr-only radio-input"
                      >
                      <div class="radio-indicator w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-all duration-200 flex items-center justify-center
                        ${isSelected
                          ? 'border-blue-500 bg-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                          : 'border-gray-300 dark:border-gray-500 group-hover:border-blue-400'
                        }">
                        ${isSelected ? `
                          <div class="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-pulse"></div>
                        ` : ''}
                      </div>
                    </div>
                    <div class="ml-3 sm:ml-4 flex-1">
                      <div class="flex items-center">
                        <span class="option-letter inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-bold mr-3 sm:mr-4 transition-all duration-200
                          ${isSelected
                            ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-200 dark:ring-blue-800'
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 group-hover:bg-blue-100 dark:group-hover:bg-blue-800'
                          }">
                          ${optionLetter}
                        </span>
                        <span class="text-sm sm:text-lg text-gray-800 dark:text-gray-200 font-medium leading-relaxed">${option}</span>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            `;
          }).join('')}
        </div>
      `;

      // COMPLETELY NEW EVENT HANDLING APPROACH
      this.setupOptionEventListeners(current.index);
    }

    // Update doubt button
    this.updateDoubtButton(isDoubtful);
  }

  // ===== COMPLETELY REWRITTEN EVENT HANDLING =====
  setupOptionEventListeners(questionIndex) {
    // Use event delegation for reliability
    const optionsContainer = document.getElementById('options-container');
    
    if (!optionsContainer) return;

    // Remove existing listeners
    const newContainer = optionsContainer.cloneNode(true);
    optionsContainer.parentNode.replaceChild(newContainer, optionsContainer);

    // Add single event listener to container
    newContainer.addEventListener('click', (e) => {
      // Find the clicked option
      const optionWrapper = e.target.closest('.option-wrapper');
      if (!optionWrapper) return;

      const answerIndex = parseInt(optionWrapper.dataset.optionIndex);
      
      //console.log(`🎯 Clicked option ${String.fromCharCode(65 + answerIndex)} (index: ${answerIndex}) for question ${questionIndex}`);

      // Prevent double-clicking same option
      e.preventDefault();
      e.stopPropagation();

      // Set the answer
      this.presenter.setAnswer(questionIndex, answerIndex);

      // Force immediate UI update
      this.forceUpdateSelection(questionIndex, answerIndex);
    });

    // Also handle keyboard events for accessibility
    newContainer.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const optionWrapper = e.target.closest('.option-wrapper');
        if (optionWrapper) {
          e.preventDefault();
          const answerIndex = parseInt(optionWrapper.dataset.optionIndex);
          this.presenter.setAnswer(questionIndex, answerIndex);
          this.forceUpdateSelection(questionIndex, answerIndex);
        }
      }
    });
  }

  // ===== FORCE VISUAL UPDATE =====
  forceUpdateSelection(questionIndex, selectedIndex) {
    //console.log(`🔄 Force updating selection: Q${questionIndex}, Option ${String.fromCharCode(65 + selectedIndex)}`);

    // Update all options for this question
    document.querySelectorAll('.option-wrapper').forEach((wrapper, idx) => {
      const label = wrapper.querySelector('.option-label');
      const radioIndicator = wrapper.querySelector('.radio-indicator');
      const radioInput = wrapper.querySelector('.radio-input');
      const optionLetter = wrapper.querySelector('.option-letter');

      const isSelected = idx === selectedIndex;

      // Update radio input
      if (radioInput) {
        radioInput.checked = isSelected;
      }

      // Update label classes
      if (label) {
        label.className = `option-label group block p-4 sm:p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg ${
          isSelected
            ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-lg ring-2 ring-blue-200 dark:ring-blue-800 selected-option'
            : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10'
        }`;
      }

      // Update radio indicator
      if (radioIndicator) {
        radioIndicator.className = `radio-indicator w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
          isSelected
            ? 'border-blue-500 bg-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
            : 'border-gray-300 dark:border-gray-500 group-hover:border-blue-400'
        }`;
        
        radioIndicator.innerHTML = isSelected 
          ? '<div class="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-pulse"></div>'
          : '';
      }

      // Update option letter
      if (optionLetter) {
        optionLetter.className = `option-letter inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-bold mr-3 sm:mr-4 transition-all duration-200 ${
          isSelected
            ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-200 dark:ring-blue-800'
            : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 group-hover:bg-blue-100 dark:group-hover:bg-blue-800'
        }`;
      }
    });

    // Update other UI components
    this.updateNavigationButtons();
    this.updateProgress();
  }

  updateDoubtButton(isDoubtful) {
    const doubtBtn = document.getElementById('doubt-toggle-btn');
    const doubtBtnText = document.getElementById('doubt-btn-text');
    
    if (doubtBtn && doubtBtnText) {
      if (isDoubtful) {
        doubtBtn.className = "w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 font-semibold flex items-center justify-center border-2 border-yellow-400 shadow-lg order-2";
        doubtBtnText.textContent = "Remove Doubt";
      } else {
        doubtBtn.className = "w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-xl hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-all duration-200 transform hover:scale-105 font-semibold flex items-center justify-center border border-yellow-300 dark:border-yellow-600 order-2";
        doubtBtnText.textContent = "Mark as Doubtful";
      }
    }
  }

  // ===== ENHANCED NAVIGATION BUTTONS =====
  updateNavigationButtons() {
    const stats = this.presenter.getExamStats();
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const questionNav = document.getElementById('question-nav');

    // Update prev button
    if (prevBtn) {
      prevBtn.disabled = stats.currentIndex === 0;
      prevBtn.style.opacity = stats.currentIndex === 0 ? '0.5' : '1';
    }

    // Update next button
    const isLastQuestion = stats.currentIndex === stats.totalQuestions - 1;
    if (nextBtn) {
      if (isLastQuestion) {
        nextBtn.innerHTML = `
          Finish Exam
          <svg class="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        `;
        nextBtn.className = "w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 font-semibold flex items-center justify-center shadow-lg order-1 sm:order-3";
      } else {
        nextBtn.innerHTML = `
          Next
          <svg class="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        `;
        nextBtn.className = "w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 font-semibold flex items-center justify-center shadow-lg order-1 sm:order-3";
      }
    }

    // Enhanced question navigation
    this.renderQuestionNavigation(questionNav);
    this.updateMobileNavigation();
  }

  renderQuestionNavigation(questionNav) {
    if (!questionNav) return;

    const stats = this.presenter.getExamStats();
    questionNav.innerHTML = '';
    
    for (let i = 0; i < stats.totalQuestions; i++) {
      const status = this.presenter.model.getQuestionStatus(i);
      const btn = document.createElement('button');
      btn.textContent = i + 1;

      let className = "relative p-2 sm:p-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 transform hover:scale-110 shadow-md ";

      switch (status) {
        case 'current':
          className += "bg-gradient-to-r from-blue-600 to-blue-700 text-white ring-4 ring-blue-200 dark:ring-blue-800 animate-pulse";
          break;
        case 'answered':
          className += "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700";
          break;
        case 'answered-doubt':
          className += "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600";
          btn.innerHTML = `
            ${i + 1}
            <div class="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-bounce"></div>
          `;
          break;
        case 'doubt-only':
          className += "bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-orange-600";
          btn.innerHTML = `
            ${i + 1}
            <div class="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-bounce"></div>
          `;
          break;
        default: // unanswered
          className += "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500";
      }

      btn.className = className;
      btn.onclick = () => {
        this.presenter.navigateToQuestion(i);
        this.closeMobileNavigation();
      };
      btn.title = `Question ${i + 1} - ${status.replace('-', ' ')}`;

      questionNav.appendChild(btn);
    }
  }

  // ===== ENHANCED PROGRESS UPDATE =====
  updateProgress() {
    const stats = this.presenter.getExamStats();
    const doubtfulQuestions = this.presenter.model.getDoubtfulQuestions();
    const progressEl = document.getElementById('progress-stats');

    if (progressEl) {
      const progressPercentage = Math.round((stats.answeredCount / stats.totalQuestions) * 100);

      progressEl.innerHTML = `
        <div class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 rounded-xl p-3 sm:p-4">
          <h4 class="font-bold text-gray-800 dark:text-white mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            Progress Overview
          </h4>
          
          <div class="space-y-3 sm:space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-600 dark:text-gray-400 flex items-center text-xs sm:text-sm">
                <div class="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full mr-2"></div>
                Answered:
              </span>
              <span class="font-bold text-green-600 dark:text-green-400 text-sm sm:text-lg">${stats.answeredCount}</span>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-gray-600 dark:text-gray-400 flex items-center text-xs sm:text-sm">
                <div class="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full mr-2"></div>
                Remaining:
              </span>
              <span class="font-bold text-red-600 dark:text-red-400 text-sm sm:text-lg">${stats.unansweredCount}</span>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-gray-600 dark:text-gray-400 flex items-center text-xs sm:text-sm">
                <div class="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full mr-2 animate-pulse"></div>
                Marked as Doubt:
              </span>
              <span class="font-bold text-yellow-600 dark:text-yellow-400 text-sm sm:text-lg">${doubtfulQuestions.length}</span>
            </div>
            
            <div class="mt-4 sm:mt-6">
              <div class="flex justify-between text-gray-600 dark:text-gray-400 mb-2 text-xs sm:text-sm">
                <span class="font-medium">Overall Progress:</span>
                <span class="font-bold text-sm sm:text-lg">${progressPercentage}%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-3 overflow-hidden">
                <div 
                  class="h-2 sm:h-3 rounded-full transition-all duration-500 bg-gradient-to-r from-blue-500 to-purple-500"
                  style="width: ${progressPercentage}%"
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        ${doubtfulQuestions.length > 0 ? `
          <div class="mt-3 sm:mt-4 p-3 sm:p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
            <h5 class="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center text-xs sm:text-sm">
              <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              Review These Questions
            </h5>
            <div class="flex flex-wrap gap-1 sm:gap-2">
              ${doubtfulQuestions.map(qIndex => `
                <button 
                  onclick="window.presenter?.navigateToQuestion(${qIndex})"
                  class="px-2 sm:px-3 py-1 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-lg text-xs font-medium hover:bg-yellow-300 dark:hover:bg-yellow-700 transition-colors"
                >
                  #${qIndex + 1}
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}
      `;
    }

    // Update mobile navigation
    this.updateMobileNavigation();
  }

  // ===== ENHANCED TIMER UPDATE =====
  updateTimer(timeFormatted) {
    const timerEl = document.getElementById('timer');
    const timerContainer = document.getElementById('timer-container');

    if (timerEl) {
      timerEl.textContent = timeFormatted;

      const remaining = this.presenter.model.timeRemaining;

      if (remaining <= 60) {
        timerContainer.className = "flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl border-2 border-red-400 dark:border-red-600 animate-pulse";
        timerEl.className = "font-mono font-bold text-red-600 dark:text-red-400 text-sm sm:text-lg animate-bounce";
      } else if (remaining <= 300) {
        timerContainer.className = "flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl border-2 border-yellow-400 dark:border-yellow-600";
        timerEl.className = "font-mono font-bold text-yellow-600 dark:text-yellow-400 text-sm sm:text-lg";
      } else {
        timerContainer.className = "flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl border border-red-200 dark:border-red-800";
        timerEl.className = "font-mono font-bold text-red-600 dark:text-red-400 text-sm sm:text-lg";
      }
    }
  }

  // ===== EVENT LISTENERS =====
  setupExamEventListeners() {
    // Submit button
    document.getElementById('submit-btn')?.addEventListener('click', () => {
      this.presenter.showSubmitDialog();
    });

    // Navigation buttons
    document.getElementById('prev-btn')?.addEventListener('click', () => {
      this.presenter.previousQuestion();
    });

    document.getElementById('next-btn')?.addEventListener('click', () => {
      this.presenter.nextQuestion();
    });

    // Doubt toggle button
    document.getElementById('doubt-toggle-btn')?.addEventListener('click', () => {
      this.presenter.toggleDoubtFlag();
    });

    // Review doubts button
    document.getElementById('doubt-review-btn')?.addEventListener('click', () => {
      this.presenter.reviewDoubtfulQuestions();
    });

    // Store presenter reference for navigation buttons
    window.presenter = this.presenter;
  }

  setupKeyboardShortcuts() {
    // Remove existing listener if any
    if (this.keyboardListener) {
      document.removeEventListener('keydown', this.keyboardListener);
    }

    this.keyboardListener = (e) => {
      // Only handle shortcuts when not typing in input fields and mobile nav is closed
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || this.isNavigationOpen) {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.presenter.previousQuestion();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.presenter.nextQuestion();
          break;
        case '1':
        case '2':
        case '3':
        case '4':
          e.preventDefault();
          const answerIndex = parseInt(e.key) - 1;
          const currentIndex = this.presenter.model.currentQuestionIndex;
          this.presenter.setAnswer(currentIndex, answerIndex);
          break;
        case 'd':
        case 'D':
          e.preventDefault();
          this.presenter.toggleDoubtFlag();
          break;
        case 'Escape':
          if (this.isNavigationOpen) {
            this.closeMobileNavigation();
          }
          break;
      }
    };

    document.addEventListener('keydown', this.keyboardListener);
  }

  // ===== OTHER RENDER METHODS (with responsive updates) =====
  renderResult(result) {
    // Normalize the result object
    const normalizedResult = {
      score: result.score || 0,
      total: result.total_questions || result.total || 0,
      correct: result.correct_answers || result.correct || 0,
      wrong: (result.total_questions || result.total || 0) - (result.correct_answers || result.correct || 0)
    };

    const isPassed = normalizedResult.score >= 70;
    const isExcellent = normalizedResult.score >= 90;
    const isGood = normalizedResult.score >= 80;

    this.container.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br ${isPassed ? 'from-green-50 to-blue-100 dark:from-green-900/20 dark:to-blue-900' : 'from-red-50 to-pink-100 dark:from-red-900/20 dark:to-pink-900'} flex items-center justify-center px-4 py-8">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
        <div class="text-center">
          <!-- Animated Result Icon -->
          <div class="relative mb-6 sm:mb-8">
            <div class="${isPassed ? 'bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30' : 'bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30'} rounded-full p-6 sm:p-8 w-24 h-24 sm:w-32 sm:h-32 mx-auto flex items-center justify-center ${isPassed ? 'animate-bounce' : 'animate-pulse'}">
              ${isPassed ?
                `<svg class="w-12 h-12 sm:w-20 sm:h-20 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>` :
                `<svg class="w-12 h-12 sm:w-20 sm:h-20 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>`
              }
            </div>
            ${isPassed ? `
            <div class="absolute -top-2 -right-2 sm:-top-4 sm:-right-4">
              <div class="bg-yellow-400 rounded-full p-1 sm:p-2 animate-spin">
                <svg class="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
            </div>
            ` : ''}
          </div>
          
          <!-- Result Title -->
          <h1 class="text-2xl sm:text-4xl font-bold bg-gradient-to-r ${isPassed ? 'from-green-600 to-blue-600' : 'from-red-600 to-pink-600'} bg-clip-text text-transparent mb-4">
            ${isExcellent ? '🎉 Outstanding Performance!' : isPassed ? '🎊 Congratulations!' : '📚 Keep Learning!'}
          </h1>
          <p class="text-base sm:text-xl text-gray-600 dark:text-gray-400 mb-6 sm:mb-8">
            ${isExcellent ? 'You aced the exam with flying colors!' :
              isPassed ? 'You have successfully passed the final exam!' :
                'Don\'t give up - every expert was once a beginner!'}
          </p>
          
          <!-- Enhanced Score Display -->
          <div class="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700/50 dark:to-blue-900/20 rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 border border-gray-200 dark:border-gray-600">
            <div class="text-5xl sm:text-7xl font-bold bg-gradient-to-r ${isPassed ? 'from-green-600 to-blue-600' : 'from-red-600 to-pink-600'} bg-clip-text text-transparent mb-4 sm:mb-6 ${isPassed ? 'animate-pulse' : ''}">
              ${normalizedResult.score}%
            </div>
            
            <!-- Detailed Stats -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
              <div class="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-lg border border-gray-200 dark:border-gray-700">
                <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">Total Questions</p>
                <p class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">${normalizedResult.total}</p>
              </div>
              <div class="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-lg border border-green-200 dark:border-green-700">
                <p class="text-xs sm:text-sm text-green-600 dark:text-green-400 mb-2">Correct Answers</p>
                <p class="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">${normalizedResult.correct}</p>
              </div>
              <div class="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-lg border border-red-200 dark:border-red-700">
                <p class="text-xs sm:text-sm text-red-600 dark:text-red-400 mb-2">Wrong Answers</p>
                <p class="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400">${normalizedResult.wrong}</p>
              </div>
            </div>
            
            <!-- Performance Badge -->
            <div class="mt-4 sm:mt-6">
              <span class="inline-flex items-center px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${isExcellent ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                isGood ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                  isPassed ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
              }">
                ${isExcellent ? '⭐ Excellent' : isGood ? '👍 Good' : isPassed ? '✅ Passed' : '📖 Study More'}
              </span>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a 
              href="#/course"
              class="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 font-semibold flex items-center justify-center shadow-lg text-sm sm:text-base"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              Back to Course
            </a>
            <button 
              class="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 font-semibold flex items-center justify-center shadow-lg text-sm sm:text-base"
              id="view-leaderboard-btn"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              View Leaderboard
            </button>
          </div>
        </div>
      </div>
      
      <!-- Leaderboard Loading Modal -->
      <div id="leaderboard-loading" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 hidden">
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 max-w-sm w-full mx-4 shadow-2xl">
          <div class="text-center">
            <div class="relative mb-4 sm:mb-6">
              <div class="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <svg class="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
            </div>
            <h3 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2">Loading Leaderboard</h3>
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">Fetching class rankings...</p>
          </div>
        </div>
      </div>
    </div>
  `;

    // Add event listeners
    setTimeout(() => {
      const leaderboardBtn = document.getElementById('view-leaderboard-btn');
      if (leaderboardBtn) {
        leaderboardBtn.onclick = () => this.presenter.viewLeaderboard();
      }
    }, 100);
  }

  renderLeaderboard(data) {
    const currentUserRank = data.leaderboard.findIndex(entry => entry.isCurrentUser) + 1;

    this.container.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 py-6 sm:py-8 px-4">
      <div class="max-w-6xl mx-auto">
        <!-- Enhanced Header -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 mb-6 sm:mb-8 border border-gray-200 dark:border-gray-700">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
            <div>
              <h1 class="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 sm:mb-3">Class Leaderboard</h1>
              <p class="text-lg sm:text-xl text-gray-600 dark:text-gray-400">Course: <span class="font-semibold">${this.courseId}</span></p>
            </div>
            <button 
              onclick="window.history.back()"
              class="mt-4 sm:mt-0 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back
            </button>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 sm:p-6 border border-purple-200 dark:border-purple-800">
              <div class="flex items-center mb-2">
                <div class="bg-purple-100 dark:bg-purple-900/30 rounded-full p-2 mr-3">
                  <svg class="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <p class="text-base sm:text-lg font-semibold text-purple-600 dark:text-purple-400">Your Rank</p>
              </div>
              <p class="text-2xl sm:text-4xl font-bold text-purple-800 dark:text-purple-300">
                ${currentUserRank > 0 ? `#${currentUserRank}` : 'Not Ranked'}
              </p>
            </div>
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 sm:p-6 border border-blue-200 dark:border-blue-800">
              <div class="flex items-center mb-2">
                <div class="bg-blue-100 dark:bg-blue-900/30 rounded-full p-2 mr-3">
                  <svg class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <p class="text-base sm:text-lg font-semibold text-blue-600 dark:text-blue-400">Total Participants</p>
              </div>
              <p class="text-2xl sm:text-4xl font-bold text-blue-800 dark:text-blue-300">${data.totalParticipants}</p>
            </div>
          </div>
        </div>
        
        <!-- Enhanced Leaderboard Table -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div class="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 px-6 sm:px-8 py-4 sm:py-6">
            <h2 class="text-lg sm:text-2xl font-bold text-white flex items-center">
              <svg class="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              Top Performers
            </h2>
          </div>
          
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            ${data.leaderboard.length > 0 ? data.leaderboard.map((entry, index) => `
              <div class="px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300
                ${entry.isCurrentUser ? 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-l-4 border-purple-500' : ''}">
                <div class="flex items-center space-x-3 sm:space-x-6">
                  <div class="flex-shrink-0">
                    ${entry.rank <= 3 ? `
                      <div class="relative">
                        <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-bold text-white text-lg sm:text-xl shadow-lg
                          ${entry.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                            entry.rank === 2 ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
                              'bg-gradient-to-br from-orange-400 to-orange-600'}">
                          ${entry.rank}
                        </div>
                        ${entry.rank === 1 ? `
                          <div class="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 bg-yellow-300 rounded-full flex items-center justify-center animate-bounce text-xs sm:text-sm">
                            👑
                          </div>
                        ` : ''}
                      </div>
                    ` : `
                      <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center font-bold text-lg sm:text-xl text-gray-700 dark:text-gray-300 shadow-lg">
                        ${entry.rank}
                      </div>
                    `}
                  </div>
                  <div>
                    <p class="text-base sm:text-xl font-bold text-gray-800 dark:text-white ${entry.isCurrentUser ? 'text-purple-600 dark:text-purple-400' : ''}">
                      ${entry.name} ${entry.isCurrentUser ? '(You)' : ''}
                    </p>
                    <p class="text-sm sm:text-lg text-gray-600 dark:text-gray-400">
                      Final Score: <span class="font-semibold">${entry.score}%</span>
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2 ${entry.score >= 90 ? 'text-green-600 dark:text-green-400' :
                    entry.score >= 70 ? 'text-blue-600 dark:text-blue-400' :
                      'text-gray-600 dark:text-gray-400'
                  }">
                    ${entry.score}%
                  </div>
                  <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    ${entry.score >= 90 ? 'Excellent' : entry.score >= 70 ? 'Good' : 'Needs Improvement'}
                  </div>
                </div>
              </div>
            `).join('') : `
              <div class="px-6 sm:px-8 py-12 sm:py-16 text-center">
                <div class="bg-gray-100 dark:bg-gray-700 rounded-full p-4 sm:p-6 w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6">
                  <svg class="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <h3 class="text-lg sm:text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No Results Yet</h3>
                <p class="text-sm sm:text-base text-gray-500 dark:text-gray-400">No participants have completed the exam yet.</p>
              </div>
            `}
          </div>
        </div>
        
        <!-- Enhanced Back Button -->
        <div class="mt-6 sm:mt-8 text-center">
          <a 
            href="#/course"
            class="inline-flex items-center px-6 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-bold text-base sm:text-lg shadow-lg hover:shadow-xl"
          >
            <svg class="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Back to Course Dashboard
          </a>
        </div>
      </div>
    </div>
  `;
  }

  renderNoClassPrompt() {
    this.container.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-10 border border-gray-200 dark:border-gray-700">
        <div class="text-center">
          <div class="bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-full p-6 sm:p-8 w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8 animate-bounce">
            <svg class="w-12 h-12 sm:w-16 sm:h-16 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4">Join a Class First</h2>
          <p class="text-base sm:text-xl text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed">
            You need to join a class to view the leaderboard and compare your performance with other students in your class.
          </p>
          
          <div class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-blue-200 dark:border-blue-800">
            <h3 class="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-3">Benefits of joining a class:</h3>
            <ul class="text-left space-y-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
              <li class="flex items-center">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Compare your performance with classmates
              </li>
              <li class="flex items-center">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Participate in class leaderboards
              </li>
              <li class="flex items-center">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Access to group discussions and activities
              </li>
            </ul>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a 
              href="#/profile"
              class="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-bold text-base sm:text-lg shadow-lg"
            >
              Join a Class
            </a>
            <a 
              href="#/course"
              class="px-6 sm:px-8 py-3 sm:py-4 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 font-bold text-base sm:text-lg shadow-lg"
            >
              Back to Course
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
  }

  // ===== UTILITY METHODS =====

  showSubmitLoading() {
    const loadingEl = document.getElementById('submit-loading');
    if (loadingEl) {
      loadingEl.classList.remove('hidden');
    }
  }

  hideSubmitLoading() {
    const loadingEl = document.getElementById('submit-loading');
    if (loadingEl) {
      loadingEl.classList.add('hidden');
    }
  }

  showLeaderboardLoading() {
    const loadingEl = document.getElementById('leaderboard-loading');
    if (loadingEl) {
      loadingEl.classList.remove('hidden');
    }
  }

  hideLeaderboardLoading() {
    const loadingEl = document.getElementById('leaderboard-loading');
    if (loadingEl) {
      loadingEl.classList.add('hidden');
    }
  }

  confirmSubmit(unansweredCount, doubtfulCount) {
    let message = "Are you sure you want to submit your exam?";
    const warnings = [];

    if (unansweredCount > 0) {
      warnings.push(`${unansweredCount} question(s) are unanswered`);
    }

    if (doubtfulCount > 0) {
      warnings.push(`${doubtfulCount} question(s) are marked as doubtful`);
    }

    if (warnings.length > 0) {
      message += `\n\nWarning:\n- ${warnings.join('\n- ')}`;
    }

    return window.confirm(message);
  }

  printCertificate(result) {
    // Create a new window for the certificate
    const certificateWindow = window.open('', '_blank', 'width=800,height=600');

    const certificateHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Course Completion Certificate</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Georgia', serif;
              margin: 0;
              padding: 20px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .certificate {
              background: white;
              padding: 40px;
              border-radius: 20px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
              text-align: center;
              max-width: 700px;
              width: 100%;
              border: 8px solid #f0c14b;
              position: relative;
            }
            .certificate::before {
              content: '';
              position: absolute;
              top: 15px;
              left: 15px;
              right: 15px;
              bottom: 15px;
              border: 3px solid #ddd;
              border-radius: 10px;
            }
            .header {
              color: #2c3e50;
              margin-bottom: 30px;
            }
            .title {
              font-size: clamp(32px, 6vw, 48px);
              font-weight: bold;
              color: #2980b9;
              margin-bottom: 10px;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
            }
            .subtitle {
              font-size: clamp(14px, 3vw, 18px);
              color: #7f8c8d;
              margin-bottom: 30px;
            }
            .recipient {
              font-size: clamp(24px, 5vw, 36px);
              color: #e74c3c;
              font-weight: bold;
              margin: 20px 0;
              text-decoration: underline;
            }
            .course {
              font-size: clamp(18px, 4vw, 24px);
              color: #2c3e50;
              margin: 20px 0;
              font-style: italic;
            }
            .score {
              font-size: clamp(20px, 4vw, 28px);
              color: #27ae60;
              font-weight: bold;
              margin: 20px 0;
              background: #ecf0f1;
              padding: 15px;
              border-radius: 10px;
              display: inline-block;
            }
            .date {
              color: #7f8c8d;
              margin-top: 30px;
              font-size: clamp(12px, 3vw, 16px);
            }
            .seal {
              position: absolute;
              top: 20px;
              right: 20px;
              width: clamp(60px, 10vw, 80px);
              height: clamp(60px, 10vw, 80px);
              background: #f39c12;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: clamp(10px, 2vw, 12px);
              text-align: center;
              box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }
            @media print {
              body { 
                background: white; 
                padding: 0;
              }
              .certificate { 
                box-shadow: none; 
                max-width: 100%;
                padding: 60px;
              }
            }
            @media (max-width: 768px) {
              .certificate {
                padding: 30px 20px;
                margin: 10px;
              }
              .seal {
                top: 10px;
                right: 10px;
              }
            }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="seal">
              PASSED<br>${result.score}%
            </div>
            
            <div class="header">
              <div class="title">Certificate of Achievement</div>
              <div class="subtitle">This is to certify that</div>
            </div>
            
            <div class="recipient">Student Name</div>
            
            <div class="course">
              has successfully completed the final examination for<br>
              <strong>${this.courseId}</strong>
            </div>
            
            <div class="score">
              Final Score: ${result.score}% (${result.correct}/${result.total} correct)
            </div>
            
            <div class="date">
              Issued on ${new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
          
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 1000);
            }
          </script>
        </body>
      </html>
    `;

    certificateWindow.document.write(certificateHTML);
    certificateWindow.document.close();
  }

  // ===== DEBUGGING HELPER =====
  debugCurrentState() {
    const current = this.presenter.model.getCurrentQuestion();
    if (!current) return;
    
    const currentAnswer = this.presenter.model.getAnswer(current.index);
    
    //console.log('=== DEBUG EXAM STATE ===');
    //console.log('Current Question:', current.index + 1);
    //console.log('Current Answer:', currentAnswer, '(type:', typeof currentAnswer, ')');
    //console.log('Options:', current.question.options);
    //console.log('Expected A:', 0, 'Expected B:', 1, 'Expected C:', 2, 'Expected D:', 3);
    
    // Check DOM state
    document.querySelectorAll('.option-wrapper').forEach((wrapper, idx) => {
      const isVisuallySelected = wrapper.querySelector('.option-label').classList.contains('selected-option');
      const radioChecked = wrapper.querySelector('.radio-input').checked;
      //console.log(`Option ${String.fromCharCode(65 + idx)}: visually=${isVisuallySelected}, radio=${radioChecked}, shouldBe=${String(currentAnswer) === String(idx)}`);
    });
    //console.log('========================');
  }

  // ===== TEST METHOD FOR DEBUGGING =====
  testOptionSelection() {
    //console.log('🧪 Testing option selection...');
    
    // Test selecting each option
    [0, 1, 2, 3].forEach(idx => {
      //console.log(`Testing option ${String.fromCharCode(65 + idx)} (index ${idx})`);
      const current = this.presenter.model.getCurrentQuestion();
      if (current) {
        this.presenter.setAnswer(current.index, idx);
        this.forceUpdateSelection(current.index, idx);
        
        // Verify selection
        const answer = this.presenter.model.getAnswer(current.index);
        //console.log(`✅ Set answer ${idx}, got back ${answer}`);
      }
    });
  }
  destroy() {
    if (this.keyboardListener) {
      document.removeEventListener('keydown', this.keyboardListener);
      this.keyboardListener = null;
    }
    if (window.presenter === this.presenter) {
      delete window.presenter;
    }
    // Call destroy on presenter to clean up intervals
    if (this.presenter) {
      this.presenter.destroy();
    }
    if (this.container) {
      this.container.innerHTML = '';
    }
    // Remove window resize listener
    window.removeEventListener('resize', this._detectMobile);
  }

  // ===== TOAST NOTIFICATIONS =====
  showToast(message, type = 'info') {
    showToastNotification(message, type);
  }

  showSuccess(message) {
    this.showToast(message, 'success');
  }

  showError(message) {
    this.showToast(message, 'error');
  }

  showWarning(message) {
    this.showToast(message, 'warning');
  }

  showInfo(message) {
    this.showToast(message, 'info');
  }
}

export default FinalExamPage;