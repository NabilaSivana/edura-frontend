// src/scripts/pages/upgrade/upgrade-presenter.js
import PaymentModel from "./upgrade-model.js";

const PaymentPresenter = {
    async init() {
        const button = document.getElementById("upgrade-btn");
        if (!button || !window.snap) {
            alert("Midtrans Snap belum tersedia.");
            return;
        }

        button.addEventListener("click", async () => {
            button.disabled = true;
            button.textContent = "Memproses...";

            try {
                const { token } = await PaymentModel.getSnapToken();

                window.snap.pay(token, {
                    onSuccess: async () => {
                        // Tunggu beberapa detik untuk memastikan webhook selesai
                        await new Promise((res) => setTimeout(res, 3000));

                        const user = await PaymentModel.getCurrentUser();

                        if (user.plan === "premium") {
                            alert("Berhasil upgrade ke Premium!");
                            window.location.href = "#/payment-success";
                        } else {
                            alert("Pembayaran berhasil, tapi status belum premium. Coba beberapa saat lagi.");
                            window.location.href = "#/dashboard";
                        }
                    },
                    onPending: () => alert("Pembayaran sedang diproses..."),
                    onError: () => alert("Terjadi kesalahan saat pembayaran."),
                    onClose: () => alert("Transaksi dibatalkan."),
                });
            } catch (err) {
                alert("Gagal mendapatkan token pembayaran.");
                console.error(err);
            } finally {
                button.disabled = false;
                button.textContent = "Upgrade ke Premium";
            }
        });
    },
};

export default PaymentPresenter;
