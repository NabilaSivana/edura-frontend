// File: pages/auth/resend-teacher-setup/page.js
import API from "../../../data/api.js";

const ResendTeacherSetupPage = {
  render() {
    return `
      <section class="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-100">
        <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">Kirim Ulang Link Setup</h2>
            <p class="text-gray-600 text-sm">
              Khusus untuk teacher yang sudah disetujui tapi belum setup password
            </p>
          </div>

          <form id="resend-teacher-setup-form" class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                Email Teacher
              </label>
              <div class="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                  placeholder="Masukkan email teacher"
                />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
              <div class="mt-1 text-xs text-gray-500">
                Email harus sesuai dengan akun teacher yang sudah disetujui
              </div>
            </div>

            <button
              type="submit"
              id="submit-btn"
              class="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span id="btn-text">Kirim Link Setup Password</span>
              <div id="btn-loading" class="hidden">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mengirim...
              </div>
            </button>

            <!-- Messages -->
            <div id="error-message" class="hidden bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
                <span id="error-text"></span>
              </div>
            </div>

            <div id="success-message" class="hidden bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span id="success-text"></span>
              </div>
            </div>

            <!-- Info Box -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex items-start">
                <svg class="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                </svg>
                <div class="text-sm">
                  <p class="font-medium text-blue-800 mb-1">Informasi Penting:</p>
                  <ul class="text-blue-700 space-y-1 text-xs">
                    <li>• Fitur ini hanya untuk teacher yang sudah disetujui</li>
                    <li>• Link setup akan dikirim ke email yang terdaftar</li>
                    <li>• Link berlaku selama 24 jam</li>
                    <li>• Jika sudah setup password, gunakan fitur "Lupa Password"</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>

          <div class="mt-6 text-center space-y-2">
            <p class="text-sm text-gray-600">
              Sudah setup password? 
              <a href="#/login" class="text-orange-600 hover:text-orange-800 font-medium">
                Login di sini
              </a>
            </p>
            <p class="text-sm text-gray-600">
              Lupa password yang sudah diset? 
              <a href="#/forgot-password" class="text-orange-600 hover:text-orange-800 font-medium">
                Reset password
              </a>
            </p>
          </div>
        </div>
      </section>
    `;
  },

  async afterRender() {
    this.initializeEventListeners();
  },

  initializeEventListeners() {
    const form = document.querySelector("#resend-teacher-setup-form");

    if (form) {
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        await this.handleSubmit();
      });
    }
  },

  async handleSubmit() {
    const form = document.querySelector("#resend-teacher-setup-form");
    const emailInput = document.querySelector("#email");
    
    if (!form || !emailInput) {
      this.showError("Form tidak ditemukan. Silakan muat ulang halaman.");
      return;
    }
    
    const email = emailInput.value.trim();

    if (!email) {
      this.showError("Silakan masukkan email teacher");
      return;
    }

    if (!this.isValidEmail(email)) {
      this.showError("Format email tidak valid");
      return;
    }

    this.setLoading(true);

    try {
      //console.log('📤 Resending teacher setup link for:', email);
      
      const response = await API.postResendTeacherSetupLink({ email });
      
      if (response.error) {
        this.showError(response.error);
      } else {
        this.showSuccess("Link setup password telah dikirim ke email teacher!");
        
        // Clear form
        emailInput.value = '';
      }
    } catch (error) {
      console.error("❌ Resend teacher setup error:", error);
      this.showError("Terjadi kesalahan: " + (error.message || "Silakan coba lagi."));
    } finally {
      this.setLoading(false);
    }
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

    if (!submitBtn || !btnText || !btnLoading || !emailInput) return;

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

  showError(message) {
    const errorDiv = document.querySelector("#error-message");
    const successDiv = document.querySelector("#success-message");
    const errorText = document.querySelector("#error-text");

    if (errorText) {
      errorText.textContent = message;
    }
    
    if (errorDiv) {
      errorDiv.classList.remove("hidden");
    }
    
    if (successDiv) {
      successDiv.classList.add("hidden");
    }
  },

  showSuccess(message) {
    const errorDiv = document.querySelector("#error-message");
    const successDiv = document.querySelector("#success-message");
    const successText = document.querySelector("#success-text");

    if (successText) {
      successText.textContent = message;
    }
    
    if (successDiv) {
      successDiv.classList.remove("hidden");
    }
    
    if (errorDiv) {
      errorDiv.classList.add("hidden");
    }
  }
};

export default ResendTeacherSetupPage;