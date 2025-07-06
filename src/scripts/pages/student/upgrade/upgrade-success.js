const PaymentSuccessPage = {
  async render() {
    return `
      <div class="flex w-screen h-screen bg-gray-50">
        <div id="sidebar-container"></div>
       <main class="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">


          <div class="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
            <div class="text-green-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 class="text-2xl font-semibold mb-2 text-gray-800">Pembayaran Berhasil</h1>
            <p class="text-gray-600 mb-6">Selamat! Akun kamu sekarang sudah <strong class="text-blue-600">Premium</strong>.</p>
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

export default PaymentSuccessPage;
