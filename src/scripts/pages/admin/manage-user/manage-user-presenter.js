import Api from "../../../data/api.js";
import ManageUserModel from "./manage-user-model.js";

let debounceTimer;

const ManageUserPresenter = {
  state: {
    page: 1,
    limit: 10,
    search: "",
    selectedRole: "student",
  },

  async init() {
    const container = document.getElementById("manage-user-container");
    if (!container) return;

    container.innerHTML = this.renderSkeleton();

    try {
      const users = await this.fetchUsersByRole();

      container.innerHTML = `
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 mt-16">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Manajemen Pengguna</h2>
          <select id="role-selector" class="border p-2 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white">
            <option value="student" ${
              this.state.selectedRole === "student" ? "selected" : ""
            }>Siswa</option>
            <option value="teacher" ${
              this.state.selectedRole === "teacher" ? "selected" : ""
            }>Guru</option>
            <option value="admin" ${
              this.state.selectedRole === "admin" ? "selected" : ""
            }>Admin</option>
          </select>
        </div>

        <input
          id="user-search"
          type="text"
          placeholder="Cari nama pengguna..."
          class="mb-6 p-3 border rounded w-full max-w-xl dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          value="${this.state.search}"
        />

        ${this.renderUserSection(
          this.getRoleLabel(this.state.selectedRole),
          users.data
        )}

        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 mb-8">
          <button id="prev-page" class="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            this.state.page === 1 ? "opacity-50 cursor-not-allowed" : ""
          }">← Sebelumnya</button>
          <p class="text-sm text-gray-700 dark:text-gray-300">Halaman ${
            this.state.page
          }</p>
          <button id="next-page" class="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            users.data.length < this.state.limit
              ? "opacity-50 cursor-not-allowed"
              : ""
          }">Berikutnya →</button>
        </div>

        <div class="border-t pt-6 mt-8">
          <h3 class="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Import Pengguna via CSV</h3>
          <input type="file" id="csv-import" accept=".csv" class="mb-3 dark:text-white" />
          <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" id="import-btn">Import</button>
          <p id="import-status" class="text-sm mt-2 text-gray-600 dark:text-gray-300"></p>
        </div>
      `;

      // Event Handlers
      document
        .getElementById("role-selector")
        ?.addEventListener("change", (e) => {
          this.state.selectedRole = e.target.value;
          this.state.page = 1;
          this.state.search = "";
          this.init();
        });

      document.getElementById("prev-page")?.addEventListener("click", () => {
        if (this.state.page > 1) {
          this.state.page--;
          this.init();
        }
      });

      document.getElementById("next-page")?.addEventListener("click", () => {
        this.state.page++;
        this.init();
      });

      document.getElementById("user-search")?.addEventListener("input", (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.state.search = e.target.value;
          this.state.page = 1;
          this.init();
        }, 300); // debounce delay
      });

      document
        .getElementById("import-btn")
        ?.addEventListener("click", async () => {
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
      container.innerHTML = `<p class="text-red-600 dark:text-red-400">Gagal memuat data pengguna.</p>`;
    }
  },

  renderSkeleton() {
    return `
      <div class="space-y-4">
        ${Array.from({ length: 6 })
          .map(
            () => `
          <div class="bg-gray-200 dark:bg-gray-700 rounded h-16 animate-pulse"></div>
        `
          )
          .join("")}
      </div>
    `;
  },

  async fetchUsersByRole() {
    const { selectedRole, page, limit, search } = this.state;
    if (selectedRole === "student")
      return await ManageUserModel.getAllstudent({ page, limit, search });
    if (selectedRole === "teacher")
      return await ManageUserModel.getAllteacher({ page, limit, search });
    if (selectedRole === "admin")
      return await ManageUserModel.getAlladmin({ page, limit, search });
    return { data: [] };
  },

  getRoleLabel(role) {
    return (
      {
        student: "Siswa",
        teacher: "Guru",
        admin: "Admin",
      }[role] || "Pengguna"
    );
  },

  renderUserSection(title, users) {
    if (!users.length) {
      return `<p class="text-gray-500 dark:text-gray-400 italic">Tidak ada pengguna ditemukan.</p>`;
    }

    return `
      <div>
        <h3 class="text-lg font-semibold mb-3 text-gray-800 dark:text-white">${title} (${
      users.length
    })</h3>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          ${users
            .map(
              (user) => `
            <div class="p-4 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 transition-shadow hover:shadow">
              <div class="font-medium text-gray-800 dark:text-white text-sm">${
                user.full_name
              }</div>
              <div class="text-xs text-gray-600 dark:text-gray-400 mb-2">${
                user.email
              }</div>
              <span class="text-xs font-semibold px-2 py-1 rounded ${
                user.is_verified
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              }">
                ${user.is_verified ? "Terverifikasi" : "Belum"}
              </span>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  },
};

export default ManageUserPresenter;
