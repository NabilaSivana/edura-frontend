import QuizModel from "./quiz-model.js";
import QuizPresenter from "./quiz-presenter.js";

const QuizPage = {
  darkMode: false,

  render() {
    const mainContent = document.querySelector("#main-content");
    if (mainContent) {
      mainContent.innerHTML = `
        <div class="w-full min-h-screen bg-white dark:bg-gray-900 p-6 transition-colors duration-300">
          <div class="flex justify-between items-center mb-4">
            <button onclick="window.history.back()" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors">
              ← Back to Study Material
            </button>
            <button id="dark-mode-toggle" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors">
              ${this.darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>
          
          <div id="quiz-container">
            <h2 class="text-2xl font-semibold mb-6 text-gray-900 dark:text-white" id="quiz-title">Quiz</h2>
            <div class="flex flex-col lg:flex-row gap-6 w-full">
              <div class="flex-1 bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-700/30 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div id="question-box" class="text-center space-y-6"></div>
                <div class="flex justify-between mt-8">
                  <button id="prev-btn" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Previous</button>
                  <button id="next-btn" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Next</button>
                </div>
              </div>
              
              <div class="w-full lg:w-64 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">→ Soal Quiz</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded mb-4 overflow-hidden">
                  <div id="progress-bar" class="h-2 bg-blue-500 dark:bg-blue-400 w-0 transition-all duration-300"></div>
                </div>
                <div id="number-tracker" class="grid grid-cols-5 gap-2 text-sm"></div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
    return "";
  },

  async afterRender() {
    this.initDarkMode();

    const urlParams = new URLSearchParams(window.location.hash.split("?")[1]);
    const courseId = urlParams.get("course_id");
    const sessionNumber = parseInt(urlParams.get("session_number"));

    if (!courseId || isNaN(sessionNumber)) {
      this.showError("Error: Missing course information");
      return;
    }

    this.courseId = courseId;
    this.sessionNumber = sessionNumber;

    await this.initializeQuiz();
  },

  initDarkMode() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedDarkMode = localStorage.getItem('quizDarkMode') === 'true';
    this.darkMode = storedDarkMode !== null ? storedDarkMode : prefersDark;

    if (this.darkMode) {
      document.documentElement.classList.add('dark');
    }

    const darkModeToggle = document.getElementById("dark-mode-toggle");
    if (darkModeToggle) {
      darkModeToggle.addEventListener("click", () => this.toggleDarkMode());
    }
  },

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    document.documentElement.classList.toggle('dark', this.darkMode);

    const darkModeToggle = document.getElementById("dark-mode-toggle");
    if (darkModeToggle) {
      darkModeToggle.textContent = this.darkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
    }

    localStorage.setItem('quizDarkMode', this.darkMode);
  },

  async initializeQuiz() {
    this.showLoading();

    try {
      // Reset internal state
      this._questions = null;
      this._selectedAnswers = null;
      this._current = 0;
      this._score = null;
      this._resultData = null;

      // Cek result terlebih dahulu
      const resultResponse = await this.checkQuizResult();

      if (resultResponse && resultResponse.data) {
        //console.log('📊 Found existing quiz result');
        this.showQuizResult(resultResponse.data);
        return;
      }

      // Jika tidak ada result, cek apakah ada quiz questions
      const quizResponse = await this.checkQuizQuestions();

      if (quizResponse && quizResponse.success && quizResponse.data) {
        //console.log('📝 Found quiz questions, showing interactive quiz');
        this.showInteractiveQuiz(quizResponse.data.questions);
        return;
      }

      // Jika tidak ada quiz, tampilkan generate prompt
      //console.log('🆕 No quiz found, showing generate prompt');
      this.renderGeneratePrompt();
    } catch (error) {
      console.error('❌ Error in initializeQuiz:', error);
      this.showError("Error loading quiz data");
    }
  },

  async checkQuizResult() {
    try {
      const result = await QuizModel.getResult(this.courseId, this.sessionNumber);
      return result;
    } catch (error) {
      return null;
    }
  },

  async checkQuizQuestions() {
    try {
      const questions = await QuizModel.fetchQuiz(this.courseId, this.sessionNumber);

      if (questions && questions.length > 0) {
        return { success: true, data: { questions } };
      }
      return null;
    } catch (error) {
      return null;
    }
  },

  showQuizResult(resultData) {
    document.getElementById("quiz-title").textContent = `Quiz Chapter ${this.sessionNumber}`;
    document.getElementById("prev-btn").style.display = "none";
    document.getElementById("next-btn").style.display = "none";
    document.getElementById("progress-bar").style.width = "100%";
    document.getElementById("number-tracker").innerHTML = "";

    const container = document.getElementById("question-box");
    container.innerHTML = `
      <div class="py-8 space-y-8">
        <div class="text-center space-y-4">
          <h3 class="text-4xl font-bold text-gray-700 dark:text-gray-300 mb-4">Riwayat Quiz</h3>
          <div class="text-6xl font-bold text-gray-600 dark:text-gray-400 mb-8">Score: ${resultData.score}</div>
        </div>
        
        <div class="text-center">
          <button id="review-quiz-btn" class="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors mb-4">
            Review Jawaban
          </button>
          <button id="retry-quiz-btn" class="px-6 py-3 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors mb-4 ml-4">
            Kerjakan Ulang
          </button>
          <div class="mt-4">
            <button onclick="window.history.back()" class="px-6 py-3 bg-gray-600 dark:bg-gray-500 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors">
              Back to Study Material
            </button>
          </div>
        </div>
      </div>
    `;

    this._resultData = resultData;

    setTimeout(() => {
      const reviewBtn = document.getElementById("review-quiz-btn");
      const retryBtn = document.getElementById("retry-quiz-btn");
      
      if (reviewBtn) {
        reviewBtn.addEventListener("click", () => this.showQuizReview());
      }
      
      if (retryBtn) {
        retryBtn.addEventListener("click", () => this.handleRetryQuiz());
      }
    }, 0);
  },

  async showQuizReview() {
    if (!this._resultData) {
      this.showError("Data hasil quiz tidak ditemukan");
      return;
    }

    const container = document.getElementById("question-box");
    container.innerHTML = `
      <div class="py-8 space-y-8">
        <div class="text-center space-y-4">
          <h3 class="text-4xl font-bold text-gray-700 dark:text-gray-300 mb-4">Quiz Review</h3>
          <div class="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-8">Score: ${this._resultData.score}</div>
        </div>
        
        <div class="space-y-6">
          ${this._resultData.questions
        .map((q, index) => {
          const userAnswer = this._resultData.answers.find(
            (a) => a.question === q.question
          );
          const selectedAnswer = userAnswer ? userAnswer.selected : "No answer";
          const isCorrect = selectedAnswer === q.answer;

          return `
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-left border border-gray-200 dark:border-gray-600">
                  <h4 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">${index + 1}. ${q.question}</h4>
                  
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    ${q.options
              .map((option, i) => {
                const isThisCorrect = option === q.answer;
                const isThisSelected = option === selectedAnswer;

                let className = "px-4 py-3 border rounded-lg text-sm ";

                if (isThisCorrect) {
                  className += "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300";
                } else if (isThisSelected && !isThisCorrect) {
                  className += "border-red-500 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300";
                } else {
                  className += "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200";
                }

                return `<div class="${className}">${option}</div>`;
              })
              .join("")}
                  </div>
                  
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    <p><strong>Correct Answer:</strong> <span class="text-green-600 dark:text-green-400">${q.answer}</span></p>
                    ${selectedAnswer !== "No answer"
              ? `<p><strong>Your Answer:</strong> <span class="${isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}">${selectedAnswer}</span></p>`
              : `<p><strong>Your Answer:</strong> <span class="text-gray-500 dark:text-gray-400">No answer selected</span></p>`
            }
                  </div>
                </div>
              `;
        })
        .join("")}
        </div>
        
        <div class="text-center pt-6 space-x-4">
          <button id="retry-quiz-btn" class="px-6 py-3 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors">
            Kerjakan Ulang Quiz
          </button>
          <button onclick="window.history.back()" class="px-6 py-3 bg-gray-600 dark:bg-gray-500 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors">
            Back to Study Material
          </button>
        </div>
      </div>
    `;

    setTimeout(() => {
      const retryBtn = document.getElementById("retry-quiz-btn");
      if (retryBtn) {
        retryBtn.addEventListener("click", () => this.handleRetryQuiz());
      }
    }, 0);
  },

  async handleRetryQuiz() {
    this.showLoading();

    try {
      //console.log('🔄 Starting quiz retry...');
      
      // Reset internal state
      this._questions = null;
      this._selectedAnswers = null;
      this._current = 0;
      this._score = null;
      this._resultData = null;

      // Use improved retry method
      const newQuestions = await QuizModel.retryQuiz(this.courseId, this.sessionNumber);

      if (newQuestions && newQuestions.length > 0) {
        //console.log('✅ Got new questions, showing interactive quiz');
        this.showInteractiveQuiz(newQuestions);
      } else {
        this.showError('Gagal memuat soal kuis yang baru. Silakan muat ulang halaman.');
      }
    } catch (error) {
      console.error('❌ Error retrying quiz:', error);
      this.showError(`Terjadi kesalahan saat mencoba ulang kuis: ${error.message}`);
    }
  },

  showInteractiveQuiz(questions) {
    document.getElementById("quiz-title").textContent = `Quiz Chapter ${this.sessionNumber}`;
    this.renderQuiz(questions);
  },

  showLoading() {
    const box = document.getElementById("question-box");
    if (box) {
      box.innerHTML = `
        <div class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
          <p class="mt-4 text-gray-700 dark:text-gray-300">Loading quiz...</p>
        </div>
      `;
    }
  },

  showError(message) {
    const box = document.getElementById("question-box");
    if (box) {
      box.innerHTML = `
        <div class="text-center py-8">
          <div class="text-red-600 dark:text-red-400 text-lg font-semibold">${message}</div>
          <button onclick="window.location.reload()" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Reload Page
          </button>
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

    document.getElementById("prev-btn").style.display = "inline-block";
    document.getElementById("next-btn").style.display = "inline-block";

    if (this._score !== null) {
      this._renderCompletionScreen();
      return;
    }

    this._renderQuestion();
    this._renderProgressBar();
    this._renderNumberTracker();

    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");

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

    document.getElementById("prev-btn").style.display = "none";
    document.getElementById("next-btn").style.display = "none";
    document.getElementById("progress-bar").style.width = "100%";
    document.getElementById("quiz-title").textContent = `Quiz Chapter ${this.sessionNumber}`;

    container.innerHTML = `
      <div class="py-8 space-y-8">
        <div class="text-center space-y-4">
          <h3 class="text-4xl font-bold text-gray-700 dark:text-gray-300 mb-4">Quiz Completed!</h3>
          <div class="text-6xl font-bold text-gray-600 dark:text-gray-400 mb-8">Score: ${this._score}</div>
        </div>
        
        <div class="space-y-6">
          ${this._questions
        .map((q, index) => {
          const selectedIdx = this._selectedAnswers[index];
          const selectedAnswer = selectedIdx !== null ? q.options[selectedIdx] : "No answer";
          const isCorrect = selectedAnswer === q.answer;

          return `
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-left border border-gray-200 dark:border-gray-600">
                  <h4 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">${index + 1}. ${q.question}</h4>
                  
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    ${q.options
              .map((option, i) => {
                const isThisCorrect = option === q.answer;
                const isThisSelected = selectedIdx === i;

                let className = "px-4 py-3 border rounded-lg text-sm ";

                if (isThisCorrect) {
                  className += "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300";
                } else if (isThisSelected && !isThisCorrect) {
                  className += "border-red-500 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300";
                } else {
                  className += "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200";
                }

                return `<div class="${className}">${option}</div>`;
              })
              .join("")}
                  </div>
                  
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    <p><strong>Correct Answer:</strong> <span class="text-green-600 dark:text-green-400">${q.answer}</span></p>
                    ${selectedAnswer !== "No answer"
              ? `<p><strong>Your Answer:</strong> <span class="${isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}">${selectedAnswer}</span></p>`
              : `<p><strong>Your Answer:</strong> <span class="text-gray-500 dark:text-gray-400">No answer selected</span></p>`
            }
                  </div>
                </div>
              `;
        })
        .join("")}
        </div>
        
        <div class="text-center pt-6 space-x-4">
          <button id="retry-again-btn" class="px-6 py-3 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors">
            Kerjakan Ulang Lagi
          </button>
          <button onclick="window.history.back()" class="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
            Back to Study Material
          </button>
        </div>
      </div>
    `;

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
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6">${this._current + 1}. ${q.question}</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        ${q.options
        .map((choice, i) => {
          const isSelected = selectedIdx === i;
          const baseClasses = "answer-btn px-4 py-3 border rounded-lg cursor-pointer text-left transition-colors ";
          const selectedClasses = isSelected
            ? "border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
            : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-500";

          return `<button class="${baseClasses}${selectedClasses}" data-index="${i}">${choice}</button>`;
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

      let className = "border rounded px-2 py-1 text-sm transition-colors ";

      if (isCurrent) {
        className += "border-blue-600 dark:border-blue-400 font-semibold ";
      } else {
        className += "border-gray-300 dark:border-gray-600 ";
      }

      if (isSelected) {
        className += "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200";
      } else {
        className += "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-500";
      }

      btn.className = className;

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

    try {
      // Use the new submitAndGetFreshResult method
      const { submitResponse, result } = await QuizModel.submitAndGetFreshResult(
        this.courseId,
        this.sessionNumber,
        answers,
        false
      );

      if (result && result.data) {
        //console.log('✅ Got fresh result after submit:', result.data.score);
        this.renderQuiz(
          result.data.questions,
          result.data.answers,
          result.data.score
        );
      } else {
        this.showError("Gagal mengambil hasil quiz");
      }
    } catch (error) {
      console.error('❌ Error finishing quiz:', error);
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
      <p class="text-lg text-center mb-4 text-gray-700 dark:text-gray-300">Kuis untuk chapter ini belum tersedia.</p>
      <div class="text-center">
        <button id="generate-quiz-btn" class="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
          ✨ Generate Quiz Sekarang
        </button>
      </div>
    `;

    document.getElementById("prev-btn").style.display = "none";
    document.getElementById("next-btn").style.display = "none";

    const generateBtn = document.getElementById("generate-quiz-btn");

    generateBtn.addEventListener("click", async () => {
      this.showLoading();
      generateBtn.disabled = true;

      try {
        const questions = await QuizPresenter.handleGenerate({
          courseId: this.courseId,
          sessionNumber: this.sessionNumber,
          model: QuizModel,
        });

        if (questions && questions.length > 0) {
          this.showInteractiveQuiz(questions);
        } else {
          this.showError("Kuis berhasil digenerate, tetapi gagal memuat soal. Silakan coba lagi.");
        }
      } catch (error) {
        console.error('❌ Error generating quiz:', error);
        this.showError("Terjadi kesalahan saat membuat kuis. Silakan coba lagi.");
        generateBtn.disabled = false;
      }
    });
  },
};

export default QuizPage;