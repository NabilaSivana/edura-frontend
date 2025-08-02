// src/scripts/pages/admin/manage-payments/model.js
import CONFIG from "../../../config.js";
import { showToastNotification } from "../../../utils/index.js";
import { showLoadingScreen, hideLoadingScreen } from "../../../component/loading-screen.js";

const ManagePaymentsModel = {
    // Fetch payments with improved parameters
    async fetchPayments(search = "", page = 1, limit = 10, status = "", date = "") {
        try {
            const url = new URL(`${CONFIG.BASE_URL}/admin/payments`);

            // Add parameters
            url.searchParams.append("page", page);
            url.searchParams.append("limit", limit);

            if (search && search.trim()) {
                url.searchParams.append("search", search.trim());
            }

            if (status && status.trim()) {
                url.searchParams.append("status", status.trim());
            }

            if (date && date.trim()) {
                url.searchParams.append("date", date.trim());
            }

            console.log('📡 Fetching payments:', url.toString());

            const response = await fetch(url.toString(), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    window.location.hash = '#/login';
                    throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
                }
                if (response.status === 403) {
                    throw new Error('Anda tidak memiliki akses untuk melihat data ini.');
                }
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Payments fetched:', data?.data?.length || 0, 'items');

            return {
                data: data.data || [],
                total: data.total || 0,
                page: data.page || page,
                totalPages: data.totalPages || 1
            };
        } catch (error) {
            console.error("❌ Error fetching payments:", error);
            throw error;
        }
    },

    // Get payment detail by ID
    async detailPayments(id) {
        try {
            if (!id) {
                throw new Error('Payment ID diperlukan');
            }

            console.log('📡 Fetching payment detail:', id);

            const response = await fetch(`${CONFIG.BASE_URL}/admin/payments/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    window.location.hash = '#/login';
                    throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
                }
                if (response.status === 403) {
                    throw new Error('Anda tidak memiliki akses untuk melihat detail ini.');
                }
                if (response.status === 404) {
                    throw new Error('Pembayaran tidak ditemukan.');
                }
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Payment detail fetched:', data?.id || id);

            return data;
        } catch (error) {
            console.error("❌ Error fetching payment details:", error);
            throw error;
        }
    },

    // Delete payment by ID
    async deletePayments(id) {
        try {
            if (!id) {
                throw new Error('Payment ID diperlukan');
            }

            console.log('🗑️ Deleting payment:', id);

            const response = await fetch(`${CONFIG.BASE_URL}/admin/payments/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    window.location.hash = '#/login';
                    throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
                }
                if (response.status === 403) {
                    throw new Error('Anda tidak memiliki akses untuk menghapus data ini.');
                }
                if (response.status === 404) {
                    throw new Error('Pembayaran tidak ditemukan.');
                }
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Payment deleted successfully:', id);

            return true;
        } catch (error) {
            console.error("❌ Error deleting payment:", error);
            throw error;
        }
    },

    // Get payment statistics
    async getPaymentStatistics() {
        try {
            console.log('📡 Fetching payment statistics...');

            const response = await fetch(`${CONFIG.BASE_URL}/admin/payments/statistics`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) {
                // If endpoint doesn't exist, calculate from fetchPayments
                console.log('📊 Statistics endpoint not available, calculating from payments data...');
                const paymentsData = await this.fetchPayments('', 1, 1000);
                const payments = paymentsData.data || [];

                return {
                    totalTransactions: payments.length,
                    totalRevenue: payments
                        .filter(p => p.status === 'settlement')
                        .reduce((sum, p) => sum + (p.amount || 0), 0),
                    successfulPayments: payments.filter(p => p.status === 'settlement').length,
                    pendingPayments: payments.filter(p => p.status === 'pending').length,
                    failedPayments: payments.filter(p => ['failure', 'cancel'].includes(p.status)).length
                };
            }

            const data = await response.json();
            console.log('✅ Payment statistics fetched');

            return data;
        } catch (error) {
            console.error("❌ Error fetching payment statistics:", error);
            // Return default stats on error
            return {
                totalTransactions: 0,
                totalRevenue: 0,
                successfulPayments: 0,
                pendingPayments: 0,
                failedPayments: 0
            };
        }
    },

    // Export payments to CSV
    async exportPayments(filters = {}) {
        try {
            console.log('📤 Exporting payments...');

            const url = new URL(`${CONFIG.BASE_URL}/admin/payments/export`);

            // Add filter parameters
            if (filters.search) url.searchParams.append("search", filters.search);
            if (filters.status) url.searchParams.append("status", filters.status);
            if (filters.date) url.searchParams.append("date", filters.date);

            const response = await fetch(url.toString(), {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    window.location.hash = '#/login';
                    throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
                }
                if (response.status === 403) {
                    throw new Error('Anda tidak memiliki akses untuk export data ini.');
                }
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Gagal export pembayaran');
            }

            // Handle CSV download
            const blob = await response.blob();
            const url_download = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url_download;
            link.download = `payments-${Date.now()}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url_download);

            console.log('✅ Payments exported successfully');
            return { message: 'Export berhasil' };
        } catch (error) {
            console.error("❌ Error exporting payments:", error);
            throw error;
        }
    },

    // Helper method: Validate payment data
    validatePaymentData(data) {
        const errors = [];

        if (!data.full_name || data.full_name.trim().length < 2) {
            errors.push({ field: 'full_name', message: 'Nama lengkap minimal 2 karakter' });
        }

        if (!data.email || !/\S+@\S+\.\S+/.test(data.email.trim())) {
            errors.push({ field: 'email', message: 'Format email tidak valid' });
        }

        if (!data.amount || data.amount <= 0) {
            errors.push({ field: 'amount', message: 'Jumlah pembayaran harus lebih dari 0' });
        }

        if (!data.status || !['pending', 'settlement', 'expire', 'cancel', 'failure'].includes(data.status)) {
            errors.push({ field: 'status', message: 'Status pembayaran tidak valid' });
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    // Helper method: Format currency
    formatCurrency(amount) {
        try {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }).format(amount || 0);
        } catch (error) {
            return `Rp${(amount || 0).toLocaleString()}`;
        }
    },

    // Helper method: Get status color
    getStatusColor(status) {
        const colors = {
            settlement: 'green',
            pending: 'yellow',
            expire: 'gray',
            cancel: 'red',
            failure: 'red'
        };
        return colors[status] || 'gray';
    }
};

export default ManagePaymentsModel;