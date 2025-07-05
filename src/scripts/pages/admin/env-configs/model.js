import CONFIG from "../../../config";

const EnvConfigModel = {
    async fetchEnv() {
        const res = await fetch(`${CONFIG.BASE_URL}/admin/env`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (!res.ok) throw new Error("Failed to fetch .env");
        const { env } = await res.json();

        // Fallback safety check
        if (!Array.isArray(env.GEMINI_API_KEYS)) {
            env.GEMINI_API_KEYS = [];
        }

        return env;
    },

    async updateEnv(updatedPayload) {
        const res = await fetch(`${CONFIG.BASE_URL}/admin/env`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(updatedPayload),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || "Gagal menyimpan perubahan .env");
        }

        return await res.json();
    },
};

export default EnvConfigModel;
