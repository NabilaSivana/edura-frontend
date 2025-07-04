import Api from "../../../data/api.js";

const RoleProfileView = {
    async init(role) {
        document.body.style.overflow = "hidden";

        const modal = document.createElement("div");
        modal.id = "role-profile-modal";
        modal.className =
            "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center";

        const fieldsHTML = await this.getFormHTML(role);

        modal.innerHTML = `
      <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">
        <h2 class="text-xl font-bold mb-4">Lengkapi Profil Anda</h2>
        <form id="role-profile-form" class="space-y-4">
          ${fieldsHTML}
        </form>
        <p class="text-sm text-red-600 mt-2 hidden" id="role-profile-error">Mohon lengkapi semua data!</p>
        <button type="submit" form="role-profile-form"
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Simpan Profil</button>
      </div>
    `;

        document.body.appendChild(modal);

        if (role === "student") {
            setTimeout(() => this.setupClassCodeChecker(), 0);
        }
    },

    async getFormHTML(role) {
        const { program_studi, perguruan_tinggi } = await Api.getEnums();

        const selectOptions = (items) =>
            items.map((val) => `<option value="${val}">${val}</option>`).join("");

        const studentFields = `
        <div>
          <label for="nim" class="block text-sm font-medium">NIM</label>
          <input type="text" id="nim" name="nim" class="mt-1 block w-full border rounded px-3 py-2" required>
        </div>
        <div>
          <label for="full_name" class="block text-sm font-medium">Nama Lengkap</label>
          <input type="text" id="full_name" name="full_name" class="mt-1 block w-full border rounded px-3 py-2" required>
        </div>
        <div>
          <label for="jurusan" class="block text-sm font-medium">Jurusan</label>
          <input type="text" id="jurusan" name="jurusan" class="mt-1 block w-full border rounded px-3 py-2" required>
        </div>
        <div>
          <label for="class_code" class="block text-sm font-medium">Kode Kelas (opsional)</label>
<div class="flex gap-2 mt-1">
  <input type="text" id="class_code" name="class_code" placeholder="Contoh: ABC123"
    class="flex-1 border rounded px-3 py-2" />
  <button type="button" id="check-class-code"
    class="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700">Cek</button>
</div>
<p class="text-sm text-green-700 mt-1 hidden" id="class-code-info"></p>
<p class="text-sm text-red-600 mt-1 hidden" id="class-code-error">Kode kelas tidak valid.</p>


          <p class="text-sm text-red-600 mt-1 hidden" id="class-code-error">Kode kelas tidak valid.</p>
        </div>
        <div>
          <label for="program_studi" class="block text-sm font-medium">Program Studi (jika mandiri)</label>
          <select id="program_studi" name="program_studi" class="mt-1 block w-full border rounded px-3 py-2">
            <option value="">-- Pilih --</option>
            ${selectOptions(program_studi)}
          </select>
        </div>
        <div>
          <label for="perguruan_tinggi" class="block text-sm font-medium">Perguruan Tinggi (jika mandiri)</label>
          <select id="perguruan_tinggi" name="perguruan_tinggi" class="mt-1 block w-full border rounded px-3 py-2">
            <option value="">-- Pilih --</option>
            ${selectOptions(perguruan_tinggi)}
          </select>
        </div>`;

        const teacherFields = `
        <div>
          <label for="nidn" class="block text-sm font-medium">NIDN</label>
          <input type="text" id="nidn" name="nidn" class="mt-1 block w-full border rounded px-3 py-2" required>
        </div>
        <div>
          <label for="full_name" class="block text-sm font-medium">Nama Lengkap</label>
          <input type="text" id="full_name" name="full_name" class="mt-1 block w-full border rounded px-3 py-2" required>
        </div>
        <div>
          <label for="fakultas" class="block text-sm font-medium">Fakultas</label>
          <input type="text" id="fakultas" name="fakultas" class="mt-1 block w-full border rounded px-3 py-2" required>
        </div>
        <div>
          <label for="program_studi" class="block text-sm font-medium">Program Studi</label>
          <select id="program_studi" name="program_studi" class="mt-1 block w-full border rounded px-3 py-2" required>
            <option value="">-- Pilih --</option>
            ${selectOptions(program_studi)}
          </select>
        </div>
        <div>
          <label for="perguruan_tinggi" class="block text-sm font-medium">Perguruan Tinggi</label>
          <select id="perguruan_tinggi" name="perguruan_tinggi" class="mt-1 block w-full border rounded px-3 py-2" required>
            <option value="">-- Pilih --</option>
            ${selectOptions(perguruan_tinggi)}
          </select>
        </div>`;

        return role === "student" ? studentFields : teacherFields;
    },

    setupClassCodeChecker() {
        const btn = document.getElementById("check-class-code");
        const input = document.getElementById("class_code");
        const errMsg = document.getElementById("class-code-error");
        const successMsg = document.getElementById("class-code-info");

        if (!btn || !input) return;

        // 🔄 Reset pesan saat input diubah
        input.addEventListener("input", () => {
            errMsg.classList.add("hidden");
            successMsg.classList.add("hidden");

            document.getElementById("program_studi").disabled = false;
            document.getElementById("perguruan_tinggi").disabled = false;
        });

        btn.addEventListener("click", async () => {
            const code = input?.value.trim();
            if (!code) {
                errMsg.textContent = "Silakan masukkan kode kelas.";
                errMsg.classList.remove("hidden");
                return;
            }

            try {
                const res = await Api.checkClassCode(code);

                document.getElementById("program_studi").value = res.program_studi;
                document.getElementById("perguruan_tinggi").value = res.perguruan_tinggi;

                document.getElementById("program_studi").disabled = true;
                document.getElementById("perguruan_tinggi").disabled = true;

                successMsg.textContent = "✅ Kode kelas valid.";
                successMsg.classList.remove("hidden");
                errMsg.classList.add("hidden");
            } catch (err) {
                errMsg.textContent = "Kode kelas tidak valid atau tidak ditemukan.";
                errMsg.classList.remove("hidden");
                successMsg.classList.add("hidden");

                document.getElementById("program_studi").value = "";
                document.getElementById("perguruan_tinggi").value = "";
                document.getElementById("program_studi").disabled = false;
                document.getElementById("perguruan_tinggi").disabled = false;
            }
        });
    },
    getFormData(role) {
        const form = document.getElementById("role-profile-form");
        const data = {};

        if (role === "student") {
            const nim = form.nim?.value.trim();
            const full_name = form.full_name?.value.trim();
            const jurusan = form.jurusan?.value.trim();
            const class_code = form.class_code?.value.trim();

            if (!nim || !full_name || !jurusan) return null;

            data.nim = nim;
            data.full_name = full_name;
            data.jurusan = jurusan;

            if (class_code) {
                data.class_code = class_code;
            } else {
                const program_studi = form.program_studi?.value;
                const perguruan_tinggi = form.perguruan_tinggi?.value;

                if (!program_studi || !perguruan_tinggi) return null;

                data.program_studi = program_studi;
                data.perguruan_tinggi = perguruan_tinggi;
            }
        } else if (role === "teacher") {
            const nidn = form.nidn?.value.trim();
            const full_name = form.full_name?.value.trim();
            const fakultas = form.fakultas?.value.trim();
            const program_studi = form.program_studi?.value;
            const perguruan_tinggi = form.perguruan_tinggi?.value;

            if (!nidn || !full_name || !fakultas || !program_studi || !perguruan_tinggi)
                return null;

            data.nidn = nidn;
            data.full_name = full_name;
            data.fakultas = fakultas;
            data.program_studi = program_studi;
            data.perguruan_tinggi = perguruan_tinggi;
        }

        return data;
    },

    showError() {
        document.getElementById("role-profile-error")?.classList.remove("hidden");
    },

    closeModal() {
        const modal = document.getElementById("role-profile-modal");
        if (modal) {
            modal.remove();
            document.body.style.overflow = "";
        }
    },
};

export default RoleProfileView;
