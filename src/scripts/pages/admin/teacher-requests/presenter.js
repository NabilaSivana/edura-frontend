import TeacherRequestsModel from './model';

class TeacherRequestsPresenter {
  constructor(view) {
    this.view = view;
    this.model = new TeacherRequestsModel();
    
    this.init();
  }

  async init() {
    console.log('🎯 Initializing Teacher Requests Presenter...');
    
    // Set up event handlers
    this.setupEventHandlers();
    
    // Load initial data
    await this.loadRequests();
    
    // Initial render
    this.render();
  }

  setupEventHandlers() {
    // Filter handlers
    this.view.onStatusFilterChange = (status) => {
      this.handleStatusFilterChange(status);
    };

    this.view.onSearchChange = (searchTerm) => {
      this.handleSearchChange(searchTerm);
    };

    // Action handlers
    this.view.onApproveRequest = (requestId) => {
      this.handleApproveRequest(requestId);
    };

    this.view.onRejectRequest = (requestId, reason) => {
      this.handleRejectRequest(requestId, reason);
    };

    this.view.onViewRequest = (requestId) => {
      this.handleViewRequest(requestId);
    };

    this.view.onRefresh = () => {
      this.handleRefresh();
    };

    this.view.onExport = () => {
      this.handleExport();
    };
  }

  // Load teacher requests
  async loadRequests() {
    try {
      this.view.showLoading();
      await this.model.fetchRequests();
      this.render();
    } catch (error) {
      console.error('❌ Error loading requests:', error);
      this.view.showError('Gagal memuat data pengajuan: ' + error.message);
    }
  }

  // Handle status filter change
  handleStatusFilterChange(status) {
    console.log('📊 Status filter changed to:', status);
    this.model.setFilter('status', status);
    this.render();
  }

  // Handle search change
  handleSearchChange(searchTerm) {
    console.log('🔍 Search term changed to:', searchTerm);
    this.model.setFilter('search', searchTerm);
    this.render();
  }

  // Handle approve request
  async handleApproveRequest(requestId) {
    try {
      const request = this.model.getRequestById(requestId);
      if (!request) {
        throw new Error('Pengajuan tidak ditemukan');
      }

      // Show confirmation
      const confirmed = await this.view.showConfirmDialog(
        'Setujui Pengajuan',
        `Apakah Anda yakin ingin menyetujui pengajuan dari ${request.full_name}?`,
        'Setuju',
        'Batal'
      );

      if (!confirmed) return;

      this.view.showLoading();
      
      await this.model.updateRequestStatus(requestId, 'approved');
      
      this.view.showSuccess(`Pengajuan dari ${request.full_name} berhasil disetujui!`);
      this.render();
      
    } catch (error) {
      console.error('❌ Error approving request:', error);
      this.view.showError('Gagal menyetujui pengajuan: ' + error.message);
    }
  }

  // Handle reject request
  async handleRejectRequest(requestId, reason) {
    try {
      const request = this.model.getRequestById(requestId);
      if (!request) {
        throw new Error('Pengajuan tidak ditemukan');
      }

      // Get rejection reason if not provided
      if (!reason) {
        reason = await this.view.showRejectDialog(request.full_name);
        if (!reason) return; // User cancelled
      }

      this.view.showLoading();
      
      await this.model.updateRequestStatus(requestId, 'rejected', reason);
      
      this.view.showSuccess(`Pengajuan dari ${request.full_name} ditolak.`);
      this.render();
      
    } catch (error) {
      console.error('❌ Error rejecting request:', error);
      this.view.showError('Gagal menolak pengajuan: ' + error.message);
    }
  }

  // Handle view request details
  handleViewRequest(requestId) {
    const request = this.model.getRequestById(requestId);
    if (request) {
      this.view.showRequestDetails(request);
    }
  }

  // Handle refresh
  async handleRefresh() {
    console.log('🔄 Refreshing teacher requests...');
    await this.loadRequests();
  }

  // Handle export
  handleExport() {
    try {
      const requests = this.model.getFilteredRequests();
      const csvData = this.generateCSV(requests);
      this.view.downloadFile(csvData, 'teacher-requests.csv', 'text/csv');
      this.view.showSuccess('Data berhasil diekspor!');
    } catch (error) {
      console.error('❌ Error exporting data:', error);
      this.view.showError('Gagal mengekspor data: ' + error.message);
    }
  }

  // Generate CSV data
  generateCSV(requests) {
    const headers = [
      'Nama Lengkap',
      'Email', 
      'NIDN',
      'NIP',
      'Institusi',
      'Status',
      'Tanggal Pengajuan',
      'Tanggal Review',
      'Alasan Penolakan'
    ];

    const rows = requests.map(req => [
      req.full_name || '',
      req.email || '',
      req.nidn || '',
      req.nip || '',
      req.institution || '',
      this.model.getStatusText(req.status),
      this.model.formatDate(req.created_at),
      this.model.formatDate(req.reviewed_at),
      req.reject_reason || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return csvContent;
  }

  // Main render method
  render() {
    if (this.model.loading) {
      this.view.showLoading();
      return;
    }

    if (this.model.error) {
      this.view.showError(this.model.error);
      return;
    }

    // Get filtered data
    const filteredRequests = this.model.getFilteredRequests();
    const statistics = this.model.getStatistics();

    // Render components
    this.view.renderStatistics(statistics);
    this.view.renderFilters(this.model.filters);
    this.view.renderRequestsTable(filteredRequests);
    this.view.hideLoading();
  }

  // Cleanup
  destroy() {
    this.model.reset();
    this.view.cleanup();
  }
}

export default TeacherRequestsPresenter;