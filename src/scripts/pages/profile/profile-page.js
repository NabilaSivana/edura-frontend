import ProfilePresenter from "./profile-presenter.js";
import createSidebar from "../../component/sidebar.js";

const ProfilePage = {
    async render() {
        return `
      <div class="flex w-screen h-screen">
        <div id="sidebar-container"></div>
        <main class="flex-1 p-10 bg-gray-50 overflow-y-auto">
          <section class="max-w-3xl mx-auto">
            <h1 class="text-2xl font-bold mb-4">Profil Saya</h1>
            <div id="profile-section" class="space-y-6">
              <div id="basic-profile" class="p-4 bg-white shadow rounded"></div>
              <div id="role-profile" class="p-4 bg-white shadow rounded"></div>
            </div>
          </section>
        </main>
      </div>
    `;
    },

    async afterRender() {
        const sidebarTarget = document.getElementById("sidebar-container");
        if (sidebarTarget) sidebarTarget.appendChild(createSidebar());

        ProfilePresenter.init();
    }
};

export default ProfilePage;
