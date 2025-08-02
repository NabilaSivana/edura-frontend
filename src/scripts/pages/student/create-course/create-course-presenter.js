// create-course-presenter.js - Updated with Toast Notifications
import CreateCourseModel from "./create-course-model.js";
import { toast, courseToast, removeToast } from "../../../utils/toast.js";

const CreateCoursePresenter = {
  model: CreateCourseModel,
  elements: {},
  isInitialized: false,
  currentLoadingToast: null,

  // Initialize presenter
  init() {
    try {
      console.log('🚀 Initializing CreateCoursePresenter...');

      // Get DOM elements
      this.getElements();

      // Setup event listeners
      this.setupEventListeners();

      // Check for stale generation and cleanup
      this.model.cleanupStaleGeneration();

      // Check for pending generation
      this.checkPendingGeneration();

      // Initial form validation
      this.validateForm();

      this.isInitialized = true;
      console.log('✅ CreateCoursePresenter initialized successfully');

    } catch (error) {
      console.error('❌ Failed to initialize CreateCoursePresenter:', error);
      toast.error('Gagal menginisialisasi halaman. Silakan refresh halaman.');
    }
  },

  // Get required DOM elements
  getElements() {
    this.elements = {
      form: document.getElementById('create-course-form'),
      subjectInput: document.getElementById('subject'),
      levelSelect: document.getElementById('level'),
      generateBtn: document.getElementById('generate-btn'),
      recommendBtn: document.getElementById('recommend-btn'),
      recommendationList: document.getElementById('recommendation-list'),
      errorElement: document.getElementById('create-error')
    };

    // Validate critical elements exist
    const required = ['form', 'subjectInput', 'levelSelect', 'generateBtn'];
    for (const key of required) {
      if (!this.elements[key]) {
        throw new Error(`Required element not found: ${key}`);
      }
    }
  },

  // Setup all event listeners
  setupEventListeners() {
    // Form submission
    this.elements.form.addEventListener('submit', (e) => this.handleFormSubmit(e));

    // Input validation
    this.elements.subjectInput.addEventListener('input', () => this.handleInputChange());
    this.elements.levelSelect.addEventListener('change', () => this.handleInputChange());

    // Recommendation button
    if (this.elements.recommendBtn) {
      this.elements.recommendBtn.addEventListener('click', () => this.handleRecommendationRequest());
    }
  },

  // Handle form submission
  async handleFormSubmit(e) {
    e.preventDefault();

    try {
      const formData = this.getFormData();

      // Validate form data
      if (!this.validateFormData(formData)) {
        return;
      }

      // Show loading states
      this.setLoadingState(true);
      this.currentLoadingToast = courseToast.creatingCourse(formData.subject);
      this.hideError();

      console.log('📝 Submitting course creation:', formData);

      // Create course
      const result = await this.model.createCourse(formData);

      // Remove loading toast
      if (this.currentLoadingToast) {
        removeToast(this.currentLoadingToast);
        this.currentLoadingToast = null;
      }

      // Handle result
      this.handleCreationResult(result);

    } catch (error) {
      console.error('❌ Form submission error:', error);

      // Remove loading toast
      if (this.currentLoadingToast) {
        removeToast(this.currentLoadingToast);
        this.currentLoadingToast = null;
      }

      toast.error('Terjadi kesalahan saat membuat course. Silakan coba lagi.');
      this.setLoadingState(false);
    }
  },

  // Handle input changes
  handleInputChange() {
    // Clear recommendation selection when user types
    this.model.clearRecommendation();
    this.clearRecommendationHighlight();

    // Validate form
    this.validateForm();
  },

  // Handle recommendation request
  async handleRecommendationRequest() {
    try {
      console.log('🎯 Loading recommendations...');

      // Show loading toast
      const loadingToast = courseToast.loadingRecommendations();

      // Show loading in recommendation area
      this.showRecommendationLoading();

      // Get recommendations
      const result = await this.model.getRecommendations();

      // Remove loading toast
      removeToast(loadingToast);

      // Render recommendations
      this.renderRecommendations(result.recommendations);

      // if (result.recommendations.length > 0) {
      //   toast.success(`Ditemukan ${result.recommendations.length} rekomendasi course`);
      // } else {
      //   toast.info('Tidak ada rekomendasi tersedia saat ini');
      // }

    } catch (error) {
      console.error('❌ Failed to load recommendations:', error);
      this.showRecommendationError();
      toast.error('Gagal memuat rekomendasi. Silakan coba lagi.');
    }
  },

  // Handle course creation result
  handleCreationResult(result) {
    console.log('🎯 Handling creation result:', result);

    if (result.success) {
      this.handleSuccessResult(result);
    } else {
      this.handleErrorResult(result);
    }
  },

  // Handle successful creation
  handleSuccessResult(result) {
    console.log('✅ Course creation successful:', result);

    this.setLoadingState(false);

    if (result.isReused) {
      // Course was reused
      courseToast.courseReused(result.message);

      // Shorter delay for reused courses
      setTimeout(() => {
        window.location.hash = '#/dashboard';
      }, 1500);
    } else {
      // New course created
      courseToast.courseCreated(result.message);

      // Longer delay for new courses
      setTimeout(() => {
        window.location.hash = '#/dashboard';
      }, 2500);
    }

    // Clear form
    this.resetForm();
  },

  // Handle error result with specific actions
  handleErrorResult(result) {
    console.error('❌ Course creation failed:', result);

    this.setLoadingState(false);

    switch (result.type) {
      case 'generation_in_progress':
        courseToast.generationInProgress(result.existingCourseId);
        break;

      case 'quota_exceeded':
        courseToast.quotaExceeded();
        break;

      case 'server_overload':
        courseToast.serverOverload();
        break;

      case 'network_error':
        courseToast.networkError();
        break;

      case 'auth_error':
        courseToast.authError();
        // Auto redirect after delay
        setTimeout(() => {
          window.location.hash = '#/login';
        }, 2000);
        break;

      default:
        toast.error(result.error || 'Terjadi kesalahan yang tidak diketahui');
    }
  },

  // Check for pending generation
  async checkPendingGeneration() {
    try {
      const pending = await this.model.checkPendingGeneration();
      if (pending) {
        this.showPendingGenerationWarning(pending);
        toast.warning(`Course "${pending.subject}" sedang digenerate. Tunggu hingga selesai.`, {
          duration: 6000,
          actions: [{
            label: 'Lihat Progress',
            handler: () => window.location.hash = '#/dashboard'
          }]
        });
      }
    } catch (error) {
      console.warn('⚠️ Failed to check pending generation:', error);
    }
  },

  // Get form data
  getFormData() {
    return {
      subject: this.elements.subjectInput.value.trim(),
      level: this.elements.levelSelect.value
    };
  },

  // Validate form data
  validateFormData(formData) {
    const validation = this.model.validateInput(formData);
    if (!validation.isValid) {
      toast.warning(validation.error);
      return false;
    }
    return true;
  },

  // Validate form and update UI
  validateForm() {
    const formData = this.getFormData();
    const validation = this.model.validateInput(formData);

    this.updateGenerateButton(validation.isValid);
    return validation.isValid;
  },

  // Update generate button state
  updateGenerateButton(isValid) {
    const btn = this.elements.generateBtn;

    if (isValid) {
      btn.disabled = false;
      btn.className = 'bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition cursor-pointer';
      btn.textContent = 'Generate';
    } else {
      btn.disabled = true;
      btn.className = 'bg-gray-300 dark:bg-gray-700 text-white px-6 py-2 rounded cursor-not-allowed transition';
      btn.textContent = 'Generate';
    }
  },

  // Set loading state
  setLoadingState(isLoading) {
    const btn = this.elements.generateBtn;

    if (isLoading) {
      btn.disabled = true;
      btn.innerHTML = `
        <span class="flex items-center justify-center gap-2">
          <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          Creating...
        </span>
      `;
    } else {
      this.validateForm(); // This will restore proper button state
    }
  },

  // Render recommendations
  renderRecommendations(recommendations) {
    const container = this.elements.recommendationList;
    if (!container) return;

    if (!recommendations || recommendations.length === 0) {
      container.innerHTML = '<p class="text-gray-500 text-sm">Tidak ada rekomendasi tersedia saat ini.</p>';
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'space-y-2 mt-2';

    const label = document.createElement('p');
    label.className = 'text-sm font-medium text-gray-800 dark:text-gray-200';
    label.textContent = 'Rekomendasi topik:';
    wrapper.appendChild(label);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'flex flex-wrap gap-2';

    recommendations.forEach((rec) => {
      const formatted = this.model.formatRecommendation(rec);
      const btn = this.createRecommendationButton(formatted);
      buttonContainer.appendChild(btn);
    });

    wrapper.appendChild(buttonContainer);
    container.innerHTML = '';
    container.appendChild(wrapper);
  },

  // Create recommendation button
  createRecommendationButton(rec) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `
      border px-3 py-1.5 rounded text-sm transition
      ${rec.isVerified
        ? 'border-blue-500 text-blue-600 bg-blue-50 hover:bg-blue-100 font-medium'
        : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
      }
    `.trim();

    btn.innerHTML = `
      ${rec.displayText}
      ${rec.isVerified ? ' <span class="text-blue-600">✓</span>' : ''}
    `;

    btn.addEventListener('click', () => this.handleRecommendationSelect(rec));

    return btn;
  },

  // Handle recommendation selection
  handleRecommendationSelect(rec) {
    console.log('🎯 Recommendation selected:', rec);

    // Set in model
    this.model.selectRecommendation(rec);

    // Fill form
    this.elements.subjectInput.value = rec.displaySubject;
    this.elements.levelSelect.value = rec.level;

    // Highlight selected
    this.highlightSelectedRecommendation(rec);

    // Validate form
    this.validateForm();

    // Show success toast
    toast.success(`Rekomendasi "${rec.displaySubject}" dipilih`);
  },

  // Highlight selected recommendation
  highlightSelectedRecommendation(selectedRec) {
    const buttons = this.elements.recommendationList.querySelectorAll('button');
    buttons.forEach(btn => {
      if (btn.textContent.includes(selectedRec.displaySubject)) {
        btn.className = btn.className.replace('border-gray-300 text-gray-700 bg-white', 'border-green-500 text-green-700 bg-green-50');
        btn.className = btn.className.replace('border-blue-500 text-blue-600 bg-blue-50', 'border-green-500 text-green-700 bg-green-50');
      }
    });
  },

  // Clear recommendation highlight
  clearRecommendationHighlight() {
    const buttons = this.elements.recommendationList.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.className = btn.className.replace('border-green-500 text-green-700 bg-green-50', 'border-gray-300 text-gray-700 bg-white');
    });
  },

  // Show recommendation loading
  showRecommendationLoading() {
    if (this.elements.recommendationList) {
      this.elements.recommendationList.innerHTML = `
        <div class="flex items-center gap-2 text-gray-500 text-sm">
          <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Memuat rekomendasi...
        </div>
      `;
    }
  },

  // Show recommendation error
  showRecommendationError() {
    if (this.elements.recommendationList) {
      this.elements.recommendationList.innerHTML = '<p class="text-red-500 text-sm">Gagal memuat rekomendasi. Coba lagi.</p>';
    }
  },

  // Legacy error display methods (kept for backward compatibility)
  showError(message) {
    if (this.elements.errorElement) {
      this.elements.errorElement.textContent = message;
      this.elements.errorElement.classList.remove('hidden');
      this.elements.errorElement.className = 'text-red-600 mt-4 text-center';
    }
  },

  showSuccess(message) {
    if (this.elements.errorElement) {
      this.elements.errorElement.textContent = message;
      this.elements.errorElement.classList.remove('hidden');
      this.elements.errorElement.className = 'text-green-600 mt-4 text-center';
    }
  },

  hideError() {
    if (this.elements.errorElement) {
      this.elements.errorElement.classList.add('hidden');
    }
  },

  // Show pending generation warning
  showPendingGenerationWarning(pending) {
    const warning = document.createElement('div');
    warning.className = 'bg-yellow-50 border border-yellow-200 rounded p-3 mb-4 text-sm';
    warning.innerHTML = `
      <p class="font-medium text-yellow-800">⏳ Course Sedang Digenerate</p>
      <p class="text-yellow-700 mt-1">Course "${pending.subject}" sedang dibuat. Tunggu hingga selesai sebelum membuat course baru.</p>
      <button onclick="window.location.hash='#/dashboard'" class="mt-2 text-yellow-800 underline hover:no-underline">
        Lihat Progress →
      </button>
    `;

    // Insert before form
    this.elements.form.parentNode.insertBefore(warning, this.elements.form);
  },

  // Reset form to initial state
  resetForm() {
    if (this.elements.subjectInput) {
      this.elements.subjectInput.value = '';
    }

    if (this.elements.levelSelect) {
      this.elements.levelSelect.value = '';
    }

    if (this.elements.recommendationList) {
      this.elements.recommendationList.innerHTML = '';
    }

    this.hideError();
    this.model.reset();
    this.validateForm();
  },

  // Cleanup method
  destroy() {
    console.log('🧹 Cleaning up CreateCoursePresenter...');

    // Remove any pending loading toast
    if (this.currentLoadingToast) {
      removeToast(this.currentLoadingToast);
      this.currentLoadingToast = null;
    }

    // Reset model
    this.model.reset();

    // Clear elements
    this.elements = {};
    this.isInitialized = false;

    console.log('✅ CreateCoursePresenter cleaned up');
  }
};

export default CreateCoursePresenter;