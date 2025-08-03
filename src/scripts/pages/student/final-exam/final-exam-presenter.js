import { showToastNotification } from "../../../utils/index.js";

class FinalExamPresenter {
  constructor(model) {
    this.model = model;
    this.view = null;
    this.timerInterval = null;
    this.autoSaveInterval = null;
    this.pollingInterval = null;

    // Configuration
    this.AUTO_SAVE_INTERVAL = 30000; // 30 seconds
    this.POLLING_INTERVAL = 3000; // 3 seconds
    this.STORAGE_KEY_PREFIX = 'finalExam_';
  }

  setView(view) {
    this.view = view;
  }

  // ===== INITIALIZATION =====

  async initialize(courseId) {
    try {
      const result = await this.model.initialize(courseId);

      if (!result.success) {
        this.view.renderError(result.error);
        return;
      }

      switch (result.status) {
        case 'completed':
          this.view.renderResult(result.result);
          break;

        case 'ready':
          const savedProgress = this.loadProgress();
          if (savedProgress && this._isValidProgress(savedProgress)) {
            this.view.renderResumeDialog(savedProgress);
          } else {
            this.view.renderStartExam();
          }
          break;

        case 'generating':
          this.startPolling();
          this.view.renderGenerating();
          break;

        case 'not_generated':
          this.view.renderGeneratePrompt();
          break;

        default:
          this.view.renderError('Unknown exam status');
      }
    } catch (error) {
      this.view.renderError(error.message);
    }
  }

  // ===== EXAM GENERATION =====

  async generateExam() {
    try {
      // Check network connection
      if (!navigator.onLine) {
        showToastNotification('❌ Internet connection required to generate exam', 'error');
        return;
      }

      showToastNotification('🚀 Generating your personalized exam...', 'info');
      this.view.renderGenerating();

      const result = await this.model.generateExam();
      if (!result.success) {
        throw new Error(result.error);
      }

      this.startPolling();
    } catch (error) {
      showToastNotification(`❌ Failed to generate exam: ${error.message}`, 'error');
      this.view.renderGeneratePrompt();
    }
  }

  startPolling() {
    if (this.pollingInterval) clearInterval(this.pollingInterval);

    this.pollingInterval = setInterval(async () => {
      const result = await this.model.pollGenerationStatus();

      if (result.success && result.status === 'done') {
        this.stopPolling();
        showToastNotification('✅ Exam generated successfully! Good luck!', 'success');
        await this.initialize(this.model.courseId);
      } else if (result.status === 'failed') {
        this.stopPolling();
        showToastNotification('❌ Failed to generate exam. Please try again.', 'error');
        this.view.renderGeneratePrompt();
      }
    }, this.POLLING_INTERVAL);
  }

  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  // ===== EXAM CONTROL =====

  startExam() {
    if (this.model.startExam()) {
      this.startTimer();
      this.startAutoSave();
      this.view.renderExam();
      showToastNotification('🎯 Exam started! Take your time and do your best!', 'success');
    } else {
      showToastNotification('❌ Failed to start exam', 'error');
    }
  }

  resumeExam(savedProgress) {
    this.model.restoreState(savedProgress);
    this.model.examStatus = 'in_progress';
    this.startTimer();
    this.startAutoSave();
    this.view.renderExam();
    showToastNotification('⏮️ Exam resumed from where you left off', 'info');
  }

  async submitExam() {
    try {
      const unanswered = this.model.getUnansweredQuestions().length;
      const doubtful = this.model.getDoubtfulQuestions().length;

      // Confirm submission
      if (unanswered > 0 || doubtful > 0) {
        const confirmed = this.view.confirmSubmit(unanswered, doubtful);
        if (!confirmed) return;
      } else {
        if (!confirm("Are you sure you want to submit your exam?")) {
          return;
        }
      }

      this.stopTimer();
      this.stopAutoSave();
      this.view.showSubmitLoading();

      const result = await this.model.submitExam();

      if (result.queued) {
        this.view.hideSubmitLoading();
        showToastNotification('📴 ' + result.message, 'warning');
        // Save state for later sync
        this.saveProgress();
        return;
      }

      if (!result.success) {
        throw new Error(result.error);
      }

      this.clearProgress();
      this.view.renderResult(result.result);
      showToastNotification('🎉 Exam submitted successfully!', 'success');

    } catch (error) {
      this.view.hideSubmitLoading();
      showToastNotification(`❌ Submission failed: ${error.message}`, 'error');

      // Resume timer if exam is still in progress
      if (this.model.examStatus === 'in_progress') {
        this.startTimer();
        this.startAutoSave();
      }
    }
  }

  async handleTimeUp() {
    showToastNotification(`⏰ Time's up! Auto-submitting...`, 'warning');
    this.stopTimer();
    this.stopAutoSave();
    this.view.showSubmitLoading();

    try {
      const result = await this.model.submitExam();

      if (result.queued) {
        this.view.hideSubmitLoading();
        showToastNotification('📴 ' + result.message, 'warning');
        this.saveProgress();
        return;
      }

      if (result.success) {
        this.clearProgress();
        this.view.renderResult(result.result);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      this.view.hideSubmitLoading();
      showToastNotification(`❌ Auto-submit failed: ${error.message}`, 'error');
    }
  }

  // ===== NAVIGATION & ANSWER MANAGEMENT =====

  navigateToQuestion(index) {
    if (this.model.goToQuestion(index)) {
      this.view.updateQuestion();
      this.view.updateNavigationButtons();
    }
  }

  nextQuestion() {
    if (this.model.currentQuestionIndex === this.model.examData.length - 1) {
      this.showSubmitDialog();
    } else {
      if (this.model.nextQuestion()) {
        this.view.updateQuestion();
        this.view.updateNavigationButtons();
      }
    }
  }

  previousQuestion() {
    if (this.model.previousQuestion()) {
      this.view.updateQuestion();
      this.view.updateNavigationButtons();
    }
  }

  setAnswer(questionIndex, answer) {
    this.model.setAnswer(questionIndex, answer);
    this.view.updateQuestion();
    this.view.updateNavigationButtons();
    this.view.updateProgress();
  }

  toggleDoubtFlag() {
    const currentIndex = this.model.currentQuestionIndex;
    this.model.toggleDoubtFlag(currentIndex);
    this.view.updateQuestion();
    this.view.updateNavigationButtons();
    this.view.updateProgress();
  }

  reviewDoubtfulQuestions() {
    const doubtful = this.model.getDoubtfulQuestions();
    if (doubtful.length > 0) {
      this.navigateToQuestion(doubtful[0]);
      showToastNotification(`🔍 Reviewing ${doubtful.length} doubtful questions`, 'info');
    } else {
      showToastNotification('✅ No questions marked as doubtful!', 'success');
    }
  }

  showSubmitDialog() {
    this.submitExam();
  }

  // ===== TIMER & AUTOSAVE =====

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      const remaining = this.model.updateTimer();
      this.view.updateTimer(this.model.formatTime(remaining));

      if (remaining <= 0) {
        this.handleTimeUp();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  startAutoSave() {
    if (this.autoSaveInterval) clearInterval(this.autoSaveInterval);

    this.autoSaveInterval = setInterval(() => {
      this.saveProgress();
    }, this.AUTO_SAVE_INTERVAL);
  }

  stopAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }

  saveProgress() {
    try {
      const state = this.model.saveState();
      const key = this.STORAGE_KEY_PREFIX + this.model.courseId;
      localStorage.setItem(key, JSON.stringify(state));
      //console.log('💾 Progress saved to localStorage.');
    } catch (error) {
      console.error('❌ Failed to save progress:', error);
      showToastNotification('⚠️ Failed to save progress', 'warning');
    }
  }

  loadProgress() {
    try {
      const key = this.STORAGE_KEY_PREFIX + this.model.courseId;
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('❌ Failed to load progress:', error);
      return null;
    }
  }

  clearProgress() {
    try {
      const key = this.STORAGE_KEY_PREFIX + this.model.courseId;
      localStorage.removeItem(key);
      //console.log('🗑️ Progress cleared from localStorage.');
    } catch (error) {
      console.error('❌ Failed to clear progress:', error);
    }
  }

  _isValidProgress(progress) {
    const age = Date.now() - progress.timestamp;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    return age < maxAge && progress.timeRemaining > 0;
  }

  // ===== LEADERBOARD =====

  async viewLeaderboard() {
    this.view.showLeaderboardLoading();
    try {
      const result = await this.model.getLeaderboard();

      if (result.success) {
        this.view.renderLeaderboard(result);
      } else if (!result.hasClass) {
        this.view.renderNoClassPrompt();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      showToastNotification(error.message, 'error');
    } finally {
      this.view.hideLeaderboardLoading();
    }
  }

  // ===== UTILITY & CLEANUP =====

  getExamStats() {
    const questions = this.model.examData || [];
    const answered = this.model.getAnsweredQuestions();
    return {
      totalQuestions: questions.length,
      answeredCount: answered.length,
      unansweredCount: questions.length - answered.length,
      currentIndex: this.model.currentQuestionIndex,
    };
  }

  destroy() {
    this.stopTimer();
    this.stopAutoSave();
    this.stopPolling();
    //console.log('🧹 Presenter intervals cleaned up.');
  }
}

export default FinalExamPresenter;