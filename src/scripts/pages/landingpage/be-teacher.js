// File: src/scripts/pages/landingpage/be-teacher.js
import "../../../styles/style.css";
import Api from "../../data/api.js";
import { showToastNotification } from "../../utils/index.js";

const BeTeacherPage = {
    async render() {
        return `
      <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <!-- Navbar Container -->
        <nav id="navbar-container" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50"></nav>
        
        <!-- Main Content -->
        <div class="pt-20 px-4 sm:px-6 lg:px-8">
          <div class="max-w-4xl mx-auto py-12">
            
            <!-- Header Section -->
            <div class="text-center mb-12 animate-fade-in-up">
              <div class="inline-block p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
                <svg class="w-12 h-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <h1 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
                Bergabung sebagai 
                <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Dosen</span>
              </h1>
              <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Wujudkan potensi mengajar Anda bersama EduraApp. Bergabunglah dengan platform pembelajaran AI terdepan dan inspirasi ribuan mahasiswa.
              </p>
            </div>

            <!-- Loading State -->
            <div id="loading-enums" class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 dark:border-gray-700 hidden">
              <div class="text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p class="text-gray-600 dark:text-gray-300">Memuat data formulir...</p>
              </div>
            </div>

            <!-- Form Section -->
            <div id="form-container" class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 dark:border-gray-700 hidden">
              <form id="teacher-request-form" class="space-y-6">
                
                <!-- Email Field -->
                <div class="animate-slide-in-left" style="animation-delay: 0.1s">
                  <label for="email" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email <span class="text-red-500">*</span>
                  </label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required
                    placeholder="Masukkan email Anda"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                  >
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Email akan digunakan untuk notifikasi status pengajuan
                  </p>
                </div>

                <!-- Full Name Field -->
                <div class="animate-slide-in-left" style="animation-delay: 0.2s">
                  <label for="full_name" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Nama Lengkap <span class="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    id="full_name" 
                    name="full_name" 
                    required
                    minlength="2"
                    maxlength="100"
                    placeholder="Masukkan nama lengkap Anda"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                  >
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Nama lengkap sesuai identitas resmi
                  </p>
                </div>

                <!-- NIDN Field -->
                <div class="animate-slide-in-left" style="animation-delay: 0.3s">
                  <label for="nidn" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    NIDN (Nomor Induk Dosen Nasional) <span class="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    id="nidn" 
                    name="nidn" 
                    required
                    pattern="[0-9]{10,18}"
                    title="NIDN harus berupa angka 10-18 digit"
                    placeholder="Masukkan NIDN Anda (10-18 digit)"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                  >
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    NIDN adalah nomor identitas resmi dosen di Indonesia
                  </p>
                </div>

                <!-- Program Studi Field -->
                <div class="animate-slide-in-left" style="animation-delay: 0.4s">
                  <label for="program_studi" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Program Studi <span class="text-red-500">*</span>
                  </label>
                  <select 
                    id="program_studi" 
                    name="program_studi" 
                    required
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                  >
                    <option value="">Pilih Program Studi</option>
                    <!-- Options will be populated dynamically -->
                  </select>
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Pilih program studi tempat Anda mengajar
                  </p>
                </div>

                <!-- Perguruan Tinggi Field -->
                <div class="animate-slide-in-left" style="animation-delay: 0.5s">
                  <label for="perguruan_tinggi" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Perguruan Tinggi <span class="text-red-500">*</span>
                  </label>
                  <select 
                    id="perguruan_tinggi" 
                    name="perguruan_tinggi" 
                    required
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                  >
                    <option value="">Pilih Perguruan Tinggi</option>
                    <!-- Options will be populated dynamically -->
                  </select>
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Pilih perguruan tinggi tempat Anda mengajar
                  </p>
                </div>

                <!-- 🔥 UPDATED: Fakultas Field - SEKARANG WAJIB -->
                <div class="animate-slide-in-left" style="animation-delay: 0.55s">
                  <label for="fakultas" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Fakultas/Jurusan <span class="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    id="fakultas" 
                    name="fakultas"
                    required
                    minlength="1"
                    maxlength="100"
                    placeholder="Contoh: Fakultas Teknologi Informasi, Fakultas Ekonomi, dll."
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                  >
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Nama fakultas atau jurusan tempat Anda mengajar (wajib diisi)
                  </p>
                </div>

                <!-- Credential File Field -->
                <div class="animate-slide-in-left" style="animation-delay: 0.6s">
                  <label for="credential_file" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    URL Dokumen Kredensial <span class="text-gray-400">(Opsional)</span>
                  </label>
                  <input 
                    type="url" 
                    id="credential_file" 
                    name="credential_file"
                    placeholder="https://drive.google.com/file/... (link dokumen kredensial)"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                  >
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Link ke dokumen pendukung seperti sertifikat, ijazah, atau surat keterangan mengajar
                  </p>
                </div>

                <!-- Info Box -->
                <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 animate-slide-in-left" style="animation-delay: 0.7s">
                  <div class="flex items-start space-x-3">
                    <svg class="w-6 h-6 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                      <h3 class="font-semibold text-blue-800 dark:text-blue-300 mb-2">Informasi Penting</h3>
                      <ul class="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                        <li>• Pengajuan akan diproses dalam 1-3 hari kerja</li>
                        <li>• Status pengajuan akan dikirim via email</li>
                        <li>• Email, NIDN, Program Studi, Perguruan Tinggi, dan Fakultas wajib diisi</li>
                        <li>• NIDN tidak boleh memiliki pengajuan yang sedang diproses</li>
                        <li>• Jika email sudah terdaftar, pengajuan akan ditambahkan ke akun tersebut</li>
                        <li>• Dokumen kredensial membantu mempercepat proses verifikasi</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <!-- Submit Button -->
                <div class="pt-6 animate-slide-in-left" style="animation-delay: 0.8s">
                  <button 
                    type="submit" 
                    id="submit-btn"
                    class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <span class="submit-text">Kirim Pengajuan</span>
                    <span class="loading-text hidden">
                      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Mengirim...
                    </span>
                  </button>
                </div>

                <!-- Back to Home -->
                <div class="text-center pt-4 animate-slide-in-left" style="animation-delay: 0.9s">
                  <a href="#/" class="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    ← Kembali ke Beranda
                  </a>
                </div>

              </form>
            </div>

            <!-- Error State -->
            <div id="error-state" class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 dark:border-gray-700 hidden">
              <div class="text-center">
                <div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Gagal Memuat Form</h3>
                <p class="text-gray-600 dark:text-gray-300 mb-6">
                  Terjadi kesalahan saat memuat data formulir. Silakan refresh halaman atau coba lagi nanti.
                </p>
                <button 
                  id="retry-btn"
                  class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
                  Coba Lagi
                </button>
              </div>
            </div>

            <!-- Success Modal -->
            <div id="success-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
              <div class="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md mx-4 animate-fade-in-up">
                <div class="text-center">
                  <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Pengajuan Berhasil Dikirim!</h3>
                  <p class="text-gray-600 dark:text-gray-300 mb-6">
                    Terima kasih atas pengajuan Anda. Tim kami akan meninjau dan menghubungi Anda dalam 1-3 hari kerja.
                  </p>
                  <button 
                    id="close-modal-btn"
                    class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out forwards;
          opacity: 0;
        }
        
        html {
          scroll-behavior: smooth;
        }
      </style>
    `;
    },

    async afterRender() {
        // Show loading state initially
        const loadingEnums = document.getElementById("loading-enums");
        const formContainer = document.getElementById("form-container");
        const errorState = document.getElementById("error-state");
        
        loadingEnums.classList.remove("hidden");

        try {
            // Load enums data first
            console.log('🔄 Loading enums data...');
            const enumsData = await Api.getEnums();
            console.log('✅ Enums loaded:', enumsData);

            // Populate dropdowns
            this.populateDropdowns(enumsData);

            // Hide loading, show form
            loadingEnums.classList.add("hidden");
            formContainer.classList.remove("hidden");

            // Initialize form functionality
            this.initializeForm();

        } catch (error) {
            console.error('❌ Failed to load enums:', error);
            
            // Show error state
            loadingEnums.classList.add("hidden");
            errorState.classList.remove("hidden");

            // Retry button
            const retryBtn = document.getElementById("retry-btn");
            retryBtn.addEventListener("click", () => {
                window.location.reload();
            });

            showToastNotification('Gagal memuat data formulir. Silakan refresh halaman.', "error");
        }

        // Render navbar
        try {
            const navbarModule = (await import("../../component/navbar.js")).default;
            const navbarContainer = document.getElementById("navbar-container");
            if (navbarContainer && navbarModule) {
                navbarContainer.innerHTML = navbarModule().render();
                if (navbarModule().afterRender) {
                    navbarModule().afterRender();
                }
            }
        } catch (error) {
            console.log("Navbar not found, continuing without navbar");
        }

        this.initializeNavbarEffects();
    },

    populateDropdowns(enumsData) {
        // Populate Program Studi dropdown
        const programStudiSelect = document.getElementById("program_studi");
        if (programStudiSelect && enumsData.program_studi) {
            programStudiSelect.innerHTML = '<option value="">Pilih Program Studi</option>';
            enumsData.program_studi.forEach(item => {
                const option = document.createElement('option');
                option.value = item;
                option.textContent = item;
                programStudiSelect.appendChild(option);
            });
        }

        // Populate Perguruan Tinggi dropdown
        const perguruanTinggiSelect = document.getElementById("perguruan_tinggi");
        if (perguruanTinggiSelect && enumsData.perguruan_tinggi) {
            perguruanTinggiSelect.innerHTML = '<option value="">Pilih Perguruan Tinggi</option>';
            enumsData.perguruan_tinggi.forEach(item => {
                const option = document.createElement('option');
                option.value = item;
                option.textContent = item;
                perguruanTinggiSelect.appendChild(option);
            });
        }
    },

    initializeForm() {
        const form = document.getElementById("teacher-request-form");
        const submitBtn = document.getElementById("submit-btn");
        const submitText = submitBtn.querySelector(".submit-text");
        const loadingText = submitBtn.querySelector(".loading-text");
        const successModal = document.getElementById("success-modal");
        const closeModalBtn = document.getElementById("close-modal-btn");

        // Format NIDN input (numbers only)
        const formatNumberInput = (input) => {
            input.addEventListener("input", (e) => {
                e.target.value = e.target.value.replace(/\D/g, "");
            });
        };

        formatNumberInput(document.getElementById("nidn"));

        // Form validation
        const validateForm = () => {
            const email = document.getElementById("email").value.trim();
            const fullName = document.getElementById("full_name").value.trim();
            const nidn = document.getElementById("nidn").value.trim();
            const programStudi = document.getElementById("program_studi").value.trim();
            const perguruanTinggi = document.getElementById("perguruan_tinggi").value.trim();
            const fakultas = document.getElementById("fakultas").value.trim(); // 🔥 NEW

            // Email validation
            if (!email) {
                return { valid: false, message: "Email wajib diisi" };
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return { valid: false, message: "Format email tidak valid" };
            }

            // Full name validation
            if (!fullName) {
                return { valid: false, message: "Nama lengkap wajib diisi" };
            }

            if (fullName.length < 2) {
                return { valid: false, message: "Nama lengkap minimal 2 karakter" };
            }

            // NIDN validation
            if (!nidn) {
                return { valid: false, message: "NIDN wajib diisi" };
            }

            if (!/^\d{10,18}$/.test(nidn)) {
                return { valid: false, message: "NIDN harus berupa angka 10-18 digit" };
            }

            // Program Studi validation
            if (!programStudi) {
                return { valid: false, message: "Program Studi wajib dipilih" };
            }

            // Perguruan Tinggi validation
            if (!perguruanTinggi) {
                return { valid: false, message: "Perguruan Tinggi wajib dipilih" };
            }

            // 🔥 Fakultas validation - SEKARANG WAJIB
            if (!fakultas) {
                return { valid: false, message: "Fakultas/Jurusan wajib diisi" };
            }

            if (fakultas.length < 1) {
                return { valid: false, message: "Fakultas/Jurusan minimal 1 karakter" };
            }

            return { valid: true };
        };

        // Real-time validation feedback
        const emailInput = document.getElementById("email");
        const fullNameInput = document.getElementById("full_name");
        const nidnInput = document.getElementById("nidn");
        const programStudiInput = document.getElementById("program_studi");
        const perguruanTinggiInput = document.getElementById("perguruan_tinggi");
        const fakultasInput = document.getElementById("fakultas"); // 🔥 NEW

        const showFieldError = (input, message) => {
            input.classList.add("border-red-500", "focus:ring-red-500", "bg-red-50", "dark:bg-red-900/20");
            input.classList.remove("border-gray-300", "focus:ring-blue-500");

            // Remove existing error message
            const existingError = input.parentNode.querySelector(".error-message");
            if (existingError) {
                existingError.remove();
            }

            // Add error message with better styling
            const errorDiv = document.createElement("p");
            errorDiv.className = "error-message mt-2 text-sm text-red-600 dark:text-red-400 font-medium flex items-center";
            errorDiv.innerHTML = `
                <svg class="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                ${message}
            `;
            input.parentNode.appendChild(errorDiv);

            // Scroll to error field
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        };

        const clearFieldError = (input) => {
            input.classList.remove("border-red-500", "focus:ring-red-500", "bg-red-50", "dark:bg-red-900/20");
            input.classList.add("border-gray-300", "focus:ring-blue-500");

            const existingError = input.parentNode.querySelector(".error-message");
            if (existingError) {
                existingError.remove();
            }
        };

        // Function to show server field error
        const showServerFieldError = (field, message) => {
            let input;
            switch (field) {
                case 'email':
                    input = emailInput;
                    break;
                case 'nidn':
                    input = nidnInput;
                    break;
                case 'full_name':
                    input = fullNameInput;
                    break;
                case 'program_studi':
                    input = programStudiInput;
                    break;
                case 'perguruan_tinggi':
                    input = perguruanTinggiInput;
                    break;
                case 'fakultas': // 🔥 NEW
                    input = fakultasInput;
                    break;
                default:
                    showToastNotification(message, "error");
                    return;
            }
            showFieldError(input, message);
        };

        // Validation event listeners
        emailInput.addEventListener("blur", () => {
            const value = emailInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
                showFieldError(emailInput, "Format email tidak valid");
            } else {
                clearFieldError(emailInput);
            }
        });

        fullNameInput.addEventListener("blur", () => {
            const value = fullNameInput.value.trim();
            if (value && value.length < 2) {
                showFieldError(fullNameInput, "Nama lengkap minimal 2 karakter");
            } else {
                clearFieldError(fullNameInput);
            }
        });

        nidnInput.addEventListener("blur", () => {
            const value = nidnInput.value.trim();
            if (value && !/^\d{10,18}$/.test(value)) {
                showFieldError(nidnInput, "NIDN harus berupa angka 10-18 digit");
            } else {
                clearFieldError(nidnInput);
            }
        });

        // 🔥 NEW: Fakultas validation
        fakultasInput.addEventListener("blur", () => {
            const value = fakultasInput.value.trim();
            if (!value) {
                showFieldError(fakultasInput, "Fakultas/Jurusan wajib diisi");
            } else if (value.length < 1) {
                showFieldError(fakultasInput, "Fakultas/Jurusan minimal 1 karakter");
            } else {
                clearFieldError(fakultasInput);
            }
        });

        // Clear field errors on input
        [emailInput, fullNameInput, nidnInput, programStudiInput, perguruanTinggiInput, fakultasInput].forEach(input => {
            input.addEventListener("input", () => {
                if (input.classList.contains("border-red-500")) {
                    clearFieldError(input);
                }
            });

            input.addEventListener("change", () => {
                if (input.classList.contains("border-red-500")) {
                    clearFieldError(input);
                }
            });
        });

        // Form submission
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            // Clear previous errors
            [emailInput, fullNameInput, nidnInput, programStudiInput, perguruanTinggiInput, fakultasInput].forEach(clearFieldError);

            // Validate form
            const validation = validateForm();
            if (!validation.valid) {
                showToastNotification(validation.message, "error");
                return;
            }

            // Disable form and show loading
            submitBtn.disabled = true;
            submitText.classList.add("hidden");
            loadingText.classList.remove("hidden");

            try {
                const formData = new FormData(form);
                const data = {
                    email: formData.get("email").trim(),
                    full_name: formData.get("full_name").trim(),
                    nidn: formData.get("nidn").trim(),
                    program_studi: formData.get("program_studi").trim(),
                    perguruan_tinggi: formData.get("perguruan_tinggi").trim(),
                    fakultas: formData.get("fakultas").trim(), // 🔥 FAKULTAS SEKARANG WAJIB
                    credential_file: formData.get("credential_file")?.trim() || "",
                };

                console.log("Sending teacher request:", data);

                const response = await Api.submitTeacherRequest(data);
                console.log("Teacher request response:", response);

                // Show success modal
                successModal.classList.remove("hidden");

                // Reset form
                form.reset();

            } catch (error) {
                console.error("Error submitting teacher request:", error);

                // Handle error response from server
                let errorData = null;
                let statusCode = null;

                if (error.response && error.response.data) {
                    errorData = error.response.data;
                    statusCode = error.response.status;
                } else if (error.data) {
                    errorData = error.data;
                    statusCode = error.status;
                } else if (error.message && error.message.includes('(')) {
                    const statusMatch = error.message.match(/\((\d+)\)/);
                    if (statusMatch) {
                        statusCode = parseInt(statusMatch[1]);
                        if (window.lastApiError && window.lastApiError.status === statusCode) {
                            errorData = window.lastApiError.data;
                        }
                    }
                }

                // Special handling for NIDN conflict
                if (statusCode === 409 && !errorData) {
                    showServerFieldError('nidn', 'NIDN sudah terdaftar dalam pengajuan yang sedang diproses.');
                    setTimeout(() => {
                        showToastNotification('NIDN ini sudah memiliki pengajuan dengan status pending. Silakan tunggu hingga pengajuan tersebut selesai diproses.', "error");
                    }, 200);
                    return;
                }

                // Handle field-specific errors
                if (errorData && (statusCode === 400 || statusCode === 409) && errorData.field) {
                    showServerFieldError(errorData.field, errorData.error);
                    if (errorData.details) {
                        setTimeout(() => {
                            showToastNotification(errorData.details, "error");
                        }, 100);
                    }
                } else if (errorData && errorData.error) {
                    showToastNotification(errorData.error, "error");
                } else if (statusCode) {
                    showToastNotification(`Error ${statusCode}: Gagal mengirim pengajuan`, "error");
                } else {
                    showToastNotification(`Gagal mengirim pengajuan: ${error.message}`, "error");
                }
            } finally {
                // Re-enable form
                submitBtn.disabled = false;
                submitText.classList.remove("hidden");
                loadingText.classList.add("hidden");
            }
        });

        // Modal close handlers
        closeModalBtn.addEventListener("click", () => {
            successModal.classList.add("hidden");
            window.location.hash = "#/";
        });

        successModal.addEventListener("click", (e) => {
            if (e.target === successModal) {
                successModal.classList.add("hidden");
                window.location.hash = "#/";
            }
        });
    },

    initializeNavbarEffects() {
        // Navbar scroll effect
        const navbar = document.getElementById("navbar-container");
        if (navbar) {
            let lastScrollTop = 0;

            const handleScroll = () => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                if (scrollTop > 100) {
                    navbar.classList.add("navbar-scrolled");
                } else {
                    navbar.classList.remove("navbar-scrolled");
                }

                if (scrollTop > lastScrollTop && scrollTop > 200) {
                    navbar.style.transform = "translateY(-100%)";
                } else {
                    navbar.style.transform = "translateY(0)";
                }

                lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
            };

            window.addEventListener("scroll", handleScroll, { passive: true });

            return () => {
                window.removeEventListener("scroll", handleScroll);
            };
        }
    },
};

export default BeTeacherPage;