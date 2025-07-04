// routes/class-page.js
import createSidebar from "../../../component/sidebar.js";
import TeacherClassPresenter from "./presenter.js";

const TeacherClassPage = {
  async render() {
    return `
    <div class="h-screen w-screen flex flex-col">
      <div id="navbar-container" class="shrink-0 z-50"></div>

      <div class="flex flex-1 overflow-hidden">
        <div id="sidebar-wrapper"></div>

        <main class="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50">
          <h1 class="text-xl font-bold mb-6">Manajemen Kelas</h1>

          <div id="class-section">
            <div id="class-loading" class="text-center py-6 text-blue-600">Memuat kelas...</div>
            <div id="class-list" class="grid gap-4"></div>
          </div>

          <div class="mt-10 border-t pt-6">
            <h2 class="text-lg font-semibold mb-2">Buat Kelas Baru</h2>
            <form id="create-class-form" class="space-y-4 max-w-md">
              <input type="text" id="name" name="name" placeholder="Nama Kelas" required
                class="w-full border rounded px-3 py-2">
              <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Buat Kelas
              </button>
              <p id="form-message" class="text-sm mt-2"></p>
            </form>
          </div>
        </main>
      </div>
    </div>`;
  },

  async afterRender() {
    // Sidebar
    const sidebarWrapper = document.getElementById("sidebar-wrapper");
    sidebarWrapper.innerHTML = "";
    const sidebar = await createSidebar();
    sidebarWrapper.appendChild(sidebar);

    // Navbar
    const navbarModule = (await import("../../../component/navbar.js")).default;
    const navbarContainer = document.getElementById("navbar-container");
    navbarContainer.innerHTML = navbarModule().render();
    navbarModule().afterRender();

    // Inisialisasi presenter
    TeacherClassPresenter.init();
  },
};

export default TeacherClassPage;
