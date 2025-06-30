import ProfileModel from "./profile-model.js";

const ProfilePresenter = {
    async init() {
        try {
            const userProfile = await ProfileModel.getUserProfile();
            this.renderBasic(userProfile);

            // ⛔ Jangan panggil getRoleProfile kalau admin
            if (userProfile.role === "admin") {
                this.renderNoRoleProfile(); // Tambahkan pesan untuk admin
                return;
            }

            const roleProfile = await ProfileModel.getRoleProfile(userProfile.role);
            if (roleProfile) {
                this.renderRoleProfile(userProfile.role, roleProfile);
            } else {
                this.renderMissingRoleProfile(userProfile.role);
            }
        } catch (error) {
            console.error("Error saat mengambil profil:", error);
            document.getElementById("profile-section").innerHTML = `
        <p class="text-red-600">Gagal memuat data profil. Coba lagi nanti.</p>
      `;
        }
    },

    renderBasic(profile) {
        document.getElementById("basic-profile").innerHTML = `
      <h2 class="text-xl font-bold mb-2">Profil Akun</h2>
      <p><strong>Nama:</strong> ${profile.full_name}</p>
      <p><strong>Email:</strong> ${profile.email}</p>
      <p><strong>Role:</strong> ${profile.role}</p>
      <p><strong>Verifikasi:</strong> ${profile.is_verified ? '✔ Terverifikasi' : '❌ Belum'}</p>
    `;
    },

    renderRoleProfile(role, data) {
        const container = document.getElementById("role-profile");
        container.innerHTML = `<h2 class="text-xl font-bold mb-2">Profil ${role === 'student' ? 'Mahasiswa' : 'Dosen'}</h2>`;

        const fields = Object.entries(data).filter(([key]) => key !== 'id' && key !== 'user_id');
        fields.forEach(([key, value]) => {
            const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            container.innerHTML += `<p><strong>${formattedKey}:</strong> ${value}</p>`;
        });
    },

    renderMissingRoleProfile(role) {
        const container = document.getElementById("role-profile");
        container.innerHTML = `
      <div class="bg-yellow-100 border border-yellow-300 text-yellow-800 p-4 rounded">
        <p>Profil ${role === 'student' ? 'mahasiswa' : 'dosen'} belum lengkap. Silakan lengkapi terlebih dahulu.</p>
      </div>
    `;
    },

    renderNoRoleProfile() {
        // Hanya tampilkan kotak kosong atau info khusus untuk admin
        document.getElementById("role-profile").innerHTML = `
      <div class="text-sm text-gray-500 italic">Tidak ada data profil lanjutan untuk akun admin.</div>
    `;
    }
};

export default ProfilePresenter;
