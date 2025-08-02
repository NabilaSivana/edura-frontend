// import TeacherGradeModel from "./model.js";

// const TeacherGradePresenter = {
//   studentsData: [],
//   filteredData: [],
//   sortAsc: true,
//   currentClassId: null,
//   currentClassName: "",
//   selectedStudents: new Set(),

//   async init() {
//     this.loadClassList();
//     this.loadExcelLibrary();
//   },

//   async loadExcelLibrary() {
//     // Load XLSX library if not already loaded
//     if (typeof XLSX === 'undefined') {
//       const script = document.createElement('script');
//       script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
//       script.onload = () => {
//         console.log('XLSX library loaded successfully');
//       };
//       script.onerror = () => {
//         console.warn('Failed to load XLSX library, will use CSV as fallback');
//       };
//       document.head.appendChild(script);
//     }
//   },

//   async loadClassList() {
//     const wrapper = document.getElementById("class-list");
//     const loading = document.getElementById("class-loading");

//     try {
//       const classes = await TeacherGradeModel.getClasses();
//       if (loading) loading.style.display = "none";

//       if (!classes.length) {
//         wrapper.innerHTML = `
//           <div class="text-center py-12">
//             <div class="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
//               <i class="fas fa-chalkboard-teacher text-3xl text-gray-400"></i>
//             </div>
//             <p class="text-gray-500 dark:text-gray-400 text-lg">Belum ada kelas tersedia</p>
//           </div>
//         `;
//         return;
//       }

//       wrapper.innerHTML = "";
//       classes.forEach((cls) => {
//         const card = document.createElement("div");
//         card.className = `
//           group bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 
//           p-6 rounded-xl border dark:border-gray-700 shadow-lg hover:shadow-2xl 
//           hover:scale-[1.02] transition-all duration-300 cursor-pointer relative overflow-hidden
//         `;

//         card.innerHTML = `
//           <div class="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-bl-full"></div>
//           <div class="relative z-10">
//             <div class="flex items-center justify-between mb-3">
//               <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
//                 <i class="fas fa-graduation-cap text-blue-600 dark:text-blue-400 text-xl"></i>
//               </div>
//               <span class="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium">
//                 ${cls.class_code}
//               </span>
//             </div>
//             <h3 class="text-xl font-bold mb-2 text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
//               ${cls.name}
//             </h3>
//             <div class="space-y-1 mb-4">
//               <p class="text-sm text-gray-600 dark:text-gray-300 flex items-center">
//                 <i class="fas fa-book-open w-4 mr-2 text-gray-400"></i>
//                 ${cls.program_studi}
//               </p>
//               <p class="text-sm text-gray-600 dark:text-gray-300 flex items-center">
//                 <i class="fas fa-university w-4 mr-2 text-gray-400"></i>
//                 ${cls.perguruan_tinggi}
//               </p>
//             </div>
//             <button class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center">
//               <i class="fas fa-chart-line mr-2"></i>
//               Kelola Nilai
//             </button>
//           </div>
//         `;

//         card.addEventListener("click", () => this.loadClassDetail(cls.id, cls.name));
//         wrapper.appendChild(card);
//       });
//     } catch (err) {
//       wrapper.innerHTML = `
//         <div class="text-center py-12">
//           <div class="mx-auto w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
//             <i class="fas fa-exclamation-triangle text-3xl text-red-500"></i>
//           </div>
//           <p class="text-red-600 dark:text-red-400 text-lg font-medium">Gagal memuat data kelas</p>
//           <button onclick="location.reload()" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
//             Coba Lagi
//           </button>
//         </div>
//       `;
//     }
//   },

//   async loadClassDetail(classId, className) {
//     this.currentClassId = classId;
//     this.currentClassName = className;
//     this.selectedStudents.clear();

//     document.getElementById("grade-class-list-section").classList.add("hidden");
//     document.getElementById("grade-detail-section").classList.remove("hidden");

//     // Update back button
//     const backButton = document.getElementById("back-to-class-list");
//     if (backButton) {
//       backButton.onclick = () => {
//         document.getElementById("grade-detail-section").classList.add("hidden");
//         document.getElementById("grade-class-list-section").classList.remove("hidden");
//         this.selectedStudents.clear();
//       };
//     }

//     // Add enhanced header and stats if containers exist
//     this.setupEnhancedUI(className);

//     // Show loading state
//     const tbody = document.getElementById("grade-detail-body");
//     tbody.innerHTML = `
//       <tr>
//         <td colspan="8" class="px-4 py-12 text-center">
//           <div class="flex flex-col items-center space-y-3">
//             <div class="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
//             <p class="text-gray-500 dark:text-gray-400">Memuat data siswa...</p>
//           </div>
//         </td>
//       </tr>
//     `;

//     try {
//       const students = await TeacherGradeModel.getStudentsByClass(classId);
//       this.studentsData = students;
//       this.filteredData = [...students];
//       this.renderTable();
//       this.setupEventListeners(className);
//       this.updateStats();
//     } catch (error) {
//       tbody.innerHTML = `
//         <tr>
//           <td colspan="8" class="px-4 py-12 text-center">
//             <div class="flex flex-col items-center space-y-3">
//               <i class="fas fa-exclamation-circle text-red-500 text-3xl"></i>
//               <p class="text-red-600 dark:text-red-400">Gagal memuat data siswa</p>
//               <button onclick="location.reload()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
//                 Coba Lagi
//               </button>
//             </div>
//           </td>
//         </tr>
//       `;
//     }
//   },

//   setupEnhancedUI(className) {
//     // Add stats container if it doesn't exist
//     const detailSection = document.getElementById("grade-detail-section");
//     if (detailSection && !document.getElementById("class-stats")) {
//       const statsContainer = document.createElement("div");
//       statsContainer.id = "class-stats";
//       statsContainer.className = "mb-6";

//       // Insert after back button or at the beginning
//       const backButton = document.getElementById("back-to-class-list");
//       if (backButton && backButton.parentNode) {
//         backButton.parentNode.insertBefore(statsContainer, backButton.nextSibling);
//       }
//     }

//     // Add bulk actions container if it doesn't exist
//     if (detailSection && !document.getElementById("bulk-actions")) {
//       const bulkContainer = document.createElement("div");
//       bulkContainer.id = "bulk-actions";
//       bulkContainer.className = "hidden mb-4";

//       // Insert before table
//       const table = document.querySelector("table");
//       if (table && table.parentNode) {
//         table.parentNode.insertBefore(bulkContainer, table);
//       }
//     }

//     // Add enhanced controls
//     this.addEnhancedControls();
//   },

//   addEnhancedControls() {
//     // Add filter and enhanced search
//     const searchInput = document.getElementById("student-search");
//     if (searchInput && !document.getElementById("enhanced-controls")) {
//       const controlsContainer = document.createElement("div");
//       controlsContainer.id = "enhanced-controls";
//       controlsContainer.className = "flex flex-wrap items-center gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg";

//       controlsContainer.innerHTML = `
//         <div class="flex-1 min-w-[200px]">
//           <div class="relative">
//             <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
//             <input type="text" id="enhanced-search" placeholder="Cari nama, NIM, atau program studi..." 
//                    class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
//           </div>
//         </div>
//         <select id="status-filter" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
//           <option value="all">Semua Status</option>
//           <option value="completed">Sudah Selesai</option>
//           <option value="ongoing">Sedang Berlangsung</option>
//         </select>
//         <button id="sort-by-name" class="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center">
//           <i class="fas fa-sort-alpha-down mr-2"></i>
//           Sort Nama
//         </button>
//         <button id="download-excel" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center">
//           <i class="fas fa-file-excel mr-2"></i>
//           Export Excel
//         </button>
//       `;

//       // Insert before table
//       const table = document.querySelector("table");
//       if (table && table.parentNode) {
//         table.parentNode.insertBefore(controlsContainer, table);
//       }
//     }

//     // Add select all checkbox to table header
//     const tableHeader = document.querySelector("thead tr");
//     if (tableHeader && !document.getElementById("select-all")) {
//       const selectAllTh = document.createElement("th");
//       selectAllTh.className = "border-b border-gray-200 dark:border-gray-700 px-4 py-3 text-left";
//       selectAllTh.innerHTML = `
//         <input type="checkbox" id="select-all" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
//       `;
//       tableHeader.insertBefore(selectAllTh, tableHeader.firstChild);
//     }
//   },

//   setupEventListeners(className) {
//     // Enhanced search functionality
//     const enhancedSearch = document.getElementById("enhanced-search");
//     const originalSearch = document.getElementById("student-search");

//     const searchHandler = (e) => {
//       const keyword = e.target.value.toLowerCase();
//       this.filteredData = this.studentsData.filter(
//         (s) =>
//           s.full_name.toLowerCase().includes(keyword) ||
//           s.nim.toLowerCase().includes(keyword) ||
//           s.program_studi.toLowerCase().includes(keyword)
//       );
//       this.renderTable();
//       this.updateStats();
//     };

//     if (enhancedSearch) {
//       enhancedSearch.addEventListener("input", searchHandler);
//       // Copy value from original search if exists
//       if (originalSearch) {
//         enhancedSearch.value = originalSearch.value;
//       }
//     } else if (originalSearch) {
//       originalSearch.addEventListener("input", searchHandler);
//     }

//     // Sort functionality
//     const sortButton = document.getElementById("sort-by-name");
//     if (sortButton) {
//       sortButton.addEventListener("click", () => {
//         this.sortAsc = !this.sortAsc;
//         const icon = sortButton.querySelector("i");
//         if (icon) {
//           icon.className = this.sortAsc ? "fas fa-sort-alpha-down mr-2" : "fas fa-sort-alpha-up mr-2";
//         }

//         this.filteredData.sort((a, b) => {
//           return this.sortAsc
//             ? a.full_name.localeCompare(b.full_name)
//             : b.full_name.localeCompare(a.full_name);
//         });
//         this.renderTable();
//       });
//     }

//     // Filter by status
//     const statusFilter = document.getElementById("status-filter");
//     if (statusFilter) {
//       statusFilter.addEventListener("change", (e) => {
//         const status = e.target.value;
//         if (status === "all") {
//           this.filteredData = [...this.studentsData];
//         } else {
//           this.filteredData = this.studentsData.filter(student => {
//             const hasCompletedCourse = student.courses?.some(course => course.is_completed);
//             return status === "completed" ? hasCompletedCourse : !hasCompletedCourse;
//           });
//         }
//         this.renderTable();
//         this.updateStats();
//       });
//     }

//     // Export Excel functionality
//     const downloadButton = document.getElementById("download-excel");
//     if (downloadButton) {
//       downloadButton.onclick = () => {
//         this.exportToExcel(`${className}_grades.xlsx`, this.filteredData);
//       };
//     }

//     // Select all functionality
//     const selectAll = document.getElementById("select-all");
//     if (selectAll) {
//       selectAll.addEventListener("change", (e) => {
//         const checkboxes = document.querySelectorAll(".student-checkbox");
//         checkboxes.forEach(checkbox => {
//           checkbox.checked = e.target.checked;
//           if (e.target.checked) {
//             this.selectedStudents.add(checkbox.dataset.studentId);
//           } else {
//             this.selectedStudents.delete(checkbox.dataset.studentId);
//           }
//         });
//         this.updateBulkActions();
//       });
//     }
//   },

//   renderTable() {
//     const tbody = document.getElementById("grade-detail-body");
//     tbody.innerHTML = "";

//     if (!this.filteredData.length) {
//       const colSpan = document.querySelector("thead tr") ? document.querySelector("thead tr").children.length : 8;
//       tbody.innerHTML = `
//         <tr>
//           <td colspan="${colSpan}" class="px-4 py-12 text-center">
//             <div class="flex flex-col items-center space-y-3">
//               <i class="fas fa-search text-gray-400 text-3xl"></i>
//               <p class="text-gray-500 dark:text-gray-400">Tidak ada data yang ditemukan</p>
//             </div>
//           </td>
//         </tr>
//       `;
//       return;
//     }

//     this.filteredData.forEach((student, index) => {
//       if (!student.courses || student.courses.length === 0) {
//         // Student without courses - single row
//         this.renderStudentRow(student, null, index, true);
//       } else {
//         // Student with courses - multiple rows for each course
//         student.courses.forEach((course, courseIndex) => {
//           const isFirstCourse = courseIndex === 0;
//           this.renderStudentRow(student, course, index, isFirstCourse, student.courses.length);
//         });
//       }
//     });
//   },

//   renderStudentRow(student, course, studentIndex, showStudentInfo, totalCourses = 1) {
//     const tbody = document.getElementById("grade-detail-body");
//     const tr = document.createElement("tr");
//     tr.className = `
//       group hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-200
//       ${studentIndex % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}
//       border-b border-gray-200 dark:border-gray-700
//     `;

//     // Check if we need to add checkbox column
//     const hasSelectAll = document.getElementById("select-all");
//     const checkboxCell = hasSelectAll && showStudentInfo ? `
//       <td class="px-4 py-3 align-top" ${totalCourses > 1 ? `rowspan="${totalCourses}"` : ''}>
//         <input type="checkbox" class="student-checkbox w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
//                data-student-id="${student.student_id}">
//       </td>
//     ` : (hasSelectAll && !showStudentInfo ? '' : '');

//     // Student info cells (only show for first course)
//     const studentInfoCells = showStudentInfo ? `
//       <td class="px-4 py-3 align-top" ${totalCourses > 1 ? `rowspan="${totalCourses}"` : ''}>
//         <div class="flex items-center space-x-3">
//           <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
//             ${student.full_name.charAt(0).toUpperCase()}
//           </div>
//           <div class="min-w-0 flex-1">
//             <p class="text-sm font-bold text-gray-900 dark:text-white">${student.full_name}</p>
//           </div>
//         </div>
//       </td>
//       <td class="px-4 py-3 align-top" ${totalCourses > 1 ? `rowspan="${totalCourses}"` : ''}>
//         <span class="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">${student.nim}</span>
//       </td>
//       <td class="px-4 py-3 align-top text-sm text-gray-700 dark:text-gray-300" ${totalCourses > 1 ? `rowspan="${totalCourses}"` : ''}>
//         ${student.program_studi}
//       </td>
//     ` : '';

//     // Course specific cells
//     const courseCell = course ? `
//       <td class="px-4 py-3 align-top">
//         <div class="max-w-xs">
//           <p class="text-sm font-medium text-gray-800 dark:text-white">${course.course_title}</p>
//         </div>
//       </td>
//     ` : `
//       <td class="px-4 py-3 align-top text-center text-gray-400 italic">
//         Belum mengikuti course
//       </td>
//     `;

//     const gradeCell = course ? `
//       <td class="px-4 py-3 align-top text-center">
//         ${course.score_final_exam !== null && course.score_final_exam !== undefined ? 
//           (() => {
//             const grade = course.score_final_exam;
//             let colorClass = "";
//             if (grade >= 85) colorClass = "text-green-600 dark:text-green-400 font-bold";
//             else if (grade >= 70) colorClass = "text-blue-600 dark:text-blue-400 font-medium";
//             else if (grade >= 60) colorClass = "text-yellow-600 dark:text-yellow-400";
//             else colorClass = "text-red-600 dark:text-red-400";
//             return `<span class="px-2 py-1 rounded ${colorClass}">${grade}</span>`;
//           })()
//           : '<span class="text-gray-400">-</span>'
//         }
//       </td>
//     ` : `
//       <td class="px-4 py-3 align-top text-center text-gray-400">-</td>
//     `;

//     const progressCell = course ? `
//       <td class="px-4 py-3 align-top">
//         <div class="flex items-center space-x-2">
//           <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
//             <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: ${course.progress_percent || 0}%"></div>
//           </div>
//           <span class="text-xs text-gray-600 dark:text-gray-400 min-w-[35px]">${course.progress_percent || 0}%</span>
//         </div>
//       </td>
//     ` : `
//       <td class="px-4 py-3 align-top text-center text-gray-400">-</td>
//     `;

//     const statusCell = course ? `
//       <td class="px-4 py-3 align-top text-center">
//         ${course.status_kelulusan ? 
//           (() => {
//             const isLulus = course.status_kelulusan.toLowerCase().includes('lulus');
//             return `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs ${
//               isLulus 
//                 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
//                 : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
//             }">
//               ${course.status_kelulusan}
//             </span>`;
//           })()
//           : `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
//                Menunggu
//              </span>`
//         }
//       </td>
//     ` : `
//       <td class="px-4 py-3 align-top text-center text-gray-400">-</td>
//     `;

//     const actionCell = course ? `
//       <td class="px-4 py-3 align-top">
//         <div class="flex flex-col space-y-1">
//           ${course.is_completed && course.score_final_exam !== null ? 
//             `<button 
//               class="print-cert-btn inline-flex items-center px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors text-xs font-medium"
//               data-course="${course.course_id}"
//               data-student="${student.student_id}"
//               data-class="${this.currentClassId}">
//               <i class="fas fa-certificate mr-1"></i>
//               Sertifikat
//             </button>` : ''
//           }
//           ${(course.score_final_exam === null || course.score_final_exam === undefined) && student.email ? 
//             `<button 
//               class="notify-student-btn inline-flex items-center px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors text-xs font-medium"
//               data-email="${student.email}"
//               data-name="${student.full_name}"
//               data-course="${course.course_id}">
//               <i class="fas fa-envelope mr-1"></i>
//               Notifikasi
//             </button>` : ''
//           }
//         </div>
//       </td>
//     ` : `
//       <td class="px-4 py-3 align-top text-center text-gray-400">-</td>
//     `;

//     tr.innerHTML = `${checkboxCell}${studentInfoCells}${courseCell}${gradeCell}${progressCell}${statusCell}${actionCell}`;

//     tbody.appendChild(tr);
//     this.attachActionListeners(tr);

//     // Add checkbox listener if exists
//     const checkbox = tr.querySelector(".student-checkbox");
//     if (checkbox) {
//       checkbox.addEventListener("change", (e) => {
//         if (e.target.checked) {
//           this.selectedStudents.add(student.student_id);
//         } else {
//           this.selectedStudents.delete(student.student_id);
//         }
//         this.updateBulkActions();
//       });
//     }
//   },

//   attachActionListeners(row) {
//     // Certificate buttons
//     row.querySelectorAll(".print-cert-btn").forEach((btn) => {
//       btn.addEventListener("click", async () => {
//         const originalText = btn.innerHTML;
//         btn.disabled = true;
//         btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i>Memproses...';

//         const payload = {
//           course_id: btn.dataset.course,
//           student_id: btn.dataset.student,
//           class_id: btn.dataset.class,
//         };

//         try {
//           const result = await TeacherGradeModel.sendStudentCertificateByTeacher(payload);
//           this.showNotification(result.message || "✅ Sertifikat berhasil dikirim.", "success");
//         } catch (err) {
//           this.showNotification(`❌ ${err.message}`, "error");
//         } finally {
//           btn.disabled = false;
//           btn.innerHTML = originalText;
//         }
//       });
//     });

//     // Notification buttons
//     row.querySelectorAll(".notify-student-btn").forEach((btn) => {
//       btn.addEventListener("click", async () => {
//         const email = btn.dataset.email;
//         const name = btn.dataset.name;
//         const courseId = btn.dataset.course;

//         const reason = prompt(`Masukkan pesan pengingat untuk ${name}:`);
//         if (!reason || reason.trim().length === 0) {
//           this.showNotification("❌ Pesan tidak boleh kosong.", "error");
//           return;
//         }

//         const originalText = btn.innerHTML;
//         btn.disabled = true;
//         btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i>Mengirim...';

//         try {
//           const result = await TeacherGradeModel.notifyStudent({
//             email, name, reason, course_id: courseId
//           });
//           this.showNotification(result.message || "✅ Notifikasi berhasil dikirim.", "success");
//         } catch (err) {
//           this.showNotification(`❌ ${err.message}`, "error");
//         } finally {
//           btn.disabled = false;
//           btn.innerHTML = originalText;
//         }
//       });
//     });
//   },

//   updateStats() {
//     const statsContainer = document.getElementById("class-stats");
//     if (!statsContainer) return;

//     const totalStudents = this.filteredData.length;
//     const completedStudents = this.filteredData.filter(s => 
//       s.courses?.some(c => c.is_completed)
//     ).length;
//     const averageProgress = totalStudents > 0 
//       ? this.filteredData.reduce((sum, s) => {
//           const studentProgress = s.courses?.length 
//             ? s.courses.reduce((courseSum, c) => courseSum + (c.progress_percent || 0), 0) / s.courses.length
//             : 0;
//           return sum + studentProgress;
//         }, 0) / totalStudents
//       : 0;

//     statsContainer.innerHTML = `
//       <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
//           <div class="flex items-center">
//             <i class="fas fa-users text-2xl mr-3"></i>
//             <div>
//               <p class="text-blue-100 text-sm">Total Siswa</p>
//               <p class="text-2xl font-bold">${totalStudents}</p>
//             </div>
//           </div>
//         </div>
//         <div class="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
//           <div class="flex items-center">
//             <i class="fas fa-check-circle text-2xl mr-3"></i>
//             <div>
//               <p class="text-green-100 text-sm">Siswa Aktif</p>
//               <p class="text-2xl font-bold">${completedStudents}</p>
//             </div>
//           </div>
//         </div>
//         <div class="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
//           <div class="flex items-center">
//             <i class="fas fa-chart-line text-2xl mr-3"></i>
//             <div>
//               <p class="text-purple-100 text-sm">Rata-rata Progress</p>
//               <p class="text-2xl font-bold">${averageProgress.toFixed(1)}%</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     `;
//   },

//   updateBulkActions() {
//     const bulkActionsContainer = document.getElementById("bulk-actions");
//     if (!bulkActionsContainer) return;

//     const selectedCount = this.selectedStudents.size;

//     if (selectedCount > 0) {
//       bulkActionsContainer.classList.remove("hidden");
//       bulkActionsContainer.innerHTML = `
//         <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
//           <div class="flex items-center justify-between">
//             <span class="text-blue-800 dark:text-blue-200 font-medium">
//               ${selectedCount} siswa dipilih
//             </span>
//             <div class="flex space-x-2">
//               <button id="bulk-notify" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
//                 <i class="fas fa-envelope mr-2"></i>
//                 Kirim Notifikasi
//               </button>
//               <button id="bulk-export" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
//                 <i class="fas fa-download mr-2"></i>
//                 Export Terpilih
//               </button>
//               <button id="clear-selection" class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
//                 <i class="fas fa-times mr-2"></i>
//                 Batal
//               </button>
//             </div>
//           </div>
//         </div>
//       `;

//       // Add bulk action listeners
//       document.getElementById("bulk-notify").addEventListener("click", () => this.bulkNotifyStudents());
//       document.getElementById("bulk-export").addEventListener("click", () => this.bulkExportStudents());
//       document.getElementById("clear-selection").addEventListener("click", () => this.clearSelection());
//     } else {
//       bulkActionsContainer.classList.add("hidden");
//     }
//   },

//   bulkNotifyStudents() {
//     const selectedStudentIds = Array.from(this.selectedStudents);
//     const selectedStudentsData = this.filteredData.filter(s => selectedStudentIds.includes(s.student_id));

//     const message = prompt("Masukkan pesan untuk semua siswa yang dipilih:");
//     if (!message || message.trim().length === 0) {
//       this.showNotification("❌ Pesan tidak boleh kosong.", "error");
//       return;
//     }

//     // Process bulk notifications
//     let successCount = 0;
//     let errorCount = 0;

//     const processNotifications = async () => {
//       for (const student of selectedStudentsData) {
//         if (student.courses && student.email) {
//           for (const course of student.courses) {
//             if (!course.is_completed) {
//               try {
//                 await TeacherGradeModel.notifyStudent({
//                   email: student.email,
//                   name: student.full_name,
//                   reason: message,
//                   course_id: course.course_id
//                 });
//                 successCount++;
//               } catch (err) {
//                 errorCount++;
//               }
//             }
//           }
//         }
//       }

//       if (successCount > 0) {
//         this.showNotification(`✅ ${successCount} notifikasi berhasil dikirim.`, "success");
//       }
//       if (errorCount > 0) {
//         this.showNotification(`⚠️ ${errorCount} notifikasi gagal dikirim.`, "warning");
//       }
//     };

//     processNotifications();
//   },

//   bulkExportStudents() {
//     const selectedStudentIds = Array.from(this.selectedStudents);
//     const selectedStudentsData = this.filteredData.filter(s => selectedStudentIds.includes(s.student_id));

//     this.exportToExcel(`${this.currentClassName}_selected_students.xlsx`, selectedStudentsData);
//   },

//   clearSelection() {
//     this.selectedStudents.clear();
//     document.querySelectorAll(".student-checkbox").forEach(checkbox => {
//       checkbox.checked = false;
//     });
//     const selectAll = document.getElementById("select-all");
//     if (selectAll) selectAll.checked = false;
//     this.updateBulkActions();
//   },

//   exportToExcel(filename, data) {
//     if (!data || data.length === 0) {
//       this.showNotification("❌ Tidak ada data untuk diekspor.", "error");
//       return;
//     }

//     // Check if XLSX library is available
//     if (typeof XLSX === 'undefined') {
//       this.showNotification("❌ Library Excel belum dimuat. Mencoba memuat ulang...", "error");
//       this.loadExcelLibrary();
//       setTimeout(() => {
//         if (typeof XLSX !== 'undefined') {
//           this.exportToExcel(filename, data);
//         } else {
//           this.exportCSV(filename.replace('.xlsx', '.csv'), data);
//         }
//       }, 2000);
//       return;
//     }

//     try {
//       // Prepare data for Excel with the exact format from the image
//       const excelData = [];

//       data.forEach((student) => {
//         if (student.courses && student.courses.length > 0) {
//           student.courses.forEach((course) => {
//             excelData.push({
//               "Nama": student.full_name,
//               "Nim": student.nim,
//               "Course": course.course_title,
//               "Nilai": course.score_final_exam !== null ? course.score_final_exam : "-",
//               "Progress": `${course.progress_percent || 0}%`,
//               "Status": course.is_completed ? "Selesai" : "Berlangsung",
//               "Aksi": course.is_completed && course.score_final_exam !== null ? "Sertifikat" : "-"
//             });
//           });
//         } else {
//           // Student without courses
//           excelData.push({
//             "Nama": student.full_name,
//             "Nim": student.nim,
//             "Course": "Belum mengikuti course",
//             "Nilai": "-",
//             "Progress": "0%",
//             "Status": "-",
//             "Aksi": "-"
//           });
//         }
//       });

//       // Create workbook
//       const ws = XLSX.utils.json_to_sheet(excelData);
//       const wb = XLSX.utils.book_new();

//       // Set column widths to match the table format
//       const colWidths = [
//         {wch: 20}, // Nama
//         {wch: 12}, // Nim
//         {wch: 35}, // Course
//         {wch: 8},  // Nilai
//         {wch: 10}, // Progress
//         {wch: 12}, // Status
//         {wch: 10}  // Aksi
//       ];
//       ws['!cols'] = colWidths;

//       // Style the header row
//       const headerCells = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1'];
//       headerCells.forEach(cell => {
//         if (ws[cell]) {
//           ws[cell].s = {
//             font: { bold: true, color: { rgb: "FFFFFF" } },
//             fill: { fgColor: { rgb: "4472C4" } },
//             alignment: { horizontal: "center", vertical: "center" }
//           };
//         }
//       });

//       // Add borders to all cells
//       const range = XLSX.utils.decode_range(ws['!ref']);
//       for (let R = range.s.r; R <= range.e.r; ++R) {
//         for (let C = range.s.c; C <= range.e.c; ++C) {
//           const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
//           if (!ws[cellAddress]) continue;

//           ws[cellAddress].s = ws[cellAddress].s || {};
//           ws[cellAddress].s.border = {
//             top: { style: "thin", color: { rgb: "000000" } },
//             bottom: { style: "thin", color: { rgb: "000000" } },
//             left: { style: "thin", color: { rgb: "000000" } },
//             right: { style: "thin", color: { rgb: "000000" } }
//           };
//         }
//       }

//       // Add worksheet to workbook
//       XLSX.utils.book_append_sheet(wb, ws, "Data Nilai Siswa");

//       // Create summary sheet
//       const summaryData = this.createSummaryData(data);
//       const summaryWs = XLSX.utils.json_to_sheet(summaryData);
//       summaryWs['!cols'] = [{wch: 20}, {wch: 15}, {wch: 15}, {wch: 25}];
//       XLSX.utils.book_append_sheet(wb, summaryWs, "Ringkasan");

//       // Save file with proper Excel format
//       XLSX.writeFile(wb, filename, { bookType: 'xlsx', type: 'binary' });

//       this.showNotification(`✅ File Excel berhasil diunduh: ${filename}`, "success");
//     } catch (error) {
//       console.error("Export Excel error:", error);
//       this.showNotification("❌ Gagal mengekspor ke Excel. Mencoba format CSV...", "error");
//       // Fallback to CSV if Excel fails
//       this.exportCSV(filename.replace('.xlsx', '.csv'), data);
//     }
//   },

//   // Fallback CSV export function
//   exportCSV(filename, data) {
//     if (!data || data.length === 0) return;

//     const headers = [
//       "Nama", "Nim", "Course", "Nilai", "Progress", "Status", "Aksi"
//     ];
//     const csvRows = [headers.join(",")];

//     data.forEach((student) => {
//       if (student.courses && student.courses.length > 0) {
//         student.courses.forEach((course) => {
//           const row = [
//             `"${student.full_name}"`,
//             `"${student.nim}"`,
//             `"${course.course_title}"`,
//             `"${course.score_final_exam !== null ? course.score_final_exam : '-'}"`,
//             `"${course.progress_percent || 0}%"`,
//             `"${course.is_completed ? 'Selesai' : 'Berlangsung'}"`,
//             `"${course.is_completed && course.score_final_exam !== null ? 'Sertifikat' : '-'}"`
//           ];
//           csvRows.push(row.join(","));
//         });
//       } else {
//         const row = [
//           `"${student.full_name}"`,
//           `"${student.nim}"`,
//           `"Belum mengikuti course"`,
//           `"-"`,
//           `"0%"`,
//           `"-"`,
//           `"-"`
//         ];
//         csvRows.push(row.join(","));
//       }
//     });

//     const csv = csvRows.join("\n");
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = filename;
//     a.style.display = "none";
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     window.URL.revokeObjectURL(url);

//     this.showNotification(`✅ File CSV berhasil diunduh: ${filename}`, "success");
//   },

//   createSummaryData(data) {
//     const summary = [];
//     const totalStudents = data.length;
//     let totalCourses = 0;
//     let completedCourses = 0;
//     let totalGrades = 0;
//     let gradeCount = 0;

//     data.forEach(student => {
//       if (student.courses) {
//         totalCourses += student.courses.length;
//         student.courses.forEach(course => {
//           if (course.is_completed) completedCourses++;
//           if (course.score_final_exam !== null) {
//             totalGrades += course.score_final_exam;
//             gradeCount++;
//           }
//         });
//       }
//     });

//     const averageGrade = gradeCount > 0 ? (totalGrades / gradeCount).toFixed(2) : 0;
//     const completionRate = totalCourses > 0 ? ((completedCourses / totalCourses) * 100).toFixed(2) : 0;

//     summary.push({
//       "Metrik": "Total Siswa",
//       "Nilai": totalStudents,
//       "Satuan": "orang",
//       "Keterangan": "Jumlah total siswa dalam kelas"
//     });

//     summary.push({
//       "Metrik": "Total Course",
//       "Nilai": totalCourses,
//       "Satuan": "course",
//       "Keterangan": "Total course yang diikuti semua siswa"
//     });

//     summary.push({
//       "Metrik": "Course Selesai",
//       "Nilai": completedCourses,
//       "Satuan": "course",
//       "Keterangan": "Jumlah course yang telah diselesaikan"
//     });

//     summary.push({
//       "Metrik": "Tingkat Penyelesaian",
//       "Nilai": completionRate,
//       "Satuan": "%",
//       "Keterangan": "Persentase course yang diselesaikan"
//     });

//     summary.push({
//       "Metrik": "Rata-rata Nilai",
//       "Nilai": averageGrade,
//       "Satuan": "poin",
//       "Keterangan": "Rata-rata nilai dari semua course"
//     });

//     return summary;
//   },

//   showNotification(message, type = "info") {
//     // Remove existing notifications
//     const existingNotifications = document.querySelectorAll('.notification-toast');
//     existingNotifications.forEach(n => n.remove());

//     const notification = document.createElement('div');
//     notification.className = `notification-toast fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;

//     let bgColor, textColor, icon;
//     switch (type) {
//       case 'success':
//         bgColor = 'bg-green-500';
//         textColor = 'text-white';
//         icon = 'fas fa-check-circle';
//         break;
//       case 'error':
//         bgColor = 'bg-red-500';
//         textColor = 'text-white';
//         icon = 'fas fa-exclamation-circle';
//         break;
//       case 'warning':
//         bgColor = 'bg-yellow-500';
//         textColor = 'text-white';
//         icon = 'fas fa-exclamation-triangle';
//         break;
//       default:
//         bgColor = 'bg-blue-500';
//         textColor = 'text-white';
//         icon = 'fas fa-info-circle';
//     }

//     notification.className += ` ${bgColor} ${textColor}`;
//     notification.innerHTML = `
//       <div class="flex items-center space-x-3">
//         <i class="${icon}"></i>
//         <span>${message}</span>
//         <button class="ml-2 hover:bg-black hover:bg-opacity-10 rounded p-1" onclick="this.parentElement.parentElement.remove()">
//           <i class="fas fa-times"></i>
//         </button>
//       </div>
//     `;

//     document.body.appendChild(notification);

//     // Animate in
//     setTimeout(() => {
//       notification.classList.remove('translate-x-full');
//     }, 100);

//     // Auto remove after 5 seconds
//     setTimeout(() => {
//       notification.classList.add('translate-x-full');
//       setTimeout(() => {
//         if (notification.parentElement) {
//           notification.remove();
//         }
//       }, 300);
//     }, 5000);
//   }
// };

// export default TeacherGradePresenter;
import TeacherGradeModel from "./model.js";

const TeacherGradePresenter = {
  studentsData: [],
  filteredData: [],
  sortAsc: true,
  currentClassId: null,
  currentClassName: "",
  selectedStudents: new Set(),

  async init() {
    this.loadClassList();
    this.loadExcelLibrary();
  },

  async loadExcelLibrary() {
    if (typeof XLSX === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
      script.onload = () => console.log('✅ XLSX library loaded');
      script.onerror = () => console.warn('⚠️ Failed to load XLSX library');
      document.head.appendChild(script);
    }
  },

  async loadClassList() {
    const wrapper = document.getElementById("class-list");
    const loading = document.getElementById("class-loading");

    try {
      const classes = await TeacherGradeModel.getClasses();
      if (loading) loading.style.display = "none";

      if (!classes.length) {
        wrapper.innerHTML = `
          <div class="col-span-full text-center py-16">
            <div class="mx-auto w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
              <i class="fas fa-chalkboard-teacher text-4xl text-blue-400"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Belum Ada Kelas</h3>
            <p class="text-gray-500 dark:text-gray-400">Anda belum memiliki kelas untuk dikelola nilai siswanya.</p>
          </div>
        `;
        return;
      }

      wrapper.innerHTML = "";
      classes.forEach((cls) => {
        const card = document.createElement("div");
        card.className = `
          group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 
          shadow-sm hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600
          transition-all duration-300 cursor-pointer overflow-hidden
        `;

        card.innerHTML = `
          <div class="p-6">
            <!-- Header Section -->
            <div class="flex items-center justify-between mb-4">
              <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <i class="fas fa-graduation-cap text-white text-xl"></i>
              </div>
              <span class="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium border border-blue-200 dark:border-blue-700">
                ${cls.class_code}
              </span>
            </div>

            <!-- Class Info -->
            <div class="mb-6">
              <h3 class="text-xl font-bold mb-3 text-gray-800 dark:text-white leading-tight">
                ${cls.name}
              </h3>
              <div class="space-y-2">
                <div class="flex items-center text-gray-600 dark:text-gray-300">
                  <i class="fas fa-book-open w-5 text-blue-500 mr-3"></i>
                  <span class="text-sm font-medium">${cls.program_studi}</span>
                </div>
                <div class="flex items-center text-gray-600 dark:text-gray-300">
                  <i class="fas fa-university w-5 text-blue-500 mr-3"></i>
                  <span class="text-sm">${cls.perguruan_tinggi}</span>
                </div>
              </div>
            </div>

            <!-- Action Button -->
            <button class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl group-hover:scale-[1.02]">
              <i class="fas fa-chart-line mr-3"></i>
              <span class="text-base">Kelola Nilai Siswa</span>
            </button>
          </div>
        `;

        card.addEventListener("click", () => this.loadClassDetail(cls.id, cls.name));
        wrapper.appendChild(card);
      });
    } catch (err) {
      wrapper.innerHTML = `
        <div class="col-span-full text-center py-16">
          <div class="mx-auto w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
            <i class="fas fa-exclamation-triangle text-4xl text-red-500"></i>
          </div>
          <h3 class="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Gagal Memuat Kelas</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-4">Terjadi kesalahan saat mengambil data kelas</p>
          <button onclick="location.reload()" class="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
            <i class="fas fa-redo mr-2"></i>
            Coba Lagi
          </button>
        </div>
      `;
    }
  },

  async loadClassDetail(classId, className) {
    this.currentClassId = classId;
    this.currentClassName = className;
    this.selectedStudents.clear();

    document.getElementById("grade-class-list-section").classList.add("hidden");
    document.getElementById("grade-detail-section").classList.remove("hidden");

    // Setup back button
    const backButton = document.getElementById("back-to-class-list");
    if (backButton) {
      backButton.onclick = () => {
        document.getElementById("grade-detail-section").classList.add("hidden");
        document.getElementById("grade-class-list-section").classList.remove("hidden");
        this.selectedStudents.clear();
      };
    }

    // Setup enhanced UI
    this.setupEnhancedUI(className);

    // Show loading
    const tbody = document.getElementById("grade-detail-body");
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="px-6 py-16 text-center">
          <div class="flex flex-col items-center space-y-4">
            <div class="animate-spin w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
            <p class="text-lg text-gray-600 dark:text-gray-400 font-medium">Memuat data siswa...</p>
          </div>
        </td>
      </tr>
    `;

    try {
      const students = await TeacherGradeModel.getStudentsByClass(classId);

      // 🔥 FILTER: Hanya siswa yang sudah mengikuti course
      const activeStudents = students.filter(student =>
        student.courses && student.courses.length > 0
      );

      this.studentsData = activeStudents;
      this.filteredData = [...activeStudents];

      if (activeStudents.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="8" class="px-6 py-16 text-center">
              <div class="flex flex-col items-center space-y-4">
                <div class="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <i class="fas fa-user-graduate text-3xl text-gray-400"></i>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Belum Ada Siswa Aktif</h3>
                  <p class="text-gray-500 dark:text-gray-400">Tidak ada siswa yang mengikuti course di kelas ini.</p>
                </div>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      this.renderTable();
      this.setupEventListeners(className);
      this.updateStats();
    } catch (error) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="px-6 py-16 text-center">
            <div class="flex flex-col items-center space-y-4">
              <i class="fas fa-exclamation-circle text-red-500 text-4xl"></i>
              <div>
                <h3 class="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Gagal Memuat Data</h3>
                <p class="text-gray-500 dark:text-gray-400 mb-4">Terjadi kesalahan saat mengambil data siswa</p>
                <button onclick="location.reload()" class="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
                  <i class="fas fa-redo mr-2"></i>
                  Coba Lagi
                </button>
              </div>
            </div>
          </td>
        </tr>
      `;
    }
  },

  setupEnhancedUI(className) {
    // Add class header
    this.addClassHeader(className);
    // Add enhanced controls
    this.addEnhancedControls();
    // Add stats container
    this.addStatsContainer();
  },

  addClassHeader(className) {
    const detailSection = document.getElementById("grade-detail-section");
    if (detailSection && !document.getElementById("class-header")) {
      const headerContainer = document.createElement("div");
      headerContainer.id = "class-header";
      headerContainer.className = "mb-8";

      headerContainer.innerHTML = `
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 class="text-2xl font-bold mb-2">${className}</h2>
              <p class="text-blue-100 text-lg">Manajemen Nilai & Progress Siswa</p>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-right">
                <p class="text-blue-100 text-sm">Total Siswa Aktif</p>
                <p class="text-3xl font-bold" id="header-student-count">-</p>
              </div>
            </div>
          </div>
        </div>
      `;

      const backButton = document.getElementById("back-to-class-list");
      if (backButton && backButton.parentNode) {
        backButton.parentNode.insertBefore(headerContainer, backButton.nextSibling);
      }
    }
  },

  addStatsContainer() {
    const detailSection = document.getElementById("grade-detail-section");
    if (detailSection && !document.getElementById("class-stats")) {
      const statsContainer = document.createElement("div");
      statsContainer.id = "class-stats";
      statsContainer.className = "mb-8";

      const table = document.querySelector("table");
      if (table && table.parentNode) {
        table.parentNode.insertBefore(statsContainer, table);
      }
    }
  },

  addEnhancedControls() {
    const table = document.querySelector("table");
    if (table && table.parentNode && !document.getElementById("enhanced-controls")) {
      const controlsContainer = document.createElement("div");
      controlsContainer.id = "enhanced-controls";
      controlsContainer.className = "mb-6";

      controlsContainer.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div class="flex flex-col lg:flex-row lg:items-center gap-4">
            <!-- Search -->
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <i class="fas fa-search mr-2"></i>Cari Siswa
              </label>
              <div class="relative">
                <input type="text" id="enhanced-search" placeholder="Cari nama siswa, NIM, atau program studi..." 
                       class="w-full pl-4 pr-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              </div>
            </div>

            <!-- Filters and Actions -->
            <div class="flex flex-col sm:flex-row gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <i class="fas fa-filter mr-2"></i>Filter Status
                </label>
                <select id="status-filter" class="px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-w-[150px]">
                  <option value="all">Semua Status</option>
                  <option value="completed">Sudah Selesai</option>
                  <option value="ongoing">Sedang Berlangsung</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <i class="fas fa-download mr-2"></i>Export Data
                </label>
                <button id="download-excel" class="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium text-base">
                  <i class="fas fa-file-excel mr-2"></i>
                  Download Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      table.parentNode.insertBefore(controlsContainer, table);
    }
  },

  setupEventListeners(className) {
    // Enhanced search
    const enhancedSearch = document.getElementById("enhanced-search");
    if (enhancedSearch) {
      enhancedSearch.addEventListener("input", (e) => {
        const keyword = e.target.value.toLowerCase();
        this.filteredData = this.studentsData.filter(s =>
          s.full_name.toLowerCase().includes(keyword) ||
          s.nim.toLowerCase().includes(keyword) ||
          s.program_studi.toLowerCase().includes(keyword)
        );
        this.renderTable();
        this.updateStats();
      });
    }

    // Status filter
    const statusFilter = document.getElementById("status-filter");
    if (statusFilter) {
      statusFilter.addEventListener("change", (e) => {
        const status = e.target.value;
        if (status === "all") {
          this.filteredData = [...this.studentsData];
        } else {
          this.filteredData = this.studentsData.filter(student => {
            const hasCompletedCourse = student.courses?.some(course => course.is_completed);
            return status === "completed" ? hasCompletedCourse : !hasCompletedCourse;
          });
        }
        this.renderTable();
        this.updateStats();
      });
    }

    // Sort by name
    const sortHeader = document.getElementById("sort-by-name");
    if (sortHeader) {
      sortHeader.addEventListener("click", () => {
        this.sortAsc = !this.sortAsc;
        this.filteredData.sort((a, b) => {
          return this.sortAsc
            ? a.full_name.localeCompare(b.full_name)
            : b.full_name.localeCompare(a.full_name);
        });
        this.renderTable();
      });
    }

    // Excel download
    const downloadButton = document.getElementById("download-excel");
    if (downloadButton) {
      downloadButton.onclick = () => {
        this.exportToExcel(`${className}_nilai_siswa.xlsx`, this.filteredData);
      };
    }
  },

  renderTable() {
    const tbody = document.getElementById("grade-detail-body");
    tbody.innerHTML = "";

    if (!this.filteredData.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="px-6 py-12 text-center">
            <div class="flex flex-col items-center space-y-3">
              <i class="fas fa-search text-gray-400 text-3xl"></i>
              <p class="text-lg text-gray-500 dark:text-gray-400">Tidak ada data yang ditemukan</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    this.filteredData.forEach((student, index) => {
      // Render setiap course sebagai row terpisah
      student.courses.forEach((course, courseIndex) => {
        const isFirstCourse = courseIndex === 0;
        this.renderStudentRow(student, course, index, isFirstCourse, student.courses.length);
      });
    });
  },

  renderStudentRow(student, course, studentIndex, showStudentInfo, totalCourses = 1) {
    const tbody = document.getElementById("grade-detail-body");
    const tr = document.createElement("tr");
    tr.className = `
      hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-200
      ${studentIndex % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}
      border-b border-gray-200 dark:border-gray-700
    `;

    // Student info cells (tampil hanya untuk course pertama)
    const studentInfoCells = showStudentInfo ? `
      <td class="px-4 py-4 align-top" ${totalCourses > 1 ? `rowspan="${totalCourses}"` : ''}>
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            ${student.full_name.charAt(0).toUpperCase()}
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-base font-semibold text-gray-900 dark:text-white">${student.full_name}</p>
          </div>
        </div>
      </td>
      <td class="px-4 py-4 align-top" ${totalCourses > 1 ? `rowspan="${totalCourses}"` : ''}>
        <span class="font-mono text-base bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg">${student.nim}</span>
      </td>
      <td class="px-4 py-4 align-top text-base text-gray-700 dark:text-gray-300" ${totalCourses > 1 ? `rowspan="${totalCourses}"` : ''}>
        ${student.program_studi}
      </td>
    ` : '';

    // Course info
    const courseCell = `
      <td class="px-4 py-4 align-top">
        <div class="max-w-xs">
          <p class="text-base font-medium text-gray-800 dark:text-white leading-tight">${course.course_title}</p>
        </div>
      </td>
    `;

    // Grade
    const gradeCell = `
      <td class="px-4 py-4 align-top text-center">
        ${course.score_final_exam !== null && course.score_final_exam !== undefined ?
        (() => {
          const grade = course.score_final_exam;
          let colorClass = "bg-gray-100 text-gray-800";
          if (grade >= 85) colorClass = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
          else if (grade >= 70) colorClass = "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
          else if (grade >= 60) colorClass = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
          else colorClass = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
          return `<span class="inline-flex items-center px-3 py-1.5 rounded-lg text-base font-semibold ${colorClass}">${grade}</span>`;
        })()
        : '<span class="text-gray-400 text-base">-</span>'
      }
      </td>
    `;

    // Progress
    const progressCell = `
      <td class="px-4 py-4 align-top">
        <div class="flex items-center space-x-3">
          <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div class="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300" style="width: ${course.progress_percent || 0}%"></div>
          </div>
          <span class="text-base text-gray-600 dark:text-gray-400 min-w-[45px] font-medium">${course.progress_percent || 0}%</span>
        </div>
      </td>
    `;

    // Status
    const statusCell = `
      <td class="px-4 py-4 align-top text-center">
        ${course.status_kelulusan ?
        (() => {
          const isLulus = course.status_kelulusan.toLowerCase().includes('lulus');
          return `<span class="inline-flex items-center px-3 py-1.5 rounded-lg text-base font-medium ${isLulus
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }">
              ${course.status_kelulusan}
            </span>`;
        })()
        : `<span class="inline-flex items-center px-3 py-1.5 rounded-lg text-base font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
               Berlangsung
             </span>`
      }
      </td>
    `;

    // Actions
    const actionCell = `
      <td class="px-4 py-4 align-top">
        <div class="flex flex-col space-y-2">
          ${course.is_completed && course.score_final_exam !== null ?
        `<button 
              class="print-cert-btn inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium min-w-[120px]"
              data-course="${course.course_id}"
              data-student="${student.student_id}"
              data-class="${this.currentClassId}">
              <i class="fas fa-certificate mr-2"></i>
              Kirim Sertifikat
            </button>` : ''
      }
          ${(course.score_final_exam === null || course.score_final_exam === undefined) && student.email ?
        `<button 
              class="notify-student-btn inline-flex items-center justify-center px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium min-w-[120px]"
              data-email="${student.email}"
              data-name="${student.full_name}"
              data-course="${course.course_id}">
              <i class="fas fa-envelope mr-2"></i>
              Kirim Notifikasi
            </button>` : ''
      }
        </div>
      </td>
    `;

    tr.innerHTML = `${studentInfoCells}${courseCell}${gradeCell}${progressCell}${statusCell}${actionCell}`;
    tbody.appendChild(tr);
    this.attachActionListeners(tr);
  },

  attachActionListeners(row) {
    // Certificate buttons
    row.querySelectorAll(".print-cert-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Mengirim...';

        const payload = {
          course_id: btn.dataset.course,
          student_id: btn.dataset.student,
          class_id: btn.dataset.class,
        };

        try {
          const result = await TeacherGradeModel.sendStudentCertificateByTeacher(payload);
          this.showNotification("✅ Sertifikat berhasil dikirim ke email siswa", "success");
        } catch (err) {
          this.showNotification(`❌ Gagal mengirim sertifikat: ${err.message}`, "error");
        } finally {
          btn.disabled = false;
          btn.innerHTML = originalText;
        }
      });
    });

    // Notification buttons  
    row.querySelectorAll(".notify-student-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const email = btn.dataset.email;
        const name = btn.dataset.name;
        const courseId = btn.dataset.course;

        try {
          const reason = await promptTextarea(
            `Kirim pesan pengingat untuk ${name}:`,
            'Mohon segera menyelesaikan course untuk mendapatkan sertifikat.'
          );

          if (!reason || reason.trim().length === 0) {
            this.showNotification("❌ Pesan tidak boleh kosong", "error");
            return;
          }

          const originalText = btn.innerHTML;
          btn.disabled = true;
          btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Mengirim...';

          const result = await TeacherGradeModel.notifyStudent({
            email, name, reason, course_id: courseId
          });

          this.showNotification("✅ Notifikasi berhasil dikirim ke email siswa", "success");
        } catch (err) {
          this.showNotification(`❌ Gagal mengirim notifikasi: ${err.message}`, "error");
        } finally {
          btn.disabled = false;
          btn.innerHTML = originalText;
        }
      });
    });
  },

  updateStats() {
    const statsContainer = document.getElementById("class-stats");
    const headerCount = document.getElementById("header-student-count");

    const totalStudents = this.filteredData.length;
    const completedStudents = this.filteredData.filter(s =>
      s.courses?.some(c => c.is_completed)
    ).length;

    // Calculate average score for completed courses
    let totalScores = 0;
    let scoreCount = 0;
    this.filteredData.forEach(s => {
      s.courses?.forEach(c => {
        if (c.score_final_exam !== null && c.score_final_exam !== undefined) {
          totalScores += c.score_final_exam;
          scoreCount++;
        }
      });
    });
    const averageScore = scoreCount > 0 ? (totalScores / scoreCount).toFixed(1) : 0;

    // Update header count
    if (headerCount) {
      headerCount.textContent = totalStudents;
    }

    if (statsContainer) {
      statsContainer.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-100 text-sm font-medium">Siswa Selesai</p>
                <p class="text-3xl font-bold">${completedStudents}</p>
                <p class="text-green-100 text-sm">dari ${totalStudents} siswa</p>
              </div>
              <i class="fas fa-check-circle text-4xl text-green-200"></i>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-100 text-sm font-medium">Rata-rata Nilai</p>
                <p class="text-3xl font-bold">${averageScore}</p>
                <p class="text-blue-100 text-sm">dari ${scoreCount} nilai</p>
              </div>
              <i class="fas fa-chart-line text-4xl text-blue-200"></i>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-purple-100 text-sm font-medium">Tingkat Kelulusan</p>
                <p class="text-3xl font-bold">${totalStudents > 0 ? Math.round((completedStudents / totalStudents) * 100) : 0}%</p>
                <p class="text-purple-100 text-sm">dari total siswa</p>
              </div>
              <i class="fas fa-graduation-cap text-4xl text-purple-200"></i>
            </div>
          </div>
        </div>
      `;
    }
  },

  exportToExcel(filename, data) {
    if (!data || data.length === 0) {
      this.showNotification("❌ Tidak ada data untuk diekspor", "error");
      return;
    }

    if (typeof XLSX === 'undefined') {
      this.showNotification("⚠️ Sedang memuat library Excel...", "warning");
      setTimeout(() => this.exportToExcel(filename, data), 2000);
      return;
    }

    try {
      const excelData = [];

      data.forEach((student) => {
        student.courses.forEach((course) => {
          excelData.push({
            "Nama Siswa": student.full_name,
            "NIM": student.nim,
            "Program Studi": student.program_studi,
            "Judul Course": course.course_title,
            "Nilai Akhir": course.score_final_exam !== null ? course.score_final_exam : "-",
            "Progress (%)": course.progress_percent || 0,
            "Status": course.is_completed ? "Selesai" : "Berlangsung",
            "Kelulusan": course.status_kelulusan || "Menunggu"
          });
        });
      });

      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();

      // Set column widths
      ws['!cols'] = [
        { wch: 25 }, // Nama Siswa
        { wch: 15 }, // NIM
        { wch: 25 }, // Program Studi
        { wch: 40 }, // Judul Course
        { wch: 12 }, // Nilai Akhir
        { wch: 12 }, // Progress
        { wch: 15 }, // Status
        { wch: 15 }  // Kelulusan
      ];

      XLSX.utils.book_append_sheet(wb, ws, "Data Nilai Siswa");
      XLSX.writeFile(wb, filename);

      this.showNotification(`✅ File Excel berhasil diunduh: ${filename}`, "success");
    } catch (error) {
      console.error("Export error:", error);
      this.showNotification("❌ Gagal mengekspor file Excel", "error");
    }
  },

  showNotification(message, type = "info") {
    // Remove existing notifications
    document.querySelectorAll('.notification-toast').forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification-toast fixed top-6 right-6 z-50 p-4 rounded-xl shadow-2xl transform transition-all duration-300 translate-x-full max-w-md`;

    let bgColor, textColor, icon;
    switch (type) {
      case 'success':
        bgColor = 'bg-green-500';
        textColor = 'text-white';
        icon = 'fas fa-check-circle';
        break;
      case 'error':
        bgColor = 'bg-red-500';
        textColor = 'text-white';
        icon = 'fas fa-exclamation-circle';
        break;
      case 'warning':
        bgColor = 'bg-yellow-500';
        textColor = 'text-white';
        icon = 'fas fa-exclamation-triangle';
        break;
      default:
        bgColor = 'bg-blue-500';
        textColor = 'text-white';
        icon = 'fas fa-info-circle';
    }

    notification.className += ` ${bgColor} ${textColor}`;
    notification.innerHTML = `
      <div class="flex items-start space-x-3">
        <i class="${icon} text-xl mt-0.5"></i>
        <div class="flex-1">
          <p class="font-medium text-base leading-relaxed">${message}</p>
        </div>
        <button class="hover:bg-black hover:bg-opacity-10 rounded-lg p-1 transition-colors" onclick="this.parentElement.parentElement.remove()">
          <i class="fas fa-times text-lg"></i>
        </button>
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.remove('translate-x-full'), 100);
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }
};

export default TeacherGradePresenter;