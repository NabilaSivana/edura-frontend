import CONFIG from "../config.js";

const Api = {
  async login({ email, password }) {
    const response = await fetch(`${CONFIG.BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal login");
    }

    return response.json();
  },

  async register({ full_name, email, password, role }) {
    const response = await fetch(`${CONFIG.BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ full_name, email, password, role }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal register");
    }

    return response.json();
  },

  async forgotPassword(email) {
    const response = await fetch(`${CONFIG.BASE_URL}/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Gagal mengirim email reset");
    }

    return response.json();
  },

  async resetPassword({ token, newPassword }) {
    const response = await fetch(`${CONFIG.BASE_URL}/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, password: newPassword }),
    });

    if (!response.ok) {
      throw new Error("Gagal reset password");
    }

    return response.json();
  },

  async sendMagicLink(email) {
    const response = await fetch(`${CONFIG.BASE_URL}/send-magic-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Gagal mengirim magic link");
    }

    return response.json();
  },

  async verifyEmail(token) {
    const response = await fetch(
      `${CONFIG.BASE_URL}/verify-email?token=${token}`
    );

    if (!response.ok) {
      throw new Error("Verifikasi email gagal");
    }

    return response.json();
  },

  async verifyOtp({ email, otp }) {
    const response = await fetch(`${CONFIG.BASE_URL}/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    if (!response.ok) {
      throw new Error("OTP tidak valid");
    }

    return response.json();
  },
  async getStudentCourses() {
    const response = await fetch(`${CONFIG.BASE_URL}/student/courses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Gagal mengambil data kursus");
    }

    return response.json();
  },
};

export default Api;
