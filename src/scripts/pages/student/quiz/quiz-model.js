// // src/pages/quiz/quiz-model.js
// import Api from "../../../data/api.js";

// const QuizModel = {
//   async fetchQuiz(courseId, sessionNumber, forceRefresh = false) {
//     return await Api.getQuiz(courseId, sessionNumber, forceRefresh);
//   },

//   async generateQuiz(courseId, sessionNumber) {
//     return await Api.generateQuiz(courseId, sessionNumber);
//   },

//   async submitQuiz(courseId, sessionNumber, answers, retry = false) {
//     return await Api.submitQuiz(courseId, sessionNumber, answers, retry);
//   },

//   async getResult(courseId, sessionNumber, forceRefresh = false) {
//     // Force refresh untuk memastikan data result terbaru
//     if (forceRefresh) {
//       await Api._invalidateQuizCache(courseId, sessionNumber);
//     }
//     return await Api.getQuizResult(courseId, sessionNumber);
//   },

//   // Revised retry logic
//   async retryQuiz(courseId, sessionNumber) {
//     try {
//       console.log(`🔄 Memulai retry kuis untuk course ${courseId}, sesi ${sessionNumber}`);

//       // 1. Clear semua cache quiz terlebih dahulu
//       await this.clearAllQuizCache(courseId, sessionNumber);

//       // 2. Kirim permintaan retry ke backend
//       const retryResponse = await this.submitQuiz(courseId, sessionNumber, [], true);

//       // 3. Pastikan backend mengembalikan soal baru dalam response retry
//       if (retryResponse?.data?.questions) {
//         console.log('✅ Mendapat soal baru dari retry response:', retryResponse.data.questions.length);
//         return retryResponse.data.questions;
//       }

//       // 4. Jika tidak ada soal di response, fetch dengan force refresh
//       console.log('🔍 Mengambil soal dengan force refresh...');
//       await new Promise(resolve => setTimeout(resolve, 1000)); // Beri waktu server

//       const freshQuestions = await this.fetchQuiz(courseId, sessionNumber, true);

//       if (!freshQuestions || freshQuestions.length === 0) {
//         throw new Error('Gagal mendapatkan soal baru setelah retry.');
//       }

//       console.log('✅ Berhasil mendapatkan soal baru:', freshQuestions.length);
//       return freshQuestions;

//     } catch (error) {
//       console.error('❌ Terjadi kesalahan saat retry kuis:', error);
//       throw new Error(`Gagal mencoba ulang kuis: ${error.message}`);
//     }
//   },

//   // Clear semua cache yang berhubungan dengan quiz
//   async clearAllQuizCache(courseId, sessionNumber) {
//     try {
//       console.log('🧹 Clearing all quiz cache...');

//       // Clear cache spesifik untuk quiz ini
//       if (Api._invalidateQuizCache) {
//         await Api._invalidateQuizCache(courseId, sessionNumber);
//       }

//       // Clear cache patterns yang lebih luas
//       await Api._invalidateCache('student/quiz');
//       await Api._invalidateCache('student/quiz/result');

//       // Clear cache dengan pattern spesifik
//       const cacheKeys = [
//         `api_student/quiz_course_id=${courseId}&session_number=${sessionNumber}`,
//         `api_student/quiz/result_course_id=${courseId}&session_number=${sessionNumber}`,
//         `api_student/quiz_course_id=${courseId}`,
//         `api_student/quiz/result_course_id=${courseId}`
//       ];

//       for (const key of cacheKeys) {
//         await Api.Cache?.remove?.(key);
//       }

//       console.log('✅ All quiz cache cleared');
//     } catch (error) {
//       console.error('❌ Error clearing quiz cache:', error);
//     }
//   },

//   // Method untuk submit dan langsung ambil result terbaru
//   async submitAndGetFreshResult(courseId, sessionNumber, answers, retry = false) {
//     try {
//       // Submit quiz
//       const submitResponse = await this.submitQuiz(courseId, sessionNumber, answers, retry);

//       // Clear cache result sebelum mengambil yang baru
//       await this.clearResultCache(courseId, sessionNumber);

//       // Wait sedikit untuk memastikan backend selesai processing
//       await new Promise(resolve => setTimeout(resolve, 500));

//       // Ambil result dengan force refresh
//       const result = await this.getResult(courseId, sessionNumber, true);

//       return { submitResponse, result };
//     } catch (error) {
//       console.error('❌ Error in submitAndGetFreshResult:', error);
//       throw error;
//     }
//   },

//   // Clear cache result saja
//   async clearResultCache(courseId, sessionNumber) {
//     try {
//       const resultCacheKeys = [
//         `api_student/quiz/result_course_id=${courseId}&session_number=${sessionNumber}`,
//         `api_student/quiz/result_course_id=${courseId}`
//       ];

//       for (const key of resultCacheKeys) {
//         await Api.Cache?.remove?.(key);
//       }

//       console.log('✅ Result cache cleared');
//     } catch (error) {
//       console.error('❌ Error clearing result cache:', error);
//     }
//   },

//   // Method untuk debug - check quiz status
//   async checkQuizStatus(courseId, sessionNumber) {
//     try {
//       const result = await Api.getQuizResult(courseId, sessionNumber);
//       console.log('Current quiz status:', result);
//       return result;
//     } catch (error) {
//       console.log('No quiz result found (normal for fresh quiz)');
//       return null;
//     }
//   }
// };

// export default QuizModel;
// src/pages/quiz/quiz-model.js
import Api from "../../../data/api.js";

const QuizModel = {
  async fetchQuiz(courseId, sessionNumber, forceRefresh = false) {
    return await Api.getQuiz(courseId, sessionNumber, forceRefresh);
  },

  async generateQuiz(courseId, sessionNumber) {
    return await Api.generateQuiz(courseId, sessionNumber);
  },

  async submitQuiz(courseId, sessionNumber, answers, retry = false) {
    return await Api.submitQuiz(courseId, sessionNumber, answers, retry);
  },

  async getResult(courseId, sessionNumber, forceRefresh = false) {
    return await Api.getQuizResult(courseId, sessionNumber, forceRefresh);
  },

  // Revised retry logic using new API
  async retryQuiz(courseId, sessionNumber) {
    try {
      console.log(`🔄 Memulai retry kuis untuk course ${courseId}, sesi ${sessionNumber}`);

      // 1. Clear semua cache quiz terlebih dahulu menggunakan API baru
      await this.clearAllQuizCache(courseId, sessionNumber);

      // 2. Kirim permintaan retry ke backend
      const retryResponse = await Api.submitQuiz(courseId, sessionNumber, [], true);

      // 3. Pastikan backend mengembalikan soal baru dalam response retry
      if (retryResponse?.data?.questions) {
        console.log('✅ Mendapat soal baru dari retry response:', retryResponse.data.questions.length);
        return retryResponse.data.questions;
      }

      // 4. Jika tidak ada soal di response, fetch dengan force refresh
      console.log('🔍 Mengambil soal dengan force refresh...');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Beri waktu server

      const freshQuestions = await Api.getQuiz(courseId, sessionNumber, true);

      if (!freshQuestions || freshQuestions.length === 0) {
        throw new Error('Gagal mendapatkan soal baru setelah retry.');
      }

      console.log('✅ Berhasil mendapatkan soal baru:', freshQuestions.length);
      return freshQuestions;

    } catch (error) {
      console.error('❌ Terjadi kesalahan saat retry kuis:', error);
      throw new Error(`Gagal mencoba ulang kuis: ${error.message}`);
    }
  },

  // Clear semua cache yang berhubungan dengan quiz menggunakan API baru
  async clearAllQuizCache(courseId, sessionNumber) {
    try {
      console.log('🧹 Clearing all quiz cache...');

      // Gunakan method dari API baru yang sudah ada
      await Api.clearAllQuizRelatedCache(courseId, sessionNumber);

      console.log('✅ All quiz cache cleared');
    } catch (error) {
      console.error('❌ Error clearing quiz cache:', error);
      // Don't throw error, just log it as cache clearing is not critical
    }
  },

  // Method untuk submit dan langsung ambil result terbaru menggunakan API baru
  async submitAndGetFreshResult(courseId, sessionNumber, answers, retry = false) {
    try {
      // Gunakan method yang sudah ada di API baru
      const result = await Api.submitQuizAndGetFreshResult(courseId, sessionNumber, answers, retry);
      return result;
    } catch (error) {
      console.error('❌ Error in submitAndGetFreshResult:', error);
      throw error;
    }
  },

  // Clear cache result saja menggunakan API baru
  async clearResultCache(courseId, sessionNumber) {
    try {
      // Gunakan utility method dari API baru
      await Api.clearCachePattern(`quiz/result_course_id=${courseId}&session_number=${sessionNumber}`);
      await Api.clearCachePattern(`quiz/result_course_id=${courseId}`);

      console.log('✅ Result cache cleared');
    } catch (error) {
      console.error('❌ Error clearing result cache:', error);
      // Don't throw error, just log it
    }
  },

  // Method untuk debug - check quiz status
  async checkQuizStatus(courseId, sessionNumber) {
    try {
      const result = await Api.getQuizResult(courseId, sessionNumber);
      console.log('Current quiz status:', result);
      return result;
    } catch (error) {
      console.log('No quiz result found (normal for fresh quiz)');
      return null;
    }
  },

  // Additional helper methods using new API

  // Method untuk cek status quiz dengan retry
  async checkQuizStatusWithRetry(courseId, sessionNumber, maxRetries = 3) {
    try {
      return await Api.retryWithBackoff(
        () => this.checkQuizStatus(courseId, sessionNumber),
        maxRetries,
        1000,
        `quiz status check for course ${courseId}, session ${sessionNumber}`
      );
    } catch (error) {
      console.warn('Failed to check quiz status after retries:', error);
      return null;
    }
  },

  // Method untuk submit quiz dengan safety checks
  async submitQuizSafe(courseId, sessionNumber, answers, retry = false) {
    // Validate answers format
    if (!Array.isArray(answers)) {
      throw new Error('Answers must be an array');
    }

    // Validate each answer
    for (const answer of answers) {
      if (!answer.hasOwnProperty('question') || !answer.hasOwnProperty('answer')) {
        throw new Error('Each answer must have question and answer properties');
      }
    }

    try {
      return await Api.submitQuiz(courseId, sessionNumber, answers, retry);
    } catch (error) {
      console.error('❌ Safe submit quiz failed:', error);
      throw error;
    }
  },

  // Method untuk generate quiz dengan error handling
  async generateQuizSafe(courseId, sessionNumber) {
    try {
      // Check if network is available for generation
      const networkStatus = Api.getNetworkStatus();
      if (!networkStatus.isOnline) {
        throw new Error('Membuat quiz memerlukan koneksi internet');
      }

      return await Api.generateQuiz(courseId, sessionNumber);
    } catch (error) {
      console.error('❌ Safe generate quiz failed:', error);
      throw Api.handleAPIError(error, 'quiz generation');
    }
  },

  // Method untuk get quiz dengan offline fallback
  async getQuizOfflineFirst(courseId, sessionNumber) {
    try {
      // Try to get from cache first
      const cachedQuiz = await Api.getQuiz(courseId, sessionNumber, false);
      return cachedQuiz;
    } catch (error) {
      // If cache miss and offline, throw meaningful error
      const networkStatus = Api.getNetworkStatus();
      if (!networkStatus.isOnline) {
        throw new Error('Quiz tidak tersedia offline. Koneksi internet diperlukan.');
      }

      // If online but failed, try force refresh
      return await Api.getQuiz(courseId, sessionNumber, true);
    }
  },

  // Method untuk clear all quiz-related data
  async resetQuizState(courseId, sessionNumber) {
    try {
      console.log(`🔄 Resetting quiz state for course ${courseId}, session ${sessionNumber}`);

      // Clear all caches
      await this.clearAllQuizCache(courseId, sessionNumber);

      // Clear broader course cache that might contain quiz state
      await Api.clearCachePattern(`student/courses/${courseId}`);

      console.log('✅ Quiz state reset completed');
    } catch (error) {
      console.error('❌ Error resetting quiz state:', error);
      // Don't throw error as this is cleanup operation
    }
  },

  // Method untuk validate quiz data
  validateQuizData(quizData) {
    if (!quizData) {
      return { isValid: false, message: 'Quiz data is required' };
    }

    if (!Array.isArray(quizData)) {
      return { isValid: false, message: 'Quiz data must be an array of questions' };
    }

    if (quizData.length === 0) {
      return { isValid: false, message: 'Quiz must contain at least one question' };
    }

    // Validate each question
    for (let i = 0; i < quizData.length; i++) {
      const question = quizData[i];

      if (!question.question) {
        return { isValid: false, message: `Question ${i + 1} is missing question text` };
      }

      if (!question.options || !Array.isArray(question.options) || question.options.length === 0) {
        return { isValid: false, message: `Question ${i + 1} is missing options` };
      }

      if (question.correct_answer === undefined || question.correct_answer === null) {
        return { isValid: false, message: `Question ${i + 1} is missing correct answer` };
      }
    }

    return { isValid: true };
  },

  // Method untuk log quiz activity
  logQuizActivity(activity, courseId, sessionNumber, data = null) {
    Api.log('info', `Quiz ${activity}`, {
      courseId,
      sessionNumber,
      data,
      timestamp: Date.now(),
      url: window.location.href
    });
  }
};

export default QuizModel;