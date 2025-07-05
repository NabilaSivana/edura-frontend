// === File: pages/admin/monitor-backend/presenter.js ===
import MonitorModel from "./model.js";

const MonitorPresenter = {
    async init() {
        this.renderDateFilter();
        const today = new Date().toISOString().slice(0, 10);
        await this.renderLogs(today);
    },

    async renderLogs(date) {
        const logContainer = document.getElementById("monitor-log-list");
        logContainer.innerHTML = "<p class='text-gray-500'>Memuat log aktivitas...</p>";

        try {
            const logs = await MonitorModel.fetchLogs(date);
            if (!logs || logs.length === 0) {
                logContainer.innerHTML = "<p class='text-gray-500'>Tidak ada log ditemukan pada tanggal tersebut.</p>";
                return;
            }

            logContainer.innerHTML = ""; // bersihkan

            logs.forEach((log) => {
                const row = document.createElement("div");
                row.className = "border rounded p-3 mb-3 bg-white shadow";

                const logTime = new Date(log.created_at).toLocaleString("id-ID");

                row.innerHTML = `
                    <div class="text-sm text-gray-600">${logTime}</div>
                    <div class="font-semibold text-blue-600">${log.action}</div>
                    <div class="text-sm text-gray-700">User: ${log.user_fullname || "-"} (${log.role || "-"})</div>
                    <pre class="bg-gray-100 p-2 text-sm overflow-x-auto mt-2 whitespace-pre-wrap break-words">
${JSON.stringify(log.detail, null, 2)}
                    </pre>
                `;

                logContainer.appendChild(row);
            });
        } catch (err) {
            logContainer.innerHTML = `<p class='text-red-500'>${err.message || 'Gagal mengambil log'}</p>`;
        }
    },

    renderDateFilter() {
        const input = document.getElementById("filter-date");
        const today = new Date().toISOString().slice(0, 10);
        input.value = today;
        input.max = today;

        input.addEventListener("change", () => {
            const selectedDate = input.value;
            if (selectedDate) this.renderLogs(selectedDate);
        });
    },
};

export default MonitorPresenter;
