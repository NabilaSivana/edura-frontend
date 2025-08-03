// export default ResetPasswordPage;
import API from "../../../data/api.js";
import { PasswordValidation } from "../../../utils/password-validation.js";

const ResetPasswordPage = {
  async render() {
    return `
      <section class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-100 dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 px-4 py-8 transition-all duration-500 relative overflow-hidden">
        
        <!-- Floating Background Elements -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="absolute -top-4 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 animate-pulse"></div>
          <div class="absolute -bottom-8 -right-4 w-72 h-72 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-200 dark:bg-blue-700 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-10 animate-pulse animation-delay-4000"></div>
        </div>

        <!-- Dark Mode Toggle -->
        <button 
          id="theme-toggle" 
          class="fixed top-6 right-6 p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 z-20 hover:scale-110 group border border-gray-200 dark:border-gray-700"
          aria-label="Toggle dark mode"
        >
          <svg id="theme-toggle-dark-icon" class="hidden w-5 h-5 text-yellow-500 group-hover:text-yellow-400 transition-colors" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
          </svg>
          <svg id="theme-toggle-light-icon" class="hidden w-5 h-5 text-gray-600 group-hover:text-gray-800 dark:group-hover:text-gray-400 transition-colors" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>
          </svg>
        </button>

        <!-- Main Card -->
        <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl dark:shadow-gray-900/50 w-full max-w-md transition-all duration-500 transform hover:scale-[1.02] border border-white/20 dark:border-gray-700/50 relative z-10">
          
          <!-- Header -->
          <div class="text-center mb-8 animate-fade-in">
            <div class="relative mb-6">
              <div class="w-20 h-20 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 dark:from-purple-400 dark:via-purple-500 dark:to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse-glow">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                </svg>
              </div>
              <!-- Security badge -->
              <div class="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
              </div>
            </div>
            <h2 class="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-3">
              Reset Password
            </h2>
            <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Buat password baru yang kuat dan aman untuk melindungi akun Anda
            </p>
          </div>

          <form id="reset-password-form" class="space-y-6">
            
            <!-- New Password Field -->
            <div class="group animate-slide-up">
              <label for="new-password" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-300">
                Password Baru
              </label>
              <div class="relative">
                <input
                  type="password"
                  id="new-password"
                  name="new-password"
                  required
                  minlength="8"
                  class="w-full px-4 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-300 hover:border-purple-300 dark:hover:border-purple-500 backdrop-blur-sm group-hover:shadow-md"
                  placeholder="Masukkan password baru (min. 8 karakter)"
                />
                <button
                  type="button"
                  id="toggle-password"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
                >
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
              
              <!-- Password Strength Indicator using Global System -->
              <div class="mt-3 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Kekuatan Password:</span>
                  <span id="strength-text" class="text-xs font-bold text-gray-500 dark:text-gray-400">Belum diisi</span>
                </div>
                <div class="flex space-x-1">
                  <div class="h-2 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div id="strength-bar" class="h-full transition-all duration-300 rounded-full"></div>
                  </div>
                </div>
                
                <!-- Password Requirements using Global System -->
                <div id="password-requirements" class="space-y-1 text-xs">
                  ${PasswordValidation.generateRequirementsHTML('reset-')}
                </div>
              </div>
            </div>

            <!-- Confirm Password Field -->
            <div class="group animate-slide-up" style="animation-delay: 0.1s;">
              <label for="confirm-password" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-300">
                Konfirmasi Password
              </label>
              <div class="relative">
                <input
                  type="password"
                  id="confirm-password"
                  name="confirm-password"
                  required
                  class="w-full px-4 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-300 hover:border-purple-300 dark:hover:border-purple-500 backdrop-blur-sm group-hover:shadow-md"
                  placeholder="Konfirmasi password baru"
                />
                <button
                  type="button"
                  id="toggle-confirm-password"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
                >
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
              
              <!-- Password Match Indicator using Global System -->
              <div id="password-match-indicator" class="mt-2 text-xs hidden">
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 rounded-full" id="match-indicator"></div>
                  <span id="match-text" class="font-medium"></span>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              id="submit-btn"
              class="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:from-purple-700 hover:via-purple-800 hover:to-pink-700 dark:from-purple-500 dark:via-purple-600 dark:to-pink-500 dark:hover:from-purple-600 dark:hover:via-purple-700 dark:hover:to-pink-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl animate-slide-up relative overflow-hidden group"
              style="animation-delay: 0.2s;"
              disabled
            >
              <!-- Button shine effect -->
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              
              <span id="btn-text" class="flex items-center justify-center relative z-10">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Reset Password
              </span>
              <div id="btn-loading" class="hidden flex items-center justify-center relative z-10">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </div>
            </button>

            <!-- Messages -->
            <div id="error-message" class="hidden bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-lg text-sm transition-all duration-300 animate-shake backdrop-blur-sm">
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
                <div>
                  <p class="font-semibold">Error!</p>
                  <span id="error-text"></span>
                </div>
              </div>
            </div>

            <div id="success-message" class="hidden bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 text-green-700 dark:text-green-300 p-4 rounded-lg text-sm transition-all duration-300 backdrop-blur-sm">
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-3 flex-shrink-0 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <div>
                  <p class="font-semibold">Berhasil!</p>
                  <span id="success-text"></span>
                </div>
              </div>
            </div>
          </form>

          <!-- Footer -->
          <div class="mt-8 text-center animate-fade-in" style="animation-delay: 0.3s;">
            <div class="flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
              </svg>
              <span>Link aman berenkripsi SSL</span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Ingat password Anda? 
              <a href="#/login" class="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-semibold transition-colors duration-300 hover:underline">
                Kembali ke Login
              </a>
            </p>
          </div>
        </div>
      </section>

      <style>
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(147, 51, 234, 0.3); }
          50% { box-shadow: 0 0 40px rgba(147, 51, 234, 0.6); }
        }
        
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .animate-bounce-in { animation: bounceIn 0.6s ease-out; }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        .animate-slide-up { animation: slideUp 0.4s ease-out; }
        .animate-pulse-glow { animation: pulseGlow 2s ease-in-out infinite; }

        /* Responsive design enhancements */
        @media (max-width: 640px) {
          .group:focus-within label {
            @apply text-purple-600 dark:text-purple-400;
          }
        }

        /* Animation delays */
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        
        /* Focus ring enhancement */
        input:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
        }
      </style>
    `;
  },

  async afterRender() {
    // Initialize theme
    this.initializeTheme();

    // Get token from URL
    const urlParams = new URLSearchParams(window.location.hash.split("?")[1]);
    const token = urlParams.get("token");

    if (!token) {
      this.showError("Token reset password tidak valid atau tidak ditemukan. Silakan gunakan link terbaru dari email Anda.");
      return;
    }

    // Initialize all event listeners
    this.initializeEventListeners();

    // Setup global password validation system
    this.setupGlobalPasswordValidation();

    // Add entrance animation
    this.addEntranceAnimation();
  },

  setupGlobalPasswordValidation() {
    // Setup password validation using global system
    PasswordValidation.setupPasswordValidation({
      passwordInput: "#new-password",
      confirmPasswordInput: "#confirm-password",
      strengthSelectors: {
        strengthBar: "#strength-bar",
        strengthText: "#strength-text",
        requirements: {
          length: "#reset-length-req",
          uppercase: "#reset-uppercase-req",
          lowercase: "#reset-lowercase-req",
          number: "#reset-number-req",
          special: "#reset-special-req"
        }
      },
      matchSelectors: {
        indicator: "#password-match-indicator",
        matchIndicator: "#match-indicator",
        matchText: "#match-text",
        confirmInput: "#confirm-password"
      },
      onValidationChange: (validation) => {
        this.updateSubmitButton(validation);
      }
    });
  },

  updateSubmitButton(validation) {
    const submitBtn = document.querySelector("#submit-btn");
    const password = document.querySelector("#new-password").value;
    const confirmPassword = document.querySelector("#confirm-password").value;

    // Check if all requirements are met
    const isPasswordValid = validation.password.isValid;
    const isMatchValid = validation.match.isValid;
    const hasPasswords = password.length > 0 && confirmPassword.length > 0;

    if (isPasswordValid && isMatchValid && hasPasswords) {
      submitBtn.disabled = false;
      submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      submitBtn.classList.add('hover:scale-[1.02]', 'active:scale-[0.98]');
    } else {
      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
      submitBtn.classList.remove('hover:scale-[1.02]', 'active:scale-[0.98]');
    }
  },

  initializeTheme() {
    const themeToggle = document.querySelector("#theme-toggle");
    const darkIcon = document.querySelector("#theme-toggle-dark-icon");
    const lightIcon = document.querySelector("#theme-toggle-light-icon");

    // Check for saved theme preference or default to 'light' mode
    const currentTheme = this.getStoredTheme() || 'light';

    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
      darkIcon.classList.remove('hidden');
      lightIcon.classList.add('hidden');
    } else {
      document.documentElement.classList.remove('dark');
      darkIcon.classList.add('hidden');
      lightIcon.classList.remove('hidden');
    }

    // Theme toggle event listener
    themeToggle.addEventListener('click', () => {
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        this.setStoredTheme('light');
        darkIcon.classList.add('hidden');
        lightIcon.classList.remove('hidden');
      } else {
        document.documentElement.classList.add('dark');
        this.setStoredTheme('dark');
        darkIcon.classList.remove('hidden');
        lightIcon.classList.add('hidden');
      }
    });
  },

  getStoredTheme() {
    try {
      return window.localStorage?.getItem('theme');
    } catch {
      return null;
    }
  },

  setStoredTheme(theme) {
    try {
      window.localStorage?.setItem('theme', theme);
    } catch {
      // Silent fail for localStorage unavailable
    }
  },

  addEntranceAnimation() {
    const card = document.querySelector('.bg-white\\/90');
    if (card) {
      card.classList.add('animate-bounce-in');
    }
  },

  initializeEventListeners() {
    const form = document.querySelector("#reset-password-form");
    const togglePassword = document.querySelector("#toggle-password");
    const toggleConfirmPassword = document.querySelector("#toggle-confirm-password");

    // Toggle password visibility
    togglePassword.addEventListener("click", () => {
      this.togglePasswordVisibility(document.querySelector("#new-password"), togglePassword);
    });

    toggleConfirmPassword.addEventListener("click", () => {
      this.togglePasswordVisibility(document.querySelector("#confirm-password"), toggleConfirmPassword);
    });

    // Form submission
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      await this.handleSubmit();
    });

    // Add focus animations and effects
    const passwordInputs = [document.querySelector("#new-password"), document.querySelector("#confirm-password")];
    passwordInputs.forEach(input => {
      input.addEventListener('focus', (e) => {
        e.target.parentElement.classList.add('scale-[1.02]', 'shadow-lg');
        e.target.parentElement.parentElement.querySelector('label').classList.add('text-purple-600', 'dark:text-purple-400');
      });

      input.addEventListener('blur', (e) => {
        e.target.parentElement.classList.remove('scale-[1.02]', 'shadow-lg');
        e.target.parentElement.parentElement.querySelector('label').classList.remove('text-purple-600', 'dark:text-purple-400');
      });
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        form.dispatchEvent(new Event('submit'));
      }
    });
  },

  togglePasswordVisibility(input, button) {
    const type = input.getAttribute("type") === "password" ? "text" : "password";
    input.setAttribute("type", type);

    const icon = button.querySelector("svg");
    if (type === "text") {
      icon.innerHTML = `
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
      `;
    } else {
      icon.innerHTML = `
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      `;
    }

    // Add visual feedback
    button.classList.add('scale-90');
    setTimeout(() => {
      button.classList.remove('scale-90');
    }, 150);
  },

  async handleSubmit() {
    const urlParams = new URLSearchParams(window.location.hash.split("?")[1]);
    const token = urlParams.get("token");
    const newPassword = document.querySelector("#new-password").value;
    const confirmPassword = document.querySelector("#confirm-password").value;

    // Use global validation system for final validation
    const passwordValidation = PasswordValidation.validatePassword(newPassword);
    const matchValidation = PasswordValidation.validatePasswordMatch(newPassword, confirmPassword);

    if (!passwordValidation.isValid) {
      this.showError(`Password tidak memenuhi persyaratan keamanan: ${passwordValidation.missingRequirements.join(', ')}.`);
      return;
    }

    if (!matchValidation.isMatch) {
      this.showError("Password dan konfirmasi password tidak cocok. Silakan periksa kembali.");
      return;
    }

    this.setLoading(true);
    this.hideMessages();

    try {
      const response = await API.postResetPassword({
        token,
        new_password: newPassword,
      });

      if (response.error) {
        this.showError(response.error);
      } else {
        this.showSuccess("Password berhasil direset! Akun Anda sekarang aman dengan password baru. Anda akan diarahkan ke halaman login...");

        // Add celebration effects
        this.celebrateSuccess();

        // Redirect after 4 seconds
        setTimeout(() => {
          window.location.hash = "#/login";
        }, 4000);
      }
    } catch (error) {
      console.error("Reset password error:", error);

      // Handle different types of errors
      if (error.message?.includes('token')) {
        this.showError("Token reset password sudah kadaluarsa atau tidak valid. Silakan minta link reset password baru.");
      } else if (error.message?.includes('network')) {
        this.showError("Koneksi bermasalah. Periksa internet Anda dan coba lagi.");
      } else {
        this.showError("Terjadi kesalahan tidak terduga. Silakan coba lagi dalam beberapa saat.");
      }
    } finally {
      this.setLoading(false);
    }
  },

  celebrateSuccess() {
    // Create celebration animation
    const submitBtn = document.querySelector("#submit-btn");
    const card = document.querySelector('.bg-white\\/90');

    // Button celebration
    submitBtn.classList.add('animate-bounce');

    // Card glow effect
    card.classList.add('animate-pulse-glow');

    // Create floating success particles
    this.createSuccessParticles();

    setTimeout(() => {
      submitBtn.classList.remove('animate-bounce');
      card.classList.remove('animate-pulse-glow');
    }, 3000);
  },

  createSuccessParticles() {
    const card = document.querySelector('.bg-white\\/90');
    const colors = ['#10B981', '#059669', '#34D399', '#6EE7B7'];

    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute w-2 h-2 rounded-full animate-bounce pointer-events-none';
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 2 + 's';
      particle.style.animationDuration = (Math.random() * 2 + 2) + 's';

      card.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, 4000);
    }
  },

  setLoading(isLoading) {
    const submitBtn = document.querySelector("#submit-btn");
    const btnText = document.querySelector("#btn-text");
    const btnLoading = document.querySelector("#btn-loading");
    const form = document.querySelector("#reset-password-form");

    if (isLoading) {
      submitBtn.disabled = true;
      submitBtn.classList.add("cursor-not-allowed", "opacity-75");
      submitBtn.classList.remove("hover:scale-[1.02]", "active:scale-[0.98]");
      btnText.classList.add("hidden");
      btnLoading.classList.remove("hidden");

      // Disable form inputs
      form.querySelectorAll('input').forEach(input => {
        input.disabled = true;
      });
    } else {
      submitBtn.classList.remove("cursor-not-allowed", "opacity-75");
      btnText.classList.remove("hidden");
      btnLoading.classList.add("hidden");

      // Re-enable form inputs
      form.querySelectorAll('input').forEach(input => {
        input.disabled = false;
      });

      // The submit button state will be updated by the global validation system
    }
  },

  hideMessages() {
    const errorDiv = document.querySelector("#error-message");
    const successDiv = document.querySelector("#success-message");

    errorDiv.classList.add("hidden");
    successDiv.classList.add("hidden");
  },

  showError(message) {
    const errorDiv = document.querySelector("#error-message");
    const successDiv = document.querySelector("#success-message");
    const errorText = document.querySelector("#error-text");

    errorText.textContent = message;
    errorDiv.classList.remove("hidden");
    errorDiv.classList.add("animate-shake");
    successDiv.classList.add("hidden");

    // Add vibration effect if supported
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }

    // Remove shake animation after it completes
    setTimeout(() => {
      errorDiv.classList.remove("animate-shake");
    }, 500);

    // Auto-hide after 8 seconds
    setTimeout(() => {
      errorDiv.classList.add("hidden");
    }, 8000);
  },

  showSuccess(message) {
    const errorDiv = document.querySelector("#error-message");
    const successDiv = document.querySelector("#success-message");
    const successText = document.querySelector("#success-text");

    successText.textContent = message;
    successDiv.classList.remove("hidden");
    successDiv.classList.add("animate-fade-in");
    errorDiv.classList.add("hidden");

    // Add gentle vibration if supported
    if (navigator.vibrate) {
      navigator.vibrate([200]);
    }
  }
};

export default ResetPasswordPage;