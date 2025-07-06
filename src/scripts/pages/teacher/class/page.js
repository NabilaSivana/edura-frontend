// routes/class-page.js - Optimized Version + Dark Mode
import createSidebar from "../../../component/sidebar.js";
import TeacherClassPresenter from "./presenter.js";

const TeacherClassPage = {
  async render() {
    return `
      <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
        <div id="navbar-container"></div>
        
        <div class="flex">
          <div id="sidebar-wrapper" class="w-64 flex-shrink-0 fixed h-full overflow-y-auto z-40"></div>
          
          <div class="flex-1 ml-64 p-4 sm:p-6 lg:p-8">
            <div class="mb-6 sm:mb-8">
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2 mt-16">
                📚 Manajemen Kelas
              </h1>
              <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300">Kelola kelas dan mahasiswa dengan mudah</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div class="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Total Kelas</p>
                    <p id="total-classes" class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">0 Kelas</p>
                  </div>
                  <div class="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <span class="text-blue-600 text-lg sm:text-xl">🏫</span>
                  </div>
                </div>
              </div>

              <div class="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Total Mahasiswa</p>
                    <p id="total-students" class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">0 Mahasiswa</p>
                  </div>
                  <div class="p-2 sm:p-3 bg-green-100 dark:bg-green-900 rounded-full">
                    <span class="text-green-600 text-lg sm:text-xl">👥</span>
                  </div>
                </div>
              </div>

              <div class="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Buat Kelas</p>
                    <p class="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">➕</p>
                  </div>
                  <button id="create-class-btn" class="px-3 py-2 sm:px-4 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <span class="hidden sm:inline">Buat Kelas Baru</span>
                    <span class="sm:hidden">Buat</span>
                  </button>
                </div>
              </div>
            </div>

            <div id="create-class-form-container" class="hidden mb-6 sm:mb-8">
              <div class="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 class="text-lg font-semibold mb-4">🚀 Buat Kelas</h3>
                <form id="create-class-form">
                  <div class="mb-4">
                    <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nama Kelas
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      placeholder="Masukkan nama kelas"
                      required
                    />
                  </div>
                  <div class="flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                    >
                      🚀 Buat Kelas
                    </button>
                    <button
                      type="button"
                      id="cancel-create-btn"
                      class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors text-sm sm:text-base"
                    >
                      Batal
                    </button>
                  </div>
                  <div id="form-message" class="mt-3"></div>
                </form>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6">
              <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Daftar Kelas</h2>
              <div class="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 w-full sm:w-auto">
                <button
                  class="view-toggle flex-1 sm:flex-none px-3 py-1 rounded-md text-sm font-medium bg-white dark:bg-gray-700 shadow-sm text-gray-700 dark:text-white transition-colors"
                  data-view="grid"
                >
                  📊 Grid
                </button>
                <button
                  class="view-toggle flex-1 sm:flex-none px-3 py-1 rounded-md text-sm font-medium text-gray-500 dark:text-gray-300 transition-colors"
                  data-view="list"
                >
                  📋 List
                </button>
              </div>
            </div>

            <div id="class-loading" class="text-center py-8 hidden">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p class="text-gray-600 dark:text-gray-300 mt-2">Memuat kelas...</p>
            </div>

            <div id="class-list" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"></div>

            <div id="empty-state" class="text-center py-12 sm:py-16 hidden">
              <div class="mb-4">
                <span class="text-4xl sm:text-6xl">📚</span>
              </div>
              <h3 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2">Belum ada kelas</h3>
              <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6">Mulai dengan membuat kelas pertama Anda</p>
              <button
                id="create-first-class-btn"
                class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
              >
                Buat Kelas Pertama
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const sidebarWrapper = document.getElementById("sidebar-wrapper");
    sidebarWrapper.innerHTML = "";
    const sidebar = await createSidebar();
    sidebarWrapper.appendChild(sidebar);

    const navbarModule = (await import("../../../component/navbar.js")).default;
    const navbarContainer = document.getElementById("navbar-container");
    navbarContainer.innerHTML = navbarModule().render();
    navbarModule().afterRender();

    const createClassBtn = document.getElementById("create-class-btn");
    const createFirstClassBtn = document.getElementById(
      "create-first-class-btn"
    );
    const createClassFormContainer = document.getElementById(
      "create-class-form-container"
    );
    const cancelCreateBtn = document.getElementById("cancel-create-btn");

    const showCreateForm = () => {
      createClassFormContainer.classList.remove("hidden");
      createClassFormContainer.scrollIntoView({ behavior: "smooth" });
    };

    const hideCreateForm = () => {
      createClassFormContainer.classList.add("hidden");
    };

    createClassBtn?.addEventListener("click", showCreateForm);
    createFirstClassBtn?.addEventListener("click", showCreateForm);
    cancelCreateBtn?.addEventListener("click", hideCreateForm);

    document.querySelectorAll(".view-toggle").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const view = e.target.dataset.view;
        const classList = document.getElementById("class-list");

        document.querySelectorAll(".view-toggle").forEach((b) => {
          b.classList.remove(
            "bg-white",
            "dark:bg-gray-700",
            "shadow-sm",
            "text-gray-700",
            "dark:text-white"
          );
          b.classList.add("text-gray-500", "dark:text-gray-300");
        });
        e.target.classList.add(
          "bg-white",
          "dark:bg-gray-700",
          "shadow-sm",
          "text-gray-700",
          "dark:text-white"
        );
        e.target.classList.remove("text-gray-500", "dark:text-gray-300");

        if (view === "list") {
          classList.className = "grid grid-cols-1 gap-4";
        } else {
          classList.className =
            "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6";
        }
      });
    });

    TeacherClassPresenter.init();
  },
};

export default TeacherClassPage;
