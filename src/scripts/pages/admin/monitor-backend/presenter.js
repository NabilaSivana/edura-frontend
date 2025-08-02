// // === File: pages/admin/monitor-backend/presenter.js ===
// import MonitorBackendModel from "./model.js";
// import MonitorBackendView from "./view.js";

// const MonitorBackendPresenter = {
//     async init() {
//         this.setupEventListeners();
//         const today = new Date().toISOString().slice(0, 10);
//         this.setInitialDate(today);
//         await this.loadLogs(today);
//     },

//     setupEventListeners() {
//         const dateInput = document.getElementById("filter-date");
//         const refreshButton = document.getElementById("refresh-logs");

//         dateInput?.addEventListener("change", async (e) => {
//             const selectedDate = e.target.value;
//             if (selectedDate) {
//                 await this.loadLogs(selectedDate);
//             }
//         });

//         refreshButton?.addEventListener("click", async () => {
//             const selectedDate = dateInput?.value;
//             if (selectedDate) {
//                 await this.loadLogs(selectedDate);
//             }
//         });
//     },

//     setInitialDate(date) {
//         const dateInput = document.getElementById("filter-date");
//         if (dateInput) {
//             dateInput.value = date;
//             dateInput.max = date;
//         }
//     },

//     async loadLogs(date) {
//         const logContainer = document.getElementById("monitor-log-list");
//         const statsContainer = document.getElementById("stats-container");

//         if (!logContainer) return;

//         // Show loading state
//         logContainer.innerHTML = MonitorBackendView.renderLoadingState();
//         if (statsContainer) {
//             statsContainer.innerHTML = "";
//         }

//         try {
//             const logs = await MonitorBackendModel.fetchLogs(date);

//             if (!logs || logs.length === 0) {
//                 logContainer.innerHTML = MonitorBackendView.renderEmptyState();
//                 return;
//             }

//             // Render stats
//             if (statsContainer) {
//                 statsContainer.innerHTML = MonitorBackendView.renderStats(logs);
//             }

//             // Render logs
//             logContainer.innerHTML = "";
//             logs.forEach((log) => {
//                 const logElement = document.createElement("div");
//                 logElement.innerHTML = MonitorBackendView.renderLogItem(log);
//                 logContainer.appendChild(logElement.firstElementChild);
//             });

//         } catch (error) {
//             console.error('Error loading logs:', error);
//             logContainer.innerHTML = MonitorBackendView.renderErrorState(error.message || 'Gagal mengambil log aktivitas');
//         }
//     }
// };

// export default MonitorBackendPresenter;


// === File: pages/admin/monitor-backend/presenter.js ===
import MonitorBackendModel from "./model.js";
import MonitorBackendView from "./view.js";

const MonitorBackendPresenter = {
    currentDate: null,
    currentLogs: [],

    async init() {
        this.setupEventListeners();
        const today = new Date().toISOString().slice(0, 10);
        this.setInitialDate(today);
        this.currentDate = today;
        await this.loadLogs(today);
    },

    setupEventListeners() {
        // Original event listeners
        const dateInput = document.getElementById("filter-date");
        const refreshButton = document.getElementById("refresh-logs");

        dateInput?.addEventListener("change", async (e) => {
            const selectedDate = e.target.value;
            if (selectedDate) {
                this.currentDate = selectedDate;
                await this.loadLogs(selectedDate);
            }
        });

        refreshButton?.addEventListener("click", async () => {
            const selectedDate = dateInput?.value;
            if (selectedDate) {
                this.currentDate = selectedDate;
                await this.loadLogs(selectedDate);
            }
        });

        // New backup-related event listeners
        const downloadBtn = document.getElementById("download-backup-btn");
        const cleanupBtn = document.getElementById("backup-cleanup-btn");
        const backupHistoryBtn = document.getElementById("backup-history-btn");
        const triggerBackupBtn = document.getElementById("trigger-backup-btn");

        downloadBtn?.addEventListener("click", () => this.handleDownloadBackup());
        cleanupBtn?.addEventListener("click", () => this.handleBackupAndCleanup());
        backupHistoryBtn?.addEventListener("click", () => this.handleShowBackupHistory());
        triggerBackupBtn?.addEventListener("click", () => this.handleTriggerManualBackup());

        // Backup history modal
        const closeBackupHistory = document.getElementById("close-backup-history");
        closeBackupHistory?.addEventListener("click", () => {
            document.getElementById("backup-history-modal").classList.add("hidden");
        });

        // Close modal on backdrop click
        const backupHistoryModal = document.getElementById("backup-history-modal");
        backupHistoryModal?.addEventListener("click", (e) => {
            if (e.target === backupHistoryModal) {
                backupHistoryModal.classList.add("hidden");
            }
        });
    },

    setInitialDate(date) {
        const dateInput = document.getElementById("filter-date");
        if (dateInput) {
            dateInput.value = date;
            dateInput.max = date;
        }
    },

    async loadLogs(date) {
        const logContainer = document.getElementById("monitor-log-list");
        const statsContainer = document.getElementById("stats-container");

        if (!logContainer) return;

        // Show loading state
        logContainer.innerHTML = MonitorBackendView.renderLoadingState();
        if (statsContainer) {
            statsContainer.innerHTML = "";
        }

        // Disable backup buttons while loading
        MonitorBackendView.disableBackupButtons();
        MonitorBackendView.updateLogCountBadge(0);

        try {
            const { logs, count } = await MonitorBackendModel.fetchLogs(date);
            this.currentLogs = logs;

            if (!logs || logs.length === 0) {
                logContainer.innerHTML = MonitorBackendView.renderEmptyState();
                MonitorBackendView.disableBackupButtons();
                return;
            }

            // Enable backup buttons since we have logs
            MonitorBackendView.enableBackupButtons();
            MonitorBackendView.updateLogCountBadge(logs.length);

            // Render stats
            if (statsContainer) {
                statsContainer.innerHTML = MonitorBackendView.renderStats(logs);
            }

            // Render logs
            logContainer.innerHTML = "";
            logs.forEach((log) => {
                const logElement = document.createElement("div");
                logElement.innerHTML = MonitorBackendView.renderLogItem(log);
                logContainer.appendChild(logElement.firstElementChild);
            });

        } catch (error) {
            console.error('Error loading logs:', error);
            logContainer.innerHTML = MonitorBackendView.renderErrorState(error.message || 'Gagal mengambil log aktivitas');
            MonitorBackendView.disableBackupButtons();
        }
    },

    async handleDownloadBackup() {
        if (!this.currentDate) {
            MonitorBackendView.showToast('Pilih tanggal terlebih dahulu', 'warning');
            return;
        }

        if (!this.currentLogs || this.currentLogs.length === 0) {
            MonitorBackendView.showToast('Tidak ada log untuk di-backup', 'warning');
            return;
        }

        try {
            MonitorBackendView.showLoadingOverlay('Membuat backup...');

            const result = await MonitorBackendModel.downloadBackup(this.currentDate, 'json', false);

            MonitorBackendView.hideLoadingOverlay();
            MonitorBackendView.showToast(
                `Backup berhasil didownload: ${result.filename} (${result.logCount} logs)`,
                'success'
            );

        } catch (error) {
            MonitorBackendView.hideLoadingOverlay();
            MonitorBackendView.showToast(`Gagal download backup: ${error.message}`, 'error');
        }
    },

    async handleBackupAndCleanup() {
        if (!this.currentDate) {
            MonitorBackendView.showToast('Pilih tanggal terlebih dahulu', 'warning');
            return;
        }

        if (!this.currentLogs || this.currentLogs.length === 0) {
            MonitorBackendView.showToast('Tidak ada log untuk di-backup', 'warning');
            return;
        }

        MonitorBackendView.showConfirmationModal(
            'Konfirmasi Backup & Cleanup',
            `Anda akan melakukan backup dan menghapus ${this.currentLogs.length} log untuk tanggal ${this.currentDate}. Tindakan ini tidak dapat dibatalkan. Lanjutkan?`,
            async () => {
                try {
                    MonitorBackendView.showLoadingOverlay('Backup & cleanup...');

                    // Download backup with cleanup
                    const result = await MonitorBackendModel.downloadBackup(this.currentDate, 'json', true);

                    MonitorBackendView.hideLoadingOverlay();
                    MonitorBackendView.showToast(
                        `Backup & cleanup berhasil: ${result.filename} (${result.logCount} logs dihapus)`,
                        'success'
                    );

                    // Reload logs to show empty state
                    await this.loadLogs(this.currentDate);

                } catch (error) {
                    MonitorBackendView.hideLoadingOverlay();
                    MonitorBackendView.showToast(`Gagal backup & cleanup: ${error.message}`, 'error');
                }
            }
        );
    },

    async handleShowBackupHistory() {
        try {
            MonitorBackendView.showLoadingOverlay('Memuat riwayat backup...');

            const modal = document.getElementById("backup-history-modal");
            const content = document.getElementById("backup-history-content");

            const { history } = await MonitorBackendModel.fetchBackupHistory();

            if (content) {
                content.innerHTML = MonitorBackendView.renderBackupHistory(history);
            }

            MonitorBackendView.hideLoadingOverlay();
            modal.classList.remove("hidden");

        } catch (error) {
            MonitorBackendView.hideLoadingOverlay();
            MonitorBackendView.showToast(`Gagal memuat riwayat backup: ${error.message}`, 'error');
        }
    },

    async handleTriggerManualBackup() {
        MonitorBackendView.showConfirmationModal(
            'Trigger Manual Backup',
            'Anda akan memulai proses backup manual. Backup akan dikirim ke email semua admin. Lanjutkan?',
            async () => {
                try {
                    MonitorBackendView.showLoadingOverlay('Memulai backup manual...');

                    const result = await MonitorBackendModel.triggerManualBackup();

                    MonitorBackendView.hideLoadingOverlay();
                    MonitorBackendView.showToast(
                        result.message || 'Backup berhasil dipicu',
                        'success'
                    );

                } catch (error) {
                    MonitorBackendView.hideLoadingOverlay();
                    MonitorBackendView.showToast(`Gagal memulai manual backup: ${error.message}`, 'error');
                }
            }
        );
    }
};

export default MonitorBackendPresenter;