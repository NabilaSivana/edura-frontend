// role-profile/role-profile-view.js

const RoleProfileView = {
    init() {
        // Cegah scroll latar belakang saat modal muncul
        document.body.style.overflow = "hidden";

        const modal = document.createElement("div");
        modal.id = "role-profile-modal";
        modal.className = "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center";

        modal.innerHTML = `
      <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">
        <h2 class="text-xl font-bold mb-4">Lengkapi Profil Anda</h2>
        <form id="role-profile-form" class="space-y-4">
          <!-- Input fields diisi dinamis oleh presenter -->
        </form>
        <p class="text-sm text-red-600 mt-2 hidden" id="role-profile-error">Mohon lengkapi semua data!</p>
        <button type="submit" form="role-profile-form"
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Simpan Profil</button>
      </div>
    `;

        document.body.appendChild(modal);
    },

    renderFormFields(role) {
        const form = document.getElementById("role-profile-form");

        const fields = {
            student: [
                { id: "nim", label: "NIM" },
                { id: "full_name", label: "Nama Lengkap" },
                { id: "kelas", label: "Kelas" },
                { id: "jurusan", label: "Jurusan" },
                { id: "program_studi", label: "Program Studi" },
                { id: "perguruan_tinggi", label: "Perguruan Tinggi" },
            ],
            teacher: [
                { id: "nidn", label: "NIDN" },
                { id: "full_name", label: "Nama Lengkap" },
                { id: "fakultas", label: "Fakultas" },
                { id: "program_studi", label: "Program Studi" },
                { id: "perguruan_tinggi", label: "Perguruan Tinggi" },
            ],
        };

        form.innerHTML = fields[role]
            .map(
                (field) => `
      <div>
        <label for="${field.id}" class="block text-sm font-medium">${field.label}</label>
        <input type="text" id="${field.id}" name="${field.id}"
          class="mt-1 block w-full border rounded px-3 py-2" required>
      </div>`
            )
            .join("");
    },

    getFormData(role) {
        const form = document.getElementById("role-profile-form");
        const data = {};
        const requiredFields = role === "student"
            ? ["nim", "full_name", "kelas", "jurusan", "program_studi", "perguruan_tinggi"]
            : ["nidn", "full_name", "fakultas", "program_studi", "perguruan_tinggi"];

        for (const field of requiredFields) {
            const input = form[field];
            if (!input.value.trim()) {
                return null; // field kosong
            }
            data[field] = input.value.trim();
        }

        return data;
    },

    showError() {
        document.getElementById("role-profile-error").classList.remove("hidden");
    },

    closeModal() {
        const modal = document.getElementById("role-profile-modal");
        if (modal) modal.remove();
        document.body.style.overflow = ""; // restore scroll
    },
};


export default RoleProfileView;
