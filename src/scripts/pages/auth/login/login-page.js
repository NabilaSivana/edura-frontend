import LoginPresenter from "../login/login-presenter.js";

const LoginPage = {
  async render() {
    return `
<style>
  /* === BAGIAN 1: GAYA DASAR dengan Dark Mode Support === */
  /* Dark mode variables - konsisten dengan register */
  :root {
    --bg-primary: #ffffff;
    --bg-secondary: #f9fafb;
    --bg-card: #ffffff;
    --text-primary: #1f2937;
    --text-secondary: #6b7280;
    --text-accent: #2C2F8C;
    --border-color: #e5e7eb;
    --input-bg: #ffffff;
    --shadow-color: rgba(0, 0, 0, 0.1);
    --overlay-color: rgba(0, 0, 0, 0.1);
  }

  .dark {
    --bg-primary: #111827;
    --bg-secondary: #1f2937;
    --bg-card: #1f2937;
    --text-primary: #f9fafb;
    --text-secondary: #9ca3af;
    --text-accent: #86A6DF;
    --border-color: #4b5563;
    --input-bg: #374151;
    --shadow-color: rgba(0, 0, 0, 0.3);
    --overlay-color: rgba(0, 0, 0, 0.3);
  }

  /* Dark mode toggle button */
  .theme-toggle {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 1000;
    background: var(--bg-card);
    border: 2px solid var(--border-color);
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px var(--shadow-color);
  }

  .theme-toggle:hover {
    transform: scale(1.1);
    background: var(--text-accent);
    color: white;
  }

  .theme-toggle i {
    font-size: 1.2rem;
    color: var(--text-primary);
    transition: all 0.3s ease;
  }

  .theme-toggle:hover i {
    color: white;
  }

  /* Floating input - konsisten dengan register */
  .floating-input { 
    position: relative; 
    width: 100%;
  }
  
  .floating-input input {
    width: 100%; 
    padding: 1rem 0.75rem 0.5rem; 
    border: 1.5px solid var(--border-color);
    border-radius: 0.75rem; 
    background: var(--input-bg); 
    color: var(--text-primary);
    font-size: 1rem; 
    outline: none; 
    transition: all 0.2s ease;
    box-sizing: border-box;
  }
  
  /* Khusus untuk input password - padding kanan yang cukup untuk icon */
  .floating-input input[type="password"], 
  .floating-input input[data-password="true"] {
    padding-right: 48px !important;
  }

  .floating-input input:focus {
    border-color: var(--text-accent);
    box-shadow: 0 0 0 3px rgba(44, 47, 140, 0.1);
  }

  .dark .floating-input input:focus {
    box-shadow: 0 0 0 3px rgba(134, 166, 223, 0.2);
  }

  .floating-input input.error { 
    border-color: #ef4444; 
  }
  
  .floating-input input.error:focus { 
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1); 
  }
  
  .dark .floating-input input.error:focus { 
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2); 
  }

  .floating-input label {
    position: absolute; 
    left: 0.75rem; 
    top: 1rem; 
    background: var(--input-bg);
    padding: 0 0.25rem; 
    color: var(--text-secondary); 
    font-size: 1rem;
    pointer-events: none; 
    transition: all 0.2s ease-in-out;
  }

  .floating-input input:focus + label, 
  .floating-input input:not(:placeholder-shown) + label {
    top: -0.5rem; 
    left: 0.65rem; 
    font-size: 0.75rem; 
    color: var(--text-accent);
    background: var(--bg-primary);
  }

  .dark .floating-input input:focus + label, 
  .dark .floating-input input:not(:placeholder-shown) + label {
    background: var(--bg-primary);
  }

  .floating-input input.error + label { 
    color: #ef4444; 
  }

  /* Password toggle - konsisten dengan register */
  .password-toggle { 
    position: absolute; 
    right: 12px; 
    top: 16px;
    cursor: pointer; 
    color: var(--text-secondary);
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    transition: color 0.2s ease;
    user-select: none;
    margin: 0;
    padding: 0;
  }
  
  .password-toggle:hover {
    color: var(--text-accent);
  }
  
  /* Icon styling untuk konsistensi */
  .password-toggle i {
    font-size: 16px;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Message styles - konsisten dengan register */
  .error-message, .success-message, .warning-message {
    padding: 0.75rem 1rem; 
    border-radius: 0.5rem; 
    margin-bottom: 1rem;
    font-size: 0.875rem; 
    display: flex; 
    align-items: center; 
    gap: 0.5rem;
    animation: slideDown 0.3s ease-out; 
    border: 1px solid;
  }
  
  .error-message { 
    background-color: #fef2f2; 
    border-color: #fecaca; 
    color: #dc2626; 
  }
  
  .success-message { 
    background-color: #f0fdf4; 
    border-color: #bbf7d0; 
    color: #16a34a; 
  }
  
  .warning-message { 
    background-color: #fefce8; 
    border-color: #fef08a; 
    color: #ca8a04; 
  }
  
  /* Dark mode untuk messages */
  .dark .error-message { 
    background-color: #450a0a; 
    border-color: #7f1d1d; 
    color: #f87171; 
  }
  
  .dark .success-message { 
    background-color: #052e16; 
    border-color: #166534; 
    color: #4ade80; 
  }
  
  .dark .warning-message { 
    background-color: #451a03; 
    border-color: #a16207; 
    color: #fbbf24; 
  }

  @keyframes slideDown { 
    from { opacity: 0; transform: translateY(-10px); } 
    to { opacity: 1; transform: translateY(0); } 
  }

  @keyframes slideUp { 
    from { opacity: 0; transform: translateY(50px); } 
    to { opacity: 1; transform: translateY(0); } 
  }

  .animate-slide-up { 
    animation: slideUp 0.6s ease-out; 
  }

  /* Login button - konsisten dengan register */
  .login-button {
    background:  #1e1f6c;
    color: white;
    width: 100%;
    padding: 0.75rem;
    border-radius: 0.75rem;
    font-weight: 500;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
  }

  .login-button:hover:not(:disabled) {
    background: #1e1f6c;
  }

  .dark .login-button:hover:not(:disabled) {
    background: #6b8bc4;
  }

  .login-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  /* Divider */
  .divider {
    display: flex;
    align-items: center;
    margin: 1.5rem 0;
    gap: 1rem;
    color: var(--text-secondary);
  }

  .divider::before,
  .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: var(--border-color);
  }

  /* === BAGIAN 2: ANIMATION SUITE LENGKAP === */
  
  /* Keyframes Animasi Utama */
  @keyframes waveFromLeft {
    0% { opacity: 0; transform: translateX(-100%) scale(0.8) rotateY(-15deg); filter: blur(2px); }
    50% { opacity: 0.8; transform: translateX(-20%) scale(0.95) rotateY(-5deg); filter: blur(1px); }
    100% { opacity: 1; transform: translateX(0) scale(1) rotateY(0); filter: blur(0); }
  }

  @keyframes waveFromRight {
    0% { opacity: 0; transform: translateX(100%) scale(0.8) rotateY(15deg); filter: blur(2px); }
    50% { opacity: 0.8; transform: translateX(20%) scale(0.95) rotateY(5deg); filter: blur(1px); }
    100% { opacity: 1; transform: translateX(0) scale(1) rotateY(0); filter: blur(0); }
  }

  @keyframes formElementsStagger {
    0% { opacity: 0; transform: translateY(20px) scale(0.95); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }

  @keyframes welcomeContentFloat {
    0% { opacity: 0; transform: translateY(30px) scale(0.9); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }

  @keyframes backgroundPulse {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(1deg); }
  }

  /* Mobile fade animation */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .animate-fade-in {
    animation: fadeIn 0.8s ease-out;
  }

  /* Desktop layout specific animations */
  .animate-wave-left {
    animation: waveFromLeft 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    background: var(--bg-primary);
  }

  .animate-wave-right {
    animation: waveFromRight 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    background: linear-gradient(-45deg, #86A6DF, #6b8bc4, #86A6DF, #7c94d1);
    background-size: 400% 400%;
    animation: waveFromRight 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
               backgroundPulse 8s ease-in-out infinite;
  }

  /* Dark theme gradient */
  .dark .animate-wave-right {
    background: linear-gradient(-45deg, #4c1d95, #5b21b6, #6d28d9, #7c3aed);
    background-size: 400% 400%;
    animation: waveFromRight 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
               backgroundPulse 8s ease-in-out infinite;
  }

  /* Staggered form animations */
  .form-element-1 { animation: formElementsStagger 0.6s ease-out 0.3s both; }
  .form-element-2 { animation: formElementsStagger 0.6s ease-out 0.4s both; }
  .form-element-3 { animation: formElementsStagger 0.6s ease-out 0.5s both; }
  .form-element-4 { animation: formElementsStagger 0.6s ease-out 0.6s both; }
  .form-element-5 { animation: formElementsStagger 0.6s ease-out 0.7s both; }
  .form-element-6 { animation: formElementsStagger 0.6s ease-out 0.8s both; }

  /* Welcome content animations */
  .welcome-element-1 { animation: welcomeContentFloat 0.8s ease-out 0.4s both; }
  .welcome-element-2 { animation: welcomeContentFloat 0.8s ease-out 0.6s both; }
  .welcome-element-3 { animation: welcomeContentFloat 0.8s ease-out 0.8s both; }
  .welcome-element-4 { animation: welcomeContentFloat 0.8s ease-out 1.0s both; }
  .welcome-element-5 { animation: welcomeContentFloat 0.8s ease-out 1.2s both; }

  /* Enhanced hover effects */
  .enhanced-hover {
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .enhanced-hover:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 10px 25px var(--shadow-color);
  }

  /* Floating effect for mascot */
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

  /* Mobile layout dark mode styles */
  .mobile-bg {
    background: #86A6DF;
    transition: background 0.3s ease;
  }

  .dark .mobile-bg {
    background: linear-gradient(-45deg, #4c1d95, #5b21b6, #6d28d9, #7c3aed);
  }

  /* Mobile card - konsisten dengan register */
  .mobile-card {
    background: var(--bg-card);
    color: var(--text-primary);
  }

  /* Form panel - konsisten dengan register */
  .login-form-panel {
    background: var(--bg-primary);
    color: var(--text-primary);
  }

  /* Text color classes - konsisten dengan register */
  .login-title {
    color: var(--text-accent);
  }
  
  .login-subtitle {
    color: var(--text-secondary);
  }

  /* Link styles - konsisten dengan register */
  .link-primary {
    color: var(--text-accent);
    transition: all 0.3s ease;
  }

  .link-primary:hover {
    text-decoration: underline;
  }

  /* Button variants for different themes */
  .btn-outline {
    border: 2px solid rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    color: white;
    transition: all 0.3s ease;
  }

  .btn-outline:hover {
    background: white;
    color: var(--text-accent);
  }

  .dark .btn-outline:hover {
    background: var(--bg-card);
    color: var(--text-accent);
  }

  /* Checkbox styling untuk dark mode */
  .login-checkbox {
    accent-color: var(--text-accent);
  }

  /* Smooth transitions for theme changes */
  * {
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
  }

  /* Responsive adjustments untuk memastikan konsistensi */
  @media (max-width: 768px) {
    .password-toggle {
      right: 12px;
      top: 16px;
    }
  }
</style>

<!-- Theme Toggle Button -->
<button class="theme-toggle" id="theme-toggle" title="Toggle Dark Mode">
  <i class="fas fa-moon" id="theme-icon"></i>
</button>

<!-- Mobile Layout -->
<section class="block md:hidden w-screen min-h-screen mobile-bg text-white font-sans overflow-y-auto">
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
    <a href="#/register" class="btn-outline px-6 py-2 rounded font-semibold">
      Daftar
    </a>
  </div>

  <div class="mobile-card rounded-t-[60px] px-8 py-10 flex flex-col items-center max-w-md mx-auto animate-slide-up">
    <h2 class="text-2xl font-extrabold mb-1 login-title">LOGIN</h2>
    <p class="text-center mb-6 login-subtitle">Silahkan Login terlebih dahulu</p>

    <div id="login-message-mobile" class="w-full max-w-sm"></div>

    <form id="login-form-mobile" class="w-full space-y-4">
      <div class="floating-input">
        <input type="email" id="email-mobile" placeholder=" " required />
        <label for="email-mobile">Email</label>
      </div>
      <div class="floating-input">
        <input type="password" id="password-mobile" placeholder=" " required />
        <label for="password-mobile">Password</label>
        <span class="password-toggle" id="toggle-password-mobile">
          <i class="fas fa-eye"></i>
        </span>
      </div>
      <div class="flex justify-end">
        <a href="#/forgot-password" class="text-sm link-primary">Lupa Password?</a>
      </div>
      <button type="submit" class="login-button">
        <span id="login-text-mobile">Login</span>
      </button>
    </form>
  </div>
</section>

<!-- Desktop Layout -->
<section class="hidden md:flex w-screen h-screen font-sans m-0 p-0">
  <!-- Left: Login Form -->
  <div class="w-1/2 flex flex-col justify-center items-center px-12 animate-wave-left login-form-panel">
    <div class="w-full max-w-md">
      <a href="#/" class="link-primary mb-8 flex items-center gap-1 transition-colors inline-flex form-element-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M15 19l-7-7 7-7" />
        </svg>
        Kembali ke Beranda
      </a>
      
      <div class="text-center mb-8 form-element-2">
        <h2 class="text-4xl font-extrabold login-title mb-2">Selamat Datang</h2>
        <p class="login-subtitle">Masuk ke akun Edura LMS Anda</p>
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
          <label class="flex items-center text-sm login-subtitle">
            <input type="checkbox" class="mr-2 login-checkbox" />
            Ingat saya
          </label>
          <a href="#/forgot-password" class="text-sm link-primary">Lupa Password?</a>
        </div>
        <button type="submit" class="login-button ripple-button form-element-5 enhanced-hover">
          <span id="login-text-desktop">Masuk</span>
        </button>
      </form>

      <div class="divider form-element-6">
        <span>atau</span>
      </div>

      <p class="text-center login-subtitle form-element-6">
        Apakah Anda Dosen?
        <a href="#/be-teacher" class="link-primary font-semibold">Daftar disini</a>
      </p>
    </div>
  </div>

  <!-- Right: Image + Welcome -->
  <div class="w-1/2 flex flex-col justify-center items-center px-10 text-white rounded-tl-[100px] rounded-bl-[100px] relative overflow-hidden animate-wave-right">
    <div class="absolute inset-0" style="background: var(--overlay-color)"></div>
    <div class="relative z-10 text-center">
      <h3 class="text-4xl font-extrabold mb-6 welcome-element-1">Edura LMS</h3>
      <img src="maskot4.png" alt="Edura Mascot" class="w-72 mb-6 mx-auto drop-shadow-2xl floating-mascot welcome-element-2" />
      <p class="text-lg mb-2 text-white/90 welcome-element-3">Platform Pembelajaran Digital Terbaik</p>
      <p class="mb-8 text-white/80 max-w-md mx-auto welcome-element-4">Bergabunglah dengan ribuan siswa yang telah meningkatkan kemampuan mereka bersama Edura</p>
      <a href="#/register" class="inline-block btn-outline px-8 py-3 rounded-lg font-semibold shadow-xl ripple-button welcome-element-5 enhanced-hover">
        Gabung Sekarang
      </a>
    </div>
  </div>
</section>
`;
  },

  async afterRender() {
    // Initialize theme - sync with sidebar approach
    const initTheme = () => {
      const themeIcon = document.getElementById('theme-icon');
      const isDark = document.documentElement.classList.contains('dark');
      
      if (isDark) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
      } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
      }
    };

    // Theme toggle functionality - consistent with sidebar
    const setupThemeToggle = () => {
      const themeToggle = document.getElementById('theme-toggle');
      const themeIcon = document.getElementById('theme-icon');

      themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        
        if (document.documentElement.classList.contains('dark')) {
          themeIcon.classList.remove('fa-moon');
          themeIcon.classList.add('fa-sun');
        } else {
          themeIcon.classList.remove('fa-sun');
          themeIcon.classList.add('fa-moon');
        }
      });
    };

    // Setup password toggle - konsisten dengan register
    const setupTogglePassword = (inputId, toggleId) => {
      const input = document.querySelector(inputId);
      const toggle = document.querySelector(toggleId);

      if (!input || !toggle) return;

      toggle.addEventListener("click", () => {
        const isPassword = input.type === "password";
        input.type = isPassword ? "text" : "password";
        toggle.querySelector('i').classList.toggle("fa-eye");
        toggle.querySelector('i').classList.toggle("fa-eye-slash");
      });
    };

    setupTogglePassword("#password-mobile", "#toggle-password-mobile");
    setupTogglePassword("#password-desktop", "#toggle-password-desktop");

    const footer = document.querySelector("footer");
    if (footer) footer.style.display = "none";

    // Fungsi showMessage yang konsisten dengan register
    const showMessage = (messageElId, message, type = 'error') => {
      const messageEl = document.querySelector(messageElId);
      const iconMap = {
        error: '<i class="fas fa-exclamation-circle"></i>',
        success: '<i class="fas fa-check-circle"></i>',
        warning: '<i class="fas fa-info-circle"></i>'
      };

      if (messageEl) {
        messageEl.innerHTML = `
          <div class="${type}-message">
            ${iconMap[type]}
            <span>${message}</span>
          </div>
        `;
      }
    };

    const clearMessage = (messageElId) => {
      const messageEl = document.querySelector(messageElId);
      if (messageEl) messageEl.innerHTML = '';
    };

    // Fungsi handleLoginSubmit yang konsisten dengan register
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

        // Clear previous errors - konsisten dengan register
        clearMessage(messageElId);
        emailInput.classList.remove('error');
        passwordInput.classList.remove('error');

        // Validasi Frontend dasar
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          emailInput.classList.add('error');
          return showMessage(messageElId, 'Format email tidak valid.', 'error');
        }
        if (password.length < 6) {
          passwordInput.classList.add('error');
          return showMessage(messageElId, 'Password minimal 6 karakter.', 'error');
        }

        // Disable button and show loading - konsisten dengan register
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
            // Error handler - handle different error cases - konsisten dengan register
            submitButton.disabled = false;
            buttonText.textContent = formSelector.includes('mobile') ? 'Login' : 'Masuk';

            if (errorMessage.includes('Email not registered')) {
              emailInput.classList.add('error');
              showMessage(messageElId, 'Email belum terdaftar. Silakan daftar terlebih dahulu.', 'error');
            } else if (errorMessage.includes('Email not verified')) {
              showMessage(messageElId, 'Email belum diverifikasi. Kami telah mengirim link verifikasi baru ke email Anda.', 'warning');
            } else if (errorMessage.includes('Invalid credentials')) {
              passwordInput.classList.add('error');
              showMessage(messageElId, 'Password yang Anda masukkan salah. Silakan coba lagi.', 'error');
            } else {
              showMessage(messageElId, errorMessage || 'Terjadi kesalahan. Silakan coba lagi.', 'error');
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

    // Initialize theme and setup toggle
    initTheme();
    setupThemeToggle();
  },
};

export default LoginPage;