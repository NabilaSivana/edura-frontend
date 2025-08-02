// utils/toast.js - Minimal Toast System

// Configuration
const TOAST_CONFIG = {
    maxToasts: 3,
    duration: {
        success: 4000,
        error: 5000,
        warning: 4500,
        info: 3500,
        loading: 0 // No auto-dismiss for loading
    }
};

// Toast types
const TOAST_TYPES = {
    success: {
        bg: 'bg-green-500',
        icon: '✅'
    },
    error: {
        bg: 'bg-red-500',
        icon: '❌'
    },
    warning: {
        bg: 'bg-yellow-500',
        icon: '⚠️'
    },
    info: {
        bg: 'bg-blue-500',
        icon: 'ℹ️'
    },
    loading: {
        bg: 'bg-gray-600',
        icon: 'spinner'
    }
};

class ToastManager {
    constructor() {
        this.toasts = new Map();
        this.container = null;
        this.init();
    }

    init() {
        this.createContainer();
        this.addStyles();
    }

    createContainer() {
        // Remove existing container if any
        const existing = document.getElementById('toast-container');
        if (existing) existing.remove();

        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        this.container.className = 'fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none';

        document.body.appendChild(this.container);
    }

    addStyles() {
        if (document.getElementById('toast-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'toast-styles';
        styles.textContent = `
      @keyframes toast-slide-in {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes toast-slide-out {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }

      @keyframes toast-fade-out {
        from {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
        to {
          opacity: 0;
          transform: translateX(20px) scale(0.95);
        }
      }

      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      .toast-slide-in {
        animation: toast-slide-in 0.3s ease-out;
      }

      .toast-slide-out {
        animation: toast-slide-out 0.4s ease-in-out;
      }

      .toast-fade-out {
        animation: toast-fade-out 0.5s ease-in-out;
      }

      .toast-spinner {
        animation: spin 1s linear infinite;
      }

      @media (max-width: 640px) {
        #toast-container {
          right: 1rem !important;
          top: 1rem !important;
          max-width: calc(100vw - 2rem);
        }
        
        .toast-item {
          min-width: 250px !important;
          max-width: 280px !important;
        }
      }
    `;

        document.head.appendChild(styles);
    }

    show(message, type = 'info', options = {}) {
        const config = {
            id: options.id || Date.now().toString(),
            persistent: options.persistent || false,
            ...options
        };

        // Remove existing toast with same ID
        if (this.toasts.has(config.id)) {
            this.remove(config.id);
        }

        // Limit number of toasts - remove oldest if exceeding limit
        if (this.toasts.size >= TOAST_CONFIG.maxToasts) {
            const oldestId = this.toasts.keys().next().value;
            this.remove(oldestId);
        }

        const toast = this.createToast(message, type, config);
        this.container.appendChild(toast);
        this.toasts.set(config.id, { element: toast, config });

        // Auto-remove after duration (hidden timer) unless persistent or loading
        if (!config.persistent && type !== 'loading') {
            const duration = TOAST_CONFIG.duration[type] || TOAST_CONFIG.duration.info;
            setTimeout(() => {
                this.autoRemove(config.id);
            }, duration);
        }

        return config.id;
    }

    createToast(message, type, config) {
        const toastType = TOAST_TYPES[type] || TOAST_TYPES.info;

        const toast = document.createElement('div');
        toast.className = `
      toast-item pointer-events-auto
      ${toastType.bg} text-white
      rounded-lg shadow-lg 
      min-w-[280px] max-w-[350px] 
      toast-slide-in
    `.trim();

        // Create content
        const content = document.createElement('div');
        content.className = 'p-3 flex items-center justify-between gap-3';

        // Left side: icon + message
        const leftSide = document.createElement('div');
        leftSide.className = 'flex items-center gap-2 flex-1 min-w-0';

        // Icon
        const iconContainer = document.createElement('div');
        iconContainer.className = 'flex-shrink-0';

        if (type === 'loading') {
            iconContainer.innerHTML = `
        <svg class="w-4 h-4 toast-spinner" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      `;
        } else {
            iconContainer.innerHTML = `<span class="text-sm">${toastType.icon}</span>`;
        }

        // Message
        const messageContainer = document.createElement('div');
        messageContainer.className = 'flex-1 text-sm font-medium truncate';
        messageContainer.textContent = message;

        leftSide.appendChild(iconContainer);
        leftSide.appendChild(messageContainer);

        // Close button
        const closeButton = document.createElement('button');
        closeButton.className = 'flex-shrink-0 text-white/80 hover:text-white text-lg font-bold w-5 h-5 flex items-center justify-center transition-colors';
        closeButton.innerHTML = '&times;';
        closeButton.onclick = () => this.remove(config.id, true); // Use slide-out for manual close

        content.appendChild(leftSide);
        content.appendChild(closeButton);
        toast.appendChild(content);

        return toast;
    }

    remove(id, useSlideOut = true) {
        const toast = this.toasts.get(id);
        if (!toast) return;

        // Use different animation based on removal type
        if (useSlideOut) {
            toast.element.classList.add('toast-slide-out');
        } else {
            toast.element.classList.add('toast-fade-out');
        }

        const animationDuration = useSlideOut ? 400 : 500;

        setTimeout(() => {
            if (toast.element.parentNode) {
                toast.element.remove();
            }
            this.toasts.delete(id);
        }, animationDuration);
    }

    // Auto-remove with fade animation (for timer-based removal)
    autoRemove(id) {
        const toast = this.toasts.get(id);
        if (!toast) return;

        // Add hover detection to pause auto-removal
        if (toast.element.matches(':hover')) {
            // Retry after 1 second if user is hovering
            setTimeout(() => this.autoRemove(id), 1000);
            return;
        }

        this.remove(id, false); // Use fade-out animation
    }

    clear() {
        this.toasts.forEach((_, id) => this.remove(id, true));
    }
}

// Create singleton instance
const toastManager = new ToastManager();

// Export main functions
export function showToast(message, type = 'info', options = {}) {
    return toastManager.show(message, type, options);
}

export function removeToast(id) {
    toastManager.remove(id);
}

export function clearAllToasts() {
    toastManager.clear();
}

// Convenience methods
export const toast = {
    success: (message, options = {}) => showToast(message, 'success', options),
    error: (message, options = {}) => showToast(message, 'error', options),
    warning: (message, options = {}) => showToast(message, 'warning', options),
    info: (message, options = {}) => showToast(message, 'info', options),
    loading: (message, options = {}) => showToast(message, 'loading', { persistent: true, ...options })
};

// Course-specific helpers
export const courseToast = {
    courseReused: (courseName) => {
        return toast.success(`Course "${courseName}" berhasil ditambahkan!`);
    },

    courseCreated: (courseName) => {
        return toast.success(`Course "${courseName}" berhasil dibuat!`);
    },

    generationInProgress: () => {
        return toast.warning('Course sedang digenerate. Tunggu selesai.');
    },

    quotaExceeded: () => {
        return toast.error('Kuota course penuh. Upgrade ke premium.');
    },

    serverOverload: () => {
        return toast.warning('Server overload. Coba lagi nanti.');
    },

    networkError: () => {
        return toast.error('Koneksi internet diperlukan.');
    },

    authError: () => {
        return toast.error('Sesi berakhir. Login kembali.');
    },

    creatingCourse: (subject) => {
        return toast.loading(`Membuat course "${subject}"...`, {
            id: 'creating-course'
        });
    },

    loadingRecommendations: () => {
        return toast.loading('Memuat rekomendasi...', {
            id: 'loading-recommendations'
        });
    }
};

export default toastManager;