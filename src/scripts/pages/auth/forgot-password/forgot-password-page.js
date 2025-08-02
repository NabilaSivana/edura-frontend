import CONFIG from "../../../config.js";

const ForgotPasswordPage = {
  render() {
    return `
      <section class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-cyan-100 dark:from-gray-900 dark:to-gray-800 px-4 py-6 transition-colors duration-300">
        <div class="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg dark:shadow-gray-900/30 w-full max-w-md transition-colors duration-300">
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
              <svg class="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h2 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">Lupa Password</h2>
            <p class="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">Masukkan email Anda untuk menerima link reset password</p>
          </div>

          <!-- Theme Toggle Button -->
          <div class="absolute top-4 right-4 sm:top-6 sm:right-6">
            <button
              id="theme-toggle"
              class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
              aria-label="Toggle theme"
            >
              <svg id="sun-icon" class="w-5 h-5 hidden dark:block" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
              </svg>
              <svg id="moon-icon" class="w-5 h-5 block dark:hidden" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
              </svg>
            </button>
          </div>

          <form id="forgot-password-form" class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                Email Address
              </label>
              <div class="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  class="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all duration-200"
                  placeholder="Masukkan email Anda"
                />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
            </div>

            <button
              type="submit"
              id="submit-btn"
              class="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span id="btn-text">Kirim Email Reset</span>
              <div id="btn-loading" class="hidden">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mengirim...
              </div>
            </button>

            <!-- Messages -->
            <div id="error-message" class="hidden bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm transition-colors duration-300">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
                <span id="error-text" class="break-words"></span>
              </div>
            </div>

            <div id="success-message" class="hidden bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg text-sm transition-colors duration-300">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span id="success-text" class="break-words"></span>
              </div>
            </div>

            <!-- Teacher Account Notice -->
            <div id="teacher-notice" class="hidden bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-lg text-sm transition-colors duration-300">
              <div class="flex items-start">
                <svg class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                </svg>
                <div>
                  <p class="font-medium">Akun Teacher</p>
                  <p class="mt-1 text-xs">Jika Anda adalah teacher yang belum setup password, silakan gunakan link setup password dari email approval Anda.</p>
                </div>
              </div>
            </div>
          </form>

          <div class="mt-6 text-center space-y-2">
            <p class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
              Ingat password Anda? 
              <a href="#/login" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors duration-200">
                Kembali ke Login
              </a>
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
              Belum punya akun? 
              <a href="#/register" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors duration-200">
                Daftar di sini
              </a>
            </p>
          </div>

          <!-- Resend Link Section -->
          <div id="resend-section" class="hidden mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors duration-300">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 transition-colors duration-300">
              Tidak menerima email? Periksa folder spam atau klik tombol di bawah untuk mengirim ulang.
            </p>
            <button
              type="button"
              id="resend-btn"
              class="w-full bg-gray-600 hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
            >
              <span id="resend-text">Kirim Ulang Email</span>
              <div id="resend-loading" class="hidden">
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mengirim...
              </div>
            </button>
          </div>
        </div>
      </section>
    `;
  },

  async afterRender() {
    this.initializeTheme();
    this.initializeEventListeners();
  },

  initializeTheme() {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    });

    // Theme toggle button functionality
    const themeToggle = document.querySelector("#theme-toggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        this.toggleTheme();
      });
    }
  },

  toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');

    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  },

  initializeEventListeners() {
    const form = document.querySelector("#forgot-password-form");
    const resendBtn = document.querySelector("#resend-btn");

    if (form) {
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        await this.handleSubmit();
      });
    }

    if (resendBtn) {
      resendBtn.addEventListener("click", async () => {
        await this.handleResend();
      });
    }
  },

  async handleSubmit() {
    const form = document.querySelector("#forgot-password-form");
    const email = form.email.value.trim();

    if (!email) {
      this.showError("Silakan masukkan email Anda");
      return;
    }

    if (!this.isValidEmail(email)) {
      this.showError("Format email tidak valid");
      return;
    }

    this.setLoading(true);

    try {
      const response = await this.forgotPassword(email);

      if (response.error) {
        if (response.code === 'TEACHER_PASSWORD_NOT_SET') {
          this.showTeacherNotice();
        } else {
          this.showError(response.error);
        }
      } else {
        this.showSuccess("Email reset password telah dikirim! Silakan periksa inbox Anda.");
        this.showResendSection(email);
      }
    } catch (error) {
      this.showError("Terjadi kesalahan. Silakan coba lagi.");
      console.error("Forgot password error:", error);
    } finally {
      this.setLoading(false);
    }
  },

  async handleResend() {
    const email = document.querySelector("#email").value.trim();

    this.setResendLoading(true);

    try {
      const response = await this.forgotPassword(email);

      if (response.error) {
        this.showError(response.error);
      } else {
        this.showSuccess("Email reset password telah dikirim ulang!");
      }
    } catch (error) {
      this.showError("Gagal mengirim ulang email");
    } finally {
      this.setResendLoading(false);
    }
  },

  async forgotPassword(email) {
    const response = await fetch(`${CONFIG.BASE_URL}/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      return data; // Return error data
    }

    return data;
  },

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  setLoading(isLoading) {
    const submitBtn = document.querySelector("#submit-btn");
    const btnText = document.querySelector("#btn-text");
    const btnLoading = document.querySelector("#btn-loading");
    const emailInput = document.querySelector("#email");

    if (isLoading) {
      submitBtn.disabled = true;
      emailInput.disabled = true;
      btnText.classList.add("hidden");
      btnLoading.classList.remove("hidden");
    } else {
      submitBtn.disabled = false;
      emailInput.disabled = false;
      btnText.classList.remove("hidden");
      btnLoading.classList.add("hidden");
    }
  },

  setResendLoading(isLoading) {
    const resendBtn = document.querySelector("#resend-btn");
    const resendText = document.querySelector("#resend-text");
    const resendLoading = document.querySelector("#resend-loading");

    if (isLoading) {
      resendBtn.disabled = true;
      resendText.classList.add("hidden");
      resendLoading.classList.remove("hidden");
    } else {
      resendBtn.disabled = false;
      resendText.classList.remove("hidden");
      resendLoading.classList.add("hidden");
    }
  },

  showError(message) {
    const errorDiv = document.querySelector("#error-message");
    const successDiv = document.querySelector("#success-message");
    const teacherNotice = document.querySelector("#teacher-notice");
    const errorText = document.querySelector("#error-text");

    if (errorText) errorText.textContent = message;
    if (errorDiv) errorDiv.classList.remove("hidden");
    if (successDiv) successDiv.classList.add("hidden");
    if (teacherNotice) teacherNotice.classList.add("hidden");
  },

  showSuccess(message) {
    const errorDiv = document.querySelector("#error-message");
    const successDiv = document.querySelector("#success-message");
    const teacherNotice = document.querySelector("#teacher-notice");
    const successText = document.querySelector("#success-text");

    if (successText) successText.textContent = message;
    if (successDiv) successDiv.classList.remove("hidden");
    if (errorDiv) errorDiv.classList.add("hidden");
    if (teacherNotice) teacherNotice.classList.add("hidden");
  },

  showTeacherNotice() {
    const errorDiv = document.querySelector("#error-message");
    const successDiv = document.querySelector("#success-message");
    const teacherNotice = document.querySelector("#teacher-notice");

    if (teacherNotice) teacherNotice.classList.remove("hidden");
    if (errorDiv) errorDiv.classList.add("hidden");
    if (successDiv) successDiv.classList.add("hidden");
  },

  showResendSection(email) {
    const resendSection = document.querySelector("#resend-section");
    if (resendSection) resendSection.classList.remove("hidden");

    // Store email for resend functionality
    const emailInput = document.querySelector("#email");
    if (emailInput) emailInput.value = email;
  }
};

export default ForgotPasswordPage;