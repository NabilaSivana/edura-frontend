import CONFIG from "../../config.js";

const ProfileModel = {
  async getUserProfile() {
    const response = await fetch(`${CONFIG.BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) throw new Error("Gagal mengambil profil user");
    const result = await response.json();
    return result.profile;
  },

  async getRoleProfile(role) {
    const response = await fetch(`${CONFIG.BASE_URL}/${role}/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error("Gagal mengambil profil lanjutan");
    }
    return await response.json();
  }
};

export default ProfileModel;
