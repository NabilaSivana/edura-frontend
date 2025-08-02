// Enhanced material-card-item.js with robust status checking and proper error handling

import Api from "../data/api.js";
import { toast } from "../utils/toast.js";

function createMaterialCardItem({
  item,
  studyTypeContent,
  courseId,
  course,
  refreshData,
}) {
  const card = document.createElement("div");

  const isReady = studyTypeContent[item.type]?.ready || false;

  // Enhanced card styling with gradients and better responsiveness
  card.className = `
    group relative bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 
    hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 overflow-hidden
    hover:shadow-xl hover:scale-[1.02] cursor-pointer
  `.trim();

  // Status styling
  const getStatusInfo = () => {
    if (isReady) {
      return {
        badgeClass: "bg-green-100 dark:bg-green-800/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700",
        badgeIcon: `<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>`,
        badgeText: "Siap",
        cardGlow: "group-hover:shadow-green-200/50 dark:group-hover:shadow-green-800/30"
      };
    } else {
      return {
        badgeClass: "bg-yellow-100 dark:bg-yellow-800/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700",
        badgeIcon: `<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
        badgeText: "Belum Siap",
        cardGlow: "group-hover:shadow-yellow-200/50 dark:group-hover:shadow-yellow-800/30"
      };
    }
  };

  const statusInfo = getStatusInfo();

  // Button configuration
  let buttonConfig = {
    text: "Generate",
    action: "generate",
    className: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl",
    icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>`
  };

  // Configure button based on type and readiness
  if (isReady) {
    if (item.type === "flashcard") {
      buttonConfig = {
        text: "Buka Flashcards",
        action: "view",
        className: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl",
        icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>`
      };
    } else if (item.type === "notes") {
      buttonConfig = {
        text: "Mulai Belajar",
        action: "start",
        className: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl",
        icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z"></path></svg>`
      };
    } else if (item.type === "qa") {
      buttonConfig = {
        text: "Mulai Ujian",
        action: "start",
        className: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl",
        icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
      };
    }
  }

  card.innerHTML = `
    <!-- Background Pattern -->
    <div class="absolute inset-0 bg-gradient-to-br ${item.gradient || 'from-gray-100 to-gray-200'} opacity-5"></div>
    
    <!-- Status Badge -->
    <div class="absolute top-4 right-4 z-10">
      <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusInfo.badgeClass}" id="status-badge-${item.type}">
        <span id="status-icon-${item.type}">${statusInfo.badgeIcon}</span>
        <span id="status-text-${item.type}">${statusInfo.badgeText}</span>
      </div>
    </div>

    <!-- Card Content -->
    <div class="relative p-6 space-y-4">
      <!-- Header -->
      <div class="flex items-start gap-4">
        <div class="flex-shrink-0">
          <div class="w-14 h-14 ${item.iconBg || 'bg-gray-100 dark:bg-gray-700'} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <img src="${item.icon}" alt="${item.name}" class="w-8 h-8 object-contain filter drop-shadow-sm" 
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
            <div class="hidden w-8 h-8 ${item.iconColor || 'text-gray-500'} items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="flex-1 min-w-0">
          <h3 class="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-1">
            ${item.name}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
            ${item.desc}
          </p>
        </div>
      </div>

      <!-- Action Button -->
      <div class="pt-2">
        <button 
          id="btn-${item.type}" 
          class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${buttonConfig.className}"
          data-action="${buttonConfig.action}"
          data-type="${item.type}"
        >
          <span class="btn-icon">${buttonConfig.icon}</span>
          <span class="btn-text">${buttonConfig.text}</span>
          <span class="btn-loading hidden">
            <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
        </button>
      </div>

      <!-- Progress Indicator (for generating states) -->
      <div class="progress-indicator hidden">
        <div class="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
          <div class="h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" style="width: 60%"></div>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">Sedang memproses...</p>
      </div>
    </div>

    <!-- Hover Effect Overlay -->
    <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
  `;

  const button = card.querySelector(`#btn-${item.type}`);
  const btnIcon = card.querySelector('.btn-icon');
  const btnText = card.querySelector('.btn-text');
  const btnLoading = card.querySelector('.btn-loading');
  const progressIndicator = card.querySelector('.progress-indicator');

  button.addEventListener("click", async (e) => {
    e.stopPropagation();
    
    // Get current action from button attribute (in case it was updated)
    const currentAction = button.getAttribute('data-action') || buttonConfig.action;
    
    await handleMaterialAction({
      type: item.type,
      action: currentAction,
      courseId,
      course,
      refreshData,
      button,
      btnIcon,
      btnText,
      btnLoading,
      progressIndicator,
      item,
      card
    });
  });

  return card;
}

/**
 * ROBUST STATUS CHECKING - Consistent with study-material-section.js
 */

/**
 * Enhanced material status checker with comprehensive validation
 * @param {string} type - Material type (flashcard, qa)
 * @param {string} courseId - Course ID
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} retryDelay - Delay between retries in ms
 * @returns {Promise<boolean>} - True if material is ready
 */
async function checkMaterialStatus(type, courseId, maxRetries = 8, retryDelay = 2500) {
  const logPrefix = `🔍 [${type.toUpperCase()}-${courseId.slice(-8)}]`;
  console.log(`${logPrefix} Starting comprehensive status check...`);
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      let isReady = false;
      
      if (type === "flashcard") {
        console.log(`${logPrefix} Attempt ${attempt}/${maxRetries} - Checking flashcard status...`);
        
        // STEP 1: Check status API
        const statusResponse = await Api.getFlashcardStatus(courseId);
        console.log(`${logPrefix} Status API response:`, {
          status: statusResponse.status,
          ready: statusResponse.ready,
          message: statusResponse.message
        });

        // CRITICAL: Only "done" status with ready=true is considered ready
        const statusIsReady = statusResponse.status === "done" && statusResponse.ready === true;
        
        if (statusResponse.status === "not_started" || 
            statusResponse.status === "generating" || 
            statusResponse.status === "failed") {
          console.log(`${logPrefix} Status '${statusResponse.status}' - NOT READY`);
          isReady = false;
        } else if (statusIsReady) {
          console.log(`${logPrefix} Status indicates ready, verifying with data...`);
          
          // STEP 2: Verify with actual data
          try {
            const flashcardData = await Api.getFlashcards(courseId);
            const hasValidData = flashcardData && 
                               flashcardData.flashcards && 
                               Array.isArray(flashcardData.flashcards) && 
                               flashcardData.flashcards.length > 0;
            
            console.log(`${logPrefix} Data verification:`, {
              hasData: !!flashcardData,
              hasFlashcards: !!flashcardData?.flashcards,
              isArray: Array.isArray(flashcardData?.flashcards),
              count: flashcardData?.flashcards?.length || 0,
              isValid: hasValidData
            });
            
            isReady = hasValidData;
          } catch (dataError) {
            console.log(`${logPrefix} Data verification failed:`, dataError.message);
            isReady = false;
          }
        }
        
      } else if (type === "qa") {
        console.log(`${logPrefix} Attempt ${attempt}/${maxRetries} - Checking final exam status...`);
        
        // STEP 1: Check status API
        let statusResponse;
        try {
          statusResponse = await Api.checkFinalExamStatus(courseId);
          console.log(`${logPrefix} Status API response:`, {
            status: statusResponse.status,
            ready: statusResponse.ready,
            data: statusResponse.data,
            final_exam_ready: statusResponse.final_exam_ready
          });
        } catch (statusError) {
          console.log(`${logPrefix} Status API failed:`, statusError.message);
          statusResponse = { status: 'unknown' };
        }

        // CRITICAL: Only specific ready statuses are valid
        const statusIsReady = statusResponse.status === "ready" || 
                             statusResponse.status === "done";

        const readyFlagIsTrue = statusResponse.ready === true ||
                               statusResponse.data?.ready === true ||
                               statusResponse.final_exam_ready === true;

        // If status is explicitly not ready, don't proceed
        if (statusResponse.status === "not_started" || 
            statusResponse.status === "generating" || 
            statusResponse.status === "failed") {
          console.log(`${logPrefix} Status '${statusResponse.status}' - NOT READY`);
          isReady = false;
        } else if (statusIsReady || readyFlagIsTrue) {
          console.log(`${logPrefix} Status indicates ready, verifying with data...`);
          
          // STEP 2: Verify with actual exam data
          try {
            const examData = await Api.checkFinalExam(courseId);
            const hasValidData = examData && 
                               (examData.data?.questions || examData.questions) &&
                               Array.isArray(examData.data?.questions || examData.questions) &&
                               (examData.data?.questions || examData.questions).length > 0;

            console.log(`${logPrefix} Data verification:`, {
              hasData: !!examData,
              hasQuestions: !!(examData?.data?.questions || examData?.questions),
              isArray: Array.isArray(examData?.data?.questions || examData?.questions),
              count: (examData?.data?.questions || examData?.questions)?.length || 0,
              isValid: hasValidData
            });

            isReady = hasValidData;
          } catch (dataError) {
            console.log(`${logPrefix} Data verification failed:`, dataError.message);
            
            // 404 means exam definitely not ready
            if (dataError.message?.includes('404') || 
                dataError.message?.includes('belum tersedia') ||
                dataError.message?.includes('Not Found')) {
              console.log(`${logPrefix} 404 confirms NOT READY`);
              isReady = false;
            } else {
              isReady = false;
            }
          }
        } else {
          console.log(`${logPrefix} Status does not indicate ready`);
          isReady = false;
        }
      }
      
      if (isReady) {
        console.log(`${logPrefix} ✅ CONFIRMED READY after ${attempt} attempts`);
        return true;
      }
      
      if (attempt < maxRetries) {
        console.log(`${logPrefix} ⏳ Not ready yet, waiting ${retryDelay}ms before attempt ${attempt + 1}/${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
      
    } catch (error) {
      console.error(`${logPrefix} ❌ Attempt ${attempt} failed:`, {
        message: error.message,
        status: error.status
      });
      
      if (attempt < maxRetries) {
        console.log(`${logPrefix} 🔄 Retrying after ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }
  
  console.log(`${logPrefix} ❌ FINAL RESULT: NOT READY after ${maxRetries} attempts`);
  return false;
}

// Function to update card UI based on status
function updateCardUI(card, type, isReady) {
  const button = card.querySelector(`#btn-${type}`);
  const btnIcon = card.querySelector('.btn-icon');
  const btnText = card.querySelector('.btn-text');
  const statusBadge = card.querySelector(`#status-badge-${type}`);
  const statusIcon = card.querySelector(`#status-icon-${type}`);
  const statusText = card.querySelector(`#status-text-${type}`);
  
  console.log(`🎨 Updating card UI for ${type}: ${isReady ? 'READY' : 'NOT READY'}`);
  
  if (isReady) {
    // Update status badge
    statusBadge.className = "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-green-100 dark:bg-green-800/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700";
    statusIcon.innerHTML = `<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>`;
    statusText.textContent = "Siap";
    
    // Update button based on type
    if (type === "flashcard") {
      button.className = "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl";
      btnIcon.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>`;
      btnText.textContent = "Buka Flashcards";
      button.setAttribute('data-action', 'view');
    } else if (type === "qa") {
      button.className = "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl";
      btnIcon.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
      btnText.textContent = "Mulai Ujian";
      button.setAttribute('data-action', 'start');
    }
    
    console.log(`✅ Card UI updated for ${type} - shows as READY`);
  } else {
    console.log(`⚠️ Card UI remains NOT READY for ${type}`);
  }
}

async function handleMaterialAction({
  type,
  action,
  courseId,
  course,
  refreshData,
  button,
  btnIcon,
  btnText,
  btnLoading,
  progressIndicator,
  item,
  card
}) {
  const logPrefix = `🎬 [Action-${type.toUpperCase()}]`;
  const originalText = btnText.textContent;
  const originalIcon = btnIcon.innerHTML;

  console.log(`${logPrefix} Starting action: ${action}`);

  // Handle direct navigation actions (when material is already ready)
  if (action === "view" && type === "flashcard") {
    console.log(`${logPrefix} Navigating to flashcards...`);
    window.location.hash = `#/course/flashcards?course_id=${courseId}`;
    return;
  }
  
  if (action === "start") {
    if (type === "notes") {
      console.log(`${logPrefix} Navigating to notes...`);
      window.location.hash = `#/course/notes?course_id=${courseId}`;
    } else if (type === "qa") {
      console.log(`${logPrefix} Navigating to final exam...`);
      window.location.hash = `#/course/final-exam?course_id=${courseId}`;
    }
    return;
  }

  // Handle generation actions
  if (action !== "generate") {
    console.warn(`${logPrefix} Unknown action: ${action}`);
    return;
  }

  try {
    // Set loading state
    button.disabled = true;
    btnIcon.classList.add('hidden');
    btnText.classList.add('hidden');
    btnLoading.classList.remove('hidden');

    if (type === "flashcard") {
      btnText.textContent = "Membuat Flashcards...";
      btnText.classList.remove('hidden');
      progressIndicator.classList.remove('hidden');

      console.log(`${logPrefix} 🃏 Starting flashcard generation...`);
      const response = await Api.generateFlashcards(courseId);
      console.log(`${logPrefix} 🃏 Generation response:`, response);

      if (response.status === "success" || 
          response.status === "done" || 
          response.message?.includes("berhasil")) {
        
        // Show success animation
        btnIcon.innerHTML = `<svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>`;
        btnText.textContent = "Berhasil! Memverifikasi status...";
        btnIcon.classList.remove('hidden');

        console.log(`${logPrefix} 🃏 Generation successful, starting verification...`);
        
        // ROBUST STATUS CHECK with extended retry
        const isReady = await checkMaterialStatus("flashcard", courseId, 10, 3000);
        
        if (isReady) {
          updateCardUI(card, type, true);
          toast.success("Flashcards berhasil dibuat dan siap digunakan!");
          console.log(`${logPrefix} ✅ Flashcards confirmed ready and UI updated`);
        } else {
          console.log(`${logPrefix} ⚠️ Status check failed, triggering full refresh...`);
          await refreshData();
          toast.success("Flashcards berhasil dibuat! Halaman akan dimuat ulang untuk menampilkan status terbaru.");
        }
      } else {
        throw new Error(response.message || "Gagal membuat flashcards");
      }

    } else if (type === "qa") {
      btnText.textContent = "Membuat Final Exam...";
      btnText.classList.remove('hidden');
      progressIndicator.classList.remove('hidden');

      console.log(`${logPrefix} 📝 Starting final exam generation...`);
      const response = await Api.generateFinalExam(courseId);
      console.log(`${logPrefix} 📝 Generation response:`, response);

      if (response.status === "success" || 
          response.status === "generating" || 
          response.status === "done" ||
          response.message?.includes("berhasil")) {
        
        // Show success animation
        btnIcon.innerHTML = `<svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>`;
        btnText.textContent = "Berhasil! Memverifikasi status...";
        btnIcon.classList.remove('hidden');

        console.log(`${logPrefix} 📝 Generation successful, starting verification...`);
        
        // ROBUST STATUS CHECK with extended retry for final exam
        const isReady = await checkMaterialStatus("qa", courseId, 12, 4000);
        
        if (isReady) {
          updateCardUI(card, type, true);
          toast.success("Final exam berhasil dibuat dan siap dimulai!");
          console.log(`${logPrefix} ✅ Final exam confirmed ready and UI updated`);
        } else {
          console.log(`${logPrefix} ⚠️ Status check failed, triggering full refresh...`);
          await refreshData();
          toast.success("Final exam berhasil dibuat! Halaman akan dimuat ulang untuk menampilkan status terbaru.");
        }
      } else {
        throw new Error(response.message || "Gagal membuat final exam");
      }
    }

  } catch (error) {
    console.error(`${logPrefix} ❌ Error during ${action}:`, {
      message: error.message,
      stack: error.stack
    });

    // Show error state
    btnIcon.innerHTML = `<svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    btnText.textContent = "Gagal!";
    btnIcon.classList.remove('hidden');
    btnText.classList.remove('hidden');

    setTimeout(() => {
      btnIcon.innerHTML = originalIcon;
      btnText.textContent = originalText;
    }, 2000);

    toast.error(error.message || `Gagal ${action} ${type}`);
    
  } finally {
    // Reset UI state
    setTimeout(() => {
      button.disabled = false;
      btnLoading.classList.add('hidden');
      progressIndicator.classList.add('hidden');

      if (!button.disabled) {
        btnIcon.classList.remove('hidden');
        btnText.classList.remove('hidden');
      }
    }, 500);
  }
}

export { createMaterialCardItem };