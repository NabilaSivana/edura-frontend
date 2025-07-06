// FILE: presenter.js
import TeacherGradeModel from "./model.js";

const TeacherGradePresenter = {
  studentsData: [],
  filteredData: [],
  sortAsc: true,

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
    document.getElementById("grade-class-list-section").classList.add("hidden");
    document.getElementById("grade-detail-section").classList.remove("hidden");

    document.getElementById("back-to-class-list").onclick = () => {
      document.getElementById("grade-detail-section").classList.add("hidden");
      document
        .getElementById("grade-class-list-section")
        .classList.remove("hidden");
    };

    try {
      const students = await TeacherGradeModel.getStudentsByClass(classId);
      this.studentsData = students;
      this.filteredData = [...students];
      this.renderTable();

      document
        .getElementById("student-search")
        .addEventListener("input", (e) => {
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
    } catch (error) {
      console.error(error);
    }
  },

  renderTable() {
    const tbody = document.getElementById("grade-detail-body");
    tbody.innerHTML = "";

    if (!this.filteredData.length) {
      tbody.innerHTML = `<tr><td class="px-4 py-2 border text-center" colspan="8">Tidak ada data ditemukan.</td></tr>`;
      return;
    }

    this.filteredData.forEach((s, i) => {
      const tr = document.createElement("tr");
      tr.className =
        "odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-900";

      const courseList =
        s.courses?.map((c) => `<div>${c.title}</div>`).join("") || "-";
      const gradeList =
        s.courses?.map((c) => `<div>${c.grade ?? "-"}</div>`).join("") || "-";

      tr.innerHTML = `
        <td class="border px-4 py-2">${s.full_name}</td>
        <td class="border px-4 py-2">${s.nim}</td>
        <td class="border px-4 py-2">${s.program_studi}</td>
        <td class="border px-4 py-2">${s.jurusan}</td>
        <td class="border px-4 py-2">${s.perguruan_tinggi}</td>
        <td class="border px-4 py-2 italic text-gray-400" colspan="2">Belum mengikuti course</td>
      `;

      tbody.appendChild(tr);
    });
  },

  exportCSV(filename, data) {
    if (!data || data.length === 0) return;

    const headers = [
      "Nama",
      "NIM",
      "Program Studi",
      "Jurusan",
      "Perguruan Tinggi",
      "Course",
      "Nilai",
    ];
    const csvRows = [headers.join(",")];

    data.forEach((s, i) => {
      const courseList = s.courses?.map((c) => c.title).join(" | ") || "-";
      const gradeList =
        s.courses?.map((c) => c.grade ?? "-").join(" | ") || "-";
      const row = [
        i + 1,
        s.full_name,
        s.nim,
        s.program_studi,
        s.jurusan,
        s.perguruan_tinggi,
        courseList,
        gradeList,
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
