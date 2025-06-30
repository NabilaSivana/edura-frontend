// File: src/scripts/data/api.js
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
      throw new Error(errorData.message || "Email atau password salah");
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

  async postVerifyEmail({ token }) {
    const response = await fetch(
      `${CONFIG.BASE_URL}/verify-email?token=${token}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Verification failed.");
    }

    return response.json();
  },

  async postResetPassword({ token, new_password }) {
    const response = await fetch(`${CONFIG.BASE_URL}/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, new_password }),
    });

    if (!response.ok) {
      throw new Error("Reset password failed.");
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
  async resendOtp({ email }) {
    const response = await fetch(`${CONFIG.BASE_URL}/resend-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Gagal mengirim ulang OTP");
    }

    return response.json();
  },

  async getProfile() {
    const response = await fetch(`${CONFIG.BASE_URL}/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Profil tidak ditemukan");
      }
      throw new Error("Gagal mengambil profil");
    }

    const result = await response.json();
    return result.profile; // ambil hanya object profile saja
  },

  async getStudentCourses() {
    const response = await fetch(`${CONFIG.BASE_URL}/student/courses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return []; // Jika belum punya kursus
      }
      throw new Error("Gagal mengambil data kursus");
    }

    const data = await response.json();

    // Pastikan data dalam bentuk array
    const courses = Array.isArray(data) ? data : [];

    // Tambahkan field is_verified dan verified_by jika perlu
    const enrichedCourses = courses.map((course) => {
      const isVerified = course.is_verified === true;
      return {
        ...course,
        is_verified: isVerified,
        verified_by: isVerified ? course.verified_by : null,
      };
    });

    return enrichedCourses;
  },
  async getStudentProfile() {
    const response = await fetch(`${CONFIG.BASE_URL}/student/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  },
  async getTeacherProfile() {
    const response = await fetch(`${CONFIG.BASE_URL}/teacher/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  },
  async createStudentProfile(data) {
    const response = await fetch(`${CONFIG.BASE_URL}/student/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Gagal menyimpan profil siswa");
    return response.json();
  },

  async createTeacherProfile(data) {
    const response = await fetch(`${CONFIG.BASE_URL}/teacher/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Gagal menyimpan profil guru");
    return response.json();
  },
  async createCourse({ subject, level }) {
    const response = await fetch(`${CONFIG.BASE_URL}/student/course/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ subject, level }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal membuat kursus");
    }

    return await response.json();
  },
  async updateProfile(data) {
    const response = await fetch(`${CONFIG.BASE_URL}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal memperbarui profil");
    }

    return await response.json();
  },

  async updateStudentProfile(data) {
    const response = await fetch(`${CONFIG.BASE_URL}/student/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Gagal memperbarui profil mahasiswa"
      );
    }

    return await response.json();
  },
};

export default Api;
