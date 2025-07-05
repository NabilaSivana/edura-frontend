// === presenter/manage-payments/presenter.js ===
import ManagePaymentsModel from "./model.js";

const ManagePaymentsPresenter = {
    currentPage: 1,
    searchTerm: "",

    async init() {
        this.setupSearch();
        await this.loadPayments();
    },

    setupSearch() {
        const searchInput = document.getElementById("payment-search");
        searchInput.addEventListener("input", async (e) => {
            this.searchTerm = e.target.value;
            this.currentPage = 1;
            await this.loadPayments();
        });
    },

    async loadPayments() {
        const listContainer = document.getElementById("payment-list");
        listContainer.innerHTML = "";

        const { data, total, page, totalPages } = await ManagePaymentsModel.fetchPayments(
            this.searchTerm,
            this.currentPage
        );

        if (!data || data.length === 0) {
            listContainer.innerHTML = "<p class='text-center text-gray-500'>Tidak ada data pembayaran.</p>";
            return;
        }

        data.forEach((payment) => {
            const card = document.createElement("div");
            card.className = "p-4 bg-white rounded shadow text-sm";
            card.innerHTML = `
        <p><strong>${payment.full_name}</strong> - ${payment.email}</p>
        <p>${payment.product} - <span class="font-medium">Rp${payment.amount.toLocaleString()}</span></p>
        <p>Status: <span class="font-semibold ${payment.status === 'settlement' ? 'text-green-600' : 'text-red-600'}">${payment.status}</span></p>
        <p><small>${new Date(payment.created_at).toLocaleString()}</small></p>
        <button class="mt-2 text-blue-600 underline detail-btn" data-id="${payment.id}">Lihat Detail</button>
        <button class="mt-1 text-red-600 underline delete-btn" data-id="${payment.id}">Hapus</button>
      `;
            listContainer.appendChild(card);
        });

        this.setupActionListeners();
    },

    setupActionListeners() {
        document.querySelectorAll(".detail-btn").forEach((btn) => {
            btn.addEventListener("click", async () => {
                const id = btn.dataset.id;
                const detail = await ManagePaymentsModel.detailPayments(id);
                alert(JSON.stringify(detail, null, 2)); // ganti dengan modal di real app
            });
        });

        document.querySelectorAll(".delete-btn").forEach((btn) => {
            btn.addEventListener("click", async () => {
                const id = btn.dataset.id;
                if (confirm("Yakin ingin menghapus log pembayaran ini?")) {
                    const success = await ManagePaymentsModel.deletePayments(id);
                    if (success) await this.loadPayments();
                }
            });
        });
    },
};

export default ManagePaymentsPresenter;
