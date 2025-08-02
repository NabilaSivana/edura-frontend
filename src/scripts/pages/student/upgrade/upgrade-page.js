import "../../../component/loading-screen.js";
import "../../../component/navbar.js";
import createSidebar from "../../../component/sidebar.js";
import Api from "../../../data/api.js";
import PaymentModel from "./upgrade-model.js";
import PaymentPresenter from "./upgrade-presenter.js";

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
          <main class="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 text-gray-800 dark:text-white mt-16">
            <div class="min-h-full p-6 md:p-10">
              <div id="upgrade-content" class="flex items-center justify-center min-h-96">
                <div class="text-center">
                  <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p class="text-gray-600 dark:text-gray-300 text-lg">Memuat status akun...</p>
                </div>
              </div>
            </div>
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
      <div class="max-w-4xl mx-auto">
        <!-- Hero Section -->
        <div class="text-center mb-12">
          <div class="mb-6">
            ${isPremium
        ? `<div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white mb-4">
                   <svg class="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                     <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                   </svg>
                 </div>`
        : `<div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white mb-4">
                   <svg class="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                     <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/>
                   </svg>
                 </div>`
      }
          </div>
          
          <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            ${isPremium ? 'Akun Premium Aktif' : 'Upgrade ke Premium'}
          </h1>
          
          ${isPremium
        ? `<p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                 Selamat! Anda sudah menikmati semua fitur premium
               </p>`
        : `<p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                 Buka semua fitur eksklusif dan tingkatkan pengalaman belajar Anda
               </p>`
      }
        </div>

        ${isPremium
        ? `<!-- Premium Status Card -->
             <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 border border-green-200 dark:border-green-700">
               <div class="flex items-center justify-between flex-wrap gap-4">
                 <div class="flex items-center space-x-4">
                   <div class="flex-shrink-0">
                     <div class="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                       <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                         <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                       </svg>
                     </div>
                   </div>
                   <div>
                     <h3 class="text-2xl font-bold text-green-600 dark:text-green-400">Premium</h3>
                     <p class="text-gray-600 dark:text-gray-300">Status akun Anda</p>
                   </div>
                 </div>
                 
                 <div class="text-right">
                   <p class="text-sm text-gray-500 dark:text-gray-400">Berlaku hingga</p>
                   <p class="text-xl font-semibold text-gray-800 dark:text-white">${expiresAt}</p>
                 </div>
               </div>
             </div>

             <!-- Premium Benefits -->
             <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                 <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-4">
                   <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                   </svg>
                 </div>
                 <h3 class="font-semibold text-gray-800 dark:text-white mb-2">Akses Semua Kursus</h3>
                 <p class="text-gray-600 dark:text-gray-300 text-sm">Nikmati akses unlimited ke semua materi pembelajaran</p>
               </div>

               <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                 <div class="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mx-auto mb-4">
                   <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                   </svg>
                 </div>
                 <h3 class="font-semibold text-gray-800 dark:text-white mb-2">Fitur Eksklusif</h3>
                 <p class="text-gray-600 dark:text-gray-300 text-sm">Dapatkan fitur-fitur premium yang tidak tersedia untuk user gratis</p>
               </div>

               <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow md:col-span-2 lg:col-span-1">
                 <div class="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
                   <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 11-9.75 9.75 9.75 9.75 0 019.75-9.75z"/>
                   </svg>
                 </div>
                 <h3 class="font-semibold text-gray-800 dark:text-white mb-2">Dukungan Priority</h3>
                 <p class="text-gray-600 dark:text-gray-300 text-sm">Mendapat prioritas dalam layanan customer support</p>
               </div>
             </div>`

        : `<!-- Pricing Card -->
             <div class="max-w-lg mx-auto mb-12">
               <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
                 <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white text-center">
                   <div class="flex items-center justify-center mb-4">
                     <svg class="w-8 h-8 mr-2" fill="currentColor" viewBox="0 0 20 20">
                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                     </svg>
                     <span class="text-2xl font-bold">Premium Plan</span>
                   </div>
                   
                   <div class="mb-4">
                     <span class="text-5xl font-bold">Rp50.000</span>
                     <span class="text-lg opacity-80">/bulan</span>
                   </div>
                   
                   <p class="opacity-90">Akses penuh ke semua fitur premium</p>
                 </div>
                 
                 <div class="p-8">
                   <ul class="space-y-4 mb-8">
                   <li class="flex items-center">
                       <svg class="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                         <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                       </svg>
                       <span class="text-gray-700 dark:text-gray-300">Generate Course Unlimited</span>
                     </li>
                     <li class="flex items-center">
                       <svg class="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                         <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                       </svg>
                       <span class="text-gray-700 dark:text-gray-300">Akses Unlimited Semua Kursus</span>
                     </li>
                     <li class="flex items-center">
                       <svg class="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                         <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                       </svg>
                       <span class="text-gray-700 dark:text-gray-300">Akses Quiz Unlimited</span>
                     </li>
                     <li class="flex items-center">
                       <svg class="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                         <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                       </svg>
                       <span class="text-gray-700 dark:text-gray-300">Akses Flashcard Lebih Banyak</span>
                     </li>
                     
                   </ul>
                   
                   <button id="upgrade-btn" class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center">
                     <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                     </svg>
                     Upgrade Sekarang
                   </button>
                 </div>
               </div>
             </div>

           `
      }
      </div>
    `;

    const mainContent = document.getElementById("upgrade-content");
    if (mainContent) {
      mainContent.innerHTML = content;
    }

    // Aktifkan tombol upgrade jika belum premium
    if (!isPremium) {
      PaymentPresenter.init();
    }
  },
};

export default UpgradePage;