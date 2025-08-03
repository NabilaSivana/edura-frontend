// pages/dashboard/profile/profile-view.js - Fixed Password Visibility Toggle

import { PasswordValidation } from '../../../utils/password-validation.js';

class ProfileView {
    constructor(presenter) {
        this.presenter = presenter;
    }

    renderPage() {
        return `
            <div class="h-screen w-screen flex flex-col">
                <!-- Loading Screen Overlay -->
                <div id="profile-loading-overlay" class="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center">
                    <div class="text-center">
                        <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                        <p class="text-gray-600 dark:text-gray-300 text-lg">Memuat Profile...</p>
                        <p class="text-gray-500 dark:text-gray-400 text-sm mt-2">Mohon tunggu sebentar</p>
                    </div>
                </div>

                <!-- Navbar -->
                <div id="navbar-container" class="shrink-0 z-50"></div>
                
                <!-- Layout: Sidebar + Content -->
                <div class="flex flex-1 overflow-hidden">
                    <!-- Sidebar -->
                    <div id="sidebar-wrapper"></div>
                    
                    <!-- Main Content -->
                    <main class="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white mt-16">
                        <!-- Header -->
                        <div class="mb-8">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
                                    <p class="text-gray-600 dark:text-gray-400 mt-2">Manage your account information and preferences</p>
                                </div>
                                <button id="refresh-profile" class="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-800 transition-colors">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                    </svg>
                                    Refresh
                                </button>
                            </div>
                        </div>

                        <!-- Profile Content -->
                        <div id="profile-content">
                            ${this.renderLoadingContent()}
                        </div>
                    </main>
                </div>
            </div>
        `;
    }

    renderLoadingContent() {
        return `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Basic Profile Skeleton -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                    <div class="animate-pulse">
                        <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                        <div class="space-y-4">
                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                    </div>
                </div>

                <!-- Role Profile Skeleton -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                    <div class="animate-pulse">
                        <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                        <div class="space-y-4">
                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderProfileContent(basicProfile, roleProfile, userRole) {
        return `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Basic Profile -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                    ${this.renderBasicProfile(basicProfile)}
                </div>

                <!-- Role Profile -->
                ${userRole !== 'admin' ? `
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                        ${this.renderRoleProfile(roleProfile, userRole)}
                    </div>
                ` : `
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                        <div class="text-center py-12">
                            <div class="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg class="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Admin Account</h3>
                            <p class="text-gray-500 dark:text-gray-400">As an admin, your basic profile contains all necessary information.</p>
                        </div>
                    </div>
                `}
            </div>
        `;
    }

    renderBasicProfile(profile) {
        console.log('🎨 Rendering basic profile with data:', profile);

        return `
            <div class="p-6">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Basic Profile</h2>
                    <button id="edit-basic-profile" class="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-800 rounded-lg transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        Edit
                    </button>
                </div>

                <div id="basic-profile-view" class="space-y-4">
                    <div class="flex items-center space-x-4 mb-6">
                        <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span class="text-white text-xl font-bold">
                                ${profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : '?'}
                            </span>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${profile?.full_name || 'Not set'}</h3>
                            <p class="text-gray-500 dark:text-gray-400 capitalize">${profile?.role || 'Unknown'}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Username</label>
                            <p class="text-gray-900 dark:text-white">${profile?.full_name || 'Not set'}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Email</label>
                            <p class="text-gray-900 dark:text-white">${profile?.email || 'Not set'}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Account Status</label>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${profile?.is_verified
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            }">
                                ${profile?.is_verified ? 'Verified' : 'Unverified'}
                            </span>
                        </div>
                    </div>
                </div>

                <div id="basic-profile-form" class="hidden">
                    ${this.renderBasicProfileForm(profile)}
                </div>
            </div>
        `;
    }

    renderBasicProfileForm(profile) {
        return `
            <form id="basic-profile-form-element" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Username</label>
                    <input 
                        type="text" 
                        name="full_name" 
                        value="${profile?.full_name || ''}"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Enter your full name"
                    >
                    <div class="error-message text-red-500 text-sm mt-1 hidden"></div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                    <input 
                        type="email" 
                        name="email" 
                        value="${profile?.email || ''}"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Enter your email"
                    >
                    <div class="error-message text-red-500 text-sm mt-1 hidden"></div>
                </div>

                <div class="border-t pt-4">
                    <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Change Password (Optional)</h4>
                    
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                            <div class="relative">
                                <input
                                    type="password"
                                    name="old_password"
                                    id="old-password-input"
                                    class="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter current password"
                                >
                                <button type="button" id="toggle-old-password" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <svg class="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                </button>
                            </div>
                            <div class="error-message text-red-500 text-sm mt-1 hidden"></div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                            <div class="relative">
                                <input 
                                    type="password" 
                                    name="new_password"
                                    id="new-password-input"
                                    class="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter new password"
                                >
                                <button type="button" id="toggle-new-password" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <svg class="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                </button>
                            </div>
                            <div class="error-message text-red-500 text-sm mt-1 hidden"></div>
                            
                            <!-- Enhanced Password Strength Indicator -->
                            <div id="password-strength-container" class="mt-3 hidden">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Password Strength:</span>
                                    <span id="password-strength-text" class="text-xs font-bold text-gray-500">Not Set</span>
                                </div>
                                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                    <div id="password-strength-bar" class="h-full transition-all duration-300 rounded-full" style="width: 0%"></div>
                                </div>
                            </div>

                            <!-- Password Requirements List -->
                            <div id="password-requirements" class="mt-3 hidden">
                                <p class="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Password Requirements:</p>
                                <div class="space-y-1">
                                    <div class="requirement flex items-center text-xs" id="length-req">
                                        <div class="w-3 h-3 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center mr-2">
                                            <svg class="w-2 h-2 text-green-500 hidden" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                                            </svg>
                                        </div>
                                        <span class="text-gray-600 dark:text-gray-400">Minimal 8 karakter</span>
                                    </div>
                                    <div class="requirement flex items-center text-xs" id="uppercase-req">
                                        <div class="w-3 h-3 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center mr-2">
                                            <svg class="w-2 h-2 text-green-500 hidden" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                                            </svg>
                                        </div>
                                        <span class="text-gray-600 dark:text-gray-400">Mengandung huruf besar</span>
                                    </div>
                                    <div class="requirement flex items-center text-xs" id="lowercase-req">
                                        <div class="w-3 h-3 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center mr-2">
                                            <svg class="w-2 h-2 text-green-500 hidden" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                                            </svg>
                                        </div>
                                        <span class="text-gray-600 dark:text-gray-400">Mengandung huruf kecil</span>
                                    </div>
                                    <div class="requirement flex items-center text-xs" id="number-req">
                                        <div class="w-3 h-3 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center mr-2">
                                            <svg class="w-2 h-2 text-green-500 hidden" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                                            </svg>
                                        </div>
                                        <span class="text-gray-600 dark:text-gray-400">Mengandung angka</span>
                                    </div>
                                    <div class="requirement flex items-center text-xs" id="special-req">
                                        <div class="w-3 h-3 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center mr-2">
                                            <svg class="w-2 h-2 text-green-500 hidden" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                                            </svg>
                                        </div>
                                        <span class="text-gray-600 dark:text-gray-400">Mengandung karakter khusus (!@#$%^&*)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Confirm New Password -->
                        <div id="confirm-password-container" class="hidden">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
                            <div class="relative">
                                <input 
                                    type="password" 
                                    name="confirm_password"
                                    id="confirm-password-input"
                                    class="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    placeholder="Confirm your new password"
                                >
                                <button type="button" id="toggle-confirm-password" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <svg class="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                </button>
                            </div>
                            
                            <!-- Password Match Indicator -->
                            <div id="password-match-indicator" class="mt-2 flex items-center hidden">
                                <div id="password-match-circle" class="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                                <span id="password-match-text" class="text-xs text-gray-600 dark:text-gray-400">Enter password confirmation</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end space-x-3 pt-4">
                    <button 
                        type="button" 
                        id="cancel-basic-edit"
                        class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        id="save-basic-profile"
                        class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        disabled
                    >
                        <span class="loading-spinner hidden">
                            <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                        </span>
                        <span class="button-text">Save Changes</span>
                    </button>
                </div>
            </form>
        `;
    }

    // Setup password validation after form is rendered - FIXED VERSION
    setupPasswordValidation() {
        console.log('🔐 Setting up password validation...');

        // Wait for DOM to be ready
        setTimeout(() => {
            // ✅ FIXED: Correct method name for all password toggles
            this.setupPasswordToggle('#toggle-old-password', '#old-password-input');
            this.setupPasswordToggle('#toggle-new-password', '#new-password-input');
            this.setupPasswordToggle('#toggle-confirm-password', '#confirm-password-input');

            // Setup validation using PasswordValidation utility
            PasswordValidation.setupPasswordValidation({
                passwordInput: '#new-password-input',
                confirmPasswordInput: '#confirm-password-input',
                strengthSelectors: {
                    strengthBar: '#password-strength-bar',
                    strengthText: '#password-strength-text',
                    requirements: {
                        length: '#length-req',
                        uppercase: '#uppercase-req',
                        lowercase: '#lowercase-req',
                        number: '#number-req',
                        special: '#special-req'
                    }
                },
                matchSelectors: {
                    indicator: '#password-match-indicator',
                    matchIndicator: '#password-match-circle',
                    matchText: '#password-match-text',
                    confirmInput: '#confirm-password-input'
                },
                onValidationChange: (validation) => {
                    this.updatePasswordValidationState(validation);
                }
            });

            // Show/hide additional elements based on password input
            const newPasswordInput = document.getElementById('new-password-input');
            const passwordStrengthContainer = document.getElementById('password-strength-container');
            const passwordRequirements = document.getElementById('password-requirements');
            const confirmPasswordContainer = document.getElementById('confirm-password-container');

            if (newPasswordInput) {
                newPasswordInput.addEventListener('input', (e) => {
                    const hasPassword = e.target.value.length > 0;

                    if (hasPassword) {
                        passwordStrengthContainer?.classList.remove('hidden');
                        passwordRequirements?.classList.remove('hidden');
                        confirmPasswordContainer?.classList.remove('hidden');
                    } else {
                        passwordStrengthContainer?.classList.add('hidden');
                        passwordRequirements?.classList.add('hidden');
                        confirmPasswordContainer?.classList.add('hidden');

                        // Clear confirm password
                        const confirmInput = document.getElementById('confirm-password-input');
                        if (confirmInput) confirmInput.value = '';
                    }
                });
            }

            console.log('✅ Password validation setup complete');
        }, 50); // Small delay to ensure DOM is ready
    }

    // ✅ FIXED: Enhanced password toggle with better error handling and logging
    setupPasswordToggle(toggleSelector, inputSelector) {
        console.log(`🔐 Setting up password toggle for ${inputSelector}`);
        
        // Use setTimeout to ensure DOM elements exist
        setTimeout(() => {
            const toggleBtn = document.querySelector(toggleSelector);
            const input = document.querySelector(inputSelector);

            if (!toggleBtn || !input) {
                console.warn(`⚠️ Password toggle elements not found: ${toggleSelector} or ${inputSelector}`);
                return;
            }

            console.log(`✅ Found password toggle elements for ${inputSelector}`);

            // Remove any existing event listeners
            const newToggleBtn = toggleBtn.cloneNode(true);
            toggleBtn.parentNode.replaceChild(newToggleBtn, toggleBtn);

            // Add event listener to the new button
            newToggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                console.log(`🔐 Password toggle clicked for ${inputSelector}`);
                
                const isPassword = input.type === 'password';
                input.type = isPassword ? 'text' : 'password';

                console.log(`🔐 Changed input type to: ${input.type}`);

                // Update icon with better SVG
                newToggleBtn.innerHTML = isPassword
                    // Eye with slash (password visible, button to hide)
                    ? `<svg class="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                       </svg>`
                    // Eye open (password hidden, button to show)
                    : `<svg class="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                       </svg>`;
                
                console.log(`✅ Password visibility toggled for ${inputSelector}: ${isPassword ? 'visible' : 'hidden'}`);
            });

            console.log(`✅ Password toggle setup complete for ${inputSelector}`);
        }, 10); // Small delay to ensure DOM is ready
    }

    updatePasswordValidationState(validation) {
        const saveButton = document.getElementById('save-basic-profile');

        if (saveButton) {
            const newPasswordInput = document.getElementById('new-password-input');
            const hasNewPassword = newPasswordInput && newPasswordInput.value.length > 0;

            if (hasNewPassword) {
                // If user is trying to set new password, validate it
                const isValid = validation.password.isValid && validation.match.isValid;
                saveButton.disabled = !isValid;

                if (isValid) {
                    saveButton.classList.remove('opacity-50');
                    saveButton.classList.add('hover:bg-blue-700');
                } else {
                    saveButton.classList.add('opacity-50');
                    saveButton.classList.remove('hover:bg-blue-700');
                }
            } else {
                // No password change, enable save for other fields
                saveButton.disabled = false;
                saveButton.classList.remove('opacity-50');
                saveButton.classList.add('hover:bg-blue-700');
            }
        }
    }

    // Rest of the methods remain the same...
    renderRoleProfile(roleProfile, userRole) {
        if (userRole === 'student') {
            return this.renderStudentProfile(roleProfile);
        } else if (userRole === 'teacher') {
            return this.renderTeacherProfile(roleProfile);
        }
        return '';
    }

    async renderRoleProfileFormAsync(roleProfile, userRole) {
        if (userRole === 'student') {
            return await this.renderStudentProfileForm(roleProfile);
        } else if (userRole === 'teacher') {
            return await this.renderTeacherProfileForm(roleProfile);
        }
        return '';
    }

    renderStudentProfile(profile) {
        return `
            <div class="p-6">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Student Profile</h2>
                    <button id="edit-role-profile" class="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-800 rounded-lg transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        ${profile ? 'Edit' : 'Create'}
                    </button>
                </div>

                <div id="role-profile-view">
                    ${profile ? this.renderStudentProfileView(profile) : this.renderNoProfileMessage('student')}
                </div>

                <div id="role-profile-form" class="hidden">
                    <!-- Form will be loaded dynamically when needed -->
                    <div class="flex items-center justify-center py-8">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span class="ml-2 text-gray-600 dark:text-gray-400">Loading form...</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderStudentProfileView(profile) {
        return `
            <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">NIM</label>
                        <p class="text-gray-900 dark:text-white">${profile.nim || 'Not set'}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Full Name</label>
                        <p class="text-gray-900 dark:text-white">${profile.full_name || 'Not set'}</p>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Jurusan</label>
                    <p class="text-gray-900 dark:text-white">${profile.jurusan || 'Not set'}</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Program Studi</label>
                        <p class="text-gray-900 dark:text-white">${profile.program_studi || 'Not set'}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Perguruan Tinggi</label>
                        <p class="text-gray-900 dark:text-white">${profile.perguruan_tinggi || 'Not set'}</p>
                    </div>
                </div>

                ${profile.kelas ? `
                    <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <div class="flex items-center gap-2 mb-2">
                            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                            </svg>
                            <h4 class="font-medium text-blue-900 dark:text-blue-100">Current Class</h4>
                        </div>
                        <p class="text-blue-800 dark:text-blue-200 font-medium">${profile.kelas}</p>
                        <p class="text-blue-600 dark:text-blue-300 text-sm">Pembimbing: ${profile.teacher}</p>
                        <button id="leave-class-btn" class="mt-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                            Leave Class
                        </button>
                    </div>
                ` : `
                    <div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                        <div class="flex items-center gap-2 mb-2">
                            <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                            </svg>
                            <h4 class="font-medium text-yellow-900 dark:text-yellow-100">No Class</h4>
                        </div>
                        <p class="text-yellow-800 dark:text-yellow-200 text-sm mb-2">You're not currently enrolled in any class</p>
                        <button id="join-class-btn" class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                            Join a Class
                        </button>
                    </div>
                `}

                ${profile.created_at ? `
                    <div class="text-sm text-gray-500 dark:text-gray-400 pt-4 border-t">
                        Profile created: ${profile.created_at}
                        ${profile.updated_at !== profile.created_at ? ` • Last updated: ${profile.updated_at}` : ''}
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderTeacherProfile(profile) {
        return `
            <div class="p-6">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Teacher Profile</h2>
                    <button id="edit-role-profile" class="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-800 rounded-lg transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        ${profile ? 'Edit' : 'Create'}
                    </button>
                </div>

                <div id="role-profile-view">
                    ${profile ? this.renderTeacherProfileView(profile) : this.renderNoProfileMessage('teacher')}
                </div>

                <div id="role-profile-form" class="hidden">
                    <!-- Form will be loaded dynamically when needed -->
                    <div class="flex items-center justify-center py-8">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span class="ml-2 text-gray-600 dark:text-gray-400">Loading form...</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderTeacherProfileView(profile) {
        return `
            <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">NIDN</label>
                        <p class="text-gray-900 dark:text-white">${profile.nidn || 'Not set'}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Full Name</label>
                        <p class="text-gray-900 dark:text-white">${profile.full_name || 'Not set'}</p>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Fakultas</label>
                    <p class="text-gray-900 dark:text-white">${profile.fakultas || 'Not set'}</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Program Studi</label>
                        <p class="text-gray-900 dark:text-white">${profile.program_studi || 'Not set'}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Perguruan Tinggi</label>
                        <p class="text-gray-900 dark:text-white">${profile.perguruan_tinggi || 'Not set'}</p>
                    </div>
                </div>

                ${profile.created_at ? `
                    <div class="text-sm text-gray-500 dark:text-gray-400 pt-4 border-t">
                        Profile created: ${profile.created_at}
                        ${profile.updated_at !== profile.created_at ? ` • Last updated: ${profile.updated_at}` : ''}
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderNoProfileMessage(role) {
        const roleText = role.charAt(0).toUpperCase() + role.slice(1);
        return `
            <div class="text-center py-8">
                <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No ${roleText} Profile</h3>
                <p class="text-gray-500 dark:text-gray-400 mb-4">Create your ${role} profile to get started</p>
                <button id="create-role-profile" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Create ${roleText} Profile
                </button>
            </div>
        `;
    }

    async renderStudentProfileForm(profile) {
        const constants = await this.presenter.model.getConstants();
        return `
            <form id="role-profile-form-element" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">NIM</label>
                        <input 
                            type="text" 
                            name="nim" 
                            value="${profile?.nim || ''}"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="Enter your NIM"
                            required
                        >
                        <div class="error-message text-red-500 text-sm mt-1 hidden"></div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                        <input 
                            type="text" 
                            name="full_name" 
                            value="${profile?.full_name || ''}"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="Enter your full name"
                            required
                        >
                        <div class="error-message text-red-500 text-sm mt-1 hidden"></div>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jurusan</label>
                    <input 
                        type="text" 
                        name="jurusan" 
                        value="${profile?.jurusan || ''}"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Enter your jurusan"
                        required
                    >
                    <div class="error-message text-red-500 text-sm mt-1 hidden"></div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Class Code (Optional)
                        <span class="text-xs text-gray-500 ml-2">Leave empty to manually fill program & institution</span>
                    </label>
                    <div class="relative">
                        <input 
                            type="text" 
                            name="class_code" 
                            id="class-code-input"
                            value=""
                            class="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="Enter class code to join a class"
                        >
                        <!-- Status indicator -->
                        <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                            <!-- Loading spinner -->
                            <div id="class-code-spinner" class="hidden">
                                <svg class="animate-spin h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                </svg>
                            </div>
                            <!-- Success icon -->
                            <div id="class-code-success" class="hidden">
                                <svg class="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <!-- Error icon -->
                            <div id="class-code-error" class="hidden">
                                <svg class="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="error-message text-red-500 text-sm mt-1 hidden"></div>
                    
                    <!-- Class info display -->
                    <div id="class-info-display" class="hidden mt-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <div class="flex items-center gap-2 mb-2">
                            <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <span class="text-sm font-medium text-green-800 dark:text-green-200">Valid Class Code</span>
                        </div>
                        <div class="text-sm text-green-700 dark:text-green-300">
                            <p><strong>Status:</strong> <span id="class-name-display">-</span></p>
                            <p><strong>Program:</strong> <span id="class-program-display">-</span></p>
                            <p><strong>Institution:</strong> <span id="class-institution-display">-</span></p>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4" id="manual-fields">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Program Studi
                            <span id="manual-required-indicator" class="text-red-500">*</span>
                        </label>
                        <select 
                            name="program_studi"
                            id="program-studi-select"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">Select Program Studi</option>
                            ${constants.PROGRAM_STUDI.map(prodi =>
            `<option value="${prodi}" ${profile?.program_studi === prodi ? 'selected' : ''}>${prodi}</option>`
        ).join('')}
                        </select>
                        <div class="error-message text-red-500 text-sm mt-1 hidden"></div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Perguruan Tinggi
                            <span id="manual-required-indicator-2" class="text-red-500">*</span>
                        </label>
                        <select 
                            name="perguruan_tinggi"
                            id="perguruan-tinggi-select"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">Select Perguruan Tinggi</option>
                            ${constants.PERGURUAN_TINGGI.map(pt =>
            `<option value="${pt}" ${profile?.perguruan_tinggi === pt ? 'selected' : ''}>${pt}</option>`
        ).join('')}
                        </select>
                        <div class="error-message text-red-500 text-sm mt-1 hidden"></div>
                    </div>
                </div>

                <!-- Manual fields notice -->
                <div id="manual-fields-notice" class="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div class="flex items-start gap-2">
                        <svg class="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <div>
                            <p class="font-medium text-blue-800 dark:text-blue-200">Manual Entry Mode</p>
                            <p class="text-blue-700 dark:text-blue-300">Since no class code is provided, please manually select your program studi and perguruan tinggi.</p>
                        </div>
                    </div>
                </div>

                <!-- Hidden fields for class data -->
                <input type="hidden" name="validated_class_id" id="validated-class-id" value="">
                <input type="hidden" name="auto_filled" id="auto-filled" value="false">

                <div class="flex justify-end space-x-3 pt-4">
                    <button 
                        type="button" 
                        id="cancel-role-edit"
                        class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        <span class="loading-spinner hidden">
                            <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                        </span>
                        <span class="button-text">${profile ? 'Update' : 'Create'} Profile</span>
                    </button>
                </div>
            </form>
        `;
    }

    async renderTeacherProfileForm(profile) {
        const constants = await this.presenter.model.getConstants();
        return `
            <form id="role-profile-form-element" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">NIDN</label>
                        <input 
                            type="text" 
                            name="nidn" 
                            value="${profile?.nidn || ''}"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="Enter your NIDN"
                            required
                        >
                        <div class="error-message text-red-500 text-sm mt-1 hidden"></div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                        <input 
                            type="text" 
                            name="full_name" 
                            value="${profile?.full_name || ''}"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="Enter your full name"
                            required
                        >
                        <div class="error-message text-red-500 text-sm mt-1 hidden"></div>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fakultas</label>
                    <input 
                        type="text" 
                        name="fakultas" 
                        value="${profile?.fakultas || ''}"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Masukkan fakultas/jurusan Anda"
                        required
                    >
                    <div class="error-message text-red-500 text-sm mt-1 hidden"></div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Program Studi</label>
                        <select 
                            name="program_studi"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            required
                        >
                            <option value="">Select Program Studi</option>
                            ${constants.PROGRAM_STUDI.map(prodi =>
            `<option value="${prodi}" ${profile?.program_studi === prodi ? 'selected' : ''}>${prodi}</option>`
        ).join('')}
                        </select>
                        <div class="error-message text-red-500 text-sm mt-1 hidden"></div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Perguruan Tinggi</label>
                        <select 
                            name="perguruan_tinggi"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            required
                        >
                            <option value="">Select Perguruan Tinggi</option>
                            ${constants.PERGURUAN_TINGGI.map(pt =>
            `<option value="${pt}" ${profile?.perguruan_tinggi === pt ? 'selected' : ''}>${pt}</option>`
        ).join('')}
                        </select>
                        <div class="error-message text-red-500 text-sm mt-1 hidden"></div>
                    </div>
                </div>

                <div class="flex justify-end space-x-3 pt-4">
                    <button 
                        type="button" 
                        id="cancel-role-edit"
                        class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        <span class="loading-spinner hidden">
                            <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                        </span>
                        <span class="button-text">${profile ? 'Update' : 'Create'} Profile</span>
                    </button>
                </div>
            </form>
        `;
    }

    renderErrorMessage(message) {
        return `
            <div class="text-center py-12">
                <div class="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Profile</h2>
                <p class="text-gray-600 dark:text-gray-400 mb-4">${message}</p>
                <button 
                    onclick="location.reload()"
                    class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    Try Again
                </button>
            </div>
        `;
    }

    hideLoadingScreen() {
        const loadingOverlay = document.getElementById("profile-loading-overlay");
        if (loadingOverlay) {
            loadingOverlay.style.transition = "opacity 0.3s ease-out";
            loadingOverlay.style.opacity = "0";
            setTimeout(() => {
                loadingOverlay.remove();
            }, 300);
        }
    }

    // Utility methods for form handling
    showFieldError(fieldName, message) {
        const field = document.querySelector(`[name="${fieldName}"]`);
        const errorDiv = field?.parentElement.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.remove('hidden');
            field.classList.add('border-red-500');
        }
    }

    clearFieldError(fieldName) {
        const field = document.querySelector(`[name="${fieldName}"]`);
        const errorDiv = field?.parentElement.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.textContent = '';
            errorDiv.classList.add('hidden');
            field.classList.remove('border-red-500');
        }
    }

    clearAllErrors() {
        document.querySelectorAll('.error-message').forEach(div => {
            div.textContent = '';
            div.classList.add('hidden');
        });
        document.querySelectorAll('input, select').forEach(field => {
            field.classList.remove('border-red-500');
        });
    }

    showButtonLoading(button) {
        const spinner = button.querySelector('.loading-spinner');
        const text = button.querySelector('.button-text');
        if (spinner && text) {
            spinner.classList.remove('hidden');
            text.textContent = 'Saving...';
            button.disabled = true;
        }
    }

    hideButtonLoading(button, originalText) {
        const spinner = button.querySelector('.loading-spinner');
        const text = button.querySelector('.button-text');
        if (spinner && text) {
            spinner.classList.add('hidden');
            text.textContent = originalText;
            button.disabled = false;
        }
    }

    showSuccessMessage(message) {
        // Create temporary success message
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all transform translate-x-full';
        successDiv.innerHTML = `
            <div class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(successDiv);

        // Animate in
        setTimeout(() => {
            successDiv.classList.remove('translate-x-full');
        }, 100);

        // Animate out and remove
        setTimeout(() => {
            successDiv.classList.add('translate-x-full');
            setTimeout(() => {
                successDiv.remove();
            }, 300);
        }, 3000);
    }

    // Class Code Validation UI Methods (remain the same)
    showClassCodeLoading() {
        this.hideAllClassCodeIndicators();
        document.getElementById('class-code-spinner')?.classList.remove('hidden');
    }

    showClassCodeSuccess(classInfo) {
        this.hideAllClassCodeIndicators();
        document.getElementById('class-code-success')?.classList.remove('hidden');

        // Show class info display
        const infoDisplay = document.getElementById('class-info-display');
        if (infoDisplay && classInfo) {
            // Use the class code as display name since API doesn't provide class name
            const displayName = classInfo.name && classInfo.name !== `Class ${classInfo.class_code}`
                ? classInfo.name
                : `Valid `;

            document.getElementById('class-name-display').textContent = displayName;
            document.getElementById('class-program-display').textContent = classInfo.program_studi || 'N/A';
            document.getElementById('class-institution-display').textContent = classInfo.perguruan_tinggi || 'N/A';
            infoDisplay.classList.remove('hidden');
        }

        // Auto-fill and hide manual fields if class info is complete
        if (classInfo && classInfo.program_studi && classInfo.perguruan_tinggi) {
            this.autoFillFromClassCode(classInfo);
            this.hideManualFields();
        }
    }

    showClassCodeError(errorMessage) {
        this.hideAllClassCodeIndicators();
        document.getElementById('class-code-error')?.classList.remove('hidden');

        // Hide class info display
        document.getElementById('class-info-display')?.classList.add('hidden');

        // Show manual fields
        this.showManualFields();

        // Show error message
        const classCodeInput = document.getElementById('class-code-input');
        if (classCodeInput) {
            this.showFieldError('class_code', errorMessage);
        }
    }

    hideAllClassCodeIndicators() {
        document.getElementById('class-code-spinner')?.classList.add('hidden');
        document.getElementById('class-code-success')?.classList.add('hidden');
        document.getElementById('class-code-error')?.classList.add('hidden');
        this.clearFieldError('class_code');
    }

    autoFillFromClassCode(classInfo) {
        // Fill hidden fields - handle null id gracefully
        document.getElementById('validated-class-id').value = classInfo.id || '';
        document.getElementById('auto-filled').value = 'true';

        // Auto-fill select elements
        const programSelect = document.getElementById('program-studi-select');
        const institutionSelect = document.getElementById('perguruan-tinggi-select');

        if (programSelect && classInfo.program_studi) {
            programSelect.value = classInfo.program_studi;
            programSelect.style.backgroundColor = '#f0f9ff'; // Light blue background
            programSelect.style.color = '#1e40af'; // Blue text
        }

        if (institutionSelect && classInfo.perguruan_tinggi) {
            institutionSelect.value = classInfo.perguruan_tinggi;
            institutionSelect.style.backgroundColor = '#f0f9ff';
            institutionSelect.style.color = '#1e40af';
        }
    }

    hideManualFields() {
        const manualFields = document.getElementById('manual-fields');
        const manualNotice = document.getElementById('manual-fields-notice');
        const requiredIndicators = document.querySelectorAll('#manual-required-indicator, #manual-required-indicator-2');

        if (manualFields) {
            manualFields.style.opacity = '0.6';
            manualFields.style.pointerEvents = 'none';

            // Disable select elements
            manualFields.querySelectorAll('select').forEach(select => {
                select.disabled = true;
                select.style.cursor = 'not-allowed';
            });
        }

        if (manualNotice) {
            manualNotice.classList.add('hidden');
        }

        // Hide required indicators
        requiredIndicators.forEach(indicator => {
            indicator.classList.add('hidden');
        });
    }

    showManualFields() {
        const manualFields = document.getElementById('manual-fields');
        const manualNotice = document.getElementById('manual-fields-notice');
        const requiredIndicators = document.querySelectorAll('#manual-required-indicator, #manual-required-indicator-2');

        if (manualFields) {
            manualFields.style.opacity = '1';
            manualFields.style.pointerEvents = 'auto';

            // Enable select elements and reset styles
            manualFields.querySelectorAll('select').forEach(select => {
                select.disabled = false;
                select.style.cursor = 'pointer';
                select.style.backgroundColor = '';
                select.style.color = '';
            });
        }

        if (manualNotice) {
            manualNotice.classList.remove('hidden');
        }

        // Show required indicators
        requiredIndicators.forEach(indicator => {
            indicator.classList.remove('hidden');
        });

        // Clear hidden fields
        document.getElementById('validated-class-id').value = '';
        document.getElementById('auto-filled').value = 'false';
    }

    resetClassCodeForm() {
        // Clear class code input
        const classCodeInput = document.getElementById('class-code-input');
        if (classCodeInput) {
            classCodeInput.value = '';
        }

        // Hide all indicators
        this.hideAllClassCodeIndicators();

        // Hide class info display
        document.getElementById('class-info-display')?.classList.add('hidden');

        // Show manual fields
        this.showManualFields();
    }
}

export default ProfileView;