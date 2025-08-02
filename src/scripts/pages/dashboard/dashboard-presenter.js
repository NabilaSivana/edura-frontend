// import { renderCourseList } from "../../component/courseList.js";
// import {
//     hideElementLoading,
//     showElementLoading,
// } from "../../component/loading-screen.js";
// import WelcomeBanner from "../../component/welcome-banner.js";
// import Api from "../../data/api.js";
// import DashboardStudentPresenter from "../student/dashboard/dashboard-student-presenter.js";
// import DashboardTeacherPresenter from "../teacher/dashboard/dashboard-teacher-presenter.js";
// import RoleProfilePresenter from "./role-profile/role-profile-presenter.js";

// const DashboardPresenter = {
//   async init() {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       window.location.hash = "#/login";
//       return;
//     }

//     // === CEK APAKAH SEDANG GENERATING COURSE ===
//     const courseGenerating = localStorage.getItem("course_generating") === "true";
//     const generatingId = localStorage.getItem("generating_course_id");
//     const generatingTitle = localStorage.getItem("generating_course_title");
//     const generatingLevel = localStorage.getItem("generating_course_level");

//     if (courseGenerating && generatingId) {
//       const genSection = document.getElementById("course-generating-section");
//       const genTitleSpan = document.getElementById("generating-title");
//       const genLevelSpan = document.getElementById("generating-level");

//       if (genSection && genTitleSpan && genLevelSpan) {
//         genTitleSpan.textContent = generatingTitle || "(tidak diketahui)";
//         genLevelSpan.textContent = generatingLevel || "";
//         genSection.style.display = "block";
//       }

//       const checkStatus = async () => {
//         try {
//           const status = await CreateCourseModel.checkGenerationStatus(generatingId);
//           if (status.complete) {
//             clearInterval(intervalId);
//             // Bersihkan localStorage dan reload dashboard
//             localStorage.removeItem("course_generating");
//             localStorage.removeItem("generating_course_id");
//             localStorage.removeItem("generating_course_title");
//             localStorage.removeItem("generating_course_level");
//             window.location.reload();
//           }
//         } catch (err) {
//           console.warn("Gagal cek status generate:", err);
//         }
//       };

//       // Polling setiap 7 detik
//       const intervalId = setInterval(checkStatus, 7000);
//       await checkStatus(); // cek pertama kali langsung

//       // Tambahkan pesan bantuan jika lebih dari 2 menit belum selesai
//       setTimeout(() => {
//         const helpBox = document.getElementById("generation-help");
//         if (helpBox) {
//           helpBox.innerHTML = `
//           🚨 Pembuatan course membutuhkan waktu lebih lama dari biasanya.<br>
//           <a href="#/create" class="underline text-blue-600">Klik di sini untuk buat ulang</a>
//           atau hubungi admin jika masalah berlanjut.
//         `;
//         }
//       }, 120000); // 2 menit

//       return; // hentikan render dashboard sampai selesai generate
//     }

//     // === CEK PROFIL USER ===
//     let user;
//     try {
//       user = await Api.getProfile();
//     } catch (err) {
//       // console.error("Gagal ambil profil:", err);
//       window.location.hash = "#/login";
//       return;
//     }

//     const welcomeTarget = document.getElementById("welcome-container");
//     if (welcomeTarget) {
//       showElementLoading("welcome-container", "Memuat sambutan...");
//       const banner = WelcomeBanner(user.full_name || "");
//       welcomeTarget.innerHTML = "";
//       welcomeTarget.appendChild(banner);
//     }

//     const modalContainer = document.getElementById("role-profile-modal-container");
//     const needProfile = await this.checkRoleProfile(user.role, modalContainer);
//     if (needProfile) return;

//     await this.renderDashboardByRole(user.role);
//   },

//   async checkRoleProfile(role, container) {
//     if (role === "admin") return false;

//     await RoleProfilePresenter.checkAndRenderModal(role);
//     return !!document.getElementById("role-profile-modal");
//   },

//   async renderDashboardByRole(role) {
//     const studentSection = document.getElementById("student-section");
//     const otherSection = document.getElementById("other-role-section");

//     if (role === "student") {
//       showElementLoading("course-container", "Memuat daftar kursus...");

//       const courses = await DashboardStudentPresenter.getCourses();
//       hideElementLoading("course-container");

//       await renderCourseList("course-container", courses);

//       const refreshBtn = document.getElementById("refresh-courses");
//       if (refreshBtn) {
//         refreshBtn.addEventListener("click", async () => {
//           showElementLoading(
//             "course-container",
//             "Menyegarkan daftar kursus..."
//           );
//           const refreshedCourses = await DashboardStudentPresenter.getCourses();
//           hideElementLoading("course-container");
//           await renderCourseList("course-container", refreshedCourses);
//         });
//       }

//       studentSection?.classList.remove("hidden");
//       otherSection?.classList.add("hidden");

//     } else if (role === "teacher") {
//       studentSection?.classList.add("hidden");
//       otherSection?.classList.remove("hidden");

//       otherSection.innerHTML = `
//         <div>
//           <h2 class="text-xl font-semibold mb-4">Manajemen Kursus</h2>
          
//           <!-- Tab Navigation -->
//           <div class="border-b border-gray-200 mb-6">
//             <nav class="-mb-px flex space-x-8">
//               <button 
//                 id="tab-unverified" 
//                 class="tab-button py-2 px-1 border-b-2 font-medium text-sm border-blue-500 text-blue-600" 
//                 data-target="unverified"
//               >
//                 Belum Diverifikasi
//               </button>
//               <button 
//                 id="tab-verified" 
//                 class="tab-button py-2 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300" 
//                 data-target="verified"
//               >
//                 Terverifikasi
//               </button>
//             </nav>
//           </div>

//           <!-- Tab Content -->
//           <div id="teacher-course-container-unverified" class="tab-content"></div>
//           <div id="teacher-course-container-verified" class="tab-content hidden"></div>
//         </div>
//       `;

//       // Load initial unverified courses
//       await DashboardTeacherPresenter.renderUnverifiedCourses("teacher-course-container-unverified");

//       // Setup tab functionality
//       this.setupTabs();

//     } else if (role === "admin") {
//       studentSection?.classList.add("hidden");
//       otherSection?.classList.remove("hidden");

//       otherSection.innerHTML = `<div id="admin-dashboard-container"></div>`;
//       const { default: AdminPresenter } = await import("../admin/dashboard/dashboard-admin-presenter.js");
//       await AdminPresenter.init();
//     } else {
//       studentSection?.classList.add("hidden");
//       otherSection?.classList.remove("hidden");

//       otherSection.innerHTML = `<h2 class="text-xl font-semibold">Dashboard untuk Role Lain Akan Segera Hadir</h2>`;
//     }
//   },

//   setupTabs() {
//     const tabButtons = document.querySelectorAll('.tab-button');
//     const tabContents = document.querySelectorAll('.tab-content');

//     tabButtons.forEach(button => {
//       button.addEventListener('click', async (e) => {
//         const target = e.target.dataset.target;
        
//         // Update button styles
//         tabButtons.forEach(btn => {
//           btn.classList.remove('border-blue-500', 'text-blue-600');
//           btn.classList.add('border-transparent', 'text-gray-500');
//         });
        
//         e.target.classList.remove('border-transparent', 'text-gray-500');
//         e.target.classList.add('border-blue-500', 'text-blue-600');

//         // Show/hide content
//         tabContents.forEach(content => {
//           content.classList.add('hidden');
//         });

//         const targetContent = document.getElementById(`teacher-course-container-${target}`);
//         targetContent.classList.remove('hidden');

//         // Load verified courses when tab is clicked for the first time
//         if (target === 'verified' && !targetContent.innerHTML.trim()) {
//           await DashboardTeacherPresenter.renderVerifiedCourses("teacher-course-container-verified");
//         }
//       });
//     });
//   },
// };

// export default DashboardPresenter;
import { renderCourseList } from "../../component/courseList.js";
import {
    hideElementLoading,
    showElementLoading,
} from "../../component/loading-screen.js";
import WelcomeBanner from "../../component/welcome-banner.js";
import Api from "../../data/api.js";
import DashboardStudentPresenter from "../student/dashboard/dashboard-student-presenter.js";
import DashboardTeacherPresenter from "../teacher/dashboard/dashboard-teacher-presenter.js";
import RoleProfilePresenter from "./role-profile/role-profile-presenter.js";

const DashboardPresenter = {
  async init() {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.hash = "#/login";
      return;
    }

    // === CEK APAKAH SEDANG GENERATING COURSE ===
    const courseGenerating = localStorage.getItem("course_generating") === "true";
    const generatingId = localStorage.getItem("generating_course_id");
    const generatingTitle = localStorage.getItem("generating_course_title");
    const generatingLevel = localStorage.getItem("generating_course_level");

    if (courseGenerating && generatingId) {
      const genSection = document.getElementById("course-generating-section");
      const genTitleSpan = document.getElementById("generating-title");
      const genLevelSpan = document.getElementById("generating-level");

      if (genSection && genTitleSpan && genLevelSpan) {
        genTitleSpan.textContent = generatingTitle || "(tidak diketahui)";
        genLevelSpan.textContent = generatingLevel || "";
        genSection.style.display = "block";
      }

      const checkStatus = async () => {
        try {
          const status = await CreateCourseModel.checkGenerationStatus(generatingId);
          if (status.complete) {
            clearInterval(intervalId);
            // Bersihkan localStorage dan reload dashboard
            localStorage.removeItem("course_generating");
            localStorage.removeItem("generating_course_id");
            localStorage.removeItem("generating_course_title");
            localStorage.removeItem("generating_course_level");
            window.location.reload();
          }
        } catch (err) {
          console.warn("Gagal cek status generate:", err);
        }
      };

      // Polling setiap 7 detik
      const intervalId = setInterval(checkStatus, 7000);
      await checkStatus(); // cek pertama kali langsung

      // Tambahkan pesan bantuan jika lebih dari 2 menit belum selesai
      setTimeout(() => {
        const helpBox = document.getElementById("generation-help");
        if (helpBox) {
          helpBox.innerHTML = `
          🚨 Pembuatan course membutuhkan waktu lebih lama dari biasanya.<br>
          <a href="#/create" class="underline text-blue-600">Klik di sini untuk buat ulang</a>
          atau hubungi admin jika masalah berlanjut.
        `;
        }
      }, 120000); // 2 menit

      return; // hentikan render dashboard sampai selesai generate
    }

    // === CEK PROFIL USER ===
    let user;
    try {
      user = await Api.getProfile();
    } catch (err) {
      // console.error("Gagal ambil profil:", err);
      window.location.hash = "#/login";
      return;
    }

    const welcomeTarget = document.getElementById("welcome-container");
    if (welcomeTarget) {
      showElementLoading("welcome-container", "Memuat sambutan...");
      const banner = WelcomeBanner(user.full_name || "");
      welcomeTarget.innerHTML = "";
      welcomeTarget.appendChild(banner);
    }

    const modalContainer = document.getElementById("role-profile-modal-container");
    const needProfile = await this.checkRoleProfile(user.role, modalContainer);
    if (needProfile) return;

    await this.renderDashboardByRole(user.role);
  },

  async checkRoleProfile(role, container) {
    // 🔥 SKIP ROLE PROFILE CHECK UNTUK ADMIN DAN TEACHER
    // Teacher profile sudah auto-created saat approval di backend
    if (role === "admin" || role === "teacher") {
      console.log(`✅ Skipping role profile check for ${role} - profile auto-created`);
      return false;
    }

    // 🔥 HANYA CEK ROLE PROFILE UNTUK STUDENT
    if (role === "student") {
      await RoleProfilePresenter.checkAndRenderModal(role);
      return !!document.getElementById("role-profile-modal");
    }

    return false;
  },

  async renderDashboardByRole(role) {
    const studentSection = document.getElementById("student-section");
    const otherSection = document.getElementById("other-role-section");

    if (role === "student") {
      showElementLoading("course-container", "Memuat daftar kursus...");

      const courses = await DashboardStudentPresenter.getCourses();
      hideElementLoading("course-container");

      await renderCourseList("course-container", courses);

      const refreshBtn = document.getElementById("refresh-courses");
      if (refreshBtn) {
        refreshBtn.addEventListener("click", async () => {
          showElementLoading(
            "course-container",
            "Menyegarkan daftar kursus..."
          );
          const refreshedCourses = await DashboardStudentPresenter.getCourses();
          hideElementLoading("course-container");
          await renderCourseList("course-container", refreshedCourses);
        });
      }

      studentSection?.classList.remove("hidden");
      otherSection?.classList.add("hidden");

    } else if (role === "teacher") {
      studentSection?.classList.add("hidden");
      otherSection?.classList.remove("hidden");

      otherSection.innerHTML = `
        <div>
          <h2 class="text-xl font-semibold mb-4">Manajemen Kursus</h2>
          
          <!-- Tab Navigation -->
          <div class="border-b border-gray-200 mb-6">
            <nav class="-mb-px flex space-x-8">
              <button 
                id="tab-unverified" 
                class="tab-button py-2 px-1 border-b-2 font-medium text-sm border-blue-500 text-blue-600" 
                data-target="unverified"
              >
                Belum Diverifikasi
              </button>
              <button 
                id="tab-verified" 
                class="tab-button py-2 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300" 
                data-target="verified"
              >
                Terverifikasi
              </button>
            </nav>
          </div>

          <!-- Tab Content -->
          <div id="teacher-course-container-unverified" class="tab-content"></div>
          <div id="teacher-course-container-verified" class="tab-content hidden"></div>
        </div>
      `;

      // Load initial unverified courses
      await DashboardTeacherPresenter.renderUnverifiedCourses("teacher-course-container-unverified");

      // Setup tab functionality
      this.setupTabs();

    } else if (role === "admin") {
      studentSection?.classList.add("hidden");
      otherSection?.classList.remove("hidden");

      otherSection.innerHTML = `<div id="admin-dashboard-container"></div>`;
      const { default: AdminPresenter } = await import("../admin/dashboard/dashboard-admin-presenter.js");
      await AdminPresenter.init();
    } else {
      studentSection?.classList.add("hidden");
      otherSection?.classList.remove("hidden");

      otherSection.innerHTML = `<h2 class="text-xl font-semibold">Dashboard untuk Role Lain Akan Segera Hadir</h2>`;
    }
  },

  setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        const target = e.target.dataset.target;
        
        // Update button styles
        tabButtons.forEach(btn => {
          btn.classList.remove('border-blue-500', 'text-blue-600');
          btn.classList.add('border-transparent', 'text-gray-500');
        });
        
        e.target.classList.remove('border-transparent', 'text-gray-500');
        e.target.classList.add('border-blue-500', 'text-blue-600');

        // Show/hide content
        tabContents.forEach(content => {
          content.classList.add('hidden');
        });

        const targetContent = document.getElementById(`teacher-course-container-${target}`);
        targetContent.classList.remove('hidden');

        // Load verified courses when tab is clicked for the first time
        if (target === 'verified' && !targetContent.innerHTML.trim()) {
          await DashboardTeacherPresenter.renderVerifiedCourses("teacher-course-container-verified");
        }
      });
    });
  },
};

export default DashboardPresenter;