// import Api from "../../../data/api.js";

// class FinalExamModel {
//   constructor() {
//     this.courseId = null;
//     this.examData = null;
//     this.currentQuestionIndex = 0;
//     this.answers = {};
//     this.timeRemaining = null;
//     this.examStatus = "not_started"; // not_started, ready, in_progress, submitted, completed
//     this.result = null;
//   }

//   async loadExam(courseId) {
//     try {
//       this.courseId = courseId;

//       // Get final exam data from API
//       const examResponse = await Api.checkFinalExam(courseId);

//       if (examResponse && examResponse.data && examResponse.data.questions) {
//         // Handle the response structure from your database
//         this.examData = examResponse.data.questions;
//         this.examStatus = "ready";

//         // Initialize answers object for all questions
//         this.examData.forEach((question, index) => {
//           this.answers[index] = null;
//         });

//         return {
//           success: true,
//           data: this.examData,
//           message: examResponse.message,
//         };
//       } else {
//         throw new Error("Final exam not found or questions not available");
//       }
//     } catch (error) {
//       console.error("Error loading final exam:", error);
//       return {
//         success: false,
//         error: error.message || "Failed to load final exam",
//       };
//     }
//   }

//   async checkExamStatus(courseId) {
//     try {
//       const statusResponse = await Api.checkFinalExamStatus(courseId);
//       return statusResponse;
//     } catch (error) {
//       console.error("Error checking exam status:", error);
//       return { ready: false, error: error.message };
//     }
//   }

//   async generateExam(courseId) {
//     try {
//       const response = await Api.generateFinalExam(courseId);
//       return {
//         success: true,
//         data: response,
//       };
//     } catch (error) {
//       console.error("Error generating final exam:", error);
//       return {
//         success: false,
//         error: error.message || "Failed to generate final exam",
//       };
//     }
//   }

//   startExam() {
//     if (this.examData && this.examStatus === "ready") {
//       this.examStatus = "in_progress";
//       this.currentQuestionIndex = 0;

//       // Set timer - default 90 minutes (5400 seconds)
//       const examDuration = this.examData.duration || 5400;
//       this.timeRemaining = examDuration;

//       return true;
//     }
//     return false;
//   }

//   getCurrentQuestion() {
//     if (
//       this.examData &&
//       Array.isArray(this.examData) &&
//       this.currentQuestionIndex < this.examData.length
//     ) {
//       return {
//         question: this.examData[this.currentQuestionIndex],
//         index: this.currentQuestionIndex,
//         total: this.examData.length,
//       };
//     }
//     return null;
//   }

//   setAnswer(questionIndex, answer) {
//     if (questionIndex >= 0 && questionIndex < this.examData.length) {
//       this.answers[questionIndex] = answer;
//     }
//   }

//   getAnswer(questionIndex) {
//     return this.answers[questionIndex] || null;
//   }

//   nextQuestion() {
//     if (this.currentQuestionIndex < this.examData.length - 1) {
//       this.currentQuestionIndex++;
//       return true;
//     }
//     return false;
//   }

//   previousQuestion() {
//     if (this.currentQuestionIndex > 0) {
//       this.currentQuestionIndex--;
//       return true;
//     }
//     return false;
//   }

//   goToQuestion(index) {
//     if (index >= 0 && index < this.examData.length) {
//       this.currentQuestionIndex = index;
//       return true;
//     }
//     return false;
//   }

//   getAnsweredQuestions() {
//     return Object.keys(this.answers).filter(
//       (key) => this.answers[key] !== null && this.answers[key] !== undefined
//     );
//   }

//   getUnansweredQuestions() {
//     return Object.keys(this.answers).filter(
//       (key) => this.answers[key] === null || this.answers[key] === undefined
//     );
//   }

//   isExamComplete() {
//     const totalQuestions = this.examData ? this.examData.length : 0;
//     const answeredQuestions = this.getAnsweredQuestions().length;
//     return answeredQuestions === totalQuestions;
//   }

//   // Get option index from option text (sesuai dengan response API)
//   getOptionIndex(question, selectedOptionText) {
//     if (question && question.options && Array.isArray(question.options)) {
//       return question.options.findIndex(
//         (option) => option === selectedOptionText
//       );
//     }
//     return -1;
//   }

//   // Get option text from index
//   getOptionText(question, index) {
//     if (question && question.options && Array.isArray(question.options)) {
//       return question.options[index] || null;
//     }
//     return null;
//   }

//   // Convert option letter (A, B, C, D) to index (0, 1, 2, 3)
//   convertAnswerLetterToIndex(letter) {
//     if (typeof letter === "string") {
//       return letter.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
//     }
//     return letter;
//   }

//   // Convert index to letter for display
//   convertAnswerIndexToLetter(index) {
//     if (typeof index === "number" && index >= 0) {
//       return String.fromCharCode(65 + index); // 0=A, 1=B, 2=C, 3=D
//     }
//     return index;
//   }

//   async submitExam() {
//     try {
//       if (this.examStatus !== "in_progress") {
//         throw new Error("Exam is not in progress");
//       }

//       // Format answers for submission - sesuai dengan struktur API response
//       const formattedAnswers = [];

//       // Iterate through all questions to build the correct format
//       this.examData.forEach((question, index) => {
//         const userAnswerIndex = this.answers[index];

//         // Only include answered questions
//         if (userAnswerIndex !== null && userAnswerIndex !== undefined) {
//           // Get the actual option text from the index
//           const userAnswerText = this.getOptionText(question, userAnswerIndex);

//           if (userAnswerText) {
//             formattedAnswers.push({
//               question: question.question || "",
//               answer: userAnswerText, // Send the actual option text, not letter
//             });
//           }
//         }
//       });

//       console.log("Formatted answers for submission:", formattedAnswers);

//       // Send only the formattedAnswers array to API
//       const response = await Api.submitFinalExam(
//         this.courseId,
//         formattedAnswers
//       );

//       // Check if submission was successful
//       if (response) {
//         this.examStatus = "submitted";
//         this.result = response.result || response.data || response;

//         return {
//           success: true,
//           result: this.result,
//         };
//       } else {
//         throw new Error("Failed to submit exam");
//       }
//     } catch (error) {
//       console.error("Error submitting exam:", error);
//       return {
//         success: false,
//         error: error.message || "Failed to submit exam",
//       };
//     }
//   }

//   async getExamResultModel() {
//     try {
//       if (this.result) {
//         return {
//           success: true,
//           result: this.normalizeResultData(this.result),
//         };
//       }

//       const response = await Api.getFinalExamResult(this.courseId);
//       console.log("Response from API di model:", response);

//       // Handle different API response structures
//       let resultData;
//       if (response.result) {
//         resultData = response.result;
//         console.log("Result data:", resultData);
//       } else if (response.data) {
//         resultData = response.data;
//         console.log("Response Data:", resultData);
//       } else {
//         resultData = response;
//       }

//       this.result = this.normalizeResultData(resultData);
//       console.log("Normalized result data:", this.result);

//       return {
//         success: true,
//         result: this.result,
//       };
//     } catch (error) {
//       console.error("Error getting exam result:", error);
//       return {
//         success: false,
//         error: error.message || "Failed to get exam result",
//       };
//     }
//   }

//   normalizeResultData(rawResult) {
//     // Jika data sudah dalam format yang benar dari server
//     if (
//       rawResult &&
//       typeof rawResult.score === "number" &&
//       typeof rawResult.total === "number" &&
//       typeof rawResult.correct === "number"
//     ) {
//       return {
//         score: rawResult.score,
//         correct_answers: rawResult.correct,
//         wrong_answers: rawResult.total - rawResult.correct,
//         total_questions: rawResult.total,
//         percentage: rawResult.score, // score sudah dalam bentuk persentase
//         id: rawResult.id,
//         student_id: rawResult.student_id,
//         course_id: rawResult.course_id,
//         submitted_at: rawResult.submitted_at,
//       };
//     }

//     // Jika perlu calculate score dari local data
//     const localScore = this.calculateScore();

//     // Merge dengan data dari server jika ada
//     return {
//       score: rawResult?.score ?? localScore.percentage,
//       correct_answers: rawResult?.correct ?? localScore.correct,
//       wrong_answers: rawResult
//         ? rawResult.total - rawResult.correct
//         : localScore.total - localScore.correct,
//       total_questions: rawResult?.total ?? localScore.total,
//       percentage: rawResult?.score ?? localScore.percentage,
//       id: rawResult?.id ?? null,
//       student_id: rawResult?.student_id ?? null,
//       course_id: rawResult?.course_id ?? null,
//       submitted_at: rawResult?.submitted_at ?? null,
//     };
//   }
//   updateTimer() {
//     if (this.timeRemaining > 0) {
//       this.timeRemaining--;
//       return this.timeRemaining;
//     }
//     return 0;
//   }

//   formatTime(seconds) {
//     if (!seconds || seconds < 0) return "0:00";

//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;

//     if (hours > 0) {
//       return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
//         .toString()
//         .padStart(2, "0")}`;
//     }
//     return `${minutes}:${secs.toString().padStart(2, "0")}`;
//   }

//   calculateScore() {
//     if (
//       !this.examData ||
//       !Array.isArray(this.examData) ||
//       this.examData.length === 0
//     ) {
//       return {
//         correct: 0,
//         total: 0,
//         percentage: 0,
//       };
//     }

//     let correctAnswers = 0;
//     let totalQuestions = this.examData.length;

//     this.examData.forEach((question, index) => {
//       const userAnswerIndex = this.answers[index];

//       // Skip jika user tidak menjawab
//       if (userAnswerIndex === null || userAnswerIndex === undefined) {
//         return;
//       }

//       const userAnswerText = this.getOptionText(question, userAnswerIndex);
//       const correctAnswerText = question.answer;

//       // Debug log untuk troubleshooting
//       console.log(`Question ${index + 1}:`, {
//         question: question.question,
//         userAnswerIndex,
//         userAnswerText,
//         correctAnswerText,
//         isCorrect: userAnswerText === correctAnswerText,
//       });

//       // Compare the actual option text
//       if (
//         userAnswerText &&
//         correctAnswerText &&
//         userAnswerText === correctAnswerText
//       ) {
//         correctAnswers++;
//       }
//     });

//     const percentage =
//       totalQuestions > 0
//         ? Math.round((correctAnswers / totalQuestions) * 100)
//         : 0;

//     return {
//       correct: correctAnswers,
//       total: totalQuestions,
//       percentage: percentage,
//     };
//   }

//   reset() {
//     this.examData = null;
//     this.currentQuestionIndex = 0;
//     this.answers = {};
//     this.timeRemaining = null;
//     this.examStatus = "not_started";
//     this.result = null;
//   }
// }

// export default FinalExamModel;
//   // normalizeResultData(rawResult) {
//   //   // Jika data sudah dalam format yang benar
//   //   if (
//   //     rawResult &&
//   //     typeof rawResult.score === "number" &&
//   //     typeof rawResult.total_questions === "number"
//   //   ) {
//   //     return rawResult;
//   //   }

//   //   // Jika perlu calculate score dari local data
//   //   const localScore = this.calculateScore();

//   //   // Merge dengan data dari server jika ada
//   //   return {
//   //     score: rawResult?.score ?? localScore.correct,

//   //     correct_answers: rawResult?.correct_answers ?? localScore.correct,
//   //     wrong_answers:
//   //       rawResult?.wrong_answers ?? localScore.total - localScore.correct,
//   //     total_questions: rawResult?.total_questions ?? localScore.total,
//   //     percentage: rawResult?.percentage ?? localScore.percentage,
//   //   };
//   // }
import Api from "../../../data/api.js";

/**
 * FinalExamModel - Handles final exam operations
 * Responsibilities:
 * - Exam lifecycle management
 * - Question navigation
 * - Answer management
 * - Timer functionality
 * - Result processing
 */
class FinalExamModel {
  constructor() {
    this.courseId = null;
    this.examData = null;
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.timeRemaining = null;
    this.examStatus = "not_started"; // not_started, ready, in_progress, submitted, completed
    this.result = null;

    // Configuration constants
    this.DEFAULT_EXAM_DURATION = 5400; // 90 minutes in seconds
  }

  // ===== EXAM LIFECYCLE METHODS =====

  /**
   * Load exam data from API
   */
  async loadExam(courseId) {
    try {
      this._validateCourseId(courseId);
      this.courseId = courseId;

      const examResponse = await Api.checkFinalExam(courseId);

      if (!this._isValidExamResponse(examResponse)) {
        throw new Error("Final exam not found or questions not available");
      }

      this._initializeExam(examResponse.data.questions);

      return {
        success: true,
        data: this.examData,
        message: examResponse.message,
      };
    } catch (error) {
      console.error("Error loading final exam:", error);
      return {
        success: false,
        error: error.message || "Failed to load final exam",
      };
    }
  }

  /**
   * Check exam status from API
   */
  async checkExamStatus(courseId) {
    try {
      this._validateCourseId(courseId);
      return await Api.checkFinalExamStatus(courseId);
    } catch (error) {
      console.error("Error checking exam status:", error);
      return { ready: false, error: error.message };
    }
  }

  /**
   * Generate new exam
   */
  async generateExam(courseId) {
    try {
      this._validateCourseId(courseId);
      const response = await Api.generateFinalExam(courseId);

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error("Error generating final exam:", error);
      return {
        success: false,
        error: error.message || "Failed to generate final exam",
      };
    }
  }

  /**
   * Start the exam
   */
  startExam() {
    if (!this._canStartExam()) {
      return false;
    }

    this.examStatus = "in_progress";
    this.currentQuestionIndex = 0;
    this._startTimer();

    return true;
  }

  /**
   * Submit exam answers
   */
  async submitExam() {
    try {
      this._validateExamInProgress();

      const formattedAnswers = this._formatAnswersForSubmission();
      console.log("Formatted answers for submission:", formattedAnswers);

      const response = await Api.submitFinalExam(
        this.courseId,
        formattedAnswers
      );

      if (!response) {
        throw new Error("Failed to submit exam");
      }

      this._handleSubmissionResponse(response);

      return {
        success: true,
        result: this.result,
      };
    } catch (error) {
      console.error("Error submitting exam:", error);
      return {
        success: false,
        error: error.message || "Failed to submit exam",
      };
    }
  }

  // ===== QUESTION NAVIGATION METHODS =====

  /**
   * Get current question data
   */
  getCurrentQuestion() {
    if (!this._hasValidExamData()) {
      return null;
    }

    return {
      question: this.examData[this.currentQuestionIndex],
      index: this.currentQuestionIndex,
      total: this.examData.length,
    };
  }

  /**
   * Navigate to next question
   */
  nextQuestion() {
    if (this.currentQuestionIndex < this.examData.length - 1) {
      this.currentQuestionIndex++;
      return true;
    }
    return false;
  }

  /**
   * Navigate to previous question
   */
  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      return true;
    }
    return false;
  }

  /**
   * Go to specific question by index
   */
  goToQuestion(index) {
    if (this._isValidQuestionIndex(index)) {
      this.currentQuestionIndex = index;
      return true;
    }
    return false;
  }

  // ===== ANSWER MANAGEMENT METHODS =====

  /**
   * Set answer for a specific question
   */
  setAnswer(questionIndex, answer) {
    if (this._isValidQuestionIndex(questionIndex)) {
      this.answers[questionIndex] = answer;
    }
  }

  /**
   * Get answer for a specific question
   */
  getAnswer(questionIndex) {
    return this.answers[questionIndex] || null;
  }

  /**
   * Get list of answered questions
   */
  getAnsweredQuestions() {
    return Object.keys(this.answers).filter(
      (key) => this.answers[key] !== null && this.answers[key] !== undefined
    );
  }

  /**
   * Get list of unanswered questions
   */
  getUnansweredQuestions() {
    return Object.keys(this.answers).filter(
      (key) => this.answers[key] === null || this.answers[key] === undefined
    );
  }

  /**
   * Check if all questions are answered
   */
  isExamComplete() {
    const totalQuestions = this.examData ? this.examData.length : 0;
    const answeredQuestions = this.getAnsweredQuestions().length;
    return answeredQuestions === totalQuestions;
  }

  // ===== OPTION UTILITY METHODS =====

  /**
   * Get option index from option text
   */
  getOptionIndex(question, selectedOptionText) {
    if (question?.options && Array.isArray(question.options)) {
      return question.options.findIndex(
        (option) => option === selectedOptionText
      );
    }
    return -1;
  }

  /**
   * Get option text from index
   */
  getOptionText(question, answerIndex) {
    // Handle nested question structure
    let actualQuestionData = question;
    if (question.question && typeof question.question === "object") {
      actualQuestionData = question.question;
    }

    // Get options array
    const options =
      actualQuestionData.options ||
      actualQuestionData.choices ||
      actualQuestionData.answers ||
      question.options ||
      question.choices ||
      question.answers ||
      [];

    if (!options || !Array.isArray(options) || answerIndex >= options.length) {
      return null;
    }

    const option = options[answerIndex];

    // Extract text from option object or use direct value
    if (typeof option === "object") {
      return (
        option.text ||
        option.label ||
        option.option ||
        option.value ||
        String(option)
      );
    }

    return String(option);
  }

  /**
   * Convert answer letter (A, B, C, D) to index (0, 1, 2, 3)
   */
  convertAnswerLetterToIndex(letter) {
    if (typeof letter === "string") {
      return letter.charCodeAt(0) - 65;
    }
    return letter;
  }

  /**
   * Convert index to letter for display
   */
  convertAnswerIndexToLetter(index) {
    if (typeof index === "number" && index >= 0) {
      return String.fromCharCode(65 + index);
    }
    return index;
  }

  // ===== TIMER METHODS =====

  /**
   * Update timer (decrease by 1 second)
   */
  updateTimer() {
    if (this.timeRemaining > 0) {
      this.timeRemaining--;
      return this.timeRemaining;
    }
    return 0;
  }

  /**
   * Format time in readable format
   */
  formatTime(seconds) {
    if (!seconds || seconds < 0) return "0:00";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }

  // ===== RESULT METHODS =====

  /**
   * Get exam result from model or API
   */
  async getExamResult() {
    try {
      // Return cached result if available
      if (this.result) {
        return {
          success: true,
          result: this._normalizeResultData(this.result),
        };
      }

      // Fetch result from API
      const response = await Api.getFinalExamResult(this.courseId);
      console.log("Response from API:", response);

      const resultData = this._extractResultData(response);
      this.result = this._normalizeResultData(resultData);

      console.log("Normalized result data:", this.result);

      return {
        success: true,
        result: this.result,
      };
    } catch (error) {
      console.error("Error getting exam result:", error);
      return {
        success: false,
        error: error.message || "Failed to get exam result",
      };
    }
  }

  /**
   * Calculate local score based on answers
   */
  calculateScore() {
    const totalQuestions = this.examData ? this.examData.length : 0;
    let correctAnswers = 0;

    if (!this.examData || totalQuestions === 0) {
      return { correct: 0, total: 0, percentage: 0 };
    }

    this.examData.forEach((question, index) => {
      const userAnswerIndex = this.answers[index];

      // PERBAIKAN: Skip jika TIDAK ada jawaban (logika yang benar)
      if (userAnswerIndex === null || userAnswerIndex === undefined) {
        console.log(`Question ${index + 1}: No answer provided`);
        return;
      }

      const userAnswerText = this.getOptionText(question, userAnswerIndex);
      const correctAnswerText = question.answer || question.correct_answer;

      console.log(`Question ${index + 1}:`, {
        question: question.question,
        userAnswerIndex,
        userAnswerText,
        correctAnswerText,
        isCorrect: userAnswerText === correctAnswerText,
      });

      // Improved comparison logic
      if (
        this.compareAnswers(userAnswerText, correctAnswerText, question.options)
      ) {
        correctAnswers++;
      }
    });

    const percentage =
      totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;

    return {
      correct: correctAnswers,
      total: totalQuestions,
      percentage: percentage,
    };
  }

  compareAnswers(userAnswer, correctAnswer, options) {
    // Handle null/undefined cases
    if (
      userAnswer === null ||
      userAnswer === undefined ||
      correctAnswer === null ||
      correctAnswer === undefined
    ) {
      return false;
    }

    // Direct comparison first
    if (userAnswer === correctAnswer) return true;
    if (userAnswer == correctAnswer) return true;

    // Convert to string and compare (case insensitive)
    if (
      String(userAnswer).toLowerCase().trim() ===
      String(correctAnswer).toLowerCase().trim()
    ) {
      return true;
    }

    // Handle options array comparisons if available
    if (options && Array.isArray(options)) {
      // Find correct answer index in options
      let correctAnswerIndex = -1;
      for (let i = 0; i < options.length; i++) {
        const option = options[i];
        const optionText =
          typeof option === "object"
            ? option.text || option.label || option.option || option.value
            : option;

        if (
          String(optionText).toLowerCase().trim() ===
          String(correctAnswer).toLowerCase().trim()
        ) {
          correctAnswerIndex = i;
          break;
        }
      }

      // Compare user answer text with correct option text
      if (correctAnswerIndex !== -1) {
        const correctOption = options[correctAnswerIndex];
        const correctOptionText =
          typeof correctOption === "object"
            ? correctOption.text ||
              correctOption.label ||
              correctOption.option ||
              correctOption.value
            : correctOption;

        if (
          String(userAnswer).toLowerCase().trim() ===
          String(correctOptionText).toLowerCase().trim()
        ) {
          return true;
        }
      }
    }

    return false;
  }
  /**
   * Reset exam model to initial state
   */
  reset() {
    this.examData = null;
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.timeRemaining = null;
    this.examStatus = "not_started";
    this.result = null;
  }

  // ===== PRIVATE HELPER METHODS =====

  /**
   * Validate course ID
   */
  _validateCourseId(courseId) {
    if (!courseId) {
      throw new Error("Course ID is required");
    }
  }

  /**
   * Check if exam response is valid
   */
  _isValidExamResponse(examResponse) {
    return examResponse && examResponse.data && examResponse.data.questions;
  }

  /**
   * Initialize exam with questions data
   */
  _initializeExam(questions) {
    this.examData = questions;
    this.examStatus = "ready";

    // Initialize answers object for all questions
    this.examData.forEach((question, index) => {
      this.answers[index] = null;
    });
  }

  /**
   * Check if exam can be started
   */
  _canStartExam() {
    return this.examData && this.examStatus === "ready";
  }

  /**
   * Start exam timer
   */
  _startTimer() {
    const examDuration = this.examData.duration || this.DEFAULT_EXAM_DURATION;
    this.timeRemaining = examDuration;
  }

  /**
   * Check if exam data is valid
   */
  _hasValidExamData() {
    return (
      this.examData &&
      Array.isArray(this.examData) &&
      this.currentQuestionIndex < this.examData.length
    );
  }

  /**
   * Check if question index is valid
   */
  _isValidQuestionIndex(index) {
    return index >= 0 && index < this.examData.length;
  }

  /**
   * Validate exam is in progress
   */
  _validateExamInProgress() {
    if (this.examStatus !== "in_progress") {
      throw new Error("Exam is not in progress");
    }
  }

  /**
   * Format answers for API submission
   */
  _formatAnswersForSubmission() {
    const formattedAnswers = [];

    this.examData.forEach((question, index) => {
      const userAnswerIndex = this.answers[index];

      if (userAnswerIndex !== null && userAnswerIndex !== undefined) {
        const userAnswerText = this.getOptionText(question, userAnswerIndex);

        if (userAnswerText) {
          formattedAnswers.push({
            question: question.question || "",
            answer: userAnswerText,
          });
        }
      }
    });

    return formattedAnswers;
  }

  /**
   * Handle submission response
   */
  _handleSubmissionResponse(response) {
    this.examStatus = "submitted";
    this.result = response.result || response.data || response;
  }

  /**
   * Extract result data from API response
   */
  _extractResultData(response) {
    if (response.result) {
      console.log("Result data:", response.result);
      return response.result;
    } else if (response.data) {
      console.log("Response Data:", response.data);
      return response.data;
    }
    return response;
  }

  /**
   * Normalize result data to consistent format
   */
  _normalizeResultData(rawResult) {
    // Check if data is already in correct format from server
    if (this._isValidServerResultData(rawResult)) {
      return {
        score: rawResult.score,
        correct_answers: rawResult.correct,
        wrong_answers: rawResult.total - rawResult.correct,
        total_questions: rawResult.total,
        percentage: rawResult.score,
        id: rawResult.id,
        student_id: rawResult.student_id,
        course_id: rawResult.course_id,
        submitted_at: rawResult.submitted_at,
      };
    }

    // Fallback to local calculation
    const localScore = this.calculateScore();

    return {
      score: rawResult?.score ?? localScore.percentage,
      correct_answers: rawResult?.correct ?? localScore.correct,
      wrong_answers: rawResult
        ? rawResult.total - rawResult.correct
        : localScore.total - localScore.correct,
      total_questions: rawResult?.total ?? localScore.total,
      percentage: rawResult?.score ?? localScore.percentage,
      id: rawResult?.id ?? null,
      student_id: rawResult?.student_id ?? null,
      course_id: rawResult?.course_id ?? null,
      submitted_at: rawResult?.submitted_at ?? null,
    };
  }

  /**
   * Check if server result data is valid
   */
  _isValidServerResultData(rawResult) {
    return (
      rawResult &&
      typeof rawResult.score === "number" &&
      typeof rawResult.total === "number" &&
      typeof rawResult.correct === "number"
    );
  }

  /**
   * Get empty score object
   */
  _getEmptyScore() {
    return {
      correct: 0,
      total: 0,
      percentage: 0,
    };
  }
}

export default FinalExamModel;
