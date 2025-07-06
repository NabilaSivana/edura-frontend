// FILE: class-page.js
import createSidebar from "../../../component/sidebar.js";
import TeacherGradePresenter from "./presenter.js";

const TeacherGradePage = {
  async render() {
    return `
    <div class="min-h-screen w-full flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <div id="navbar-container" class="z-50"></div>

      <div class="flex flex-1 overflow-hidden">
        <div id="sidebar-wrapper"></div>
        <main class="flex-1 overflow-y-auto p-6 md:p-10">
          <div class="max-w-7xl mx-auto">
            <div class="mb-8">
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white mt-16">📊 Manajemen Nilai</h1>
              <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">Kelola nilai siswa per kelas.</p>
            </div>

            <section id="grade-class-list-section">
              <div id="class-loading" class="text-center py-6 text-blue-600 dark:text-blue-400 animate-pulse">Memuat kelas...</div>
              <div id="class-list" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4"></div>
            </section>

            <section id="grade-detail-section" class="hidden mt-4">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div class="flex items-center gap-2">
                  <button id="back-to-class-list" class="text-blue-600 hover:underline text-sm">&larr; Kembali</button>
                </div>
                <div class="flex items-center gap-2">
                  <input type="text" id="student-search" placeholder="Cari nama/NIM..." class="px-3 py-2 rounded border text-sm">
                  <button id="download-csv" class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">Download CSV</button>
                </div>
              </div>
              <div class="overflow-x-auto">
                <table class="min-w-full border text-sm text-left">
                  <thead class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                    <tr>
                     
                      <th class="px-4 py-2 border cursor-pointer select-none" id="sort-by-name">
                        <div class="flex items-center gap-1">
                          NAME
                          <div class="flex flex-col">
                            <span class="text-xs leading-[0.75rem] -mb-1">▲</span>
                            <span class="text-xs leading-[0.75rem]">▼</span>
                          </div>
                        </div>
                      </th>
                      <th class="px-4 py-2 border">NIM</th>
                      <th class="px-4 py-2 border">Program Studi</th>
                      <th class="px-4 py-2 border">Jurusan</th>
                      <th class="px-4 py-2 border">Perguruan Tinggi</th>
                      <th class="px-4 py-2 border">Course</th>
                      <th class="px-4 py-2 border">Nilai</th>
                    </tr>
                  </thead>
                  <tbody id="grade-detail-body">
                    <!-- Dynamic rows will be injected here by presenter -->
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>`;
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

    TeacherGradePresenter.init();
  },
};

export default TeacherGradePage;
