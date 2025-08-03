// === File: pages/admin/env-config/presenter.js ===
import { showToastNotification } from "../../../utils/index.js";
import { promptConfirm, promptSelect } from "../../../utils/prompt.js";
import EnvConfigModel from "./model.js";
import EnvConfigView from "./view.js";

const EnvConfigPresenter = {
    async init() {
        this.setupEventListeners();
        await this.loadConfigs();
    },

    setupEventListeners() {
        // Add config modal
        const addBtn = document.getElementById("add-config-btn");
        const modal = document.getElementById("add-config-modal");
        const cancelBtn = document.getElementById("cancel-add-config");
        const saveBtn = document.getElementById("save-add-config");
        const refreshBtn = document.getElementById("refresh-config-btn");

        addBtn?.addEventListener("click", () => this.showAddModal());
        cancelBtn?.addEventListener("click", () => this.hideAddModal());
        saveBtn?.addEventListener("click", () => this.handleAddConfig());
        refreshBtn?.addEventListener("click", () => this.loadConfigs());

        // Close modal on backdrop click
        modal?.addEventListener("click", (e) => {
            if (e.target === modal) this.hideAddModal();
        });

        // ESC key to close modal
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && !modal?.classList.contains("hidden")) {
                this.hideAddModal();
            }
        });
    },

    async loadConfigs() {
        const container = document.getElementById("env-config-container");
        const countEl = document.getElementById("config-count");

        if (!container) return;

        try {
            container.innerHTML = EnvConfigView.renderLoadingState();

            this.envList = await EnvConfigModel.fetchEnv();

            if (countEl) {
                countEl.textContent = this.envList.length;
            }

            if (!this.envList || this.envList.length === 0) {
                container.innerHTML = EnvConfigView.renderEmptyState();
                return;
            }

            this.renderConfigs();

        } catch (error) {
            console.error('Error loading configs:', error);
            showToastNotification("Gagal memuat konfigurasi: " + error.message, "error");
            container.innerHTML = `
                <div class="text-center py-12">
                    <div class="text-6xl mb-4">⚠️</div>
                    <h3 class="text-lg font-medium text-red-600 dark:text-red-400 mb-2">Error</h3>
                    <p class="text-gray-600 dark:text-gray-400">${error.message}</p>
                </div>
            `;
        }
    },

    renderConfigs() {
        const container = document.getElementById("env-config-container");
        container.innerHTML = "";

        this.envList.forEach((item) => {
            const configElement = document.createElement("div");
            configElement.innerHTML = EnvConfigView.renderConfigItem(item);
            container.appendChild(configElement.firstElementChild);
        });

        this.setupConfigEventListeners();
        this.setupSortable();
    },

    setupConfigEventListeners() {
        const container = document.getElementById("env-config-container");

        // Save buttons
        container.querySelectorAll(".save-config-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const key = e.target.closest('button').dataset.key;
                this.handleSaveConfig(key);
            });
        });

        // Delete buttons
        container.querySelectorAll(".delete-config-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const key = e.target.closest('button').dataset.key;
                this.handleDeleteConfig(key);
            });
        });

        // Toggle visibility buttons
        container.querySelectorAll(".toggle-visibility-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                this.toggleFieldVisibility(e.currentTarget);
            });
        });

        // Add API key buttons
        container.querySelectorAll(".add-api-key-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const key = e.target.closest('button').dataset.key;
                this.handleAddApiKey(key);
            });
        });

        // Remove API key buttons
        container.querySelectorAll(".remove-api-key-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = parseInt(e.target.closest('button').dataset.idx);
                this.handleRemoveApiKey(idx);
            });
        });

        // Gemini activation radio buttons
        container.querySelectorAll("input[name='active-gemini']").forEach(radio => {
            radio.addEventListener("change", async (e) => {
                if (e.target.checked) {
                    await this.handleActivateGeminiKey(e.target.value);
                }
            });
        });
    },

    setupSortable() {
        const sortableLists = document.querySelectorAll("[data-sortable]");

        sortableLists.forEach(list => {
            if (window.Sortable) {
                new Sortable(list, {
                    animation: 150,
                    handle: '.fa-grip-vertical',
                    onEnd: (evt) => {
                        this.handleSortApiKeys(evt.oldIndex, evt.newIndex);
                    }
                });
            }
        });
    },

    async handleSaveConfig(key) {
        try {
            const item = this.envList.find(item => item.key === key);
            if (!item) return;

            let newValue;

            if (Array.isArray(item.value) && key === "GEMINI_API_KEYS") {
                newValue = this.getGeminiApiKeysValue(key);
            } else if (key === "MAIL_SECURE" || typeof item.value === "boolean") {
                newValue = this.getBooleanValue(key);
            } else {
                newValue = this.getTextValue(key);
            }

            await EnvConfigModel.updateEnvByKey(key, newValue);
            showToastNotification("Berhasil disimpan", "success");
            await this.loadConfigs();

        } catch (error) {
            console.error('Error saving config:', error);
            showToastNotification("Gagal menyimpan: " + error.message, "error");
        }
    },

    async handleDeleteConfig(key) {
        if (!promptConfirm(`Hapus konfigurasi ${key}?`)) return;

        try {
            await EnvConfigModel.deleteEnvByKey(key);
            showToastNotification("Berhasil dihapus", "success");
            await this.loadConfigs();
        } catch (error) {
            console.error('Error deleting config:', error);
            showToastNotification("Gagal menghapus: " + error.message, "error");
        }
    },

    handleAddApiKey(key) {
        const item = this.envList.find(item => item.key === key);
        if (item && Array.isArray(item.value)) {
            item.value.push({ api_key: "", set_active: false });
            this.renderConfigs();
        }
    },

    handleRemoveApiKey(idx) {
        const item = this.envList.find(item => item.key === "GEMINI_API_KEYS");
        if (item && Array.isArray(item.value)) {
            if (promptConfirm(`Hapus API Key "${item.value[idx]?.api_key || 'kosong'}"?`)) {
                item.value.splice(idx, 1);
                this.renderConfigs();
            }
        }
    },

    handleSortApiKeys(oldIndex, newIndex) {
        const item = this.envList.find(item => item.key === "GEMINI_API_KEYS");
        if (item && Array.isArray(item.value)) {
            const moved = item.value.splice(oldIndex, 1)[0];
            item.value.splice(newIndex, 0, moved);
        }
    },

    async handleActivateGeminiKey(apiKey) {
        try {
            await EnvConfigModel.setActiveGeminiKey(apiKey);
            showToastNotification("Gemini API key diaktifkan", "success");
            await this.loadConfigs();
        } catch (error) {
            console.error('Error activating Gemini key:', error);
            showToastNotification("Gagal mengaktifkan: " + error.message, "error");
        }
    },

    toggleFieldVisibility(button) {
        let input = null;

        // Check if this is for a Gemini API key (has data-target-idx)
        if (button.dataset.targetIdx !== undefined) {
            // Find the input within the same api-key-item container
            const container = button.closest('.api-key-item');
            if (container) {
                input = container.querySelector('.api-key-input');
            }
        } else {
            // For regular config fields
            const container = button.closest('.relative');
            if (container) {
                input = container.querySelector('input');
            }
        }

        if (input) {
            const isHidden = input.type === "password";
            input.type = isHidden ? "text" : "password";

            const icon = button.querySelector('i');
            if (icon) {
                icon.className = isHidden ? 'fas fa-eye-slash' : 'fas fa-eye';
            }
        }
    },

    getGeminiApiKeysValue(key) {
        const container = document.querySelector(`#field-${key}`);
        const inputs = container.querySelectorAll('.api-key-input');
        const activeRadio = container.querySelector('input[name="active-gemini"]:checked');

        const values = Array.from(inputs).map(input => ({
            api_key: input.value.trim(),
            set_active: input.value.trim() === activeRadio?.value
        }));

        // Check for duplicates
        const keys = values.map(v => v.api_key).filter(k => k);
        const hasDuplicate = keys.length !== new Set(keys).size;

        if (hasDuplicate) {
            throw new Error("Terdapat duplicate API Key!");
        }

        return values;
    },

    getBooleanValue(key) {
        const container = document.querySelector(`#field-${key}`);
        const select = container.querySelector('.config-select');
        const val = select.value;
        return val === "null" ? null : val === "true";
    },

    getTextValue(key) {
        const container = document.querySelector(`#field-${key}`);
        const input = container.querySelector('.config-input');
        return input.value;
    },

    showAddModal() {
        const modal = document.getElementById("add-config-modal");
        modal.classList.remove("hidden");
        modal.classList.add("flex");

        // Clear inputs
        document.getElementById("new-config-key").value = "";
        document.getElementById("new-config-value").value = "";

        // Focus on key input
        setTimeout(() => {
            document.getElementById("new-config-key").focus();
        }, 100);
    },

    hideAddModal() {
        const modal = document.getElementById("add-config-modal");
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    },

    async handleAddConfig() {
        const keyInput = document.getElementById("new-config-key");
        const valueInput = document.getElementById("new-config-value");

        const key = keyInput.value.trim();
        const value = valueInput.value.trim();

        if (!key) {
            showToastNotification("Nama konfigurasi (key) wajib diisi", "warning");
            keyInput.focus();
            return;
        }

        // Check if key already exists
        if (this.envList.some(item => item.key === key)) {
            showToastNotification("Konfigurasi dengan nama tersebut sudah ada", "warning");
            keyInput.focus();
            return;
        }

        try {
            await EnvConfigModel.updateEnvByKey(key, value);
            showToastNotification("Konfigurasi berhasil ditambahkan", "success");
            this.hideAddModal();
            await this.loadConfigs();
        } catch (error) {
            console.error('Error adding config:', error);
            showToastNotification("Gagal menambahkan: " + error.message, "error");
        }
    }
};

export default EnvConfigPresenter;