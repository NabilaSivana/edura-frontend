// src/scripts/component/dashboard-navbar.js

function dashboardNavbar(user) {
  return `
    <div class="relative" id="dashboard-navbar-profile">
      <div class="flex items-center gap-2 cursor-pointer" id="profile-toggle">
        <span class="font-medium text-gray-700">${user?.name || "User"}</span>
        <img src="/path/to/avatar.png" alt="Avatar" class="w-9 h-9 rounded-full border" />
      </div>
      <div id="profile-popup" class="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg hidden z-50">
        <div class="px-4 py-2 text-sm text-gray-700 border-b">
          <p>${user?.name || "User"}</p>
          <p class="text-xs text-gray-500">${
            user?.email || "user@example.com"
          }</p>
        </div>
        <button id="logout-button" class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100">Logout</button>
      </div>
    </div>
  `;
}

function afterRenderDashboardNavbar() {
  const toggle = document.querySelector("#profile-toggle");
  const popup = document.querySelector("#profile-popup");
  const logoutBtn = document.querySelector("#logout-button");

  if (toggle && popup) {
    toggle.addEventListener("click", () => {
      popup.classList.toggle("hidden");
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "#/login";
    });
  }

  // Optional: klik di luar menutup popup
  window.addEventListener("click", (e) => {
    if (
      !document.querySelector("#dashboard-navbar-profile").contains(e.target)
    ) {
      popup?.classList.add("hidden");
    }
  });
}

export { dashboardNavbar, afterRenderDashboardNavbar };
