// src/scripts/pages/admin/manage-payments/presenter.js
import ManagePaymentsModel from "./model.js";

const ManagePaymentsPresenter = {
    view: null,

    init(view) {
        this.view = view;
        this.setupEventHandlers();
        this.loadInitialData();
    },

    setupEventHandlers() {
        // Set event handlers on view
        this.view.onSearchChange = this.handleSearchChange.bind(this);
        this.view.onFilterChange = this.handleFilterChange.bind(this);
        this.view.onPageChange = this.handlePageChange.bind(this);
        this.view.onViewPayment = this.handleViewPayment.bind(this);
        this.view.onDeletePayment = this.handleDeletePayment.bind(this);
        this.view.onExportPayments = this.handleExportPayments.bind(this);
        this.view.onRefresh = this.handleRefresh.bind(this);
        this.view.onConfirmDelete = this.handleConfirmDelete.bind(this);
    },

    async loadInitialData() {
        try {
            console.log('🔄 Loading initial payments data...');
            this.view.showLoading();

            // Load statistics
            const stats = await this.calculateStatistics();
            this.view.renderStatistics(stats);

            // Load payments
            await this.loadPayments();

            console.log('✅ Initial payments data loaded successfully');
        } catch (error) {
            console.error('❌ Error loading initial data:', error);
            this.view.showError('Gagal memuat data pembayaran: ' + error.message);
        }
    },

    async loadPayments() {
        try {
            this.view.showLoading();

            const filters = this.view.getFilters();
            const result = await ManagePaymentsModel.fetchPayments(
                filters.search,
                filters.page,
                filters.limit,
                filters.status,
                filters.date
            );

            this.view.renderPayments(result.data || []);

            if (result.total > 0) {
                this.view.renderPagination({
                    currentPage: result.page || filters.page,
                    totalPages: result.totalPages || 1,
                    totalItems: result.total || 0,
                    itemsPerPage: filters.limit || 10
                });
            } else {
                // Clear pagination if no data
                const paginationContainer = document.getElementById('pagination-container');
                if (paginationContainer) {
                    paginationContainer.innerHTML = '';
                }
            }

            this.view.hideLoading();
        } catch (error) {
            console.error('❌ Error loading payments:', error);
            this.view.showError('Gagal memuat data pembayaran: ' + error.message);
        }
    },

    async calculateStatistics() {
        try {
            // Get all payments for statistics calculation
            const allPayments = await ManagePaymentsModel.fetchPayments('', 1, 1000);
            const payments = allPayments.data || [];

            const stats = {
                totalTransactions: payments.length,
                totalRevenue: payments
                    .filter(p => p.status === 'settlement')
                    .reduce((sum, p) => sum + (p.amount || 0), 0),
                successfulPayments: payments.filter(p => p.status === 'settlement').length,
                pendingPayments: payments.filter(p => p.status === 'pending').length
            };

            return stats;
        } catch (error) {
            console.error('❌ Error calculating statistics:', error);
            return {
                totalTransactions: 0,
                totalRevenue: 0,
                successfulPayments: 0,
                pendingPayments: 0
            };
        }
    },

    async handleSearchChange(search) {
        console.log('🔍 Search changed:', search);
        this.view.updateFilters({ search, page: 1 });
        await this.loadPayments();
    },

    async handleFilterChange(filterType, value) {
        console.log(`🔧 Filter changed: ${filterType} = ${value}`);
        const update = { page: 1 };
        update[filterType] = value;
        this.view.updateFilters(update);
        await this.loadPayments();
    },

    async handlePageChange(page) {
        console.log('📄 Page changed:', page);
        this.view.updateFilters({ page });
        await this.loadPayments();
    },

    async handleViewPayment(paymentId) {
        try {
            console.log('👁️ Viewing payment:', paymentId);
            const paymentDetail = await ManagePaymentsModel.detailPayments(paymentId);

            if (paymentDetail) {
                this.view.showPaymentDetailModal(paymentDetail);
            } else {
                this.view.showToast('Gagal memuat detail pembayaran', 'error');
            }
        } catch (error) {
            console.error('❌ Error viewing payment:', error);
            this.view.showToast('Gagal memuat detail pembayaran: ' + error.message, 'error');
        }
    },

    async handleDeletePayment(paymentId) {
        try {
            console.log('🗑️ Delete payment requested:', paymentId);

            // Get payment details for confirmation
            const paymentDetail = await ManagePaymentsModel.detailPayments(paymentId);
            const paymentInfo = paymentDetail ?
                `${paymentDetail.full_name} (${paymentDetail.email})` :
                'pembayaran ini';

            this.view.showDeleteConfirmation(paymentId, paymentInfo);
        } catch (error) {
            console.error('❌ Error preparing delete:', error);
            this.view.showToast('Gagal memuat data pembayaran: ' + error.message, 'error');
        }
    },

    async handleConfirmDelete(paymentId) {
        try {
            console.log('✅ Confirming delete payment:', paymentId);

            const success = await ManagePaymentsModel.deletePayments(paymentId);

            if (success) {
                this.view.showSuccess('Pembayaran berhasil dihapus');

                // Refresh data
                await this.loadPayments();

                // Update statistics
                const stats = await this.calculateStatistics();
                this.view.renderStatistics(stats);
            } else {
                this.view.showToast('Gagal menghapus pembayaran', 'error');
            }
        } catch (error) {
            console.error('❌ Error deleting payment:', error);
            this.view.showToast('Gagal menghapus pembayaran: ' + error.message, 'error');
        }
    },

    async handleExportPayments() {
        try {
            console.log('📤 Exporting payments...');

            this.view.startRefreshAnimation();

            // Get all payments for export
            const filters = this.view.getFilters();
            const allPayments = await ManagePaymentsModel.fetchPayments(
                filters.search,
                1,
                1000, // Get more records for export
                filters.status,
                filters.date
            );

            if (allPayments.data && allPayments.data.length > 0) {
                this.view.exportToCSV(allPayments.data);
                this.view.showSuccess('Export berhasil');
            } else {
                this.view.showToast('Tidak ada data untuk diekspor', 'info');
            }
        } catch (error) {
            console.error('❌ Error exporting payments:', error);
            this.view.showToast('Gagal export pembayaran: ' + error.message, 'error');
        } finally {
            this.view.stopRefreshAnimation();
        }
    },

    async handleRefresh() {
        try {
            console.log('🔄 Refreshing payments data...');

            this.view.startRefreshAnimation();

            // Reset filters if needed
            // this.view.resetFilters();

            await this.loadInitialData();

            this.view.showSuccess('Data berhasil dimuat ulang');
        } catch (error) {
            console.error('❌ Error refreshing:', error);
            this.view.showToast('Gagal memuat ulang data: ' + error.message, 'error');
        } finally {
            this.view.stopRefreshAnimation();
        }
    },

    destroy() {
        // Cleanup if needed
        if (this.view) {
            this.view.cleanup();
            this.view = null;
        }
    }
};

export default ManagePaymentsPresenter;