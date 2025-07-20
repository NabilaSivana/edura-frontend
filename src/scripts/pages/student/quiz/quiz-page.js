import QuizModel from "./quiz-model.js";
import QuizPresenter from "./quiz-presenter.js";

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

    QuizPresenter.init({
      courseId,
      sessionNumber,
      model: QuizModel,
      view: this,
    });
  },

  showLoading() {
    const box = document.getElementById("question-box");
    if (box) {
      box.innerHTML = `<p>Loading quiz...</p>`;
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
        
        <div class="text-center pt-6">
          <button onclick="window.history.back()" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Back to Study Material
          </button>
        </div>
      </div>
    `;
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
              "answer-btn px-4 py-3 border rounded-lg " +
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

  async _finishQuiz() {
    const answers = this._questions.map((q, i) => ({
      question: q.question,
      selected:
        this._selectedAnswers[i] !== null
          ? q.options[this._selectedAnswers[i]]
          : "",
    }));

    await QuizPresenter.handleSubmit({
      courseId: this.courseId,
      sessionNumber: this.sessionNumber,
      answers,
      model: QuizModel,
      view: this,
    });
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
      <p class="text-lg text-center mb-4">Course belum tersedia. Generate sekarang?</p>
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
      box.innerHTML = `<p class="text-red-600">${message}</p>`;
    }
  },
};

export default QuizPage;
