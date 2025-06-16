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
    border-radius: 0.5rem;
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
</style>

<section class="w-screen h-screen flex flex-col md:flex-row font-sans overflow-hidden m-0 p-0">
  <!-- LEFT LOGIN FORM -->
  <div class="w-full md:w-1/2 h-full bg-white flex flex-col justify-center items-center px-8 md:px-12 space-y-6 animate-fade-in-left">
  <a href="#/" class="self-start text-[#2C2F8C] hover:underline mb-2 flex items-center gap-1">
  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
    viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M15 19l-7-7 7-7" />
  </svg>
  Kembali
</a>
    <h2 class="text-[32px] md:text-[40px] font-extrabold text-[#2C2F8C] text-center">LOGIN</h2>
    <p class="text-[#2C2F8C] text-center">Silahkan Login terlebih dahulu</p>

    <form id="login-form" class="w-full max-w-sm flex flex-col space-y-4">
      <div class="floating-input">
        <input type="email" id="email" placeholder=" " required />
        <label for="email">Email</label>
      </div>
      <div class="floating-input">
        <input type="password" id="password" placeholder=" " required />
        <label for="password">Password</label>
      </div>
      <div class="flex justify-end">
        <a href="#/forgot-password" class="text-xs text-[#2C2F8C] hover:underline">Lupa Password?</a>
      </div>
      <button
        type="submit"
        class="bg-[#2C2F8C] text-white py-2 rounded hover:bg-[#1e1f6c] transition-colors"
      >
        Login
      </button>
    </form>

    <p id="login-message" class="text-sm text-red-500"></p>
  </div>

  <!-- RIGHT IMAGE AND REGISTER -->
  <div class="w-full md:w-1/2 h-full bg-[#86A6DF] flex flex-col justify-center items-center px-10 text-white rounded-tl-[60px] md:rounded-tl-[100px] md:rounded-bl-[100px] animate-fade-in-left">
    <h3 class="text-[28px] md:text-[32px] font-extrabold mb-6 text-center">Hallo, Friend!</h3>
    <img src="maskot4.png" alt="Robot Maskot" class="w-48 md:w-60 mb-6" />
    <p class="text-center text-white mb-6 text-sm md:text-base">
      Jika belum punya akun Daftar terlebih dahulu untuk masuk ke dashboard
    </p>
    <a
      href="#/register"
      class="border border-white text-white px-6 py-2 rounded hover:bg-white hover:text-[#86A6DF] font-semibold transition"
    >
      Daftar
    </a>
  </div>
</section>
    `;
  },

  async afterRender() {
    const footer = document.querySelector("footer");
    if (footer) footer.style.display = "none";

    const form = document.querySelector("#login-form");
    const emailInput = document.querySelector("#email");
    const passwordInput = document.querySelector("#password");
    const messageEl = document.querySelector("#login-message");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = emailInput.value;
      const password = passwordInput.value;

      LoginPresenter.handleLogin(
        email,
        password,
        (successMessage) => {
          sessionStorage.setItem("pendingOtpEmail", email);
          messageEl.textContent = successMessage;
          messageEl.classList.remove("text-red-500");
          messageEl.classList.add("text-green-600");

          setTimeout(() => {
            window.location.href = "/#/otp";
          }, 1500);
        },
        (errorMessage) => {
          messageEl.textContent = errorMessage;
          messageEl.classList.remove("text-green-600");
          messageEl.classList.add("text-red-500");
        }
      );
    });
  },
};

export default LoginPage;
