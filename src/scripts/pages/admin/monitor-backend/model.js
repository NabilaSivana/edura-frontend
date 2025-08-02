// // === File: pages/admin/monitor-backend/model.js ===
// import CONFIG from "../../../config.js";

// const MonitorBackendModel = {
//     async fetchLogs(date) {
//         try {
//             const response = await fetch(`${CONFIG.BASE_URL}/admin/activity-logs?date=${date}`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${localStorage.getItem("token")}`
//                 }
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.error || `HTTP ${response.status}: Gagal mengambil log aktivitas`);
//             }

//             const { logs } = await response.json();
//             return logs || [];
//         } catch (error) {
//             console.error('Error fetching activity logs:', error);
//             throw error;
//         }
//     }
// };

// export default MonitorBackendModel;
// / === File: pages/admin / monitor - backend / model.js ===
import CONFIG from "../../../config.js";

const MonitorBackendModel = {
    async fetchLogs(date) {
        try {
            const response = await fetch(`${CONFIG.BASE_URL}/admin/activity-logs?date=${date}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP ${response.status}: Gagal mengambil log aktivitas`);
            }

            const { logs, count } = await response.json();
            return { logs: logs || [], count: count || 0 };
        } catch (error) {
            console.error('Error fetching activity logs:', error);
            throw error;
        }
    },

    async downloadBackup(date, format = 'json', cleanup = false) {
        try {
            const url = `${CONFIG.BASE_URL}/admin/activity-logs/backup/${date}?format=${format}&cleanup=${cleanup}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}: Gagal download backup`);
            }

            // Get filename from response headers
            const contentDisposition = response.headers.get('Content-Disposition');
            const filename = contentDisposition
                ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
                : `backup-${date}.${format}`;

            // Get log count from headers
            const logCount = response.headers.get('X-Log-Count') || '0';

            // Create blob and download
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            return {
                filename,
                logCount: parseInt(logCount, 10),
                cleanup
            };
        } catch (error) {
            console.error('Error downloading backup:', error);
            throw error;
        }
    },

    async cleanupLogs(date, backupFilename = null) {
        try {
            const response = await fetch(`${CONFIG.BASE_URL}/admin/activity-logs/cleanup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    date,
                    confirm: true,
                    backup_filename: backupFilename
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP ${response.status}: Gagal cleanup log`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error cleaning up logs:', error);
            throw error;
        }
    },

    async fetchBackupHistory(page = 1, limit = 20) {
        try {
            const response = await fetch(`${CONFIG.BASE_URL}/admin/activity-logs/backup-history?page=${page}&limit=${limit}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP ${response.status}: Gagal mengambil riwayat backup`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error fetching backup history:', error);
            throw error;
        }
    },

    async triggerManualBackup() {
         try {
            const response = await fetch(`${CONFIG.BASE_URL}/trigger-backup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
            });
           
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP ${response.status}: Gagal memicu backup manual`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error fetching backup history:', error);
            throw error;
        }
    }
};

export default MonitorBackendModel;