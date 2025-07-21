import QuizModel from "./quiz-model.js";
import QuizPresenter from "./quiz-presenter.js";
import API from "../../../data/api.js";

const QuizPage = {
  render() {
    const mainContent = document.querySelector("#main-content");
    if (mainContent) {
      mainContent.innerHTML = `
          <button onclick="window.history.back()" class="mb-4 px-4 py-2 border rounded text-sm hover:bg-gray-100">
            ← Back to Study Material
          </button>
        <div class="w-full min-h-screen bg-white p-6 flex flex-col" id="quiz-container">
          <h2 class="text-2xl font-semibold mb-6" id="quiz-title">Quiz</h2>
          <div class="flex flex-col lg:flex-row gap-6 w-full">
            <div class="flex-1 bg-white shadow rounded p-6">
              <div id="question-box" class="text-center space-y-6"></div>
              <div class="flex justify-between mt-8">
                <button id="prev-btn" class="px-4 py-2 border rounded text-blue-600 hover:bg-gray-100">Previous</button>
                <button id="next-btn" class="px-4 py-2 border rounded text-blue-600 hover:bg-gray-100">Next</button>
              </div>
            </div>
            <div class="w-full lg:w-64 border rounded p-4 shadow-sm">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-semibold">→ Soal Quiz</span>
              </div>
              <div class="w-full bg-gray-200 h-2 rounded mb-4 overflow-hidden">
                <div id="progress-bar" class="h-2 bg-blue-500 w-0 transition-all duration-300"></div>
              </div>
              <div id="number-tracker" class="grid grid-cols-5 gap-2 text-sm"></div>
            </div>
          </div>
        </div>
      `;
    }
    return "";
  },

  async afterRender() {
    const urlParams = new URLSearchParams(window.location.hash.split("?")[1]);
    const courseId = urlParams.get("course_id");
    const sessionNumber = parseInt(urlParams.get("session_number"));

    if (!courseId || isNaN(sessionNumber)) {
      this.showError("Error: Missing course information");
      return;
    }

    this.courseId = courseId;
    this.sessionNumber = sessionNumber;

    // Start the quiz loading flow
    await this.initializeQuiz();
  },

  async initializeQuiz() {
    this.showLoading();

    try {
      // Step 1: Check if quiz result already exists
      const resultResponse = await this.checkQuizResult();

      if (resultResponse && resultResponse.data) {
        // Quiz result exists - show the completed quiz with results
        this.showQuizResult(resultResponse.data);
        return;
      }

      // Step 2: Quiz result doesn't exist, check if quiz questions exist
      const quizResponse = await this.checkQuizQuestions();

      if (quizResponse && quizResponse.success && quizResponse.data) {
        // Quiz questions exist - show interactive quiz
        this.showInteractiveQuiz(quizResponse.data.questions);
        return;
      }

      // Step 3: Neither result nor quiz exists - show generate prompt
      this.renderGeneratePrompt();
    } catch (error) {
      console.error("Error initializing quiz:", error);
      this.showError("Error loading quiz data");
    }
  },

  async checkQuizResult() {
    try {
      const result = await API.getQuizResult(this.courseId, this.sessionNumber);
      return result;
    } catch (error) {
      console.error("Error checking quiz result:", error);
      return null;
    }
  },

  async checkQuizQuestions() {
    try {
      const questions = await API.getQuiz(this.courseId, this.sessionNumber);
      if (questions && questions.length > 0) {
        return { success: true, data: { questions } };
      }
      return null;
    } catch (error) {
      console.error("Error checking quiz questions:", error);
      return null;
    }
  },

  showQuizResult(resultData) {
    // Update title to show session number
    document.getElementById(
      "quiz-title"
    ).textContent = `Quiz Chapter ${this.sessionNumber}`;

    // Hide navigation buttons
    document.getElementById("prev-btn").style.display = "none";
    document.getElementById("next-btn").style.display = "none";

    // Set progress to 100%
    document.getElementById("progress-bar").style.width = "100%";

    // Clear number tracker
    document.getElementById("number-tracker").innerHTML = "";

    const container = document.getElementById("question-box");
    container.innerHTML = `
      <div class="py-8 space-y-8">
        <div class="text-center space-y-4">
          <h3 class="text-4xl font-bold text-gray-700 mb-4">Riwayat Quiz</h3>
          <div class="text-6xl font-bold text-gray-600 mb-8">Score: ${resultData.score}</div>
        </div>
        
        <div class="text-center">
          <button id="review-quiz-btn" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-4">
            Kerjakan Ulang
          </button>
          <div class="mt-4">
            <button onclick="window.history.back()" class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Back to Study Material
            </button>
          </div>
        </div>
      </div>
    `;

    // Store result data for potential review
    this._resultData = resultData;

    // Add event listener for review button
    setTimeout(() => {
      const reviewBtn = document.getElementById("review-quiz-btn");
      if (reviewBtn) {
        reviewBtn.addEventListener("click", () => this.handleRetryQuiz());
      }
    }, 0);
  },

  async showQuizReview() {
    if (!this._resultData) return;

    // Show detailed review similar to completion screen
    const container = document.getElementById("question-box");
    container.innerHTML = `
      <div class="py-8 space-y-8">
        <div class="text-center space-y-4">
          <h3 class="text-4xl font-bold text-gray-700 mb-4">Quiz Review</h3>
          <div class="text-2xl font-bold text-gray-600 mb-8">Previous Score: ${
            this._resultData.score
          }</div>
        </div>
        
        <div class="space-y-6">
          ${this._resultData.questions
            .map((q, index) => {
              const userAnswer = this._resultData.answers.find(
                (a) => a.question === q.question
              );
              const selectedAnswer = userAnswer
                ? userAnswer.selected
                : "No answer";
              const isCorrect = selectedAnswer === q.answer;

              return `
            <div class="bg-gray-50 rounded-lg p-6 text-left">
              <h4 class="text-lg font-semibold mb-4">${index + 1}. ${
                q.question
              }</h4>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                ${q.options
                  .map((option, i) => {
                    const isThisCorrect = option === q.answer;
                    const isThisSelected = option === selectedAnswer;

                    let className = "px-4 py-3 border rounded-lg text-sm ";

                    if (isThisCorrect) {
                      className +=
                        "border-green-500 bg-green-50 text-green-800";
                    } else if (isThisSelected && !isThisCorrect) {
                      className += "border-red-500 bg-red-50 text-red-800";
                    } else {
                      className += "border-gray-300 bg-white text-gray-700";
                    }

                    return `<div class="${className}">${option}</div>`;
                  })
                  .join("")}
              </div>
              
              <div class="text-sm text-gray-600">
                <p><strong>Correct Answer:</strong> <span class="text-green-600">${
                  q.answer
                }</span></p>
                ${
                  selectedAnswer !== "No answer"
                    ? `<p><strong>Your Answer:</strong> <span class="${
                        isCorrect ? "text-green-600" : "text-red-600"
                      }">${selectedAnswer}</span></p>`
                    : `<p><strong>Your Answer:</strong> <span class="text-gray-500">No answer selected</span></p>`
                }
              </div>
            </div>
          `;
            })
            .join("")}
        </div>
        
        <div class="text-center pt-6 space-x-4">
          <button id="retry-quiz-btn" class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Kerjakan Ulang Quiz
          </button>
          <button onclick="window.history.back()" class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            Back to Study Material
          </button>
        </div>
      </div>
    `;

    // Add event listener for retry button
    setTimeout(() => {
      const retryBtn = document.getElementById("retry-quiz-btn");
      if (retryBtn) {
        retryBtn.addEventListener("click", () => this.handleRetryQuiz());
      }
    }, 0);
  },

  // ALTERNATIVE: Simple retry approach - just fetch new questions
  async handleRetryQuiz() {
    this.showLoading();

    try {
      // Reset frontend state
      this._resultData = null;
      this._score = null;
      this._selectedAnswers = null;
      this._questions = null;
      this._current = 0;

      // According to your backend documentation, calling getQuiz after a completed quiz
      // should return new random questions. Let's try this approach first.
      console.log("Fetching new quiz questions for retry...");
      const questions = await API.getQuiz(this.courseId, this.sessionNumber);

      if (questions && questions.length > 0) {
        // Show interactive quiz with new questions
        this.showInteractiveQuiz(questions);
        return;
      }

      // If simple fetch doesn't work, try the submit with retry approach
      console.log("Simple fetch failed, trying submit with retry...");

      const dummyAnswers = [
        {
          question: "dummy",
          selected: "dummy",
        },
      ];

      await QuizModel.submitQuiz(
        this.courseId,
        this.sessionNumber,
        dummyAnswers,
        true // retry = true
      );

      // Fetch questions after retry submit
      const retryQuestions = await API.getQuiz(
        this.courseId,
        this.sessionNumber
      );

      if (retryQuestions && retryQuestions.length > 0) {
        this.showInteractiveQuiz(retryQuestions);
      } else {
        this.showError("Unable to load new quiz questions");
      }
    } catch (error) {
      console.error("Error retrying quiz:", error);
      this.showError(`Failed to retry quiz: ${error.message}`);
    }
  },

  showInteractiveQuiz(questions) {
    // Reset title
    document.getElementById(
      "quiz-title"
    ).textContent = `Quiz Chapter ${this.sessionNumber}`;

    // Initialize quiz with the new questions
    this.renderQuiz(questions);
  },

  showLoading() {
    const box = document.getElementById("question-box");
    if (box) {
      box.innerHTML = `
        <div class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-4">Loading quiz...</p>
        </div>
      `;
    }
  },

  renderQuiz(questions, answers = [], score = null) {
    this._questions = questions;
    this._score = score;
    this._selectedAnswers = answers.length
      ? questions.map((q) => {
          const ans = answers.find((a) => a.question === q.question);
          return ans ? q.options.indexOf(ans.selected) : null;
        })
      : new Array(questions.length).fill(null);
    this._current = 0;

    // Reset button visibility
    document.getElementById("prev-btn").style.display = "inline-block";
    document.getElementById("next-btn").style.display = "inline-block";

    // If quiz is completed, show completion screen
    if (this._score !== null) {
      this._renderCompletionScreen();
      return;
    }

    this._renderQuestion();
    this._renderProgressBar();
    this._renderNumberTracker();

    // Remove existing event listeners before adding new ones
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");

    // Clone nodes to remove all event listeners
    const newPrevBtn = prevBtn.cloneNode(true);
    const newNextBtn = nextBtn.cloneNode(true);

    prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
    nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);

    document.getElementById("prev-btn").addEventListener("click", () => {
      if (this._current > 0) {
        this._current--;
        this._renderQuestion();
        this._renderNumberTracker();
      }
    });

    document.getElementById("next-btn").addEventListener("click", () => {
      if (this._current === this._questions.length - 1) {
        if (this._score !== null) return;
        this._finishQuiz();
      } else {
        this._current++;
        this._renderQuestion();
        this._renderNumberTracker();
      }
    });
  },

  _renderCompletionScreen() {
    const container = document.getElementById("question-box");

    // Hide navigation buttons
    document.getElementById("prev-btn").style.display = "none";
    document.getElementById("next-btn").style.display = "none";

    // Update progress bar to 100%
    document.getElementById("progress-bar").style.width = "100%";

    // Update title
    document.getElementById(
      "quiz-title"
    ).textContent = `Quiz Chapter ${this.sessionNumber}`;

    container.innerHTML = `
      <div class="py-8 space-y-8">
        <div class="text-center space-y-4">
          <h3 class="text-4xl font-bold text-gray-700 mb-4">Quiz Completed!</h3>
          <div class="text-6xl font-bold text-gray-600 mb-8">Score: ${
            this._score
          }</div>
        </div>
        
        <div class="space-y-6">
          ${this._questions
            .map((q, index) => {
              const selectedIdx = this._selectedAnswers[index];
              const selectedAnswer =
                selectedIdx !== null ? q.options[selectedIdx] : "No answer";
              const isCorrect = selectedAnswer === q.answer;

              return `
              <div class="bg-gray-50 rounded-lg p-6 text-left">
                <h4 class="text-lg font-semibold mb-4">${index + 1}. ${
                q.question
              }</h4>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  ${q.options
                    .map((option, i) => {
                      const isThisCorrect = option === q.answer;
                      const isThisSelected = selectedIdx === i;

                      let className = "px-4 py-3 border rounded-lg text-sm ";

                      if (isThisCorrect) {
                        className +=
                          "border-green-500 bg-green-50 text-green-800";
                      } else if (isThisSelected && !isThisCorrect) {
                        className += "border-red-500 bg-red-50 text-red-800";
                      } else {
                        className += "border-gray-300 bg-white text-gray-700";
                      }

                      return `<div class="${className}">${option}</div>`;
                    })
                    .join("")}
                </div>
                
                <div class="text-sm text-gray-600">
                  <p><strong>Correct Answer:</strong> <span class="text-green-600">${
                    q.answer
                  }</span></p>
                  ${
                    selectedAnswer !== "No answer"
                      ? `<p><strong>Your Answer:</strong> <span class="${
                          isCorrect ? "text-green-600" : "text-red-600"
                        }">${selectedAnswer}</span></p>`
                      : `<p><strong>Your Answer:</strong> <span class="text-gray-500">No answer selected</span></p>`
                  }
                </div>
              </div>
            `;
            })
            .join("")}
        </div>
        
        <div class="text-center pt-6 space-x-4">
          <button id="retry-again-btn" class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Kerjakan Ulang Lagi
          </button>
          <button onclick="window.history.back()" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Back to Study Material
          </button>
        </div>
      </div>
    `;

    // Add event listener for retry again button
    setTimeout(() => {
      const retryAgainBtn = document.getElementById("retry-again-btn");
      if (retryAgainBtn) {
        retryAgainBtn.addEventListener("click", () => this.handleRetryQuiz());
      }
    }, 0);
  },

  _renderQuestion() {
    const q = this._questions[this._current];
    const container = document.getElementById("question-box");
    const selectedIdx = this._selectedAnswers[this._current];

    container.innerHTML = `
      <h3 class="text-xl font-bold">${this._current + 1}. ${q.question}</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        ${q.options
          .map((choice, i) => {
            const isSelected = selectedIdx === i;
            const base =
              "answer-btn px-4 py-3 border rounded-lg cursor-pointer " +
              (isSelected ? "border-blue-600 bg-blue-50" : "hover:bg-gray-100");

            return `<button class="${base}" data-index="${i}">${choice}</button>`;
          })
          .join("")}
      </div>
    `;

    container.querySelectorAll(".answer-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = parseInt(e.currentTarget.dataset.index);
        this._selectedAnswers[this._current] = index;
        this._renderQuestion();
        this._renderProgressBar();
        this._renderNumberTracker();
      });
    });

    document.getElementById("prev-btn").disabled = this._current === 0;
    document.getElementById("next-btn").innerText =
      this._current === this._questions.length - 1 ? "Finish" : "Next";
  },

  _renderProgressBar() {
    const progress = this._selectedAnswers.filter((a) => a !== null).length;
    const percent = (progress / this._questions.length) * 100;
    document.getElementById("progress-bar").style.width = `${percent}%`;
  },

  _renderNumberTracker() {
    const tracker = document.getElementById("number-tracker");
    tracker.innerHTML = "";

    this._questions.forEach((_, index) => {
      const isSelected = this._selectedAnswers[index] !== null;
      const isCurrent = index === this._current;

      const btn = document.createElement("button");
      btn.textContent = index + 1;
      btn.className =
        "border rounded px-2 py-1 hover:bg-gray-100 " +
        (isSelected ? "bg-blue-100" : "bg-white") +
        (isCurrent ? " border-blue-600 font-semibold" : "");

      btn.addEventListener("click", () => {
        this._current = index;
        this._renderQuestion();
        this._renderNumberTracker();
      });

      tracker.appendChild(btn);
    });
  },

  // FIXED: Submit with retry = false for normal quiz submission
  async _finishQuiz() {
    const answers = this._questions.map((q, i) => ({
      question: q.question,
      selected:
        this._selectedAnswers[i] !== null
          ? q.options[this._selectedAnswers[i]]
          : "",
    }));

    try {
      // Submit with retry = false for normal quiz completion
      const result = await QuizModel.submitQuiz(
        this.courseId,
        this.sessionNumber,
        answers,
        false
      );

      // Get quiz result
      const quizResult = await QuizModel.getResult(
        this.courseId,
        this.sessionNumber
      );

      if (quizResult && quizResult.data) {
        this.renderQuiz(
          quizResult.data.questions,
          quizResult.data.answers,
          quizResult.data.score
        );
      } else {
        this.showError("Gagal mengambil hasil quiz");
      }
    } catch (error) {
      console.error("Error finishing quiz:", error);
      this.showError("Gagal menyelesaikan quiz. Silakan coba lagi.");
    }
  },

  showResult(result) {
    if (!result || !result.data) {
      this.showError("Tidak ada hasil untuk quiz ini.");
      return;
    }

    this.renderQuiz(
      result.data.questions,
      result.data.answers,
      result.data.score
    );
  },

  renderGeneratePrompt() {
    const box = document.getElementById("question-box");
    box.innerHTML = `
      <p class="text-lg text-center mb-4">Quiz belum tersedia. Generate sekarang?</p>
      <div class="text-center">
        <button id="generate-quiz-btn" class="px-4 py-2 border rounded text-blue-600 hover:bg-gray-100">Generate Quiz</button>
      </div>
    `;

    document.getElementById("prev-btn").style.display = "none";
    document.getElementById("next-btn").style.display = "none";

    document
      .getElementById("generate-quiz-btn")
      .addEventListener("click", async () => {
        await QuizPresenter.handleGenerate({
          courseId: this.courseId,
          sessionNumber: this.sessionNumber,
          model: QuizModel,
          view: this,
        });
      });
  },

  showError(message) {
    const box = document.getElementById("question-box");
    if (box) {
      box.innerHTML = `<p class="text-red-600 text-center py-8">${message}</p>`;
    }
  },
};

export default QuizPage;
