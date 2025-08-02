import createSidebar from "../../../component/sidebar";
const PaymentStatusPage = {
  async render() {
    // Ambil status dari URL hash query
    const hash = window.location.hash;
    const urlParams = new URLSearchParams(hash.split('?')[1]);
    const status = urlParams.get('status') || 'unknown';

    let icon, title, message, color;

    if (status === 'success') {
      icon = `
        <div class="text-green-600 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      `;
      title = "Pembayaran Berhasil";
      message = `Selamat! Akun kamu sekarang sudah <strong class="text-blue-600">Premium</strong>.`;
      color = "text-gray-800";
    } else if (status === 'failed') {
      icon = `
        <div class="text-red-600 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      `;
      title = "Pembayaran Gagal";
      message = `Mohon coba lagi atau hubungi dukungan.`;
      color = "text-red-700";
    } else if (status === 'pending') {
      icon = `
        <div class="text-yellow-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      `;
      title = "Pembayaran Menunggu";
      message = `Kami sedang memproses pembayaran kamu. Mohon tunggu sebentar.`;
      color = "text-yellow-700";
    } else {
      icon = `
        <div class="text-gray-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4h4m-2-6a9 9 0 100 18 9 9 0 000-18z" />
          </svg>
        </div>
      `;
      title = "Status Tidak Diketahui";
      message = `Status pembayaran tidak dikenali.`;
      color = "text-gray-600";
    }

    return `
      <div class="flex w-screen h-screen bg-gray-50">
        <div id="sidebar-container"></div>
        <main class="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
          <div class="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center mx-auto">
            ${icon}
            <h1 class="text-2xl font-semibold mb-2 ${color}">${title}</h1>
            <p class="text-gray-600 mb-6">${message}</p>
            <a href="#/dashboard" class="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Kembali ke Beranda</a>
          </div>
        </main>
      </div>
    `;
  },

  async afterRender() {
    document.getElementById("sidebar-container").appendChild(createSidebar());
  },
};

export default PaymentStatusPage;
