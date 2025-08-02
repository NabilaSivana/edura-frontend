// // FILE: class-page.js
// import createSidebar from "../../../component/sidebar.js";
// import TeacherGradePresenter from "./presenter.js";

// const TeacherGradePage = {
//   async render() {
//     return `
//     <div class="h-screen w-screen flex flex-col">
//       <div id="navbar-container" class="z-50"></div>

//       <div class="flex flex-1 overflow-hidden">
//         <div id="sidebar-wrapper"></div>
//         <main class="flex-1 overflow-y-auto p-6 md:p-10">
//           <div class="max-w-7xl mx-auto">
//             <div class="mb-8">
//               <h1 class="text-2xl font-bold text-gray-900 dark:text-white mt-16">📊 Manajemen Nilai</h1>
//               <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">Kelola nilai siswa per kelas.</p>
//             </div>

//             <section id="grade-class-list-section">
//               <div id="class-loading" class="text-center py-6 text-blue-600 dark:text-blue-400 animate-pulse">Memuat kelas...</div>
//               <div id="class-list" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4"></div>
//             </section>

//             <section id="grade-detail-section" class="hidden mt-4">
//               <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
//                 <div class="flex items-center gap-2">
//                   <button id="back-to-class-list" class="text-blue-600 hover:underline text-sm">&larr; Kembali</button>
//                 </div>
//               </div>
//               <div class="overflow-x-auto">
//                 <table class="min-w-full border text-sm text-left">
//                   <thead class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
//                     <tr>
                     
//                       <th class="px-4 py-2 border cursor-pointer select-none" id="sort-by-name">
//                         <div class="flex items-center gap-1">
//                           NAME
//                           <div class="flex flex-col">
//                             <span class="text-xs leading-[0.75rem] -mb-1">▲</span>
//                             <span class="text-xs leading-[0.75rem]">▼</span>
//                           </div>
//                         </div>
//                       </th>
//                       <th class="px-4 py-2">NIM</th>
//                       <th class="px-4 py-2">Prodi</th>
//                       <th class="px-4 py-2">Course</th>
//                       <th class="px-4 py-2">Nilai</th>
//                       <th class="px-4 py-2">Progress</th> 
//                       <th class="px-4 py-2">Status</th>  
//                       <th class="px-4 py-2">Aksi</th>

//                     </tr>
//                   </thead>
//                   <tbody id="grade-detail-body">
//                     <!-- Dynamic rows will be injected here by presenter -->
//                   </tbody>
//                 </table>
//               </div>
//             </section>
//           </div>
//         </main>
//       </div>
//     </div>`;
//   },

//   async afterRender() {
//     const sidebarWrapper = document.getElementById("sidebar-wrapper");
//     sidebarWrapper.innerHTML = "";
//     const sidebar = await createSidebar();
//     sidebarWrapper.appendChild(sidebar);

//     const navbarModule = (await import("../../../component/navbar.js")).default;
//     const navbarContainer = document.getElementById("navbar-container");
//     navbarContainer.innerHTML = navbarModule().render();
//     navbarModule().afterRender();

//     TeacherGradePresenter.init();
//   },
// };

// export default TeacherGradePage;
// // FILE: class-page.js
// import createSidebar from "../../../component/sidebar.js";
// import TeacherGradePresenter from "./presenter.js";

// const TeacherGradePage = {
//   async render() {
//     return `
//     <div class="h-screen w-screen flex flex-col">
//       <div id="navbar-container" class="z-50"></div>

//       <div class="flex flex-1 overflow-hidden">
//         <div id="sidebar-wrapper"></div>
//         <main class="flex-1 overflow-y-auto p-6 md:p-10">
//           <div class="max-w-7xl mx-auto">
//             <div class="mb-8">
//               <h1 class="text-2xl font-bold text-gray-900 dark:text-white mt-16">📊 Manajemen Nilai</h1>
//               <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">Kelola nilai siswa per kelas.</p>
//             </div>

//             <section id="grade-class-list-section">
//               <div id="class-loading" class="text-center py-6 text-blue-600 dark:text-blue-400 animate-pulse">Memuat kelas...</div>
//               <div id="class-list" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4"></div>
//             </section>

//             <section id="grade-detail-section" class="hidden mt-4">
//               <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
//                 <div class="flex items-center gap-2">
//                   <button id="back-to-class-list" class="text-blue-600 hover:underline text-sm">&larr; Kembali</button>
//                 </div>
//               </div>
//               <div class="overflow-x-auto">
//                 <table class="min-w-full border text-sm text-left">
//                   <thead class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
//                     <tr>

//                       <th class="px-4 py-2 border cursor-pointer select-none" id="sort-by-name">
//                         <div class="flex items-center gap-1">
//                           NAME
//                           <div class="flex flex-col">
//                             <span class="text-xs leading-[0.75rem] -mb-1">▲</span>
//                             <span class="text-xs leading-[0.75rem]">▼</span>
//                           </div>
//                         </div>
//                       </th>
//                       <th class="px-4 py-2">NIM</th>
//                       <th class="px-4 py-2">Prodi</th>
//                       <th class="px-4 py-2">Course</th>
//                       <th class="px-4 py-2">Nilai</th>
//                       <th class="px-4 py-2">Progress</th> 
//                       <th class="px-4 py-2">Status</th>  
//                       <th class="px-4 py-2">Aksi</th>

//                     </tr>
//                   </thead>
//                   <tbody id="grade-detail-body">
//                     <!-- Dynamic rows will be injected here by presenter -->
//                   </tbody>
//                 </table>
//               </div>
//             </section>
//           </div>
//         </main>
//       </div>
//     </div>`;
//   },

//   async afterRender() {
//     const sidebarWrapper = document.getElementById("sidebar-wrapper");
//     sidebarWrapper.innerHTML = "";
//     const sidebar = await createSidebar();
//     sidebarWrapper.appendChild(sidebar);

//     const navbarModule = (await import("../../../component/navbar.js")).default;
//     const navbarContainer = document.getElementById("navbar-container");
//     navbarContainer.innerHTML = navbarModule().render();
//     navbarModule().afterRender();

//     TeacherGradePresenter.init();
//   },
// };

// export default TeacherGradePage;
import createSidebar from "../../../component/sidebar.js";
import TeacherGradePresenter from "./presenter.js";

const TeacherGradePage = {
  async render() {
    return `
    <div class="h-screen w-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <div id="navbar-container" class="z-50"></div>

      <div class="flex flex-1 overflow-hidden">
        <div id="sidebar-wrapper"></div>
        <main class="flex-1 overflow-y-auto">
          <div class="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
            
            <!-- Page Header -->
            <div class="mb-8 pt-16">
              <div class="flex items-center space-x-3 mb-4">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                  <i class="fas fa-chart-line text-white text-xl"></i>
                </div>
                <div>
                  <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Manajemen Nilai</h1>
                  <p class="text-base text-gray-600 dark:text-gray-300 mt-1">Kelola nilai dan progress belajar siswa per kelas</p>
                </div>
              </div>
            </div>

            <!-- Class List Section -->
            <section id="grade-class-list-section">
              <!-- Loading State -->
              <div id="class-loading" class="text-center py-12">
                <div class="inline-flex items-center px-6 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                  <div class="animate-spin w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full mr-3"></div>
                  <span class="text-lg font-medium">Memuat daftar kelas...</span>
                </div>
              </div>
              
              <!-- Class Cards Grid -->
              <div id="class-list" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"></div>
            </section>

            <!-- Detail Section -->
            <section id="grade-detail-section" class="hidden">
              <!-- Back Button -->
              <div class="mb-6">
                <button id="back-to-class-list" class="inline-flex items-center px-4 py-2.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors group">
                  <i class="fas fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i>
                  <span class="text-lg">Kembali ke Daftar Kelas</span>
                </button>
              </div>

              <!-- Dynamic Content Area -->
              <div id="dynamic-content-area">
                <!-- Stats, controls, and table will be inserted here by presenter -->
              </div>

              <!-- Enhanced Table Container -->
              <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
                <div class="overflow-x-auto">
                  <table class="min-w-full">
                    <thead class="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th class="px-4 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">
                          <button id="sort-by-name" class="flex items-center space-x-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group">
                            <span>Nama Siswa</span>
                            <div class="flex flex-col ml-2">
                              <i class="fas fa-caret-up text-xs -mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400"></i>
                              <i class="fas fa-caret-down text-xs group-hover:text-blue-600 dark:group-hover:text-blue-400"></i>
                            </div>
                          </button>
                        </th>
                        <th class="px-4 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">
                          NIM
                        </th>
                        <th class="px-4 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">
                          Program Studi
                        </th>
                        <th class="px-4 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">
                          Course
                        </th>
                        <th class="px-4 py-4 text-center text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">
                          Nilai
                        </th>
                        <th class="px-4 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">
                          Progress
                        </th>
                        <th class="px-4 py-4 text-center text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">
                          Status
                        </th>
                        <th class="px-4 py-4 text-center text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody id="grade-detail-body" class="divide-y divide-gray-200 dark:divide-gray-600">
                      <!-- Dynamic rows will be inserted here -->
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Help Section for Teachers -->
              <div class="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                <div class="flex items-start space-x-3">
                  <div class="flex-shrink-0">
                    <i class="fas fa-info-circle text-blue-600 dark:text-blue-400 text-xl"></i>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">Panduan Penggunaan</h3>
                    <ul class="text-blue-800 dark:text-blue-200 space-y-2 text-base">
                      <li class="flex items-start space-x-2">
                        <i class="fas fa-certificate text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0"></i>
                        <span><strong>Kirim Sertifikat:</strong> Tersedia untuk siswa yang telah menyelesaikan course dengan nilai akhir</span>
                      </li>
                      <li class="flex items-start space-x-2">
                        <i class="fas fa-envelope text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0"></i>
                        <span><strong>Kirim Notifikasi:</strong> Untuk mengingatkan siswa yang belum menyelesaikan course</span>
                      </li>
                      <li class="flex items-start space-x-2">
                        <i class="fas fa-download text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0"></i>
                        <span><strong>Download Excel:</strong> Export data nilai dalam format Excel untuk laporan</span>
                      </li>
                      <li class="flex items-start space-x-2">
                        <i class="fas fa-search text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0"></i>
                        <span><strong>Pencarian:</strong> Cari siswa berdasarkan nama, NIM, atau program studi</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>`;
  },

  async afterRender() {
    // Render sidebar
    const sidebarWrapper = document.getElementById("sidebar-wrapper");
    sidebarWrapper.innerHTML = "";
    const sidebar = await createSidebar();
    sidebarWrapper.appendChild(sidebar);

    // Render navbar
    try {
      const navbarModule = (await import("../../../component/navbar.js")).default;
      const navbarContainer = document.getElementById("navbar-container");
      if (navbarContainer && navbarModule) {
        navbarContainer.innerHTML = navbarModule().render();
        if (navbarModule().afterRender) {
          navbarModule().afterRender();
        }
      }
    } catch (error) {
      console.log("Navbar module not found, continuing without navbar");
    }

    // Initialize presenter
    TeacherGradePresenter.init();

    // Add responsive table scroll hint
    this.addScrollHint();
  },

  addScrollHint() {
    // Add scroll hint for mobile users on tables
    const addScrollHintToTable = () => {
      const tableContainer = document.querySelector('.overflow-x-auto');
      if (tableContainer && window.innerWidth < 768) {
        const hint = document.createElement('div');
        hint.className = 'text-sm text-gray-500 dark:text-gray-400 text-center py-2 border-t border-gray-200 dark:border-gray-600';
        hint.innerHTML = '<i class="fas fa-hand-point-right mr-2"></i>Geser ke kanan untuk melihat kolom lainnya';
        tableContainer.appendChild(hint);
      }
    };

    // Add hint when table is rendered
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          const hasTable = Array.from(mutation.addedNodes).some(node =>
            node.nodeType === 1 && (node.tagName === 'TABLE' || node.querySelector('table'))
          );
          if (hasTable) {
            setTimeout(addScrollHintToTable, 100);
          }
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Clean up observer after some time
    setTimeout(() => observer.disconnect(), 10000);
  }
};

export default TeacherGradePage;