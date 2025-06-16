function DashboardHeader() {
  return `
    <header class="sticky top-0 z-50 bg-white shadow-lg">
      <div class="p-4 flex items-center justify-between max-w-7xl mx-auto">
        <a href="#/" class="flex items-center gap-2">
          <img src="/logo2.png" alt="logo" width="30" height="30" class="object-contain" />
          <h2 class="font-bold text-xl text-gray-800">EduraApp</h2>
        </a>
        <nav class="flex items-center gap-4">
          <a href="#/login">
            <button class="border px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100">
              Login
            </button>
          </a>
          <a href="#/register">
            <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
              Daftar
            </button>
          </a>
        </nav>
      </div>
    </header>
  `;
}

export default DashboardHeader;
