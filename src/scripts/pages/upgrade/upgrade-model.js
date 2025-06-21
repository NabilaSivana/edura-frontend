import CONFIG from "../../config.js";

const UpgradeModel = {
    async getUserProfile() {
        const response = await fetch(`${CONFIG.BASE_URL}/profile`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (!response.ok) throw new Error("Gagal fetch profile");

        const { profile } = await response.json();
        return profile;
    },

    async requestUpgrade() {
        const response = await fetch(`${CONFIG.BASE_URL}/upgrade-plan`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) throw new Error("Gagal membuat transaksi");

        return response.json(); // { token, redirect_url }
    }
};

export default UpgradeModel;
