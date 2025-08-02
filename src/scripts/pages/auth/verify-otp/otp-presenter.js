// otp-presenter.js
import OtpModel from "./otp-model.js";

const OtpPresenter = {
  async handleOtp(email, otp, onSuccess, onError) {
    try {
      const result = await OtpModel.verifyOtp(email, otp);

      // Only proceed if we get a successful response with token
      if (result.token) {
        localStorage.setItem("token", result.token);

        // Store user info if needed
        if (result.user_id) {
          localStorage.setItem("user_id", result.user_id);
        }
        if (result.role) {
          localStorage.setItem("user_role", result.role);
        }

        onSuccess(result.message || "Verifikasi berhasil! Anda akan diarahkan...");
      } else {
        onError("Verifikasi gagal. Token tidak ditemukan.");
      }
    } catch (error) {
      if (onError) onError(error.message);
    }
  },

  async resendOtp(email) {
    try {
      const result = await OtpModel.resendOtp(email);
      return result;
    } catch (error) {
      throw error;
    }
  }
};

export default OtpPresenter;