import Api from "../data/api.js";
import { createMaterialCardItem } from "./material-card-item.js";
import { showToastNotification } from "../utils/index.js";

function renderStudyMaterialSection(courseId, course) {
  const container = document.createElement("div");
  container.className = "space-y-6";

  // Enhanced grid with better spacing and responsive design
  const grid = document.createElement("div");
  grid.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";

  // Enhanced loading animation
  grid.innerHTML = `
    <div class="col-span-full">
      <div class="flex flex-col items-center justify-center py-12">
        <div class="relative">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 dark:border-blue-800"></div>
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 dark:border-blue-400 border-t-transparent absolute top-0"></div>
        </div>
        <div class="mt-6 text-center">
          <p class="text-lg font-medium text-gray-700 dark:text-gray-300">Memuat Materi Pembelajaran</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Mohon tunggu sebentar...</p>
        </div>
      </div>
    </div>
  `;

  container.appendChild(grid);

  // Enhanced material list with better descriptions and icons
  const MaterialList = [
    {
      name: "Notes & Chapters",
      desc: "Baca dan pelajari materi chapter demi chapter untuk pemahaman mendalam",
      icon: "/notes.png",
      path: "/notes",
      type: "notes",
      gradient: "from-blue-500 to-indigo-600",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    {
      name: "Flashcards",
      desc: "Kartu belajar interaktif untuk menghafal dan mengingat konsep penting",
      icon: "/flashcard.png",
      path: "/flashcards",
      type: "flashcard",
      gradient: "from-purple-500 to-pink-600",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400"
    },
    {
      name: "Final Exam",
      desc: "Ujian komprehensif untuk menguji pemahaman seluruh materi course",
      icon: "/qa.png",
      path: "/final-exam",
      type: "qa",
      gradient: "from-green-500 to-emerald-600",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400"
    },
  ];

  // ROBUST STATUS CHECKING FUNCTIONS

  /**
   * Robust flashcard status checker with detailed logging
   * @param {string} courseId - Course ID to check
   * @returns {Promise<boolean>} - True if flashcards are ready
   */
  const checkFlashcardStatus = async (courseId) => {
    const logPrefix = `🃏 [Flashcard-${courseId.slice(-8)}]`;
    
    try {
      console.log(`${logPrefix} Checking flashcard status...`);
      
      const flashcardStatus = await Api.getFlashcardStatus(courseId);
      console.log(`${logPrefix} Status response:`, {
        status: flashcardStatus.status,
        ready: flashcardStatus.ready,
        message: flashcardStatus.message
      });

      // STRICT STATUS VALIDATION
      const isReady = flashcardStatus.status === "done" || 
                     flashcardStatus.ready === true;

      console.log(`${logPrefix} Final determination: ${isReady ? '✅ READY' : '❌ NOT READY'}`);
      
      // Additional validation: If status says ready, verify by checking data
      if (isReady) {
        try {
          const flashcardData = await Api.getFlashcards(courseId);
          const hasData = flashcardData && 
                         flashcardData.flashcards && 
                         Array.isArray(flashcardData.flashcards) && 
                         flashcardData.flashcards.length > 0;
          
          console.log(`${logPrefix} Data verification:`, {
            hasData,
            count: flashcardData?.flashcards?.length || 0
          });
          
          return hasData;
        } catch (dataError) {
          console.log(`${logPrefix} Data verification failed:`, dataError.message);
          return false;
        }
      }
      
      return false;

    } catch (error) {
      console.warn(`${logPrefix} Status check failed:`, {
        message: error.message,
        status: error.status || 'unknown'
      });
      return false;
    }
  };

  /**
   * Robust final exam status checker with comprehensive validation
   * @param {string} courseId - Course ID to check
   * @returns {Promise<boolean>} - True if final exam is ready
   */
  const checkFinalExamStatus = async (courseId) => {
    const logPrefix = `📝 [FinalExam-${courseId.slice(-8)}]`;
    
    try {
      console.log(`${logPrefix} Checking final exam status...`);

      // STEP 1: Check status API
      const statusResponse = await Api.checkFinalExamStatus(courseId);
      console.log(`${logPrefix} Status API response:`, {
        status: statusResponse.status,
        ready: statusResponse.ready,
        data: statusResponse.data,
        final_exam_ready: statusResponse.final_exam_ready,
        message: statusResponse.message
      });

      // STRICT STATUS VALIDATION - Only specific statuses are considered ready
      const statusIsReady = statusResponse.status === "ready" || 
                           statusResponse.status === "done";

      const readyFlagIsTrue = statusResponse.ready === true ||
                             statusResponse.data?.ready === true ||
                             statusResponse.final_exam_ready === true;

      console.log(`${logPrefix} Status analysis:`, {
        statusIsReady,
        readyFlagIsTrue,
        statusValue: statusResponse.status
      });

      // CRITICAL: If status is "not_started", "generating", or "failed" - NOT READY
      if (statusResponse.status === "not_started" || 
          statusResponse.status === "generating" || 
          statusResponse.status === "failed") {
        console.log(`${logPrefix} Status is '${statusResponse.status}' - definitively NOT READY`);
        return false;
      }

      // If status indicates ready, verify with data check
      if (statusIsReady || readyFlagIsTrue) {
        console.log(`${logPrefix} Status indicates ready, verifying with data check...`);
        
        try {
          const examData = await Api.checkFinalExam(courseId);
          console.log(`${logPrefix} Data API response:`, {
            hasData: !!examData,
            hasQuestions: !!(examData?.data?.questions || examData?.questions),
            questionCount: (examData?.data?.questions || examData?.questions)?.length || 0
          });

          const hasValidData = examData && 
                               (examData.data?.questions || examData.questions) &&
                               Array.isArray(examData.data?.questions || examData.questions) &&
                               (examData.data?.questions || examData.questions).length > 0;

          console.log(`${logPrefix} Final determination: ${hasValidData ? '✅ READY' : '❌ NOT READY'}`);
          return hasValidData;

        } catch (dataError) {
          console.log(`${logPrefix} Data verification failed:`, {
            message: dataError.message,
            status: dataError.status
          });
          
          // If data check fails with 404, exam is definitely not ready
          if (dataError.message?.includes('404') || 
              dataError.message?.includes('belum tersedia') ||
              dataError.message?.includes('Not Found')) {
            console.log(`${logPrefix} 404 error confirms exam is NOT READY`);
            return false;
          }
          
          // For other errors, assume not ready
          return false;
        }
      }

      // If we reach here, status doesn't indicate ready
      console.log(`${logPrefix} Status does not indicate ready - NOT READY`);
      return false;

    } catch (error) {
      console.warn(`${logPrefix} Comprehensive status check failed:`, {
        message: error.message,
        status: error.status || 'unknown'
      });
      return false;
    }
  };

  /**
   * Enhanced material status checker with retry logic and proper error handling
   */
  const getStudyMaterial = async () => {
    const logPrefix = `📊 [StudyMaterial-${courseId.slice(-8)}]`;
    
    try {
      console.log(`${logPrefix} Starting material status check...`);

      // Show enhanced loading state
      grid.innerHTML = `
        <div class="col-span-full">
          <div class="flex items-center justify-center py-8">
            <div class="flex items-center gap-3">
              <div class="animate-pulse flex space-x-2">
                <div class="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                <div class="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.1s;"></div>
                <div class="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.2s;"></div>
              </div>
              <span class="text-gray-600 dark:text-gray-400 ml-2">Memeriksa status materi...</span>
            </div>
          </div>
        </div>
      `;

      // Get course status for context (non-blocking)
      let courseStatus = {};
      try {
        courseStatus = await Api.getStudentCourseStatus(courseId);
        console.log(`${logPrefix} Course status context:`, {
          checkpoint: courseStatus.checkpoint,
          is_completed: courseStatus.is_completed,
          quiz_ready: courseStatus.quiz_ready
        });
      } catch (error) {
        console.warn(`${logPrefix} Course status fetch failed (non-critical):`, error.message);
      }

      // SEQUENTIAL STATUS CHECKS for better reliability
      console.log(`${logPrefix} Starting sequential status checks...`);

      // Check flashcard status
      const flashcardReady = await checkFlashcardStatus(courseId);
      console.log(`${logPrefix} Flashcard check complete: ${flashcardReady ? 'READY' : 'NOT READY'}`);

      // Small delay between checks to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));

      // Check final exam status
      const finalExamReady = await checkFinalExamStatus(courseId);
      console.log(`${logPrefix} Final exam check complete: ${finalExamReady ? 'READY' : 'NOT READY'}`);

      // FINAL STATUS SUMMARY
      const finalStatus = {
        notes: true, // Notes always ready
        quiz: courseStatus.quiz_ready || false,
        flashcard: flashcardReady,
        qa: finalExamReady, // qa = final exam
      };

      console.log(`${logPrefix} FINAL STATUS SUMMARY:`, finalStatus);

      // ROBUST STUDY TYPE CONTENT MAPPING
      const studyTypeContent = {
        notes: { ready: finalStatus.notes },
        quiz: { ready: finalStatus.quiz },
        flashcard: { ready: finalStatus.flashcard },
        qa: { ready: finalStatus.qa },
      };

      // Clear grid and render cards
      grid.innerHTML = "";

      MaterialList.forEach((item, index) => {
        const materialReady = studyTypeContent[item.type]?.ready || false;
        
        console.log(`${logPrefix} Rendering ${item.type}: ${materialReady ? 'READY' : 'NOT READY'}`);
        
        const card = createMaterialCardItem({
          item,
          studyTypeContent,
          courseId,
          course,
          refreshData: getStudyMaterial,
        });

        // Add entrance animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        grid.appendChild(card);

        // Trigger animation after a small delay
        setTimeout(() => {
          card.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * 100);
      });

      console.log(`${logPrefix} ✅ Study material loaded successfully`);

    } catch (err) {
      console.error(`${logPrefix} ❌ Failed to load study material:`, {
        message: err.message,
        stack: err.stack
      });

      // Enhanced error state with retry functionality
      grid.innerHTML = `
        <div class="col-span-full">
          <div class="text-center py-12">
            <div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Gagal Memuat Materi</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">Terjadi kesalahan saat memuat status materi pembelajaran</p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onclick="window.location.reload()" 
                class="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium text-sm"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Muat Ulang Halaman
              </button>
              <button 
                onclick="arguments[0].target.disabled=true; arguments[0].target.textContent='Mencoba...'; setTimeout(() => window.studyMaterialRefresh(), 1000);" 
                class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium text-sm"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      `;

      // Expose retry function globally
      window.studyMaterialRefresh = getStudyMaterial;

      // Fallback: render with conservative defaults after delay
      setTimeout(async () => {
        try {
          console.log(`${logPrefix} 🔄 Attempting fallback render...`);
          
          const studyTypeContent = {
            notes: { ready: true }, // Notes always available
            quiz: { ready: false }, // Conservative default
            flashcard: { ready: false }, // Conservative default  
            qa: { ready: false }, // Conservative default
          };

          grid.innerHTML = "";
          MaterialList.forEach((item) => {
            const card = createMaterialCardItem({
              item,
              studyTypeContent,
              courseId,
              course,
              refreshData: getStudyMaterial,
            });
            grid.appendChild(card);
          });

          console.log(`${logPrefix} 🔄 Fallback cards rendered with conservative defaults`);
        } catch (fallbackError) {
          console.error(`${logPrefix} ❌ Fallback rendering failed:`, fallbackError);
        }
      }, 3000);

      showToastNotification("Gagal memuat status materi pembelajaran. Mencoba dengan pengaturan default...", "warning");
    }
  };

  // Expose refresh function for manual retry
  window.studyMaterialRefresh = getStudyMaterial;

  // Initial load with delay for better UX
  setTimeout(() => {
    getStudyMaterial();
  }, 300);

  return container;
}

export { renderStudyMaterialSection };