import API from "../../../data/api.js";

const ResetPasswordPage = {
  async render() {
    return `
      <section class="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
        <h2 class="text-xl font-bold text-center mb-4">Reset Password</h2>
        <form id="reset-password-form" class="space-y-4">
          <div>
            <label for="new-password" class="block text-sm font-medium">New Password</label>
            <input type="password" id="new-password" name="new-password" required
              class="w-full border border-gray-300 p-2 rounded mt-1" />
          </div>
          <button type="submit"
            class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Reset Password
          </button>
          <p id="reset-error" class="text-red-500 text-sm mt-2 hidden"></p>
          <p id="reset-success" class="text-green-500 text-sm mt-2 hidden"></p>
        </form>
      </section>
    `;
  },

  async afterRender() {
    const urlParams = new URLSearchParams(window.location.hash.split("?")[1]);
    const token = urlParams.get("token");

    const form = document.querySelector("#reset-password-form");
    const errorText = document.querySelector("#reset-error");
    const successText = document.querySelector("#reset-success");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const newPassword = document.querySelector("#new-password").value;

      try {
        const response = await API.postResetPassword({
          token,
          new_password: newPassword,
        });

        if (response.error) {
          errorText.textContent = response.error;
          errorText.classList.remove("hidden");
        } else {
          errorText.classList.add("hidden");
          successText.textContent = "Password reset successful! Please login.";
          successText.classList.remove("hidden");

          // Optional: Redirect to login after 3s
          setTimeout(() => {
            window.location.hash = "#/login";
          }, 3000);
        }
      } catch (err) {
        errorText.textContent = "Something went wrong.";
        errorText.classList.remove("hidden");
      }
    });
  },
};

export default ResetPasswordPage;
