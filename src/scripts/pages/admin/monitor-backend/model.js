// pages/admin/monitor-backend/model.js
import CONFIG from "../../../config";

const MonitorBackendModel = {
    async fetchLogs(date) {
        const res = await fetch(`${CONFIG.BASE_URL}/admin/activity-logs?date=${date}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Gagal mengambil log");
        }

        const { logs } = await res.json();
        return logs;
    }
};

export default MonitorBackendModel;
