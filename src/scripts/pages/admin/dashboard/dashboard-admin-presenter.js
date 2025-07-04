import Api from "../../../data/api.js";
import DashboardAdminModel from "./dashboard-admin-model.js";

const DashboardAdminPresenter = {
    state: {
        page: 1,
        limit: 10,
        search: "",
        selectedRole: "student", // default
    },

    async init() {
        const container = document.getElementById("admin-dashboard-container");
        if (!container) return;

        container.innerHTML = `<p>Memuat data pengguna...</p>`;

        try {
            const users = await this.fetchUsersByRole();

            container.innerHTML = `
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-semibold">Manajemen Pengguna</h2>
          <select id="role-selector" class="border p-2 rounded">
            <option value="student" ${this.state.selectedRole === "student" ? "selected" : ""}>Siswa</option>
            <option value="teacher" ${this.state.selectedRole === "teacher" ? "selected" : ""}>Guru</option>
            <option value="admin" ${this.state.selectedRole === "admin" ? "selected" : ""}>Admin</option>
          </select>
        </div>

        <input id="user-search" type="text" placeholder="Cari nama..." class="mb-4 p-2 border rounded w-full max-w-md" value="${this.state.search}" />

        ${this.renderUserSection(this.getRoleLabel(this.state.selectedRole), users.data)}

        <div class="flex justify-between items-center mb-8">
          <button id="prev-page" class="px-4 py-2 border rounded ${this.state.page === 1 ? "opacity-50 cursor-not-allowed" : ""}">← Sebelumnya</button>
          <p>Halaman ${this.state.page}</p>
          <button id="next-page" class="px-4 py-2 border rounded ${users.data.length < this.state.limit ? "opacity-50 cursor-not-allowed" : ""}">Berikutnya →</button>
        </div>

        <div class="border-t pt-6">
          <h3 class="text-lg font-semibold mb-2">Import Pengguna via CSV</h3>
          <input type="file" id="csv-import" accept=".csv" class="mb-2" />
          <button class="bg-blue-600 text-white px-4 py-2 rounded" id="import-btn">Import</button>
          <p id="import-status" class="text-sm mt-2"></p>
        </div>
      `;

            // Event handler
            document.getElementById("prev-page")?.addEventListener("click", () => {
                if (this.state.page > 1) {
                    this.state.page--;
                    this.init();
                }
            });

            document.getElementById("next-page")?.addEventListener("click", () => {
                if (users.data.length >= this.state.limit) {
                    this.state.page++;
                    this.init();
                }
            });

            document.getElementById("user-search")?.addEventListener("input", (e) => {
                this.state.search = e.target.value;
                this.state.page = 1;
                this.init();
            });

            document.getElementById("role-selector")?.addEventListener("change", (e) => {
                this.state.selectedRole = e.target.value;
                this.state.page = 1;
                this.state.search = "";
                this.init();
            });

            document.getElementById("import-btn")?.addEventListener("click", async () => {
                const fileInput = document.getElementById("csv-import");
                const status = document.getElementById("import-status");

                if (!fileInput.files.length) {
                    status.textContent = "Silakan pilih file CSV.";
                    return;
                }

                try {
                    const result = await Api.importUsers(fileInput.files[0]);
                    status.textContent = `Import berhasil: ${result.imported} pengguna.`;
                    await this.init();
                } catch (err) {
                    status.textContent = `Gagal import: ${err.message}`;
                }
            });
        } catch (error) {
            console.error(error);
            container.innerHTML = `<p class="text-red-500">Gagal memuat data pengguna.</p>`;
        }
    },

    async fetchUsersByRole() {
        const { selectedRole, page, limit, search } = this.state;
        if (selectedRole === "student") return await DashboardAdminModel.getAllstudent({ page, limit, search });
        if (selectedRole === "teacher") return await DashboardAdminModel.getAllteacher({ page, limit, search });
        if (selectedRole === "admin") return await DashboardAdminModel.getAlladmin({ page, limit, search });
        return { data: [] };
    },

    getRoleLabel(role) {
        if (role === "student") return "Siswa";
        if (role === "teacher") return "Guru";
        if (role === "admin") return "Admin";
        return "Pengguna";
    },

    renderUserSection(title, users) {
        return `
      <div class="bg-white shadow p-4 rounded mb-4">
        <h3 class="text-lg font-bold mb-2">${title} (${users.length})</h3>
        <ul class="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          ${users.map(user => `
            <li class="border rounded px-3 py-2 text-sm flex justify-between items-center">
              <div>
                <div class="font-medium">${user.full_name}</div>
                <div class="text-gray-600 text-xs">${user.email}</div>
              </div>
              <span class="text-xs px-2 py-1 rounded ${user.is_verified ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}">
                ${user.is_verified ? "Terverifikasi" : "Belum"}
              </span>
            </li>
          `).join("")}
        </ul>
      </div>
    `;
    },
};

export default DashboardAdminPresenter;
