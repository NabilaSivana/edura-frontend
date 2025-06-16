// role-profile/role-profile-presenter.js
import Api from "../../data/api.js";
import RoleProfileView from "./role-profile-view.js";

const RoleProfilePresenter = {
    async checkAndRenderModal(role) {
        try {
            if (role === "student") {
                await Api.getStudentProfile();
            } else if (role === "teacher") {
                await Api.getTeacherProfile();
            }
            // jika sukses, tidak perlu tampilkan modal
        } catch (error) {
            // jika 404 (tidak punya profil), tampilkan modal isi profil
            RoleProfileView.init();
            RoleProfileView.renderFormFields(role);
            this.setupFormHandler(role);
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
            } catch (err) {
                RoleProfileView.showError();
                console.error("Gagal menyimpan profil:", err);
            }
        });
    },
};

export default RoleProfilePresenter;
