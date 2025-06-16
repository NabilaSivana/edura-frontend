import Api from "../../data/api";

const OtpModel = {
  async verifyOtp(email, otp) {
    try {
      const response = await Api.verifyOtp({ email, otp });

      // Misal token dikirim di response setelah verifikasi OTP
      if (response.token) {
        localStorage.setItem("authToken", response.token);
      }

      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

export default OtpModel;
