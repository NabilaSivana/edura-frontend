// src/scripts/pages/teacher/detail-course/page.js
import CourseDetailPresenter from "./presenter.js";

const CourseDetailPage = {
  async render() {
    return `
      <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <!-- Header Section -->
        <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <button onclick="history.back()" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                  </svg>
                </button>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Detail Kursus</h1>
              </div>
              <div class="flex items-center space-x-2">
                <span class="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full">
                  Belum Diverifikasi
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div id="course-detail-container" class="space-y-8">
            <!-- Loading State -->
            <div class="flex items-center justify-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span class="ml-3 text-gray-600 dark:text-gray-400">Memuat data kursus...</span>
            </div>
          </div>
        </div>

        <!-- Enhanced Modal with Rich Text Editor -->
        <div id="modal-container" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center hidden z-50 p-4">
          <div class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-6xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
            <!-- Modal Header -->
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <div class="flex items-center justify-between">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white" id="modal-title">Edit Data</h3>
                <button id="close-modal" class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- Modal Body -->
            <div class="flex-1 overflow-y-auto p-6">
              <form id="modal-form" class="space-y-6"></form>
            </div>
            
            <!-- Modal Footer -->
            <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <div class="flex justify-between items-center">
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  <span id="editor-mode-indicator">Mode: Visual Editor</span>
                </div>
                <div class="flex justify-end gap-3">
                  <button id="cancel-modal" type="button" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white transition-colors font-medium">
                    Batal
                  </button>
                  <button type="submit" form="modal-form" class="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl">
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                      Simpan Perubahan
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Confirmation Modal -->
        <div id="confirm-modal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center hidden z-50 p-4">
          <div class="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div class="p-6">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mr-4">
                  <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.734 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white" id="confirm-title">Konfirmasi</h3>
              </div>
              <p class="text-gray-600 dark:text-gray-300 mb-6" id="confirm-message">Apakah Anda yakin?</p>
              <div class="flex justify-end gap-3">
                <button id="confirm-cancel" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white transition-colors font-medium">
                  Batal
                </button>
                <button id="confirm-ok" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                  Ya, Lanjutkan
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Success Toast -->
        <div id="success-toast" class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform translate-x-full opacity-0 transition-all duration-300 z-50 pointer-events-none">
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span id="success-message">Berhasil!</span>
          </div>
        </div>

        <!-- Error Toast -->
        <div id="error-toast" class="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg transform translate-x-full opacity-0 transition-all duration-300 z-50 pointer-events-none">
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            <span id="error-message">Terjadi kesalahan!</span>
          </div>
        </div>

        <!-- Rich Text Editor Styles -->
        <style>
          .rich-editor-toolbar {
            border-bottom: 1px solid #e5e7eb;
            padding: 8px 12px;
            background: #f9fafb;
            border-radius: 8px 8px 0 0;
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            align-items: center;
          }
          
          .dark .rich-editor-toolbar {
            background: #374151;
            border-bottom-color: #4b5563;
          }
          
          .editor-btn {
            padding: 6px 8px;
            border: 1px solid #d1d5db;
            background: white;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 14px;
            min-width: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .dark .editor-btn {
            background: #4b5563;
            border-color: #6b7280;
            color: white;
          }
          
          .editor-btn:hover {
            background: #f3f4f6;
            border-color: #9ca3af;
          }
          
          .dark .editor-btn:hover {
            background: #6b7280;
          }
          
          .editor-btn.active {
            background: #3b82f6;
            color: white;
            border-color: #3b82f6;
          }
          
          .editor-separator {
            width: 1px;
            height: 20px;
            background: #d1d5db;
            margin: 0 4px;
          }
          
          .dark .editor-separator {
            background: #6b7280;
          }
          
          .rich-editor-content {
            min-height: 300px;
            padding: 16px;
            border: 1px solid #d1d5db;
            border-top: none;
            border-radius: 0 0 8px 8px;
            background: white;
            outline: none;
            line-height: 1.6;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          
          .dark .rich-editor-content {
            background: #1f2937;
            border-color: #4b5563;
            color: white;
          }
          
          .rich-editor-content:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }
          
          .rich-editor-content h1 { font-size: 2em; font-weight: bold; margin: 16px 0 8px 0; }
          .rich-editor-content h2 { font-size: 1.5em; font-weight: bold; margin: 14px 0 6px 0; }
          .rich-editor-content h3 { font-size: 1.25em; font-weight: bold; margin: 12px 0 4px 0; }
          .rich-editor-content p { margin: 8px 0; }
          .rich-editor-content ul, .rich-editor-content ol { margin: 8px 0; padding-left: 24px; }
          .rich-editor-content li { margin: 4px 0; }
          .rich-editor-content blockquote { 
            border-left: 4px solid #3b82f6; 
            padding-left: 16px; 
            margin: 16px 0; 
            color: #6b7280; 
            font-style: italic; 
          }
          .rich-editor-content code { 
            background: #f3f4f6; 
            padding: 2px 4px; 
            border-radius: 3px; 
            font-family: 'Courier New', monospace; 
            font-size: 0.9em; 
          }
          .dark .rich-editor-content code { background: #374151; }
          .rich-editor-content pre { 
            background: #f3f4f6; 
            padding: 12px; 
            border-radius: 6px; 
            overflow-x: auto; 
            margin: 12px 0; 
            font-family: 'Courier New', monospace; 
          }
          .dark .rich-editor-content pre { background: #374151; }
        </style>
      </div>
    `;
  },

  async afterRender() {
    // Initialize modal close handlers
    const closeModal = () => {
      document.getElementById('modal-container').classList.add('hidden');
    };
    
    const closeModalBtn = document.getElementById('close-modal');
    const cancelModalBtn = document.getElementById('cancel-modal');
    
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);
    
    // Click outside modal to close
    const modalContainer = document.getElementById('modal-container');
    if (modalContainer) {
      modalContainer.addEventListener('click', (e) => {
        if (e.target.id === 'modal-container') {
          closeModal();
        }
      });
    }

    // Initialize confirmation modal handlers
    const closeConfirmModal = () => {
      document.getElementById('confirm-modal').classList.add('hidden');
    };
    
    const confirmCancelBtn = document.getElementById('confirm-cancel');
    if (confirmCancelBtn) confirmCancelBtn.addEventListener('click', closeConfirmModal);
    
    // Click outside confirm modal to close
    const confirmModalContainer = document.getElementById('confirm-modal');
    if (confirmModalContainer) {
      confirmModalContainer.addEventListener('click', (e) => {
        if (e.target.id === 'confirm-modal') {
          closeConfirmModal();
        }
      });
    }

    // Initialize toast functions
    window.showSuccessToast = (message) => {
      const toast = document.getElementById('success-toast');
      const messageEl = document.getElementById('success-message');
      
      if (toast && messageEl) {
        messageEl.textContent = message;
        toast.classList.remove('translate-x-full', 'opacity-0');
        toast.classList.add('translate-x-0', 'opacity-100');
        toast.style.pointerEvents = 'auto';
        
        setTimeout(() => {
          toast.classList.remove('translate-x-0', 'opacity-100');
          toast.classList.add('translate-x-full', 'opacity-0');
          toast.style.pointerEvents = 'none';
        }, 3000);
      }
    };

    window.showErrorToast = (message) => {
      const toast = document.getElementById('error-toast');
      const messageEl = document.getElementById('error-message');
      
      if (toast && messageEl) {
        messageEl.textContent = message;
        toast.classList.remove('translate-x-full', 'opacity-0');
        toast.classList.add('translate-x-0', 'opacity-100');
        toast.style.pointerEvents = 'auto';
        
        setTimeout(() => {
          toast.classList.remove('translate-x-0', 'opacity-100');
          toast.classList.add('translate-x-full', 'opacity-0');
          toast.style.pointerEvents = 'none';
        }, 3000);
      }
    };

    // Rich Text Editor Functions
    window.initRichTextEditor = (contentElement, sourceTextarea) => {
      // Create toolbar
      const toolbar = document.createElement('div');
      toolbar.className = 'rich-editor-toolbar';
      
      const buttons = [
        { cmd: 'bold', icon: 'B', title: 'Bold' },
        { cmd: 'italic', icon: 'I', title: 'Italic' },
        { cmd: 'underline', icon: 'U', title: 'Underline' },
        { separator: true },
        { cmd: 'formatBlock', value: 'h1', icon: 'H1', title: 'Heading 1' },
        { cmd: 'formatBlock', value: 'h2', icon: 'H2', title: 'Heading 2' },
        { cmd: 'formatBlock', value: 'h3', icon: 'H3', title: 'Heading 3' },
        { cmd: 'formatBlock', value: 'p', icon: 'P', title: 'Paragraph' },
        { separator: true },
        { cmd: 'insertUnorderedList', icon: '• List', title: 'Bullet List' },
        { cmd: 'insertOrderedList', icon: '1. List', title: 'Numbered List' },
        { separator: true },
        { cmd: 'formatBlock', value: 'blockquote', icon: '"', title: 'Quote' },
        { cmd: 'insertHTML', value: '<code></code>', icon: '</>', title: 'Inline Code' },
        { separator: true },
        { cmd: 'justifyLeft', icon: '⟵', title: 'Align Left' },
        { cmd: 'justifyCenter', icon: '⟷', title: 'Align Center' },
        { cmd: 'justifyRight', icon: '⟶', title: 'Align Right' },
        { separator: true },
        { cmd: 'removeFormat', icon: '⎚', title: 'Clear Formatting' }
      ];
      
      buttons.forEach(btn => {
        if (btn.separator) {
          const sep = document.createElement('div');
          sep.className = 'editor-separator';
          toolbar.appendChild(sep);
        } else {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'editor-btn';
          button.innerHTML = btn.icon;
          button.title = btn.title;
          button.setAttribute('data-cmd', btn.cmd);
          if (btn.value) button.setAttribute('data-value', btn.value);
          
          button.addEventListener('click', (e) => {
            e.preventDefault();
            const cmd = button.getAttribute('data-cmd');
            const value = button.getAttribute('data-value');
            
            contentElement.focus();
            if (value) {
              document.execCommand(cmd, false, value);
            } else if (cmd === 'insertHTML') {
              const selection = window.getSelection();
              if (selection.toString()) {
                document.execCommand('insertHTML', false, `<code>${selection.toString()}</code>`);
              } else {
                document.execCommand('insertHTML', false, '<code>code here</code>');
              }
            } else {
              document.execCommand(cmd, false, null);
            }
            
            // Update button states
            updateButtonStates();
            // Update source textarea
            updateSourceFromContent();
          });
          
          toolbar.appendChild(button);
        }
      });
      
      // Add mode toggle
      const modeToggle = document.createElement('button');
      modeToggle.type = 'button';
      modeToggle.className = 'editor-btn ml-auto';
      modeToggle.innerHTML = '< / >';
      modeToggle.title = 'Toggle Source Code';
      
      let isSourceMode = false;
      modeToggle.addEventListener('click', (e) => {
        e.preventDefault();
        toggleMode();
      });
      toolbar.appendChild(modeToggle);
      
      // Update button states based on cursor position
      const updateButtonStates = () => {
        const buttons = toolbar.querySelectorAll('.editor-btn[data-cmd]');
        buttons.forEach(btn => {
          const cmd = btn.getAttribute('data-cmd');
          const value = btn.getAttribute('data-value');
          
          try {
            if (cmd === 'formatBlock' && value) {
              const selection = window.getSelection();
              if (selection.rangeCount > 0) {
                const element = selection.getRangeAt(0).commonAncestorContainer;
                const parent = element.nodeType === Node.TEXT_NODE ? element.parentElement : element;
                btn.classList.toggle('active', parent.tagName.toLowerCase() === value);
              }
            } else {
              btn.classList.toggle('active', document.queryCommandState(cmd));
            }
          } catch (e) {
            // Ignore command state errors
          }
        });
      };
      
      // Update source textarea from content
      const updateSourceFromContent = () => {
        if (sourceTextarea && !isSourceMode) {
          sourceTextarea.value = contentElement.innerHTML;
        }
      };
      
      // Update content from source textarea
      const updateContentFromSource = () => {
        if (sourceTextarea && isSourceMode) {
          contentElement.innerHTML = sourceTextarea.value;
        }
      };
      
      // Toggle between visual and source mode
      const toggleMode = () => {
        const indicator = document.getElementById('editor-mode-indicator');
        
        if (isSourceMode) {
          // Switch to visual mode
          updateContentFromSource();
          contentElement.style.display = 'block';
          sourceTextarea.style.display = 'none';
          modeToggle.classList.remove('active');
          if (indicator) indicator.textContent = 'Mode: Visual Editor';
          isSourceMode = false;
        } else {
          // Switch to source mode
          updateSourceFromContent();
          contentElement.style.display = 'none';
          sourceTextarea.style.display = 'block';
          modeToggle.classList.add('active');
          if (indicator) indicator.textContent = 'Mode: Source Code';
          isSourceMode = true;
        }
      };
      
      // Event listeners
      contentElement.addEventListener('keyup', () => {
        updateButtonStates();
        updateSourceFromContent();
      });
      
      contentElement.addEventListener('mouseup', updateButtonStates);
      
      // Insert toolbar before content
      contentElement.parentNode.insertBefore(toolbar, contentElement);
      
      // Initialize content from textarea
      if (sourceTextarea && sourceTextarea.value) {
        contentElement.innerHTML = sourceTextarea.value;
      }
      
      // Return control functions
      return {
        getContent: () => isSourceMode ? sourceTextarea.value : contentElement.innerHTML,
        setContent: (html) => {
          if (isSourceMode) {
            sourceTextarea.value = html;
          } else {
            contentElement.innerHTML = html;
          }
          updateSourceFromContent();
        },
        toggleMode,
        isSourceMode: () => isSourceMode
      };
    };

    // Initialize presenter
    try {
      CourseDetailPresenter.init();
    } catch (error) {
      console.error('Error initializing presenter:', error);
    }
  },
};

export default CourseDetailPage;