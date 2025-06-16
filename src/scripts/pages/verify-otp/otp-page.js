import OtpPresenter from "./otp-presenter.js";

const OtpPage = {
  async render() {
    return `
      <section class="w-screen h-screen flex flex-col justify-center items-center bg-white font-sans">
        <div class="bg-white shadow-md rounded-lg p-8 w-[90%] max-w-md animate-fade-in-left">
          <h2 class="text-2xl md:text-3xl font-bold text-center text-[#2C2F8C] mb-4">Verifikasi OTP</h2>
          <p class="text-center text-sm text-gray-600 mb-6">Masukkan 6 digit kode OTP yang dikirim ke email Anda.</p>

          <form id="otp-form" class="flex flex-col items-center space-y-6">
            <div id="otp-inputs" class="flex justify-center gap-3">
              ${[...Array(6)]
        .map(
          () => `<input type="text" maxlength="1" class="otp-box" />`
        )
        .join("")}
            </div>
            <button type="submit" class="w-full bg-[#2C2F8C] hover:bg-[#1e1f6c] text-white font-semibold py-3 rounded-md transition">
              Verifikasi
            </button>
          </form>
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
          }
          .otp-box:focus {
            box-shadow: 0 0 0 2px rgba(44, 47, 140, 0.5);
            border-color: #2C2F8C;
          }
        </style>
      </section>
    `;
  },

  async afterRender() {
    const form = document.querySelector("#otp-form");
    const inputs = document.querySelectorAll(".otp-box");
    const messageEl = document.querySelector("#otp-message");
    const email = sessionStorage.getItem("pendingOtpEmail");

    if (!email) {
      messageEl.textContent = "Email tidak ditemukan. Silakan login kembali.";
      messageEl.classList.add("text-red-500");
      return;
    }

    // Auto focus ke input selanjutnya saat diisi
    inputs.forEach((input, index) => {
      input.addEventListener("input", () => {
        input.value = input.value.replace(/[^0-9]/g, ""); // hanya angka
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
          if (inputs[i]) inputs[i].value = char;
        });
        if (paste.length === 6) {
          inputs[5].focus();
        }
      });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const otp = Array.from(inputs)
        .map((input) => input.value)
        .join("");

      if (otp.length !== 6) {
        messageEl.textContent = "Kode OTP harus 6 digit.";
        messageEl.className = "text-red-500";
        return;
      }

      OtpPresenter.handleOtp(
        email,
        otp,
        (successMessage) => {
          messageEl.textContent = successMessage;
          messageEl.className = "text-green-600";
          setTimeout(() => {
            window.location.href = "/#/dashboard";
          }, 1500);
        },
        (errorMessage) => {
          messageEl.textContent = errorMessage;
          messageEl.className = "text-red-500";
        }
      );
    });
  },
};

export default OtpPage;
