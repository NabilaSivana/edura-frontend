// // === File: pages/admin/monitor-backend/view.js ===
// const MonitorBackendView = {
//     render() {
//         return `
//             <div id="page-monitor-backend" class="h-screen w-screen flex flex-col">
//                 <div id="navbar-container" class="shrink-0 z-50"></div>

//                 <div class="flex flex-1 overflow-hidden">
//                     <div id="sidebar-wrapper"></div>

//                     <main class="flex-1 overflow-y-auto p-6 md:p-16 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
//                         <div class="max-w-7xl mx-auto">
//                             <!-- Header -->
//                             <div class="mb-8">
//                                 <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
//                                     <span class="text-2xl">📊</span>
//                                     Monitor Aktivitas Backend
//                                 </h1>
//                                 <p class="text-gray-600 dark:text-gray-400 mt-2">
//                                     Pantau log aktivitas dan operasi sistem backend
//                                 </p>
//                             </div>

//                             <!-- Filter Section -->
//                             <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
//                                 <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filter Data</h3>
//                                 <div class="flex flex-col sm:flex-row gap-4">
//                                     <div class="flex-1">
//                                         <label for="filter-date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                                             Tanggal:
//                                         </label>
//                                         <input
//                                             type="date"
//                                             id="filter-date"
//                                             class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
//                                                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
//                                                    dark:bg-gray-700 dark:text-white"
//                                         />
//                                     </div>
//                                     <div class="flex items-end">
//                                         <button
//                                             id="refresh-logs"
//                                             class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
//                                                    transition-colors duration-200 flex items-center gap-2"
//                                         >
//                                             <span>🔄</span>
//                                             Refresh
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>

//                             <!-- Stats Section -->
//                             <div id="stats-container" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//                                 <!-- Stats will be populated here -->
//                             </div>

//                             <!-- Logs Section -->
//                             <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
//                                 <div class="p-6 border-b border-gray-200 dark:border-gray-700">
//                                     <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Log Aktivitas</h3>
//                                 </div>
//                                 <div id="monitor-log-list" class="p-6">
//                                     <!-- Logs will be populated here -->
//                                 </div>
//                             </div>
//                         </div>
//                     </main>
//                 </div>
//             </div>
//         `;
//     },

//     renderLoadingState() {
//         return `
//             <div class="flex items-center justify-center py-8">
//                 <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                 <span class="ml-3 text-gray-600 dark:text-gray-400">Memuat log aktivitas...</span>
//             </div>
//         `;
//     },

//     renderEmptyState() {
//         return `
//             <div class="text-center py-12">
//                 <div class="text-6xl mb-4">📋</div>
//                 <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Tidak Ada Log</h3>
//                 <p class="text-gray-600 dark:text-gray-400">Tidak ada log aktivitas ditemukan pada tanggal tersebut.</p>
//             </div>
//         `;
//     },

//     renderErrorState(message) {
//         return `
//             <div class="text-center py-12">
//                 <div class="text-6xl mb-4">⚠️</div>
//                 <h3 class="text-lg font-medium text-red-600 dark:text-red-400 mb-2">Error</h3>
//                 <p class="text-gray-600 dark:text-gray-400">${message}</p>
//             </div>
//         `;
//     },

//     renderStats(logs) {
//         if (!logs || logs.length === 0) return '';

//         const totalLogs = logs.length;
//         const uniqueUsers = new Set(logs.map(log => log.user_fullname).filter(Boolean)).size;
//         const actions = logs.reduce((acc, log) => {
//             acc[log.action] = (acc[log.action] || 0) + 1;
//             return acc;
//         }, {});
//         const topAction = Object.keys(actions).reduce((a, b) => actions[a] > actions[b] ? a : b, '');

//         return `
//             <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
//                 <div class="text-2xl font-bold text-blue-600">${totalLogs}</div>
//                 <div class="text-sm text-gray-600 dark:text-gray-400">Total Log</div>
//             </div>
//             <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
//                 <div class="text-2xl font-bold text-green-600">${uniqueUsers}</div>
//                 <div class="text-sm text-gray-600 dark:text-gray-400">Pengguna Aktif</div>
//             </div>
//             <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
//                 <div class="text-2xl font-bold text-purple-600">${Object.keys(actions).length}</div>
//                 <div class="text-sm text-gray-600 dark:text-gray-400">Jenis Aktivitas</div>
//             </div>
//             <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
//                 <div class="text-lg font-bold text-orange-600 truncate">${topAction}</div>
//                 <div class="text-sm text-gray-600 dark:text-gray-400">Aktivitas Terbanyak</div>
//             </div>
//         `;
//     },

//     renderLogItem(log) {
//         const logTime = new Date(log.created_at).toLocaleString("id-ID", {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit',
//             second: '2-digit'
//         });

//         const actionColor = this.getActionColor(log.action);
//         const roleColor = this.getRoleColor(log.role);

//         return `
//             <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4 
//                         bg-white dark:bg-gray-700 hover:shadow-md transition-shadow duration-200">
//                 <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
//                     <div class="flex-1">
//                         <div class="flex flex-wrap items-center gap-2 mb-2">
//                             <span class="px-2 py-1 rounded-full text-xs font-medium ${actionColor}">
//                                 ${log.action}
//                             </span>
//                             <span class="px-2 py-1 rounded-full text-xs font-medium ${roleColor}">
//                                 ${log.role || 'Unknown'}
//                             </span>
//                             <span class="text-sm text-gray-500 dark:text-gray-400">
//                                 ${logTime}
//                             </span>
//                         </div>

//                         <div class="text-sm text-gray-700 dark:text-gray-300 mb-3">
//                             <span class="font-medium">User:</span> 
//                             ${log.user_fullname || 'System'} 
//                         </div>

//                         <div class="bg-gray-50 dark:bg-gray-800 rounded-md p-3">
//                             <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Detail:</div>
//                             <pre class="text-sm text-gray-700 dark:text-gray-300 overflow-x-auto whitespace-pre-wrap break-words">${this.formatLogDetail(log.detail)}</pre>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         `;
//     },

//     getActionColor(action) {
//         const colorMap = {
//             'LOGIN': 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200',
//             'LOGOUT': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
//             'CREATE': 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200',
//             'UPDATE': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200',
//             'DELETE': 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200',
//             'VIEW': 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200',
//         };

//         for (const [key, color] of Object.entries(colorMap)) {
//             if (action.toUpperCase().includes(key)) {
//                 return color;
//             }
//         }

//         return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
//     },

//     getRoleColor(role) {
//         const colorMap = {
//             'admin': 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200',
//             'manager': 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200',
//             'staff': 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200',
//             'user': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
//         };

//         return colorMap[role?.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
//     },

//     formatLogDetail(detail) {
//         if (!detail) return 'No detail available';

//         try {
//             if (typeof detail === 'string') {
//                 return detail;
//             }
//             return JSON.stringify(detail, null, 2);
//         } catch (error) {
//             return 'Invalid detail format';
//         }
//     }
// };

// export default MonitorBackendView;
// === File: pages/admin/monitor-backend/view.js ===
const MonitorBackendView = {
    render() {
        return `
            <div id="page-monitor-backend" class="h-screen w-screen flex flex-col">
                <div id="navbar-container" class="shrink-0 z-50"></div>

                <div class="flex flex-1 overflow-hidden">
                    <div id="sidebar-wrapper"></div>

                    <main class="flex-1 overflow-y-auto p-6 md:p-16 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
                        <div class="max-w-7xl mx-auto">
                            <!-- Header -->
                            <div class="mb-8">
                                <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                    <span class="text-2xl">📊</span>
                                    Monitor Aktivitas Backend
                                </h1>
                                <p class="text-gray-600 dark:text-gray-400 mt-2">
                                    Pantau log aktivitas dan kelola backup sistem backend
                                </p>
                            </div>

                            <!-- Action Buttons -->
                            <div class="flex flex-wrap gap-3 mb-6">
                                <button
                                    id="backup-history-btn"
                                    class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                                >
                                    <span>📜</span>
                                    Riwayat Backup
                                </button>
                                <button
                                    id="trigger-backup-btn"
                                    class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                                >
                                    <span>⚡</span>
                                    Trigger Manual Backup
                                </button>
                                <div class="ml-auto">
                                    <span class="text-sm text-gray-500 dark:text-gray-400">
                                        Auto-backup: Setiap hari jam 02:00 WIB
                                    </span>
                                </div>
                            </div>

                            <!-- Filter Section -->
                            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
                                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filter & Backup</h3>
                                <div class="flex flex-col lg:flex-row gap-4">
                                    <div class="flex-1">
                                        <label for="filter-date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Tanggal:
                                        </label>
                                        <input
                                            type="date"
                                            id="filter-date"
                                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                                                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                                   dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div class="flex items-end gap-2">
                                        <button
                                            id="refresh-logs"
                                            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                                                   transition-colors duration-200 flex items-center gap-2"
                                        >
                                            <span>🔄</span>
                                            Refresh
                                        </button>
                                        <button
                                            id="download-backup-btn"
                                            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 
                                                   transition-colors duration-200 flex items-center gap-2"
                                            disabled
                                        >
                                            <span>💾</span>
                                            Download
                                        </button>
                                        <button
                                            id="backup-cleanup-btn"
                                            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 
                                                   transition-colors duration-200 flex items-center gap-2"
                                            disabled
                                        >
                                            <span>🧹</span>
                                            Backup & Cleanup
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Stats Section -->
                            <div id="stats-container" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <!-- Stats will be populated here -->
                            </div>

                            <!-- Logs Section -->
                            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Log Aktivitas</h3>
                                    <div id="log-count-badge" class="hidden px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                                        <!-- Log count will be shown here -->
                                    </div>
                                </div>
                                <div id="monitor-log-list" class="p-6">
                                    <!-- Logs will be populated here -->
                                </div>
                            </div>
                        </div>
                    </main>
                </div>

                <!-- Backup History Modal -->
                <div id="backup-history-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">📜 Riwayat Backup</h3>
                            <button id="close-backup-history" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <span class="text-2xl">×</span>
                            </button>
                        </div>
                        <div id="backup-history-content" class="p-6 overflow-y-auto max-h-[70vh]">
                            <!-- Backup history will be loaded here -->
                        </div>
                    </div>
                </div>

                <!-- Confirmation Modal -->
                <div id="confirmation-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
                        <div class="p-6">
                            <div class="flex items-center mb-4">
                                <div class="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mr-3">
                                    <span class="text-red-600 dark:text-red-400 text-xl">⚠️</span>
                                </div>
                                <h3 id="confirmation-title" class="text-lg font-medium text-gray-900 dark:text-white"></h3>
                            </div>
                            <p id="confirmation-message" class="text-gray-600 dark:text-gray-400 mb-6"></p>
                            <div class="flex gap-3 justify-end">
                                <button 
                                    id="confirmation-cancel"
                                    class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                >
                                    Batal
                                </button>
                                <button 
                                    id="confirmation-confirm"
                                    class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                >
                                    Konfirmasi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Loading Overlay -->
                <div id="loading-overlay" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center gap-3">
                        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span id="loading-text" class="text-gray-900 dark:text-white">Memproses...</span>
                    </div>
                </div>
            </div>
        `;
    },

    renderLoadingState() {
        return `
            <div class="flex items-center justify-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span class="ml-3 text-gray-600 dark:text-gray-400">Memuat log aktivitas...</span>
            </div>
        `;
    },

    renderEmptyState() {
        return `
            <div class="text-center py-12">
                <div class="text-6xl mb-4">📋</div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Tidak Ada Log</h3>
                <p class="text-gray-600 dark:text-gray-400">Tidak ada log aktivitas ditemukan pada tanggal tersebut.</p>
            </div>
        `;
    },

    renderErrorState(message) {
        return `
            <div class="text-center py-12">
                <div class="text-6xl mb-4">⚠️</div>
                <h3 class="text-lg font-medium text-red-600 dark:text-red-400 mb-2">Error</h3>
                <p class="text-gray-600 dark:text-gray-400">${message}</p>
            </div>
        `;
    },

    renderStats(logs) {
        if (!logs || logs.length === 0) {
            return `
                <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div class="text-2xl font-bold text-gray-400">0</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">Total Log</div>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div class="text-2xl font-bold text-gray-400">0</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">Pengguna Aktif</div>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div class="text-2xl font-bold text-gray-400">0</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">Jenis Aktivitas</div>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div class="text-2xl font-bold text-gray-400">-</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">Aktivitas Terbanyak</div>
                </div>
            `;
        }

        const totalLogs = logs.length;
        const uniqueUsers = new Set(logs.map(log => log.user_fullname).filter(Boolean)).size;
        const actions = logs.reduce((acc, log) => {
            acc[log.action] = (acc[log.action] || 0) + 1;
            return acc;
        }, {});
        const topAction = Object.keys(actions).reduce((a, b) => actions[a] > actions[b] ? a : b, '');

        return `
            <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div class="text-2xl font-bold text-blue-600">${totalLogs}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Total Log</div>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div class="text-2xl font-bold text-green-600">${uniqueUsers}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Pengguna Aktif</div>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div class="text-2xl font-bold text-purple-600">${Object.keys(actions).length}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Jenis Aktivitas</div>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div class="text-lg font-bold text-orange-600 truncate">${topAction}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Aktivitas Terbanyak</div>
            </div>
        `;
    },

    renderLogItem(log) {
        const logTime = new Date(log.created_at).toLocaleString("id-ID", {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        const actionColor = this.getActionColor(log.action);
        const roleColor = this.getRoleColor(log.role);

        return `
            <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4 
                        bg-white dark:bg-gray-700 hover:shadow-md transition-shadow duration-200">
                <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div class="flex-1">
                        <div class="flex flex-wrap items-center gap-2 mb-2">
                            <span class="px-2 py-1 rounded-full text-xs font-medium ${actionColor}">
                                ${log.action}
                            </span>
                            <span class="px-2 py-1 rounded-full text-xs font-medium ${roleColor}">
                                ${log.role || 'Unknown'}
                            </span>
                            <span class="text-sm text-gray-500 dark:text-gray-400">
                                ${logTime}
                            </span>
                        </div>
                        
                        <div class="text-sm text-gray-700 dark:text-gray-300 mb-3">
                            <span class="font-medium">User:</span> 
                            ${log.user_fullname || 'System'} 
                        </div>

                        <div class="bg-gray-50 dark:bg-gray-800 rounded-md p-3">
                            <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Detail:</div>
                            <pre class="text-sm text-gray-700 dark:text-gray-300 overflow-x-auto whitespace-pre-wrap break-words">${this.formatLogDetail(log.detail)}</pre>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderBackupHistory(history) {
        if (!history || history.length === 0) {
            return `
                <div class="text-center py-8">
                    <div class="text-4xl mb-3">📦</div>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Belum Ada Riwayat</h3>
                    <p class="text-gray-600 dark:text-gray-400">Belum ada backup yang dilakukan.</p>
                </div>
            `;
        }

        return `
            <div class="space-y-4">
                ${history.map(entry => `
                    <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                        <div class="flex items-center justify-between mb-2">
                            <span class="px-2 py-1 rounded-full text-xs font-medium ${this.getBackupActionColor(entry.action)}">
                                ${this.formatBackupAction(entry.action)}
                            </span>
                            <span class="text-sm text-gray-500 dark:text-gray-400">
                                ${new Date(entry.created_at).toLocaleString('id-ID')}
                            </span>
                        </div>
                        <div class="text-sm text-gray-700 dark:text-gray-300 mb-2">
                            <strong>Admin:</strong> ${entry.admin_name}
                        </div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">
                            <pre class="whitespace-pre-wrap">${this.formatLogDetail(entry.detail)}</pre>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    getActionColor(action) {
        const colorMap = {
            'LOGIN': 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200',
            'LOGOUT': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
            'CREATE': 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200',
            'UPDATE': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200',
            'DELETE': 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200',
            'VIEW': 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200',
            'BACKUP': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-200',
        };

        for (const [key, color] of Object.entries(colorMap)) {
            if (action.toUpperCase().includes(key)) {
                return color;
            }
        }

        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    },

    getRoleColor(role) {
        const colorMap = {
            'admin': 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200',
            'manager': 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200',
            'staff': 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200',
            'user': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
            'system': 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200',
        };

        return colorMap[role?.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    },

    getBackupActionColor(action) {
        const colorMap = {
            'BACKUP_DOWNLOAD': 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200',
            'BACKUP_AND_CLEANUP': 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200',
            'LOG_CLEANUP': 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200',
            'AUTO_BACKUP': 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200',
        };

        return colorMap[action] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    },

    formatBackupAction(action) {
        const actionMap = {
            'BACKUP_DOWNLOAD': '💾 Download Backup',
            'BACKUP_AND_CLEANUP': '🧹 Backup & Cleanup',
            'LOG_CLEANUP': '🗑️ Cleanup Log',
            'AUTO_BACKUP': '⚡ Auto Backup',
        };

        return actionMap[action] || action;
    },

    formatLogDetail(detail) {
        if (!detail) return 'No detail available';

        try {
            if (typeof detail === 'string') {
                return detail;
            }
            return JSON.stringify(detail, null, 2);
        } catch (error) {
            return 'Invalid detail format';
        }
    },

    updateLogCountBadge(count) {
        const badge = document.getElementById('log-count-badge');
        if (badge) {
            if (count > 0) {
                badge.textContent = `${count} logs`;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }
    },

    enableBackupButtons() {
        const downloadBtn = document.getElementById('download-backup-btn');
        const cleanupBtn = document.getElementById('backup-cleanup-btn');

        if (downloadBtn) downloadBtn.disabled = false;
        if (cleanupBtn) cleanupBtn.disabled = false;
    },

    disableBackupButtons() {
        const downloadBtn = document.getElementById('download-backup-btn');
        const cleanupBtn = document.getElementById('backup-cleanup-btn');

        if (downloadBtn) downloadBtn.disabled = true;
        if (cleanupBtn) cleanupBtn.disabled = true;
    },

    showLoadingOverlay(text = 'Memproses...') {
        const overlay = document.getElementById('loading-overlay');
        const loadingText = document.getElementById('loading-text');

        if (loadingText) loadingText.textContent = text;
        if (overlay) overlay.classList.remove('hidden');
    },

    hideLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) overlay.classList.add('hidden');
    },

    showConfirmationModal(title, message, onConfirm) {
        const modal = document.getElementById('confirmation-modal');
        const titleEl = document.getElementById('confirmation-title');
        const messageEl = document.getElementById('confirmation-message');
        const confirmBtn = document.getElementById('confirmation-confirm');
        const cancelBtn = document.getElementById('confirmation-cancel');

        if (titleEl) titleEl.textContent = title;
        if (messageEl) messageEl.textContent = message;

        // Remove existing listeners
        const newConfirmBtn = confirmBtn.cloneNode(true);
        const newCancelBtn = cancelBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

        // Add new listeners
        newConfirmBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
            onConfirm();
        });

        newCancelBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        modal.classList.remove('hidden');
    },

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `fixed top-20 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;

        const bgColor = type === 'success' ? 'bg-green-500' :
            type === 'error' ? 'bg-red-500' :
                type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500';
        toast.className += ` ${bgColor} text-white`;

        const iconMap = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };

        toast.innerHTML = `
            <div class="flex items-center gap-3">
                <i class="fas fa-${iconMap[type]}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 100);

        // Auto remove
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 4000);
    }
};

export default MonitorBackendView;