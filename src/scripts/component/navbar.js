// FILE: component/navbar.js
import CONFIG from "../config"; // sesuaikan path

function renderNavbar() {
  return `
    <nav class="bg-white shadow-md fixed top-0 left-0 w-full z-40">
      <div class="px-4 py-3 flex justify-between items-center bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
        
        <div class="flex items-center gap-4">
          <button id="hamburger-toggle" class="text-xl md:hidden">☰</button>
          <a href="#/dashboard" class="flex items-center gap-2">
            <img src="/logo2.png" alt="logo" class="w-8 h-8" />
            <h1 class="text-lg font-bold text-gray-800">Edura</h1>
          </a>
        </div>

        <div>
          <!-- Guest Links -->
          <div id="nav-guest" class="flex gap-4 hidden">
            <a href="#/login" class="px-4 py-2 rounded border border-gray-300 text-black hover:bg-gray-100">Login</a>
            <a href="#/register" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Daftar</a>
          </div>

          <!-- User Profile -->
          <div id="nav-user" class="relative hidden">
            <button id="profile-toggle" class="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center">
              <i class="fa-solid fa-user"></i>
            </button>
            <div id="profile-popup" class="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg hidden z-50">
              <div class="p-4 border-b">
                <p id="profile-name" class="text-sm font-medium text-gray-700">—</p>
              </div>
              <button id="logout-button" class="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100">
                Logout
              </button>
            </div>
          </div>
        </div>

      </div>
    </nav>
  `;
}

async function afterRenderNavbar() {
  // 1. Sidebar toggle
  const hamburgerBtn = document.getElementById("hamburger-toggle");
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener("click", () => {
      const sidebar = document.getElementById("sidebar");
      const overlay = document.getElementById("sidebar-overlay");
      sidebar?.classList.toggle("-translate-x-full");
      overlay?.classList.toggle("hidden");
    });
  }

  // 2. Cek login via API
  try {
    const res = await fetch(`${CONFIG.BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (!res.ok) throw new Error("Not logged in");
    const user = await res.json();

    // Tampilkan panel user
    document.getElementById("nav-guest").classList.add("hidden");
    const navUser = document.getElementById("nav-user");
    navUser.classList.remove("hidden");
    document.getElementById("profile-name").textContent = user.full_name;

    // Profile popup toggle
    const toggleBtn = document.getElementById("profile-toggle");
    const popup = document.getElementById("profile-popup");
    toggleBtn.addEventListener("click", () => popup.classList.toggle("hidden"));
    document.addEventListener("click", (e) => {
      if (!popup.contains(e.target) && e.target !== toggleBtn) {
        popup.classList.add("hidden");
      }
    });

    // Logout
    document.getElementById("logout-button").addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.hash = "#/login";
      window.location.reload();
    });

  } catch {
    // Tampilkan panel guest
    document.getElementById("nav-user").classList.add("hidden");
    document.getElementById("nav-guest").classList.remove("hidden");
  }
}

export default function navbar() {
  return {
    render: renderNavbar,
    afterRender: afterRenderNavbar,
  };
}
