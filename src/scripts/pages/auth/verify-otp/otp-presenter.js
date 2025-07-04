// otp-presenter.js
import OtpModel from "./otp-model.js";

const OtpPresenter = {
  async handleOtp(email, otp, onSuccess, onError) {
    try {
      const result = await OtpModel.verifyOtp(email, otp);
      localStorage.setItem("token", result.token);
      onSuccess("Verifikasi berhasil! Anda akan diarahkan...");
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
