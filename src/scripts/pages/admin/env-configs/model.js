// === File: pages/admin/env-config/model.js ===
import CONFIG from "../../../config.js";

const EnvConfigModel = {
    // GET: Ambil semua config environment
    async fetchEnv() {
        try {
            const response = await fetch(`${CONFIG.BASE_URL}/admin/env`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}: Gagal mengambil konfigurasi environment`);
            }

            const data = await response.json();
            return data || [];
        } catch (error) {
            console.error('Error fetching env configs:', error);
            throw error;
        }
    },

    // GET: Ambil config berdasarkan key
    async getEnvByKey(key) {
        try {
            const response = await fetch(`${CONFIG.BASE_URL}/admin/env/${encodeURIComponent(key)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}: Gagal mengambil konfigurasi berdasarkan key`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error fetching env config for key ${key}:`, error);
            throw error;
        }
    },

    // PUT: Update/insert config berdasarkan key
    async updateEnvByKey(key, value) {
        try {
            const response = await fetch(`${CONFIG.BASE_URL}/admin/env/${encodeURIComponent(key)}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ value }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}: Gagal memperbarui konfigurasi`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error updating env config ${key}:`, error);
            throw error;
        }
    },

    // DELETE: Hapus config berdasarkan key
    async deleteEnvByKey(key) {
        try {
            const response = await fetch(`${CONFIG.BASE_URL}/admin/env/${encodeURIComponent(key)}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}: Gagal menghapus konfigurasi`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error deleting env config ${key}:`, error);
            throw error;
        }
    },

    // PUT: Set API key Gemini yang aktif
    async setActiveGeminiKey(api_key) {
        try {
            const response = await fetch(`${CONFIG.BASE_URL}/admin/env/gemini/activate`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ api_key }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}: Gagal mengaktifkan Gemini API key`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error activating Gemini API key:', error);
            throw error;
        }
    },
};

export default EnvConfigModel;