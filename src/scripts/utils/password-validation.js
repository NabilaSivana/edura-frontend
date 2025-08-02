// utils/password-validation.js
// Unified Password Validation System untuk konsistensi di seluruh aplikasi

export const PasswordValidation = {
    // Standar konfigurasi password yang konsisten
    REQUIREMENTS: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumber: true,
        requireSpecial: true
    },

    // Regex patterns
    PATTERNS: {
        uppercase: /[A-Z]/,
        lowercase: /[a-z]/,
        number: /[0-9]/,
        special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/
    },

    /**
     * Validasi password berdasarkan standar yang ditetapkan
     * @param {string} password - Password yang akan divalidasi
     * @returns {Object} - Hasil validasi dengan detail requirements
     */
    validatePassword(password) {
        const requirements = {
            length: {
                met: password.length >= this.REQUIREMENTS.minLength,
                message: `Minimal ${this.REQUIREMENTS.minLength} karakter`
            },
            uppercase: {
                met: this.PATTERNS.uppercase.test(password),
                message: 'Mengandung huruf besar'
            },
            lowercase: {
                met: this.PATTERNS.lowercase.test(password),
                message: 'Mengandung huruf kecil'
            },
            number: {
                met: this.PATTERNS.number.test(password),
                message: 'Mengandung angka'
            },
            special: {
                met: this.PATTERNS.special.test(password),
                message: 'Mengandung karakter khusus (!@#$%^&*)'
            }
        };

        // Hitung score dan requirements yang terpenuhi
        const metRequirements = Object.values(requirements).filter(req => req.met).length;
        const totalRequirements = Object.keys(requirements).length;

        // Hitung score dengan bonus complexity
        let score = metRequirements;

        // Bonus points untuk kompleksitas tambahan
        if (password.length >= 12) score += 0.5;
        if (password.length >= 16) score += 0.5;
        if ((password.match(/[A-Z]/g) || []).length >= 2) score += 0.3;
        if ((password.match(/[0-9]/g) || []).length >= 2) score += 0.3;
        if ((password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/g) || []).length >= 2) score += 0.3;

        // Tentukan strength level
        const maxScore = totalRequirements + 1.6; // 5 basic + 1.6 bonus
        const percentage = Math.min((score / maxScore) * 100, 100);

        let strength, strengthText, strengthClass;

        if (password.length === 0) {
            strength = 'empty';
            strengthText = 'Belum diisi';
            strengthClass = 'text-gray-500 dark:text-gray-400';
        } else if (score < 2) {
            strength = 'very-weak';
            strengthText = 'Sangat Lemah';
            strengthClass = 'text-red-600 dark:text-red-400';
        } else if (score < 3) {
            strength = 'weak';
            strengthText = 'Lemah';
            strengthClass = 'text-orange-600 dark:text-orange-400';
        } else if (score < 4) {
            strength = 'medium';
            strengthText = 'Sedang';
            strengthClass = 'text-yellow-600 dark:text-yellow-400';
        } else if (score < 5) {
            strength = 'strong';
            strengthText = 'Kuat';
            strengthClass = 'text-blue-600 dark:text-blue-400';
        } else {
            strength = 'very-strong';
            strengthText = 'Sangat Kuat';
            strengthClass = 'text-green-600 dark:text-green-400';
        }

        return {
            isValid: metRequirements === totalRequirements,
            score,
            percentage,
            strength,
            strengthText,
            strengthClass,
            requirements,
            metRequirements,
            totalRequirements,
            missingRequirements: Object.entries(requirements)
                .filter(([key, req]) => !req.met)
                .map(([key, req]) => req.message)
        };
    },

    /**
     * Update UI berdasarkan hasil validasi password
     * @param {string} password - Password yang divalidasi
     * @param {Object} selectors - Objek berisi selector untuk elemen UI
     */
    updatePasswordStrengthUI(password, selectors) {
        const validation = this.validatePassword(password);

        // Update strength bar
        if (selectors.strengthBar) {
            const strengthBar = document.querySelector(selectors.strengthBar);
            if (strengthBar) {
                strengthBar.style.width = validation.strength === 'empty' ? '0%' : `${Math.max(validation.percentage, 15)}%`;

                // Update bar color classes
                strengthBar.className = "h-full transition-all duration-300 rounded-full";

                switch (validation.strength) {
                    case 'very-weak':
                        strengthBar.classList.add('bg-gradient-to-r', 'from-red-500', 'to-red-600');
                        break;
                    case 'weak':
                        strengthBar.classList.add('bg-gradient-to-r', 'from-orange-500', 'to-red-500');
                        break;
                    case 'medium':
                        strengthBar.classList.add('bg-gradient-to-r', 'from-yellow-500', 'to-orange-500');
                        break;
                    case 'strong':
                        strengthBar.classList.add('bg-gradient-to-r', 'from-blue-500', 'to-green-500');
                        break;
                    case 'very-strong':
                        strengthBar.classList.add('bg-gradient-to-r', 'from-green-500', 'to-emerald-600', 'shadow-lg');
                        break;
                }
            }
        }

        // Update strength text
        if (selectors.strengthText) {
            const strengthText = document.querySelector(selectors.strengthText);
            if (strengthText) {
                strengthText.textContent = validation.strengthText;
                strengthText.className = `text-xs font-bold ${validation.strengthClass}`;
            }
        }

        // Update requirements list
        if (selectors.requirements) {
            const requirementSelectors = selectors.requirements;

            Object.entries(validation.requirements).forEach(([key, requirement]) => {
                if (requirementSelectors[key]) {
                    const reqElement = document.querySelector(requirementSelectors[key]);
                    if (reqElement) {
                        const checkIcon = reqElement.querySelector('svg');
                        const circle = reqElement.querySelector('div');
                        const span = reqElement.querySelector('span');

                        if (requirement.met) {
                            // Requirement met
                            if (circle) {
                                circle.classList.remove('border-gray-300', 'dark:border-gray-600');
                                circle.classList.add('border-green-500', 'bg-green-500');
                            }
                            if (checkIcon) {
                                checkIcon.classList.remove('hidden');
                            }
                            if (span) {
                                span.classList.add('text-green-600', 'dark:text-green-400');
                                span.classList.remove('text-gray-600', 'dark:text-gray-400');
                            }
                            reqElement.classList.add('met');
                        } else {
                            // Requirement not met
                            if (circle) {
                                circle.classList.add('border-gray-300', 'dark:border-gray-600');
                                circle.classList.remove('border-green-500', 'bg-green-500');
                            }
                            if (checkIcon) {
                                checkIcon.classList.add('hidden');
                            }
                            if (span) {
                                span.classList.remove('text-green-600', 'dark:text-green-400');
                                span.classList.add('text-gray-600', 'dark:text-gray-400');
                            }
                            reqElement.classList.remove('met');
                        }
                    }
                }
            });
        }

        return validation;
    },

    /**
     * Validasi konfirmasi password
     * @param {string} password - Password utama
     * @param {string} confirmPassword - Konfirmasi password
     * @param {Object} selectors - Selector untuk elemen UI
     */
    validatePasswordMatch(password, confirmPassword, selectors = {}) {
        const isMatch = password === confirmPassword && password.length > 0;
        const isEmpty = confirmPassword.length === 0;

        // Update match indicator UI
        if (selectors.indicator) {
            const indicator = document.querySelector(selectors.indicator);
            if (indicator) {
                if (isEmpty) {
                    indicator.classList.add('hidden');
                } else {
                    indicator.classList.remove('hidden');
                }
            }
        }

        if (selectors.matchIndicator && selectors.matchText) {
            const matchIndicator = document.querySelector(selectors.matchIndicator);
            const matchText = document.querySelector(selectors.matchText);

            if (matchIndicator && matchText && !isEmpty) {
                if (isMatch) {
                    matchIndicator.className = "w-3 h-3 rounded-full bg-green-500 animate-pulse";
                    matchText.textContent = "Password cocok ✓";
                    matchText.className = "font-medium text-green-600 dark:text-green-400";
                } else {
                    matchIndicator.className = "w-3 h-3 rounded-full bg-red-500 animate-pulse";
                    matchText.textContent = "Password tidak cocok ✗";
                    matchText.className = "font-medium text-red-600 dark:text-red-400";
                }
            }
        }

        // Update input border
        if (selectors.confirmInput) {
            const confirmInput = document.querySelector(selectors.confirmInput);
            if (confirmInput) {
                if (isEmpty) {
                    confirmInput.classList.remove('border-red-500', 'border-green-500', 'dark:border-red-500', 'dark:border-green-500');
                } else if (isMatch) {
                    confirmInput.classList.remove('border-red-500', 'dark:border-red-500');
                    confirmInput.classList.add('border-green-500', 'dark:border-green-500');
                } else {
                    confirmInput.classList.add('border-red-500', 'dark:border-red-500');
                    confirmInput.classList.remove('border-green-500', 'dark:border-green-500');
                }
            }
        }

        return {
            isMatch,
            isEmpty,
            isValid: isMatch || isEmpty
        };
    },

    /**
     * Setup event listeners untuk validasi password real-time
     * @param {Object} config - Konfigurasi dengan selector dan callback
     */
    setupPasswordValidation(config) {
        const {
            passwordInput,
            confirmPasswordInput,
            strengthSelectors,
            matchSelectors,
            onValidationChange
        } = config;

        const passwordEl = document.querySelector(passwordInput);
        const confirmPasswordEl = document.querySelector(confirmPasswordInput);

        if (passwordEl) {
            passwordEl.addEventListener('input', (e) => {
                const validation = this.updatePasswordStrengthUI(e.target.value, strengthSelectors);

                // Also validate match if confirm password has value
                if (confirmPasswordEl && confirmPasswordEl.value) {
                    const matchValidation = this.validatePasswordMatch(
                        e.target.value,
                        confirmPasswordEl.value,
                        matchSelectors
                    );

                    if (onValidationChange) {
                        onValidationChange({
                            password: validation,
                            match: matchValidation
                        });
                    }
                } else if (onValidationChange) {
                    onValidationChange({
                        password: validation,
                        match: { isValid: true, isEmpty: true }
                    });
                }
            });
        }

        if (confirmPasswordEl) {
            confirmPasswordEl.addEventListener('input', (e) => {
                const passwordValue = passwordEl ? passwordEl.value : '';
                const matchValidation = this.validatePasswordMatch(
                    passwordValue,
                    e.target.value,
                    matchSelectors
                );

                if (onValidationChange) {
                    const passwordValidation = passwordEl ? this.validatePassword(passwordEl.value) : { isValid: false };
                    onValidationChange({
                        password: passwordValidation,
                        match: matchValidation
                    });
                }
            });
        }
    },

    /**
     * Generate HTML untuk requirements list
     * @param {string} idPrefix - Prefix untuk ID elemen
     * @returns {string} - HTML string untuk requirements
     */
    generateRequirementsHTML(idPrefix = '') {
        const requirements = [
            { key: 'length', icon: 'fas fa-circle', message: `Minimal ${this.REQUIREMENTS.minLength} karakter` },
            { key: 'uppercase', icon: 'fas fa-circle', message: 'Mengandung huruf besar' },
            { key: 'lowercase', icon: 'fas fa-circle', message: 'Mengandung huruf kecil' },
            { key: 'number', icon: 'fas fa-circle', message: 'Mengandung angka' },
            { key: 'special', icon: 'fas fa-circle', message: 'Mengandung karakter khusus (!@#$%^&*)' }
        ];

        return requirements.map(req => `
      <div class="requirement" id="${idPrefix}${req.key}-req">
        <div class="w-3 h-3 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center">
          <svg class="w-2 h-2 text-green-500 hidden" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
        </div>
        <span class="text-gray-600 dark:text-gray-400">${req.message}</span>
      </div>
    `).join('');
    }
};