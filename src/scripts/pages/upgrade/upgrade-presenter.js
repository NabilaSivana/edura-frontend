import UpgradeModel from "./upgrade-model.js";

const UpgradePresenter = {
    async init() {
        const formContainer = document.getElementById("upgrade-form-section");
        const upgradeButton = document.getElementById("upgrade-button");

        try {
            const user = await UpgradeModel.getUserProfile();

            if (user.plan === "premium") {
                formContainer.innerHTML = `<p class="text-green-600">Anda sudah menggunakan plan <strong>Premium</strong>.</p>`;
                return;
            }

            upgradeButton.addEventListener("click", async () => {
                upgradeButton.disabled = true;
                upgradeButton.textContent = "Mengalihkan ke pembayaran...";

                try {
                    const result = await UpgradeModel.requestUpgrade();
                    window.location.href = result.redirect_url;
                } catch (err) {
                    alert("Gagal memproses upgrade.");
                    console.error(err);
                } finally {
                    upgradeButton.disabled = false;
                    upgradeButton.textContent = "Upgrade Sekarang";
                }
            });
        } catch (err) {
            formContainer.innerHTML = `<p class="text-red-600">Gagal memuat data pengguna. Coba lagi nanti.</p>`;
        }
    }
};

export default UpgradePresenter;
