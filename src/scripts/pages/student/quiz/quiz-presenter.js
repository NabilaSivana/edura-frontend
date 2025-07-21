const QuizPresenter = {
  async init({ courseId, sessionNumber, model, view }) {
    view.showLoading();

    try {
      const quizQuestions = await model.fetchQuiz(courseId, sessionNumber);

      if (quizQuestions.length > 0) {
        view.renderQuiz(quizQuestions);
      } else {
        view.renderGeneratePrompt();
      }
    } catch (error) {
      view.renderGeneratePrompt();
    }
  },

  async handleGenerate({ courseId, sessionNumber, model, view }) {
    view.showLoading();
    try {
      await model.generateQuiz(courseId, sessionNumber);
      const quizQuestions = await model.fetchQuiz(courseId, sessionNumber);

      if (quizQuestions.length > 0) {
        view.renderQuiz(quizQuestions);
      } else {
        view.showError(
          "Quiz berhasil digenerate, tetapi tidak ditemukan soal."
        );
      }
    } catch (error) {
      view.showError("Gagal generate quiz. Silakan coba lagi.");
    }
  },

  async handleSubmit({ courseId, sessionNumber, answers, model, view }) {
    try {
      // Submit dengan retry=false untuk submit normal
      await model.submitQuiz(courseId, sessionNumber, answers, false);
      const result = await model.getResult(courseId, sessionNumber);
      view.showResult(result);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      view.showError("Gagal submit atau ambil hasil quiz.");
    }
  },
};

export default QuizPresenter;
