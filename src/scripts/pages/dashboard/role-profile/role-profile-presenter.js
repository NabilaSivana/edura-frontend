// import Api from "../../../data/api.js";
// import RoleProfileView from "./role-profile-view.js";

// const RoleProfilePresenter = {
//     async checkAndRenderModal(role) {
//         if (role === "admin") return;

//         const hasProfile = await this.isProfileComplete(role);
//         if (hasProfile) return;

//         await RoleProfileView.init(role);
//         await this.waitForElement("#role-profile-form");
//         this.setupFormHandler(role);
//     },

//     async isProfileComplete(role) {
//         try {
//             if (role === "student") {
//                 await Api.getStudentProfile();
//             } else if (role === "teacher") {
//                 await Api.getTeacherProfile();
//             }
//             return true;
//         } catch {
//             return false;
//         }
//     },

//     setupFormHandler(role) {
//         const form = document.getElementById("role-profile-form");
//         if (!form) {
//             console.warn("Form tidak ditemukan saat setup handler");
//             return;
//         }

//         form.addEventListener("submit", async (e) => {
//             e.preventDefault();

//             // Clear previous errors
//             RoleProfileView.clearFieldErrors();

//             const data = RoleProfileView.getFormData(role);
//             if (!data) {
//                 RoleProfileView.showError("Mohon lengkapi semua field yang diperlukan.");
//                 this.highlightMissingFields(role);
//                 return;
//             }

//             // Show loading state
//             RoleProfileView.setLoading(true);

//             try {
//                 if (role === "student") {
//                     await Api.createStudentProfile(data);
//                 } else {
//                     await Api.createTeacherProfile(data);
//                 }

//                 RoleProfileView.closeModal();

//                 // Show success message before reload
//                 this.showSuccessMessage();

//                 setTimeout(() => {
//                     window.location.reload();
//                 }, 1500);

//             } catch (err) {
//                 RoleProfileView.clearFieldErrors();

//                 if (err?.message?.includes("NIM sudah digunakan")) {
//                     RoleProfileView.showFieldError("nim", "NIM sudah digunakan, silakan gunakan yang lain.");
//                     return;
//                 }

//                 if (err?.message?.includes("NIDN sudah digunakan")) {
//                     RoleProfileView.showFieldError("nidn", "NIDN sudah digunakan, silakan gunakan yang lain.");
//                     return;
//                 }

//                 // Handle validation errors
//                 if (err?.validation) {
//                     Object.keys(err.validation).forEach(field => {
//                         RoleProfileView.showFieldError(field, err.validation[field]);
//                     });
//                     return;
//                 }

//                 // Fallback error
//                 RoleProfileView.showError("Terjadi kesalahan saat menyimpan profil. Silakan coba lagi.");
//                 console.error("Gagal menyimpan profil:", err);
//             } finally {
//                 RoleProfileView.setLoading(false);
//             }
//         });
//     },

//     highlightMissingFields(role) {
//         const form = document.getElementById("role-profile-form");
//         if (!form) return;

//         const requiredFields = role === "student"
//             ? ['nim', 'full_name', 'jurusan']
//             : ['nidn', 'full_name', 'fakultas', 'program_studi', 'perguruan_tinggi'];

//         requiredFields.forEach(fieldName => {
//             const field = form[fieldName];
//             if (field && !field.value.trim()) {
//                 field.classList.add("border-red-500", "dark:border-red-400");
//                 field.classList.remove("border-gray-300", "dark:border-gray-600");
//             }
//         });

//         // For student without class code, check if program_studi and perguruan_tinggi are filled
//         if (role === "student") {
//             const classCode = form.class_code?.value.trim();
//             if (!classCode) {
//                 const programStudi = form.program_studi?.value;
//                 const perguruanTinggi = form.perguruan_tinggi?.value;

//                 if (!programStudi) {
//                     const field = form.program_studi;
//                     if (field) {
//                         field.classList.add("border-red-500", "dark:border-red-400");
//                         field.classList.remove("border-gray-300", "dark:border-gray-600");
//                     }
//                 }

//                 if (!perguruanTinggi) {
//                     const field = form.perguruan_tinggi;
//                     if (field) {
//                         field.classList.add("border-red-500", "dark:border-red-400");
//                         field.classList.remove("border-gray-300", "dark:border-gray-600");
//                     }
//                 }
//             }
//         }
//     },

//     showSuccessMessage() {
//         // Create temporary success notification
//         const notification = document.createElement('div');
//         notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[60] transition-all duration-300 transform translate-x-full';
//         notification.innerHTML = `
//             <div class="flex items-center">
//                 <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                     <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
//                 </svg>
//                 <span>Profil berhasil disimpan!</span>
//             </div>
//         `;

//         document.body.appendChild(notification);

//         // Animate in
//         setTimeout(() => {
//             notification.classList.remove('translate-x-full');
//         }, 100);

//         // Animate out and remove
//         setTimeout(() => {
//             notification.classList.add('translate-x-full');
//             setTimeout(() => {
//                 if (notification.parentNode) {
//                     notification.parentNode.removeChild(notification);
//                 }
//             }, 300);
//         }, 1200);
//     },

//     waitForElement(selector) {
//         return new Promise((resolve) => {
//             const interval = setInterval(() => {
//                 const el = document.querySelector(selector);
//                 if (el) {
//                     clearInterval(interval);
//                     resolve(el);
//                 }
//             }, 50);
//         });
//     },
// };

// export default RoleProfilePresenter;
import Api from "../../../data/api.js";
import RoleProfileView from "./role-profile-view.js";

const RoleProfilePresenter = {
    async checkAndRenderModal(role) {
        // 🔥 HANYA TANGANI STUDENT ROLE
        // Teacher profile sudah auto-created saat approval, tidak perlu modal
        if (role !== "student") {
            console.log(`✅ Skipping role profile modal for ${role} - not needed`);
            return;
        }

        const hasProfile = await this.isProfileComplete(role);
        if (hasProfile) {
            console.log(`✅ ${role} profile already complete`);
            return;
        }

        console.log(`📋 Showing role profile modal for ${role}`);
        await RoleProfileView.init(role);
        await this.waitForElement("#role-profile-form");
        this.setupFormHandler(role);
    },

    async isProfileComplete(role) {
        try {
            if (role === "student") {
                await Api.getStudentProfile();
                return true;
            } else if (role === "teacher") {
                // 🔥 UNTUK TEACHER, SELALU RETURN TRUE KARENA PROFILE AUTO-CREATED
                // Ini sebenarnya tidak akan dipanggil karena sudah di-skip di checkAndRenderModal
                console.log("✅ Teacher profile check skipped - auto-created during approval");
                return true;
            }
            return false;
        } catch (error) {
            console.log(`❌ ${role} profile not complete:`, error.message);
            return false;
        }
    },

    setupFormHandler(role) {
        const form = document.getElementById("role-profile-form");
        if (!form) {
            console.warn("Form tidak ditemukan saat setup handler");
            return;
        }

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            // Clear previous errors
            RoleProfileView.clearFieldErrors();

            const data = RoleProfileView.getFormData(role);
            if (!data) {
                RoleProfileView.showError("Mohon lengkapi semua field yang diperlukan.");
                this.highlightMissingFields(role);
                return;
            }

            // Show loading state
            RoleProfileView.setLoading(true);

            try {
                // 🔥 HANYA HANDLE STUDENT CREATION
                if (role === "student") {
                    await Api.createStudentProfile(data);
                } else {
                    // 🔥 INI TIDAK SEHARUSNYA TERJADI KARENA TEACHER SUDAH DI-SKIP
                    console.error("❌ Teacher profile creation should not happen here - auto-created during approval");
                    throw new Error("Teacher profile should be auto-created during approval process");
                }

                RoleProfileView.closeModal();

                // Show success message before reload
                this.showSuccessMessage();

                setTimeout(() => {
                    window.location.reload();
                }, 1500);

            } catch (err) {
                RoleProfileView.clearFieldErrors();

                if (err?.message?.includes("NIM sudah digunakan")) {
                    RoleProfileView.showFieldError("nim", "NIM sudah digunakan, silakan gunakan yang lain.");
                    return;
                }

                if (err?.message?.includes("NIDN sudah digunakan")) {
                    RoleProfileView.showFieldError("nidn", "NIDN sudah digunakan, silakan gunakan yang lain.");
                    return;
                }

                // Handle validation errors
                if (err?.validation) {
                    Object.keys(err.validation).forEach(field => {
                        RoleProfileView.showFieldError(field, err.validation[field]);
                    });
                    return;
                }

                // Fallback error
                RoleProfileView.showError("Terjadi kesalahan saat menyimpan profil. Silakan coba lagi.");
                console.error("Gagal menyimpan profil:", err);
            } finally {
                RoleProfileView.setLoading(false);
            }
        });
    },

    highlightMissingFields(role) {
        const form = document.getElementById("role-profile-form");
        if (!form) return;

        // 🔥 HANYA HANDLE STUDENT FIELDS
        if (role === "student") {
            const requiredFields = ['nim', 'full_name', 'jurusan'];

            requiredFields.forEach(fieldName => {
                const field = form[fieldName];
                if (field && !field.value.trim()) {
                    field.classList.add("border-red-500", "dark:border-red-400");
                    field.classList.remove("border-gray-300", "dark:border-gray-600");
                }
            });

            // For student without class code, check if program_studi and perguruan_tinggi are filled
            const classCode = form.class_code?.value.trim();
            if (!classCode) {
                const programStudi = form.program_studi?.value;
                const perguruanTinggi = form.perguruan_tinggi?.value;

                if (!programStudi) {
                    const field = form.program_studi;
                    if (field) {
                        field.classList.add("border-red-500", "dark:border-red-400");
                        field.classList.remove("border-gray-300", "dark:border-gray-600");
                    }
                }

                if (!perguruanTinggi) {
                    const field = form.perguruan_tinggi;
                    if (field) {
                        field.classList.add("border-red-500", "dark:border-red-400");
                        field.classList.remove("border-gray-300", "dark:border-gray-600");
                    }
                }
            }
        }
    },

    showSuccessMessage() {
        // Create temporary success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[60] transition-all duration-300 transform translate-x-full';
        notification.innerHTML = `
            <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span>Profil berhasil disimpan!</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);

        // Animate out and remove
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 1200);
    },

    waitForElement(selector) {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(interval);
                    resolve(el);
                }
            }, 50);
        });
    },
};

export default RoleProfilePresenter;