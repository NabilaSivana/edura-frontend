// // File: pages/auth/setup-teacher-password/page.js
// import API from "../../../data/api.js";

// const SetupTeacherPasswordPage = {
//     token: null, // Store token globally in this object

//     async render() {
//         return `
//       <section class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-6 transition-colors duration-300">
//         <div class="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg dark:shadow-gray-900/30 w-full max-w-md transition-colors duration-300">
//           <!-- Theme Toggle Button -->
//           <div class="absolute top-4 right-4 sm:top-6 sm:right-6">
//             <button
//               id="theme-toggle"
//               class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
//               aria-label="Toggle theme"
//             >
//               <svg id="sun-icon" class="w-5 h-5 hidden dark:block" fill="currentColor" viewBox="0 0 20 20">
//                 <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
//               </svg>
//               <svg id="moon-icon" class="w-5 h-5 block dark:hidden" fill="currentColor" viewBox="0 0 20 20">
//                 <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
//               </svg>
//             </button>
//           </div>

//           <div class="text-center mb-6">
//             <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
//               <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
//               </svg>
//             </div>
//             <h2 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">Setup Password Teacher</h2>
//             <p class="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">Buat password yang kuat untuk akun teacher Anda</p>
//           </div>

//           <form id="setup-password-form" class="space-y-4">
//             <div>
//               <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
//                 Password Baru
//               </label>
//               <div class="relative">
//                 <input
//                   type="password"
//                   id="password"
//                   name="password"
//                   required
//                   minlength="8"
//                   class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
//                   placeholder="Masukkan password baru"
//                 />
//                 <button
//                   type="button"
//                   id="toggle-password"
//                   class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
//                 >
//                   <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                   </svg>
//                 </button>
//               </div>
//               <div class="mt-2 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
//                 Password harus minimal 8 karakter dan mengandung huruf besar, huruf kecil, dan angka
//               </div>
//             </div>

//             <div>
//               <label for="confirm-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
//                 Konfirmasi Password
//               </label>
//               <div class="relative">
//                 <input
//                   type="password"
//                   id="confirm-password"
//                   name="confirm-password"
//                   required
//                   class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
//                   placeholder="Konfirmasi password baru"
//                 />
//                 <button
//                   type="button"
//                   id="toggle-confirm-password"
//                   class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
//                 >
//                   <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                   </svg>
//                 </button>
//               </div>
//             </div>

//             <!-- Password Strength Indicator -->
//             <div id="password-strength" class="hidden">
//               <div class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">Kekuatan Password:</div>
//               <div class="flex space-x-1">
//                 <div class="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded transition-colors duration-300"></div>
//                 <div class="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded transition-colors duration-300"></div>
//                 <div class="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded transition-colors duration-300"></div>
//                 <div class="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded transition-colors duration-300"></div>
//               </div>
//               <div id="strength-text" class="text-xs mt-1"></div>
//             </div>

//             <!-- Submit Button with better spacing -->
//             <div class="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
//               <button
//                 type="submit"
//                 id="submit-btn"
//                 class="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//               >
//                 <span id="btn-text">Setup Password</span>
//                 <div id="btn-loading" class="hidden">
//                   <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
//                     <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Memproses...
//                 </div>
//               </button>
//             </div>

//             <!-- Messages -->
//             <div id="error-message" class="hidden bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm transition-colors duration-300">
//               <div class="flex items-center">
//                 <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                   <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
//                 </svg>
//                 <span id="error-text" class="break-words"></span>
//               </div>
//             </div>

//             <div id="success-message" class="hidden bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg text-sm transition-colors duration-300">
//               <div class="flex items-center">
//                 <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                   <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
//                 </svg>
//                 <span id="success-text" class="break-words"></span>
//               </div>
//             </div>

//             <!-- Token Expired Section -->
//             <div id="token-expired-section" class="hidden">
//               <div class="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-4 transition-colors duration-300">
//                 <div class="flex items-start">
//                   <svg class="w-5 h-5 text-orange-600 dark:text-orange-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                     <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
//                   </svg>
//                   <div class="flex-1">
//                     <p class="font-medium text-orange-800 dark:text-orange-200 mb-1 transition-colors duration-300">Link Setup Password Kadaluarsa</p>
//                     <p class="text-sm text-orange-700 dark:text-orange-300 mb-3 transition-colors duration-300">
//                       Token setup password Anda sudah kadaluarsa. Silakan minta link baru untuk melanjutkan setup password.
//                     </p>

//                     <!-- Email Input for Resend -->
//                     <div class="mb-3">
//                       <label for="resend-email" class="block text-xs font-medium text-orange-800 dark:text-orange-200 mb-1 transition-colors duration-300">
//                         Email Teacher Anda:
//                       </label>
//                       <input
//                         type="email"
//                         id="resend-email"
//                         placeholder="Masukkan email teacher"
//                         class="w-full px-3 py-2 text-sm border border-orange-300 dark:border-orange-600 rounded-md bg-white dark:bg-orange-900/20 text-gray-900 dark:text-orange-100 placeholder-orange-500 dark:placeholder-orange-400 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-200"
//                       />
//                     </div>

//                     <!-- Resend Button -->
//                     <button
//                       type="button"
//                       id="resend-setup-link-btn"
//                       class="w-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       <span id="resend-btn-text">Kirim Ulang Link Setup</span>
//                       <div id="resend-btn-loading" class="hidden">
//                         <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
//                           <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         Mengirim...
//                       </div>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </form>

//           <div class="mt-6 text-center space-y-3">
//             <!-- Resend Link Section -->
//             <div class="border-t border-gray-200 dark:border-gray-700 pt-4 transition-colors duration-300">
//               <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 transition-colors duration-300">
//                 Tidak menerima email atau link sudah kadaluarsa?
//               </p>

//               <div id="resend-section" class="space-y-3">
//                 <div>
//                   <input
//                     type="email"
//                     id="resend-email-input"
//                     placeholder="Masukkan email teacher Anda"
//                     class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
//                   />
//                 </div>

//                 <button
//                   type="button"
//                   id="resend-link-btn"
//                   class="w-full bg-gray-600 hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <span id="resend-link-text">Kirim Ulang Link Setup</span>
//                   <div id="resend-link-loading" class="hidden">
//                     <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
//                       <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Mengirim...
//                   </div>
//                 </button>

//                 <!-- Resend Messages -->
//                 <div id="resend-error" class="hidden bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-3 py-2 rounded text-sm transition-colors duration-300">
//                   <span id="resend-error-text" class="break-words"></span>
//                 </div>

//                 <div id="resend-success" class="hidden bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-3 py-2 rounded text-sm transition-colors duration-300">
//                   <span id="resend-success-text" class="break-words"></span>
//                 </div>
//               </div>
//             </div>

//             <p class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
//               Butuh bantuan? 
//               <a href="mailto:cs@edura.web.id" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors duration-200">
//                 Hubungi Support
//               </a>
//             </p>
//           </div>
//         </div>
//       </section>
//     `;
//     },

//     async afterRender() {
//         this.initializeTheme();

//         // Multiple ways to get token from URL
//         let token = null;

//         try {
//             // Method 1: From hash after #
//             const hashPart = window.location.hash.substring(1); // Remove #
//             if (hashPart.includes('?')) {
//                 const queryString = hashPart.split('?')[1];
//                 const hashParams = new URLSearchParams(queryString);
//                 token = hashParams.get('token');
//             }

//             // Method 2: From main URL query parameters (fallback)
//             if (!token) {
//                 const urlParams = new URLSearchParams(window.location.search);
//                 token = urlParams.get('token');
//             }

//             // Method 3: Manual parsing from full URL (fallback)
//             if (!token) {
//                 const fullUrl = window.location.href;
//                 const tokenMatch = fullUrl.match(/[?&]token=([^&]+)/);
//                 if (tokenMatch) {
//                     token = tokenMatch[1];
//                 }
//             }

//             console.log('🔍 Token detection:', {
//                 fullUrl: window.location.href,
//                 hash: window.location.hash,
//                 search: window.location.search,
//                 detectedToken: token ? '***' + token.slice(-8) : 'null'
//             });

//         } catch (error) {
//             console.error('❌ Error parsing token from URL:', error);
//         }

//         if (!token) {
//             this.showError("Token tidak valid atau tidak ditemukan. Pastikan Anda mengakses halaman ini melalui link yang diberikan melalui email.");
//             return;
//         }

//         // Store token for later use
//         this.token = token;

//         this.initializeEventListeners();
//         this.initializePasswordValidation();
//     },

//     initializeTheme() {
//         // Check for saved theme preference or default to system preference
//         const savedTheme = localStorage.getItem('theme');
//         const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

//         if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
//             document.documentElement.classList.add('dark');
//         } else {
//             document.documentElement.classList.remove('dark');
//         }

//         // Listen for system theme changes
//         window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
//             if (!localStorage.getItem('theme')) {
//                 if (e.matches) {
//                     document.documentElement.classList.add('dark');
//                 } else {
//                     document.documentElement.classList.remove('dark');
//                 }
//             }
//         });

//         // Theme toggle button functionality
//         const themeToggle = document.querySelector("#theme-toggle");
//         if (themeToggle) {
//             themeToggle.addEventListener("click", () => {
//                 this.toggleTheme();
//             });
//         }
//     },

//     toggleTheme() {
//         const isDark = document.documentElement.classList.contains('dark');

//         if (isDark) {
//             document.documentElement.classList.remove('dark');
//             localStorage.setItem('theme', 'light');
//         } else {
//             document.documentElement.classList.add('dark');
//             localStorage.setItem('theme', 'dark');
//         }
//     },

//     initializeEventListeners() {
//         const form = document.querySelector("#setup-password-form");
//         const togglePassword = document.querySelector("#toggle-password");
//         const toggleConfirmPassword = document.querySelector("#toggle-confirm-password");
//         const passwordInput = document.querySelector("#password");
//         const confirmPasswordInput = document.querySelector("#confirm-password");
//         const resendBtn = document.querySelector("#resend-setup-link-btn");
//         const resendLinkBtn = document.querySelector("#resend-link-btn");

//         // Toggle password visibility
//         if (togglePassword) {
//             togglePassword.addEventListener("click", () => {
//                 this.togglePasswordVisibility(passwordInput, togglePassword);
//             });
//         }

//         if (toggleConfirmPassword) {
//             toggleConfirmPassword.addEventListener("click", () => {
//                 this.togglePasswordVisibility(confirmPasswordInput, toggleConfirmPassword);
//             });
//         }

//         // Form submission
//         if (form) {
//             form.addEventListener("submit", async (e) => {
//                 e.preventDefault();
//                 await this.handleSubmit();
//             });
//         }

//         // Resend setup link button (from token expired section)
//         if (resendBtn) {
//             resendBtn.addEventListener("click", async () => {
//                 await this.handleResendSetupLink();
//             });
//         }

//         // Regular resend link button
//         if (resendLinkBtn) {
//             resendLinkBtn.addEventListener("click", async () => {
//                 await this.handleRegularResendLink();
//             });
//         }

//         // Real-time password validation
//         if (passwordInput) {
//             passwordInput.addEventListener("input", () => {
//                 this.validatePassword();
//             });
//         }

//         if (confirmPasswordInput) {
//             confirmPasswordInput.addEventListener("input", () => {
//                 this.validatePasswordMatch();
//             });
//         }
//     },

//     initializePasswordValidation() {
//         const passwordInput = document.querySelector("#password");
//         const strengthContainer = document.querySelector("#password-strength");

//         if (passwordInput && strengthContainer) {
//             passwordInput.addEventListener("input", () => {
//                 if (passwordInput.value.length > 0) {
//                     strengthContainer.classList.remove("hidden");
//                     this.updatePasswordStrength(passwordInput.value);
//                 } else {
//                     strengthContainer.classList.add("hidden");
//                 }
//             });
//         }
//     },

//     togglePasswordVisibility(input, button) {
//         if (!input || !button) return;

//         const type = input.getAttribute("type") === "password" ? "text" : "password";
//         input.setAttribute("type", type);

//         const icon = button.querySelector("svg");
//         if (icon) {
//             if (type === "text") {
//                 icon.innerHTML = `
//           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
//         `;
//             } else {
//                 icon.innerHTML = `
//           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//         `;
//             }
//         }
//     },

//     updatePasswordStrength(password) {
//         const strengthBars = document.querySelectorAll("#password-strength .flex-1");
//         const strengthText = document.querySelector("#strength-text");

//         if (!strengthBars.length || !strengthText) return;

//         let score = 0;
//         let feedback = [];

//         // Length check
//         if (password.length >= 8) score++;
//         else feedback.push("minimal 8 karakter");

//         // Uppercase check
//         if (/[A-Z]/.test(password)) score++;
//         else feedback.push("huruf besar");

//         // Lowercase check
//         if (/[a-z]/.test(password)) score++;
//         else feedback.push("huruf kecil");

//         // Number check
//         if (/\d/.test(password)) score++;
//         else feedback.push("angka");

//         // Update bars
//         strengthBars.forEach((bar, index) => {
//             bar.className = "flex-1 h-2 rounded transition-colors duration-200";
//             if (index < score) {
//                 if (score <= 1) bar.classList.add("bg-red-400");
//                 else if (score <= 2) bar.classList.add("bg-yellow-400");
//                 else if (score <= 3) bar.classList.add("bg-blue-400");
//                 else bar.classList.add("bg-green-400");
//             } else {
//                 bar.classList.add("bg-gray-200");
//             }
//         });

//         // Update text
//         if (score <= 1) {
//             strengthText.textContent = `Lemah - Tambahkan: ${feedback.join(", ")}`;
//             strengthText.className = "text-xs mt-1 text-red-600";
//         } else if (score <= 2) {
//             strengthText.textContent = `Sedang - Tambahkan: ${feedback.join(", ")}`;
//             strengthText.className = "text-xs mt-1 text-yellow-600";
//         } else if (score <= 3) {
//             strengthText.textContent = `Baik - Tambahkan: ${feedback.join(", ")}`;
//             strengthText.className = "text-xs mt-1 text-blue-600";
//         } else {
//             strengthText.textContent = "Sangat Kuat";
//             strengthText.className = "text-xs mt-1 text-green-600";
//         }
//     },

//     validatePassword() {
//         const passwordInput = document.querySelector("#password");
//         if (!passwordInput) return false;

//         const password = passwordInput.value;
//         const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
//         return regex.test(password);
//     },

//     validatePasswordMatch() {
//         const passwordInput = document.querySelector("#password");
//         const confirmPasswordInput = document.querySelector("#confirm-password");

//         if (!passwordInput || !confirmPasswordInput) return false;

//         const password = passwordInput.value;
//         const confirmPassword = confirmPasswordInput.value;

//         if (confirmPassword && password !== confirmPassword) {
//             confirmPasswordInput.classList.add("border-red-500");
//             return false;
//         } else {
//             confirmPasswordInput.classList.remove("border-red-500");
//             return true;
//         }
//     },

//     async handleSubmit() {
//         // Use stored token from afterRender
//         const token = this.token;
//         const passwordInput = document.querySelector("#password");
//         const confirmPasswordInput = document.querySelector("#confirm-password");

//         if (!passwordInput || !confirmPasswordInput) {
//             this.showError("Form tidak ditemukan. Silakan muat ulang halaman.");
//             return;
//         }

//         const password = passwordInput.value;
//         const confirmPassword = confirmPasswordInput.value;

//         if (!token) {
//             this.showError("Token tidak ditemukan. Silakan muat ulang halaman atau gunakan link baru dari email.");
//             return;
//         }

//         // Validate inputs
//         if (!this.validatePassword()) {
//             this.showError("Password harus minimal 8 karakter dan mengandung huruf besar, huruf kecil, dan angka");
//             return;
//         }

//         if (password !== confirmPassword) {
//             this.showError("Password dan konfirmasi password tidak cocok");
//             return;
//         }

//         this.setLoading(true);

//         try {
//             console.log('📤 Submitting teacher password setup with token:', token ? '***' + token.slice(-8) : 'undefined');

//             const response = await API.postSetupTeacherPassword({
//                 token,
//                 password
//             });

//             if (response.error) {
//                 // Check if error is related to token expiry
//                 if (response.error.includes('kadaluarsa') || response.error.includes('expired') || response.error.includes('Token sudah kadaluarsa')) {
//                     this.showTokenExpiredSection();
//                 } else {
//                     this.showError(response.error);
//                 }
//             } else {
//                 this.showSuccess("Password berhasil diatur! Anda akan diarahkan ke dashboard...");

//                 // Store authentication data
//                 if (response.token) {
//                     localStorage.setItem("token", response.token);
//                     localStorage.setItem("userRole", response.user.role);
//                     localStorage.setItem("userId", response.user.id);

//                     console.log('✅ Auth data stored:', {
//                         token: !!response.token,
//                         role: response.user.role,
//                         userId: response.user.id
//                     });
//                 }

//                 // Redirect after 2 seconds
//                 setTimeout(() => {
//                     window.location.hash = "#/dashboard";
//                 }, 2000);
//             }
//         } catch (error) {
//             console.error("❌ Setup password error:", error);

//             // Check if error message indicates token expiry
//             const errorMessage = error.message || "";
//             if (errorMessage.includes('kadaluarsa') || errorMessage.includes('expired') || errorMessage.includes('Token sudah kadaluarsa')) {
//                 this.showTokenExpiredSection();
//             } else {
//                 this.showError("Terjadi kesalahan: " + errorMessage || "Silakan coba lagi.");
//             }
//         } finally {
//             this.setLoading(false);
//         }
//     },

//     async handleResendSetupLink() {
//         const emailInput = document.querySelector("#resend-email");

//         if (!emailInput) {
//             this.showError("Input email tidak ditemukan.");
//             return;
//         }

//         const email = emailInput.value.trim();

//         if (!email) {
//             this.showError("Silakan masukkan email teacher Anda.");
//             return;
//         }

//         if (!this.isValidEmail(email)) {
//             this.showError("Format email tidak valid.");
//             return;
//         }

//         this.setResendLoading(true);

//         try {
//             console.log('📤 Resending teacher setup link for:', email);

//             const response = await API.postResendTeacherSetupLink({ email });

//             if (response.error) {
//                 this.showError(response.error);
//             } else {
//                 this.showSuccess("Link setup password baru telah dikirim ke email Anda! Silakan periksa inbox dan gunakan link terbaru.");

//                 // Hide token expired section after successful resend
//                 const tokenExpiredSection = document.querySelector("#token-expired-section");
//                 if (tokenExpiredSection) {
//                     tokenExpiredSection.classList.add("hidden");
//                 }

//                 // Clear email input
//                 emailInput.value = '';
//             }
//         } catch (error) {
//             console.error("❌ Resend setup link error:", error);
//             this.showError("Terjadi kesalahan saat mengirim link: " + (error.message || "Silakan coba lagi."));
//         } finally {
//             this.setResendLoading(false);
//         }
//     },

//     async handleRegularResendLink() {
//         const emailInput = document.querySelector("#resend-email-input");

//         if (!emailInput) {
//             this.showResendError("Input email tidak ditemukan.");
//             return;
//         }

//         const email = emailInput.value.trim();

//         if (!email) {
//             this.showResendError("Silakan masukkan email teacher Anda.");
//             return;
//         }

//         if (!this.isValidEmail(email)) {
//             this.showResendError("Format email tidak valid.");
//             return;
//         }

//         this.setRegularResendLoading(true);

//         try {
//             console.log('📤 Regular resending teacher setup link for:', email);

//             const response = await API.postResendTeacherSetupLink({ email });

//             if (response.error) {
//                 this.showResendError(response.error);
//             } else {
//                 this.showResendSuccess("Link setup password baru telah dikirim ke email Anda! Silakan periksa inbox dan gunakan link terbaru.");

//                 // Clear email input after successful resend
//                 emailInput.value = '';
//             }
//         } catch (error) {
//             console.error("❌ Regular resend setup link error:", error);
//             this.showResendError("Terjadi kesalahan saat mengirim link: " + (error.message || "Silakan coba lagi."));
//         } finally {
//             this.setRegularResendLoading(false);
//         }
//     },

//     setRegularResendLoading(isLoading) {
//         const resendLinkBtn = document.querySelector("#resend-link-btn");
//         const resendLinkText = document.querySelector("#resend-link-text");
//         const resendLinkLoading = document.querySelector("#resend-link-loading");
//         const emailInput = document.querySelector("#resend-email-input");

//         if (!resendLinkBtn || !resendLinkText || !resendLinkLoading) return;

//         if (isLoading) {
//             resendLinkBtn.disabled = true;
//             if (emailInput) emailInput.disabled = true;
//             resendLinkText.classList.add("hidden");
//             resendLinkLoading.classList.remove("hidden");
//         } else {
//             resendLinkBtn.disabled = false;
//             if (emailInput) emailInput.disabled = false;
//             resendLinkText.classList.remove("hidden");
//             resendLinkLoading.classList.add("hidden");
//         }
//     },

//     showResendError(message) {
//         const resendError = document.querySelector("#resend-error");
//         const resendSuccess = document.querySelector("#resend-success");
//         const resendErrorText = document.querySelector("#resend-error-text");

//         if (resendErrorText) {
//             resendErrorText.textContent = message;
//         }

//         if (resendError) {
//             resendError.classList.remove("hidden");
//         }

//         if (resendSuccess) {
//             resendSuccess.classList.add("hidden");
//         }
//     },

//     showResendSuccess(message) {
//         const resendError = document.querySelector("#resend-error");
//         const resendSuccess = document.querySelector("#resend-success");
//         const resendSuccessText = document.querySelector("#resend-success-text");

//         if (resendSuccessText) {
//             resendSuccessText.textContent = message;
//         }

//         if (resendSuccess) {
//             resendSuccess.classList.remove("hidden");
//         }

//         if (resendError) {
//             resendError.classList.add("hidden");
//         }
//     },

//     isValidEmail(email) {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return emailRegex.test(email);
//     },

//     setLoading(isLoading) {
//         const submitBtn = document.querySelector("#submit-btn");
//         const btnText = document.querySelector("#btn-text");
//         const btnLoading = document.querySelector("#btn-loading");

//         if (!submitBtn || !btnText || !btnLoading) return;

//         if (isLoading) {
//             submitBtn.disabled = true;
//             btnText.classList.add("hidden");
//             btnLoading.classList.remove("hidden");
//         } else {
//             submitBtn.disabled = false;
//             btnText.classList.remove("hidden");
//             btnLoading.classList.add("hidden");
//         }
//     },

//     setResendLoading(isLoading) {
//         const resendBtn = document.querySelector("#resend-setup-link-btn");
//         const resendBtnText = document.querySelector("#resend-btn-text");
//         const resendBtnLoading = document.querySelector("#resend-btn-loading");
//         const emailInput = document.querySelector("#resend-email");

//         if (!resendBtn || !resendBtnText || !resendBtnLoading) return;

//         if (isLoading) {
//             resendBtn.disabled = true;
//             if (emailInput) emailInput.disabled = true;
//             resendBtnText.classList.add("hidden");
//             resendBtnLoading.classList.remove("hidden");
//         } else {
//             resendBtn.disabled = false;
//             if (emailInput) emailInput.disabled = false;
//             resendBtnText.classList.remove("hidden");
//             resendBtnLoading.classList.add("hidden");
//         }
//     },

//     showTokenExpiredSection() {
//         const tokenExpiredSection = document.querySelector("#token-expired-section");
//         const errorDiv = document.querySelector("#error-message");
//         const successDiv = document.querySelector("#success-message");
//         const submitBtn = document.querySelector("#submit-btn");

//         // Hide other messages
//         if (errorDiv) {
//             errorDiv.classList.add("hidden");
//         }

//         if (successDiv) {
//             successDiv.classList.add("hidden");
//         }

//         // Show token expired section
//         if (tokenExpiredSection) {
//             tokenExpiredSection.classList.remove("hidden");
//         }

//         // Disable main submit button
//         if (submitBtn) {
//             submitBtn.disabled = true;
//             submitBtn.classList.add("opacity-50", "cursor-not-allowed");
//         }

//         console.log('⚠️ Token expired section shown');
//     },

//     showError(message) {
//         const errorDiv = document.querySelector("#error-message");
//         const successDiv = document.querySelector("#success-message");
//         const tokenExpiredSection = document.querySelector("#token-expired-section");
//         const errorText = document.querySelector("#error-text");

//         if (errorText) {
//             errorText.textContent = message;
//         }

//         if (errorDiv) {
//             errorDiv.classList.remove("hidden");
//         }

//         if (successDiv) {
//             successDiv.classList.add("hidden");
//         }

//         // Hide token expired section when showing regular error
//         if (tokenExpiredSection) {
//             tokenExpiredSection.classList.add("hidden");
//         }
//     },

//     showSuccess(message) {
//         const errorDiv = document.querySelector("#error-message");
//         const successDiv = document.querySelector("#success-message");
//         const tokenExpiredSection = document.querySelector("#token-expired-section");
//         const successText = document.querySelector("#success-text");

//         if (successText) {
//             successText.textContent = message;
//         }

//         if (successDiv) {
//             successDiv.classList.remove("hidden");
//         }

//         if (errorDiv) {
//             errorDiv.classList.add("hidden");
//         }

//         // Hide token expired section when showing success
//         if (tokenExpiredSection) {
//             tokenExpiredSection.classList.add("hidden");
//         }
//     }
// };

// export default SetupTeacherPasswordPage;
// File: pages/auth/setup-teacher-password/page.js
import API from "../../../data/api.js";
import { PasswordValidation } from "../../../utils/password-validation.js";

const SetupTeacherPasswordPage = {
  token: null, // Store token globally in this object

  async render() {
    return `
      <section class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-6 transition-colors duration-300">
        <div class="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg dark:shadow-gray-900/30 w-full max-w-md transition-colors duration-300">
          <!-- Theme Toggle Button -->
          <div class="absolute top-4 right-4 sm:top-6 sm:right-6">
            <button
              id="theme-toggle"
              class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
              aria-label="Toggle theme"
            >
              <svg id="sun-icon" class="w-5 h-5 hidden dark:block" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
              </svg>
              <svg id="moon-icon" class="w-5 h-5 block dark:hidden" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
              </svg>
            </button>
          </div>

          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
              <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h2 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">Setup Password Teacher</h2>
            <p class="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">Buat password yang kuat untuk akun teacher Anda</p>
          </div>

          <form id="setup-password-form" class="space-y-4">
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                Password Baru
              </label>
              <div class="relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  minlength="8"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
                  placeholder="Masukkan password baru"
                />
                <button
                  type="button"
                  id="toggle-password"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                >
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
              
              <!-- Password Strength Indicator using Global System -->
              <div id="password-strength-container" class="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors duration-300 hidden">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Kekuatan Password:</span>
                  <span id="strength-text" class="text-xs font-bold text-gray-500 dark:text-gray-400">Belum diisi</span>
                </div>
                <div class="mb-3">
                  <div class="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden transition-colors duration-300">
                    <div id="strength-bar" class="h-full transition-all duration-300 rounded-full w-0"></div>
                  </div>
                </div>
                
                <!-- Password Requirements using Global System -->
                <div id="password-requirements" class="space-y-1.5 text-xs">
                  ${PasswordValidation.generateRequirementsHTML('setup-')}
                </div>
              </div>
            </div>

            <div>
              <label for="confirm-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                Konfirmasi Password
              </label>
              <div class="relative">
                <input
                  type="password"
                  id="confirm-password"
                  name="confirm-password"
                  required
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
                  placeholder="Konfirmasi password baru"
                />
                <button
                  type="button"
                  id="toggle-confirm-password"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                >
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
              
              <!-- Password Match Indicator using Global System -->
              <div id="password-match-indicator" class="mt-2 text-xs hidden">
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 rounded-full" id="match-indicator"></div>
                  <span id="match-text" class="font-medium"></span>
                </div>
              </div>
            </div>

            <!-- Submit Button with better spacing -->
            <div class="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                id="submit-btn"
                class="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled
              >
                <span id="btn-text">Setup Password</span>
                <div id="btn-loading" class="hidden">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </div>
              </button>
            </div>

            <!-- Messages -->
            <div id="error-message" class="hidden bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm transition-colors duration-300">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
                <span id="error-text" class="break-words"></span>
              </div>
            </div>

            <div id="success-message" class="hidden bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg text-sm transition-colors duration-300">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span id="success-text" class="break-words"></span>
              </div>
            </div>

            <!-- Token Expired Section -->
            <div id="token-expired-section" class="hidden">
              <div class="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-4 transition-colors duration-300">
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-orange-600 dark:text-orange-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  </svg>
                  <div class="flex-1">
                    <p class="font-medium text-orange-800 dark:text-orange-200 mb-1 transition-colors duration-300">Link Setup Password Kadaluarsa</p>
                    <p class="text-sm text-orange-700 dark:text-orange-300 mb-3 transition-colors duration-300">
                      Token setup password Anda sudah kadaluarsa. Silakan minta link baru untuk melanjutkan setup password.
                    </p>
                    
                    <!-- Email Input for Resend -->
                    <div class="mb-3">
                      <label for="resend-email" class="block text-xs font-medium text-orange-800 dark:text-orange-200 mb-1 transition-colors duration-300">
                        Email Teacher Anda:
                      </label>
                      <input
                        type="email"
                        id="resend-email"
                        placeholder="Masukkan email teacher"
                        class="w-full px-3 py-2 text-sm border border-orange-300 dark:border-orange-600 rounded-md bg-white dark:bg-orange-900/20 text-gray-900 dark:text-orange-100 placeholder-orange-500 dark:placeholder-orange-400 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-200"
                      />
                    </div>
                    
                    <!-- Resend Button -->
                    <button
                      type="button"
                      id="resend-setup-link-btn"
                      class="w-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span id="resend-btn-text">Kirim Ulang Link Setup</span>
                      <div id="resend-btn-loading" class="hidden">
                        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Mengirim...
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>

          <div class="mt-6 text-center space-y-3">
            <!-- Resend Link Section -->
            <div class="border-t border-gray-200 dark:border-gray-700 pt-4 transition-colors duration-300">
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 transition-colors duration-300">
                Tidak menerima email atau link sudah kadaluarsa?
              </p>
              
              <div id="resend-section" class="space-y-3">
                <div>
                  <input
                    type="email"
                    id="resend-email-input"
                    placeholder="Masukkan email teacher Anda"
                    class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
                  />
                </div>
                
                <button
                  type="button"
                  id="resend-link-btn"
                  class="w-full bg-gray-600 hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span id="resend-link-text">Kirim Ulang Link Setup</span>
                  <div id="resend-link-loading" class="hidden">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mengirim...
                  </div>
                </button>
                
                <!-- Resend Messages -->
                <div id="resend-error" class="hidden bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-3 py-2 rounded text-sm transition-colors duration-300">
                  <span id="resend-error-text" class="break-words"></span>
                </div>
                
                <div id="resend-success" class="hidden bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-3 py-2 rounded text-sm transition-colors duration-300">
                  <span id="resend-success-text" class="break-words"></span>
                </div>
              </div>
            </div>

            <p class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
              Butuh bantuan? 
              <a href="mailto:cs@edura.web.id" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors duration-200">
                Hubungi Support
              </a>
            </p>
          </div>
        </div>
      </section>
    `;
  },

  async afterRender() {
    this.initializeTheme();

    // Multiple ways to get token from URL
    let token = null;

    try {
      // Method 1: From hash after #
      const hashPart = window.location.hash.substring(1); // Remove #
      if (hashPart.includes('?')) {
        const queryString = hashPart.split('?')[1];
        const hashParams = new URLSearchParams(queryString);
        token = hashParams.get('token');
      }

      // Method 2: From main URL query parameters (fallback)
      if (!token) {
        const urlParams = new URLSearchParams(window.location.search);
        token = urlParams.get('token');
      }

      // Method 3: Manual parsing from full URL (fallback)
      if (!token) {
        const fullUrl = window.location.href;
        const tokenMatch = fullUrl.match(/[?&]token=([^&]+)/);
        if (tokenMatch) {
          token = tokenMatch[1];
        }
      }

      console.log('🔍 Token detection:', {
        fullUrl: window.location.href,
        hash: window.location.hash,
        search: window.location.search,
        detectedToken: token ? '***' + token.slice(-8) : 'null'
      });

    } catch (error) {
      console.error('❌ Error parsing token from URL:', error);
    }

    if (!token) {
      this.showError("Token tidak valid atau tidak ditemukan. Pastikan Anda mengakses halaman ini melalui link yang diberikan melalui email.");
      return;
    }

    // Store token for later use
    this.token = token;

    this.initializeEventListeners();
    this.setupGlobalPasswordValidation();
  },

  setupGlobalPasswordValidation() {
    // Setup password validation using global system
    PasswordValidation.setupPasswordValidation({
      passwordInput: "#password",
      confirmPasswordInput: "#confirm-password",
      strengthSelectors: {
        strengthBar: "#strength-bar",
        strengthText: "#strength-text",
        requirements: {
          length: "#setup-length-req",
          uppercase: "#setup-uppercase-req",
          lowercase: "#setup-lowercase-req",
          number: "#setup-number-req",
          special: "#setup-special-req"
        }
      },
      matchSelectors: {
        indicator: "#password-match-indicator",
        matchIndicator: "#match-indicator",
        matchText: "#match-text",
        confirmInput: "#confirm-password"
      },
      onValidationChange: (validation) => {
        this.updatePasswordStrengthContainer(validation.password);
        this.updateSubmitButton(validation);
      }
    });
  },

  updatePasswordStrengthContainer(passwordValidation) {
    const strengthContainer = document.querySelector("#password-strength-container");
    const passwordInput = document.querySelector("#password");

    if (passwordInput.value.length > 0) {
      strengthContainer.classList.remove("hidden");
    } else {
      strengthContainer.classList.add("hidden");
    }
  },

  updateSubmitButton(validation) {
    const submitBtn = document.querySelector("#submit-btn");
    const password = document.querySelector("#password").value;
    const confirmPassword = document.querySelector("#confirm-password").value;

    // Check if all requirements are met using global validation
    const isPasswordValid = validation.password.isValid;
    const isMatchValid = validation.match.isValid;
    const hasPasswords = password.length > 0 && confirmPassword.length > 0;

    if (isPasswordValid && isMatchValid && hasPasswords) {
      submitBtn.disabled = false;
      submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      submitBtn.classList.add('hover:scale-[1.02]');
    } else {
      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
      submitBtn.classList.remove('hover:scale-[1.02]');
    }
  },

  initializeTheme() {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    });

    // Theme toggle button functionality
    const themeToggle = document.querySelector("#theme-toggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        this.toggleTheme();
      });
    }
  },

  toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');

    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  },

  initializeEventListeners() {
    const form = document.querySelector("#setup-password-form");
    const togglePassword = document.querySelector("#toggle-password");
    const toggleConfirmPassword = document.querySelector("#toggle-confirm-password");
    const resendBtn = document.querySelector("#resend-setup-link-btn");
    const resendLinkBtn = document.querySelector("#resend-link-btn");

    // Toggle password visibility
    if (togglePassword) {
      togglePassword.addEventListener("click", () => {
        this.togglePasswordVisibility(document.querySelector("#password"), togglePassword);
      });
    }

    if (toggleConfirmPassword) {
      toggleConfirmPassword.addEventListener("click", () => {
        this.togglePasswordVisibility(document.querySelector("#confirm-password"), toggleConfirmPassword);
      });
    }

    // Form submission
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        await this.handleSubmit();
      });
    }

    // Resend setup link button (from token expired section)
    if (resendBtn) {
      resendBtn.addEventListener("click", async () => {
        await this.handleResendSetupLink();
      });
    }

    // Regular resend link button
    if (resendLinkBtn) {
      resendLinkBtn.addEventListener("click", async () => {
        await this.handleRegularResendLink();
      });
    }
  },

  togglePasswordVisibility(input, button) {
    if (!input || !button) return;

    const type = input.getAttribute("type") === "password" ? "text" : "password";
    input.setAttribute("type", type);

    const icon = button.querySelector("svg");
    if (icon) {
      if (type === "text") {
        icon.innerHTML = `
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
        `;
      } else {
        icon.innerHTML = `
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        `;
      }
    }
  },

  async handleSubmit() {
    // Use stored token from afterRender
    const token = this.token;
    const passwordInput = document.querySelector("#password");
    const confirmPasswordInput = document.querySelector("#confirm-password");

    if (!passwordInput || !confirmPasswordInput) {
      this.showError("Form tidak ditemukan. Silakan muat ulang halaman.");
      return;
    }

    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!token) {
      this.showError("Token tidak ditemukan. Silakan muat ulang halaman atau gunakan link baru dari email.");
      return;
    }

    // Use global validation system for validation
    const passwordValidation = PasswordValidation.validatePassword(password);
    const matchValidation = PasswordValidation.validatePasswordMatch(password, confirmPassword);

    if (!passwordValidation.isValid) {
      this.showError(`Password tidak memenuhi persyaratan: ${passwordValidation.missingRequirements.join(', ')}`);
      return;
    }

    if (!matchValidation.isMatch) {
      this.showError("Password dan konfirmasi password tidak cocok");
      return;
    }

    this.setLoading(true);

    try {
      console.log('📤 Submitting teacher password setup with token:', token ? '***' + token.slice(-8) : 'undefined');

      const response = await API.postSetupTeacherPassword({
        token,
        password
      });

      if (response.error) {
        // Check if error is related to token expiry
        if (response.error.includes('kadaluarsa') || response.error.includes('expired') || response.error.includes('Token sudah kadaluarsa')) {
          this.showTokenExpiredSection();
        } else {
          this.showError(response.error);
        }
      } else {
        this.showSuccess("Password berhasil diatur! Anda akan diarahkan ke dashboard...");

        // Store authentication data
        if (response.token) {
          localStorage.setItem("token", response.token);
          localStorage.setItem("userRole", response.user.role);
          localStorage.setItem("userId", response.user.id);

          console.log('✅ Auth data stored:', {
            token: !!response.token,
            role: response.user.role,
            userId: response.user.id
          });
        }

        // Redirect after 2 seconds
        setTimeout(() => {
          window.location.hash = "#/dashboard";
        }, 2000);
      }
    } catch (error) {
      console.error("❌ Setup password error:", error);

      // Check if error message indicates token expiry
      const errorMessage = error.message || "";
      if (errorMessage.includes('kadaluarsa') || errorMessage.includes('expired') || errorMessage.includes('Token sudah kadaluarsa')) {
        this.showTokenExpiredSection();
      } else {
        this.showError("Terjadi kesalahan: " + errorMessage || "Silakan coba lagi.");
      }
    } finally {
      this.setLoading(false);
    }
  },

  async handleResendSetupLink() {
    const emailInput = document.querySelector("#resend-email");

    if (!emailInput) {
      this.showError("Input email tidak ditemukan.");
      return;
    }

    const email = emailInput.value.trim();

    if (!email) {
      this.showError("Silakan masukkan email teacher Anda.");
      return;
    }

    if (!this.isValidEmail(email)) {
      this.showError("Format email tidak valid.");
      return;
    }

    this.setResendLoading(true);

    try {
      console.log('📤 Resending teacher setup link for:', email);

      const response = await API.postResendTeacherSetupLink({ email });

      if (response.error) {
        this.showError(response.error);
      } else {
        this.showSuccess("Link setup password baru telah dikirim ke email Anda! Silakan periksa inbox dan gunakan link terbaru.");

        // Hide token expired section after successful resend
        const tokenExpiredSection = document.querySelector("#token-expired-section");
        if (tokenExpiredSection) {
          tokenExpiredSection.classList.add("hidden");
        }

        // Clear email input
        emailInput.value = '';
      }
    } catch (error) {
      console.error("❌ Resend setup link error:", error);
      this.showError("Terjadi kesalahan saat mengirim link: " + (error.message || "Silakan coba lagi."));
    } finally {
      this.setResendLoading(false);
    }
  },

  async handleRegularResendLink() {
    const emailInput = document.querySelector("#resend-email-input");

    if (!emailInput) {
      this.showResendError("Input email tidak ditemukan.");
      return;
    }

    const email = emailInput.value.trim();

    if (!email) {
      this.showResendError("Silakan masukkan email teacher Anda.");
      return;
    }

    if (!this.isValidEmail(email)) {
      this.showResendError("Format email tidak valid.");
      return;
    }

    this.setRegularResendLoading(true);

    try {
      console.log('📤 Regular resending teacher setup link for:', email);

      const response = await API.postResendTeacherSetupLink({ email });

      if (response.error) {
        this.showResendError(response.error);
      } else {
        this.showResendSuccess("Link setup password baru telah dikirim ke email Anda! Silakan periksa inbox dan gunakan link terbaru.");

        // Clear email input after successful resend
        emailInput.value = '';
      }
    } catch (error) {
      console.error("❌ Regular resend setup link error:", error);
      this.showResendError("Terjadi kesalahan saat mengirim link: " + (error.message || "Silakan coba lagi."));
    } finally {
      this.setRegularResendLoading(false);
    }
  },

  setRegularResendLoading(isLoading) {
    const resendLinkBtn = document.querySelector("#resend-link-btn");
    const resendLinkText = document.querySelector("#resend-link-text");
    const resendLinkLoading = document.querySelector("#resend-link-loading");
    const emailInput = document.querySelector("#resend-email-input");

    if (!resendLinkBtn || !resendLinkText || !resendLinkLoading) return;

    if (isLoading) {
      resendLinkBtn.disabled = true;
      if (emailInput) emailInput.disabled = true;
      resendLinkText.classList.add("hidden");
      resendLinkLoading.classList.remove("hidden");
    } else {
      resendLinkBtn.disabled = false;
      if (emailInput) emailInput.disabled = false;
      resendLinkText.classList.remove("hidden");
      resendLinkLoading.classList.add("hidden");
    }
  },

  showResendError(message) {
    const resendError = document.querySelector("#resend-error");
    const resendSuccess = document.querySelector("#resend-success");
    const resendErrorText = document.querySelector("#resend-error-text");

    if (resendErrorText) {
      resendErrorText.textContent = message;
    }

    if (resendError) {
      resendError.classList.remove("hidden");
    }

    if (resendSuccess) {
      resendSuccess.classList.add("hidden");
    }
  },

  showResendSuccess(message) {
    const resendError = document.querySelector("#resend-error");
    const resendSuccess = document.querySelector("#resend-success");
    const resendSuccessText = document.querySelector("#resend-success-text");

    if (resendSuccessText) {
      resendSuccessText.textContent = message;
    }

    if (resendSuccess) {
      resendSuccess.classList.remove("hidden");
    }

    if (resendError) {
      resendError.classList.add("hidden");
    }
  },

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  setLoading(isLoading) {
    const submitBtn = document.querySelector("#submit-btn");
    const btnText = document.querySelector("#btn-text");
    const btnLoading = document.querySelector("#btn-loading");

    if (!submitBtn || !btnText || !btnLoading) return;

    if (isLoading) {
      submitBtn.disabled = true;
      btnText.classList.add("hidden");
      btnLoading.classList.remove("hidden");
    } else {
      submitBtn.disabled = false;
      btnText.classList.remove("hidden");
      btnLoading.classList.add("hidden");
    }
  },

  setResendLoading(isLoading) {
    const resendBtn = document.querySelector("#resend-setup-link-btn");
    const resendBtnText = document.querySelector("#resend-btn-text");
    const resendBtnLoading = document.querySelector("#resend-btn-loading");
    const emailInput = document.querySelector("#resend-email");

    if (!resendBtn || !resendBtnText || !resendBtnLoading) return;

    if (isLoading) {
      resendBtn.disabled = true;
      if (emailInput) emailInput.disabled = true;
      resendBtnText.classList.add("hidden");
      resendBtnLoading.classList.remove("hidden");
    } else {
      resendBtn.disabled = false;
      if (emailInput) emailInput.disabled = false;
      resendBtnText.classList.remove("hidden");
      resendBtnLoading.classList.add("hidden");
    }
  },

  showTokenExpiredSection() {
    const tokenExpiredSection = document.querySelector("#token-expired-section");
    const errorDiv = document.querySelector("#error-message");
    const successDiv = document.querySelector("#success-message");
    const submitBtn = document.querySelector("#submit-btn");

    // Hide other messages
    if (errorDiv) {
      errorDiv.classList.add("hidden");
    }

    if (successDiv) {
      successDiv.classList.add("hidden");
    }

    // Show token expired section
    if (tokenExpiredSection) {
      tokenExpiredSection.classList.remove("hidden");
    }

    // Disable main submit button
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add("opacity-50", "cursor-not-allowed");
    }

    console.log('⚠️ Token expired section shown');
  },

  showError(message) {
    const errorDiv = document.querySelector("#error-message");
    const successDiv = document.querySelector("#success-message");
    const tokenExpiredSection = document.querySelector("#token-expired-section");
    const errorText = document.querySelector("#error-text");

    if (errorText) {
      errorText.textContent = message;
    }

    if (errorDiv) {
      errorDiv.classList.remove("hidden");
    }

    if (successDiv) {
      successDiv.classList.add("hidden");
    }

    // Hide token expired section when showing regular error
    if (tokenExpiredSection) {
      tokenExpiredSection.classList.add("hidden");
    }
  },

  showSuccess(message) {
    const errorDiv = document.querySelector("#error-message");
    const successDiv = document.querySelector("#success-message");
    const tokenExpiredSection = document.querySelector("#token-expired-section");
    const successText = document.querySelector("#success-text");

    if (successText) {
      successText.textContent = message;
    }

    if (successDiv) {
      successDiv.classList.remove("hidden");
    }

    if (errorDiv) {
      errorDiv.classList.add("hidden");
    }

    // Hide token expired section when showing success
    if (tokenExpiredSection) {
      tokenExpiredSection.classList.add("hidden");
    }
  }
};

export default SetupTeacherPasswordPage;