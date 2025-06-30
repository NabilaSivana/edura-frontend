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
      const error = await response.json();
      throw new Error(error.message);
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
    const response = await fetch(`${CONFIG.BASE_URL}/verify-email?token=${token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

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
      localStorage.removeItem("token");
      window.location.hash = "#/login";
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

  //course teacher
  async getTeacherUnverifiedCourses() {
    const res = await fetch(`${CONFIG.BASE_URL}/teacher/courses/unverified`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.json();
  },
  async getTeacherVerifiedCourses() {
    const res = await fetch(`${CONFIG.BASE_URL}/teacher/courses/verified`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.json();
  },
  async getTeacherCourseDetail(courseId) {
    const res = await fetch(`${CONFIG.BASE_URL}/teacher/courses/${courseId}/detail`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.json();
  },

  async editTeacherCourse(courseId, payload) {
    const res = await fetch(`${CONFIG.BASE_URL}/teacher/courses/${courseId}/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async revertTeacherCourse(courseId) {
    const res = await fetch(`${CONFIG.BASE_URL}/teacher/courses/${courseId}/revert`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.json();
  },

  async editTeacherSession(courseId, sessionNumber, payload) {
    const res = await fetch(`${CONFIG.BASE_URL}/teacher/courses/${courseId}/sessions/${sessionNumber}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async deleteTeacherSession(courseId, sessionNumber) {
    const res = await fetch(`${CONFIG.BASE_URL}/teacher/courses/${courseId}/sessions/${sessionNumber}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.json();
  },

  async verifyTeacherCourse(courseId) {
    const res = await fetch(`${CONFIG.BASE_URL}/teacher/courses/${courseId}/verify`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.json();
  },

  async getAllstudent(page = 1, limit = 10, search = "") {
    const url = new URL(`${CONFIG.BASE_URL}/management/list-student`);
    url.searchParams.append("page", page);
    url.searchParams.append("limit", limit);
    if (search) url.searchParams.append("search", search);
    return fetch(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then(res => res.ok ? res.json() : Promise.reject("Gagal ambil data siswa"));
  },
  async getAllteacher(page = 1, limit = 10, search = "") {
    const url = new URL(`${CONFIG.BASE_URL}/management/list-teacher`);
    url.searchParams.append("page", page);
    url.searchParams.append("limit", limit);
    if (search) url.searchParams.append("search", search);
    return fetch(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then(res => res.ok ? res.json() : Promise.reject("Gagal ambil data guru"));
  },
  async getAlladmin(page = 1, limit = 10, search = "") {
    const url = new URL(`${CONFIG.BASE_URL}/management/list-admin`);
    url.searchParams.append("page", page);
    url.searchParams.append("limit", limit);
    if (search) url.searchParams.append("search", search);
    return fetch(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then(res => res.ok ? res.json() : Promise.reject("Gagal ambil data admin"));
  },
  async importUsers(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${CONFIG.BASE_URL}/management/import-users`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal mengimpor data pengguna");
    }

    return response.json();
  }
};

export default Api;
