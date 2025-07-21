// import FinalExamModel from "./final-exam-model.js";
// import { showToastNotification } from "../../../utils/index.js";

// class FinalExamPresenter {
//   constructor() {
//     this.model = new FinalExamModel();
//     this.view = null;
//     this.timerInterval = null;
//     this.autoSaveInterval = null;
//   }

//   async init(courseId) {
//     try {
//       console.log("Initializing Final Exam for course:", courseId);

//       // Load exam data from database
//       const result = await this.model.loadExam(courseId);

//       if (!result.success) {
//         throw new Error(result.error);
//       }

//       console.log("Final Exam loaded successfully:", result.message);

//       // TAMBAH: Cek apakah ada saved progress
//       const savedProgress = this.loadProgress(courseId);

//       return {
//         success: true,
//         examData: this.model.examData,
//         message: result.message,
//         hasSavedProgress: !!savedProgress, // Informasi apakah ada progress tersimpan
//         savedProgress: savedProgress,
//       };
//     } catch (error) {
//       console.error("Error initializing Final Exam:", error);
//       return {
//         success: false,
//         error: error.message || "Failed to initialize final exam",
//       };
//     }
//   }

//   async checkExamStatus(courseId) {
//     try {
//       const result = await this.model.checkExamStatus(courseId);
//       return result;
//     } catch (error) {
//       console.error("Error checking exam status:", error);
//       return {
//         ready: false,
//         error: error.message || "Failed to check exam status",
//       };
//     }
//   }

//   async generateExam(courseId) {
//     try {
//       showToastNotification("Generating final exam...", "info");

//       const result = await this.model.generateExam(courseId);

//       if (result.success) {
//         showToastNotification("Final exam berhasil digenerate!", "success");
//         return result;
//       } else {
//         throw new Error(result.error);
//       }
//     } catch (error) {
//       console.error("Error generating final exam:", error);
//       showToastNotification(
//         "Gagal generate final exam: " + error.message,
//         "error"
//       );
//       return {
//         success: false,
//         error: error.message || "Failed to generate final exam",
//       };
//     }
//   }

//   startExam() {
//     if (this.model.startExam()) {
//       this.startTimer();
//       this.startAutoSave();

//       showToastNotification(
//         "Final exam dimulai. Selamat mengerjakan!",
//         "success"
//       );
//       return true;
//     }
//     return false;
//   }

//   startTimer() {
//     if (this.timerInterval) {
//       clearInterval(this.timerInterval);
//     }

//     this.timerInterval = setInterval(() => {
//       const timeRemaining = this.model.updateTimer();

//       if (this.view && this.view.updateTimer) {
//         this.view.updateTimer(this.model.formatTime(timeRemaining));
//       }

//       // Auto-submit when time runs out
//       if (timeRemaining <= 0) {
//         this.timeUp();
//       }

//       // Warning notifications
//       if (timeRemaining === 300) {
//         // 5 minutes
//         showToastNotification("Waktu tersisa 5 menit!", "warning");
//       } else if (timeRemaining === 60) {
//         // 1 minute
//         showToastNotification("Waktu tersisa 1 menit!", "warning");
//       }
//     }, 1000);
//   }

//   startAutoSave() {
//     if (this.autoSaveInterval) {
//       clearInterval(this.autoSaveInterval);
//     }

//     // Auto-save answers every 30 seconds
//     this.autoSaveInterval = setInterval(() => {
//       this.saveProgress();
//     }, 30000);
//   }

//   saveProgress() {
//     try {
//       const progressData = {
//         courseId: this.model.courseId,
//         answers: this.model.answers,
//         currentQuestionIndex: this.model.currentQuestionIndex,
//         timeRemaining: this.model.timeRemaining,
//         timestamp: Date.now(),
//         examStatus: this.model.examStatus,
//       };

//       // GANTI: Gunakan sessionStorage untuk persistent storage
//       if (typeof window !== "undefined" && window.sessionStorage) {
//         const storageKey = `finalExamProgress_${this.model.courseId}`;
//         sessionStorage.setItem(storageKey, JSON.stringify(progressData));
//         console.log("Progress saved:", progressData); // Debug
//       }

//       // FALLBACK: Tetap simpan di memory juga
//       window.finalExamProgress = window.finalExamProgress || {};
//       window.finalExamProgress[this.model.courseId] = progressData;
//     } catch (error) {
//       console.warn("Failed to save progress:", error);
//     }
//   }
//   loadProgress(courseId) {
//     try {
//       if (typeof window !== "undefined") {
//         const storageKey = `finalExamProgress_${courseId}`;

//         // PRIORITAS 1: Coba load dari sessionStorage
//         if (window.sessionStorage) {
//           const savedData = sessionStorage.getItem(storageKey);
//           if (savedData) {
//             const progressData = JSON.parse(savedData);

//             // Check if progress masih valid (dalam 6 jam)
//             const hoursSinceLastSave =
//               (Date.now() - progressData.timestamp) / (1000 * 60 * 60);
//             if (hoursSinceLastSave < 6 && progressData.timeRemaining > 0) {
//               console.log("Progress loaded from sessionStorage:", progressData); // Debug
//               return progressData;
//             } else {
//               // Hapus data yang expired
//               sessionStorage.removeItem(storageKey);
//             }
//           }
//         }

//         // FALLBACK: Coba load dari memory
//         if (window.finalExamProgress && window.finalExamProgress[courseId]) {
//           const savedProgress = window.finalExamProgress[courseId];
//           const hoursSinceLastSave =
//             (Date.now() - savedProgress.timestamp) / (1000 * 60 * 60);
//           if (hoursSinceLastSave < 6 && savedProgress.timeRemaining > 0) {
//             return savedProgress;
//           }
//         }
//       }
//     } catch (error) {
//       console.warn("Failed to load progress:", error);
//     }
//     return null;
//   }
//   clearProgress(courseId) {
//     try {
//       if (typeof window !== "undefined") {
//         const storageKey = `finalExamProgress_${courseId}`;

//         // Hapus dari sessionStorage
//         if (window.sessionStorage) {
//           sessionStorage.removeItem(storageKey);
//         }

//         // Hapus dari memory
//         if (window.finalExamProgress) {
//           delete window.finalExamProgress[courseId];
//         }

//         console.log("Progress cleared for course:", courseId); // Debug
//       }
//     } catch (error) {
//       console.warn("Failed to clear progress:", error);
//     }
//   }

//   async timeUp() {
//     showToastNotification(
//       "Waktu habis! Ujian akan otomatis disubmit.",
//       "warning"
//     );
//     await this.submitExam();
//   }

//   getCurrentQuestion() {
//     return this.model.getCurrentQuestion();
//   }

//   setAnswer(questionIndex, answer) {
//     this.model.setAnswer(questionIndex, answer);

//     // Update view if needed
//     if (this.view && this.view.updateQuestionStatus) {
//       this.view.updateQuestionStatus();
//     }

//     // PENTING: Save progress setiap kali jawab (jangan tunggu 30 detik)
//     this.saveProgress();
//   }

//   getAnswer(questionIndex) {
//     return this.model.getAnswer(questionIndex);
//   }

//   nextQuestion() {
//     if (this.model.nextQuestion()) {
//       if (this.view && this.view.renderCurrentQuestion) {
//         this.view.renderCurrentQuestion();
//       }
//       return true;
//     }
//     return false;
//   }

//   previousQuestion() {
//     if (this.model.previousQuestion()) {
//       if (this.view && this.view.renderCurrentQuestion) {
//         this.view.renderCurrentQuestion();
//       }
//       return true;
//     }
//     return false;
//   }

//   goToQuestion(index) {
//     if (this.model.goToQuestion(index)) {
//       if (this.view && this.view.renderCurrentQuestion) {
//         this.view.renderCurrentQuestion();
//       }
//       return true;
//     }
//     return false;
//   }

//   getExamStats() {
//     const totalQuestions = this.model.examData ? this.model.examData.length : 0;
//     const answeredQuestions = this.model.getAnsweredQuestions();
//     const unansweredQuestions = this.model.getUnansweredQuestions();

//     return {
//       totalQuestions: totalQuestions,
//       answeredQuestions: answeredQuestions.length,
//       unansweredQuestions: unansweredQuestions.length,
//       currentQuestion: this.model.currentQuestionIndex + 1,
//       timeRemaining: this.model.timeRemaining || 0,
//       timeFormatted: this.model.formatTime(this.model.timeRemaining || 0),
//       isComplete: this.model.isExamComplete(),
//       examStatus: this.model.examStatus,
//     };
//   }

//   // Perbaikan untuk method submitExam di FinalExamPresenter

//   async submitExam() {
//     try {
//       // Stop timers
//       if (this.timerInterval) {
//         clearInterval(this.timerInterval);
//         this.timerInterval = null;
//       }
//       if (this.autoSaveInterval) {
//         clearInterval(this.autoSaveInterval);
//         this.autoSaveInterval = null;
//       }

//       // Show loading
//       if (this.view && this.view.showSubmitLoading) {
//         this.view.showSubmitLoading(true);
//       }

//       showToastNotification("Submitting final exam...", "info");

//       const result = await this.model.submitExam();

//       if (result.success) {
//         // Clear saved progress
//         this.clearProgress(this.model.courseId);

//         showToastNotification("Final exam berhasil disubmit!", "success");

//         // Get exam result from server
//         const resultResponse = await this.model.getExamResult();

//         let finalResult;
//         if (resultResponse.success) {
//           finalResult = resultResponse.result;
//         } else {
//           // Fallback: Calculate local score if server result fails
//           const localScore = this.model.calculateScore();
//           finalResult = {
//             score: localScore.correct,
//             total_score: localScore.total,
//             correct_answers: localScore.correct,
//             wrong_answers: localScore.total - localScore.correct,
//             total_questions: localScore.total,
//             percentage: localScore.percentage,
//           };
//         }

//         // Validate result data before showing
//         if (!this.validateResultData(finalResult)) {
//           console.warn(
//             "Invalid result data, using local calculation:",
//             finalResult
//           );
//           const localScore = this.model.calculateScore();
//           finalResult = {
//             score: localScore.correct,
//             total_score: localScore.total,
//             correct_answers: localScore.correct,
//             wrong_answers: localScore.total - localScore.correct,
//             total_questions: localScore.total,
//             percentage: localScore.percentage,
//           };
//         }

//         console.log("Final result to display:", finalResult); // Debug log

//         // Show result
//         if (this.view && this.view.showResult) {
//           this.view.showResult(finalResult);
//         } else {
//           // Fallback: redirect to course page
//           setTimeout(() => {
//             window.location.hash = "#/course";
//           }, 2000);
//         }

//         return {
//           success: true,
//           result: finalResult,
//         };
//       } else {
//         throw new Error(result.error);
//       }
//     } catch (error) {
//       console.error("Error submitting final exam:", error);
//       showToastNotification(
//         "Gagal submit final exam: " + error.message,
//         "error"
//       );
//       return {
//         success: false,
//         error: error.message || "Failed to submit final exam",
//       };
//     } finally {
//       if (this.view && this.view.showSubmitLoading) {
//         this.view.showSubmitLoading(false);
//       }
//     }
//   }

//   // Helper method untuk validate result data
//   validateResultData(result) {
//     if (!result || typeof result !== "object") {
//       return false;
//     }

//     // Check if required numeric fields are valid numbers
//     const numericFields = [
//       "score",
//       "total_questions",
//       "correct_answers",
//       "percentage",
//     ];

//     for (const field of numericFields) {
//       if (
//         result[field] === undefined ||
//         result[field] === null ||
//         isNaN(Number(result[field]))
//       ) {
//         console.warn(`Invalid ${field}:`, result[field]);
//         return false;
//       }
//     }

//     return true;
//   }

//   async getExamResult() {
//     try {
//       const result = await this.model.getExamResultModel();
//       console.log("data setelah diolah:", result);
//       return result;
//     } catch (error) {
//       console.error("Error getting exam result:", error);
//       return {
//         success: false,
//         error: error.message || "Failed to get exam result",
//       };
//     }
//   }

//   setView(view) {
//     this.view = view;
//   }

//   destroy() {
//     // Clean up timers and intervals
//     if (this.timerInterval) {
//       clearInterval(this.timerInterval);
//       this.timerInterval = null;
//     }
//     if (this.autoSaveInterval) {
//       clearInterval(this.autoSaveInterval);
//       this.autoSaveInterval = null;
//     }

//     // Reset model
//     this.model.reset();

//     // Clear view reference
//     this.view = null;
//   }

// }

// export default FinalExamPresenter;
import FinalExamModel from "./final-exam-model.js";
import { showToastNotification } from "../../../utils/index.js";

/**
 * FinalExamPresenter - Handles UI interaction and business logic
 * Responsibilities:
 * - Coordinate between Model and View
 * - Handle exam lifecycle
 * - Manage timers and auto-save
 * - Progress management
 * - Result processing
 */
class FinalExamPresenter {
  constructor() {
    this.model = new FinalExamModel();
    this.view = null;
    this.timerInterval = null;
    this.autoSaveInterval = null;

    // Configuration
    this.AUTO_SAVE_INTERVAL = 30000; // 30 seconds
    this.PROGRESS_EXPIRY_HOURS = 6;
    this.WARNING_TIMES = {
      FIVE_MINUTES: 300,
      ONE_MINUTE: 60,
    };
  }

  // ===== INITIALIZATION METHODS =====

  /**
   * Initialize exam for a course
   */
  async init(courseId) {
    try {
      console.log("Initializing Final Exam for course:", courseId);

      const result = await this.model.loadExam(courseId);

      if (!result.success) {
        throw new Error(result.error);
      }

      console.log("Final Exam loaded successfully:", result.message);

      const savedProgress = this._loadProgress(courseId);

      return {
        success: true,
        examData: this.model.examData,
        message: result.message,
        hasSavedProgress: !!savedProgress,
        savedProgress: savedProgress,
      };
    } catch (error) {
      console.error("Error initializing Final Exam:", error);
      return {
        success: false,
        error: error.message || "Failed to initialize final exam",
      };
    }
  }

  /**
   * Check exam status
   */
  async checkExamStatus(courseId) {
    try {
      return await this.model.checkExamStatus(courseId);
    } catch (error) {
      console.error("Error checking exam status:", error);
      return {
        ready: false,
        error: error.message || "Failed to check exam status",
      };
    }
  }

  /**
   * Generate new exam
   */
  async generateExam(courseId) {
    try {
      showToastNotification("Generating final exam...", "info");

      const result = await this.model.generateExam(courseId);

      if (result.success) {
        showToastNotification("Final exam berhasil digenerate!", "success");
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error generating final exam:", error);
      showToastNotification(
        "Gagal generate final exam: " + error.message,
        "error"
      );
      return {
        success: false,
        error: error.message || "Failed to generate final exam",
      };
    }
  }

  /**
   * Set view reference
   */
  setView(view) {
    this.view = view;
  }

  // ===== EXAM CONTROL METHODS =====

  /**
   * Start the exam
   */
  startExam() {
    if (this.model.startExam()) {
      this._startTimer();
      this._startAutoSave();

      showToastNotification(
        "Final exam dimulai. Selamat mengerjakan!",
        "success"
      );
      return true;
    }
    return false;
  }

  /**
   * Submit exam
   */
  async submitExam() {
    try {
      this._stopAllTimers();
      this._showSubmitLoading(true);

      showToastNotification("Submitting final exam...", "info");

      const result = await this.model.submitExam();

      if (!result.success) {
        throw new Error(result.error);
      }

      this._clearProgress(this.model.courseId);
      showToastNotification("Final exam berhasil disubmit!", "success");

      const finalResult = await this._getFinalResult();
      this._showResult(finalResult);

      return {
        success: true,
        result: finalResult,
      };
    } catch (error) {
      console.error("Error submitting final exam:", error);
      showToastNotification(
        "Gagal submit final exam: " + error.message,
        "error"
      );
      return {
        success: false,
        error: error.message || "Failed to submit final exam",
      };
    } finally {
      this._showSubmitLoading(false);
    }
  }

  /**
   * Handle time up scenario
   */
  async timeUp() {
    showToastNotification(
      "Waktu habis! Ujian akan otomatis disubmit.",
      "warning"
    );
    await this.submitExam();
  }

  // ===== NAVIGATION METHODS =====

  /**
   * Get current question
   */
  getCurrentQuestion() {
    return this.model.getCurrentQuestion();
  }

  /**
   * Navigate to next question
   */
  nextQuestion() {
    if (this.model.nextQuestion()) {
      this._updateViewQuestion();
      return true;
    }
    return false;
  }

  /**
   * Navigate to previous question
   */
  previousQuestion() {
    if (this.model.previousQuestion()) {
      this._updateViewQuestion();
      return true;
    }
    return false;
  }

  /**
   * Go to specific question
   */
  goToQuestion(index) {
    if (this.model.goToQuestion(index)) {
      this._updateViewQuestion();
      return true;
    }
    return false;
  }

  // ===== ANSWER MANAGEMENT METHODS =====

  /**
   * Set answer for question
   */
  setAnswer(questionIndex, answer) {
    this.model.setAnswer(questionIndex, answer);
    this._updateQuestionStatus();
    this._saveProgress(); // Save immediately after answering
  }

  /**
   * Get answer for question
   */
  getAnswer(questionIndex) {
    return this.model.getAnswer(questionIndex);
  }

  // ===== PROGRESS MANAGEMENT METHODS =====

  /**
   * Restore progress from saved data
   */
  restoreProgress(progressData) {
    try {
      if (!progressData || !this._isValidProgressData(progressData)) {
        console.warn("Invalid progress data:", progressData);
        return false;
      }

      // Restore model state
      this.model.answers = progressData.answers || {};
      this.model.currentQuestionIndex = progressData.currentQuestionIndex || 0;
      this.model.timeRemaining = progressData.timeRemaining || 0;
      this.model.examStatus = progressData.examStatus || "ready";

      console.log("Progress restored successfully:", progressData);
      return true;
    } catch (error) {
      console.error("Error restoring progress:", error);
      return false;
    }
  }

  // ===== STATISTICS METHODS =====

  /**
   * Get exam statistics
   */
  getExamStats() {
    const totalQuestions = this.model.examData ? this.model.examData.length : 0;
    const answeredQuestions = this.model.getAnsweredQuestions();
    const unansweredQuestions = this.model.getUnansweredQuestions();

    return {
      totalQuestions: totalQuestions,
      answeredQuestions: answeredQuestions.length,
      unansweredQuestions: unansweredQuestions.length,
      currentQuestion: this.model.currentQuestionIndex + 1,
      timeRemaining: this.model.timeRemaining || 0,
      timeFormatted: this.model.formatTime(this.model.timeRemaining || 0),
      isComplete: this.model.isExamComplete(),
      examStatus: this.model.examStatus,
    };
  }

  // ===== RESULT METHODS =====

  /**
   * Get exam result - FIXED METHOD NAME
   */
  async getExamResult() {
    try {
      const result = await this.model.getExamResult(); // Fixed: was getExamResultModel
      console.log("Data setelah diolah:", result);
      return result;
    } catch (error) {
      console.error("Error getting exam result:", error);
      return {
        success: false,
        error: error.message || "Failed to get exam result",
      };
    }
  }

  // ===== CLEANUP METHODS =====

  /**
   * Destroy presenter and clean up resources
   */
  destroy() {
    this._stopAllTimers();
    this.model.reset();
    this.view = null;
  }

  // ===== PRIVATE TIMER METHODS =====

  /**
   * Start exam timer
   */
  _startTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.timerInterval = setInterval(() => {
      const timeRemaining = this.model.updateTimer();

      this._updateViewTimer(timeRemaining);
      this._checkTimeWarnings(timeRemaining);

      if (timeRemaining <= 0) {
        this.timeUp();
      }
    }, 1000);
  }

  /**
   * Start auto-save timer
   */
  _startAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }

    this.autoSaveInterval = setInterval(() => {
      this._saveProgress();
    }, this.AUTO_SAVE_INTERVAL);
  }

  /**
   * Stop all timers
   */
  _stopAllTimers() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }

  /**
   * Check and show time warnings
   */
  _checkTimeWarnings(timeRemaining) {
    if (timeRemaining === this.WARNING_TIMES.FIVE_MINUTES) {
      showToastNotification("Waktu tersisa 5 menit!", "warning");
    } else if (timeRemaining === this.WARNING_TIMES.ONE_MINUTE) {
      showToastNotification("Waktu tersisa 1 menit!", "warning");
    }
  }

  // ===== PRIVATE PROGRESS METHODS =====

  /**
   * Save progress to storage
   */
  _saveProgress() {
    try {
      const progressData = this._createProgressData();

      // Try to save to sessionStorage first
      this._saveToSessionStorage(progressData);

      // Fallback to memory
      this._saveToMemory(progressData);

      console.log("Progress saved:", progressData);
    } catch (error) {
      console.warn("Failed to save progress:", error);
    }
  }

  /**
   * Load progress from storage
   */
  _loadProgress(courseId) {
    try {
      // Try sessionStorage first
      let progressData = this._loadFromSessionStorage(courseId);

      // Fallback to memory
      if (!progressData) {
        progressData = this._loadFromMemory(courseId);
      }

      if (progressData && this._isValidProgressData(progressData)) {
        console.log("Progress loaded:", progressData);
        return progressData;
      }
    } catch (error) {
      console.warn("Failed to load progress:", error);
    }
    return null;
  }

  /**
   * Clear progress from storage
   */
  _clearProgress(courseId) {
    try {
      const storageKey = `finalExamProgress_${courseId}`;

      // Clear from sessionStorage
      if (typeof window !== "undefined" && window.sessionStorage) {
        sessionStorage.removeItem(storageKey);
      }

      // Clear from memory
      if (typeof window !== "undefined" && window.finalExamProgress) {
        delete window.finalExamProgress[courseId];
      }

      console.log("Progress cleared for course:", courseId);
    } catch (error) {
      console.warn("Failed to clear progress:", error);
    }
  }

  /**
   * Create progress data object
   */
  _createProgressData() {
    return {
      courseId: this.model.courseId,
      answers: this.model.answers,
      currentQuestionIndex: this.model.currentQuestionIndex,
      timeRemaining: this.model.timeRemaining,
      timestamp: Date.now(),
      examStatus: this.model.examStatus,
    };
  }

  /**
   * Save to sessionStorage
   */
  _saveToSessionStorage(progressData) {
    if (typeof window !== "undefined" && window.sessionStorage) {
      const storageKey = `finalExamProgress_${this.model.courseId}`;
      sessionStorage.setItem(storageKey, JSON.stringify(progressData));
    }
  }

  /**
   * Save to memory as fallback
   */
  _saveToMemory(progressData) {
    if (typeof window !== "undefined") {
      window.finalExamProgress = window.finalExamProgress || {};
      window.finalExamProgress[this.model.courseId] = progressData;
    }
  }

  /**
   * Load from sessionStorage
   */
  _loadFromSessionStorage(courseId) {
    if (typeof window !== "undefined" && window.sessionStorage) {
      const storageKey = `finalExamProgress_${courseId}`;
      const savedData = sessionStorage.getItem(storageKey);

      if (savedData) {
        const progressData = JSON.parse(savedData);
        if (this._isProgressValid(progressData)) {
          return progressData;
        } else {
          sessionStorage.removeItem(storageKey);
        }
      }
    }
    return null;
  }

  /**
   * Load from memory
   */
  _loadFromMemory(courseId) {
    if (typeof window !== "undefined" && window.finalExamProgress?.[courseId]) {
      const progressData = window.finalExamProgress[courseId];
      if (this._isProgressValid(progressData)) {
        return progressData;
      }
    }
    return null;
  }

  /**
   * Check if progress is still valid (not expired)
   */
  _isProgressValid(progressData) {
    const hoursSinceLastSave =
      (Date.now() - progressData.timestamp) / (1000 * 60 * 60);
    return (
      hoursSinceLastSave < this.PROGRESS_EXPIRY_HOURS &&
      progressData.timeRemaining > 0
    );
  }

  /**
   * Validate progress data structure
   */
  _isValidProgressData(progressData) {
    return (
      progressData &&
      typeof progressData === "object" &&
      progressData.courseId &&
      progressData.answers &&
      typeof progressData.currentQuestionIndex === "number" &&
      typeof progressData.timeRemaining === "number" &&
      progressData.timestamp
    );
  }

  // ===== PRIVATE RESULT METHODS =====

  /**
   * Get final result for display
   */
  async _getFinalResult() {
    try {
      const resultResponse = await this.model.getExamResult();

      if (
        resultResponse.success &&
        this._validateResultData(resultResponse.result)
      ) {
        return resultResponse.result;
      }

      // Fallback to local calculation
      console.warn("Using local score calculation as fallback");
      return this._createFallbackResult();
    } catch (error) {
      console.error("Error getting final result:", error);
      return this._createFallbackResult();
    }
  }

  /**
   * Create fallback result from local calculation
   */
  _createFallbackResult() {
    const localScore = this.model.calculateScore();
    return {
      score: localScore.correct,
      total_score: localScore.total,
      correct_answers: localScore.correct,
      wrong_answers: localScore.total - localScore.correct,
      total_questions: localScore.total,
      percentage: localScore.percentage,
    };
  }

  /**
   * Validate result data
   */
  _validateResultData(result) {
    if (!result || typeof result !== "object") {
      return false;
    }

    const numericFields = [
      "score",
      "total_questions",
      "correct_answers",
      "percentage",
    ];

    for (const field of numericFields) {
      if (
        result[field] === undefined ||
        result[field] === null ||
        isNaN(Number(result[field]))
      ) {
        console.warn(`Invalid ${field}:`, result[field]);
        return false;
      }
    }

    return true;
  }

  // ===== PRIVATE VIEW METHODS =====

  /**
   * Update view timer
   */
  _updateViewTimer(timeRemaining) {
    if (this.view?.updateTimer) {
      this.view.updateTimer(this.model.formatTime(timeRemaining));
    }
  }

  /**
   * Update view question
   */
  _updateViewQuestion() {
    if (this.view?.renderCurrentQuestion) {
      this.view.renderCurrentQuestion();
    }
  }

  /**
   * Update question status in view
   */
  _updateQuestionStatus() {
    if (this.view?.updateQuestionStatus) {
      this.view.updateQuestionStatus();
    }
  }

  /**
   * Show submit loading state
   */
  _showSubmitLoading(loading) {
    if (this.view?.showSubmitLoading) {
      this.view.showSubmitLoading(loading);
    }
  }

  /**
   * Show result in view
   */
  _showResult(result) {
    if (this.view?.showResult) {
      this.view.showResult(result);
    } else {
      // Fallback: redirect to course page
      setTimeout(() => {
        window.location.hash = "#/course";
      }, 2000);
    }
  }
}

export default FinalExamPresenter;
