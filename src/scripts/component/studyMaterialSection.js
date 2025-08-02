// // file: component/studyMaterialSection.js - Enhanced with modern UI

// import Api from "../data/api.js";
// import { createMaterialCardItem } from "./material-card-item.js";
// import { showToastNotification } from "../utils/showToastNotification.js";

// function renderStudyMaterialSection(courseId, course) {
//   const container = document.createElement("div");
//   container.className = "space-y-6";

//   // Enhanced grid with better spacing and responsive design
//   const grid = document.createElement("div");
//   grid.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";

//   // Enhanced loading animation
//   grid.innerHTML = `
//     <div class="col-span-full">
//       <div class="flex flex-col items-center justify-center py-12">
//         <div class="relative">
//           <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 dark:border-blue-800"></div>
//           <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 dark:border-blue-400 border-t-transparent absolute top-0"></div>
//         </div>
//         <div class="mt-6 text-center">
//           <p class="text-lg font-medium text-gray-700 dark:text-gray-300">Memuat Materi Pembelajaran</p>
//           <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Mohon tunggu sebentar...</p>
//         </div>
//       </div>
//     </div>
//   `;

//   container.appendChild(grid);

//   // Enhanced material list with better descriptions and icons
//   const MaterialList = [
//     {
//       name: "Notes & Chapters",
//       desc: "Baca dan pelajari materi chapter demi chapter untuk pemahaman mendalam",
//       icon: "/notes.png",
//       path: "/notes",
//       type: "notes",
//       gradient: "from-blue-500 to-indigo-600",
//       iconBg: "bg-blue-100 dark:bg-blue-900/30",
//       iconColor: "text-blue-600 dark:text-blue-400"
//     },
//     {
//       name: "Flashcards",
//       desc: "Kartu belajar interaktif untuk menghafal dan mengingat konsep penting",
//       icon: "/flashcard.png",
//       path: "/flashcards",
//       type: "flashcard",
//       gradient: "from-purple-500 to-pink-600",
//       iconBg: "bg-purple-100 dark:bg-purple-900/30",
//       iconColor: "text-purple-600 dark:text-purple-400"
//     },
//     {
//       name: "Final Exam",
//       desc: "Ujian komprehensif untuk menguji pemahaman seluruh materi course",
//       icon: "/qa.png",
//       path: "/final-exam",
//       type: "qa",
//       gradient: "from-green-500 to-emerald-600",
//       iconBg: "bg-green-100 dark:bg-green-900/30",
//       iconColor: "text-green-600 dark:text-green-400"
//     },
//   ];

//   const getStudyMaterial = async () => {
//     try {
//       console.log("🔄 Fetching study material status...");

//       // Show enhanced loading state
//       grid.innerHTML = `
//         <div class="col-span-full">
//           <div class="flex items-center justify-center py-8">
//             <div class="flex items-center gap-3">
//               <div class="animate-pulse flex space-x-2">
//                 <div class="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
//                 <div class="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.1s;"></div>
//                 <div class="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.2s;"></div>
//               </div>
//               <span class="text-gray-600 dark:text-gray-400 ml-2">Memeriksa status materi...</span>
//             </div>
//           </div>
//         </div>
//       `;

//       // Get course status
//       const courseStatus = await Api.getStudentCourseStatus(courseId);
//       console.log("📊 Course Status:", courseStatus);

//       // Get flashcard status specifically
//       let flashcardReady = false;
//       try {
//         const flashcardStatus = await Api.getFlashcardStatus(courseId);
//         console.log("🃏 Flashcard Status:", flashcardStatus);
//         flashcardReady = flashcardStatus.status === "done" || flashcardStatus.ready === true;
//       } catch (error) {
//         console.log("⚠️ Flashcard status check failed, assuming not ready");
//         flashcardReady = false;
//       }

//       // Enhanced final exam status checking
//       let finalExamReady = false;

//       // Check from course status first
//       if (courseStatus.final_exam_ready !== undefined) {
//         finalExamReady = courseStatus.final_exam_ready;
//       } else if (courseStatus.finalExamReady !== undefined) {
//         finalExamReady = courseStatus.finalExamReady;
//       } else if (courseStatus.qa_ready !== undefined) {
//         finalExamReady = courseStatus.qa_ready;
//       } else if (courseStatus.exam_ready !== undefined) {
//         finalExamReady = courseStatus.exam_ready;
//       }

//       // If not found, try dedicated final exam API
//       if (finalExamReady === false || finalExamReady === undefined) {
//         try {
//           console.log("🔍 Checking final exam status via dedicated API...");
//           const finalExamStatus = await Api.checkFinalExamStatus(courseId);
//           console.log("📝 Final Exam Status Response:", finalExamStatus);

//           if (finalExamStatus.status === "ready" || finalExamStatus.status === "done") {
//             finalExamReady = true;
//           } else if (finalExamStatus.ready === true) {
//             finalExamReady = true;
//           } else if (finalExamStatus.data && finalExamStatus.data.ready === true) {
//             finalExamReady = true;
//           } else if (finalExamStatus.final_exam_ready === true) {
//             finalExamReady = true;
//           }
//         } catch (error) {
//           console.log("⚠️ Final exam status check failed, checking if exam exists...");

//           // Fallback: check if final exam exists
//           try {
//             const finalExamData = await Api.checkFinalExam(courseId);
//             console.log("✅ Final Exam Check Response:", finalExamData);

//             if (finalExamData && (finalExamData.questions || finalExamData.data)) {
//               finalExamReady = true;
//             }
//           } catch (finalError) {
//             console.log("❌ Final exam check also failed, assuming not ready");
//             finalExamReady = false;
//           }
//         }
//       }

//       console.log("🎯 Final Status Summary:", {
//         notes: true,
//         flashcard: flashcardReady,
//         finalExam: finalExamReady
//       });

//       const studyTypeContent = {
//         notes: { ready: true }, // Notes always ready
//         quiz: { ready: courseStatus.quiz_ready || false },
//         flashcard: { ready: flashcardReady },
//         qa: { ready: finalExamReady },
//       };

//       // Clear grid and render cards
//       grid.innerHTML = "";

//       MaterialList.forEach((item) => {
//         const card = createMaterialCardItem({
//           item,
//           studyTypeContent,
//           courseId,
//           course,
//           refreshData: getStudyMaterial,
//         });

//         // Add entrance animation
//         card.style.opacity = '0';
//         card.style.transform = 'translateY(20px)';
//         grid.appendChild(card);

//         // Trigger animation after a small delay
//         setTimeout(() => {
//           card.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
//           card.style.opacity = '1';
//           card.style.transform = 'translateY(0)';
//         }, MaterialList.indexOf(item) * 100);
//       });

//       console.log("✅ Study material loaded successfully");

//     } catch (err) {
//       console.error("❌ Failed to load study material:", err);

//       // Enhanced error state
//       grid.innerHTML = `
//         <div class="col-span-full">
//           <div class="text-center py-12">
//             <div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//               </svg>
//             </div>
//             <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Gagal Memuat Materi</h3>
//             <p class="text-gray-600 dark:text-gray-400 mb-4">Terjadi kesalahan saat memuat status materi pembelajaran</p>
//             <button 
//               onclick="window.location.reload()" 
//               class="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium text-sm"
//             >
//               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
//               </svg>
//               Coba Lagi
//             </button>
//           </div>
//         </div>
//       `;

//       // Fallback: render with default status
//       const studyTypeContent = {
//         notes: { ready: true },
//         quiz: { ready: false },
//         flashcard: { ready: false },
//         qa: { ready: false },
//       };

//       setTimeout(() => {
//         grid.innerHTML = "";
//         MaterialList.forEach((item) => {
//           const card = createMaterialCardItem({
//             item,
//             studyTypeContent,
//             courseId,
//             course,
//             refreshData: getStudyMaterial,
//           });
//           grid.appendChild(card);
//         });
//       }, 3000);

//       showToastNotification.error("Gagal memuat status materi pembelajaran");
//     }
//   };

//   // Initial load with delay for better UX
//   setTimeout(() => {
//     getStudyMaterial();
//   }, 300);

//   return container;
// }

// export { renderStudyMaterialSection };

// file: component/studyMaterialSection.js - Enhanced with improved status checking
// file: component/studyMaterialSection.js - Enhanced with improved status checking

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

  // Enhanced status checking with better error handling
  const checkFlashcardStatus = async () => {
    try {
      const flashcardStatus = await Api.getFlashcardStatus(courseId);
      console.log("🃏 Flashcard Status:", flashcardStatus);
      return flashcardStatus.status === "done" || flashcardStatus.ready === true;
    } catch (error) {
      console.log("⚠️ Flashcard status check failed:", error.message);
      return false;
    }
  };

  const checkFinalExamStatus = async () => {
    try {
      // First try the dedicated final exam status API
      const finalExamStatus = await Api.checkFinalExamStatus(courseId);
      console.log("📝 Final Exam Status Response:", finalExamStatus);

      if (finalExamStatus.status === "ready" || finalExamStatus.status === "done") {
        return true;
      } else if (finalExamStatus.ready === true) {
        return true;
      } else if (finalExamStatus.data && finalExamStatus.data.ready === true) {
        return true;
      } else if (finalExamStatus.final_exam_ready === true) {
        return true;
      }

      // Fallback: check if final exam exists
      try {
        const finalExamData = await Api.checkFinalExam(courseId);
        console.log("✅ Final Exam Check Response:", finalExamData);
        return !!(finalExamData && (finalExamData.questions || finalExamData.data));
      } catch (checkError) {
        console.log("❌ Final exam existence check failed:", checkError.message);
        return false;
      }
    } catch (error) {
      console.log("⚠️ Final exam status check failed:", error.message);
      return false;
    }
  };

  const getStudyMaterial = async () => {
    try {
      console.log("🔄 Fetching study material status...");

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

      // Get course status first
      let courseStatus = {};
      try {
        courseStatus = await Api.getStudentCourseStatus(courseId);
        console.log("📊 Course Status:", courseStatus);
      } catch (error) {
        console.warn("⚠️ Failed to get course status:", error.message);
      }

      // Check each material status individually for better accuracy
      const [flashcardReady, finalExamReady] = await Promise.allSettled([
        checkFlashcardStatus(),
        checkFinalExamStatus()
      ]);

      const flashcardStatus = flashcardReady.status === 'fulfilled' ? flashcardReady.value : false;
      const finalExamStatus = finalExamReady.status === 'fulfilled' ? finalExamReady.value : false;

      console.log("🎯 Final Status Summary:", {
        notes: true,
        flashcard: flashcardStatus,
        finalExam: finalExamStatus
      });

      const studyTypeContent = {
        notes: { ready: true }, // Notes always ready
        quiz: { ready: courseStatus.quiz_ready || false },
        flashcard: { ready: flashcardStatus },
        qa: { ready: finalExamStatus },
      };

      // Clear grid and render cards
      grid.innerHTML = "";

      MaterialList.forEach((item, index) => {
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

      console.log("✅ Study material loaded successfully");

    } catch (err) {
      console.error("❌ Failed to load study material:", err);

      // Enhanced error state
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
            <button 
              onclick="window.location.reload()" 
              class="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium text-sm"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Coba Lagi
            </button>
          </div>
        </div>
      `;

      // Fallback: render with default status after delay
      setTimeout(async () => {
        try {
          const studyTypeContent = {
            notes: { ready: true },
            quiz: { ready: false },
            flashcard: { ready: false },
            qa: { ready: false },
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

          console.log("🔄 Fallback cards rendered");
        } catch (fallbackError) {
          console.error("❌ Fallback rendering failed:", fallbackError);
        }
      }, 3000);

      showToastNotification.error("Gagal memuat status materi pembelajaran");
    }
  };

  // Initial load with delay for better UX
  setTimeout(() => {
    getStudyMaterial();
  }, 300);

  return container;
}

export { renderStudyMaterialSection };