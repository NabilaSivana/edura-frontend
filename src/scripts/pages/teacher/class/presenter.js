// File: routes/class/presenter.js - Optimized Version
import TeacherClassModel from "./model.js";

const TeacherClassPresenter = {
  async init() {
    this.loadClasses();
    this.handleCreateForm();
    this.setupAnimations();
  },

  async loadClasses() {
    const loading = document.getElementById("class-loading");
    const list = document.getElementById("class-list");
    const emptyState = document.getElementById("empty-state");

    loading.style.display = "block";
    list.innerHTML = "";
    emptyState?.classList.add("hidden");

    try {
      const classes = await TeacherClassModel.getClasses();

      if (!classes.length) {
        emptyState?.classList.remove("hidden");
        this.updateStats(0, 0);
        return;
      }

      let totalStudents = 0;
      for (const cls of classes) {
        const students = await TeacherClassModel.getClassStudents(cls.id);
        totalStudents += students.length;
        const card = this.createClassCard(cls, students);
        list.appendChild(card);

        // Add stagger animation
        setTimeout(() => {
          card.classList.add("animate-fade-in");
        }, classes.indexOf(cls) * 100);
      }

      this.updateStats(classes.length, totalStudents);
    } catch (err) {
      list.innerHTML = `
        <div class="col-span-full text-center py-8">
          <div class="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">Gagal memuat kelas</h3>
          <p class="text-gray-600">Silakan coba lagi nanti</p>
        </div>
      `;
      console.error(err);
    } finally {
      loading.style.display = "none";
    }
  },

  updateStats(totalClasses, totalStudents) {
    const classesEl = document.getElementById("total-classes");
    const studentsEl = document.getElementById("total-students");

    if (classesEl) classesEl.textContent = `${totalClasses} Kelas`;
    if (studentsEl) studentsEl.textContent = `${totalStudents} Mahasiswa`;
  },

  setupAnimations() {
    // Add CSS for animations
    const style = document.createElement("style");
    style.textContent = `
      .animate-fade-in {
        animation: fadeInUp 0.5s ease-out forwards;
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .class-card {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
      }

      .class-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      }

      .student-item {
        transition: all 0.2s ease;
      }

      .student-item:hover {
        background-color: #f8fafc;
        transform: translateX(4px);
      }

      .see-more-btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        transition: all 0.3s ease;
      }

      .see-more-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
      }

      .compact-student-preview {
        max-height: 180px;
        overflow: hidden;
        position: relative;
      }

      .compact-student-preview::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 30px;
        background: linear-gradient(transparent, white);
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
  },

  handleCreateForm() {
    const form = document.getElementById("create-class-form");
    const messageEl = document.getElementById("form-message");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const nameInput = document.getElementById("name");
      const name = nameInput.value.trim();

      if (!name) return;

      // Loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = "⏳ Membuat...";
      messageEl.textContent = "";

      try {
        await TeacherClassModel.createClass({ name });
        form.reset();
        this.loadClasses();

        // Hide form after successful creation
        document
          .getElementById("create-class-form-container")
          .classList.add("hidden");

        // Success message
        messageEl.className = "text-sm mt-3 text-green-600";
        messageEl.textContent = "✅ Kelas berhasil dibuat!";
        setTimeout(() => (messageEl.textContent = ""), 3000);
      } catch (err) {
        console.error("Gagal membuat kelas:", err);
        messageEl.className = "text-sm mt-3 text-red-600";
        messageEl.textContent =
          "❌ Gagal membuat kelas. Pastikan profil teacher lengkap.";
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = "🚀 Buat Kelas";
      }
    });
  },

  createClassCard(cls, students = []) {
    const wrapper = document.createElement("div");
    wrapper.className =
      "class-card bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300";

    const studentCount = students.length;
    const colorClasses = this.getCardColor(studentCount);

    wrapper.innerHTML = `
      <div class="p-4 sm:p-6">
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1 min-w-0">
            <h3 class="text-lg sm:text-xl font-bold text-gray-800 mb-2 truncate" title="${
              cls.name
            }">${cls.name}</h3>
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <span class="text-xs sm:text-sm text-gray-600">Kode Kelas:</span>
              <button 
                class="copy-code-btn px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs sm:text-sm hover:bg-gray-200 transition-colors self-start"
                data-code="${cls.class_code}"
                title="Klik untuk menyalin kode"
              >
                📋 ${cls.class_code}
              </button>
            </div>
            <p class="text-xs sm:text-sm text-gray-600 truncate" title="${
              cls.perguruan_tinggi
            }">🏫 ${cls.perguruan_tinggi}</p>
          </div>
          <div class="flex gap-1 sm:gap-2 flex-shrink-0">
            <button class="edit-btn p-1 sm:p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              ✏️
            </button>
            <button class="delete-btn p-1 sm:p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              🗑️
            </button>
          </div>
        </div>

        <div class="mb-4">
          <div class="flex items-center gap-2 mb-3">
            <div class="bg-gradient-to-r ${
              colorClasses.gradient
            } text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              👥 ${studentCount} Mahasiswa
            </div>
          </div>
          
          <div class="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-semibold text-gray-800 text-sm sm:text-base">Daftar Mahasiswa</h4>
              <span class="text-xs sm:text-sm text-gray-500">${studentCount} orang</span>
            </div>
            
            ${this.renderStudentList(students, cls.id, cls.name)}
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners(wrapper, cls);
    return wrapper;
  },

  renderStudentList(students, classId, className) {
    if (students.length === 0) {
      return `
        <div class="text-center py-4 sm:py-6">
          <div class="text-gray-400 text-2xl sm:text-3xl mb-2">👥</div>
          <p class="text-gray-600 text-sm">Belum ada mahasiswa</p>
          <p class="text-gray-500 text-xs mt-1">Bagikan kode kelas untuk mengundang mahasiswa</p>
        </div>
      `;
    }

    // Show only 1 student in card preview
    const displayStudent = students[0];
    const hasMore = students.length > 1;

    return `
      <div class="space-y-2">
        <div class="student-item flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-200 transition-all">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r ${this.getAvatarColor(
              displayStudent.id
            )} rounded-full flex items-center justify-center text-white font-medium text-sm sm:text-base">
              ${displayStudent.full_name.charAt(0).toUpperCase()}
            </div>
            <div class="min-w-0 flex-1">
              <p class="font-medium text-gray-800 text-sm sm:text-base truncate">${
                displayStudent.full_name
              }</p>
              <p class="text-xs sm:text-sm text-gray-600 truncate">${
                displayStudent.nim
              }</p>
              <p class="text-xs text-gray-500 truncate">${
                displayStudent.program_studi
              }</p>
            </div>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">#1</span>
            <button 
              class="kick-btn text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
              data-sid="${displayStudent.id}"
              title="Keluarkan mahasiswa"
            >
              ❌
            </button>
          </div>
        </div>
        
        ${
          hasMore
            ? `
          <div class="mt-3 text-center">
            <button 
              class="see-more-btn w-full py-2 sm:py-3 text-white rounded-lg font-medium transition-all transform hover:scale-105 text-sm sm:text-base"
              data-class-id="${classId}"
              data-class-name="${className}"
            >
              👀 Lihat Semua ${students.length} Mahasiswa
            </button>
          </div>
        `
            : ""
        }
      </div>
    `;
  },

  getCardColor(studentCount) {
    if (studentCount === 0) return { gradient: "from-gray-500 to-gray-600" };
    if (studentCount < 5) return { gradient: "from-blue-500 to-blue-600" };
    if (studentCount < 15) return { gradient: "from-green-500 to-green-600" };
    return { gradient: "from-purple-500 to-purple-600" };
  },

  getAvatarColor(id) {
    const colors = [
      "from-red-400 to-red-500",
      "from-blue-400 to-blue-500",
      "from-green-400 to-green-500",
      "from-purple-400 to-purple-500",
      "from-pink-400 to-pink-500",
      "from-indigo-400 to-indigo-500",
      "from-yellow-400 to-yellow-500",
      "from-teal-400 to-teal-500",
    ];
    return colors[id % colors.length];
  },

  attachEventListeners(wrapper, cls) {
    // Delete class
    wrapper
      .querySelector(".delete-btn")
      ?.addEventListener("click", async (e) => {
        e.stopPropagation();
        const result = await this.showConfirmDialog(
          "Hapus Kelas",
          `Yakin ingin menghapus kelas "${cls.name}"? Tindakan ini tidak dapat dibatalkan.`,
          "Hapus",
          "Batal"
        );

        if (result) {
          await TeacherClassModel.deleteClass(cls.id);
          wrapper.style.animation = "fadeOut 0.3s ease-out";
          setTimeout(() => this.loadClasses(), 300);
        }
      });

    // Edit class
    wrapper.querySelector(".edit-btn")?.addEventListener("click", async (e) => {
      e.stopPropagation();
      const newName = prompt("Ubah nama kelas:", cls.name);
      if (newName && newName.trim() !== cls.name) {
        await TeacherClassModel.updateClass(cls.id, { name: newName.trim() });
        this.loadClasses();
      }
    });

    // Remove student
    wrapper.querySelectorAll(".kick-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const studentId = btn.dataset.sid;
        const studentName = btn
          .closest(".student-item")
          .querySelector(".font-medium").textContent;

        const result = await this.showConfirmDialog(
          "Keluarkan Mahasiswa",
          `Yakin ingin mengeluarkan "${studentName}" dari kelas ini?`,
          "Keluarkan",
          "Batal"
        );

        if (result) {
          await TeacherClassModel.removeStudent(cls.id, studentId);
          this.loadClasses();
        }
      });
    });

    // Copy class code
    wrapper
      .querySelector(".copy-code-btn")
      ?.addEventListener("click", async (e) => {
        e.stopPropagation();
        const code = e.currentTarget.dataset.code;

        try {
          await navigator.clipboard.writeText(code);
          const originalContent = e.currentTarget.innerHTML;
          e.currentTarget.innerHTML = `✅ Disalin!`;
          e.currentTarget.style.backgroundColor = "#dcfce7";
          e.currentTarget.style.color = "#16a34a";

          setTimeout(() => {
            e.currentTarget.innerHTML = originalContent;
            e.currentTarget.style.backgroundColor = "";
            e.currentTarget.style.color = "";
          }, 2000);
        } catch (err) {
          // Fallback for older browsers
          const textArea = document.createElement("textarea");
          textArea.value = code;
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();

          try {
            document.execCommand("copy");
            const originalContent = e.currentTarget.innerHTML;
            e.currentTarget.innerHTML = `✅ Disalin!`;
            e.currentTarget.style.backgroundColor = "#dcfce7";
            e.currentTarget.style.color = "#16a34a";

            setTimeout(() => {
              e.currentTarget.innerHTML = originalContent;
              e.currentTarget.style.backgroundColor = "";
              e.currentTarget.style.color = "";
            }, 2000);
          } catch (err2) {
            alert(`Kode kelas: ${code}`);
          }

          document.body.removeChild(textArea);
        }
      });
    wrapper
      .querySelector(".copy-code-btn")
      ?.addEventListener("click", async (e) => {
        e.stopPropagation();
        const code = e.currentTarget.dataset.code;

        try {
          await navigator.clipboard.writeText(code);
          const originalContent = e.currentTarget.innerHTML;
          e.currentTarget.innerHTML = `✅ ${code}`;

          setTimeout(() => {
            e.currentTarget.innerHTML = originalContent;
          }, 2000);
        } catch (err) {
          alert("Gagal menyalin kode kelas");
        }
      });

    // See all students
    wrapper
      .querySelector(".see-more-btn")
      ?.addEventListener("click", async (e) => {
        e.stopPropagation();
        const classId = e.currentTarget.dataset.classId;
        const className = e.currentTarget.dataset.className;

        try {
          const students = await TeacherClassModel.getClassStudents(classId);
          this.showStudentsModal(className, students, classId);
        } catch (err) {
          console.error("Error loading students:", err);
        }
      });
  },

  async showConfirmDialog(title, message, confirmText, cancelText) {
    return new Promise((resolve) => {
      const dialog = document.createElement("div");
      dialog.className =
        "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4";
      dialog.innerHTML = `
        <div class="bg-white rounded-xl p-6 max-w-md w-full">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">${title}</h3>
          <p class="text-gray-600 mb-6">${message}</p>
          <div class="flex gap-3 justify-end">
            <button class="cancel-btn px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
              ${cancelText}
            </button>
            <button class="confirm-btn px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              ${confirmText}
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(dialog);

      dialog.querySelector(".confirm-btn").onclick = () => {
        document.body.removeChild(dialog);
        resolve(true);
      };

      dialog.querySelector(".cancel-btn").onclick = () => {
        document.body.removeChild(dialog);
        resolve(false);
      };

      dialog.onclick = (e) => {
        if (e.target === dialog) {
          document.body.removeChild(dialog);
          resolve(false);
        }
      };
    });
  },

  showStudentsModal(className, students, classId) {
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4";
    modal.innerHTML = `
      <div class="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <h3 class="text-2xl font-bold mb-2">${className}</h3>
          <p class="text-blue-100">Daftar Mahasiswa (${
            students.length
          } orang)</p>
        </div>
        
        <div class="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
          ${
            students.length === 0
              ? `
            <div class="text-center py-16">
              <div class="text-gray-400 text-6xl mb-4">👥</div>
              <h4 class="text-xl font-semibold text-gray-800 mb-2">Belum ada mahasiswa</h4>
              <p class="text-gray-600">Bagikan kode kelas untuk mengundang mahasiswa</p>
            </div>
          `
              : `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${students
                .map(
                  (student, index) => `
                <div class="student-item flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-gradient-to-r ${this.getAvatarColor(
                      student.id
                    )} rounded-full flex items-center justify-center text-white font-bold text-lg">
                      ${student.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p class="font-semibold text-gray-800">${
                        student.full_name
                      }</p>
                      <p class="text-sm text-gray-600">${student.nim}</p>
                      <p class="text-xs text-gray-500">${
                        student.program_studi
                      }</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-gray-500 bg-white px-2 py-1 rounded-full font-medium">#${
                      index + 1
                    }</span>
                    <button 
                      class="kick-student-btn text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                      data-sid="${student.id}"
                      data-name="${student.full_name}"
                      data-cid="${classId}"
                      title="Keluarkan mahasiswa"
                    >
                      ❌
                    </button>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          `
          }
        </div>
        
        <div class="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <div class="text-sm text-gray-600">
            Total: <span class="font-semibold">${
              students.length
            } mahasiswa</span>
          </div>
          <button class="close-modal px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            Tutup
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Close modal events
    modal.querySelectorAll(".close-modal").forEach((btn) => {
      btn.onclick = () => {
        document.body.removeChild(modal);
      };
    });

    modal.onclick = (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    };

    // Escape key to close
    const escapeHandler = (e) => {
      if (e.key === "Escape") {
        document.body.removeChild(modal);
        document.removeEventListener("keydown", escapeHandler);
      }
    };
    document.addEventListener("keydown", escapeHandler);

    // Remove student from modal
    modal.querySelectorAll(".kick-student-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const studentId = btn.dataset.sid;
        const studentName = btn.dataset.name;
        const classId = btn.dataset.cid;

        const result = await this.showConfirmDialog(
          "Keluarkan Mahasiswa",
          `Yakin ingin mengeluarkan "${studentName}" dari kelas ini?`,
          "Keluarkan",
          "Batal"
        );

        if (result) {
          await TeacherClassModel.removeStudent(classId, studentId);
          document.body.removeChild(modal);
          this.loadClasses();
        }
      });
    });
  },

  async loadClasses() {
    const loading = document.getElementById("class-loading");
    const list = document.getElementById("class-list");
    const emptyState = document.getElementById("empty-state");

    loading.style.display = "block";
    list.innerHTML = "";
    emptyState?.classList.add("hidden");

    try {
      const classes = await TeacherClassModel.getClasses();

      if (!classes.length) {
        emptyState?.classList.remove("hidden");
        this.updateStats(0, 0);
        return;
      }

      let totalStudents = 0;
      for (const cls of classes) {
        const students = await TeacherClassModel.getClassStudents(cls.id);
        totalStudents += students.length;
        const card = this.createClassCard(cls, students);
        list.appendChild(card);

        // Add stagger animation
        setTimeout(() => {
          card.classList.add("animate-fade-in");
        }, classes.indexOf(cls) * 100);
      }

      this.updateStats(classes.length, totalStudents);
    } catch (err) {
      list.innerHTML = `
                <div class="col-span-full text-center py-16">
                    <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="text-red-500 text-2xl">⚠️</span>
                    </div>
                    <p class="text-red-600 font-medium">Gagal memuat kelas</p>
                    <p class="text-gray-500 text-sm mt-1">Silakan coba lagi nanti</p>
                </div>
            `;
      console.error(err);
    } finally {
      loading.style.display = "none";
    }
  },

  updateStats(totalClasses, totalStudents) {
    const classesEl = document.getElementById("total-classes");
    const studentsEl = document.getElementById("total-students");

    if (classesEl) classesEl.textContent = `${totalClasses} Kelas`;
    if (studentsEl) studentsEl.textContent = `${totalStudents} Mahasiswa`;
  },

  setupAnimations() {
    // Add CSS for animations
    const style = document.createElement("style");
    style.textContent = `
            .animate-fade-in {
                animation: fadeInUp 0.5s ease-out forwards;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .class-card {
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.3s ease;
            }
            
            .class-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            }
        `;
    document.head.appendChild(style);
  },

  handleCreateForm() {
    const form = document.getElementById("create-class-form");
    const messageEl = document.getElementById("form-message");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const nameInput = document.getElementById("name");
      const name = nameInput.value.trim();

      if (!name) return;

      // Loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = "⏳ Membuat...";
      messageEl.textContent = "";

      try {
        await TeacherClassModel.createClass({ name });
        form.reset();
        this.loadClasses();

        // Success message
        messageEl.className = "text-sm mt-3 text-green-600";
        messageEl.textContent = "✅ Kelas berhasil dibuat!";
        setTimeout(() => (messageEl.textContent = ""), 3000);
      } catch (err) {
        console.error("Gagal membuat kelas:", err);
        messageEl.className = "text-sm mt-3 text-red-600";
        messageEl.textContent =
          "❌ Gagal membuat kelas. Pastikan profil teacher lengkap.";
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = "🚀 Buat Kelas";
      }
    });
  },

  createClassCard(cls, students = []) {
    const wrapper = document.createElement("div");
    wrapper.className =
      "rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300";

    const studentCount = students.length;
    const colorClasses = this.getCardColor(studentCount);
    wrapper.innerHTML = `
  <div class="relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md">
    <!-- Card Header -->
    <div class="bg-gradient-to-r ${
      colorClasses.gradient
    } p-6 text-white relative overflow-hidden">
      <div class="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-6 translate-x-6"></div>
      <div class="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-6 -translate-x-6"></div>

      <div class="relative z-10">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-xl font-bold truncate">${cls.name}</h3>
          <div class="flex items-center space-x-2">
            <button class="edit-btn p-2 hover:bg-white/20 rounded-full transition-colors" 
              data-id="${cls.id}" data-name="${cls.name}" title="Edit Kelas">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
            <button class="delete-btn p-2 hover:bg-white/20 rounded-full transition-colors" 
              data-id="${cls.id}" title="Hapus Kelas">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-xl p-3 mb-3">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">Kode Kelas</span>
            <button class="copy-code-btn flex items-center space-x-1 hover:bg-white/20 px-2 py-1 rounded-lg transition-colors" 
              data-code="${cls.class_code}" title="Salin kode">
              <span class="font-mono text-lg">${cls.class_code}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between text-sm">
          <span class="bg-white/20 dark:bg-white/10 px-3 py-1 rounded-full">
            🏫 ${cls.perguruan_tinggi}
          </span>
          <span class="bg-white/20 dark:bg-white/10 px-3 py-1 rounded-full">
            👥 ${studentCount} Mahasiswa
          </span>
        </div>
      </div>
    </div>

    <!-- Card Body -->
    <div class="p-6 bg-white dark:bg-gray-900">
      <div class="mb-4">
        <div class="flex items-center justify-between mb-3">
          <h4 class="font-semibold text-gray-800 dark:text-gray-100">Daftar Mahasiswa</h4>
          <span class="text-sm text-gray-500 dark:text-gray-300">${studentCount} orang</span>
        </div>

        ${
          studentCount === 0
            ? `
              <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span class="text-2xl">👥</span>
                </div>
                <p class="text-sm">Belum ada mahasiswa</p>
                <p class="text-xs mt-1">Bagikan kode kelas untuk mengundang mahasiswa</p>
              </div>
            `
            : `
              <div class="space-y-2">
                ${students
                  .slice(0, 3)
                  .map(
                    (s) => `
                  <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 bg-gradient-to-r ${this.getAvatarColor(
                        s.id
                      )} rounded-full flex items-center justify-center text-white font-bold">
                        ${s.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p class="font-medium text-gray-800 dark:text-gray-100">${
                          s.full_name
                        }</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">${
                          s.nim
                        } • ${s.program_studi}</p>
                      </div>
                    </div>
                    <button class="kick-btn text-red-500 hover:bg-red-50 dark:hover:bg-red-900 p-2 rounded-lg transition-colors"
                      data-sid="${s.id}" data-cid="${
                      cls.id
                    }" title="Keluarkan mahasiswa">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                `
                  )
                  .join("")}

                ${
                  studentCount > 3
                    ? `
                      <div class="pt-3 border-t border-gray-200 dark:border-gray-700">
                        <button class="see-all-btn w-full flex items-center justify-center space-x-2 p-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900 dark:hover:bg-blue-800 rounded-xl transition-colors text-blue-600 dark:text-blue-300 font-medium"
                          data-class-id="${cls.id}" data-class-name="${cls.name}">
                          <span>Lihat Semua ${studentCount} Mahasiswa</span>
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </button>
                      </div>
                    `
                    : ""
                }
              </div>
            `
        }
      </div>
    </div>
  </div>
`;

    this.attachEventListeners(wrapper, cls);
    return wrapper;
  },

  getCardColor(studentCount) {
    if (studentCount === 0) return { gradient: "from-gray-500 to-gray-600" };
    if (studentCount < 5) return { gradient: "from-blue-500 to-blue-600" };
    if (studentCount < 15) return { gradient: "from-green-500 to-green-600" };
    return { gradient: "from-purple-500 to-purple-600" };
  },

  getAvatarColor(id) {
    const colors = [
      "from-red-400 to-red-500",
      "from-blue-400 to-blue-500",
      "from-green-400 to-green-500",
      "from-purple-400 to-purple-500",
      "from-pink-400 to-pink-500",
      "from-indigo-400 to-indigo-500",
      "from-yellow-400 to-yellow-500",
      "from-teal-400 to-teal-500",
    ];
    return colors[id % colors.length];
  },

  attachEventListeners(wrapper, cls) {
    // Delete class
    wrapper
      .querySelector(".delete-btn")
      ?.addEventListener("click", async (e) => {
        e.stopPropagation();
        const result = await this.showConfirmDialog(
          "Hapus Kelas",
          `Yakin ingin menghapus kelas "${cls.name}"? Tindakan ini tidak dapat dibatalkan.`,
          "Hapus",
          "Batal"
        );

        if (result) {
          await TeacherClassModel.deleteClass(cls.id);
          wrapper.style.animation = "fadeOut 0.3s ease-out";
          setTimeout(() => this.loadClasses(), 300);
        }
      });

    // Edit class
    wrapper.querySelector(".edit-btn")?.addEventListener("click", async (e) => {
      e.stopPropagation();
      const newName = prompt("Ubah nama kelas:", cls.name);
      if (newName && newName.trim() !== cls.name) {
        await TeacherClassModel.updateClass(cls.id, { name: newName.trim() });
        this.loadClasses();
      }
    });

    // Remove student
    wrapper.querySelectorAll(".kick-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const studentId = btn.dataset.sid;
        const studentName = btn
          .closest(".flex")
          .querySelector(".font-medium").textContent;

        const result = await this.showConfirmDialog(
          "Keluarkan Mahasiswa",
          `Yakin ingin mengeluarkan "${studentName}" dari kelas ini?`,
          "Keluarkan",
          "Batal"
        );

        if (result) {
          await TeacherClassModel.removeStudent(cls.id, studentId);
          this.loadClasses();
        }
      });
    });

    // Copy class code
    wrapper
      .querySelector(".copy-code-btn")
      ?.addEventListener("click", async (e) => {
        e.stopPropagation();
        const code = e.currentTarget.dataset.code;

        try {
          await navigator.clipboard.writeText(code);
          const originalContent = e.currentTarget.innerHTML;
          e.currentTarget.innerHTML = `
                    <span class="font-mono text-lg">${code}</span>
                    <svg class="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                `;

          setTimeout(() => {
            e.currentTarget.innerHTML = originalContent;
          }, 2000);
        } catch (err) {
          alert("Berhasil menyalin kode kelas");
        }
      });

    // See all students
    wrapper
      .querySelector(".see-all-btn")
      ?.addEventListener("click", async (e) => {
        e.stopPropagation();
        const classId = e.currentTarget.dataset.classId;
        const className = e.currentTarget.dataset.className;

        try {
          const students = await TeacherClassModel.getClassStudents(classId);
          this.showStudentsModal(className, students, classId);
        } catch (err) {
          console.error("Error loading students:", err);
        }
      });
  },

  async showConfirmDialog(title, message, confirmText, cancelText) {
    return new Promise((resolve) => {
      const dialog = document.createElement("div");
      dialog.className =
        "fixed inset-0 bg-black/50 flex items-center justify-center z-50";
      dialog.innerHTML = `
                <div class="bg-white rounded-2xl p-6 max-w-md mx-4 shadow-2xl">
                    <h3 class="text-lg font-semibold mb-3">${title}</h3>
                    <p class="text-gray-600 mb-6">${message}</p>
                    <div class="flex space-x-3">
                        <button class="confirm-btn flex-1 bg-red-600 text-white py-2 px-4 rounded-xl hover:bg-red-700 transition-colors">
                            ${confirmText}
                        </button>
                        <button class="cancel-btn flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-xl hover:bg-gray-300 transition-colors">
                            ${cancelText}
                        </button>
                    </div>
                </div>
            `;

      document.body.appendChild(dialog);

      dialog.querySelector(".confirm-btn").onclick = () => {
        document.body.removeChild(dialog);
        resolve(true);
      };

      dialog.querySelector(".cancel-btn").onclick = () => {
        document.body.removeChild(dialog);
        resolve(false);
      };

      dialog.onclick = (e) => {
        if (e.target === dialog) {
          document.body.removeChild(dialog);
          resolve(false);
        }
      };
    });
  },
};

export default TeacherClassPresenter;
