import RegisterPresenter from "../register/register-presenter.js";

const RegisterPage = {
  async render() {
    return `
    <section class="w-screen h-screen flex flex-col md:flex-row font-sans overflow-hidden m-0 p-0">
      <!-- Kiri: Welcome Section -->
      <div class="w-full md:w-1/2 bg-[#88A9DF] flex flex-col items-center justify-center rounded-tr-[60px] md:rounded-tr-[100px] md:rounded-br-[100px] animate-fade-in-right p-6 md:p-0">
        <h3 class="text-3xl md:text-4xl font-bold text-white mb-4">Selamat Datang!</h3>
        <img src="maskot5.png" alt="Robot Maskot" class="w-56 h-56 object-contain mb-4" />
        <p class="text-white text-center text-sm md:text-base mb-4">Jika sudah punya akun login untuk masuk ke dashboard</p>
        <a href="#/login" class="px-6 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-[#88A9DF] transition">Login</a>
      </div>

      <!-- Kanan: Form Section -->
      <div class="w-full md:w-1/2 bg-white flex flex-col items-center justify-center px-6 py-12 md:rounded-tr-[4rem] md:rounded-br-[4rem] animate-slide-in-right">
      <a href="#/" class="self-start text-[#2C2F8C] hover:underline mb-2 flex items-center gap-1">
  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
    viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M15 19l-7-7 7-7" />
  </svg>
  Kembali
</a>

        <div class="w-full max-w-md text-center">
          <h2 class="text-[32px] md:text-[40px] font-extrabold text-[#2C2F8C] text-center">DAFTAR</h2>
    <p class="text-[#2C2F8C] text-center">Buat akun Anda, silahkan isi form untuk mendaftarkan akun</p>

          <form id="register-form" class="space-y-4 text-left">
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
            <button type="submit" class="w-full bg-[#2A2A7E] text-white py-3 rounded-lg font-semibold hover:bg-[#1f1f5e] transition-all">
              Daftar
            </button>
            <p id="register-message" class="text-sm mt-2 text-center"></p>
          </form>
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

      /* Custom slide animations */
      @keyframes slideInLeft {
        0% {
          opacity: 0;
          transform: translateX(-50px);
        }
        100% {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes slideInRight {
        0% {
          opacity: 0;
          transform: translateX(50px);
        }
        100% {
          opacity: 1;
          transform: translateX(0);
        }
      }

      .animate-slide-in-left {
        animation: slideInLeft 0.8s ease-out forwards;
      }

      .animate-slide-in-right {
        animation: slideInRight 0.8s ease-out forwards;
      }

      /* Hapus margin body agar benar-benar full screen */
      body {
        margin: 0;
        padding: 0;
      }
    </style>
  `;
  },
  async afterRender() {
    const footer = document.querySelector("footer");
    if (footer) {
      footer.style.display = "none";
    }

    const form = document.querySelector("#register-form");
    const nameInput = document.querySelector("#name");
    const emailInput = document.querySelector("#email");
    const passwordInput = document.querySelector("#password");
    const messageEl = document.querySelector("#register-message");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = nameInput.value;
      const email = emailInput.value;
      const password = passwordInput.value;

      RegisterPresenter.handleRegister(
        name,
        email,
        password,
        (successMessage) => {
          messageEl.textContent = successMessage;
          messageEl.className = "text-green-500 mt-2";
        },
        (errorMessage) => {
          messageEl.textContent = errorMessage;
          messageEl.className = "text-red-500 mt-2";
        }
      );
    });
  },
};

export default RegisterPage;
