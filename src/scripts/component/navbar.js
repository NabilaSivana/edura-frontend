// src/scripts/component/navbar.js

function getUserFromLocalStorage() {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
}

function renderNavbar() {
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const user = getUserFromLocalStorage();

  const hash = window.location.hash || "#/";
  const isLandingPage =
    hash === "#/" || hash === "#/login" || hash === "#/register";

  // NAVBAR UNTUK LANDING PAGE (belum login)
  if (!isLoggedIn || isLandingPage) {
    return `
      <nav class="bg-white shadow-md sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <a href="#/" class="flex items-center gap-2">
            <img src="/logo2.png" alt="logo" width="30" height="30" class="object-contain" />
            <h1 class="text-xl font-bold text-gray-800">Edura</h1>
          </a>
          <div class="flex gap-4">
            <a href="#/login" class="text-sm text-gray-700 hover:text-blue-600">Login</a>
            <a href="#/register" class="text-sm text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">Daftar</a>
          </div>
        </div>
      </nav>
    `;
  }

  // NAVBAR UNTUK HALAMAN SETELAH LOGIN (dashboard)
  return `
    <nav class="bg-white shadow-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <a href="#/dashboard" class="flex items-center gap-2">
          <img src="/logo2.png" alt="logo" width="30" height="30" class="object-contain" />
          <h1 class="text-xl font-bold text-gray-800">Edura</h1>
        </a>
        <div class="relative">
          <button id="profile-toggle" class="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center focus:outline-none">
            <i class="fa-solid fa-user"></i>
          </button>
          <div id="profile-popup" class="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg hidden z-10">
            <div class="p-4 border-b">
              <p class="text-sm font-medium text-gray-700">${
                user?.name || "User"
              }</p>
              <p class="text-xs text-gray-500">${user?.email || ""}</p>
            </div>
            <button id="logout-button" class="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100">Logout</button>
          </div>
        </div>
      </div>
    </nav>
  `;
}

async function afterRenderNavbar() {
  const toggleBtn = document.getElementById("profile-toggle");
  const popup = document.getElementById("profile-popup");
  const logoutBtn = document.getElementById("logout-button");

  if (toggleBtn && popup) {
    toggleBtn.addEventListener("click", () => {
      popup.classList.toggle("hidden");
    });

    document.addEventListener("click", (e) => {
      if (!popup.contains(e.target) && e.target !== toggleBtn) {
        popup.classList.add("hidden");
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("user_id");

      window.location.hash = "#/login";
      window.location.reload(); // Refresh agar navbar ikut berubah
    });
  }
}

export default function navbar() {
  return {
    render: renderNavbar,
    afterRender: afterRenderNavbar,
  };
}
