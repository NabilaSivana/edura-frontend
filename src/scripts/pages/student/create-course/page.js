// page.js - Updated CreateCoursePage with Toast Integration
import CreateCoursePresenter from "./create-course-presenter.js";
import WrapperLayout from "../../../component/wrapper-layout.js";
import { toast } from "../../../utils/toast.js";

const CreateCoursePage = {
  // Current presenter instance
  currentPresenter: null,

  async render() {
    const content = `
      <section class="max-w-2xl mx-auto py-10 px-4">
        <!-- Back Button -->
        <div class="mb-6">
          <a href="#/dashboard" class="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Kembali ke Dashboard
          </a>
        </div>

        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-2">
            Start Building Your Personal Study Material
          </h1>
          <p class="text-gray-600 dark:text-gray-300">
            Fill all details in order to generate material for your next project
          </p>
        </div>

        <!-- Main Form Container -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <form id="create-course-form" class="space-y-6">
            <!-- Subject Input -->
            <div>
              <label for="subject" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter topic or paste the content for which you want to generate study material 
                <span class="text-red-500">*</span>
              </label>
              <textarea 
                id="subject" 
                name="subject" 
                required 
                rows="4" 
                maxlength="500"
                placeholder="Start writing here... (e.g., Machine Learning Basics, Introduction to Data Structures, etc.)"
                class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"></textarea>
              <div class="flex justify-between items-center mt-2">
                <span id="char-count" class="text-xs text-gray-500 dark:text-gray-400">0/500 karakter</span>
                <button 
                  type="button" 
                  id="recommend-btn" 
                  class="text-blue-600 dark:text-blue-400 text-sm hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors">
                  🎯 Perlu Rekomendasi?
                </button>
              </div>
            </div>

            <!-- Recommendations Display -->
            <div id="recommendation-container" class="hidden">
              <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200 mb-3 flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Rekomendasi Course
                </h3>
                <div id="recommendation-list" class="space-y-2">
                  <!-- Recommendations will be populated here -->
                </div>
                <p class="text-xs text-blue-600 dark:text-blue-400 mt-3">
                  💡 Klik rekomendasi untuk mengisi form otomatis
                </p>
              </div>
            </div>

            <!-- Level Selection -->
            <div>
              <label for="level" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select the difficulty Level 
                <span class="text-red-500">*</span>
              </label>
              <select 
                id="level" 
                name="level" 
                required
                class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                <option value="" class="text-gray-400">Choose difficulty level...</option>
                <option value="beginner">🟢 Beginner - Basic concepts and fundamentals</option>
                <option value="intermediate">🟡 Intermediate - More advanced topics</option>
                <option value="expert">🔴 Expert - Advanced and specialized content</option>
              </select>
            </div>

            <!-- Form Actions -->
            <div class="flex flex-col sm:flex-row gap-3 pt-4">
              <button 
                type="button" 
                id="reset-btn"
                class="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium transition-colors">
                Reset Form
              </button>
              <button 
                type="submit" 
                id="generate-btn" 
                disabled
                class="flex-1 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-6 py-3 rounded-lg font-medium cursor-not-allowed transition-all">
                <span class="btn-text">Generate Course</span>
                <span class="btn-loading hidden">
                  <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              </button>
            </div>
          </form>
        </div>

        <!-- Error/Success Display (Legacy - now using toast) -->
        <div id="create-error" class="hidden mt-6">
          <!-- Dynamic error/success messages will be displayed here -->
        </div>

        <!-- Help Information -->
        <div class="mt-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-800 dark:text-white mb-3 flex items-center">
            <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Tips untuk Course yang Berkualitas
          </h3>
          <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li class="flex items-start">
              <span class="text-green-500 mr-2">✓</span>
              Gunakan topik yang spesifik dan jelas (contoh: "Algoritma Sorting" daripada "Programming")
            </li>
            <li class="flex items-start">
              <span class="text-green-500 mr-2">✓</span>
              Pilih level yang sesuai dengan pemahaman Anda saat ini
            </li>
            <li class="flex items-start">
              <span class="text-green-500 mr-2">✓</span>
              Manfaatkan rekomendasi untuk topik yang sudah terbukti berkualitas
            </li>
            <li class="flex items-start">
              <span class="text-green-500 mr-2">✓</span>
              Course akan di-generate dalam beberapa menit dan dapat diakses di halaman Course
            </li>
          </ul>
        </div>

        <!-- Statistics -->
        <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">16</div>
            <div class="text-sm text-blue-800 dark:text-blue-300">Sesi per Course</div>
          </div>
          <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">AI</div>
            <div class="text-sm text-green-800 dark:text-green-300">Powered Generation</div>
          </div>
          <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">Quiz</div>
            <div class="text-sm text-purple-800 dark:text-purple-300">Interactive Learning</div>
          </div>
        </div>
      </section>
    `;

    return WrapperLayout(content);
  },

  async afterRender() {
    try {
      console.log('🚀 CreateCoursePage afterRender started');

      // Clean up any existing presenter
      if (this.currentPresenter) {
        this.currentPresenter.destroy();
      }

      // Create new presenter instance
      this.currentPresenter = CreateCoursePresenter;

      // FIXED: Clear subject field to ensure it starts empty
      const subjectInput = document.getElementById('subject');
      if (subjectInput) {
        subjectInput.value = ''; // Force empty value
      }

      // Initialize the presenter
      await this.currentPresenter.init();

      // Add additional page-level functionality
      this.setupPageFeatures();

      // Show welcome toast for first-time users
      this.showWelcomeToast();

      console.log('✅ CreateCoursePage initialized successfully');

    } catch (error) {
      console.error('❌ Error in CreateCoursePage afterRender:', error);
      this.showInitializationError(error);
    }
  },

  setupPageFeatures() {
    // Character counter for subject textarea
    const subjectInput = document.getElementById('subject');
    const charCount = document.getElementById('char-count');

    if (subjectInput && charCount) {
      // FIXED: Reset character count to 0 on page load
      const updateCharCount = () => {
        const length = subjectInput.value.length;
        charCount.textContent = `${length}/500 karakter`;

        if (length > 450) {
          charCount.className = 'text-xs text-red-500 dark:text-red-400';
        } else if (length > 400) {
          charCount.className = 'text-xs text-yellow-500 dark:text-yellow-400';
        } else {
          charCount.className = 'text-xs text-gray-500 dark:text-gray-400';
        }

        // Show warning when approaching limit
        if (length > 480) {
          if (!this.charWarningShown) {
            toast.warning('Mendekati batas maksimal karakter!');
            this.charWarningShown = true;
          }
        } else {
          this.charWarningShown = false;
        }
      };

      // FIXED: Clear field and reset counter immediately
      subjectInput.value = '';
      charCount.textContent = '0/500 karakter';
      charCount.className = 'text-xs text-gray-500 dark:text-gray-400';

      subjectInput.addEventListener('input', updateCharCount);
      updateCharCount(); // Initial count
    }

    // Reset button functionality
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn && this.currentPresenter) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Apakah Anda yakin ingin mereset form?')) {
          this.currentPresenter.resetForm();

          // Reset character counter
          if (charCount) {
            charCount.textContent = '0/500 karakter';
            charCount.className = 'text-xs text-gray-500 dark:text-gray-400';
          }

          this.charWarningShown = false;
        }
      });
    }

    // Auto-show recommendations container when clicking recommend button
    const recommendBtn = document.getElementById('recommend-btn');
    const recommendationContainer = document.getElementById('recommendation-container');

    if (recommendBtn && recommendationContainer) {
      recommendBtn.addEventListener('click', () => {
        recommendationContainer.classList.remove('hidden');
      });
    }

    // Auto-hide recommendations when clicking outside
    document.addEventListener('click', (e) => {
      if (recommendationContainer &&
        !recommendationContainer.contains(e.target) &&
        e.target !== recommendBtn &&
        !recommendBtn.contains(e.target)) {

        // Only hide if not currently loading recommendations
        if (!recommendationContainer.querySelector('.animate-spin')) {
          setTimeout(() => {
            recommendationContainer.classList.add('hidden');
          }, 200);
        }
      }
    });

    // Enhanced form validation visual feedback
    this.setupFormValidationFeedback();

    // Keyboard shortcuts
    this.setupKeyboardShortcuts();
  },

  setupFormValidationFeedback() {
    const subjectInput = document.getElementById('subject');
    const levelSelect = document.getElementById('level');

    // Add real-time validation feedback
    [subjectInput, levelSelect].forEach(element => {
      if (!element) return;

      element.addEventListener('blur', () => {
        this.validateField(element);
      });

      element.addEventListener('focus', () => {
        this.clearFieldValidation(element);
      });
    });
  },

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + Enter to submit form
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        const generateBtn = document.getElementById('generate-btn');
        if (generateBtn && !generateBtn.disabled) {
          generateBtn.click();
        }
      }

      // Ctrl/Cmd + R to reset form (prevent browser refresh)
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
          resetBtn.click();
        }
      }

      // Escape to clear recommendations
      if (e.key === 'Escape') {
        const recommendationContainer = document.getElementById('recommendation-container');
        if (recommendationContainer && !recommendationContainer.classList.contains('hidden')) {
          recommendationContainer.classList.add('hidden');
        }
      }
    });
  },

  validateField(element) {
    let isValid = true;
    let errorMessage = '';

    if (element.id === 'subject') {
      const value = element.value.trim();
      if (!value) {
        isValid = false;
        errorMessage = 'Subject tidak boleh kosong';
      } else if (value.length < 3) {
        isValid = false;
        errorMessage = 'Subject minimal 3 karakter';
      }
    } else if (element.id === 'level') {
      if (!element.value) {
        isValid = false;
        errorMessage = 'Level harus dipilih';
      }
    }

    // Apply validation styling
    if (!isValid) {
      element.classList.add('border-red-500', 'dark:border-red-400');
      element.classList.remove('border-gray-300', 'dark:border-gray-600');
      this.showFieldError(element, errorMessage);
    } else {
      element.classList.add('border-green-500', 'dark:border-green-400');
      element.classList.remove('border-gray-300', 'dark:border-gray-600', 'border-red-500', 'dark:border-red-400');
      this.clearFieldError(element);
    }
  },

  clearFieldValidation(element) {
    element.classList.remove(
      'border-red-500', 'dark:border-red-400',
      'border-green-500', 'dark:border-green-400'
    );
    element.classList.add('border-gray-300', 'dark:border-gray-600');
    this.clearFieldError(element);
  },

  showFieldError(element, message) {
    // Remove existing error
    this.clearFieldError(element);

    // Create error element
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error text-xs text-red-500 dark:text-red-400 mt-1';
    errorElement.textContent = message;

    // Insert after the element
    element.parentNode.insertBefore(errorElement, element.nextSibling);
  },

  clearFieldError(element) {
    const existingError = element.parentNode.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }
  },

  showWelcomeToast() {
    // Check if this is user's first visit to create course page
    const hasVisited = localStorage.getItem('create_course_visited');
    if (!hasVisited) {
      setTimeout(() => {
        toast.info('💡 Tip: Gunakan rekomendasi untuk course yang sudah terbukti berkualitas!', {
          duration: 5000,
          actions: [{
            label: 'Lihat Rekomendasi',
            handler: () => {
              const recommendBtn = document.getElementById('recommend-btn');
              if (recommendBtn) recommendBtn.click();
            }
          }]
        });
      }, 1000);

      localStorage.setItem('create_course_visited', 'true');
    }
  },

  showInitializationError(error) {
    const container = document.querySelector('#main-content');
    if (!container) return;

    // Show error toast
    toast.error('Gagal menginisialisasi halaman. Silakan refresh halaman.', {
      persistent: true,
      actions: [
        {
          label: 'Refresh',
          handler: () => location.reload()
        },
        {
          label: 'Dashboard',
          handler: () => window.location.hash = '#/dashboard'
        }
      ]
    });

    const errorHTML = `
      <div class="max-w-2xl mx-auto py-10 px-4">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 class="text-xl font-bold text-red-800 dark:text-red-200 mb-2">
            Gagal Memuat Halaman
          </h2>
          <p class="text-red-700 dark:text-red-300 mb-4">
            Terjadi kesalahan saat menginisialisasi halaman create course.
          </p>
          <p class="text-sm text-red-600 dark:text-red-400 mb-6">
            Error: ${error.message}
          </p>
          <div class="space-y-2">
            <button 
              onclick="location.reload()"
              class="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
              Muat Ulang Halaman
            </button>
            <a 
              href="#/dashboard" 
              class="block w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-center">
              Kembali ke Dashboard
            </a>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = errorHTML;
  },

  // Cleanup method called when leaving the page
  destroy() {
    console.log('🧹 Cleaning up CreateCoursePage...');

    if (this.currentPresenter) {
      this.currentPresenter.destroy();
      this.currentPresenter = null;
    }

    // Clean up page-level variables
    this.charWarningShown = false;

    console.log('✅ CreateCoursePage cleaned up');
  }
};

export default CreateCoursePage;