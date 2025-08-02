import createSidebar from "../../../component/sidebar";

const PaymentStatusPage = {
  /**
   * Parse URL parameters from hash
   * @returns {Object} Parsed parameters
   */
  parseUrlParams() {
    try {
      const hash = window.location.hash;
      if (!hash || !hash.includes('?')) {
        return {};
      }
      
      const queryString = hash.split('?')[1];
      const urlParams = new URLSearchParams(queryString);
      
      return {
        status: urlParams.get('status')?.toLowerCase() || 'unknown',
        transactionId: urlParams.get('transaction_id') || null,
        amount: urlParams.get('amount') || null,
        timestamp: urlParams.get('timestamp') || null
      };
    } catch (error) {
      console.error('Error parsing URL parameters:', error);
      return { status: 'unknown' };
    }
  },

  /**
   * Get status configuration based on payment status
   * @param {string} status - Payment status
   * @param {Object} params - Additional parameters
   * @returns {Object} Status configuration
   */
  getStatusConfig(status, params = {}) {
    const configs = {
      success: {
        icon: `
          <div class="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full">
            <svg class="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        `,
        title: "Pembayaran Berhasil!",
        message: "Selamat! Akun Anda sekarang sudah <strong class='text-blue-600 dark:text-blue-400'>Premium</strong>. Nikmati semua fitur eksklusif yang tersedia.",
        bgColor: "bg-green-50 dark:bg-green-900/10",
        borderColor: "border-green-200 dark:border-green-800",
        textColor: "text-green-800 dark:text-green-200",
        buttonColor: "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
      },
      failed: {
        icon: `
          <div class="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full">
            <svg class="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        `,
        title: "Pembayaran Gagal",
        message: "Maaf, pembayaran Anda tidak dapat diproses. Silakan periksa metode pembayaran Anda dan coba lagi.",
        bgColor: "bg-red-50 dark:bg-red-900/10",
        borderColor: "border-red-200 dark:border-red-800",
        textColor: "text-red-800 dark:text-red-200",
        buttonColor: "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
      },
      pending: {
        icon: `
          <div class="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
            <svg class="w-10 h-10 text-yellow-600 dark:text-yellow-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        `,
        title: "Pembayaran Sedang Diproses",
        message: "Kami sedang memverifikasi pembayaran Anda. Proses ini biasanya memakan waktu 5-10 menit. Halaman akan otomatis diperbarui.",
        bgColor: "bg-yellow-50 dark:bg-yellow-900/10",
        borderColor: "border-yellow-200 dark:border-yellow-800",
        textColor: "text-yellow-800 dark:text-yellow-200",
        buttonColor: "bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600"
      },
      cancelled: {
        icon: `
          <div class="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full">
            <svg class="w-10 h-10 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        `,
        title: "Pembayaran Dibatalkan",
        message: "Anda telah membatalkan proses pembayaran. Jika Anda berubah pikiran, silakan coba lagi kapan saja.",
        bgColor: "bg-gray-50 dark:bg-gray-900/10",
        borderColor: "border-gray-200 dark:border-gray-700",
        textColor: "text-gray-800 dark:text-gray-200",
        buttonColor: "bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600"
      },
      unknown: {
        icon: `
          <div class="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full">
            <svg class="w-10 h-10 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        `,
        title: "Status Tidak Diketahui",
        message: "Status pembayaran tidak dapat ditentukan. Silakan hubungi dukungan pelanggan untuk bantuan lebih lanjut.",
        bgColor: "bg-gray-50 dark:bg-gray-900/10",
        borderColor: "border-gray-200 dark:border-gray-700",
        textColor: "text-gray-800 dark:text-gray-200",
        buttonColor: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
      }
    };

    return configs[status] || configs.unknown;
  },

  /**
   * Generate transaction details HTML
   * @param {Object} params - Transaction parameters
   * @returns {string} HTML string
   */
  generateTransactionDetails(params) {
    const details = [];
    
    if (params.transactionId) {
      details.push(`
        <div class="flex justify-between items-center">
          <span class="text-gray-600 dark:text-gray-400">ID Transaksi:</span>
          <span class="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">${params.transactionId}</span>
        </div>
      `);
    }
    
    if (params.amount) {
      details.push(`
        <div class="flex justify-between items-center">
          <span class="text-gray-600 dark:text-gray-400">Jumlah:</span>
          <span class="font-semibold">Rp ${parseInt(params.amount).toLocaleString('id-ID')}</span>
        </div>
      `);
    }
    
    if (params.timestamp) {
      const date = new Date(parseInt(params.timestamp) * 1000);
      details.push(`
        <div class="flex justify-between items-center">
          <span class="text-gray-600 dark:text-gray-400">Waktu:</span>
          <span>${date.toLocaleString('id-ID')}</span>
        </div>
      `);
    }

    if (details.length === 0) return '';

    return `
      <div class="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
        <h3 class="font-semibold text-gray-800 dark:text-gray-200 mb-3">Detail Transaksi</h3>
        ${details.join('')}
      </div>
    `;
  },

  /**
   * Generate action buttons based on status
   * @param {string} status - Payment status
   * @param {string} buttonColor - Button color classes
   * @returns {string} HTML string
   */
  generateActionButtons(status, buttonColor) {
    const buttons = [];

    // Primary action button
    if (status === 'success') {
      buttons.push(`
        <a href="#/dashboard" class="inline-flex items-center px-6 py-3 ${buttonColor} text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Kembali ke Dashboard
        </a>
      `);
    } else if (status === 'failed' || status === 'cancelled') {
      buttons.push(`
        <a href="#/upgrade" class="inline-flex items-center px-6 py-3 ${buttonColor} text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Coba Lagi
        </a>
      `);
    } else if (status === 'pending') {
      buttons.push(`
        <button id="refresh-status" class="inline-flex items-center px-6 py-3 ${buttonColor} text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Periksa Status
        </button>
      `);
    } else {
      buttons.push(`
        <a href="#/dashboard" class="inline-flex items-center px-6 py-3 ${buttonColor} text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Kembali ke Dashboard
        </a>
      `);
    }

    // Secondary action button
    buttons.push(`
      <a href="#/support" class="inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.196l-3.196 8.5m0 2.608L12 21.804M15.196 10.696L18.804 12l-3.608 3.196M5.196 10.696L2.804 12l3.392 3.196" />
        </svg>
        Bantuan
      </a>
    `);

    return `
      <div class="flex flex-col sm:flex-row gap-3 justify-center mt-8">
        ${buttons.join('')}
      </div>
    `;
  },

  async render() {
    const params = this.parseUrlParams();
    const config = this.getStatusConfig(params.status, params);
    const transactionDetails = this.generateTransactionDetails(params);
    const actionButtons = this.generateActionButtons(params.status, config.buttonColor);

    return `
      <div class="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <div id="sidebar-container" class="hidden lg:block"></div>
        
        <main class="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div class="w-full max-w-lg">
            <!-- Main Status Card -->
            <div class="bg-white dark:bg-gray-800 ${config.borderColor} border shadow-xl rounded-2xl p-6 sm:p-8 text-center ${config.bgColor}">
              ${config.icon}
              
              <h1 class="text-2xl sm:text-3xl font-bold mb-4 ${config.textColor}">
                ${config.title}
              </h1>
              
              <p class="text-gray-600 dark:text-gray-400 text-base sm:text-lg leading-relaxed mb-6">
                ${config.message}
              </p>

              ${transactionDetails}
              ${actionButtons}
            </div>

            <!-- Additional Info for Pending Status -->
            ${params.status === 'pending' ? `
              <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div class="flex items-start space-x-3">
                  <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div class="text-sm text-blue-800 dark:text-blue-200">
                    <p class="font-medium mb-1">Sedang Memproses</p>
                    <p>Status akan otomatis diperbarui setiap 30 detik. Jangan menutup halaman ini.</p>
                  </div>
                </div>
              </div>
            ` : ''}
          </div>
        </main>
      </div>
    `;
  },

  async afterRender() {
    // Initialize sidebar
    const sidebarContainer = document.getElementById("sidebar-container");
    if (sidebarContainer) {
      sidebarContainer.appendChild(createSidebar());
    }

    // Handle refresh status for pending payments
    const refreshBtn = document.getElementById('refresh-status');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        window.location.reload();
      });
    }

    // Auto-refresh for pending status
    const params = this.parseUrlParams();
    if (params.status === 'pending') {
      this.startAutoRefresh();
    }

    // Add escape key handler
    document.addEventListener('keydown', this.handleKeyPress);
  },

  /**
   * Start auto-refresh for pending payments
   */
  startAutoRefresh() {
    // Refresh every 30 seconds for pending payments
    this.refreshInterval = setInterval(() => {
      window.location.reload();
    }, 30000);

    // Clear interval when page is hidden or user navigates away
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.refreshInterval) {
        clearInterval(this.refreshInterval);
      } else if (!document.hidden && !this.refreshInterval) {
        this.startAutoRefresh();
      }
    });

    window.addEventListener('beforeunload', () => {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
      }
    });
  },

  /**
   * Handle keyboard shortcuts
   */
  handleKeyPress(event) {
    if (event.key === 'Escape') {
      window.location.hash = '#/dashboard';
    } else if (event.key === 'r' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      window.location.reload();
    }
  },

  /**
   * Cleanup method
   */
  cleanup() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
    document.removeEventListener('keydown', this.handleKeyPress);
  }
};

export default PaymentStatusPage;