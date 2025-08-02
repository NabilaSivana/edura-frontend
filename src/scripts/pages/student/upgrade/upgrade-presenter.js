import { showToastNotification } from "../../../utils/index.js";
import { loadMidtransSnap } from "../../../utils/load-midtrans.js";
import PaymentModel from "./upgrade-model.js";

const PaymentPresenter = {
    async init() {
        const button = document.getElementById("upgrade-btn");
        if (!button) return;

        button.addEventListener("click", async () => {
            button.disabled = true;
            button.textContent = "Memproses...";

            try {
                // Lazy Load Midtrans Snap
                await loadMidtransSnap();

                const { token } = await PaymentModel.getSnapToken();

                window.snap.pay(token, {
                    onSuccess: () => {
                        window.location.href = "#/status?status=success";
                    },
                    onPending: () => {
                        window.location.href = "#/status?status=pending";
                    },
                    onError: () => {
                        window.location.href = "#/status?status=failed";
                    },
                    onClose: () => {
                        showToastNotification("Transaksi dibatalkan.", "info");
                        // Tetap di halaman sekarang
                    },
                });
            } catch (err) {
                // console.error(err);
                showToastNotification("❌ Gagal memproses pembayaran. Coba lagi nanti.", "error");
            } finally {
                button.disabled = false;
                button.textContent = "Upgrade ke Premium";
            }
        });
    },
};

export default PaymentPresenter;
