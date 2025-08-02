class FinalExamModel {
  constructor() {
    this.courseId = null;
    this.examData = null;
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.doubtFlags = {};
    this.timeRemaining = null;
    this.examStatus = "not_started";
    this.result = null;
    this.DEFAULT_EXAM_DURATION = 5400; // 90 minutes
  }

  // ===== INITIALIZATION METHODS =====

  async initialize(courseId) {
    try {
      this.courseId = courseId;

      // Check result first
      const resultData = await this._checkExistingResult();
      if (resultData) {
        this.result = resultData;
        this.examStatus = "submitted";
        return {
          success: true,
          status: "completed",
          result: this.result
        };
      }

      // Check exam availability
      const examData = await this._checkExamAvailability();
      if (examData) {
        this.examData = examData.questions;
        this.examStatus = "ready";
        this._initializeAnswers();
        return {
          success: true,
          status: "ready",
          examData: this.examData
        };
      }

      // Check generation status
      const statusData = await this._checkGenerationStatus();
      if (statusData.status === 'generating') {
        return {
          success: true,
          status: "generating"
        };
      }

      // Need to generate
      return {
        success: true,
        status: "not_generated"
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async generateExam() {
    try {
      // Import Api dynamically with CORRECT PATH
      const { default: Api } = await import('../../../data/api.js');
      await Api.generateFinalExam(this.courseId);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async pollGenerationStatus() {
    try {
      const { default: Api } = await import('../../../data/api.js');
      const response = await Api.checkFinalExamStatus(this.courseId);
      return {
        success: true,
        status: response.status
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== EXAM CONTROL METHODS =====

  startExam() {
    if (!this._canStartExam()) {
      return false;
    }

    this.examStatus = "in_progress";
    this.currentQuestionIndex = 0;
    this._startTimer();

    return true;
  }

  // ===== ENHANCED SUBMIT VALIDATION =====
  
  /**
   * Validate exam before submission - ALL QUESTIONS MUST BE ANSWERED
   * @returns {Object} Validation result with detailed info
   */
  validateExamForSubmission() {
    const validation = {
      isValid: false,
      totalQuestions: this.examData ? this.examData.length : 0,
      answeredCount: 0,
      unansweredQuestions: [],
      doubtfulQuestions: [],
      missingAnswers: []
    };

    if (!this.examData || !Array.isArray(this.examData)) {
      validation.error = "No exam data available";
      return validation;
    }

    // Check each question
    for (let i = 0; i < this.examData.length; i++) {
      const answer = this.answers[i];
      const isAnswered = answer !== null && answer !== undefined;
      
      if (isAnswered) {
        validation.answeredCount++;
      } else {
        validation.unansweredQuestions.push(i);
        validation.missingAnswers.push({
          questionIndex: i,
          questionText: this.examData[i].question
        });
      }

      // Track doubtful questions
      if (this.doubtFlags[i] === true) {
        validation.doubtfulQuestions.push(i);
      }
    }

    // CRITICAL: ALL questions must be answered
    validation.isValid = validation.answeredCount === validation.totalQuestions;
    
    console.log('📝 Exam Validation Result:', {
      isValid: validation.isValid,
      totalQuestions: validation.totalQuestions,
      answeredCount: validation.answeredCount,
      unansweredCount: validation.unansweredQuestions.length,
      doubtfulCount: validation.doubtfulQuestions.length
    });

    return validation;
  }

  async submitExam() {
    try {
      this._validateExamInProgress();

      // MANDATORY VALIDATION: ALL QUESTIONS MUST BE ANSWERED
      const validation = this.validateExamForSubmission();
      
      if (!validation.isValid) {
        const unansweredCount = validation.unansweredQuestions.length;
        throw new Error(
          `Cannot submit exam: ${unansweredCount} question(s) are unanswered. ` +
          `All ${validation.totalQuestions} questions must be completed before submission.`
        );
      }

      console.log('✅ Exam validation passed - all questions answered');

      // Format ALL answers for submission
      const formattedAnswers = this._formatAnswersForSubmission();
      
      console.log('📤 Submitting answers:', {
        totalAnswers: formattedAnswers.length,
        expectedAnswers: this.examData.length,
        answers: formattedAnswers
      });

      // Ensure we have the correct number of answers
      if (formattedAnswers.length !== this.examData.length) {
        throw new Error(
          `Answer count mismatch: Expected ${this.examData.length} answers, got ${formattedAnswers.length}`
        );
      }

      // Check if online before submitting
      if (!navigator.onLine) {
        // Queue for offline submission
        const { default: Api } = await import('../../../data/api.js');
        const response = await Api.safeWriteOperation('submit_final_exam', {
          courseId: this.courseId,
          answers: formattedAnswers
        }, 3);

        if (response.queued) {
          this.examStatus = "queued_for_submission";
          return {
            success: true,
            queued: true,
            message: response.message
          };
        }
      } else {
        // Direct submission when online
        const { default: Api } = await import('../../../data/api.js');
        const response = await Api.submitFinalExam(this.courseId, formattedAnswers);
        this._handleSubmissionResponse(response);
      }

      return {
        success: true,
        result: this.result
      };
    } catch (error) {
      console.error('❌ Submit exam error:', error);
      return {
        success: false,
        error: error.message || "Failed to submit exam"
      };
    }
  }

  // ===== QUESTION NAVIGATION METHODS =====

  getCurrentQuestion() {
    if (!this._hasValidExamData()) {
      return null;
    }

    return {
      question: this.examData[this.currentQuestionIndex],
      index: this.currentQuestionIndex,
      total: this.examData.length
    };
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.examData.length - 1) {
      this.currentQuestionIndex++;
      return true;
    }
    return false;
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      return true;
    }
    return false;
  }

  goToQuestion(index) {
    if (this._isValidQuestionIndex(index)) {
      this.currentQuestionIndex = index;
      return true;
    }
    return false;
  }

  // ===== ANSWER MANAGEMENT METHODS =====

  setAnswer(questionIndex, answer) {
    if (this._isValidQuestionIndex(questionIndex)) {
      this.answers[questionIndex] = answer;
      console.log(`📝 Answer set: Q${questionIndex + 1} = ${answer} (${String.fromCharCode(65 + answer)})`);
    }
  }

  getAnswer(questionIndex) {
    return this.answers[questionIndex] !== undefined ? this.answers[questionIndex] : null;
  }

  // ===== DOUBT FLAG METHODS =====

  setDoubtFlag(questionIndex, isDoubtful = true) {
    if (this._isValidQuestionIndex(questionIndex)) {
      this.doubtFlags[questionIndex] = isDoubtful;
    }
  }

  getDoubtFlag(questionIndex) {
    return this.doubtFlags[questionIndex] || false;
  }

  toggleDoubtFlag(questionIndex) {
    const currentState = this.getDoubtFlag(questionIndex);
    this.setDoubtFlag(questionIndex, !currentState);
    return !currentState;
  }

  getDoubtfulQuestions() {
    return Object.keys(this.doubtFlags)
      .filter(key => this.doubtFlags[key] === true)
      .map(key => parseInt(key));
  }

  // ===== ENHANCED QUESTION STATUS METHODS =====

  getAnsweredQuestions() {
    return Object.keys(this.answers).filter(
      key => this.answers[key] !== null && this.answers[key] !== undefined
    ).map(key => parseInt(key));
  }

  getUnansweredQuestions() {
    if (!this.examData) return [];
    
    const unanswered = [];
    for (let i = 0; i < this.examData.length; i++) {
      const answer = this.answers[i];
      if (answer === null || answer === undefined) {
        unanswered.push(i);
      }
    }
    return unanswered;
  }

  getQuestionStatus(questionIndex) {
    const isAnswered = this.answers[questionIndex] !== null && this.answers[questionIndex] !== undefined;
    const isDoubtful = this.doubtFlags[questionIndex] === true;
    const isCurrent = questionIndex === this.currentQuestionIndex;

    if (isCurrent) {
      return 'current';
    } else if (isAnswered && isDoubtful) {
      return 'answered-doubt';
    } else if (isAnswered) {
      return 'answered';
    } else if (isDoubtful) {
      return 'doubt-only';
    } else {
      return 'unanswered';
    }
  }

  isExamComplete() {
    const totalQuestions = this.examData ? this.examData.length : 0;
    const answeredQuestions = this.getAnsweredQuestions().length;
    return answeredQuestions === totalQuestions;
  }

  /**
   * Get detailed exam completion statistics
   * @returns {Object} Detailed completion stats
   */
  getExamCompletionStats() {
    const totalQuestions = this.examData ? this.examData.length : 0;
    const answeredQuestions = this.getAnsweredQuestions();
    const unansweredQuestions = this.getUnansweredQuestions();
    const doubtfulQuestions = this.getDoubtfulQuestions();

    return {
      totalQuestions,
      answeredCount: answeredQuestions.length,
      unansweredCount: unansweredQuestions.length,
      doubtfulCount: doubtfulQuestions.length,
      progressPercentage: totalQuestions > 0 ? Math.round((answeredQuestions.length / totalQuestions) * 100) : 0,
      isComplete: answeredQuestions.length === totalQuestions,
      answeredQuestions,
      unansweredQuestions,
      doubtfulQuestions
    };
  }

  // ===== TIMER METHODS =====

  updateTimer() {
    if (this.timeRemaining > 0) {
      this.timeRemaining--;
      return this.timeRemaining;
    }
    return 0;
  }

  formatTime(seconds) {
    if (!seconds || seconds < 0) return "0:00";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  // ===== STATE MANAGEMENT =====

  saveState() {
    const state = {
      courseId: this.courseId,
      currentQuestionIndex: this.currentQuestionIndex,
      answers: this.answers,
      doubtFlags: this.doubtFlags,
      timeRemaining: this.timeRemaining,
      examStatus: this.examStatus,
      timestamp: Date.now()
    };
    return state;
  }

  restoreState(state) {
    if (!state || !this._isValidState(state)) {
      return false;
    }

    this.courseId = state.courseId;
    this.currentQuestionIndex = state.currentQuestionIndex;
    this.answers = state.answers || {};
    this.doubtFlags = state.doubtFlags || {};
    this.timeRemaining = state.timeRemaining;
    this.examStatus = state.examStatus;

    return true;
  }

  reset() {
    this.examData = null;
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.doubtFlags = {};
    this.timeRemaining = null;
    this.examStatus = "not_started";
    this.result = null;
  }

  // ===== LEADERBOARD METHODS =====

  async getLeaderboard() {
    try {
      const { default: Api } = await import('../../../data/api.js');

      console.log('🔍 Getting current student_profiles info for leaderboard...');
      const currentUserResponse = await Api.getStudentProfile();
      console.log('👤 Current user response:', currentUserResponse);

      let classId = null;
      if (currentUserResponse.profile?.class_id) {
        classId = currentUserResponse.profile.class_id;
      } else if (currentUserResponse.class_id) {
        classId = currentUserResponse.class_id;
      } else if (currentUserResponse.student_profile?.class_id) {
        classId = currentUserResponse.student_profile.class_id;
      }

      console.log('🏫 Extracted class_id:', classId);

      if (!classId) {
        console.log('❌ No class_id found in user profile');
        return {
          success: false,
          hasClass: false,
          message: "You need to join a class to view the leaderboard"
        };
      }

      console.log('📊 Fetching leaderboard for course:', this.courseId, 'class:', classId);
      const leaderboardResponse = await Api.getFinalExamLeaderboard(this.courseId, classId);
      console.log('📈 Leaderboard response:', leaderboardResponse);

      const currentUserId = currentUserResponse.profile?.id || currentUserResponse.id;
      const enrichedLeaderboard = (leaderboardResponse.leaderboard || []).map(entry => ({
        ...entry,
        isCurrentUser: entry.student_id === currentUserId || entry.user_id === currentUserId
      }));

      return {
        success: true,
        hasClass: true,
        classId: classId,
        leaderboard: enrichedLeaderboard,
        totalParticipants: leaderboardResponse.total_participants || 0
      };

    } catch (error) {
      console.error("❌ Error fetching leaderboard:", error);

      if (error.message?.includes('class') || error.message?.includes('kelas')) {
        return {
          success: false,
          hasClass: false,
          message: "You need to join a class to view the leaderboard"
        };
      }

      return {
        success: false,
        error: error.message || "Failed to fetch leaderboard"
      };
    }
  }

  // ===== PRIVATE HELPER METHODS =====

  async _checkExistingResult() {
    try {
      const { default: Api } = await import('../../../data/api.js');
      const response = await Api.getFinalExamResult(this.courseId);

      if (response.result) {
        const result = response.result;
        return {
          total: result.total || result.total_questions || 0,
          correct: result.correct || result.correct_answers || 0,
          score: result.score || 0,
          wrong: (result.total || result.total_questions || 0) - (result.correct || result.correct_answers || 0)
        };
      }

      return null;
    } catch (error) {
      if (error.message?.includes('404') || error.message?.includes('Belum ada hasil')) {
        return null;
      }
      throw error;
    }
  }

  async _checkExamAvailability() {
    try {
      const { default: Api } = await import('../../../data/api.js');
      const response = await Api.checkFinalExam(this.courseId);
      return response.data;
    } catch (error) {
      if (error.message?.includes('404') || error.message?.includes('belum tersedia')) {
        return null;
      }
      throw error;
    }
  }

  async _checkGenerationStatus() {
    try {
      const { default: Api } = await import('../../../data/api.js');
      const response = await Api.checkFinalExamStatus(this.courseId);
      return response;
    } catch (error) {
      return { status: 'not_started' };
    }
  }

  _initializeAnswers() {
    this.answers = {};
    this.doubtFlags = {};
    if (this.examData) {
      this.examData.forEach((_, index) => {
        this.answers[index] = null; // Initialize as null
        this.doubtFlags[index] = false;
      });
    }
  }

  _canStartExam() {
    return this.examData && this.examStatus === "ready";
  }

  _startTimer() {
    this.timeRemaining = this.DEFAULT_EXAM_DURATION;
  }

  _hasValidExamData() {
    return this.examData &&
      Array.isArray(this.examData) &&
      this.currentQuestionIndex < this.examData.length;
  }

  _isValidQuestionIndex(index) {
    return this.examData && index >= 0 && index < this.examData.length;
  }

  _validateExamInProgress() {
    if (this.examStatus !== "in_progress") {
      throw new Error("Exam is not in progress");
    }
  }

  /**
   * ENHANCED: Format ALL answers for submission - MANDATORY ALL QUESTIONS
   * @returns {Array} Complete answers array for all questions
   */
  _formatAnswersForSubmission() {
    const formattedAnswers = [];

    if (!this.examData || !Array.isArray(this.examData)) {
      throw new Error("No exam data available for formatting answers");
    }

    // Process ALL questions - MANDATORY
    this.examData.forEach((question, index) => {
      const userAnswer = this.answers[index];

      // Validation: ALL questions must have answers
      if (userAnswer === null || userAnswer === undefined) {
        throw new Error(`Question ${index + 1} is not answered. All questions must be completed.`);
      }

      const answerText = this._getAnswerText(question, userAnswer);

      formattedAnswers.push({
        question: question.question,
        answer: answerText
      });

      console.log(`📝 Q${index + 1}: "${question.question}" => "${answerText}"`);
    });

    console.log(`✅ Formatted ${formattedAnswers.length} complete answers for submission`);
    return formattedAnswers;
  }

  _getAnswerText(question, answerIndex) {
    // Handle string answers directly
    if (typeof answerIndex === 'string' && isNaN(answerIndex)) {
      return answerIndex;
    }

    // Convert to number and get option text
    const index = parseInt(answerIndex);
    
    if (question.options && question.options[index]) {
      return question.options[index];
    }

    // Fallback to letter notation
    return String.fromCharCode(65 + index);
  }

  _handleSubmissionResponse(response) {
    this.examStatus = "submitted";

    this.result = {
      total_questions: response.total_questions || response.total || 0,
      correct_answers: response.correct_answers || response.correct || 0,
      score: response.score || 0,
      wrong_answers: (response.total_questions || response.total || 0) - (response.correct_answers || response.correct || 0)
    };

    console.log('✅ Exam submitted successfully:', this.result);
  }

  _isValidState(state) {
    return state &&
      state.courseId &&
      typeof state.currentQuestionIndex === 'number' &&
      typeof state.timeRemaining === 'number' &&
      state.timestamp;
  }

  setLeaderboardViewed() {
    const key = `leaderboard_viewed_${this.courseId}`;
    localStorage.setItem(key, 'true');
  }

  hasViewedLeaderboard() {
    const key = `leaderboard_viewed_${this.courseId}`;
    return localStorage.getItem(key) === 'true';
  }
}

export default FinalExamModel;