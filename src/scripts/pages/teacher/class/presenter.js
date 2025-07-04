// File: routes/class/presenter.js
import TeacherClassModel from "./model.js";

const TeacherClassPresenter = {
    async init() {
        this.loadClasses();
        this.handleCreateForm();
    },

    async loadClasses() {
        const loading = document.getElementById("class-loading");
        const list = document.getElementById("class-list");
        loading.style.display = "block";
        list.innerHTML = "";

        try {
            const classes = await TeacherClassModel.getClasses();
            if (!classes.length) {
                list.innerHTML = `<p class="text-gray-500">Belum ada kelas.</p>`;
                return;
            }

            for (const cls of classes) {
                const students = await TeacherClassModel.getClassStudents(cls.id);
                const card = this.createClassCard(cls, students);
                list.appendChild(card);
            }
        } catch (err) {
            list.innerHTML = `<p class="text-red-600">Gagal memuat kelas.</p>`;
            console.error(err);
        } finally {
            loading.style.display = "none";
        }
    },

    handleCreateForm() {
        const form = document.getElementById("create-class-form");
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById("name").value.trim();
            if (!name) return;

            try {
                await TeacherClassModel.createClass({ name });
                form.reset();
                this.loadClasses();
            } catch (err) {
                console.error("Gagal membuat kelas:", err);
                alert("Gagal membuat kelas. Pastikan profil teacher lengkap.");
            }
        });
    },
    createClassCard(cls, students = []) {
        const wrapper = document.createElement("div");
        wrapper.className = "bg-white border rounded-lg p-4 shadow";

        wrapper.innerHTML = `
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-lg font-semibold">${cls.name}</h3>
<p class="text-sm text-gray-500">
  Kode: 
  <span class="font-mono">${cls.class_code}</span>
  <button class="copy-code-btn ml-2 text-blue-600 hover:underline text-xs" data-code="${cls.class_code}" title="Salin kode">
    📋 Salin
  </button>
</p>
        <p class="text-sm text-gray-500">Perguruan Tinggi : ${cls.perguruan_tinggi}</p>
      </div>
      <div class="flex gap-2 text-sm">
        <button class="edit-btn text-blue-600 hover:underline" data-id="${cls.id}" data-name="${cls.name}">
          Edit
        </button>
        <button class="delete-btn text-red-600 hover:underline" data-id="${cls.id}">
          Hapus
        </button>
      </div>
    </div>

    <div class="mt-4 text-sm">
      <p class="font-medium mb-2">Anggota (${students.length}):</p>
      ${students.length === 0
                ? `<p class="text-gray-500 text-sm">Belum ada mahasiswa tergabung.</p>`
                : `
        <ul class="divide-y border rounded overflow-hidden">
          ${students
                    .map(
                        (s) => `
            <li class="flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100">
              <div>
                <p class="font-medium">${s.full_name}</p>
                <p class="text-xs text-gray-600">${s.nim} • ${s.program_studi}</p>
              </div>
              <button class="kick-btn text-xs text-red-500 hover:underline" data-sid="${s.id}" data-cid="${cls.id}">
                Keluarkan
              </button>
            </li>
          `
                    )
                    .join("")}
        </ul>`
            }
    </div>
  `;

        // Event: Hapus kelas
        wrapper.querySelector(".delete-btn")?.addEventListener("click", async (e) => {
            const id = e.target.dataset.id;
            if (confirm("Yakin ingin menghapus kelas ini?")) {
                await TeacherClassModel.deleteClass(id);
                this.loadClasses();
            }
        });

        // Event: Edit nama kelas
        wrapper.querySelector(".edit-btn")?.addEventListener("click", async (e) => {
            const id = e.target.dataset.id;
            const currentName = e.target.dataset.name;
            const newName = prompt("Ubah nama kelas:", currentName);
            if (newName && newName !== currentName) {
                await TeacherClassModel.updateClass(id, { name: newName });
                this.loadClasses();
            }
        });

        // Event: Keluarkan siswa
        wrapper.querySelectorAll(".kick-btn").forEach((btn) => {
            btn.addEventListener("click", async () => {
                const studentId = btn.dataset.sid;
                const classId = btn.dataset.cid;
                if (confirm("Yakin keluarkan siswa dari kelas ini?")) {
                    await TeacherClassModel.removeStudent(classId, studentId);
                    this.loadClasses();
                }
            });
        });
        // Event: Salin kode kelas ke clipboard
        wrapper.querySelector(".copy-code-btn")?.addEventListener("click", (e) => {
            const code = e.target.dataset.code;
            navigator.clipboard.writeText(code)
                .then(() => {
                    e.target.textContent = "✅ Disalin";
                    setTimeout(() => {
                        e.target.textContent = "📋 Salin";
                    }, 1500);
                })
                .catch(() => {
                    alert("Gagal menyalin kode kelas");
                });
        });


        return wrapper;
    }
    ,
};

export default TeacherClassPresenter;
