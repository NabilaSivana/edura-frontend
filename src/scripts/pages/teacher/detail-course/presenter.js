import CourseDetailModel from "./model.js";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function showConfirmModal(title, message, onConfirm) {
  const modal = document.getElementById("confirm-modal");
  const titleEl = document.getElementById("confirm-title");
  const messageEl = document.getElementById("confirm-message");
  const confirmBtn = document.getElementById("confirm-ok");

  titleEl.textContent = title;
  messageEl.textContent = message;
  modal.classList.remove("hidden");

  const handleConfirm = async () => {
    modal.classList.add("hidden");
    confirmBtn.removeEventListener("click", handleConfirm);
    await onConfirm();
  };

  confirmBtn.addEventListener("click", handleConfirm);
}

const CourseDetailPresenter = {
  // Helper function to ensure marked and highlight.js are loaded
  async ensureMarkedAndHighlightLoaded() {
    // Check if both marked and hljs are already loaded
    if (window.marked && window.hljs) {
      return true;
    }

    return new Promise((resolve) => {
      let markedLoaded = !!window.marked;
      let hljsLoaded = !!window.hljs;

      const checkBothLoaded = () => {
        if (markedLoaded && hljsLoaded) {
          // Configure marked to use highlight.js
          if (window.marked && window.hljs) {
            marked.setOptions({
              highlight: function (code, lang) {
                const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                return hljs.highlight(code, { language }).value;
              },
              breaks: true,
              gfm: true
            });
          }
          resolve(true);
        }
      };

      // Load marked if not loaded
      if (!markedLoaded) {
        const markedScript = document.createElement('script');
        markedScript.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
        markedScript.onload = () => {
          markedLoaded = true;
          checkBothLoaded();
        };
        markedScript.onerror = () => {
          console.error('Failed to load marked.js');
          resolve(false);
        };

        if (!document.querySelector('script[src*="marked"]')) {
          document.body.appendChild(markedScript);
        }
      }

      // Load highlight.js if not loaded
      if (!hljsLoaded) {
        const hlScript = document.createElement('script');
        hlScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
        hlScript.onload = () => {
          hljsLoaded = true;
          checkBothLoaded();
        };
        hlScript.onerror = () => {
          console.error('Failed to load highlight.js');
          resolve(false);
        };

        if (!document.querySelector('script[src*="highlight.js"]')) {
          document.body.appendChild(hlScript);

          // Also load CSS for highlighting
          const hlCss = document.createElement('link');
          hlCss.rel = 'stylesheet';
          hlCss.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css';
          document.head.appendChild(hlCss);
        }
      }

      // If both are already loaded
      if (markedLoaded && hljsLoaded) {
        checkBothLoaded();
      }

      // Timeout after 10 seconds
      setTimeout(() => {
        resolve(false);
      }, 10000);
    });
  },

  // Function to render markdown content
  async renderMarkdownContent(rawContent) {
    if (!rawContent) return "Belum ada konten";

    // Ensure libraries are loaded
    await this.ensureMarkedAndHighlightLoaded();

    let parsedContent = "";
    try {
      // Try to parse as JSON first (in case content is stored as JSON)
      const parsed = JSON.parse(rawContent);
      parsedContent = parsed?.text || rawContent;
    } catch {
      // If not JSON, use as is
      parsedContent = typeof rawContent === "string" ? rawContent : "";
    }

    if (parsedContent && window.marked) {
      try {
        const htmlContent = marked.parse(parsedContent);
        return `
          <article class="prose prose-sm prose-gray dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-pre:bg-gray-900 dark:prose-pre:bg-gray-800 prose-img:rounded-lg prose-img:shadow-sm">
            ${htmlContent}
          </article>
        `;
      } catch (error) {
        console.error("Error parsing markdown:", error);
        // Fallback to plain text with pre-wrap
        return `
          <article class="prose prose-sm prose-gray dark:prose-invert max-w-none">
            <pre class="whitespace-pre-wrap font-sans text-sm leading-relaxed">${escapeHtml(parsedContent)}</pre>
          </article>
        `;
      }
    } else if (parsedContent) {
      // If marked is not available, show plain text with loading message
      return `
        <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-3">
          <p class="text-xs text-yellow-800 dark:text-yellow-200 flex items-center">
            <svg class="animate-spin w-3 h-3 mr-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Markdown parser sedang dimuat...
          </p>
        </div>
        <article class="prose prose-sm prose-gray dark:prose-invert max-w-none">
          <pre class="whitespace-pre-wrap font-sans text-sm leading-relaxed">${escapeHtml(parsedContent)}</pre>
        </article>
      `;
    }

    return "Belum ada konten";
  },

  async init() {
    const courseId = sessionStorage.getItem("teacher_selected_course_id");
    if (!courseId) return this.showError("ID course tidak ditemukan.");

    try {
      const data = await CourseDetailModel.getCourseDetail(courseId);
      await this.renderCourse(data);
    } catch (error) {
      this.showError(error.message);
    }
  },

  async renderCourse(data) {
    const container = document.getElementById("course-detail-container");
    if (!container) return;

    const { course, sessions } = data;

    // Sort sessions by session_number
    const sortedSessions = [...sessions].sort((a, b) => a.session_number - b.session_number);

    // Render all session contents with markdown
    const sessionContents = {};
    for (const session of sortedSessions) {
      sessionContents[session.session_number] = await this.renderMarkdownContent(session.content);
    }

    container.innerHTML = `
     <!-- Action Buttons -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div class="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            ${sessions.length > 0 ? 'Kursus siap untuk diverifikasi' : 'Tambahkan minimal 1 sesi untuk dapat memverifikasi kursus'}
          </div>
          <div class="flex space-x-3">
           
            <button id="btn-verify" ${sessions.length === 0 ? 'disabled' : ''} class="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              ${sessions.length === 0 ? 'Tidak Dapat Diverifikasi' : 'Verifikasi Kursus'}
            </button>
          </div>
        </div>
      </div>
      <!-- Course Header Card -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h1 class="text-3xl font-bold mb-2 leading-tight">${escapeHtml(course.title)}</h1>
              <p class="text-blue-100 opacity-90">Kursus untuk mahasiswa program studi ${course.program_studi}</p>
            </div>
            <button id="edit-title" class="p-2 rounded-lg hover:bg-white/20 transition-colors" title="Edit Judul">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-8">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Deskripsi Kursus</h3>
              <div class="prose prose-gray dark:prose-invert max-w-none">
                <div class="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">${course.description}</div>
              </div>
            </div>
            <button id="edit-description" class="ml-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400" title="Edit Deskripsi">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Course Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sesi</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">${sessions.length}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Status</p>
              <p class="text-lg font-semibold text-yellow-600 dark:text-yellow-400">Belum Diverifikasi</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Siap Verifikasi</p>
              <p class="text-lg font-semibold text-green-600 dark:text-green-400">${sessions.length > 0 ? 'Ya' : 'Belum'}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Sessions Section -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div class="px-8 py-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Daftar Sesi Pembelajaran</h2>
            <span class="text-sm text-gray-500 dark:text-gray-400">${sessions.length} sesi tersedia</span>
          </div>
        </div>
        
        <div class="p-8">
          ${sortedSessions.length === 0 ? `
            <div class="text-center py-12">
              <svg class="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Belum ada sesi</h3>
              <p class="text-gray-500 dark:text-gray-400">Tambahkan sesi pembelajaran untuk melengkapi kursus ini</p>
            </div>
          ` : `
            <div class="space-y-6">
              ${sortedSessions.map((s) => `
                <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                  <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                      <div class="flex items-center mb-3">
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mr-3">
                          Chapter ${s.session_number}
                        </span>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${escapeHtml(s.title)}</h3>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2 ml-4">
                      <button class="edit-session-btn p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 transition-colors" data-session="${s.session_number}" title="Edit Sesi">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button class="delete-session-btn p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 transition-colors" data-session="${s.session_number}" title="Hapus Sesi">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <!-- Content Preview with Markdown Rendering -->
                  <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                    <div class="max-h-96 overflow-y-auto">
                      ${sessionContents[s.session_number]}
                    </div>
                  </div>
                </div>
              `).join("")}
            </div>
          `}
        </div>
      </div>

     
    `;

    // Apply syntax highlighting after DOM is updated
    this.applySyntaxHighlighting();

    this.bindEvents(course, sortedSessions);
  },

  // Apply syntax highlighting to code blocks
  applySyntaxHighlighting() {
    if (window.hljs) {
      setTimeout(() => {
        document.querySelectorAll("pre code").forEach((el) => {
          try {
            hljs.highlightElement(el);
          } catch (error) {
            console.error("Error highlighting code:", error);
          }
        });
      }, 100);
    }
  },

  bindEvents(course, sessions) {
    // Edit title button
    document.getElementById("edit-title")?.addEventListener("click", () =>
      this.showModal("title", course)
    );

    // Edit description button
    document.getElementById("edit-description")?.addEventListener("click", () =>
      this.showModal("description", course)
    );

    // Edit session buttons
    document.querySelectorAll(".edit-session-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const sessionNum = btn.getAttribute("data-session");
        const sessionData = sessions.find(s => s.session_number == sessionNum);
        this.showModal("session", sessionData);
      });
    });

    // Delete session buttons
    document.querySelectorAll(".delete-session-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const sessionNum = btn.getAttribute("data-session");
        showConfirmModal(
          "Hapus Sesi",
          `Yakin ingin menghapus Chapter ${sessionNum}? Tindakan ini tidak dapat dibatalkan.`,
          async () => {
            try {
              await CourseDetailModel.deleteSession(course.id, sessionNum);
              window.showSuccessToast(`Chapter ${sessionNum} berhasil dihapus`);
              await this.init();
            } catch (error) {
              window.showErrorToast("Gagal menghapus sesi");
            }
          }
        );
      });
    });

    // Verify course button
    document.getElementById("btn-verify")?.addEventListener("click", () => {
      if (sessions.length === 0) return;

      showConfirmModal(
        "Verifikasi Kursus",
        "Setelah diverifikasi, kursus tidak dapat diedit lagi. Pastikan semua konten sudah benar. Lanjutkan verifikasi?",
        async () => {
          try {
            await CourseDetailModel.verifyCourse(course.id);
            window.showSuccessToast("Kursus berhasil diverifikasi!");
            // Redirect back to course list or refresh
            setTimeout(() => {
              window.location.href = "#/dashboard";
            }, 2000);
          } catch (error) {
            window.showErrorToast("Gagal memverifikasi kursus");
          }
        }
      );
    });
  },

  async showModal(type, data) {
    const modal = document.getElementById("modal-container");
    const form = document.getElementById("modal-form");
    const title = document.getElementById("modal-title");
    form.innerHTML = "";

    let richEditor = null;

    if (type === "description") {
      title.textContent = "Edit Deskripsi Kursus";
      form.innerHTML = `
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Deskripsi Kursus
            </label>
            <div id="description-editor-container">
              <div id="description-editor" class="rich-editor-content" contenteditable="true"></div>
              <textarea name="description" class="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors min-h-[200px] resize-none font-mono text-sm" style="display: none;" required>${escapeHtml(data.description)}</textarea>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Jelaskan tujuan pembelajaran, target mahasiswa, dan manfaat dari kursus ini
            </p>
          </div>
        </div>
      `;

      // Initialize rich text editor for description
      setTimeout(() => {
        const contentEl = document.getElementById('description-editor');
        const textareaEl = form.querySelector('textarea[name="description"]');
        if (contentEl && textareaEl) {
          richEditor = window.initRichTextEditor(contentEl, textareaEl);
          richEditor.setContent(data.description || '');
        }
      }, 100);

    } else if (type === "title") {
      title.textContent = "Edit Judul Kursus";
      form.innerHTML = `
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Judul Kursus
            </label>
            <input 
              type="text" 
              name="title" 
              class="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
              value="${escapeHtml(data.title)}" 
              required 
              placeholder="Masukkan judul kursus yang menarik..."
              maxlength="100"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Gunakan judul yang singkat, jelas, dan mudah dipahami mahasiswa
            </p>
          </div>
        </div>
      `;

    } else if (type === "session") {
      title.textContent = `Edit Chapter ${data.session_number}`;

      form.innerHTML = `
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Judul Chapter
            </label>
            <input 
              type="text" 
              name="title" 
              class="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
              value="${escapeHtml(data.title)}" 
              required 
              placeholder="Masukkan judul chapter..."
              maxlength="150"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Buat judul yang menggambarkan materi yang akan dipelajari
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Konten Pembelajaran
            </label>
            
            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-3">
              <div class="flex items-start">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div class="text-sm text-blue-800 dark:text-blue-200">
                  <p class="font-medium mb-1">Cara menggunakan editor:</p>
                  <ul class="text-xs space-y-1 opacity-90">
                    <li>• Gunakan toolbar untuk format teks (Bold, Italic, dll)</li>
                    <li>• Blok kode otomatis mendapat syntax highlighting</li>
                    <li>• Konten akan tampil seperti yang dilihat mahasiswa</li>
                    <li>• Tidak perlu menulis kode markdown manual</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Rich Text Editor dengan Toolbar Lengkap -->
            <div id="content-editor-container">
              <!-- Toolbar -->
              <div class="border border-gray-300 dark:border-gray-600 border-b-0 bg-gray-50 dark:bg-gray-700 rounded-t-lg p-2 flex flex-wrap gap-1">
                <!-- Basic Formatting -->
                <button type="button" class="editor-btn" data-command="bold" title="Bold (Ctrl+B)">
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M2 1H8.625C11.0412 1 13 2.95875 13 5.375C13 6.08661 12.8301 6.75853 12.5287 7.35243C13.4313 8.15386 14 9.32301 14 10.625C14 13.0412 12.0412 15 9.625 15H2V1ZM5.5 9.75V11.5H9.625C10.1082 11.5 10.5 11.1082 10.5 10.625C10.5 10.1418 10.1082 9.75 9.625 9.75H5.5ZM5.5 6.25H8.625C9.10825 6.25 9.5 5.85825 9.5 5.375C9.5 4.89175 9.10825 4.5 8.625 4.5H5.5V6.25Z" fill="#FFFFFF"></path> </g></svg>
                </button>
                <button type="button" class="editor-btn" data-command="italic" title="Italic (Ctrl+I)">
                 <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 3H20M4 21H14M15 3L9 21" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                </button>
                <button type="button" class="editor-btn" data-command="underline" title="Underline (Ctrl+U)">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 19h12M8 4v8a4 4 0 008 0V4"></path>
                  </svg>
                </button>
                <button type="button" class="editor-btn" data-command="strikethrough" title="Strikethrough">
                 <svg fill="#FFFFFF" viewBox="0 0 36 36" version="1.1" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>strikethrough-line</title> <path d="M32.88,19.92h-30a1,1,0,1,1,0-2h30a1,1,0,0,1,0,2Z" class="clr-i-outline clr-i-outline-path-1"></path><path d="M7.27,15.86a12.9,12.9,0,0,1,1.29-.52A5.69,5.69,0,0,1,10.39,15a3.18,3.18,0,0,1,2.75,1.11A4.44,4.44,0,0,1,14,18.85v.49a13.83,13.83,0,0,0-4.29-.74,6.19,6.19,0,0,0-2.59.54A5,5,0,0,0,5.81,20H15.88V18.85a5.67,5.67,0,0,0-1.37-4,5.16,5.16,0,0,0-4-1.49,10,10,0,0,0-3.91.88.87.87,0,0,0-.44,1.18A.84.84,0,0,0,7.27,15.86Z" class="clr-i-outline clr-i-outline-path-2"></path><path d="M21,20a5.94,5.94,0,0,1,.54-2.31,4.35,4.35,0,0,1,1.58-1.83,4.27,4.27,0,0,1,4.59,0,4.47,4.47,0,0,1,1.57,1.83A6.12,6.12,0,0,1,29.85,20h2a7.73,7.73,0,0,0-.78-3.19,6,6,0,0,0-2.18-2.45,5.74,5.74,0,0,0-3.1-.88,5.39,5.39,0,0,0-2.8.73,5.55,5.55,0,0,0-2,2.05V10a.87.87,0,0,0-.86-.86H20a.87.87,0,0,0-.86.86V20Z" class="clr-i-outline clr-i-outline-path-3"></path><path d="M29.67,22a5.61,5.61,0,0,1-.36,1.07,4.47,4.47,0,0,1-1.57,1.85,4.32,4.32,0,0,1-4.59,0,4.35,4.35,0,0,1-1.58-1.85A5.64,5.64,0,0,1,21.2,22H19.09v4.13A.87.87,0,0,0,20,27h.2a.87.87,0,0,0,.86-.86V24.51a5.58,5.58,0,0,0,2,2.06,5.48,5.48,0,0,0,2.8.72,5.66,5.66,0,0,0,3.1-.88A5.88,5.88,0,0,0,31.09,24,7.09,7.09,0,0,0,31.73,22Z" class="clr-i-outline clr-i-outline-path-4"></path><path d="M14,22v.76a3.34,3.34,0,0,1-1.62,2,5.34,5.34,0,0,1-2.69.72,3.78,3.78,0,0,1-2.36-.7,2.24,2.24,0,0,1-.94-1.9,2.29,2.29,0,0,1,.2-.91H4.62a4,4,0,0,0-.13,1,3.83,3.83,0,0,0,1.35,3.06A5.15,5.15,0,0,0,9.31,27.2,6,6,0,0,0,12,26.57a4.62,4.62,0,0,0,2-1.74V26a.86.86,0,0,0,.86.86H15a.86.86,0,0,0,.86-.86V22Z" class="clr-i-outline clr-i-outline-path-5"></path> <rect x="0" y="0" width="36" height="36" fill-opacity="0"></rect> </g></svg>
                </button>
                
                <div class="border-l border-gray-300 dark:border-gray-500 mx-1"></div>
                
                <!-- Headings -->
                <button type="button" class="editor-btn" data-command="formatBlock" data-value="h1" title="Heading 1">
                  <span class="text-xs font-bold">H1</span>
                </button>
                <button type="button" class="editor-btn" data-command="formatBlock" data-value="h2" title="Heading 2">
                  <span class="text-xs font-bold">H2</span>
                </button>
                <button type="button" class="editor-btn" data-command="formatBlock" data-value="h3" title="Heading 3">
                  <span class="text-xs font-bold">H3</span>
                </button>
                <button type="button" class="editor-btn" data-command="formatBlock" data-value="p" title="Paragraph">
                  <span class="text-xs">P</span>
                </button>
                
                <div class="border-l border-gray-300 dark:border-gray-500 mx-1"></div>
                
                <!-- Lists -->
                <button type="button" class="editor-btn" data-command="insertUnorderedList" title="Bullet List">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 100 4 2 2 0 000-4zM4 12a2 2 0 100 4 2 2 0 000-4zM4 18a2 2 0 100 4 2 2 0 000-4zM10 6h10M10 12h10M10 18h10"></path>
                  </svg>
                </button>
                <button type="button" class="editor-btn" data-command="insertOrderedList" title="Numbered List">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l2 2 4-4M9 12l2 2 4-4M9 19l2 2 4-4"></path>
                  </svg>
                </button>
                
                <div class="border-l border-gray-300 dark:border-gray-500 mx-1"></div>
                
                <!-- Alignment -->
                <button type="button" class="editor-btn" data-command="justifyLeft" title="Align Left">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8M4 18h16"></path>
                  </svg>
                </button>
                <button type="button" class="editor-btn" data-command="justifyCenter" title="Align Center">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M8 12h8M4 18h16"></path>
                  </svg>
                </button>
                <button type="button" class="editor-btn" data-command="justifyRight" title="Align Right">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M8 12h16M4 18h16"></path>
                  </svg>
                </button>
                
                <div class="border-l border-gray-300 dark:border-gray-500 mx-1"></div>
                
                <!-- Indent -->
                <button type="button" class="editor-btn" data-command="outdent" title="Decrease Indent">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18"></path>
                  </svg>
                </button>
                <button type="button" class="editor-btn" data-command="indent" title="Increase Indent">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </button>
                
                <div class="border-l border-gray-300 dark:border-gray-500 mx-1"></div>
                
                <!-- Code & Link -->
                <button type="button" class="editor-btn" id="insert-code-btn" title="Insert Code Block">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                  </svg>
                </button>
                <button type="button" class="editor-btn" id="insert-link-btn" title="Insert Link">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                  </svg>
                </button>
                <button type="button" class="editor-btn" id="insert-quote-btn" title="Insert Quote">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                </button>
                
                <div class="border-l border-gray-300 dark:border-gray-500 mx-1"></div>
                
                <!-- Undo/Redo -->
                <button type="button" class="editor-btn" data-command="undo" title="Undo (Ctrl+Z)">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
                  </svg>
                </button>
                <button type="button" class="editor-btn" data-command="redo" title="Redo (Ctrl+Y)">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"></path>
                  </svg>
                </button>
                
                <div class="border-l border-gray-300 dark:border-gray-500 mx-1"></div>
                
                <!-- Clear Formatting -->
                <button type="button" class="editor-btn" data-command="removeFormat" title="Clear Formatting">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
              
              <!-- Editor Content -->
              <div id="content-editor" class="border border-gray-300 dark:border-gray-600 rounded-b-lg p-4 min-h-[400px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none overflow-y-auto" contenteditable="true" style="white-space: pre-wrap;">
              </div>
              
              <textarea name="content" class="hidden" required>${escapeHtml(data.content || "")}</textarea>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Gunakan toolbar di atas untuk formatting. Konten akan otomatis diformat untuk mahasiswa.
            </p>
          </div>
        </div>
      `;

      // Initialize rich text editor with enhanced functionality
      setTimeout(async () => {
        const contentEl = document.getElementById('content-editor');
        const textareaEl = form.querySelector('textarea[name="content"]');

        if (contentEl && textareaEl) {
          // Convert markdown to HTML for editing
          const renderedContent = await this.renderMarkdownContent(data.content || '');

          // Extract just the content from the article wrapper
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = renderedContent;
          const articleContent = tempDiv.querySelector('article')?.innerHTML || '';

          contentEl.innerHTML = articleContent;

          // Apply syntax highlighting to existing code blocks
          setTimeout(() => this.applySyntaxHighlighting(), 100);

          // Setup toolbar functionality
          this.setupRichTextToolbar(contentEl, textareaEl);

          // Auto-update textarea when content changes
          const updateTextarea = () => {
            // Convert HTML back to markdown-like format for storage
            const html = contentEl.innerHTML;
            textareaEl.value = this.htmlToMarkdown(html);
          };

          contentEl.addEventListener('input', updateTextarea);
          contentEl.addEventListener('paste', (e) => {
            setTimeout(updateTextarea, 100);
          });

          // Initial update
          updateTextarea();
        }
      }, 100);
    }

    modal.classList.remove("hidden");

    // Focus on first input
    setTimeout(() => {
      const firstInput = form.querySelector('input, textarea');
      if (firstInput && firstInput.style.display !== 'none') {
        firstInput.focus();
      }
    }, 200);

    form.onsubmit = async (e) => {
      e.preventDefault();
      const courseId = sessionStorage.getItem("teacher_selected_course_id");
      const submitBtn = form.closest('.bg-white').querySelector('button[type="submit"]');

      // Show loading state
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = `
        <span class="flex items-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Menyimpan...
        </span>
      `;
      submitBtn.disabled = true;

      try {
        if (type === "description") {
          const content = richEditor ? richEditor.getContent() : form.description.value;
          await CourseDetailModel.editCourse(courseId, {
            title: data.title,
            description: content.trim(),
          });
          window.showSuccessToast("Deskripsi kursus berhasil diperbarui");
        } else if (type === "title") {
          await CourseDetailModel.editCourse(courseId, {
            title: form.title.value.trim(),
            description: data.description,
          });
          window.showSuccessToast("Judul kursus berhasil diperbarui");
        } else if (type === "session") {
          const content = form.content.value; // Already converted by htmlToMarkdown
          await CourseDetailModel.editSession(courseId, data.session_number, {
            title: form.title.value.trim(),
            content: content.trim(),
          });
          window.showSuccessToast(`Chapter ${data.session_number} berhasil diperbarui`);
        }
        modal.classList.add("hidden");
        await this.init();
      } catch (err) {
        window.showErrorToast("Gagal menyimpan perubahan. Silakan coba lagi.");
        console.error(err);
      } finally {
        // Restore button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    };
  },

  // Setup rich text toolbar functionality
  setupRichTextToolbar(contentEl, textareaEl) {
    const toolbarButtons = document.querySelectorAll('.editor-btn');

    // Add CSS styles for toolbar buttons
    const style = document.createElement('style');
    style.textContent = `
      .editor-btn {
        padding: 6px 8px;
        border: 1px solid #d1d5db;
        background: white;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 32px;
        height: 32px;
      }
      .editor-btn:hover {
        background: #f3f4f6;
        border-color: #9ca3af;
      }
      .editor-btn.active {
        background: #3b82f6;
        color: white;
        border-color: #2563eb;
      }
      .dark .editor-btn {
        background: #374151;
        border-color: #4b5563;
        color: #f9fafb;
      }
      .dark .editor-btn:hover {
        background: #4b5563;
        border-color: #6b7280;
      }
      .dark .editor-btn.active {
        background: #3b82f6;
        color: white;
        border-color: #2563eb;
      }
    `;
    document.head.appendChild(style);

    // Handle toolbar button clicks
    toolbarButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const command = btn.dataset.command;
        const value = btn.dataset.value || null;

        if (command === 'formatBlock') {
          document.execCommand(command, false, `<${value}>`);
        } else {
          document.execCommand(command, false, value);
        }

        contentEl.focus();
        this.updateToolbarState();
      });
    });

    // Handle special buttons
    const specialButtons = {
      'insert-code-btn': () => this.insertCodeBlock(contentEl),
      'insert-link-btn': () => this.insertLink(contentEl),
      'insert-quote-btn': () => this.insertQuote(contentEl)
    };

    Object.entries(specialButtons).forEach(([id, handler]) => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          handler();
        });
      }
    });

    // Keyboard shortcuts
    contentEl.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'b':
            e.preventDefault();
            document.execCommand('bold');
            this.updateToolbarState();
            break;
          case 'i':
            e.preventDefault();
            document.execCommand('italic');
            this.updateToolbarState();
            break;
          case 'u':
            e.preventDefault();
            document.execCommand('underline');
            this.updateToolbarState();
            break;
          case 'z':
            if (e.shiftKey) {
              e.preventDefault();
              document.execCommand('redo');
            } else {
              e.preventDefault();
              document.execCommand('undo');
            }
            break;
          case 'y':
            e.preventDefault();
            document.execCommand('redo');
            break;
        }
      }
    });

    // Update toolbar state on selection change
    contentEl.addEventListener('keyup', () => this.updateToolbarState());
    contentEl.addEventListener('mouseup', () => this.updateToolbarState());
  },

  // Update toolbar button states based on current selection
  updateToolbarState() {
    const buttons = document.querySelectorAll('.editor-btn[data-command]');

    buttons.forEach(btn => {
      const command = btn.dataset.command;
      try {
        if (document.queryCommandState(command)) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      } catch (e) {
        // Some commands might not be supported
        btn.classList.remove('active');
      }
    });
  },

  // Insert code block with syntax highlighting
  insertCodeBlock(contentEl) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);

    // Create code block element
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.className = 'language-javascript'; // Default to JavaScript
    code.textContent = '// Masukkan kode di sini\nconsole.log("Hello World!");';

    pre.appendChild(code);
    pre.style.cssText = `
      background: #1f2937;
      color: #f9fafb;
      padding: 16px;
      border-radius: 8px;
      margin: 16px 0;
      font-family: 'Courier New', monospace;
      overflow-x: auto;
      border: 1px solid #374151;
    `;

    // Insert the code block
    range.deleteContents();
    range.insertNode(pre);

    // Move cursor after the code block
    const newRange = document.createRange();
    newRange.setStartAfter(pre);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);

    // Apply syntax highlighting
    setTimeout(() => this.applySyntaxHighlighting(), 100);
  },

  // Insert link
  insertLink(contentEl) {
    const selection = window.getSelection();
    const selectedText = selection.toString();

    const url = prompt('Masukkan URL link:', 'https://');
    if (url && url.trim() !== '' && url !== 'https://') {
      const linkText = selectedText || prompt('Masukkan teks link:', url);
      if (linkText) {
        const link = document.createElement('a');
        link.href = url;
        link.textContent = linkText;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = 'text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300';

        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(link);

        // Move cursor after the link
        const newRange = document.createRange();
        newRange.setStartAfter(link);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    }
    contentEl.focus();
  },

  // Insert quote block
  insertQuote(contentEl) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);

    const quote = document.createElement('blockquote');
    quote.style.cssText = `
      border-left: 4px solid #3b82f6;
      padding-left: 16px;
      margin: 16px 0;
      font-style: italic;
      color: #4b5563;
      background: #f9fafb;
      padding: 12px 16px;
      border-radius: 4px;
    `;
    quote.textContent = 'Masukkan kutipan di sini...';

    // Insert the quote block
    range.deleteContents();
    range.insertNode(quote);

    // Select the quote text for easy editing
    const newRange = document.createRange();
    newRange.selectNodeContents(quote);
    selection.removeAllRanges();
    selection.addRange(newRange);

    contentEl.focus();
  },

  // Convert HTML back to markdown for storage
  htmlToMarkdown(html) {
    let markdown = html;

    // Convert headings
    markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
    markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
    markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
    markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');

    // Convert bold and italic
    markdown = markdown.replace(/<(strong|b)[^>]*>(.*?)<\/(strong|b)>/gi, '**$2**');
    markdown = markdown.replace(/<(em|i)[^>]*>(.*?)<\/(em|i)>/gi, '*$2*');
    markdown = markdown.replace(/<u[^>]*>(.*?)<\/u>/gi, '$1'); // Remove underline as markdown doesn't support it well
    markdown = markdown.replace(/<(strike|s)[^>]*>(.*?)<\/(strike|s)>/gi, '~~$2~~');

    // Convert links
    markdown = markdown.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

    // Convert blockquotes
    markdown = markdown.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, (match, content) => {
      const lines = content.trim().split('\n');
      return '\n' + lines.map(line => '> ' + line.trim()).join('\n') + '\n\n';
    });

    // Convert unordered lists
    markdown = markdown.replace(/<ul[^>]*>(.*?)<\/ul>/gis, (match, content) => {
      const listItems = content.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
      return '\n' + listItems + '\n';
    });

    // Convert ordered lists
    markdown = markdown.replace(/<ol[^>]*>(.*?)<\/ol>/gis, (match, content) => {
      let counter = 1;
      const listItems = content.replace(/<li[^>]*>(.*?)<\/li>/gi, () => `${counter++}. $1\n`);
      return '\n' + listItems + '\n';
    });

    // Convert code blocks
    markdown = markdown.replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, (match, code) => {
      const cleanCode = code.replace(/<[^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
      return '\n```\n' + cleanCode + '\n```\n\n';
    });

    // Convert inline code
    markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');

    // Convert paragraphs
    markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');

    // Convert line breaks
    markdown = markdown.replace(/<br[^>]*>/gi, '\n');

    // Clean up extra whitespace
    markdown = markdown.replace(/\n{3,}/g, '\n\n');
    markdown = markdown.replace(/^\s+|\s+$/g, '');

    // Remove any remaining HTML tags
    markdown = markdown.replace(/<[^>]*>/g, '');

    // Decode HTML entities
    markdown = markdown.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#039;/g, "'");

    return markdown;
  },

  showError(msg) {
    const container = document.getElementById("course-detail-container");
    if (container) {
      container.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
          <svg class="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Terjadi Kesalahan</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">${msg}</p>
          <button onclick="window.location.reload()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Muat Ulang Halaman
          </button>
        </div>
      `;
    }
  },
};

export default CourseDetailPresenter;