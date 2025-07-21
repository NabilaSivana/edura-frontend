import LoginPresenter from "../login/login-presenter.js";

const LoginPage = {
  async render() {
    return `
<style>
  .floating-input {
    position: relative;
  }

  .floating-input input {
    width: 100%;
    padding: 1rem 0.75rem 0.5rem;
    border: 1.5px solid #e5e7eb;
    border-radius: 0.75rem;
    background: white;
    color: #1f2937;
    font-size: 1rem;
    outline: none;
    transition: all 0.2s ease;
  }

  .floating-input input:focus {
    border-color: #2C2F8C;
    box-shadow: 0 0 0 3px rgba(44, 47, 140, 0.1);
  }

  .floating-input input.error {
    border-color: #ef4444;
  }

  .floating-input input.error:focus {
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }

  .floating-input label {
    position: absolute;
    left: 0.75rem;
    top: 1rem;
    background: white;
    padding: 0 0.25rem;
    color: #6b7280;
    font-size: 1rem;
    pointer-events: none;
    transition: all 0.2s ease-in-out;
  }

  .floating-input input:focus + label,
  .floating-input input:not(:placeholder-shown) + label {
    top: -0.5rem;
    left: 0.65rem;
    font-size: 0.75rem;
    color: #2C2F8C;
  }

  .floating-input input.error + label {
    color: #ef4444;
  }

  .error-message {
    background-color: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    animation: slideDown 0.3s ease-out;
  }

  .success-message {
    background-color: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #16a34a;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    animation: slideDown 0.3s ease-out;
  }

  .warning-message {
    background-color: #fefce8;
    border: 1px solid #fef08a;
    color: #ca8a04;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    animation: slideDown 0.3s ease-out;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(50px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-slide-up {
    animation: slideUp 0.6s ease-out;
  }

  .login-button {
    background: #2C2F8C;
    color: white;
    width: 100%;
    padding: 0.5rem;
    border-radius: 0.25rem;
    font-weight: 500;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
  }

  .login-button:hover:not(:disabled) {
    background: #1e1f6c;
  }

  .login-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .password-toggle {
    position: absolute;
    right: 0.75rem;
    top: 0.75rem;
    cursor: pointer;
    color: #6b7280;
    transition: color 0.2s ease;
    padding: 0.25rem;
  }

  .password-toggle:hover {
    color: #2C2F8C;
  }

  .divider {
    display: flex;
    align-items: center;
    margin: 1.5rem 0;
    gap: 1rem;
  }

  .divider::before,
  .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: #e5e7eb;
  }

  /* Enhanced Desktop Animations - Wave Meeting Effect */
  @keyframes waveFromLeft {
    0% {
      opacity: 0;
      transform: translateX(-100%) scale(0.8) rotateY(-15deg);
      filter: blur(2px);
    }
    50% {
      opacity: 0.8;
      transform: translateX(-20%) scale(0.95) rotateY(-5deg);
      filter: blur(1px);
    }
    100% {
      opacity: 1;
      transform: translateX(0) scale(1) rotateY(0);
      filter: blur(0);
    }
  }

  @keyframes waveFromRight {
    0% {
      opacity: 0;
      transform: translateX(100%) scale(0.8) rotateY(15deg);
      filter: blur(2px);
    }
    50% {
      opacity: 0.8;
      transform: translateX(20%) scale(0.95) rotateY(5deg);
      filter: blur(1px);
    }
    100% {
      opacity: 1;
      transform: translateX(0) scale(1) rotateY(0);
      filter: blur(0);
    }
  }

  @keyframes formElementsStagger {
    0% {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes welcomeContentFloat {
    0% {
      opacity: 0;
      transform: translateY(30px) scale(0.9);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes backgroundPulse {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  /* Mobile fade animation */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .animate-fade-in {
    animation: fadeIn 0.8s ease-out;
  }

  /* Desktop layout specific animations */
  .animate-wave-left {
    animation: waveFromLeft 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .animate-wave-right {
    animation: waveFromRight 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    background: linear-gradient(-45deg, #86A6DF, #6b8bc4, #86A6DF, #7c94d1);
    background-size: 400% 400%;
    animation: waveFromRight 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
               backgroundPulse 8s ease-in-out infinite;
  }

  /* Staggered form animations */
  .form-element-1 {
    animation: formElementsStagger 0.6s ease-out 0.3s both;
  }

  .form-element-2 {
    animation: formElementsStagger 0.6s ease-out 0.4s both;
  }

  .form-element-3 {
    animation: formElementsStagger 0.6s ease-out 0.5s both;
  }

  .form-element-4 {
    animation: formElementsStagger 0.6s ease-out 0.6s both;
  }

  .form-element-5 {
    animation: formElementsStagger 0.6s ease-out 0.7s both;
  }

  .form-element-6 {
    animation: formElementsStagger 0.6s ease-out 0.8s both;
  }

  /* Welcome content animations */
  .welcome-element-1 {
    animation: welcomeContentFloat 0.8s ease-out 0.4s both;
  }

  .welcome-element-2 {
    animation: welcomeContentFloat 0.8s ease-out 0.6s both;
  }

  .welcome-element-3 {
    animation: welcomeContentFloat 0.8s ease-out 0.8s both;
  }

  .welcome-element-4 {
    animation: welcomeContentFloat 0.8s ease-out 1.0s both;
  }

  .welcome-element-5 {
    animation: welcomeContentFloat 0.8s ease-out 1.2s both;
  }

  /* Enhanced hover effects */
  .enhanced-hover {
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .enhanced-hover:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 10px 25px rgba(44, 47, 140, 0.15);
  }

  /* Floating effect for mascot */
  @keyframes float {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(-10px) rotate(1deg);
    }
  }

  .floating-mascot {
    animation: float 3s ease-in-out infinite;
  }

  /* Ripple effect on button hover */
  .ripple-button {
    position: relative;
    overflow: hidden;
  }

  .ripple-button::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    transition: width 0.6s, height 0.6s, top 0.6s, left 0.6s;
    transform: translate(-50%, -50%);
  }

  .ripple-button:hover::before {
    width: 300px;
    height: 300px;
  }
</style>

<!-- Mobile Layout -->
<section class="block md:hidden w-screen min-h-screen bg-[#86A6DF] text-white font-sans overflow-y-auto">
  <div class="flex flex-col items-start px-6 pt-6">
    <a href="#/" class="text-white hover:underline mb-4 flex items-center gap-1">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M15 19l-7-7 7-7" />
      </svg>
      Kembali
    </a>
  </div>
  <div class="flex flex-col items-center justify-center px-6 pb-6 text-center">
    <h1 class="text-3xl font-extrabold mb-4">Hallo, Friend!</h1>
    <img src="maskot4.png" alt="Robot Maskot" class="w-40 mb-4" />
    <p class="text-sm mb-4 max-w-sm">Jika belum punya akun daftar untuk masuk ke dashboard</p>
    <a href="#/register" class="border border-white text-white px-6 py-2 rounded font-semibold hover:bg-white hover:text-[#86A6DF] transition">
      Daftar
    </a>
  </div>

  <div class="bg-white text-[#2C2F8C] rounded-t-[60px] px-8 py-10 flex flex-col items-center max-w-md mx-auto animate-slide-up">
    <h2 class="text-2xl font-extrabold mb-1">LOGIN</h2>
    <p class="text-center mb-6">Silahkan Login terlebih dahulu</p>

    <div id="login-message-mobile" class="w-full max-w-sm"></div>

    <form id="login-form-mobile" class="w-full space-y-4">
      <div class="floating-input">
        <input type="email" id="email-mobile" placeholder=" " required />
        <label for="email-mobile">Email</label>
      </div>
      <div class="floating-input">
        <input type="password" id="password-mobile" placeholder=" " required />
        <label for="password-mobile">Password</label>
        <i class="fas fa-eye absolute right-3 top-3 cursor-pointer text-gray-500" id="toggle-password-mobile"></i>
      </div>
      <div class="flex justify-end">
        <a href="#/forgot-password" class="text-sm text-[#2C2F8C] hover:underline">Lupa Password?</a>
      </div>
      <button type="submit" class="bg-[#2C2F8C] text-white w-full py-2 rounded hover:bg-[#1e1f6c] transition">
        <span id="login-text-mobile">Login</span>
      </button>
    </form>
  </div>
</section>

<!-- Desktop Layout -->
<section class="hidden md:flex w-screen h-screen font-sans m-0 p-0">
  <!-- Left: Login Form -->
  <div class="w-1/2 bg-white flex flex-col justify-center items-center px-12 animate-wave-left">
    <div class="w-full max-w-md">
      <a href="#/" class="text-[#2C2F8C] hover:text-[#1e1f6c] mb-8 flex items-center gap-1 transition-colors inline-flex form-element-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M15 19l-7-7 7-7" />
        </svg>
        Kembali ke Beranda
      </a>
      
      <div class="text-center mb-8 form-element-2">
        <h2 class="text-4xl font-extrabold text-[#2C2F8C] mb-2">Selamat Datang</h2>
        <p class="text-gray-600">Masuk ke akun Edura LMS Anda</p>
      </div>

      <div id="login-message-desktop" class="w-full form-element-3"></div>

      <form id="login-form-desktop" class="w-full space-y-5">
        <div class="floating-input form-element-3 enhanced-hover">
          <input type="email" id="email-desktop" placeholder=" " required />
          <label for="email-desktop">Email</label>
        </div>
        <div class="floating-input form-element-4 enhanced-hover">
          <input type="password" id="password-desktop" placeholder=" " required />
          <label for="password-desktop">Password</label>
          <span class="password-toggle" id="toggle-password-desktop">
            <i class="fas fa-eye"></i>
          </span>
        </div>
        <div class="flex items-center justify-between form-element-5">
          <label class="flex items-center text-sm text-gray-600">
            <input type="checkbox" class="mr-2 text-[#2C2F8C]" />
            Ingat saya
          </label>
          <a href="#/forgot-password" class="text-sm text-[#2C2F8C] hover:underline transition-colors">Lupa Password?</a>
        </div>
        <button type="submit" class="login-button ripple-button form-element-5 enhanced-hover">
          <span id="login-text-desktop">Masuk</span>
        </button>
      </form>

      <div class="divider form-element-6">
        <span>atau</span>
      </div>

      <p class="text-center text-gray-600 form-element-6">
        Belum punya akun? 
        <a href="#/register" class="text-[#2C2F8C] font-semibold hover:underline transition-colors">Daftar sekarang</a>
      </p>
    </div>
  </div>

  <!-- Right: Image + Welcome -->
  <div class="w-1/2 flex flex-col justify-center items-center px-10 text-white rounded-tl-[100px] rounded-bl-[100px] relative overflow-hidden animate-wave-right">
    <div class="absolute inset-0 bg-black/10"></div>
    <div class="relative z-10 text-center">
      <h3 class="text-4xl font-extrabold mb-6 welcome-element-1">Edura LMS</h3>
      <img src="maskot4.png" alt="Edura Mascot" class="w-72 mb-6 mx-auto drop-shadow-2xl floating-mascot welcome-element-2" />
      <p class="text-lg mb-2 text-white/90 welcome-element-3">Platform Pembelajaran Digital Terbaik</p>
      <p class="mb-8 text-white/80 max-w-md mx-auto welcome-element-4">Bergabunglah dengan ribuan siswa yang telah meningkatkan kemampuan mereka bersama Edura</p>
      <a href="#/register" class="inline-block bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-3 rounded-lg hover:bg-white hover:text-[#2C2F8C] font-semibold transition-all duration-300 shadow-xl ripple-button welcome-element-5 enhanced-hover">
        Gabung Sekarang
      </a>
    </div>
  </div>
</section>
`;
  },

  async afterRender() {
    const setupTogglePassword = (inputId, toggleId) => {
      const input = document.querySelector(inputId);
      const toggle = document.querySelector(toggleId);

      if (!input || !toggle) return;

      toggle.addEventListener("click", () => {
        const isPassword = input.type === "password";
        input.type = isPassword ? "text" : "password";
        toggle.classList.toggle("fa-eye");
        toggle.classList.toggle("fa-eye-slash");
      });
    };

    setupTogglePassword("#password-mobile", "#toggle-password-mobile");
    setupTogglePassword("#password-desktop", "#toggle-password-desktop");

    const footer = document.querySelector("footer");
    if (footer) footer.style.display = "none";

    const showMessage = (messageElId, message, type = 'error') => {
      const messageEl = document.querySelector(messageElId);
      const iconMap = {
        error: '<i class="fas fa-exclamation-circle"></i>',
        success: '<i class="fas fa-check-circle"></i>',
        warning: '<i class="fas fa-info-circle"></i>'
      };

      messageEl.innerHTML = `
        <div class="${type}-message">
          ${iconMap[type]}
          <span>${message}</span>
        </div>
      `;
    };

    const clearMessage = (messageElId) => {
      const messageEl = document.querySelector(messageElId);
      messageEl.innerHTML = '';
    };

    const handleLoginSubmit = (
      formSelector,
      emailSelector,
      passwordSelector,
      messageElId,
      buttonTextId
    ) => {
      const form = document.querySelector(formSelector);
      if (!form) return;

      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const emailInput = document.querySelector(emailSelector);
        const passwordInput = document.querySelector(passwordSelector);
        const email = emailInput.value;
        const password = passwordInput.value;
        const submitButton = form.querySelector('button[type="submit"]');
        const buttonText = document.querySelector(buttonTextId);

        // Clear previous errors
        clearMessage(messageElId);
        emailInput.classList.remove('error');
        passwordInput.classList.remove('error');

        // Disable button and show loading
        submitButton.disabled = true;
        buttonText.textContent = 'Memproses...';

        LoginPresenter.handleLogin(
          email,
          password,
          (successMessage) => {
            // Success handler
            sessionStorage.setItem("pendingOtpEmail", email);
            showMessage(messageElId, successMessage, 'success');

            setTimeout(() => {
              window.location.href = "/#/otp";
            }, 1500);
          },
          (errorMessage) => {
            // Error handler - handle different error cases
            submitButton.disabled = false;
            buttonText.textContent = 'Login';

            if (errorMessage.includes('Email not registered')) {
              emailInput.classList.add('error');
              showMessage(messageElId, 'Email belum terdaftar. Silakan daftar terlebih dahulu.', 'error');
            } else if (errorMessage.includes('Email not verified')) {
              showMessage(messageElId, 'Email belum diverifikasi. Kami telah mengirim link verifikasi baru ke email Anda.', 'warning');
            } else if (errorMessage.includes('Invalid credentials')) {
              passwordInput.classList.add('error');
              showMessage(messageElId, 'Password yang Anda masukkan salah. Silakan coba lagi.', 'error');
            } else {
              showMessage(messageElId, 'Terjadi kesalahan. Silakan coba lagi.', 'error');
            }
          }
        );
      });
    };

    handleLoginSubmit(
      "#login-form-mobile",
      "#email-mobile",
      "#password-mobile",
      "#login-message-mobile",
      "#login-text-mobile"
    );

    handleLoginSubmit(
      "#login-form-desktop",
      "#email-desktop",
      "#password-desktop",
      "#login-message-desktop",
      "#login-text-desktop"
    );
  },
};

export default LoginPage;