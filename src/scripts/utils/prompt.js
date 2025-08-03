// src/scripts/utils/prompt.js

/**
 * Modern replacement for browser's native prompt() function
 * Supports various input types, validation, and custom styling
 */

class CustomPrompt {
    constructor() {
        this.modalId = 'custom-prompt-modal';
        this.isOpen = false;
        this.createModal();
    }

    createModal() {
        // Remove existing modal if any
        const existing = document.getElementById(this.modalId);
        if (existing) {
            existing.remove();
        }

        // Create modal HTML
        const modal = document.createElement('div');
        modal.id = this.modalId;
        modal.className = 'fixed inset-0 z-[9999] hidden';

        modal.innerHTML = `
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300" id="prompt-backdrop"></div>
      
      <!-- Modal Container -->
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-auto transform transition-all duration-300 scale-95 opacity-0" id="prompt-content">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white" id="prompt-title">Input Required</h3>
          </div>
          
          <!-- Body -->
          <div class="px-6 py-4">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4" id="prompt-message"></p>
            
            <!-- Input Container -->
            <div id="prompt-input-container">
              <!-- Dynamic input will be inserted here -->
            </div>
            
            <!-- Error Message -->
            <div class="mt-2 text-sm text-red-600 dark:text-red-400 hidden" id="prompt-error"></div>
          </div>
          
          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
            <button type="button" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors" id="prompt-cancel">
              Cancel
            </button>
            <button type="button" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors" id="prompt-confirm">
              OK
            </button>
          </div>
        </div>
      </div>
    `;

        document.body.appendChild(modal);
    }

    /**
     * Show prompt dialog
     * @param {Object} options - Configuration options
     * @param {string} options.title - Modal title
     * @param {string} options.message - Message/label text
     * @param {string} options.type - Input type: 'text', 'textarea', 'select', 'password'
     * @param {string} options.defaultValue - Default input value
     * @param {string} options.placeholder - Input placeholder
     * @param {Array} options.options - For select type: [{value, label}]
     * @param {Function} options.validator - Custom validation function
     * @param {string} options.confirmText - Confirm button text
     * @param {string} options.cancelText - Cancel button text
     * @param {boolean} options.required - Whether input is required
     * @param {number} options.maxLength - Maximum input length
     * @returns {Promise<string|null>} - Resolves with input value or null if cancelled
     */
    async show(options = {}) {
        if (this.isOpen) {
            throw new Error('Another prompt is already open');
        }

        const {
            title = 'Input Required',
            message = 'Please enter a value:',
            type = 'text',
            defaultValue = '',
            placeholder = '',
            options: selectOptions = [],
            validator = null,
            confirmText = 'OK',
            cancelText = 'Cancel',
            required = true,
            maxLength = null
        } = options;

        return new Promise((resolve) => {
            this.isOpen = true;

            const modal = document.getElementById(this.modalId);
            const backdrop = document.getElementById('prompt-backdrop');
            const content = document.getElementById('prompt-content');
            const titleEl = document.getElementById('prompt-title');
            const messageEl = document.getElementById('prompt-message');
            const inputContainer = document.getElementById('prompt-input-container');
            const errorEl = document.getElementById('prompt-error');
            const cancelBtn = document.getElementById('prompt-cancel');
            const confirmBtn = document.getElementById('prompt-confirm');

            // Set content
            titleEl.textContent = title;
            messageEl.textContent = message;
            cancelBtn.textContent = cancelText;
            confirmBtn.textContent = confirmText;

            // Create input based on type
            let inputElement;
            if (type === 'textarea') {
                inputElement = document.createElement('textarea');
                inputElement.className = 'w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none';
                inputElement.rows = 4;
            } else if (type === 'select') {
                inputElement = document.createElement('select');
                inputElement.className = 'w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white';

                // Add options
                selectOptions.forEach(option => {
                    const optionEl = document.createElement('option');
                    optionEl.value = option.value || option;
                    optionEl.textContent = option.label || option;
                    inputElement.appendChild(optionEl);
                });
            } else {
                inputElement = document.createElement('input');
                inputElement.type = type;
                inputElement.className = 'w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white';
            }

            inputElement.value = defaultValue;
            inputElement.placeholder = placeholder;
            if (maxLength) inputElement.maxLength = maxLength;
            inputElement.id = 'prompt-input';

            inputContainer.innerHTML = '';
            inputContainer.appendChild(inputElement);

            // Validation function
            const validateInput = () => {
                const value = inputElement.value.trim();
                errorEl.classList.add('hidden');

                if (required && !value) {
                    errorEl.textContent = 'This field is required';
                    errorEl.classList.remove('hidden');
                    return false;
                }

                if (validator) {
                    const validationResult = validator(value);
                    if (validationResult !== true) {
                        errorEl.textContent = validationResult || 'Invalid input';
                        errorEl.classList.remove('hidden');
                        return false;
                    }
                }

                return true;
            };

            // Event handlers
            const cleanup = () => {
                this.isOpen = false;
                modal.classList.add('hidden');
                content.classList.remove('scale-100', 'opacity-100');
                content.classList.add('scale-95', 'opacity-0');

                // Remove event listeners
                cancelBtn.removeEventListener('click', handleCancel);
                confirmBtn.removeEventListener('click', handleConfirm);
                backdrop.removeEventListener('click', handleCancel);
                inputElement.removeEventListener('keydown', handleKeydown);
                inputElement.removeEventListener('input', handleInput);
            };

            const handleCancel = () => {
                cleanup();
                resolve(null);
            };

            const handleConfirm = () => {
                if (validateInput()) {
                    const value = inputElement.value.trim();
                    cleanup();
                    resolve(value);
                }
            };

            const handleKeydown = (e) => {
                if (e.key === 'Enter' && type !== 'textarea') {
                    e.preventDefault();
                    handleConfirm();
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    handleCancel();
                }
            };

            const handleInput = () => {
                // Clear error on input change
                if (!errorEl.classList.contains('hidden')) {
                    errorEl.classList.add('hidden');
                }
            };

            // Attach event listeners
            cancelBtn.addEventListener('click', handleCancel);
            confirmBtn.addEventListener('click', handleConfirm);
            backdrop.addEventListener('click', handleCancel);
            inputElement.addEventListener('keydown', handleKeydown);
            inputElement.addEventListener('input', handleInput);

            // Show modal
            modal.classList.remove('hidden');

            // Trigger animation
            requestAnimationFrame(() => {
                content.classList.remove('scale-95', 'opacity-0');
                content.classList.add('scale-100', 'opacity-100');
            });

            // Focus input
            setTimeout(() => {
                inputElement.focus();
                if (type === 'text' && defaultValue) {
                    inputElement.select();
                }
            }, 100);
        });
    }

    /**
     * Simple text prompt (replacement for native prompt)
     * @param {string} message - Prompt message
     * @param {string} defaultValue - Default value
     * @returns {Promise<string|null>}
     */
    async text(message, defaultValue = '') {
        return this.show({
            message,
            defaultValue,
            type: 'text'
        });
    }

    /**
     * Password prompt
     * @param {string} message - Prompt message
     * @returns {Promise<string|null>}
     */
    async password(message = 'Enter password:') {
        return this.show({
            message,
            type: 'password'
        });
    }

    /**
     * Textarea prompt for longer text
     * @param {string} message - Prompt message
     * @param {string} defaultValue - Default value
     * @returns {Promise<string|null>}
     */
    async textarea(message, defaultValue = '') {
        return this.show({
            message,
            defaultValue,
            type: 'textarea'
        });
    }

    /**
     * Select prompt with predefined options
     * @param {string} message - Prompt message
     * @param {Array} options - Array of options
     * @param {string} defaultValue - Default selected value
     * @returns {Promise<string|null>}
     */
    async select(message, options, defaultValue = '') {
        return this.show({
            message,
            defaultValue,
            type: 'select',
            options
        });
    }
    /**
     * Confirmation dialog - shows only message with Confirm/Cancel buttons
     * @param {string} message - Confirmation message
     * @param {string} title - Dialog title
     * @returns {Promise<boolean>}
     */
    async confirm(message, title = 'Confirm Action') {
        if (this.isOpen) {
            throw new Error('Another prompt is already open');
        }

        return new Promise((resolve) => {
            this.isOpen = true;

            const modal = document.getElementById(this.modalId);
            const backdrop = document.getElementById('prompt-backdrop');
            const content = document.getElementById('prompt-content');
            const titleEl = document.getElementById('prompt-title');
            const messageEl = document.getElementById('prompt-message');
            const inputContainer = document.getElementById('prompt-input-container');
            const errorEl = document.getElementById('prompt-error');
            const cancelBtn = document.getElementById('prompt-cancel');
            const confirmBtn = document.getElementById('prompt-confirm');

            // Set content
            titleEl.textContent = title;
            messageEl.textContent = message;
            cancelBtn.textContent = 'Batal';
            confirmBtn.textContent = 'Confirm';

            // Hide input container and error for confirmation dialog
            inputContainer.style.display = 'none';
            errorEl.classList.add('hidden');

            // Event handlers
            const cleanup = () => {
                this.isOpen = false;
                modal.classList.add('hidden');
                content.classList.remove('scale-100', 'opacity-100');
                content.classList.add('scale-95', 'opacity-0');

                // Show input container back for future prompts
                inputContainer.style.display = 'block';

                // Remove event listeners
                cancelBtn.removeEventListener('click', handleCancel);
                confirmBtn.removeEventListener('click', handleConfirm);
                backdrop.removeEventListener('click', handleCancel);
                document.removeEventListener('keydown', handleKeydown);
            };

            const handleCancel = () => {
                cleanup();
                resolve(false);
            };

            const handleConfirm = () => {
                cleanup();
                resolve(true);
            };

            const handleKeydown = (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleConfirm();
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    handleCancel();
                }
            };

            // Attach event listeners
            cancelBtn.addEventListener('click', handleCancel);
            confirmBtn.addEventListener('click', handleConfirm);
            backdrop.addEventListener('click', handleCancel);
            document.addEventListener('keydown', handleKeydown);

            // Show modal
            modal.classList.remove('hidden');

            // Trigger animation
            requestAnimationFrame(() => {
                content.classList.remove('scale-95', 'opacity-0');
                content.classList.add('scale-100', 'opacity-100');
            });

            // Focus confirm button
            setTimeout(() => {
                confirmBtn.focus();
            }, 100);
        });
    }
}

// Create global instance
const customPrompt = new CustomPrompt();

// Export both the class and convenience functions
export default customPrompt;

// Convenience functions that can be imported individually
export const promptText = (message, defaultValue) => customPrompt.text(message, defaultValue);
export const promptPassword = (message) => customPrompt.password(message);
export const promptTextarea = (message, defaultValue) => customPrompt.textarea(message, defaultValue);
export const promptSelect = (message, options, defaultValue) => customPrompt.select(message, options, defaultValue);
export const promptConfirm = (message, title) => customPrompt.confirm(message, title);

// Advanced prompt with full options
export const prompt = (options) => customPrompt.show(options);

// Replace native prompt (optional - can be enabled globally)
export const replaceNativePrompt = () => {
    window.prompt = customPrompt.text.bind(customPrompt);
    window.confirm = customPrompt.confirm.bind(customPrompt);
};