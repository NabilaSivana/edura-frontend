import FinalExamModel from "./final-exam-model.js";
import { showToastNotification } from "../../../utils/index.js";

class FinalExamPresenter {
  constructor() {
    this.model = new FinalExamModel();
    this.view = null;
    this.timerInterval = null;
    this.autoSaveInterval = null;
  }

  async init(courseId) {
    try {
      console.log("Initializing Final Exam for course:", courseId);

      // Load exam data from database
      const result = await this.model.loadExam(courseId);

      if (!result.success) {
        throw new Error(result.error);
      }

      console.log("Final Exam loaded successfully:", result.message);
      return {
        success: true,
        examData: this.model.examData,
        message: result.message,
      };
    } catch (error) {
      console.error("Error initializing Final Exam:", error);
      return {
        success: false,
        error: error.message || "Failed to initialize final exam",
      };
    }
  }

  async checkExamStatus(courseId) {
    try {
      const result = await this.model.checkExamStatus(courseId);
      return result;
    } catch (error) {
      console.error("Error checking exam status:", error);
      return {
        ready: false,
        error: error.message || "Failed to check exam status",
      };
    }
  }

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

  startExam() {
    if (this.model.startExam()) {
      this.startTimer();
      this.startAutoSave();

      showToastNotification(
        "Final exam dimulai. Selamat mengerjakan!",
        "success"
      );
      return true;
    }
    return false;
  }

  startTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.timerInterval = setInterval(() => {
      const timeRemaining = this.model.updateTimer();

      if (this.view && this.view.updateTimer) {
        this.view.updateTimer(this.model.formatTime(timeRemaining));
      }

      // Auto-submit when time runs out
      if (timeRemaining <= 0) {
        this.timeUp();
      }

      // Warning notifications
      if (timeRemaining === 300) {
        // 5 minutes
        showToastNotification("Waktu tersisa 5 menit!", "warning");
      } else if (timeRemaining === 60) {
        // 1 minute
        showToastNotification("Waktu tersisa 1 menit!", "warning");
      }
    }, 1000);
  }

  startAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }

    // Auto-save answers every 30 seconds
    this.autoSaveInterval = setInterval(() => {
      this.saveProgress();
    }, 30000);
  }

  saveProgress() {
    try {
      const progressData = {
        courseId: this.model.courseId,
        answers: this.model.answers,
        currentQuestionIndex: this.model.currentQuestionIndex,
        timeRemaining: this.model.timeRemaining,
        timestamp: Date.now(),
      };

      // Use in-memory storage instead of localStorage
      if (typeof window !== "undefined") {
        window.finalExamProgress = window.finalExamProgress || {};
        window.finalExamProgress[this.model.courseId] = progressData;
      }
    } catch (error) {
      console.warn("Failed to save progress:", error);
    }
  }

  loadProgress(courseId) {
    try {
      if (typeof window !== "undefined" && window.finalExamProgress) {
        const savedProgress = window.finalExamProgress[courseId];

        if (savedProgress) {
          // Check if progress is not too old (within 6 hours)
          const hoursSinceLastSave =
            (Date.now() - savedProgress.timestamp) / (1000 * 60 * 60);
          if (hoursSinceLastSave < 6) {
            return savedProgress;
          }
        }
      }
    } catch (error) {
      console.warn("Failed to load progress:", error);
    }
    return null;
  }

  clearProgress(courseId) {
    try {
      if (typeof window !== "undefined" && window.finalExamProgress) {
        delete window.finalExamProgress[courseId];
      }
    } catch (error) {
      console.warn("Failed to clear progress:", error);
    }
  }

  async timeUp() {
    showToastNotification(
      "Waktu habis! Ujian akan otomatis disubmit.",
      "warning"
    );
    await this.submitExam();
  }

  getCurrentQuestion() {
    return this.model.getCurrentQuestion();
  }

  setAnswer(questionIndex, answer) {
    this.model.setAnswer(questionIndex, answer);

    // Update view if needed
    if (this.view && this.view.updateQuestionStatus) {
      this.view.updateQuestionStatus();
    }

    // Save progress
    this.saveProgress();
  }

  getAnswer(questionIndex) {
    return this.model.getAnswer(questionIndex);
  }

  nextQuestion() {
    if (this.model.nextQuestion()) {
      if (this.view && this.view.renderCurrentQuestion) {
        this.view.renderCurrentQuestion();
      }
      return true;
    }
    return false;
  }

  previousQuestion() {
    if (this.model.previousQuestion()) {
      if (this.view && this.view.renderCurrentQuestion) {
        this.view.renderCurrentQuestion();
      }
      return true;
    }
    return false;
  }

  goToQuestion(index) {
    if (this.model.goToQuestion(index)) {
      if (this.view && this.view.renderCurrentQuestion) {
        this.view.renderCurrentQuestion();
      }
      return true;
    }
    return false;
  }

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

  async submitExam() {
    try {
      // Stop timers
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
      if (this.autoSaveInterval) {
        clearInterval(this.autoSaveInterval);
        this.autoSaveInterval = null;
      }

      // Show loading
      if (this.view && this.view.showSubmitLoading) {
        this.view.showSubmitLoading(true);
      }

      showToastNotification("Submitting final exam...", "info");

      const result = await this.model.submitExam();

      if (result.success) {
        // Clear saved progress
        this.clearProgress(this.model.courseId);

        showToastNotification("Final exam berhasil disubmit!", "success");

        // Calculate local score for immediate feedback
        const localScore = this.model.calculateScore();

        // Show result or redirect
        if (this.view && this.view.showResult) {
          this.view.showResult(
            result.result || {
              score: localScore.correct,
              total_score: localScore.total,
              correct_answers: localScore.correct,
              wrong_answers: localScore.total - localScore.correct,
              total_questions: localScore.total,
              percentage: localScore.percentage,
            }
          );
        } else {
          // Fallback: redirect to course page
          setTimeout(() => {
            window.location.hash = "#/course";
          }, 2000);
        }

        return result;
      } else {
        throw new Error(result.error);
      }
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
      if (this.view && this.view.showSubmitLoading) {
        this.view.showSubmitLoading(false);
      }
    }
  }

  async getExamResult() {
    try {
      const result = await this.model.getExamResult();
      return result;
    } catch (error) {
      console.error("Error getting exam result:", error);
      return {
        success: false,
        error: error.message || "Failed to get exam result",
      };
    }
  }

  setView(view) {
    this.view = view;
  }

  destroy() {
    // Clean up timers and intervals
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }

    // Reset model
    this.model.reset();

    // Clear view reference
    this.view = null;
  }
}

export default FinalExamPresenter;
