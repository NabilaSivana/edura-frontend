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
        // ⬅️ Lazy Load Snap di sini
        await loadMidtransSnap();

        const { token } = await PaymentModel.getSnapToken();

        window.snap.pay(token, {
          onSuccess: async () => {
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
