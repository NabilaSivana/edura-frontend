import CONFIG from "../../../config";
import { showToastNotification } from "../../../utils/index";
import { showLoadingScreen, hideLoadingScreen } from "../../../component/loading-screen";

const ManagePaymentsModel = {
    // model.js
    async fetchPayments(search = "", page = 1) {
        showLoadingScreen("Memuat data pembayaran...");

        const url = new URL(`${CONFIG.BASE_URL}/admin/payments`);
        url.searchParams.append("search", search);
        url.searchParams.append("page", page);

        try {
            const response = await fetch(url.toString(), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            hideLoadingScreen();
            return data;
        } catch (error) {
            hideLoadingScreen();
            console.error("Error fetching payments:", error);
            showToastNotification("Gagal memuat data pembayaran.", "error");
            return { data: [], total: 0, page: 1, totalPages: 1 };
        }
    },
    async detailPayments(id) {
        showLoadingScreen("Memuat detail pembayaran...");

        try {
            const response = await fetch(`${CONFIG.BASE_URL}/admin/payments/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            hideLoadingScreen();
            return data;
        } catch (error) {
            hideLoadingScreen();
            console.error("Error fetching payment details:", error);
            showToastNotification("Gagal memuat detail pembayaran.", "error");
            return null;
        }
    },
    async deletePayments(id) {
        showLoadingScreen("Menghapus pembayaran...");

        try {
            const response = await fetch(`${CONFIG.BASE_URL}/admin/payments/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            hideLoadingScreen();
            showToastNotification("Pembayaran berhasil dihapus.", "success");
            return true;
        } catch (error) {
            hideLoadingScreen();
            console.error("Error deleting payment:", error);
            showToastNotification("Gagal menghapus pembayaran.", "error");
            return false;
        }
    }
};
export default ManagePaymentsModel;