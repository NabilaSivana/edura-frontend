import RegisterPresenter from "../register/register-presenter.js";
import {
  showLoadingScreen,
  hideLoadingScreen,
} from "../../../component/loading-screen.js";

const RegisterPage = {
  async render() {
    return `
    <section class="w-screen min-h-screen font-sans m-0 p-0">
      <!-- Mobile Layout -->
      <div class="block md:hidden bg-[#88A9DF] min-h-screen text-white overflow-y-auto">
        <div class="flex flex-col items-center justify-center px-6 pt-10 pb-6 text-center">
          <h1 class="text-3xl font-extrabold mb-4">Selamat Datang!</h1>
          <img src="maskot5.png" alt="Robot Maskot" class="w-40 mb-4" />
          <p class="text-sm mb-4 max-w-sm">Jika sudah punya akun login untuk masuk ke dashboard</p>
          <a href="#/login" class="border border-white text-white px-6 py-2 rounded font-semibold hover:bg-white hover:text-[#88A9DF] transition">
            Login
          </a>
        </div>

        <div class="bg-white text-[#2C2F8C] rounded-t-[60px] px-8 py-10 animate-fade-in-up flex flex-col items-center max-w-md mx-auto">
          <h2 class="text-2xl font-extrabold mb-1">DAFTAR</h2>
          <p class="text-center mb-6">Silahkan isi form untuk mendaftarkan akun</p>

          <form id="register-form" class="w-full space-y-4">
            <div class="floating-input">
              <input type="text" id="name" placeholder=" " required />
              <label for="name">Nama Lengkap</label>
            </div>
            <div class="floating-input">
              <input type="email" id="email" placeholder=" " required />
              <label for="email">Email</label>
            </div>
            <div class="floating-input">
              <input type="password" id="password" placeholder=" " required />
              <label for="password">Password</label>
            </div>
            <button type="submit" class="bg-[#2A2A7E] text-white w-full py-2 rounded hover:bg-[#1f1f5e] transition">
              Daftar
            </button>
            <p id="register-message" class="text-sm mt-2 text-center"></p>
          </form>
        </div>
      </div>

      <!-- Desktop Layout -->
      <div class="hidden md:flex w-screen h-screen font-sans">
        <!-- Left: Form -->
        <div class="w-1/2 bg-white flex flex-col justify-center items-center px-12">
          <a href="#/" class="self-start text-[#2C2F8C] hover:underline mb-4 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 19l-7-7 7-7" />
            </svg>
            Kembali
          </a>
          <h2 class="text-[40px] font-extrabold text-[#2C2F8C] text-center">DAFTAR</h2>
          <p class="text-[#2C2F8C] text-center mb-6">Buat akun Anda, silahkan isi form untuk mendaftarkan akun</p>

          <form id="register-form" class="w-full max-w-sm flex flex-col space-y-4">
            <div class="floating-input">
              <input type="text" id="name" placeholder=" " required />
              <label for="name">Nama Lengkap</label>
            </div>
            <div class="floating-input">
              <input type="email" id="email" placeholder=" " required />
              <label for="email">Email</label>
            </div>
            <div class="floating-input">
              <input type="password" id="password" placeholder=" " required />
              <label for="password">Password</label>
            </div>
            <button type="submit" class="bg-[#2C2F8C] text-white py-2 rounded hover:bg-[#1e1f6c] transition">
              Daftar
            </button>
            <p id="register-message" class="text-sm text-red-500 mt-2"></p>
          </form>
        </div>

        <!-- Right: Welcome -->
        <div class="w-1/2 bg-[#88A9DF] flex flex-col justify-center items-center px-10 text-white rounded-tl-[100px] rounded-bl-[100px]">
          <h3 class="text-[32px] font-extrabold mb-6 text-center">Selamat Datang!</h3>
          <img src="maskot5.png" alt="Robot Maskot" class="w-60 mb-6" />
          <p class="text-center mb-6 text-base">Jika sudah punya akun login untuk masuk ke dashboard</p>
          <a href="#/login" class="border border-white text-white px-6 py-2 rounded hover:bg-white hover:text-[#88A9DF] font-semibold transition">
            Login
          </a>
        </div>
      </div>
    </section>

    <style>
      .floating-input {
        position: relative;
      }

      .floating-input input {
        width: 100%;
        padding: 0.75rem;
        border: 1.5px solid #5b5bd6;
        border-radius: 0.5rem;
        outline: none;
        background: white;
        color: black;
        font-size: 1rem;
      }

      .floating-input label {
        position: absolute;
        left: 0.75rem;
        top: 0.8rem;
        background: white;
        padding: 0 0.25rem;
        color: #999;
        font-size: 1rem;
        transition: all 0.2s ease-in-out;
        pointer-events: none;
      }

      .floating-input input:focus + label,
      .floating-input input:not(:placeholder-shown) + label {
        top: -0.6rem;
        left: 0.65rem;
        font-size: 0.75rem;
        color: #5b5bd6;
      }

      @keyframes fadeInUp {
        0% {
          opacity: 0;
          transform: translateY(30px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-fade-in-up {
        animation: fadeInUp 0.8s ease-out forwards;
      }
    </style>
    `;
  },

  async afterRender() {
    const footer = document.querySelector("footer");
    if (footer) footer.style.display = "none";

    const formMobile = document.querySelector(".block #register-form");
    const formDesktop = document.querySelector(".md\\:flex #register-form");

    // Fungsi utama submit handler
    function handleRegisterSubmit(form) {
      const name = form.querySelector("#name")?.value;
      const email = form.querySelector("#email")?.value;
      const password = form.querySelector("#password")?.value;
      const messageEl =
        form.querySelector("#register-message") ||
        document.querySelector("#register-message");

      showLoadingScreen("Mendaftarkan akun...");

      RegisterPresenter.handleRegister(
        name,
        email,
        password,
        (successMessage) => {
          hideLoadingScreen();
          messageEl.textContent = successMessage;
          messageEl.className = "text-green-500 mt-2 text-center";
          setTimeout(() => {
            window.location.href = "/#/login";
          }, 1500);
        },
        (errorMessage) => {
          hideLoadingScreen();
          messageEl.textContent = errorMessage;
          messageEl.className = "text-red-500 mt-2 text-center";
        }
      );
    }

    // Tambahkan event listener untuk masing-masing form
    if (formMobile) {
      formMobile.addEventListener("submit", (e) => {
        e.preventDefault();
        handleRegisterSubmit(formMobile);
      });
    }

    if (formDesktop) {
      formDesktop.addEventListener("submit", (e) => {
        e.preventDefault();
        handleRegisterSubmit(formDesktop);
      });
    }
  },
};

export default RegisterPage;
