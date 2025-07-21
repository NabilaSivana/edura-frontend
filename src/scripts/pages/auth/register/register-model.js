// src/scripts/pages/auth/register/register-model.js

import CONFIG from "../../../config.js";

const RegisterModel = {
  async register(fullName, email, password) {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
          // 'role' tidak lagi dikirim dari sini
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Melempar error dengan pesan yang TEPAT dari backend
        throw new Error(data.error || 'Registration failed');
      }

      return data;
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
      }
      // Meneruskan error dari backend atau network
      throw error;
    }
  },
};

export default RegisterModel;