import PaymentModel from "./upgrade-model.js";
import { loadMidtransSnap } from "../../../utils/load-midtrans.js";

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
                        window.location.href = "#/payment-success?status=success";
                    },
                    onPending: () => {
                        window.location.href = "#/payment-success?status=pending";
                    },
                    onError: () => {
                        window.location.href = "#/payment-success?status=failed";
                    },
                    onClose: () => {
                        alert("Transaksi dibatalkan.");
                        // Tetap di halaman sekarang
                    },
                });
            } catch (err) {
                console.error(err);
                alert("❌ Gagal memproses pembayaran. Coba lagi nanti.");
            } finally {
                button.disabled = false;
                button.textContent = "Upgrade ke Premium";
            }
        });
    },
};

export default PaymentPresenter;
