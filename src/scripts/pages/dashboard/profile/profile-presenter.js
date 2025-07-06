import Api from "../../../data/api.js";
import ProfileModel from "./profile-model.js";

const ProfilePresenter = {
  async init() {
    try {
      const userProfile = await ProfileModel.getUserProfile();
      this.renderBasic(userProfile);

      if (userProfile.role === "admin") {
        this.renderNoRoleProfile();
        return;
      }

      const roleProfile = await ProfileModel.getRoleProfile(userProfile.role);
      if (roleProfile) {
        this.renderRoleProfile(userProfile.role, roleProfile);
      } else {
        this.renderMissingRoleProfile(userProfile.role);
      }

      this.setupEditForms(userProfile, roleProfile);
    } catch (error) {
      console.error("Error saat mengambil profil:", error);
      document.getElementById("profile-section").innerHTML = `
        <p class="text-red-600 dark:text-red-400">Gagal memuat data profil. Coba lagi nanti.</p>
      `;
    }
  },

  renderBasic(profile) {
    document.getElementById("basic-profile").innerHTML = `
      <h2 class="text-xl font-bold mb-2 dark:text-white">Profil Akun</h2>
      <p class="text-gray-700 dark:text-gray-200"><strong>Nama:</strong> ${
        profile.full_name
      }</p>
      <p class="text-gray-700 dark:text-gray-200"><strong>Email:</strong> ${
        profile.email
      }</p>
      <p class="text-gray-700 dark:text-gray-200"><strong>Role:</strong> ${
        profile.role
      }</p>
      <p class="text-gray-700 dark:text-gray-200"><strong>Verifikasi:</strong> ${
        profile.is_verified ? "✔ Terverifikasi" : "❌ Belum"
      }</p>
    `;
  },

  renderRoleProfile(role, data) {
    const container = document.getElementById("role-profile");
    container.innerHTML = `
      <h2 class="text-xl font-bold mb-2 dark:text-white">Profil ${
        role === "student" ? "Mahasiswa" : "Dosen"
      }</h2>
    `;

    const fields = Object.entries(data).filter(
      ([key]) => key !== "id" && key !== "user_id"
    );

    fields.forEach(([key, value]) => {
      const formattedKey = key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

      container.innerHTML += `
        <p class="text-gray-700 dark:text-gray-200"><strong>${formattedKey}:</strong> ${value}</p>
      `;
    });
  },

  renderMissingRoleProfile(role) {
    const container = document.getElementById("role-profile");
    container.innerHTML = `
      <div class="bg-yellow-100 dark:bg-yellow-200 border border-yellow-300 text-yellow-800 dark:text-yellow-900 p-4 rounded">
        <p>Profil ${
          role === "student" ? "mahasiswa" : "dosen"
        } belum lengkap. Silakan lengkapi terlebih dahulu.</p>
      </div>
    `;
  },

  renderNoRoleProfile() {
    document.getElementById("role-profile").innerHTML = `
      <div class="text-sm text-gray-500 dark:text-gray-400 italic">
        Tidak ada data profil lanjutan untuk akun admin.
      </div>
    `;
  },

  setupEditForms(userProfile, roleProfile) {
    const accountForm = document.getElementById("form-edit-account");
    if (accountForm) {
      accountForm.full_name.value = userProfile.full_name;
      accountForm.email.value = userProfile.email;

      accountForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const payload = {
          full_name: accountForm.full_name.value,
          email: accountForm.email.value,
          old_password: accountForm.old_password.value,
          new_password: accountForm.new_password.value,
        };

        try {
          await Api.updateProfile(payload);
          alert("Berhasil memperbarui akun.");
          document
            .getElementById("edit-account-overlay")
            .classList.add("hidden");
          this.init();
        } catch (err) {
          alert("Gagal memperbarui akun: " + err.message);
        }
      });
    }

    const roleForm = document.getElementById("form-edit-role");
    if (roleForm && roleProfile) {
      Object.entries(roleProfile).forEach(([key, value]) => {
        const input = roleForm.querySelector(`[name="${key}"]`);
        if (input) input.value = value;
      });

      roleForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const payload = {
          full_name: roleForm.full_name.value,
          jurusan: roleForm.jurusan.value,
          program_studi: roleForm.program_studi.value,
          perguruan_tinggi: roleForm.perguruan_tinggi.value,
        };

        try {
          await Api.updateStudentProfile(payload);
          alert("Berhasil memperbarui profil mahasiswa.");
          document.getElementById("edit-role-overlay").classList.add("hidden");
          this.init();
        } catch (err) {
          alert("Gagal memperbarui profil: " + err.message);
        }
      });
    }
  },
};

export default ProfilePresenter;
