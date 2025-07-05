import PaymentPresenter from "./upgrade-presenter.js";
import PaymentModel from "./upgrade-model.js";
import createSidebar from "../../../component/sidebar.js";
import Api from "../../../data/api.js"; // Tambahan
import "../../../component/loading-screen.js";
import "../../../component/navbar.js";

const UpgradePage = {
  async render() {
    return `
      <div class="h-screen w-screen flex flex-col">
        <!-- Navbar -->
        <div id="navbar-container" class="shrink-0 z-50"></div>

        <!-- Layout: Sidebar + Content -->
        <div class="flex flex-1 overflow-hidden">
          <!-- Sidebar -->
          <div id="sidebar-wrapper"></div>

          <!-- Main Content -->
          <main id="upgrade-content" class="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50">
            <div class="text-gray-500 animate-pulse text-center">Memuat status akun...</div>
          </main>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const profile = await Api.getProfile();
    const totalCourse =
      profile.role === "student" ? (await Api.getStudentCourses()).length : 0;

    // Sidebar
    const sidebarWrapper = document.getElementById("sidebar-wrapper");
    sidebarWrapper.innerHTML = "";
    const sidebar = await createSidebar(totalCourse);
    sidebarWrapper.appendChild(sidebar);

    // Navbar
    const navbarModule = (await import("../../../component/navbar.js")).default;
    const navbarContainer = document.getElementById("navbar-container");
    navbarContainer.innerHTML = navbarModule().render();
    navbarModule().afterRender();

    // Tampilkan konten dinamis berdasarkan plan user
    const user = await PaymentModel.getCurrentUser();
    const isPremium = user.plan === "premium";

    const expiresAt = user.plan_expires_at
      ? new Date(user.plan_expires_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      : "-";

    const content = `
      <section class="max-w-2xl mx-auto text-center">
        <h1 class="text-3xl font-bold mb-4">Upgrade ke Premium</h1>
        ${isPremium
        ? `
          <p class="mb-4 text-green-600 font-medium">
            Selamat, akun Anda sudah <strong>Premium</strong>!
          </p>
          <p class="mb-6 text-gray-700">
            Masa aktif hingga: <strong>${expiresAt}</strong>
          </p>
        `
        : `
          <p class="mb-6 text-gray-700">
            Nikmati fitur eksklusif hanya dengan <strong>Rp50.000</strong>
          </p>
          <button id="upgrade-btn" class="bg-blue-600 text-white px-6 py-3 rounded text-lg shadow hover:bg-blue-700">
            Upgrade ke Premium
          </button>
        `
      }
      </section>
    `;

    const mainContent = document.getElementById("upgrade-content");
    mainContent.innerHTML = content;

    // Aktifkan tombol upgrade jika belum premium
    if (!isPremium) {
      PaymentPresenter.init();
    }
  },
};

export default UpgradePage;
