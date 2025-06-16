import OtpModel from "./otp-model.js";

const OtpPresenter = {
  async handleOtp(email, otp, onSuccess, onError) {
    try {
      const result = await OtpModel.verifyOtp(email, otp);

      // Simpan token dan data penting ke localStorage
      localStorage.setItem("token", result.token);
      localStorage.setItem("user_id", result.user_id);
      localStorage.setItem("role", result.role);

      onSuccess("Verifikasi berhasil! Anda akan diarahkan...");
    } catch (error) {
      if (onError) onError(error.message);
    }
  },
};

export default OtpPresenter;
