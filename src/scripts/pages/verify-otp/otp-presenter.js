import OtpModel from "./otp-model.js";

const OtpPresenter = {
  async handleOtp(email, otp, onSuccess, onError) {
    try {
      const result = await OtpModel.verifyOtp(email, otp);
      if (onSuccess) onSuccess(result.message || "OTP berhasil diverifikasi");
    } catch (error) {
      if (onError) onError(error.message);
    }
  },
};

export default OtpPresenter;
