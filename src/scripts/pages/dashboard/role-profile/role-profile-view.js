import Api from "../../../data/api.js";

const RoleProfileView = {
  async init(role) {
    // 🔥 VALIDASI: HANYA TAMPILKAN UNTUK STUDENT
    if (role !== "student") {
      console.error(`❌ Role profile modal should not be shown for ${role} - teacher profiles are auto-created`);
      return;
    }

    console.log(`📋 Initializing role profile modal for ${role}`);
    
    document.body.style.overflow = "hidden";

    const modal = document.createElement("div");
    modal.id = "role-profile-modal";
    modal.className =
      "fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center p-4";

    const fieldsHTML = await this.getFormHTML(role);

    modal.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div class="mb-6">
          <h2 class="text-xl font-bold dark:text-white mb-2">Lengkapi Profil Mahasiswa</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">Silakan lengkapi data profil mahasiswa Anda untuk melanjutkan menggunakan aplikasi.</p>
        </div>
        
        <form id="role-profile-form" class="space-y-4">
          ${fieldsHTML}
        </form>
        
        <!-- Error message with better spacing -->
        <div id="role-profile-error" class="hidden mt-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-2 text-red-600 dark:text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            <span class="text-sm text-red-600 dark:text-red-400" id="role-profile-error-text">Mohon lengkapi semua data!</span>
          </div>
        </div>
        
        <!-- Submit button with better spacing -->
        <div class="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button type="submit" form="role-profile-form"
            class="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-800 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
            <span id="submit-text">Simpan Profil Mahasiswa</span>
            <div id="submit-loading" class="hidden">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Menyimpan...
            </div>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // 🔥 SETUP CLASS CODE CHECKER HANYA UNTUK STUDENT
    if (role === "student") {
      setTimeout(() => this.setupClassCodeChecker(), 0);
    }
  },

  async getFormHTML(role) {
    // 🔥 HANYA GENERATE FORM UNTUK STUDENT
    if (role !== "student") {
      console.error(`❌ Form HTML should not be generated for ${role}`);
      return `<p class="text-red-600">Error: Teacher profiles are auto-created during approval process.</p>`;
    }

    const { program_studi, perguruan_tinggi } = await Api.getEnums();

    const selectOptions = (items) =>
      items.map((val) => `<option value="${val}">${val}</option>`).join("");

    const inputClasses = "mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200";
    const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
    const errorClasses = "text-sm text-red-600 dark:text-red-400 mt-1 hidden flex items-center";

    // 🔥 STUDENT FIELDS ONLY
    const studentFields = `
      <div class="space-y-1">
        <label for="nim" class="${labelClasses}">NIM</label>
        <input type="text" id="nim" name="nim" class="${inputClasses}" required placeholder="Masukkan NIM Anda">
        <p class="${errorClasses}" id="nim-error">
          <svg class="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          <span></span>
        </p>
      </div>

      <div class="space-y-1">
        <label for="full_name" class="${labelClasses}">Nama Lengkap</label>
        <input type="text" id="full_name" name="full_name" class="${inputClasses}" required placeholder="Masukkan nama lengkap Anda">
      </div>

      <div class="space-y-1">
        <label for="jurusan" class="${labelClasses}">Jurusan</label>
        <input type="text" id="jurusan" name="jurusan" class="${inputClasses}" required placeholder="Masukkan jurusan Anda">
      </div>

      <div class="space-y-1">
        <label for="class_code" class="${labelClasses}">Kode Kelas <span class="text-gray-500 text-xs">(opsional)</span></label>
        <div class="flex gap-2 mt-1">
          <input type="text" id="class_code" name="class_code" placeholder="Masukkan kode yang sudah disediakan"
            class="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200" />
          <button type="button" id="check-class-code"
            class="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200 font-medium whitespace-nowrap">
            Cek
          </button>
        </div>
        <p class="text-sm text-green-700 dark:text-green-400 mt-1 hidden flex items-center" id="class-code-info">
          <svg class="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <span></span>
        </p>
        <p class="${errorClasses}" id="class-code-error">
          <svg class="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          <span>Kode kelas tidak valid.</span>
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1">
          <label for="program_studi" class="${labelClasses}">Program Studi <span class="text-gray-500 text-xs">(jika mandiri)</span></label>
          <select id="program_studi" name="program_studi" class="${inputClasses}">
            <option value="">-- Pilih Program Studi --</option>
            ${selectOptions(program_studi)}
          </select>
        </div>
        <div class="space-y-1">
          <label for="perguruan_tinggi" class="${labelClasses}">Perguruan Tinggi <span class="text-gray-500 text-xs">(jika mandiri)</span></label>
          <select id="perguruan_tinggi" name="perguruan_tinggi" class="${inputClasses}">
            <option value="">-- Pilih Perguruan Tinggi --</option>
            ${selectOptions(perguruan_tinggi)}
          </select>
        </div>
      </div>`;

    return studentFields;
  },

  setupClassCodeChecker() {
    const btn = document.getElementById("check-class-code");
    const input = document.getElementById("class_code");
    const errMsg = document.getElementById("class-code-error");
    const successMsg = document.getElementById("class-code-info");

    if (!btn || !input) return;

    // Reset pesan saat input diubah
    input.addEventListener("input", () => {
      errMsg.classList.add("hidden");
      successMsg.classList.add("hidden");

      const programStudiEl = document.getElementById("program_studi");
      const perguruanTinggiEl = document.getElementById("perguruan_tinggi");

      if (programStudiEl && perguruanTinggiEl) {
        programStudiEl.disabled = false;
        perguruanTinggiEl.disabled = false;
        programStudiEl.classList.remove("opacity-50", "cursor-not-allowed");
        perguruanTinggiEl.classList.remove("opacity-50", "cursor-not-allowed");
      }
    });

    btn.addEventListener("click", async () => {
      const code = input?.value.trim();
      if (!code) {
        const errorSpan = errMsg.querySelector("span");
        if (errorSpan) errorSpan.textContent = "Silakan masukkan kode kelas.";
        errMsg.classList.remove("hidden");
        return;
      }

      // Show loading state
      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Mengecek...";

      try {
        const res = await Api.checkClassCode(code);

        const programStudiEl = document.getElementById("program_studi");
        const perguruanTinggiEl = document.getElementById("perguruan_tinggi");

        if (programStudiEl && perguruanTinggiEl) {
          programStudiEl.value = res.program_studi;
          perguruanTinggiEl.value = res.perguruan_tinggi;

          programStudiEl.disabled = true;
          perguruanTinggiEl.disabled = true;
          programStudiEl.classList.add("opacity-50", "cursor-not-allowed");
          perguruanTinggiEl.classList.add("opacity-50", "cursor-not-allowed");
        }

        const successSpan = successMsg.querySelector("span");
        if (successSpan) successSpan.textContent = "Kode kelas valid dan data telah diisi otomatis.";
        successMsg.classList.remove("hidden");
        errMsg.classList.add("hidden");
      } catch (err) {
        const errorSpan = errMsg.querySelector("span");
        if (errorSpan) errorSpan.textContent = "Kode kelas tidak valid atau tidak ditemukan.";
        errMsg.classList.remove("hidden");
        successMsg.classList.add("hidden");

        const programStudiEl = document.getElementById("program_studi");
        const perguruanTinggiEl = document.getElementById("perguruan_tinggi");

        if (programStudiEl && perguruanTinggiEl) {
          programStudiEl.value = "";
          perguruanTinggiEl.value = "";
          programStudiEl.disabled = false;
          perguruanTinggiEl.disabled = false;
          programStudiEl.classList.remove("opacity-50", "cursor-not-allowed");
          perguruanTinggiEl.classList.remove("opacity-50", "cursor-not-allowed");
        }
      } finally {
        btn.disabled = false;
        btn.textContent = originalText;
      }
    });
  },

  getFormData(role) {
    const form = document.getElementById("role-profile-form");
    const data = {};

    // 🔥 HANYA HANDLE STUDENT DATA
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
    } else {
      // 🔥 TEACHER DATA TIDAK SEHARUSNYA SAMPAI KE SINI
      console.error(`❌ getFormData called for ${role} - teacher profiles are auto-created`);
      return null;
    }

    return data;
  },

  setLoading(isLoading) {
    const submitBtn = document.querySelector("button[type='submit']");
    const submitText = document.getElementById("submit-text");
    const submitLoading = document.getElementById("submit-loading");

    if (isLoading) {
      submitBtn.disabled = true;
      submitText.classList.add("hidden");
      submitLoading.classList.remove("hidden");
    } else {
      submitBtn.disabled = false;
      submitText.classList.remove("hidden");
      submitLoading.classList.add("hidden");
    }
  },

  showError(message = "Terjadi kesalahan. Mohon lengkapi semua data dengan benar.") {
    const el = document.getElementById("role-profile-error");
    const textEl = document.getElementById("role-profile-error-text");
    if (el && textEl) {
      textEl.textContent = message;
      el.classList.remove("hidden");
    }
  },

  showFieldError(field, message) {
    const el = document.getElementById(`${field}-error`);
    if (el) {
      const span = el.querySelector("span");
      if (span) {
        span.textContent = message;
      } else {
        el.textContent = message;
      }
      el.classList.remove("hidden");

      // Add red border to the field
      const fieldEl = document.getElementById(field);
      if (fieldEl) {
        fieldEl.classList.add("border-red-500", "dark:border-red-400");
        fieldEl.classList.remove("border-gray-300", "dark:border-gray-600");
      }
    }
  },

  clearFieldErrors() {
    const errorEls = document.querySelectorAll("p[id$='-error']");
    errorEls.forEach((el) => {
      el.classList.add("hidden");
      const span = el.querySelector("span");
      if (span) {
        span.textContent = "";
      }
    });

    // Remove red borders from all inputs
    const inputEls = document.querySelectorAll("input, select");
    inputEls.forEach((el) => {
      el.classList.remove("border-red-500", "dark:border-red-400");
      el.classList.add("border-gray-300", "dark:border-gray-600");
    });

    // Hide general error
    const generalError = document.getElementById("role-profile-error");
    if (generalError) generalError.classList.add("hidden");
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