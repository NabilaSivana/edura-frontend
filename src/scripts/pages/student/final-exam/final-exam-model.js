import Api from "../../../data/api.js";

class FinalExamModel {
  constructor() {
    this.courseId = null;
    this.examData = null;
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.timeRemaining = null;
    this.examStatus = "not_started"; // not_started, ready, in_progress, submitted, completed
    this.result = null;
  }

  async loadExam(courseId) {
    try {
      this.courseId = courseId;

      // Get final exam data from API
      const examResponse = await Api.checkFinalExam(courseId);

      if (examResponse && examResponse.data && examResponse.data.questions) {
        // Handle the response structure from your database
        this.examData = examResponse.data.questions;
        this.examStatus = "ready";

        // Initialize answers object for all questions
        this.examData.forEach((question, index) => {
          this.answers[index] = null;
        });

        return {
          success: true,
          data: this.examData,
          message: examResponse.message,
        };
      } else {
        throw new Error("Final exam not found or questions not available");
      }
    } catch (error) {
      console.error("Error loading final exam:", error);
      return {
        success: false,
        error: error.message || "Failed to load final exam",
      };
    }
  }

  async checkExamStatus(courseId) {
    try {
      const statusResponse = await Api.checkFinalExamStatus(courseId);
      return statusResponse;
    } catch (error) {
      console.error("Error checking exam status:", error);
      return { ready: false, error: error.message };
    }
  }

  async generateExam(courseId) {
    try {
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

  startExam() {
    if (this.examData && this.examStatus === "ready") {
      this.examStatus = "in_progress";
      this.currentQuestionIndex = 0;

      // Set timer - default 90 minutes (5400 seconds)
      const examDuration = this.examData.duration || 5400;
      this.timeRemaining = examDuration;

      return true;
    }
    return false;
  }

  getCurrentQuestion() {
    if (
      this.examData &&
      Array.isArray(this.examData) &&
      this.currentQuestionIndex < this.examData.length
    ) {
      return {
        question: this.examData[this.currentQuestionIndex],
        index: this.currentQuestionIndex,
        total: this.examData.length,
      };
    }
    return null;
  }

  setAnswer(questionIndex, answer) {
    if (questionIndex >= 0 && questionIndex < this.examData.length) {
      this.answers[questionIndex] = answer;
    }
  }

  getAnswer(questionIndex) {
    return this.answers[questionIndex] || null;
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
    if (index >= 0 && index < this.examData.length) {
      this.currentQuestionIndex = index;
      return true;
    }
    return false;
  }

  getAnsweredQuestions() {
    return Object.keys(this.answers).filter(
      (key) => this.answers[key] !== null && this.answers[key] !== undefined
    );
  }

  getUnansweredQuestions() {
    return Object.keys(this.answers).filter(
      (key) => this.answers[key] === null || this.answers[key] === undefined
    );
  }

  isExamComplete() {
    const totalQuestions = this.examData ? this.examData.length : 0;
    const answeredQuestions = this.getAnsweredQuestions().length;
    return answeredQuestions === totalQuestions;
  }

  // Convert option letter (A, B, C, D) to index (0, 1, 2, 3)
  convertAnswerLetterToIndex(letter) {
    if (typeof letter === "string") {
      return letter.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
    }
    return letter;
  }

  // Convert index to letter for display
  convertAnswerIndexToLetter(index) {
    if (typeof index === "number" && index >= 0) {
      return String.fromCharCode(65 + index); // 0=A, 1=B, 2=C, 3=D
    }
    return index;
  }

  async submitExam() {
    try {
      if (this.examStatus !== "in_progress") {
        throw new Error("Exam is not in progress");
      }

      // Format answers for submission - Match API expected format
      const formattedAnswers = [];

      // Iterate through all questions to build the correct format
      this.examData.forEach((question, index) => {
        const userAnswer = this.answers[index];

        // Only include answered questions
        if (userAnswer !== null && userAnswer !== undefined) {
          formattedAnswers.push({
            question:
              question.question || question.text || question.title || "",
            answer: this.convertAnswerIndexToLetter(userAnswer),
          });
        }
      });

      console.log("Formatted answers for submission:", formattedAnswers);

      // Send only the formattedAnswers array to API
      const response = await Api.submitFinalExam(
        this.courseId,
        formattedAnswers // Send only the answers array, bukan payload object
      );

      // Check if submission was successful
      // API mengembalikan response tanpa status/success property ketika berhasil
      if (response) {
        this.examStatus = "submitted";
        this.result = response.result || response.data || response;

        return {
          success: true,
          result: this.result,
        };
      } else {
        throw new Error("Failed to submit exam");
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
      return {
        success: false,
        error: error.message || "Failed to submit exam",
      };
    }
  }

  async getExamResult() {
    try {
      if (this.result) {
        return {
          success: true,
          result: this.result,
        };
      }

      const response = await Api.getFinalExamResult(this.courseId);
      this.result = response.result || response.data || response;

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
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }

  // Calculate score based on correct answers
  calculateScore() {
    let correctAnswers = 0;
    let totalQuestions = this.examData.length;

    this.examData.forEach((question, index) => {
      const userAnswer = this.answers[index];
      const correctAnswer = this.convertAnswerLetterToIndex(question.answer);

      if (userAnswer === correctAnswer) {
        correctAnswers++;
      }
    });

    return {
      correct: correctAnswers,
      total: totalQuestions,
      percentage: Math.round((correctAnswers / totalQuestions) * 100),
    };
  }

  reset() {
    this.examData = null;
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.timeRemaining = null;
    this.examStatus = "not_started";
    this.result = null;
  }
}

export default FinalExamModel;
