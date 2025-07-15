import CONFIG from "../../../config";

const EnvConfigModel = {
    // GET: Ambil semua config environment
    async fetchEnv() {
        const res = await fetch(`${CONFIG.BASE_URL}/admin/env`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (!res.ok) throw new Error("Gagal mengambil konfigurasi environment");
        return await res.json();
    },

    // GET: Ambil config berdasarkan key
    async getEnvByKey(key) {
        const res = await fetch(`${CONFIG.BASE_URL}/admin/env/${key}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (!res.ok) throw new Error("Gagal mengambil konfigurasi berdasarkan key");
        return await res.json();
    },

    // PUT: Update/insert config berdasarkan key
    async updateEnvByKey(key, value) {
        const res = await fetch(`${CONFIG.BASE_URL}/admin/env/${key}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ value }),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || "Gagal memperbarui konfigurasi");
        }

        return await res.json();
    },

    // DELETE: Hapus config berdasarkan key
    async deleteEnvByKey(key) {
        const res = await fetch(`${CONFIG.BASE_URL}/admin/env/${key}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || "Gagal menghapus konfigurasi");
        }

        return await res.json();
    },

    // PUT: Set API key Gemini yang aktif
    async setActiveGeminiKey(api_key) {
        const res = await fetch(`${CONFIG.BASE_URL}/admin/env/gemini/activate`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ api_key }),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || "Gagal mengaktifkan Gemini API key");
        }

        return await res.json();
    },
};

export default EnvConfigModel;
