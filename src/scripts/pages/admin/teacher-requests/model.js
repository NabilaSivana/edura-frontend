import Api from '../../../data/api.js';

class TeacherRequestsModel {
    constructor() {
        this.requests = [];
        this.loading = false;
        this.error = null;
        this.filters = {
            status: 'all', // all, pending, approved, rejected
            search: ''
        };
        this.pagination = {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0
        };
    }

    // Fetch all teacher requests
    async fetchRequests() {
        try {
            this.loading = true;
            this.error = null;

            console.log('📋 Fetching teacher requests...');
            const data = await Api.getTeacherRequests();

            // Data sudah berformat array dari backend
            this.requests = Array.isArray(data) ? data : [];

            console.log(`✅ Loaded ${this.requests.length} teacher requests`);

            // Update pagination info (jika ada dari backend)
            if (data.pagination) {
                this.pagination = { ...this.pagination, ...data.pagination };
            } else {
                // Manual pagination jika backend tidak mengembalikan info pagination
                this.pagination.total = this.requests.length;
                this.pagination.totalPages = Math.ceil(this.requests.length / this.pagination.limit);
            }

            return this.requests;
        } catch (error) {
            console.error('❌ Error fetching teacher requests:', error);
            this.error = error.message;
            this.requests = [];
            throw error;
        } finally {
            this.loading = false;
        }
    }

    // Update request status (approve/reject)
    async updateRequestStatus(requestId, status, rejectReason = null) {
        try {
            this.loading = true;
            this.error = null;

            console.log(`📝 Updating request ${requestId} to ${status}`);

            const result = await Api.updateTeacherRequestStatus(requestId, status, rejectReason);

            // Update local data
            const requestIndex = this.requests.findIndex(req => req.id === requestId);
            if (requestIndex !== -1) {
                this.requests[requestIndex] = {
                    ...this.requests[requestIndex],
                    status,
                    reject_reason: rejectReason || null,
                    reviewed_at: new Date().toISOString()
                };
            }

            console.log(`✅ Successfully updated request ${requestId}`);
            return result;
        } catch (error) {
            console.error('❌ Error updating request status:', error);
            this.error = error.message;
            throw error;
        } finally {
            this.loading = false;
        }
    }

    // Get filtered and sorted requests (UPDATED for new fields)
    getFilteredRequests() {
        let filtered = [...this.requests];

        // Filter by status
        if (this.filters.status !== 'all') {
            filtered = filtered.filter(req => req.status === this.filters.status);
        }

        // Filter by search (name, email, NIDN, program_studi, perguruan_tinggi)
        if (this.filters.search.trim()) {
            const searchTerm = this.filters.search.toLowerCase().trim();
            filtered = filtered.filter(req =>
                (req.full_name || '').toLowerCase().includes(searchTerm) ||
                (req.email || '').toLowerCase().includes(searchTerm) ||
                (req.nidn || '').toLowerCase().includes(searchTerm) ||
                (req.program_studi || '').toLowerCase().includes(searchTerm) ||
                (req.perguruan_tinggi || '').toLowerCase().includes(searchTerm)
            );
        }

        return filtered;
    }

    // Get requests by status
    getRequestsByStatus(status) {
        return this.requests.filter(req => req.status === status);
    }

    // Get statistics
    getStatistics() {
        const total = this.requests.length;
        const pending = this.getRequestsByStatus('pending').length;
        const approved = this.getRequestsByStatus('approved').length;
        const rejected = this.getRequestsByStatus('rejected').length;

        return {
            total,
            pending,
            approved,
            rejected
        };
    }

    // Set filters
    setFilter(key, value) {
        this.filters[key] = value;
    }

    // Clear filters
    clearFilters() {
        this.filters = {
            status: 'all',
            search: ''
        };
    }

    // Get request by ID
    getRequestById(id) {
        return this.requests.find(req => req.id === id);
    }

    // Format date for display
    formatDate(dateString) {
        if (!dateString) return '-';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return dateString;
        }
    }

    // Get status badge class
    getStatusBadgeClass(status) {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'approved':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'rejected':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    }

    // Get status text in Indonesian
    getStatusText(status) {
        switch (status) {
            case 'pending':
                return 'Menunggu Review';
            case 'approved':
                return 'Disetujui';
            case 'rejected':
                return 'Ditolak';
            default:
                return status;
        }
    }

    // Validate request data (UPDATED for new fields)
    validateRequest(request) {
        const errors = [];

        if (!request.nidn || !/^\d{10,18}$/.test(request.nidn)) {
            errors.push('NIDN harus berupa 10-18 digit angka');
        }

        if (!request.program_studi || request.program_studi.trim().length === 0) {
            errors.push('Program Studi wajib diisi');
        }

        if (!request.perguruan_tinggi || request.perguruan_tinggi.trim().length === 0) {
            errors.push('Perguruan Tinggi wajib diisi');
        }

        if (!request.full_name || request.full_name.trim().length < 2) {
            errors.push('Nama lengkap minimal 2 karakter');
        }

        if (!request.email || !/\S+@\S+\.\S+/.test(request.email)) {
            errors.push('Email tidak valid');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Reset model state
    reset() {
        this.requests = [];
        this.loading = false;
        this.error = null;
        this.clearFilters();
    }
}

export default TeacherRequestsModel;