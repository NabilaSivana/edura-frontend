// pages/dashboard/profile/profile-presenter.js
import ProfileModel from './profile-model.js';
import ProfileView from './profile-view.js';

class ProfilePresenter {
  constructor() {
    this.model = new ProfileModel();
    this.view = new ProfileView(this);
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;

    try {
      console.log('🚀 Initializing Profile Presenter...');

      // Load user role first
      await this.model.getCurrentUserRole();
      console.log('✅ User role loaded:', this.model.userRole);

      // Load basic profile first (this is critical)
      try {
        await this.model.loadBasicProfile();
        console.log('✅ Basic profile loaded successfully');
      } catch (error) {
        console.error('❌ Critical: Failed to load basic profile:', error);
        throw error; // This is critical, should stop initialization
      }

      // Load role profile (this can fail without breaking the page)
      try {
        await this.model.loadRoleProfile();
        console.log('✅ Role profile loaded successfully');
      } catch (error) {
        console.warn('⚠️ Role profile failed to load (non-critical):', error);
        // Continue even if role profile fails
      }

      // Render profile content
      await this.renderProfileContent();

      // Bind events
      this.bindEvents();

      this.isInitialized = true;
      console.log('✅ Profile presenter initialized successfully');

    } catch (error) {
      console.error('❌ Error initializing profile presenter:', error);
      this.renderError(error.message || 'Failed to load profile');
    }
  }

  async renderProfileContent() {
    const profileContent = document.getElementById('profile-content');
    if (!profileContent) {
      console.error('❌ Profile content container not found');
      return;
    }

    const content = this.view.renderProfileContent(
      this.model.basicProfile,
      this.model.roleProfile,
      this.model.userRole
    );

    profileContent.innerHTML = content;
    console.log('✅ Profile content rendered');
  }

  bindEvents() {
    this.bindBasicProfileEvents();
    this.bindRoleProfileEvents();
    this.bindGlobalEvents();
  }

  bindBasicProfileEvents() {
    // Edit basic profile button
    const editBasicBtn = document.getElementById('edit-basic-profile');
    if (editBasicBtn) {
      editBasicBtn.addEventListener('click', this.toggleBasicProfileEdit.bind(this));
    }

    // Cancel basic profile edit
    const cancelBasicBtn = document.getElementById('cancel-basic-edit');
    if (cancelBasicBtn) {
      cancelBasicBtn.addEventListener('click', this.cancelBasicProfileEdit.bind(this));
    }

    // Basic profile form submission
    const basicForm = document.getElementById('basic-profile-form-element');
    if (basicForm) {
      basicForm.addEventListener('submit', this.handleBasicProfileSubmit.bind(this));
    }
  }

  bindRoleProfileEvents() {
    // Edit role profile button
    const editRoleBtn = document.getElementById('edit-role-profile');
    if (editRoleBtn) {
      // Remove existing event listeners to prevent duplication
      editRoleBtn.replaceWith(editRoleBtn.cloneNode(true));
      const newEditRoleBtn = document.getElementById('edit-role-profile');
      newEditRoleBtn.addEventListener('click', this.toggleRoleProfileEdit.bind(this));
    }

    // Create role profile button (for when no profile exists)
    const createRoleBtn = document.getElementById('create-role-profile');
    if (createRoleBtn) {
      createRoleBtn.replaceWith(createRoleBtn.cloneNode(true));
      const newCreateRoleBtn = document.getElementById('create-role-profile');
      newCreateRoleBtn.addEventListener('click', this.toggleRoleProfileEdit.bind(this));
    }

    // Cancel role profile edit
    const cancelRoleBtn = document.getElementById('cancel-role-edit');
    if (cancelRoleBtn) {
      cancelRoleBtn.addEventListener('click', this.cancelRoleProfileEdit.bind(this));
    }

    // Role profile form submission
    const roleForm = document.getElementById('role-profile-form-element');
    if (roleForm) {
      roleForm.addEventListener('submit', this.handleRoleProfileSubmit.bind(this));
    }

    // Student-specific events
    if (this.model.userRole === 'student') {
      this.bindStudentEvents();
    }
  }

  bindStudentEvents() {
    // Join class button
    const joinClassBtn = document.getElementById('join-class-btn');
    if (joinClassBtn) {
      joinClassBtn.addEventListener('click', this.handleJoinClass.bind(this));
    }

    // Leave class button
    const leaveClassBtn = document.getElementById('leave-class-btn');
    if (leaveClassBtn) {
      leaveClassBtn.addEventListener('click', this.handleLeaveClass.bind(this));
    }

    // Class code input change handler with debouncing
    const classCodeInput = document.getElementById('class-code-input');
    if (classCodeInput) {
      let validationTimeout;

      classCodeInput.addEventListener('input', (event) => {
        const code = event.target.value.trim();

        // Clear previous timeout
        if (validationTimeout) {
          clearTimeout(validationTimeout);
        }

        // Reset form state immediately when input is cleared
        if (!code) {
          this.view.resetClassCodeForm();
          return;
        }

        // Show loading after a short delay
        validationTimeout = setTimeout(async () => {
          await this.handleClassCodeValidation(code);
        }, 500); // 500ms debounce
      });

      // Also handle blur event for immediate validation
      classCodeInput.addEventListener('blur', async (event) => {
        const code = event.target.value.trim();
        if (code) {
          // Clear any pending timeout
          if (validationTimeout) {
            clearTimeout(validationTimeout);
          }
          await this.handleClassCodeValidation(code);
        }
      });
    }
  }

  bindGlobalEvents() {
    // Refresh profile button
    const refreshBtn = document.getElementById('refresh-profile');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', this.handleRefreshProfile.bind(this));
    }
  }

  // Basic Profile Methods
  toggleBasicProfileEdit() {
    const viewDiv = document.getElementById('basic-profile-view');
    const formDiv = document.getElementById('basic-profile-form');

    if (viewDiv && formDiv) {
      viewDiv.classList.toggle('hidden');
      formDiv.classList.toggle('hidden');

      if (!formDiv.classList.contains('hidden')) {
        // Focus first input when showing form
        const firstInput = formDiv.querySelector('input');
        if (firstInput) firstInput.focus();
      }
    }
  }

  cancelBasicProfileEdit() {
    this.view.clearAllErrors();
    this.toggleBasicProfileEdit();

    // Reset form to original values
    const form = document.getElementById('basic-profile-form-element');
    if (form) {
      const profile = this.model.basicProfile;
      form.querySelector('[name="full_name"]').value = profile?.full_name || '';
      form.querySelector('[name="email"]').value = profile?.email || '';
      form.querySelector('[name="old_password"]').value = '';
      form.querySelector('[name="new_password"]').value = '';
    }
  }

  async handleBasicProfileSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = form.querySelector('[type="submit"]');
    const formData = new FormData(form);

    // Clear previous errors
    this.view.clearAllErrors();

    // Prepare update data
    const updateData = {};

    const fullName = formData.get('full_name')?.trim();
    const email = formData.get('email')?.trim();
    const oldPassword = formData.get('old_password')?.trim();
    const newPassword = formData.get('new_password')?.trim();

    if (fullName) updateData.full_name = fullName;
    if (email) updateData.email = email;
    if (oldPassword) updateData.old_password = oldPassword;
    if (newPassword) updateData.new_password = newPassword;

    // Validate form data
    const validationErrors = this.model.validateBasicProfile(updateData);
    if (validationErrors) {
      Object.entries(validationErrors).forEach(([field, message]) => {
        this.view.showFieldError(field, message);
      });
      return;
    }

    // Check if there are any changes
    if (Object.keys(updateData).length === 0) {
      this.view.showFieldError('full_name', 'No changes to save');
      return;
    }

    try {
      this.view.showButtonLoading(submitBtn);

      await this.model.updateBasicProfile(updateData);

      this.view.showSuccessMessage('Basic profile updated successfully!');

      // Re-render profile content
      await this.renderProfileContent();
      this.bindEvents();

    } catch (error) {
      console.error('Error updating basic profile:', error);

      if (error.status === 401 && error.message?.includes('password')) {
        this.view.showFieldError('old_password', 'Current password is incorrect');
      } else {
        this.view.showFieldError('full_name', error.message || 'Failed to update profile');
      }
    } finally {
      this.view.hideButtonLoading(submitBtn, 'Save Changes');
    }
  }

  // Role Profile Methods
  async toggleRoleProfileEdit() {
    const viewDiv = document.getElementById('role-profile-view');
    const formDiv = document.getElementById('role-profile-form');

    if (viewDiv && formDiv) {
      const isFormHidden = formDiv.classList.contains('hidden');

      if (isFormHidden) {
        // Show form - need to generate form content first
        try {
          const formContent = await this.view.renderRoleProfileFormAsync(
            this.model.roleProfile,
            this.model.userRole
          );
          formDiv.innerHTML = formContent;
        } catch (error) {
          console.error('Error rendering role profile form:', error);
          formDiv.innerHTML = '<p class="text-red-500">Error loading form</p>';
        }
      }

      viewDiv.classList.toggle('hidden');
      formDiv.classList.toggle('hidden');

      if (!formDiv.classList.contains('hidden')) {
        // Focus first input when showing form
        const firstInput = formDiv.querySelector('input, select');
        if (firstInput) firstInput.focus();

        // Re-bind events for the new form
        this.bindRoleProfileEvents();

        // If this is a student and there's existing profile, show manual fields initially
        if (this.model.userRole === 'student' && this.model.roleProfile) {
          this.view.showManualFields();
        }
      }
    }
  }

  cancelRoleProfileEdit() {
    this.view.clearAllErrors();
    this.toggleRoleProfileEdit();

    // Reset form to original values if editing existing profile
    if (this.model.roleProfile) {
      this.resetRoleProfileForm();
    } else if (this.model.userRole === 'student') {
      // For new student profile, reset class code form
      this.view.resetClassCodeForm();
    }
  }

  resetRoleProfileForm() {
    const form = document.getElementById('role-profile-form-element');
    if (!form || !this.model.roleProfile) return;

    const profile = this.model.roleProfile;

    if (this.model.userRole === 'student') {
      form.querySelector('[name="nim"]').value = profile.nim || '';
      form.querySelector('[name="full_name"]').value = profile.full_name || '';
      form.querySelector('[name="jurusan"]').value = profile.jurusan || '';

      // Reset class code form
      this.view.resetClassCodeForm();

      form.querySelector('[name="program_studi"]').value = profile.program_studi || '';
      form.querySelector('[name="perguruan_tinggi"]').value = profile.perguruan_tinggi || '';
    } else if (this.model.userRole === 'teacher') {
      form.querySelector('[name="nidn"]').value = profile.nidn || '';
      form.querySelector('[name="full_name"]').value = profile.full_name || '';
      form.querySelector('[name="fakultas"]').value = profile.fakultas || '';
      form.querySelector('[name="program_studi"]').value = profile.program_studi || '';
      form.querySelector('[name="perguruan_tinggi"]').value = profile.perguruan_tinggi || '';
    }
  }

  async handleRoleProfileSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = form.querySelector('[type="submit"]');
    const formData = new FormData(form);

    // Clear previous errors
    this.view.clearAllErrors();

    const isCreate = !this.model.roleProfile;

    try {
      this.view.showButtonLoading(submitBtn);

      if (this.model.userRole === 'student') {
        await this.handleStudentProfileSubmit(formData, isCreate);
      } else if (this.model.userRole === 'teacher') {
        await this.handleTeacherProfileSubmit(formData, isCreate);
      }

      const action = isCreate ? 'created' : 'updated';
      this.view.showSuccessMessage(`${this.model.userRole.charAt(0).toUpperCase() + this.model.userRole.slice(1)} profile ${action} successfully!`);

      // Re-render profile content
      await this.renderProfileContent();
      this.bindEvents();

    } catch (error) {
      console.error(`Error ${isCreate ? 'creating' : 'updating'} ${this.model.userRole} profile:`, error);
      this.handleProfileSubmitError(error);
    } finally {
      const originalText = isCreate ? 'Create Profile' : 'Update Profile';
      this.view.hideButtonLoading(submitBtn, originalText);
    }
  }

  async handleStudentProfileSubmit(formData, isCreate) {
    const classCode = formData.get('class_code')?.trim() || null;
    const isAutoFilled = formData.get('auto_filled') === 'true';
    const validatedClassId = formData.get('validated_class_id') || null;

    const updateData = {
      nim: formData.get('nim')?.trim(),
      full_name: formData.get('full_name')?.trim(),
      jurusan: formData.get('jurusan')?.trim(),
    };

    // Handle class code and program data
    if (classCode && isAutoFilled) {
      // User provided valid class code - use it (id might be null from API)
      updateData.class_code = classCode;
      console.log('📝 Using validated class code:', classCode);
    } else if (!classCode) {
      // No class code - use manual input
      updateData.class_code = null;
      updateData.program_studi = formData.get('program_studi')?.trim() || null;
      updateData.perguruan_tinggi = formData.get('perguruan_tinggi')?.trim() || null;
      console.log('📝 Using manual program data');
    } else {
      // Class code provided but not validated - error
      this.view.showFieldError('class_code', 'Please wait for class code validation or clear the field');
      throw new Error('Validation failed');
    }

    // Enhanced validation
    const validationErrors = this.validateStudentProfileData(updateData, classCode);
    if (validationErrors) {
      Object.entries(validationErrors).forEach(([field, message]) => {
        this.view.showFieldError(field, message);
      });
      throw new Error('Validation failed');
    }

    // Submit to API
    await this.model.updateStudentProfile(updateData, isCreate);
  }

  validateStudentProfileData(updateData, hasClassCode) {
    const errors = {};

    // Basic required fields
    if (!updateData.nim || updateData.nim.length === 0) {
      errors.nim = 'NIM is required';
    }

    if (!updateData.full_name || updateData.full_name.length === 0) {
      errors.full_name = 'Full name is required';
    }

    if (!updateData.jurusan || updateData.jurusan.length === 0) {
      errors.jurusan = 'Jurusan is required';
    }

    // Program studi and perguruan tinggi validation
    if (!hasClassCode) {
      // Manual mode - both are required
      if (!updateData.program_studi) {
        errors.program_studi = 'Program Studi is required when not joining a class';
      }

      if (!updateData.perguruan_tinggi) {
        errors.perguruan_tinggi = 'Perguruan Tinggi is required when not joining a class';
      }
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }

  async handleTeacherProfileSubmit(formData, isCreate) {
    const updateData = {
      nidn: formData.get('nidn')?.trim(),
      full_name: formData.get('full_name')?.trim(),
      fakultas: formData.get('fakultas')?.trim(),
      program_studi: formData.get('program_studi')?.trim(),
      perguruan_tinggi: formData.get('perguruan_tinggi')?.trim()
    };

    // Validate
    const validationErrors = this.model.validateTeacherProfile(updateData);
    if (validationErrors) {
      Object.entries(validationErrors).forEach(([field, message]) => {
        this.view.showFieldError(field, message);
      });
      throw new Error('Validation failed');
    }

    await this.model.updateTeacherProfile(updateData, isCreate);
  }

  handleProfileSubmitError(error) {
    if (error.message === 'Validation failed') {
      return; // Errors already shown
    }

    // Handle specific error types
    if (error.status === 409 || error.message?.includes('already')) {
      const field = this.model.userRole === 'student' ? 'nim' : 'nidn';
      this.view.showFieldError(field, `${field.toUpperCase()} already exists`);
    } else if (error.message?.includes('class_code') || error.message?.includes('kelas')) {
      this.view.showFieldError('class_code', 'Invalid class code');
    } else {
      // Generic error on first field
      const firstField = this.model.userRole === 'student' ? 'nim' : 'nidn';
      this.view.showFieldError(firstField, error.message || 'Failed to save profile');
    }
  }

  // Student Class Methods
  async handleJoinClass() {
    const classCode = prompt('Enter class code:');
    if (!classCode) return;

    try {
      await this.model.joinClass(classCode.trim());
      this.view.showSuccessMessage('Successfully joined class!');

      // Re-render profile content
      await this.renderProfileContent();
      this.bindEvents();

    } catch (error) {
      console.error('Error joining class:', error);
      alert(error.message || 'Failed to join class');
    }
  }

  async handleLeaveClass() {
    if (!this.model.roleProfile?.kelas) return;

    const className = this.model.roleProfile.kelas;
    const confirmation = prompt(`To leave class "${className}", please type the class name exactly:`);

    if (confirmation !== className) {
      alert('Class name does not match. Please try again.');
      return;
    }

    try {
      await this.model.leaveClass(className);
      this.view.showSuccessMessage('Successfully left class!');

      // Re-render profile content
      await this.renderProfileContent();
      this.bindEvents();

    } catch (error) {
      console.error('Error leaving class:', error);
      alert(error.message || 'Failed to leave class');
    }
  }

  async handleClassCodeValidation(code) {
    if (!code || code.length === 0) {
      this.view.resetClassCodeForm();
      return;
    }

    try {
      console.log('🔍 Validating class code:', code);

      // Show loading state
      this.view.showClassCodeLoading();

      // Validate class code
      const validation = await this.model.validateClassCode(code);

      if (validation.valid) {
        console.log('✅ Class code is valid:', validation.classInfo);
        this.view.showClassCodeSuccess(validation.classInfo);
      } else {
        console.log('❌ Class code is invalid:', validation.error);
        this.view.showClassCodeError(validation.error);
      }

    } catch (error) {
      console.error('❌ Error during class code validation:', error);
      this.view.showClassCodeError('Failed to validate class code');
    }
  }

  handleClassCodeChange(event) {
    // This method is kept for backward compatibility
    // The actual logic is now in bindStudentEvents with debouncing
  }

  // Global Methods
  async handleRefreshProfile() {
    const refreshBtn = document.getElementById('refresh-profile');

    try {
      if (refreshBtn) {
        // Just disable button, no loading animation
        refreshBtn.disabled = true;
        refreshBtn.style.opacity = '0.6';
      }

      console.log('🔄 Refreshing profile data...');

      // Force refresh both profiles
      const refreshPromises = [
        this.model.loadBasicProfile(true),
        this.model.loadRoleProfile(true)
      ];

      const results = await Promise.allSettled(refreshPromises);

      // Log results for debugging
      results.forEach((result, index) => {
        const profileType = index === 0 ? 'basic' : 'role';
        if (result.status === 'fulfilled') {
          console.log(`✅ ${profileType} profile refreshed successfully`);
        } else {
          console.warn(`⚠️ ${profileType} profile refresh failed:`, result.reason);
        }
      });

      // Re-render content
      await this.renderProfileContent();
      this.bindEvents();

      console.log('✅ Profile refresh completed');
      this.view.showSuccessMessage('Profile refreshed successfully!');

    } catch (error) {
      console.error('❌ Error refreshing profile:', error);
      alert('Failed to refresh profile: ' + (error.message || 'Unknown error'));
    } finally {
      // Always restore button state
      if (refreshBtn) {
        refreshBtn.disabled = false;
        refreshBtn.style.opacity = '1';
        console.log('🔄 Refresh button restored');
      }
    }
  }

  renderError(message) {
    const profileContent = document.getElementById('profile-content');
    if (profileContent) {
      profileContent.innerHTML = this.view.renderErrorMessage(message);
    }
  }

  // Cleanup method
  destroy() {
    this.isInitialized = false;
    // Remove any global event listeners if needed
  }

  // Public getters for debugging
  get currentModel() {
    return this.model;
  }

  get currentView() {
    return this.view;
  }
}

export default ProfilePresenter;