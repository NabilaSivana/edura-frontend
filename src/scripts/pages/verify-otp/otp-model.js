import Api from "../../data/api.js";

const OtpModel = {
  async verifyOtp(email, otp) {
    try {
      const response = await Api.verifyOtp({ email, otp });
      return response; // <- tambahkan ini
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

export default OtpModel;
