// === File: pages/admin/monitor-backend/page.js ===
import createSidebar from "../../../component/sidebar.js";
import MonitorBackendView from "./view.js";
import MonitorBackendPresenter from "./presenter.js";

const MonitorBackendPage = {
    async render() {
        return MonitorBackendView.render();
    },

    async afterRender() {
        try {
            // Setup sidebar
            const sidebarWrapper = document.getElementById("sidebar-wrapper");
            if (sidebarWrapper) {
                sidebarWrapper.innerHTML = "";
                const sidebar = await createSidebar();
                sidebarWrapper.appendChild(sidebar);
            }

            // Setup navbar
            const navbarModule = (await import("../../../component/navbar.js")).default;
            const navbarContainer = document.getElementById("navbar-container");
            if (navbarContainer && navbarModule) {
                navbarContainer.innerHTML = navbarModule().render();
                navbarModule().afterRender();
            }

            // Initialize presenter
            await MonitorBackendPresenter.init();
        } catch (error) {
            console.error('Error initializing monitor backend page:', error);
        }
    }
};

export default MonitorBackendPage;