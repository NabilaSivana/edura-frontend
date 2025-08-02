// import RegisterPresenter from "./register-presenter.js";

// const RegisterPage = {
//   async render() {
//     return `
// <style>
//   /* === BAGIAN 1: GAYA DASAR dengan Dark Mode Support === */
//   .floating-input { 
//     position: relative; 
//     width: 100%;
//   }
//   .floating-input input {
//     width: 100%; 
//     padding: 1rem 0.75rem 0.5rem; 
//     border: 1.5px solid #e5e7eb;
//     border-radius: 0.75rem; 
//     background: white; 
//     color: #1f2937;
//     font-size: 1rem; 
//     outline: none; 
//     transition: all 0.2s ease;
//     box-sizing: border-box;
//   }

//   /* Dark mode styles untuk input */
//   .dark .floating-input input {
//     background: #374151;
//     color: #f9fafb;
//     border-color: #4b5563;
//   }

//   /* Khusus untuk input password - padding kanan yang cukup untuk icon */
//   .floating-input input[type="password"], 
//   .floating-input input[data-password="true"] {
//     padding-right: 48px !important;
//   }

//   .floating-input input:focus {
//     border-color: #2C2F8C; 
//     box-shadow: 0 0 0 3px rgba(44, 47, 140, 0.1);
//   }
//   .dark .floating-input input:focus {
//     box-shadow: 0 0 0 3px rgba(44, 47, 140, 0.2);
//   }

//   .floating-input input.error { border-color: #ef4444; }
//   .floating-input input.error:focus { box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1); }
//   .dark .floating-input input.error:focus { box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2); }

//   .floating-input label {
//     position: absolute; left: 0.75rem; top: 1rem; background: white;
//     padding: 0 0.25rem; color: #6b7280; font-size: 1rem;
//     pointer-events: none; transition: all 0.2s ease-in-out;
//   }

//   /* Dark mode untuk label */
//   .dark .floating-input label {
//     background: #374151;
//     color: #9ca3af;
//   }

//   .floating-input input:focus + label, .floating-input input:not(:placeholder-shown) + label {
//     top: -0.5rem; left: 0.65rem; font-size: 0.75rem; color: #2C2F8C;
//   }
//   .dark .floating-input input:focus + label, .dark .floating-input input:not(:placeholder-shown) + label {
//     background: #1f2937;
//     color: #2C2F8C;
//   }

//   .floating-input input.error + label { color: #ef4444; }

//   /* Style Pesan Error, Success, Warning dengan Dark Mode */
//   .error-message, .success-message, .warning-message {
//     padding: 0.75rem 1rem; border-radius: 0.5rem; margin-bottom: 1rem;
//     font-size: 0.875rem; display: flex; align-items: center; gap: 0.5rem;
//     animation: slideDown 0.3s ease-out; border: 1px solid;
//   }
//   .error-message { background-color: #fef2f2; border-color: #fecaca; color: #dc2626; }
//   .success-message { background-color: #f0fdf4; border-color: #bbf7d0; color: #16a34a; }
//   .warning-message { background-color: #fefce8; border-color: #fef08a; color: #ca8a04; }

//   /* Dark mode untuk messages */
//   .dark .error-message { background-color: #450a0a; border-color: #7f1d1d; color: #f87171; }
//   .dark .success-message { background-color: #052e16; border-color: #166534; color: #4ade80; }
//   .dark .warning-message { background-color: #451a03; border-color: #a16207; color: #fbbf24; }

//   @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

//   /* UI Spesifik Register dengan Dark Mode */
//   .register-button {
//     background: #2C2F8C; color: white; width: 100%; padding: 0.75rem;
//     border-radius: 0.75rem; font-weight: 500; transition: all 0.3s ease;
//     border: none; cursor: pointer;
//   }

//   .register-button:hover {
//     background: #1e1f6c;
//   }

//   /* Password toggle dengan Dark Mode Support */
//   .password-toggle { 
//     position: absolute; 
//     right: 12px; 
//     top: 16px;
//     cursor: pointer; 
//     color: #6b7280;
//     z-index: 10;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     width: 20px;
//     height: 20px;
//     transition: color 0.2s ease;
//     user-select: none;
//     margin: 0;
//     padding: 0;
//   }
//   .password-toggle:hover {
//     color: #2C2F8C;
//   }

//   .dark .password-toggle {
//     color: #9ca3af;
//   }
//   .dark .password-toggle:hover {
//     color: #86A6DF;
//   }

//   /* Icon styling untuk konsistensi */
//   .password-toggle i {
//     font-size: 16px;
//     width: 16px;
//     height: 16px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//   }

//   .password-strength { margin-top: 0.5rem; font-size: 0.75rem; }
//   .strength-weak { color: #ef4444; } 
//   .strength-medium { color: #f59e0b; } 
//   .strength-strong { color: #10b981; }

//   .password-requirements { margin-top: 0.5rem; font-size: 0.75rem; color: #6b7280; }
//   .dark .password-requirements { color: #9ca3af; }

//   .requirement { display: flex; align-items: center; gap: 0.25rem; margin-top: 0.25rem; }
//   .requirement.met { color: #10b981; }
//   .dark .requirement.met { color: #4ade80; }

//   /* Desktop form panel dengan dark mode */
//   .register-form-panel {
//     background: white;
//     color: #1f2937;
//   }
//   .dark .register-form-panel {
//     background: var(--bg-primary);
//     color: #f9fafb;
//   }

//   /* Mobile form panel dengan dark mode */
//   .mobile-form-panel {
//     background: white;
//     color: #2C2F8C;
//   }
//   .dark .mobile-form-panel {
//     background: #1f2937;
//     color: #f9fafb;
//   }

//   /* Text colors untuk dark mode */
//   .register-title {
//     color: #2C2F8C;
//   }
//   .dark .register-title {
//     color: #86A6DF;
//   }

//   .register-subtitle {
//     color: #6b7280;
//   }
//   .dark .register-subtitle {
//     color: #9ca3af;
//   }

//   /* Terms link styling */
//   .terms-link {
//     color: #2C2F8C;
//   }
//   .dark .terms-link {
//     color: #86A6DF;
//   }

//   /* Checkbox styling untuk dark mode */
//   .register-checkbox {
//     accent-color: #2C2F8C;
//   }

//   /* === BAGIAN 2: ANIMATION SUITE LENGKAP === */

//   /* Mobile Animation */
//   @keyframes slideUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
//   .animate-slide-up { animation: slideUp 0.6s ease-out; }

//   /* Keyframes Animasi Utama (Sama seperti Login) */
//   @keyframes waveFromLeft {
//     0% { opacity: 0; transform: translateX(-100%) scale(0.8) rotateY(-15deg); filter: blur(2px); }
//     100% { opacity: 1; transform: translateX(0) scale(1) rotateY(0); filter: blur(0); }
//   }
//   @keyframes waveFromRight {
//     0% { opacity: 0; transform: translateX(100%) scale(0.8) rotateY(15deg); filter: blur(2px); }
//     100% { opacity: 1; transform: translateX(0) scale(1) rotateY(0); filter: blur(0); }
//   }
//   @keyframes formElementsStagger { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
//   @keyframes welcomeContentFloat { from { opacity: 0; transform: translateY(30px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
//   @keyframes backgroundPulse { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
//   @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-10px) rotate(1deg); } }

//   /* Kelas Aplikasi Animasi untuk Efek "Tabrakan" */
//   .register-welcome-panel {
//   background: linear-gradient(-45deg, #86A6DF, #6b8bc4, #86A6DF, #7c94d1);
//   background-size: 400% 400%;
//   animation: 
//     waveFromLeft 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94),
//     backgroundPulse 8s ease-in-out infinite;
// }

// .dark .register-welcome-panel {
//   background: linear-gradient(-45deg, #4c1d95, #5b21b6, #6d28d9, #7c3aed);
//   background-size: 400% 400%;
//   animation: 
//     waveFromLeft 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94),
//     backgroundPulse 8s ease-in-out infinite;
// }
//   .form-element-1 { animation: formElementsStagger 0.6s ease-out 0.4s both; }
//   .form-element-2 { animation: formElementsStagger 0.6s ease-out 0.5s both; }
//   .form-element-3 { animation: formElementsStagger 0.6s ease-out 0.6s both; }
//   .form-element-4 { animation: formElementsStagger 0.6s ease-out 0.7s both; }
//   .form-element-5 { animation: formElementsStagger 0.6s ease-out 0.8s both; }
//   .form-element-6 { animation: formElementsStagger 0.6s ease-out 0.9s both; }

//   .welcome-element-1 { animation: welcomeContentFloat 0.8s ease-out 0.5s both; }
//   .welcome-element-2 { animation: welcomeContentFloat 0.8s ease-out 0.7s both; }
//   .welcome-element-3 { animation: welcomeContentFloat 0.8s ease-out 0.9s both; }
//   .welcome-element-4 { animation: welcomeContentFloat 0.8s ease-out 1.1s both; }

//   .enhanced-hover { transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
//   .enhanced-hover:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 10px 25px rgba(44, 47, 140, 0.15); }
//   .floating-mascot { animation: float 3s ease-in-out infinite; }
//   .ripple-button { position: relative; overflow: hidden; }
//   .ripple-button::before {
//     content: ''; position: absolute; top: 50%; left: 50%; width: 0; height: 0;
//     border-radius: 50%; background: rgba(255, 255, 255, 0.1);
//     transition: width 0.6s, height 0.6s, top 0.6s, left 0.6s; transform: translate(-50%, -50%);
//   }
//   .ripple-button:hover::before { width: 300px; height: 300px; }

//   /* Responsive adjustments untuk memastikan konsistensi */
//   @media (max-width: 768px) {
//     .password-toggle {
//       right: 12px;
//       top: 16px;
//     }
//   }
// </style>

// <section class="block md:hidden w-screen min-h-screen bg-[#86A6DF] text-white font-sans overflow-y-auto">
//   <div class="flex flex-col items-start px-6 pt-6">
//     <a href="#/" class="text-white hover:underline mb-4 flex items-center gap-1">
//       <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
//       Kembali
//     </a>
//   </div>
//   <div class="flex flex-col items-center justify-center px-6 pb-6 text-center">
//     <h1 class="text-3xl font-extrabold mb-4">Selamat Datang!</h1>
//     <img src="maskot5.png" alt="Robot Maskot" class="w-40 mb-4" />
//     <p class="text-sm mb-4 max-w-sm">Jika sudah punya akun, login untuk masuk ke dashboard.</p>
//     <a href="#/login" class="border border-white text-white px-6 py-2 rounded font-semibold hover:bg-white hover:text-[#86A6DF] transition">Login</a>
//   </div>
//   <div class="mobile-form-panel rounded-t-[60px] px-8 py-10 flex flex-col items-center max-w-md mx-auto animate-slide-up">
//     <h2 class="text-2xl font-extrabold mb-1 register-title">DAFTAR</h2>
//     <p class="text-center mb-6 register-subtitle">Buat akun Anda, silahkan isi form untuk mendaftar.</p>
//     <div id="register-message-mobile" class="w-full max-w-sm"></div>
//     <form id="register-form-mobile" class="w-full space-y-4">
//       <div class="floating-input">
//         <input type="text" id="name-mobile" placeholder=" " required />
//         <label for="name-mobile">Username</label>
//       </div>
//       <div class="floating-input">
//         <input type="email" id="email-mobile" placeholder=" " required />
//         <label for="email-mobile">Email</label>
//       </div>
//       <div class="floating-input">
//         <input type="password" id="password-mobile" placeholder=" " required />
//         <label for="password-mobile">Password</label>
//         <span class="password-toggle" id="toggle-password-mobile">
//           <i class="fas fa-eye"></i>
//         </span>
//         <div id="password-strength-mobile" class="password-strength"></div>
//         <div class="password-requirements">
//           <div class="requirement" id="length-req-mobile">
//             <i class="fas fa-circle"></i><span>Minimal 6 karakter</span>
//           </div>
//           <div class="requirement" id="uppercase-req-mobile">
//             <i class="fas fa-circle"></i><span>Mengandung huruf besar</span>
//           </div>
//           <div class="requirement" id="number-req-mobile">
//             <i class="fas fa-circle"></i><span>Mengandung angka</span>
//           </div>
//         </div>
//       </div>
//       <div class="flex items-start">
//         <input type="checkbox" id="terms-mobile" class="mr-2 mt-1 register-checkbox" required />
//         <label for="terms-mobile" class="text-sm register-subtitle">Saya setuju dengan <a href="#/terms" class="terms-link hover:underline">Syarat dan Ketentuan</a></label>
//       </div>
//       <button type="submit" class="register-button">
//         <span id="register-text-mobile">Daftar</span>
//       </button>
//     </form>
//   </div>
// </section>

// <section class="hidden md:flex w-screen h-screen font-sans m-0 p-0 overflow-hidden">
//   <div class="w-1/2 flex flex-col justify-center items-center px-10 text-white relative rounded-tr-[100px] rounded-br-[100px] register-welcome-panel">
//     <div class="relative z-10 text-center">
//       <h3 class="text-4xl font-extrabold mb-6 welcome-element-1">Selamat Datang!</h3>
//       <img src="maskot5.png" alt="Robot Maskot" class="w-72 mb-6 mx-auto drop-shadow-2xl floating-mascot welcome-element-2" />
//       <p class="text-lg mb-8 text-white/90 max-w-md mx-auto welcome-element-3">Sudah punya akun? Masuk untuk melanjutkan perjalanan belajarmu.</p>
//       <a href="#/login" class="inline-block bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-3 rounded-lg hover:bg-white hover:text-[#2C2F8C] font-semibold transition-all duration-300 shadow-xl ripple-button welcome-element-4 enhanced-hover">Login Sekarang</a>
//     </div>
//   </div>
//   <div class="w-1/2 register-form-panel flex flex-col justify-center items-center px-12">
//     <div class="w-full max-w-md">
//       <div class="form-element-1">
//         <h2 class="text-4xl font-extrabold register-title mb-2 text-center">Buat Akun Baru</h2>
//         <p class="register-subtitle text-center mb-6">Gabung dengan Edura dan mulai belajar!</p>
//       </div>
//       <div id="register-message-desktop" class="w-full form-element-2"></div>
//       <form id="register-form-desktop" class="w-full space-y-4">
//         <div class="floating-input form-element-2 enhanced-hover">
//           <input type="text" id="name-desktop" placeholder=" " required />
//           <label for="name-desktop">Username</label>
//         </div>
//         <div class="floating-input form-element-3 enhanced-hover">
//           <input type="email" id="email-desktop" placeholder=" " required />
//           <label for="email-desktop">Email</label>
//         </div>
//         <div class="floating-input form-element-4 enhanced-hover">
//           <input type="password" id="password-desktop" placeholder=" " required />
//           <label for="password-desktop">Password</label>
//           <span class="password-toggle" id="toggle-password-desktop">
//             <i class="fas fa-eye"></i>
//           </span>
//           <div id="password-strength-desktop" class="password-strength"></div>
//           <div class="password-requirements">
//             <div class="requirement" id="length-req-desktop">
//               <i class="fas fa-circle"></i><span>Minimal 6 karakter</span>
//             </div>
//             <div class="requirement" id="uppercase-req-desktop">
//               <i class="fas fa-circle"></i><span>Mengandung huruf besar</span>
//             </div>
//             <div class="requirement" id="number-req-desktop">
//               <i class="fas fa-circle"></i><span>Mengandung angka</span>
//             </div>
//           </div>
//         </div>
//         <div class="flex items-start form-element-5">
//           <input type="checkbox" id="terms-desktop" class="h-4 w-4 mt-1 mr-2 register-checkbox" required />
//           <label for="terms-desktop" class="text-sm register-subtitle">Saya setuju dengan <a href="#/terms" class="terms-link font-semibold hover:underline">Syarat & Ketentuan</a></label>
//         </div>
//         <button type="submit" class="register-button ripple-button form-element-6 enhanced-hover">
//           <span id="register-text-desktop">Daftar</span>
//         </button>
//       </form>
//     </div>
//   </div>
// </section>
// `;
//   },

//   async afterRender() {
//     const footer = document.querySelector("footer");
//     if (footer) footer.style.display = "none";

//     const setupTogglePassword = (inputId, toggleId) => {
//       const input = document.querySelector(inputId);
//       const toggle = document.querySelector(toggleId);
//       if (!input || !toggle) return;
//       toggle.addEventListener("click", () => {
//         const isPassword = input.type === "password";
//         input.type = isPassword ? "text" : "password";
//         toggle.querySelector('i').classList.toggle("fa-eye");
//         toggle.querySelector('i').classList.toggle("fa-eye-slash");
//       });
//     };

//     setupTogglePassword("#password-mobile", "#toggle-password-mobile");
//     setupTogglePassword("#password-desktop", "#toggle-password-desktop");

//     const checkPasswordStrength = (password, strengthElId, lengthReqId, uppercaseReqId, numberReqId) => {
//       const strengthEl = document.querySelector(strengthElId);
//       const lengthReq = document.querySelector(lengthReqId);
//       const uppercaseReq = document.querySelector(uppercaseReqId);
//       const numberReq = document.querySelector(numberReqId);
//       if (!strengthEl || !lengthReq || !uppercaseReq || !numberReq) return;

//       let strength = 0;
//       const metClass = 'met';

//       const updateRequirement = (reqEl, condition) => {
//         if (condition) {
//           reqEl.classList.add(metClass);
//           strength++;
//         } else {
//           reqEl.classList.remove(metClass);
//         }
//       };

//       updateRequirement(lengthReq, password.length >= 6);
//       updateRequirement(uppercaseReq, /[A-Z]/.test(password));
//       updateRequirement(numberReq, /[0-9]/.test(password));

//       if (password.length === 0) {
//         strengthEl.textContent = '';
//         strengthEl.className = 'password-strength';
//       } else if (strength <= 1) {
//         strengthEl.textContent = 'Password lemah';
//         strengthEl.className = 'password-strength strength-weak';
//       } else if (strength === 2) {
//         strengthEl.textContent = 'Password cukup kuat';
//         strengthEl.className = 'password-strength strength-medium';
//       } else {
//         strengthEl.textContent = 'Password kuat';
//         strengthEl.className = 'password-strength strength-strong';
//       }
//     };

//     document.querySelector("#password-mobile")?.addEventListener("input", (e) => checkPasswordStrength(e.target.value, "#password-strength-mobile", "#length-req-mobile", "#uppercase-req-mobile", "#number-req-mobile"));
//     document.querySelector("#password-desktop")?.addEventListener("input", (e) => checkPasswordStrength(e.target.value, "#password-strength-desktop", "#length-req-desktop", "#uppercase-req-desktop", "#number-req-desktop"));

//     // Fungsi showMessage yang lengkap seperti di LoginPage
//     const showMessage = (messageElId, message, type = 'error') => {
//       const messageEl = document.querySelector(messageElId);
//       const iconMap = {
//         error: '<i class="fas fa-exclamation-circle"></i>',
//         success: '<i class="fas fa-check-circle"></i>',
//         warning: '<i class="fas fa-info-circle"></i>'
//       };
//       if (messageEl) messageEl.innerHTML = `<div class="${type}-message">${iconMap[type]}<span>${message}</span></div>`;
//     };

//     const clearMessage = (messageElId) => {
//       const messageEl = document.querySelector(messageElId);
//       if (messageEl) messageEl.innerHTML = '';
//     };

//     // Fungsi handleRegisterSubmit yang disempurnakan meniru handleLoginSubmit
//     const handleRegisterSubmit = (formSelector, nameSelector, emailSelector, passwordSelector, termsSelector, messageElId, buttonTextId) => {
//       const form = document.querySelector(formSelector);
//       if (!form) return;

//       form.addEventListener("submit", async (e) => {
//         e.preventDefault();

//         const nameInput = document.querySelector(nameSelector);
//         const emailInput = document.querySelector(emailSelector);
//         const passwordInput = document.querySelector(passwordSelector);
//         const termsInput = document.querySelector(termsSelector);
//         const submitButton = form.querySelector('button[type="submit"]');
//         const buttonText = document.querySelector(buttonTextId);

//         // 1. Clear error sebelumnya (sama seperti Login)
//         clearMessage(messageElId);
//         [nameInput, emailInput, passwordInput].forEach(el => el?.classList.remove('error'));

//         // 2. Validasi Frontend (lebih detail untuk register)
//         if (nameInput.value.length < 3) {
//           nameInput.classList.add('error');
//           return showMessage(messageElId, 'Username minimal 3 karakter.', 'error');
//         }
//         if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
//           emailInput.classList.add('error');
//           return showMessage(messageElId, 'Format email tidak valid.', 'error');
//         }
//         if (passwordInput.value.length < 6) {
//           passwordInput.classList.add('error');
//           return showMessage(messageElId, 'Password minimal 6 karakter.', 'error');
//         }
//         if (!termsInput.checked) {
//           return showMessage(messageElId, 'Anda harus menyetujui syarat dan ketentuan.', 'warning');
//         }

//         // 3. Disable tombol & tampilkan loading (sama seperti Login)
//         submitButton.disabled = true;
//         buttonText.textContent = 'Memproses...';

//         // 4. Panggil Presenter dengan callback (sama seperti Login)
//         RegisterPresenter.handleRegister(
//           nameInput.value, emailInput.value, passwordInput.value,
//           (successMessage) => {
//             // Success handler
//             showMessage(messageElId, successMessage, 'success');
//             form.reset();
//             setTimeout(() => { window.location.href = "/#/login"; }, 2000);
//           },
//           (errorMessage) => {
//             // Error handler - MENIRU LOGIN DENGAN PESAN SPESIFIK
//             submitButton.disabled = false;
//             buttonText.textContent = 'Daftar';

//             if (errorMessage.includes('Email already registered')) {
//               emailInput.classList.add('error');
//               showMessage(messageElId, 'Email sudah terdaftar. Silakan gunakan email lain atau login.', 'error');
//             } else if (errorMessage.includes("password\" length must be at least 6 characters long")) {
//               passwordInput.classList.add('error');
//               showMessage(messageElId, 'Password terlalu lemah, minimal 6 karakter.', 'error');
//             } else if (errorMessage.includes("\"full_name\" length must be at least 3 characters long")) {
//               nameInput.classList.add('error');
//               showMessage(messageElId, 'Username minimal 3 karakter.', 'error');
//             } else {
//               showMessage(messageElId, errorMessage || 'Terjadi kesalahan. Silakan coba lagi.', 'error');
//             }
//           }
//         );
//       });
//     };

//     handleRegisterSubmit("#register-form-mobile", "#name-mobile", "#email-mobile", "#password-mobile", "#terms-mobile", "#register-message-mobile", "#register-text-mobile");
//     handleRegisterSubmit("#register-form-desktop", "#name-desktop", "#email-desktop", "#password-desktop", "#terms-desktop", "#register-message-desktop", "#register-text-desktop");
//   },
// };

// export default RegisterPage;
import RegisterPresenter from "./register-presenter.js";
import { PasswordValidation } from "../../../utils/password-validation.js";

const RegisterPage = {
  async render() {
    return `
<style>
  /* === BAGIAN 1: GAYA DASAR dengan Dark Mode Support === */
  .floating-input { 
    position: relative; 
    width: 100%;
  }
  .floating-input input {
    width: 100%; 
    padding: 1rem 0.75rem 0.5rem; 
    border: 1.5px solid #e5e7eb;
    border-radius: 0.75rem; 
    background: white; 
    color: #1f2937;
    font-size: 1rem; 
    outline: none; 
    transition: all 0.2s ease;
    box-sizing: border-box;
  }
  
  /* Dark mode styles untuk input */
  .dark .floating-input input {
    background: #374151;
    color: #f9fafb;
    border-color: #4b5563;
  }
  
  /* Khusus untuk input password - padding kanan yang cukup untuk icon */
  .floating-input input[type="password"], 
  .floating-input input[data-password="true"] {
    padding-right: 48px !important;
  }
  
  .floating-input input:focus {
    border-color: #2C2F8C; 
    box-shadow: 0 0 0 3px rgba(44, 47, 140, 0.1);
  }
  .dark .floating-input input:focus {
    box-shadow: 0 0 0 3px rgba(44, 47, 140, 0.2);
  }
  
  .floating-input input.error { border-color: #ef4444; }
  .floating-input input.error:focus { box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1); }
  .dark .floating-input input.error:focus { box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2); }
  
  .floating-input label {
    position: absolute; left: 0.75rem; top: 1rem; background: white;
    padding: 0 0.25rem; color: #6b7280; font-size: 1rem;
    pointer-events: none; transition: all 0.2s ease-in-out;
  }
  
  /* Dark mode untuk label */
  .dark .floating-input label {
    background: #374151;
    color: #9ca3af;
  }
  
  .floating-input input:focus + label, .floating-input input:not(:placeholder-shown) + label {
    top: -0.5rem; left: 0.65rem; font-size: 0.75rem; color: #2C2F8C;
  }
  .dark .floating-input input:focus + label, .dark .floating-input input:not(:placeholder-shown) + label {
    background: #1f2937;
    color: #2C2F8C;
  }
  
  .floating-input input.error + label { color: #ef4444; }

  /* Style Pesan Error, Success, Warning dengan Dark Mode */
  .error-message, .success-message, .warning-message {
    padding: 0.75rem 1rem; border-radius: 0.5rem; margin-bottom: 1rem;
    font-size: 0.875rem; display: flex; align-items: center; gap: 0.5rem;
    animation: slideDown 0.3s ease-out; border: 1px solid;
  }
  .error-message { background-color: #fef2f2; border-color: #fecaca; color: #dc2626; }
  .success-message { background-color: #f0fdf4; border-color: #bbf7d0; color: #16a34a; }
  .warning-message { background-color: #fefce8; border-color: #fef08a; color: #ca8a04; }
  
  /* Dark mode untuk messages */
  .dark .error-message { background-color: #450a0a; border-color: #7f1d1d; color: #f87171; }
  .dark .success-message { background-color: #052e16; border-color: #166534; color: #4ade80; }
  .dark .warning-message { background-color: #451a03; border-color: #a16207; color: #fbbf24; }
  
  @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
  
  /* UI Spesifik Register dengan Dark Mode */
  .register-button {
    background: #2C2F8C; color: white; width: 100%; padding: 0.75rem;
    border-radius: 0.75rem; font-weight: 500; transition: all 0.3s ease;
    border: none; cursor: pointer;
  }
  
  .register-button:hover {
    background: #1e1f6c;
  }
  
  /* Password toggle dengan Dark Mode Support */
  .password-toggle { 
    position: absolute; 
    right: 12px; 
    top: 16px;
    cursor: pointer; 
    color: #6b7280;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    transition: color 0.2s ease;
    user-select: none;
    margin: 0;
    padding: 0;
  }
  .password-toggle:hover {
    color: #2C2F8C;
  }
  
  .dark .password-toggle {
    color: #9ca3af;
  }
  .dark .password-toggle:hover {
    color: #86A6DF;
  }
  
  /* Icon styling untuk konsistensi */
  .password-toggle i {
    font-size: 16px;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* Password strength styling yang disempurnakan */
  .password-strength-container { 
    margin-top: 0.75rem; 
    padding: 0.75rem; 
    background: #f9fafb; 
    border: 1px solid #e5e7eb; 
    border-radius: 0.5rem; 
    transition: all 0.3s ease;
  }
  .dark .password-strength-container { 
    background: #374151; 
    border-color: #4b5563; 
  }
  
  .strength-bar-container {
    height: 6px;
    background: #e5e7eb;
    border-radius: 3px;
    overflow: hidden;
    margin: 0.5rem 0;
  }
  .dark .strength-bar-container {
    background: #4b5563;
  }
  
  .password-requirements { 
    margin-top: 0.75rem; 
    font-size: 0.75rem; 
  }
  
  .requirement { 
    display: flex; 
    align-items: center; 
    gap: 0.5rem; 
    margin-top: 0.5rem; 
    transition: all 0.2s ease;
  }
  
  /* Desktop form panel dengan dark mode */
  .register-form-panel {
    background: white;
    color: #1f2937;
  }
  .dark .register-form-panel {
    background: var(--bg-primary);
    color: #f9fafb;
  }
  
  /* Mobile form panel dengan dark mode */
  .mobile-form-panel {
    background: white;
    color: #2C2F8C;
  }
  .dark .mobile-form-panel {
    background: #1f2937;
    color: #f9fafb;
  }
  
  /* Text colors untuk dark mode */
  .register-title {
    color: #2C2F8C;
  }
  .dark .register-title {
    color: #86A6DF;
  }
  
  .register-subtitle {
    color: #6b7280;
  }
  .dark .register-subtitle {
    color: #9ca3af;
  }
  
  /* Terms link styling */
  .terms-link {
    color: #2C2F8C;
  }
  .dark .terms-link {
    color: #86A6DF;
  }
  
  /* Checkbox styling untuk dark mode */
  .register-checkbox {
    accent-color: #2C2F8C;
  }
  
  /* === BAGIAN 2: ANIMATION SUITE LENGKAP === */
  
  /* Mobile Animation */
  @keyframes slideUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
  .animate-slide-up { animation: slideUp 0.6s ease-out; }
  
  /* Keyframes Animasi Utama (Sama seperti Login) */
  @keyframes waveFromLeft {
    0% { opacity: 0; transform: translateX(-100%) scale(0.8) rotateY(-15deg); filter: blur(2px); }
    100% { opacity: 1; transform: translateX(0) scale(1) rotateY(0); filter: blur(0); }
  }
  @keyframes waveFromRight {
    0% { opacity: 0; transform: translateX(100%) scale(0.8) rotateY(15deg); filter: blur(2px); }
    100% { opacity: 1; transform: translateX(0) scale(1) rotateY(0); filter: blur(0); }
  }
  @keyframes formElementsStagger { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
  @keyframes welcomeContentFloat { from { opacity: 0; transform: translateY(30px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
  @keyframes backgroundPulse { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
  @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-10px) rotate(1deg); } }

  /* Kelas Aplikasi Animasi untuk Efek "Tabrakan" */
  .register-welcome-panel {
  background: linear-gradient(-45deg, #86A6DF, #6b8bc4, #86A6DF, #7c94d1);
  background-size: 400% 400%;
  animation: 
    waveFromLeft 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    backgroundPulse 8s ease-in-out infinite;
}

.dark .register-welcome-panel {
  background: linear-gradient(-45deg, #4c1d95, #5b21b6, #6d28d9, #7c3aed);
  background-size: 400% 400%;
  animation: 
    waveFromLeft 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    backgroundPulse 8s ease-in-out infinite;
}
  .form-element-1 { animation: formElementsStagger 0.6s ease-out 0.4s both; }
  .form-element-2 { animation: formElementsStagger 0.6s ease-out 0.5s both; }
  .form-element-3 { animation: formElementsStagger 0.6s ease-out 0.6s both; }
  .form-element-4 { animation: formElementsStagger 0.6s ease-out 0.7s both; }
  .form-element-5 { animation: formElementsStagger 0.6s ease-out 0.8s both; }
  .form-element-6 { animation: formElementsStagger 0.6s ease-out 0.9s both; }

  .welcome-element-1 { animation: welcomeContentFloat 0.8s ease-out 0.5s both; }
  .welcome-element-2 { animation: welcomeContentFloat 0.8s ease-out 0.7s both; }
  .welcome-element-3 { animation: welcomeContentFloat 0.8s ease-out 0.9s both; }
  .welcome-element-4 { animation: welcomeContentFloat 0.8s ease-out 1.1s both; }

  .enhanced-hover { transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
  .enhanced-hover:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 10px 25px rgba(44, 47, 140, 0.15); }
  .floating-mascot { animation: float 3s ease-in-out infinite; }
  .ripple-button { position: relative; overflow: hidden; }
  .ripple-button::before {
    content: ''; position: absolute; top: 50%; left: 50%; width: 0; height: 0;
    border-radius: 50%; background: rgba(255, 255, 255, 0.1);
    transition: width 0.6s, height 0.6s, top 0.6s, left 0.6s; transform: translate(-50%, -50%);
  }
  .ripple-button:hover::before { width: 300px; height: 300px; }
  
  /* Responsive adjustments untuk memastikan konsistensi */
  @media (max-width: 768px) {
    .password-toggle {
      right: 12px;
      top: 16px;
    }
  }
</style>

<section class="block md:hidden w-screen min-h-screen bg-[#86A6DF] text-white font-sans overflow-y-auto">
  <div class="flex flex-col items-start px-6 pt-6">
    <a href="#/" class="text-white hover:underline mb-4 flex items-center gap-1">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
      Kembali
    </a>
  </div>
  <div class="flex flex-col items-center justify-center px-6 pb-6 text-center">
    <h1 class="text-3xl font-extrabold mb-4">Selamat Datang!</h1>
    <img src="maskot5.png" alt="Robot Maskot" class="w-40 mb-4" />
    <p class="text-sm mb-4 max-w-sm">Jika sudah punya akun, login untuk masuk ke dashboard.</p>
    <a href="#/login" class="border border-white text-white px-6 py-2 rounded font-semibold hover:bg-white hover:text-[#86A6DF] transition">Login</a>
  </div>
  <div class="mobile-form-panel rounded-t-[60px] px-8 py-10 flex flex-col items-center max-w-md mx-auto animate-slide-up">
    <h2 class="text-2xl font-extrabold mb-1 register-title">DAFTAR</h2>
    <p class="text-center mb-6 register-subtitle">Buat akun Anda, silahkan isi form untuk mendaftar.</p>
    <div id="register-message-mobile" class="w-full max-w-sm"></div>
    <form id="register-form-mobile" class="w-full space-y-4">
      <div class="floating-input">
        <input type="text" id="name-mobile" placeholder=" " required />
        <label for="name-mobile">Username</label>
      </div>
      <div class="floating-input">
        <input type="email" id="email-mobile" placeholder=" " required />
        <label for="email-mobile">Email</label>
      </div>
      <div class="floating-input">
        <input type="password" id="password-mobile" placeholder=" " required />
        <label for="password-mobile">Password</label>
        <span class="password-toggle" id="toggle-password-mobile">
          <i class="fas fa-eye"></i>
        </span>
        
        <!-- Password Strength Container - Mobile -->
        <div id="password-strength-mobile" class="password-strength-container hidden">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Kekuatan Password:</span>
            <span id="strength-text-mobile" class="text-xs font-bold">Belum diisi</span>
          </div>
          <div class="strength-bar-container">
            <div id="strength-bar-mobile" class="h-full transition-all duration-300 rounded-full w-0"></div>
          </div>
          
          <!-- Requirements List - Mobile -->
          <div class="password-requirements" id="requirements-mobile">
            ${PasswordValidation.generateRequirementsHTML('mobile-')}
          </div>
        </div>
      </div>
      <div class="flex items-start">
        <input type="checkbox" id="terms-mobile" class="mr-2 mt-1 register-checkbox" required />
        <label for="terms-mobile" class="text-sm register-subtitle">Saya setuju dengan <a href="#/terms" class="terms-link hover:underline">Syarat dan Ketentuan</a></label>
      </div>
      <button type="submit" class="register-button">
        <span id="register-text-mobile">Daftar</span>
      </button>
    </form>
  </div>
</section>

<section class="hidden md:flex w-screen h-screen font-sans m-0 p-0 overflow-hidden">
  <div class="w-1/2 flex flex-col justify-center items-center px-10 text-white relative rounded-tr-[100px] rounded-br-[100px] register-welcome-panel">
    <div class="relative z-10 text-center">
      <h3 class="text-4xl font-extrabold mb-6 welcome-element-1">Selamat Datang!</h3>
      <img src="maskot5.png" alt="Robot Maskot" class="w-72 mb-6 mx-auto drop-shadow-2xl floating-mascot welcome-element-2" />
      <p class="text-lg mb-8 text-white/90 max-w-md mx-auto welcome-element-3">Sudah punya akun? Masuk untuk melanjutkan perjalanan belajarmu.</p>
      <a href="#/login" class="inline-block bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-3 rounded-lg hover:bg-white hover:text-[#2C2F8C] font-semibold transition-all duration-300 shadow-xl ripple-button welcome-element-4 enhanced-hover">Login Sekarang</a>
    </div>
  </div>
  <div class="w-1/2 register-form-panel flex flex-col justify-center items-center px-12">
    <div class="w-full max-w-md">
      <div class="form-element-1">
        <h2 class="text-4xl font-extrabold register-title mb-2 text-center">Buat Akun Baru</h2>
        <p class="register-subtitle text-center mb-6">Gabung dengan Edura dan mulai belajar!</p>
      </div>
      <div id="register-message-desktop" class="w-full form-element-2"></div>
      <form id="register-form-desktop" class="w-full space-y-4">
        <div class="floating-input form-element-2 enhanced-hover">
          <input type="text" id="name-desktop" placeholder=" " required />
          <label for="name-desktop">Username</label>
        </div>
        <div class="floating-input form-element-3 enhanced-hover">
          <input type="email" id="email-desktop" placeholder=" " required />
          <label for="email-desktop">Email</label>
        </div>
        <div class="floating-input form-element-4 enhanced-hover">
          <input type="password" id="password-desktop" placeholder=" " required />
          <label for="password-desktop">Password</label>
          <span class="password-toggle" id="toggle-password-desktop">
            <i class="fas fa-eye"></i>
          </span>
          
          <!-- Password Strength Container - Desktop -->
          <div id="password-strength-desktop" class="password-strength-container hidden">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Kekuatan Password:</span>
              <span id="strength-text-desktop" class="text-xs font-bold">Belum diisi</span>
            </div>
            <div class="strength-bar-container">
              <div id="strength-bar-desktop" class="h-full transition-all duration-300 rounded-full w-0"></div>
            </div>
            
            <!-- Requirements List - Desktop -->
            <div class="password-requirements" id="requirements-desktop">
              ${PasswordValidation.generateRequirementsHTML('desktop-')}
            </div>
          </div>
        </div>
        <div class="flex items-start form-element-5">
          <input type="checkbox" id="terms-desktop" class="h-4 w-4 mt-1 mr-2 register-checkbox" required />
          <label for="terms-desktop" class="text-sm register-subtitle">Saya setuju dengan <a href="#/terms" class="terms-link font-semibold hover:underline">Syarat & Ketentuan</a></label>
        </div>
        <button type="submit" class="register-button ripple-button form-element-6 enhanced-hover">
          <span id="register-text-desktop">Daftar</span>
        </button>
      </form>
    </div>
  </div>
</section>
`;
  },

  async afterRender() {
    const footer = document.querySelector("footer");
    if (footer) footer.style.display = "none";

    // Setup password toggle functionality
    const setupTogglePassword = (inputId, toggleId) => {
      const input = document.querySelector(inputId);
      const toggle = document.querySelector(toggleId);
      if (!input || !toggle) return;
      toggle.addEventListener("click", () => {
        const isPassword = input.type === "password";
        input.type = isPassword ? "text" : "password";
        toggle.querySelector('i').classList.toggle("fa-eye");
        toggle.querySelector('i').classList.toggle("fa-eye-slash");
      });
    };

    setupTogglePassword("#password-mobile", "#toggle-password-mobile");
    setupTogglePassword("#password-desktop", "#toggle-password-desktop");

    // Setup global password validation for mobile
    PasswordValidation.setupPasswordValidation({
      passwordInput: "#password-mobile",
      strengthSelectors: {
        strengthBar: "#strength-bar-mobile",
        strengthText: "#strength-text-mobile",
        requirements: {
          length: "#mobile-length-req",
          uppercase: "#mobile-uppercase-req",
          lowercase: "#mobile-lowercase-req",
          number: "#mobile-number-req",
          special: "#mobile-special-req"
        }
      },
      onValidationChange: (validation) => {
        const strengthContainer = document.querySelector("#password-strength-mobile");
        const passwordInput = document.querySelector("#password-mobile");

        if (passwordInput.value.length > 0) {
          strengthContainer.classList.remove("hidden");
        } else {
          strengthContainer.classList.add("hidden");
        }
      }
    });

    // Setup global password validation for desktop
    PasswordValidation.setupPasswordValidation({
      passwordInput: "#password-desktop",
      strengthSelectors: {
        strengthBar: "#strength-bar-desktop",
        strengthText: "#strength-text-desktop",
        requirements: {
          length: "#desktop-length-req",
          uppercase: "#desktop-uppercase-req",
          lowercase: "#desktop-lowercase-req",
          number: "#desktop-number-req",
          special: "#desktop-special-req"
        }
      },
      onValidationChange: (validation) => {
        const strengthContainer = document.querySelector("#password-strength-desktop");
        const passwordInput = document.querySelector("#password-desktop");

        if (passwordInput.value.length > 0) {
          strengthContainer.classList.remove("hidden");
        } else {
          strengthContainer.classList.add("hidden");
        }
      }
    });

    // Fungsi showMessage yang lengkap
    const showMessage = (messageElId, message, type = 'error') => {
      const messageEl = document.querySelector(messageElId);
      const iconMap = {
        error: '<i class="fas fa-exclamation-circle"></i>',
        success: '<i class="fas fa-check-circle"></i>',
        warning: '<i class="fas fa-info-circle"></i>'
      };
      if (messageEl) messageEl.innerHTML = `<div class="${type}-message">${iconMap[type]}<span>${message}</span></div>`;
    };

    const clearMessage = (messageElId) => {
      const messageEl = document.querySelector(messageElId);
      if (messageEl) messageEl.innerHTML = '';
    };

    // Enhanced handleRegisterSubmit with global password validation
    const handleRegisterSubmit = (formSelector, nameSelector, emailSelector, passwordSelector, termsSelector, messageElId, buttonTextId) => {
      const form = document.querySelector(formSelector);
      if (!form) return;

      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nameInput = document.querySelector(nameSelector);
        const emailInput = document.querySelector(emailSelector);
        const passwordInput = document.querySelector(passwordSelector);
        const termsInput = document.querySelector(termsSelector);
        const submitButton = form.querySelector('button[type="submit"]');
        const buttonText = document.querySelector(buttonTextId);

        // Clear previous errors
        clearMessage(messageElId);
        [nameInput, emailInput, passwordInput].forEach(el => el?.classList.remove('error'));

        // Frontend validation using global validation
        if (nameInput.value.length < 3) {
          nameInput.classList.add('error');
          return showMessage(messageElId, 'Username minimal 3 karakter.', 'error');
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
          emailInput.classList.add('error');
          return showMessage(messageElId, 'Format email tidak valid.', 'error');
        }

        // Use global password validation
        const passwordValidation = PasswordValidation.validatePassword(passwordInput.value);
        if (!passwordValidation.isValid) {
          passwordInput.classList.add('error');
          return showMessage(messageElId, `Password tidak memenuhi persyaratan: ${passwordValidation.missingRequirements.join(', ')}.`, 'error');
        }

        if (!termsInput.checked) {
          return showMessage(messageElId, 'Anda harus menyetujui syarat dan ketentuan.', 'warning');
        }

        // Set loading state
        submitButton.disabled = true;
        buttonText.textContent = 'Memproses...';

        // Call presenter
        RegisterPresenter.handleRegister(
          nameInput.value, emailInput.value, passwordInput.value,
          (successMessage) => {
            showMessage(messageElId, successMessage, 'success');
            form.reset();

            // Hide password strength containers after reset
            const strengthContainers = [
              document.querySelector("#password-strength-mobile"),
              document.querySelector("#password-strength-desktop")
            ];
            strengthContainers.forEach(container => {
              if (container) container.classList.add("hidden");
            });

            setTimeout(() => { window.location.href = "/#/login"; }, 2000);
          },
          (errorMessage) => {
            submitButton.disabled = false;
            buttonText.textContent = 'Daftar';

            if (errorMessage.includes('Email already registered')) {
              emailInput.classList.add('error');
              showMessage(messageElId, 'Email sudah terdaftar. Silakan gunakan email lain atau login.', 'error');
            } else if (errorMessage.includes("password\" length must be at least")) {
              passwordInput.classList.add('error');
              showMessage(messageElId, 'Password tidak memenuhi persyaratan keamanan.', 'error');
            } else if (errorMessage.includes("\"full_name\" length must be at least 3 characters long")) {
              nameInput.classList.add('error');
              showMessage(messageElId, 'Username minimal 3 karakter.', 'error');
            } else {
              showMessage(messageElId, errorMessage || 'Terjadi kesalahan. Silakan coba lagi.', 'error');
            }
          }
        );
      });
    };

    handleRegisterSubmit("#register-form-mobile", "#name-mobile", "#email-mobile", "#password-mobile", "#terms-mobile", "#register-message-mobile", "#register-text-mobile");
    handleRegisterSubmit("#register-form-desktop", "#name-desktop", "#email-desktop", "#password-desktop", "#terms-desktop", "#register-message-desktop", "#register-text-desktop");
  },
};

export default RegisterPage;