// otp-page.js
import OtpPresenter from "./otp-presenter.js";

const OtpPage = {
  async render() {
    return `
      <section class="w-screen h-screen flex flex-col justify-center items-center bg-white dark:bg-gray-900 font-sans">
        <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 w-[90%] max-w-md animate-fade-in-left">
          <h2 class="text-2xl md:text-3xl font-bold text-center text-[#2C2F8C] dark:text-[#86A6DF] mb-4">Verifikasi OTP</h2>
          <p class="text-center text-sm text-gray-600 dark:text-gray-300 mb-6">Masukkan 6 digit kode OTP yang dikirim ke email Anda.</p>

          <form id="otp-form" class="flex flex-col items-center space-y-6">
            <div id="otp-inputs" class="flex justify-center gap-3">
              ${[...Array(6)].map(() => `<input type="text" maxlength="1" class="otp-box" />`).join("")}
            </div>
            <button type="submit" class="w-full bg-[#2C2F8C] hover:bg-[#1e1f6c] dark:bg-[#86A6DF] dark:hover:bg-[#6b8bc4] text-white font-semibold py-3 rounded-md transition">
              Verifikasi
            </button>
          </form>

          <p id="resend-container" class="text-sm text-gray-600 dark:text-gray-300 mt-4 text-center">
            Belum menerima kode? <button id="resend-btn" class="text-blue-600 dark:text-blue-400 font-semibold hover:underline" disabled>Kirim Ulang (60s)</button>
          </p>
          <p id="otp-message" class="text-sm text-center mt-4"></p>
        </div>

        <style>
          .otp-box {
            width: 3rem;
            height: 3.5rem;
            font-size: 1.5rem;
            text-align: center;
            border: 2px solid #2C2F8C;
            border-radius: 0.5rem;
            outline: none;
            transition: all 0.2s ease-in-out;
            background-color: white;
            color: #1f2937;
          }
          
          .dark .otp-box {
            border-color: #86A6DF;
            background-color: #374151;
            color: #f9fafb;
          }
          
          .otp-box:focus {
            box-shadow: 0 0 0 2px rgba(44, 47, 140, 0.5);
            border-color: #2C2F8C;
          }
          
          .dark .otp-box:focus {
            box-shadow: 0 0 0 2px rgba(134, 166, 223, 0.5);
            border-color: #86A6DF;
          }

          .success-animation {
            animation: successPulse 0.6s ease-in-out;
          }

          @keyframes successPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
        </style>
      </section>
    `;
  },

  async afterRender() {
    const form = document.querySelector("#otp-form");
    const inputs = document.querySelectorAll(".otp-box");
    const messageEl = document.querySelector("#otp-message");
    const resendBtn = document.getElementById("resend-btn");
    const submitBtn = form.querySelector('button[type="submit"]');
    const email = sessionStorage.getItem("pendingOtpEmail");

    if (!email) {
      messageEl.textContent = "Email tidak ditemukan. Silakan login kembali.";
      messageEl.classList.add("text-red-500");
      return;
    }

    // Real-time countdown management
    const COUNTDOWN_KEY = `otp_countdown_${email}`;
    const COUNTDOWN_DURATION = 60; // seconds

    function initializeCountdown() {
      const now = Date.now();
      const stored = localStorage.getItem(COUNTDOWN_KEY);

      if (stored) {
        const { endTime } = JSON.parse(stored);
        const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));

        if (remaining > 0) {
          startCountdown(remaining);
          return;
        }
      }

      // Enable resend button immediately if no active countdown
      resendBtn.disabled = false;
      resendBtn.textContent = "Kirim Ulang";
    }

    function startCountdown(duration = COUNTDOWN_DURATION) {
      const now = Date.now();
      const endTime = now + (duration * 1000);

      // Store countdown end time
      localStorage.setItem(COUNTDOWN_KEY, JSON.stringify({ endTime }));

      resendBtn.disabled = true;

      const updateCountdown = () => {
        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));

        if (remaining > 0) {
          resendBtn.textContent = `Kirim Ulang (${remaining}s)`;
          setTimeout(updateCountdown, 1000);
        } else {
          // Countdown finished
          localStorage.removeItem(COUNTDOWN_KEY);
          resendBtn.disabled = false;
          resendBtn.textContent = "Kirim Ulang";
        }
      };

      updateCountdown();
    }

    // Initialize countdown on page load
    initializeCountdown();

    // Resend OTP handler
    resendBtn.addEventListener("click", async () => {
      const originalText = resendBtn.textContent;
      resendBtn.disabled = true;
      resendBtn.textContent = "Mengirim...";

      try {
        const result = await OtpPresenter.resendOtp(email);

        // Clear any previous messages
        messageEl.textContent = result.message || "Kode OTP telah dikirim ulang.";
        messageEl.className = "text-green-600 dark:text-green-400 text-sm text-center mt-4";

        // Start new countdown
        startCountdown();

      } catch (err) {
        // Show backend error message
        messageEl.textContent = err.message || "Gagal mengirim ulang OTP.";
        messageEl.className = "text-red-500 dark:text-red-400 text-sm text-center mt-4";

        // Re-enable button on error
        resendBtn.disabled = false;
        resendBtn.textContent = originalText;
      }
    });

    // OTP input handlers
    inputs.forEach((input, index) => {
      input.addEventListener("input", () => {
        input.value = input.value.replace(/[^0-9]/g, "");
        if (input.value.length === 1 && index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && input.value === "" && index > 0) {
          inputs[index - 1].focus();
        }
      });

      input.addEventListener("paste", (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData("text").slice(0, 6);
        paste.split("").forEach((char, i) => {
          if (inputs[i] && /^[0-9]$/.test(char)) {
            inputs[i].value = char;
          }
        });
        if (paste.length === 6) {
          inputs[5].focus();
        }
      });
    });

    // Form submission handler
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const otp = Array.from(inputs).map((input) => input.value).join("");

      if (otp.length !== 6) {
        messageEl.textContent = "Kode OTP harus 6 digit.";
        messageEl.className = "text-red-500 dark:text-red-400 text-sm text-center mt-4";
        return;
      }

      // Disable form during submission
      submitBtn.disabled = true;
      submitBtn.textContent = "Memverifikasi...";
      inputs.forEach(input => input.disabled = true);

      // Clear any previous messages
      messageEl.textContent = "Memverifikasi...";
      messageEl.className = "text-blue-600 dark:text-blue-400 text-sm text-center mt-4";

      OtpPresenter.handleOtp(
        email,
        otp,
        (successMessage) => {
          // Success callback - only called for 200 OK responses
          messageEl.textContent = successMessage;
          messageEl.className = "text-green-600 dark:text-green-400 text-sm text-center mt-4 success-animation";

          // Update submit button to show success
          submitBtn.textContent = "✓ Berhasil!";
          submitBtn.classList.remove("bg-[#2C2F8C]", "hover:bg-[#1e1f6c]");
          submitBtn.classList.add("bg-green-600", "hover:bg-green-700");

          // Clean up session storage
          sessionStorage.removeItem("pendingOtpEmail");
          localStorage.removeItem(COUNTDOWN_KEY);

          console.log('🎯 OTP verification successful, waiting for navbar update before redirect...');

          // Wait a bit longer to ensure navbar has time to update
          setTimeout(() => {
            console.log('🚀 Redirecting to dashboard...');
            window.location.hash = "#/dashboard";
          }, 2000); // Increased delay to ensure smooth transition

        },
        (errorMessage) => {
          // Error callback - for non-200 responses or other errors
          messageEl.textContent = errorMessage;
          messageEl.className = "text-red-500 dark:text-red-400 text-sm text-center mt-4";

          // Re-enable form on error
          submitBtn.disabled = false;
          submitBtn.textContent = "Verifikasi";
          inputs.forEach(input => {
            input.disabled = false;
            input.value = ""; // Clear inputs on error
          });
          
          // Focus first input for retry
          inputs[0].focus();
        }
      );
    });

    // Focus first input on load
    inputs[0].focus();

    // Listen for login success event to provide immediate feedback
    const handleLoginSuccess = (event) => {
      if (event.detail?.source === 'otp-verification') {
        console.log('🎉 Login success event received from OTP verification');
        
        // Add visual feedback that navbar is updating
        const container = form.closest('.bg-white');
        if (container) {
          container.classList.add('success-animation');
        }
      }
    };

    window.addEventListener('login-success', handleLoginSuccess);

    // Cleanup event listener when page is destroyed
    window.otpPageCleanup = () => {
      window.removeEventListener('login-success', handleLoginSuccess);
    };
  },

  // Cleanup method
  destroy() {
    if (window.otpPageCleanup) {
      window.otpPageCleanup();
      delete window.otpPageCleanup;
    }
  }
};

export default OtpPage;