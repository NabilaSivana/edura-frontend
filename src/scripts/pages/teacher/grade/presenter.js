import TeacherGradeModel from "./model.js";

const TeacherGradePresenter = {
    async init() {
        this.loadClassList();
    },

    async loadClassList() {
        const wrapper = document.getElementById("class-list");
        const loading = document.getElementById("class-loading");

        try {
            const classes = await TeacherGradeModel.getClasses();
            loading.style.display = "none";

            if (!classes.length) {
                wrapper.innerHTML = `<p class="text-gray-500">Belum ada kelas.</p>`;
                return;
            }

            classes.forEach((cls) => {
                const card = this.createClassCard(cls);
                wrapper.appendChild(card);
            });
        } catch (err) {
            wrapper.innerHTML = `<p class="text-red-600">Gagal memuat kelas.</p>`;
            console.error(err);
        }
    },

    createClassCard(cls) {
        const card = document.createElement("div");
        card.className =
            "bg-white p-4 rounded-lg border shadow hover:bg-gray-50 cursor-pointer transition";
        card.innerHTML = `
      <h3 class="text-lg font-semibold mb-1">${cls.name}</h3>
      <p class="text-sm text-gray-500">Kode: <span class="font-mono">${cls.class_code}</span></p>
      <p class="text-sm text-gray-500">${cls.program_studi} • ${cls.perguruan_tinggi}</p>
    `;

        card.addEventListener("click", () => this.showGradesModal(cls.id, cls.name));
        return card;
    },

    async showGradesModal(classId, className) {
        const modal = document.createElement("div");
        modal.id = "grade-modal";
        modal.className =
            "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center";

        const contentWrapper = document.createElement("div");
        contentWrapper.className =
            "bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl";

        contentWrapper.innerHTML = `<h2 class="text-xl font-bold mb-4">Siswa Kelas: ${className}</h2>
      <div id="grade-table-container">
        <p class="text-blue-600">Memuat data siswa...</p>
      </div>
      <div class="text-right mt-6">
        <button id="close-grade-modal" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Tutup
        </button>
      </div>`;

        modal.appendChild(contentWrapper);
        document.body.appendChild(modal);
        document.body.style.overflow = "hidden";

        document.getElementById("close-grade-modal").addEventListener("click", () => {
            modal.remove();
            document.body.style.overflow = "";
        });

        try {
            const students = await TeacherGradeModel.getStudentsByClass(classId);
            const table = this.createClassGradeTable(students);
            const container = document.getElementById("grade-table-container");
            container.innerHTML = "";
            container.appendChild(table);
        } catch (error) {
            document.getElementById("grade-table-container").innerHTML =
                `<p class="text-red-600">Gagal mengambil data siswa.</p>`;
        }
    },

    createClassGradeTable(students = []) {
        const wrapper = document.createElement("div");
        wrapper.className = "overflow-x-auto mt-4";

        if (students.length === 0) {
            wrapper.innerHTML = `<p class="text-sm text-gray-500">Belum ada siswa tergabung dalam kelas ini.</p>`;
            return wrapper;
        }

        let tableHTML = `
      <table class="min-w-full border text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 border">No</th>
            <th class="px-4 py-2 border">Nama</th>
            <th class="px-4 py-2 border">NIM</th>
            <th class="px-4 py-2 border">Program Studi</th>
            <th class="px-4 py-2 border">Jurusan</th>
            <th class="px-4 py-2 border">Perguruan Tinggi</th>
          </tr>
        </thead>
        <tbody>
    `;

        students.forEach((student, index) => {
            tableHTML += `
          <tr>
            <td class="border px-4 py-2">${index + 1}</td>
            <td class="border px-4 py-2">${student.full_name}</td>
            <td class="border px-4 py-2">${student.nim}</td>
            <td class="border px-4 py-2">${student.program_studi}</td>
            <td class="border px-4 py-2">${student.jurusan}</td>
            <td class="border px-4 py-2">${student.perguruan_tinggi}</td>
          </tr>
        `;
        });

        tableHTML += `</tbody></table>`;
        wrapper.innerHTML = tableHTML;
        return wrapper;
    },
};

export default TeacherGradePresenter;
