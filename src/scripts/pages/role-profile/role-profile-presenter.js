import Api from "../../data/api.js";
import RoleProfileView from "./role-profile-view.js";

const RoleProfilePresenter = {
    async checkAndRenderModal(role) {
        if (role === "admin") return;

        const hasProfile = await this.isProfileComplete(role);
        if (hasProfile) return;

        RoleProfileView.init(role); // Langsung render form juga
        this.setupFormHandler(role);
    },

    async isProfileComplete(role) {
        try {
            if (role === "student") {
                await Api.getStudentProfile();
            } else if (role === "teacher") {
                await Api.getTeacherProfile();
            }
            return true;
        } catch {
            return false;
        }
    },

    setupFormHandler(role) {
        const form = document.getElementById("role-profile-form");

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const data = RoleProfileView.getFormData(role);
            if (!data) {
                RoleProfileView.showError();
                return;
            }

            try {
                if (role === "student") {
                    await Api.createStudentProfile(data);
                } else {
                    await Api.createTeacherProfile(data);
                }
                RoleProfileView.closeModal();
                window.location.reload(); // Refresh dashboard
            } catch (err) {
                RoleProfileView.showError();
                console.error("Gagal menyimpan profil:", err);
            }
        });
    },
};

export default RoleProfilePresenter;
