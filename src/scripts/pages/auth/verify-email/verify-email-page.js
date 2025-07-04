import API from "../../../data/api.js";

const VerifyEmailPage = {
  async render() {
    return `
      <section class="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow text-center">
        <h2 class="text-xl font-bold mb-4">Email Verification</h2>
        <p id="status-message" class="text-gray-700">Verifying your email, please wait...</p>
      </section>
    `;
  },

  async afterRender() {
    const statusMessage = document.querySelector("#status-message");
    const urlParams = new URLSearchParams(window.location.hash.split("?")[1]);
    const token = urlParams.get("token");

    if (!token) {
      statusMessage.textContent = "Invalid verification link.";
      return;
    }

    try {
      const response = await API.postVerifyEmail({ token });

      if (response.error) {
        statusMessage.textContent = response.error || "Verification failed.";
        statusMessage.classList.add("text-red-500");
      } else {
        statusMessage.textContent =
          "✅ Email verified successfully! Redirecting to login...";
        statusMessage.classList.add("text-green-600");

        setTimeout(() => {
          window.location.hash = "#/login";
        }, 3000);
      }
    } catch (err) {
      statusMessage.textContent = "An error occurred during verification.";
      statusMessage.classList.add("text-red-500");
    }
  },
};

export default VerifyEmailPage;
