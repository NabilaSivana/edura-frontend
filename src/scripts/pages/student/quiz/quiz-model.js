import Api from "../../../data/api.js";

const QuizModel = {
  async fetchQuiz(courseId, sessionNumber) {
    return await Api.getQuiz(courseId, sessionNumber);
  },

  async generateQuiz(courseId, sessionNumber) {
    return await Api.generateQuiz(courseId, sessionNumber);
  },

  async submitQuiz(courseId, sessionNumber, answers, retry = false) {
    return await Api.submitQuiz(courseId, sessionNumber, answers, retry);
  },

  async getResult(courseId, sessionNumber) {
    return await Api.getQuizResult(courseId, sessionNumber);
  },
};

export default QuizModel;
