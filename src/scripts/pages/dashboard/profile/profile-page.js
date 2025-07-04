import createSidebar from "../../../component/sidebar.js";
import Api from "../../../data/api.js";
import ProfilePresenter from "./profile-presenter.js";

const ProfilePage = {
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
      <main class="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50">
        <section class="max-w-3xl mx-auto">
          <h1 class="text-2xl font-bold mb-1">Profile</h1>
          <p class="text-gray-600 mb-6">You can edit your profile details</p>

          <div id="profile-section" class="space-y-6">
            <div class="relative border rounded shadow bg-white p-4" id="basic-profile-wrapper">
              <button id="edit-account-btn" class="absolute top-4 right-4 bg-[#2C2F8C] text-white px-4 py-1 rounded text-sm hover:bg-[#1e1f6c]">
                Edit Akun
              </button>
              <div id="basic-profile">
                <div class="text-gray-500 animate-pulse">Memuat profil akun...</div>
              </div>
            </div>

            <div class="relative border rounded shadow bg-white p-4" id="role-profile-wrapper">
              <button id="edit-role-btn" class="absolute top-4 right-4 bg-[#2C2F8C] text-white px-4 py-1 rounded text-sm hover:bg-[#1e1f6c]">
                Edit Profile
              </button>
              <div id="role-profile">
                <div class="text-gray-500 animate-pulse">Memuat data tambahan...</div>
              </div>
            </div>
          </div>


            <!-- Overlay Edit Account -->
            <div id="edit-account-overlay" class="fixed inset-0 bg-black bg-opacity-40 z-50 hidden items-center justify-center">
              <div class="bg-white p-6 rounded-lg w-full max-w-xl">
                <h2 class="text-center text-lg font-semibold mb-4">Profile Akun</h2>
                <form id="form-edit-account" class="space-y-4">
                  <div>
                    <label class="font-semibold block mb-1">Nama</label>
                    <input type="text" name="full_name" class="w-full border rounded p-2" required />
                  </div>
                  <div>
                    <label class="font-semibold block mb-1">Email</label>
                    <input type="email" name="email" class="w-full border rounded p-2" required />
                  </div>
                  <div>
                    <label class="font-semibold block mb-1">Old Password</label>
                    <input type="password" name="old_password" class="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label class="font-semibold block mb-1">New Password</label>
                    <input type="password" name="new_password" class="w-full border rounded p-2" />
                  </div>
                  <div class="flex justify-end gap-2 mt-4">
                    <button type="button" id="cancel-edit-account" class="border px-4 py-2 rounded">Cancel</button>
                    <button type="submit" class="bg-[#2C2F8C] text-white px-4 py-2 rounded">Save</button>
                  </div>
                </form>
              </div>
            </div>

            <!-- Overlay Edit Role Profile -->
            <div id="edit-role-overlay" class="fixed inset-0 bg-black bg-opacity-40 z-50 hidden items-center justify-center">
              <div class="bg-white p-6 rounded-lg w-full max-w-xl">
                <h2 class="text-center text-lg font-semibold mb-4">Profile Mahasiswa</h2>
                <form id="form-edit-role" class="space-y-4">
                  <div>
                    <label class="font-semibold block mb-1">Full Name</label>
                    <input type="text" name="full_name" class="w-full border rounded p-2" required />
                  </div>
                  <div>
                    <label class="font-semibold block mb-1">Jurusan</label>
                    <input type="text" name="jurusan" class="w-full border rounded p-2" required />
                  </div>
                  <div>
                    <label class="font-semibold block mb-1">Program Studi</label>
                    <input type="text" name="program_studi" class="w-full border rounded p-2" required />
                  </div>
                  <div>
                    <label class="font-semibold block mb-1">Perguruan Tinggi</label>
                    <input type="text" name="perguruan_tinggi" class="w-full border rounded p-2" required />
                  </div>
                  <div class="flex justify-end gap-2 mt-4">
                    <button type="button" id="cancel-edit-role" class="border px-4 py-2 rounded">Cancel</button>
                    <button type="submit" class="bg-[#2C2F8C] text-white px-4 py-2 rounded">Save</button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </main>
      </div>
    `;
  },

  async afterRender() {
    const profile = await Api.getProfile();
    const totalCourse =
      profile.role === "student" ? (await Api.getStudentCourses()).length : 0;

    // Sidebar (konsisten dengan dashboard)
    const sidebarWrapper = document.getElementById("sidebar-wrapper");
    sidebarWrapper.innerHTML = "";
    const sidebar = await createSidebar(totalCourse);
    sidebarWrapper.appendChild(sidebar);

    // Navbar (modular dinamis import)
    const navbarModule = (await import("../../../component/navbar.js")).default;
    const navbarContainer = document.getElementById("navbar-container");
    navbarContainer.innerHTML = navbarModule().render();
    navbarModule().afterRender();

    // Inisialisasi profil
    ProfilePresenter.init();

    // Event: Open Edit
    document
      .getElementById("edit-account-btn")
      ?.addEventListener("click", () => {
        const overlay = document.getElementById("edit-account-overlay");
        overlay.classList.remove("hidden");
        overlay.classList.add("flex");
      });

    document.getElementById("edit-role-btn")?.addEventListener("click", () => {
      const overlay = document.getElementById("edit-role-overlay");
      overlay.classList.remove("hidden");
      overlay.classList.add("flex");
    });

    // Event: Cancel
    document
      .getElementById("cancel-edit-account")
      ?.addEventListener("click", () => {
        const overlay = document.getElementById("edit-account-overlay");
        overlay.classList.add("hidden");
        overlay.classList.remove("flex");
      });

    document
      .getElementById("cancel-edit-role")
      ?.addEventListener("click", () => {
        const overlay = document.getElementById("edit-role-overlay");
        overlay.classList.add("hidden");
        overlay.classList.remove("flex");
      });
  },
};

export default ProfilePage;
