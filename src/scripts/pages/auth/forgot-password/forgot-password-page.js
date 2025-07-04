import CONFIG from "../../../config.js";
const ForgotPasswordPage = {
  render() {
    return `
      <section class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 class="text-2xl font-bold mb-4 text-center">Lupa Password</h2>
          <form id="forgot-password-form" class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan email anda"
              />
            </div>
            <button
              type="submit"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            >
              Kirim Email Reset
            </button>
            <p id="forgot-password-message" class="text-center text-sm mt-2"></p>
          </form>
        </div>
      </section>
    `;
  },

  async afterRender() {
    const form = document.querySelector("#forgot-password-form");
    const messageElement = document.querySelector("#forgot-password-message");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      messageElement.textContent = "";

      const email = form.email.value;

      try {
        await forgotPassword(email);
        messageElement.textContent = "Email reset berhasil dikirim!";
        messageElement.classList.add("text-green-600");
      } catch (error) {
        messageElement.textContent = error.message || "Terjadi kesalahan.";
        messageElement.classList.add("text-red-600");
      }
    });
  },
};

async function forgotPassword(email) {
  const response = await fetch(`${CONFIG.BASE_URL}/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error("Gagal mengirim email reset");
  }

  return response.json();
}

export default ForgotPasswordPage;
