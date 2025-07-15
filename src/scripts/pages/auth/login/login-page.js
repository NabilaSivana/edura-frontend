import {
  hideLoadingScreen,
  showLoadingScreen,
} from "../../../component/loading-screen.js";
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
    border: 1.5px solid #2C2F8C;
    border-radius: 0.75rem;
    background: white;
    color: black;
    font-size: 1rem;
    outline: none;
  }

  .floating-input label {
    position: absolute;
    left: 0.75rem;
    top: 1rem;
    background: white;
    padding: 0 0.25rem;
    color: #666;
    font-size: 1rem;
    pointer-events: none;
    transition: all 0.2s ease-in-out;
  }

  .floating-input input:focus + label,
  .floating-input input:not(:placeholder-shown) + label {
    top: 0.2rem;
    left: 0.65rem;
    font-size: 0.75rem;
    color: #2C2F8C;
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

    <form id="login-form-mobile" class="w-full space-y-4">
      <div class="floating-input">
        <input type="email" id="email-mobile" placeholder=" " required />
        <label for="email-mobile">Email</label>
      </div>
      <div class="floating-input relative">
        <input type="password" id="password-mobile" placeholder=" " required />
        <label for="password-mobile">Password</label>
        <i class="fas fa-eye absolute right-3 top-3 cursor-pointer text-gray-500" id="toggle-password-mobile"></i>
      </div>
      <div class="flex justify-end">
        <a href="#/forgot-password" class="text-sm hover:underline">Lupa Password?</a>
      </div>
      <button type="submit" class="bg-[#2C2F8C] text-white w-full py-2 rounded hover:bg-[#1e1f6c] transition">
        Login
      </button>
    </form>
    <p id="login-message" class="text-sm text-red-500 mt-2"></p>
  </div>
</section>

<!-- Desktop Layout -->
<section class="hidden md:flex w-screen h-screen font-sans m-0 p-0">
  <!-- Left: Login Form -->
  <div class="w-1/2 bg-white flex flex-col justify-center items-center px-12">
    <a href="#/" class="self-start text-[#2C2F8C] hover:underline mb-4 flex items-center gap-1">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M15 19l-7-7 7-7" />
      </svg>
      Kembali
    </a>
    <h2 class="text-[40px] font-extrabold text-[#2C2F8C] text-center">LOGIN</h2>
    <p class="text-[#2C2F8C] text-center mb-6">Silahkan Login terlebih dahulu</p>

    <form id="login-form-desktop" class="w-full max-w-sm flex flex-col space-y-4">
      <div class="floating-input">
        <input type="email" id="email-desktop" placeholder=" " required />
        <label for="email-desktop">Email</label>
      </div>
      <div class="floating-input relative">
        <input type="password" id="password-desktop" placeholder=" " required />
        <label for="password-desktop">Password</label>
        <i class="fas fa-eye absolute right-3 top-3 cursor-pointer text-gray-500" id="toggle-password-desktop"></i>
      </div>
      <div class="flex justify-end">
        <a href="#/forgot-password" class="text-xs text-[#2C2F8C] hover:underline">Lupa Password?</a>
      </div>
      <button type="submit" class="bg-[#2C2F8C] text-white py-2 rounded hover:bg-[#1e1f6c] transition-colors">
        Login
      </button>
    </form>
    <p id="login-message" class="text-sm text-red-500 mt-2"></p>
  </div>

  <!-- Right: Image + Welcome -->
  <div class="w-1/2 bg-[#86A6DF] flex flex-col justify-center items-center px-10 text-white rounded-tl-[100px] rounded-bl-[100px]">
    <h3 class="text-[32px] font-extrabold mb-6 text-center">Hallo, Friend!</h3>
    <img src="maskot4.png" alt="Robot Maskot" class="w-60 mb-6" />
    <p class="text-center mb-6 text-base">Jika belum punya akun daftar untuk masuk ke dashboard</p>
    <a href="#/register" class="border border-white text-white px-6 py-2 rounded hover:bg-white hover:text-[#86A6DF] font-semibold transition">
      Daftar
    </a>
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

    const handleLoginSubmit = (
      formSelector,
      emailSelector,
      passwordSelector
    ) => {
      const form = document.querySelector(formSelector);
      if (!form) return;

      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.querySelector(emailSelector).value;
        const password = document.querySelector(passwordSelector).value;
        const messageEl = document.querySelector("#login-message");

        // Tampilkan loading
        showLoadingScreen("Proses login...");

        LoginPresenter.handleLogin(
          email,
          password,
          (successMessage) => {
            hideLoadingScreen();
            sessionStorage.setItem("pendingOtpEmail", email);
            messageEl.textContent = successMessage;
            messageEl.classList.remove("text-red-500");
            messageEl.classList.add("text-green-600");

            setTimeout(() => {
              window.location.href = "/#/otp";
            }, 1500);
          },
          (errorMessage) => {
            hideLoadingScreen();
            messageEl.textContent = errorMessage;
            messageEl.classList.remove("text-green-600");
            messageEl.classList.add("text-red-500");
          }
        );
      });
    };

    handleLoginSubmit(
      "#login-form-mobile",
      "#email-mobile",
      "#password-mobile"
    );
    handleLoginSubmit(
      "#login-form-desktop",
      "#email-desktop",
      "#password-desktop"
    );
  },
};

export default LoginPage;
