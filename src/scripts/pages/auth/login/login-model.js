import CONFIG from "../../../config";
const LoginModel = {
  async login(email, password) {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Throw error with the exact message from backend
        throw new Error(data.error || 'Login failed');
      }

      return data;
    } catch (error) {
      // If it's a network error or other unexpected error
      if (error.message === 'Failed to fetch') {
        throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
      }
      
      // Pass through the error message from backend
      throw error;
    }
  },
};

export default LoginModel;