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

  async postResetPassword(payload) {
    const response = await fetch(`${CONFIG.BASE_URL}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
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
    return Array.isArray(data) ? data : [];
  },

  async getStudentProfile() {
    const response = await fetch(`${CONFIG.BASE_URL}/student/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.status === 404) {
      throw new Error("Gagal mengambil profil siswa"); //ganti dengan muncul modal form untuk isi data profil student
    }

    return response.json();
  }
  ,
  async getTeacherProfile() {
    const response = await fetch(`${CONFIG.BASE_URL}/teacher/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.status === 404) {
      throw new Error("Gagal mengambil profil guru"); //ganti dengan muncul modal form untuk isi data profil teacher
    }

    return response.json();
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


};

export default Api;
