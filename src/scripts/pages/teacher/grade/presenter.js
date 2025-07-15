import TeacherGradeModel from "./model.js";

const TeacherGradePresenter = {
  studentsData: [],
  filteredData: [],
  sortAsc: true,
  currentClassId: null,

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
        wrapper.innerHTML = `<p class="text-gray-500 dark:text-gray-400">Belum ada kelas.</p>`;
        return;
      }

      classes.forEach((cls) => {
        const card = document.createElement("div");
        card.className =
          "bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700 shadow-md hover:shadow-lg hover:scale-[1.01] transition cursor-pointer";
        card.innerHTML = `
          <h3 class="text-lg font-semibold mb-1">${cls.name}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Kode: <span class="font-mono">${cls.class_code}</span></p>
          <p class="text-sm text-gray-500 dark:text-gray-400">${cls.program_studi} • ${cls.perguruan_tinggi}</p>
          <button class="mt-3 text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">View</button>
        `;

        card.addEventListener("click", () =>
          this.loadClassDetail(cls.id, cls.name)
        );
        wrapper.appendChild(card);
      });
    } catch (err) {
      wrapper.innerHTML = `<p class="text-red-600">Gagal memuat kelas.</p>`;
      console.error(err);
    }
  },

  async loadClassDetail(classId, className) {
    this.currentClassId = classId; // ✅ Set classId di awal

    document.getElementById("grade-class-list-section").classList.add("hidden");
    document.getElementById("grade-detail-section").classList.remove("hidden");

    document.getElementById("back-to-class-list").onclick = () => {
      document.getElementById("grade-detail-section").classList.add("hidden");
      document.getElementById("grade-class-list-section").classList.remove("hidden");
    };

    try {
      const students = await TeacherGradeModel.getStudentsByClass(classId);
      this.studentsData = students;
      this.filteredData = [...students];
      this.renderTable();
      this.setupEventListeners(className);
    } catch (error) {
      console.error(error);
    }
  },

  setupEventListeners(className) {
    document.getElementById("student-search").addEventListener("input", (e) => {
      const keyword = e.target.value.toLowerCase();
      this.filteredData = this.studentsData.filter(
        (s) =>
          s.full_name.toLowerCase().includes(keyword) ||
          s.nim.toLowerCase().includes(keyword)
      );
      this.renderTable();
    });

    document.getElementById("sort-by-name").addEventListener("click", () => {
      this.sortAsc = !this.sortAsc;
      this.filteredData.sort((a, b) => {
        return this.sortAsc
          ? a.full_name.localeCompare(b.full_name)
          : b.full_name.localeCompare(a.full_name);
      });
      this.renderTable();
    });

    document.getElementById("download-csv").addEventListener("click", () => {
      this.exportCSV(`${className}_grades.csv`, this.filteredData);
    });
  },

  renderTable() {
    const tbody = document.getElementById("grade-detail-body");
    tbody.innerHTML = "";

    if (!this.filteredData.length) {
      tbody.innerHTML = `<tr><td class="px-4 py-2 border text-center" colspan="8">Tidak ada data ditemukan.</td></tr>`;
      return;
    }

    this.filteredData.forEach((s) => {
      const tr = document.createElement("tr");
      tr.className =
        "odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-900";

      const courseList = s.courses?.length
        ? s.courses.map((c) => `
      <div 
        class="truncate max-w-[220px] whitespace-nowrap overflow-hidden text-ellipsis border-b border-dashed border-gray-300 dark:border-gray-600 last:border-none pb-1"
        title="${c.course_title}"
      >${c.course_title}</div>`).join("")
        : "<div class='italic text-gray-400'>Belum mengikuti course</div>";

      const gradeList = s.courses?.length
        ? s.courses.map((c) =>
          c.score_final_exam !== null ? `<div>${c.score_final_exam}</div>` : `<div>-</div>`
        ).join("")
        : "<div>-</div>";

      const progressList = s.courses?.length
        ? s.courses.map((c) =>
          c.progress_percent !== undefined ? `<div>${c.progress_percent}%</div>` : `<div>-</div>`
        ).join("")
        : "<div>-</div>";

      const statusList = s.courses?.length
        ? s.courses.map((c) =>
          c.status_kelulusan ? `<div>${c.status_kelulusan}</div>` : `<div>-</div>`
        ).join("")
        : "<div>-</div>";


      const actionList = s.courses?.length
        ? s.courses
          .map((c) => {
            const actions = [];

            // Tampilkan tombol sertifikat jika course selesai dan punya nilai
            if (c.is_completed && c.score_final_exam !== null) {
              actions.push(`
            <button 
              class="print-cert-btn text-blue-600 hover:text-blue-800"
              title="Cetak Sertifikat"
              data-course="${c.course_id}"
              data-student="${s.student_id}"
              data-class="${this.currentClassId}">
              <i class="fa fa-certificate"></i>
            </button>
          `);
            }

            // Tampilkan tombol notifikasi jika course belum selesai
            if (!c.is_completed) {
              actions.push(`
              <button 
                class="notify-student-btn text-green-600 hover:text-green-800"
                title="Kirim Notifikasi"
                data-email="${s.email}"
                data-name="${s.full_name}"
                data-course="${c.course_id}">
                <i class="fa fa-envelope"></i>
              </button>
            `);
            }

            return `<div class="flex gap-2">${actions.join("")}</div>`;
          })
          .join("")
        : "-";


      tr.innerHTML = `
        <td class="border px-4 py-2">${s.full_name}</td>
        <td class="border px-4 py-2">${s.nim}</td>
        <td class="border px-4 py-2">${s.program_studi}</td>
        <td class="border px-4 py-2">${s.jurusan}</td>
        <td class="border px-4 py-2">${s.perguruan_tinggi}</td>
        <td class="border px-4 py-2">${courseList}</td>
        <td class="border px-4 py-2">${gradeList}</td>
        <td class="border px-4 py-2">${progressList}</td> <!-- ✅ -->
        <td class="border px-4 py-2">${statusList}</td>   <!-- ✅ -->
        <td class="border px-4 py-2">${actionList}</td>
      `;

      tbody.appendChild(tr);

      // ✅ Pindahkan ini ke dalam forEach
      // Tombol sertifikat
      tr.querySelectorAll(".print-cert-btn").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const payload = {
            course_id: btn.dataset.course,
            student_id: btn.dataset.student,
            class_id: btn.dataset.class,
          };

          try {
            const result = await TeacherGradeModel.sendStudentCertificateByTeacher(payload);
            alert(result.message || "✅ Sertifikat berhasil dikirim.");
          } catch (err) {
            alert(`❌ ${err.message}`);
          }
        });
      });

      // Tombol notifikasi
      tr.querySelectorAll(".notify-student-btn").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const email = btn.dataset.email;
          const name = btn.dataset.name;
          const courseId = btn.dataset.course; // ⬅️ ambil dari data attribute
          const reason = prompt(`Masukkan pesan atau pengingat untuk ${name}:`);
          if (!reason || reason.trim().length === 0) {
            alert("❌ Pesan tidak boleh kosong.");
            return;
          }

          try {
            const result = await TeacherGradeModel.notifyStudent({
              email, name, reason, course_id: courseId // ⬅️ kirim ke backend
            });
            alert(result.message || "✅ Notifikasi berhasil dikirim.");
          } catch (err) {
            alert(`❌ ${err.message}`);
          }
        });
      });
    });
  },

  exportCSV(filename, data) {
    if (!data || data.length === 0) return;

    const headers = [
      "Nama", "NIM", "Program Studi", "Jurusan", "Perguruan Tinggi", "Courses", "Nilai"
    ];
    const csvRows = [headers.join(",")];

    data.forEach((s) => {
      const courseList = s.courses?.map((c) => c.course_title).join(" | ") || "-";
      const gradeList = s.courses?.map((c) =>
        c.score_final_exam !== null ? c.score_final_exam : "-"
      ).join(" | ") || "-";

      const row = [
        s.full_name,
        s.nim,
        s.program_studi,
        s.jurusan,
        s.perguruan_tinggi,
        courseList,
        gradeList
      ];

      csvRows.push(row.map((v) => `"${v}"`).join(","));
    });

    const csv = csvRows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  },
};

export default TeacherGradePresenter;
