const QuizPresenter = {
  async init({ courseId, sessionNumber, model, view }) {
    view.showLoading();

    try {
      // Clear cache untuk memastikan data fresh
      await model.clearAllQuizCache(courseId, sessionNumber);
      
      const quizQuestions = await model.fetchQuiz(courseId, sessionNumber, true);

      if (quizQuestions.length > 0) {
        view.renderQuiz(quizQuestions);
      } else {
        view.renderGeneratePrompt();
      }
    } catch (error) {
      console.error('❌ Error in QuizPresenter.init:', error);
      view.renderGeneratePrompt();
    }
  },

  async handleGenerate({ courseId, sessionNumber, model }) {
    try {
      //console.log('🎯 Generating quiz...');
      
      // 1. Clear cache sebelum generate
      await model.clearAllQuizCache(courseId, sessionNumber);
      
      // 2. Generate kuis di backend (POST)
      const generateResponse = await model.generateQuiz(courseId, sessionNumber);
      //console.log('✅ Quiz generated:', generateResponse);

      // 3. Wait sedikit untuk server processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 4. Ambil kuis yang baru dibuat dengan force refresh
      const quizQuestions = await model.fetchQuiz(courseId, sessionNumber, true);
      
      if (!quizQuestions || quizQuestions.length === 0) {
        throw new Error('Generated quiz has no questions');
      }

      //console.log('✅ Quiz questions fetched:', quizQuestions.length);
      return quizQuestions;
      
    } catch (error) {
      console.error('❌ Error in handleGenerate:', error);
      throw new Error(`Failed to generate quiz: ${error.message}`);
    }
  },

  async handleSubmit({ courseId, sessionNumber, answers, model, view }) {
    try {
      //console.log('📤 Submitting quiz answers...');
      
      // Submit dengan retry=false untuk submit normal
      // Menggunakan method baru yang langsung return fresh result
      const { submitResponse, result } = await model.submitAndGetFreshResult(
        courseId, 
        sessionNumber, 
        answers, 
        false
      );

      if (result && result.data) {
        //console.log('✅ Quiz submitted and result retrieved:', result.data.score);
        view.showResult(result);
      } else {
        throw new Error('No result data received after submit');
      }
      
    } catch (error) {
      console.error("❌ Error submitting quiz:", error);
      view.showError(`Gagal submit quiz: ${error.message}`);
    }
  },

  async handleRetry({ courseId, sessionNumber, model, view }) {
    try {
      //console.log('🔄 Handling quiz retry...');
      view.showLoading();
      
      // Use model's retry method yang sudah improved
      const newQuestions = await model.retryQuiz(courseId, sessionNumber);
      
      if (newQuestions && newQuestions.length > 0) {
        //console.log('✅ Retry successful, showing new questions');
        view.renderQuiz(newQuestions);
      } else {
        throw new Error('No questions received after retry');
      }
      
    } catch (error) {
      console.error('❌ Error in handleRetry:', error);
      view.showError(`Gagal retry quiz: ${error.message}`);
    }
  },

  // Method untuk refresh data setelah operations
  async refreshQuizData({ courseId, sessionNumber, model }) {
    try {
      await model.clearAllQuizCache(courseId, sessionNumber);
      
      // Check apakah ada result terbaru
      const result = await model.getResult(courseId, sessionNumber, true);
      if (result && result.data) {
        return { type: 'result', data: result.data };
      }
      
      // Jika tidak ada result, ambil questions
      const questions = await model.fetchQuiz(courseId, sessionNumber, true);
      if (questions && questions.length > 0) {
        return { type: 'questions', data: questions };
      }
      
      // Jika tidak ada apa-apa
      return { type: 'empty', data: null };
      
    } catch (error) {
      console.error('❌ Error refreshing quiz data:', error);
      return { type: 'error', data: error.message };
    }
  }
};

export default QuizPresenter;