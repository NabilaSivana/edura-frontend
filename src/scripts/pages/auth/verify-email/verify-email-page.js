import API from "../../../data/api.js";

const VerifyEmailPage = {
  async render() {
    return `
      <section class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-colors duration-300">
        <!-- Dark Mode Toggle -->
        <button
          id="theme-toggle"
          class="fixed top-4 right-4 z-50 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
          aria-label="Toggle dark mode"
        >
          <svg id="theme-toggle-dark-icon" class="hidden w-5 h-5 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
          </svg>
          <svg id="theme-toggle-light-icon" class="hidden w-5 h-5 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>
          </svg>
        </button>

        <div class="w-full max-w-md">
          <!-- Main Card -->
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 transition-all duration-300 hover:shadow-3xl">
            
            <!-- Header Section -->
            <div class="text-center mb-8">
              <div id="status-icon" class="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg transition-all duration-500 transform hover:scale-105">
                <svg class="w-10 h-10 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              </div>
              
              <h1 class="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3">
                Verifikasi Email
              </h1>
              
              <p id="status-message" class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Memverifikasi email Anda, mohon tunggu sebentar...
              </p>
            </div>

            <!-- Loading State -->
            <div id="loading-state" class="text-center space-y-4">
              <div class="inline-flex items-center px-6 py-3 font-medium text-sm shadow-lg rounded-xl text-white bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 transition-all duration-300 hover:shadow-xl">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memverifikasi email...
              </div>
              
              <div class="flex justify-center space-x-1 mt-4">
                <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style="animation-delay: 0.1s"></div>
                <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
              </div>
            </div>

            <!-- Success State -->
            <div id="success-state" class="hidden space-y-6">
              <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-xl p-6 transition-all duration-300">
                <div class="flex items-start space-x-3">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                  <div class="flex-1">
                    <h3 class="font-semibold text-green-800 dark:text-green-300">Email Berhasil Diverifikasi!</h3>
                    <p class="text-sm text-green-700 dark:text-green-400 mt-1">
                      Akun Anda telah aktif dan siap digunakan.
                    </p>
                  </div>
                </div>
              </div>
              
              <div class="text-center space-y-4">
                <div class="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mengalihkan dalam <span id="countdown" class="font-medium text-green-600 dark:text-green-400">3</span> detik...
                </div>
                
                <button
                  id="login-now-btn"
                  class="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800"
                >
                  <span class="flex items-center justify-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                    </svg>
                    Login Sekarang
                  </span>
                </button>
              </div>
            </div>

            <!-- Error State -->
            <div id="error-state" class="hidden space-y-6">
              <div class="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-700 rounded-xl p-6 transition-all duration-300">
                <div class="flex items-start space-x-3">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                  <div class="flex-1">
                    <h3 class="font-semibold text-red-800 dark:text-red-300">Verifikasi Gagal</h3>
                    <p id="error-detail" class="text-sm text-red-700 dark:text-red-400 mt-1">
                      Link verifikasi tidak valid atau sudah kadaluarsa.
                    </p>
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <button
                  id="resend-verification-btn"
                  class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
                >
                  <span class="flex items-center justify-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    Kirim Ulang Email Verifikasi
                  </span>
                </button>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href="#/login"
                    class="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-3 px-4 rounded-xl transition-all duration-300 text-center hover:shadow-md"
                  >
                    Kembali ke Login
                  </a>
                  <a
                    href="#/register"
                    class="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-3 px-4 rounded-xl transition-all duration-300 text-center hover:shadow-md"
                  >
                    Daftar Ulang
                  </a>
                </div>
              </div>
            </div>

            <!-- Resend Form -->
            <div id="resend-form" class="hidden">
              <div class="border-t border-gray-200 dark:border-gray-600 pt-6 mt-6">
                <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">
                  Kirim Ulang Verifikasi
                </h3>
                
                <form id="resend-verification-form" class="space-y-4">
                  <div>
                    <label for="resend-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Alamat Email
                    </label>
                    <div class="relative">
                      <input
                        type="email"
                        id="resend-email"
                        name="email"
                        required
                        class="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
                        placeholder="Masukkan alamat email Anda"
                      />
                      <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                      </svg>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    id="resend-submit-btn"
                    class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <span id="resend-btn-text" class="flex items-center justify-center">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                      </svg>
                      Kirim Email Verifikasi
                    </span>
                    <div id="resend-btn-loading" class="hidden flex items-center justify-center">
                      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Mengirim...
                    </div>
                  </button>
                </form>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="text-center mt-6">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Butuh bantuan? 
              <a href="mailto:cs@edura.web.id" class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200">
                Hubungi Support
              </a>
            </p>
          </div>
        </div>
      </section>
    `;
  },

  async afterRender() {
    this.initializeTheme();
    await this.verifyEmail();
    this.initializeEventListeners();
  },

  initializeTheme() {
    const themeToggle = document.querySelector("#theme-toggle");
    const themeToggleDarkIcon = document.querySelector("#theme-toggle-dark-icon");
    const themeToggleLightIcon = document.querySelector("#theme-toggle-light-icon");

    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
      themeToggleLightIcon.classList.remove('hidden');
    } else {
      document.documentElement.classList.remove('dark');
      themeToggleDarkIcon.classList.remove('hidden');
    }

    themeToggle.addEventListener('click', () => {
      // Toggle dark mode
      document.documentElement.classList.toggle('dark');

      // Update icons
      themeToggleDarkIcon.classList.toggle('hidden');
      themeToggleLightIcon.classList.toggle('hidden');

      // Save preference
      if (document.documentElement.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
      }
    });
  },

  initializeEventListeners() {
    const loginNowBtn = document.querySelector("#login-now-btn");
    const resendVerificationBtn = document.querySelector("#resend-verification-btn");
    const resendForm = document.querySelector("#resend-verification-form");

    if (loginNowBtn) {
      loginNowBtn.addEventListener("click", () => {
        window.location.hash = "#/login";
      });
    }

    if (resendVerificationBtn) {
      resendVerificationBtn.addEventListener("click", () => {
        this.showResendForm();
      });
    }

    if (resendForm) {
      resendForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        await this.handleResendVerification();
      });
    }

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
        const successState = document.querySelector("#success-state");
        const loginBtn = document.querySelector("#login-now-btn");

        if (!successState.classList.contains('hidden') && loginBtn) {
          loginBtn.click();
        }
      }
    });
  },

  async verifyEmail() {
    const urlParams = new URLSearchParams(window.location.hash.split("?")[1]);
    const token = urlParams.get("token");

    if (!token) {
      this.showError("Link verifikasi tidak valid - token tidak ditemukan");
      return;
    }

    try {
      const response = await API.getVerifyEmail({ token });

      if (response.error) {
        this.showError(response.error);
      } else {
        this.showSuccess();
        this.startCountdown();
      }
    } catch (error) {
      this.showError("Terjadi kesalahan saat memverifikasi email");
      console.error("Verification error:", error);
    }
  },

  showSuccess() {
    const statusIcon = document.querySelector("#status-icon");
    const statusMessage = document.querySelector("#status-message");
    const loadingState = document.querySelector("#loading-state");
    const successState = document.querySelector("#success-state");
    const errorState = document.querySelector("#error-state");

    // Update icon with smooth animation
    statusIcon.className = "w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-400 dark:to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg transition-all duration-500 transform hover:scale-105";
    statusIcon.innerHTML = `
      <svg class="w-10 h-10 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    `;

    // Update message
    statusMessage.textContent = "Email berhasil diverifikasi!";
    statusMessage.className = "text-green-600 dark:text-green-400 text-sm font-medium";

    // Show success state with animation
    loadingState.classList.add("hidden");
    successState.classList.remove("hidden");
    errorState.classList.add("hidden");

    // Add success animation
    successState.style.animation = "fadeInUp 0.5s ease-out";
  },

  showError(message) {
    const statusIcon = document.querySelector("#status-icon");
    const statusMessage = document.querySelector("#status-message");
    const loadingState = document.querySelector("#loading-state");
    const successState = document.querySelector("#success-state");
    const errorState = document.querySelector("#error-state");
    const errorDetail = document.querySelector("#error-detail");

    // Update icon with error state
    statusIcon.className = "w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 dark:from-red-400 dark:to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg transition-all duration-500 transform hover:scale-105";
    statusIcon.innerHTML = `
      <svg class="w-10 h-10 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
      </svg>
    `;

    // Update message
    statusMessage.textContent = "Verifikasi email gagal";
    statusMessage.className = "text-red-600 dark:text-red-400 text-sm font-medium";

    // Update error detail
    errorDetail.textContent = message;

    // Show error state with animation
    loadingState.classList.add("hidden");
    successState.classList.add("hidden");
    errorState.classList.remove("hidden");

    // Add error animation
    errorState.style.animation = "fadeInUp 0.5s ease-out";
  },

  startCountdown() {
    let timeLeft = 3;
    const countdownElement = document.querySelector("#countdown");

    const countdown = setInterval(() => {
      timeLeft--;
      if (countdownElement) {
        countdownElement.textContent = timeLeft;

        // Add visual feedback for countdown
        if (timeLeft <= 1) {
          countdownElement.classList.add("text-orange-500", "font-bold");
        }
      }

      if (timeLeft <= 0) {
        clearInterval(countdown);
        window.location.hash = "#/login";
      }
    }, 1000);
  },

  showResendForm() {
    const resendForm = document.querySelector("#resend-form");
    resendForm.classList.remove("hidden");
    resendForm.style.animation = "fadeInUp 0.3s ease-out";

    // Focus on email input with slight delay for better UX
    setTimeout(() => {
      const emailInput = document.querySelector("#resend-email");
      emailInput.focus();
    }, 100);
  },

  async handleResendVerification() {
    const form = document.querySelector("#resend-verification-form");
    const email = form.email.value.trim();
    const submitBtn = document.querySelector("#resend-submit-btn");
    const btnText = document.querySelector("#resend-btn-text");
    const btnLoading = document.querySelector("#resend-btn-loading");

    if (!email) {
      this.showNotification("Silakan masukkan email Anda", "error");
      return;
    }

    if (!this.isValidEmail(email)) {
      this.showNotification("Format email tidak valid", "error");
      return;
    }

    // Set loading state
    submitBtn.disabled = true;
    btnText.classList.add("hidden");
    btnLoading.classList.remove("hidden");

    try {
      const response = await API.postSendMagicLink({ email });

      if (response.error) {
        this.showNotification(response.error, "error");
      } else {
        this.showNotification("Email verifikasi telah dikirim ulang! Silakan periksa inbox Anda.", "success");
        // Hide resend form after successful send
        setTimeout(() => {
          document.querySelector("#resend-form").classList.add("hidden");
        }, 2000);
      }
    } catch (error) {
      this.showNotification("Terjadi kesalahan saat mengirim email verifikasi", "error");
      console.error("Resend verification error:", error);
    } finally {
      // Reset loading state
      submitBtn.disabled = false;
      btnText.classList.remove("hidden");
      btnLoading.classList.add("hidden");
    }
  },

  showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';

    notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 max-w-md text-center`;
    notification.textContent = message;
    notification.style.transform = 'translate(-50%, -100px)';
    notification.style.opacity = '0';

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translate(-50%, 0)';
      notification.style.opacity = '1';
    }, 100);

    // Animate out and remove
    setTimeout(() => {
      notification.style.transform = 'translate(-50%, -100px)';
      notification.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  },

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
};

// Add custom CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  .animate-pulse-slow {
    animation: pulse 2s infinite;
  }
  
  /* Custom scrollbar for dark mode */
  .dark ::-webkit-scrollbar {
    width: 8px;
  }
  
  .dark ::-webkit-scrollbar-track {
    background: #374151;
  }
  
  .dark ::-webkit-scrollbar-thumb {
    background: #6B7280;
    border-radius: 4px;
  }
  
  .dark ::-webkit-scrollbar-thumb:hover {
    background: #9CA3AF;
  }
  
  /* Smooth transitions for all elements */
  * {
    transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
    transition-duration: 200ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* Focus styles for better accessibility */
  .focus-visible:focus {
    outline: 2px solid #3B82F6;
    outline-offset: 2px;
  }
  
  /* Custom gradient animations */
  @keyframes gradient-x {
    0%, 100% {
      transform: translateX(0%);
    }
    50% {
      transform: translateX(100%);
    }
  }
  
  .animate-gradient-x {
    animation: gradient-x 3s ease infinite;
  }
  
  /* Hover effects for interactive elements */
  .hover-lift:hover {
    transform: translateY(-2px);
  }
  
  /* Loading shimmer effect */
  @keyframes shimmer {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: calc(200px + 100%) 0;
    }
  }
  
  .shimmer {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200px 100%;
    animation: shimmer 1.5s infinite;
  }
  
  .dark .shimmer {
    background: linear-gradient(90deg, #374151 25%, #4B5563 50%, #374151 75%);
    background-size: 200px 100%;
  }
  
  /* Enhanced mobile responsiveness */
  @media (max-width: 640px) {
    .mobile-padding {
      padding-left: 1rem;
      padding-right: 1rem;
    }
    
    .mobile-text-sm {
      font-size: 0.875rem;
    }
  }
  
  /* Accessibility improvements */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
  
  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .bg-gradient-to-br {
      background: #000 !important;
      color: #fff !important;
    }
    
    .dark .bg-gradient-to-br {
      background: #fff !important;
      color: #000 !important;
    }
  }
`;

document.head.appendChild(style);

export default VerifyEmailPage;