// otp-model.js
import Api from "../../../data/api.js";

const OtpModel = {
  async verifyOtp(email, otp) {
    try {
      const response = await Api.verifyOtp({ email, otp });
      
      if (!response.ok) {
        // Throw error with backend message for non-200 responses
        throw new Error(response.data.error || 'Verification failed');
      }
      
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  
  async resendOtp(email) {
    try {
      const response = await Api.resendOtp({ email });
      
      if (!response.ok) {
        // Throw error with backend message for non-200 responses
        throw new Error(response.data.error || 'Failed to resend OTP');
      }
      
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

export default OtpModel;