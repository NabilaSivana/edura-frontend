// === File: pages/admin/env-config/view.js ===
const EnvConfigView = {
    render() {
        return `
            <div class="h-screen w-screen flex flex-col">
                <div id="navbar-container" class="shrink-0 z-50"></div>
                <div class="flex flex-1 overflow-hidden">
                    <div id="sidebar-wrapper"></div>
                    <main class="flex-1 overflow-y-auto p-6 md:p-16 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
                        <div class="max-w-6xl mx-auto">
                            <!-- Header -->
                            <div class="mb-8">
                                <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                    <span class="text-2xl">⚙️</span>
                                    Konfigurasi Environment
                                </h1>
                                <p class="text-gray-600 dark:text-gray-400 mt-2">
                                    Kelola variabel environment dan konfigurasi sistem aplikasi
                                </p>
                            </div>

                            <!-- Action Bar -->
                            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
                                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Manajemen Konfigurasi</h3>
                                        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            Total <span id="config-count" class="font-medium text-blue-600 dark:text-blue-400">0</span> konfigurasi
                                        </p>
                                    </div>
                                    <div class="flex gap-3">
                                        <button
                                            id="add-config-btn"
                                            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                                                   transition-colors duration-200 flex items-center gap-2 font-medium"
                                        >
                                            <i class="fas fa-plus"></i>
                                            Tambah Konfigurasi
                                        </button>
                                        <button
                                            id="refresh-config-btn"
                                            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 
                                                   transition-colors duration-200 flex items-center gap-2"
                                        >
                                            <i class="fas fa-sync-alt"></i>
                                            Refresh
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Config Container -->
                            <div id="env-config-container" class="space-y-6">
                                <!-- Configs will be rendered here -->
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            <!-- Add Config Modal -->
            <div id="add-config-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
                    <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Tambah Konfigurasi Baru</h3>
                    </div>
                    <div class="p-6">
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Nama Konfigurasi (Key)
                                </label>
                                <input
                                    type="text"
                                    id="new-config-key"
                                    placeholder="Contoh: DATABASE_URL"
                                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                           dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Nilai (Value)
                                </label>
                                <input
                                    type="text"
                                    id="new-config-value"
                                    placeholder="Masukkan nilai konfigurasi"
                                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                           dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                        <button
                            id="cancel-add-config"
                            class="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 
                                   rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                            Batal
                        </button>
                        <button
                            id="save-add-config"
                            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                                   transition-colors duration-200"
                        >
                            Simpan
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    renderLoadingState() {
        return `
            <div class="flex items-center justify-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span class="ml-3 text-gray-600 dark:text-gray-400">Memuat konfigurasi...</span>
            </div>
        `;
    },

    renderEmptyState() {
        return `
            <div class="text-center py-12">
                <div class="text-6xl mb-4">⚙️</div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Belum Ada Konfigurasi</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-4">Tambahkan konfigurasi environment pertama Anda.</p>
                <button
                    onclick="document.getElementById('add-config-btn').click()"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                    Tambah Konfigurasi
                </button>
            </div>
        `;
    },

    renderConfigItem(item) {
        const isArray = Array.isArray(item.value);
        const isBoolean = typeof item.value === "boolean";
        const isSensitive = this.getSensitiveKeys().includes(item.key);
        const configType = this.getConfigType(item);

        return `
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <!-- Header -->
                <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                <i class="fas ${this.getConfigIcon(item.key)} text-blue-600 dark:text-blue-400"></i>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${item.key}</h3>
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${this.getConfigTypeBadge(configType)}">
                                    ${configType}
                                </span>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <button
                                class="save-config-btn px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 
                                       transition-colors duration-200 text-sm font-medium"
                                data-key="${item.key}"
                            >
                                <i class="fas fa-save mr-1"></i>
                                Simpan
                            </button>
                            <button
                                class="delete-config-btn px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 
                                       transition-colors duration-200 text-sm font-medium"
                                data-key="${item.key}"
                            >
                                <i class="fas fa-trash mr-1"></i>
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Content -->
                <div class="p-6">
                    <div id="field-${item.key}">
                        ${this.renderConfigField(item, isSensitive, isArray, isBoolean)}
                    </div>
                </div>
            </div>
        `;
    },

    renderConfigField(item, isSensitive, isArray, isBoolean) {
        if (isArray && item.key === "GEMINI_API_KEYS") {
            return this.renderGeminiApiKeysField(item);
        } else if (item.key === "MAIL_SECURE" || isBoolean) {
            return this.renderBooleanField(item);
        } else {
            return this.renderTextField(item, isSensitive);
        }
    },

    renderGeminiApiKeysField(item) {
        let html = `
            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <h4 class="font-medium text-gray-900 dark:text-white">Gemini API Keys</h4>
                    <button
                        class="add-api-key-btn px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                               transition-colors duration-200 text-sm"
                        data-key="${item.key}"
                    >
                        <i class="fas fa-plus mr-1"></i>
                        Tambah Key
                    </button>
                </div>
                <div class="sortable-list space-y-3" id="sortable-${item.key}" data-sortable>
        `;

        item.value.forEach((val, idx) => {
            html += `
                <div class="api-key-item bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <div class="flex items-center gap-3">
                        <i class="fas fa-grip-vertical text-gray-400 cursor-move"></i>
                        <div class="flex-1">
                            <input
                                type="password"
                                class="api-key-input w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                       dark:bg-gray-600 dark:text-white text-sm"
                                value="${val.api_key || ''}"
                                data-idx="${idx}"
                                placeholder="Masukkan Gemini API Key"
                            />
                        </div>
                        <div class="flex items-center gap-2">
                            <label class="flex items-center gap-2 text-sm">
                                <input
                                    type="radio"
                                    name="active-gemini"
                                    value="${val.api_key}"
                                    ${val.set_active ? 'checked' : ''}
                                    class="text-blue-600 focus:ring-blue-500"
                                />
                                <span class="text-gray-700 dark:text-gray-300">Aktif</span>
                            </label>
                            <button
                                class="toggle-visibility-btn p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                data-target-idx="${idx}"
                            >
                                <i class="fas fa-eye"></i>
                            </button>
                            <button
                                class="remove-api-key-btn p-2 text-red-500 hover:text-red-700"
                                data-idx="${idx}"
                            >
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;

        return html;
    },

    renderBooleanField(item) {
        return `
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nilai Boolean
                </label>
                <select class="config-select w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                              focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                              dark:bg-gray-700 dark:text-white">
                    <option value="true" ${String(item.value) === 'true' ? 'selected' : ''}>true</option>
                    <option value="false" ${String(item.value) === 'false' ? 'selected' : ''}>false</option>
                    <option value="null" ${String(item.value) === 'null' ? 'selected' : ''}>null</option>
                </select>
            </div>
        `;
    },

    renderTextField(item, isSensitive) {
        return `
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nilai Konfigurasi
                    ${isSensitive ? '<span class="text-red-500 text-xs">(Sensitif)</span>' : ''}
                </label>
                <div class="relative">
                    <input
                        type="${isSensitive ? 'password' : 'text'}"
                        class="config-input w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                               focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                               dark:bg-gray-700 dark:text-white ${isSensitive ? 'pr-10' : ''}"
                        value="${item.value ?? ''}"
                        placeholder="Masukkan nilai konfigurasi"
                    />
                    ${isSensitive ? `
                        <button
                            type="button"
                            class="toggle-visibility-btn absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                            <i class="fas fa-eye"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    },

    getSensitiveKeys() {
        return [
            "MAIL_PASS", "JWT_SECRET", "SUPABASE_SERVICE_ROLE_KEY",
            "MIDTRANS_SERVER_KEY", "MIDTRANS_CLIENT_KEY", "GEMINI_API_KEY"
        ];
    },

    getConfigType(item) {
        if (Array.isArray(item.value)) return "Array";
        if (typeof item.value === "boolean") return "Boolean";
        if (this.getSensitiveKeys().includes(item.key)) return "Secret";
        return "String";
    },

    getConfigTypeBadge(type) {
        const badges = {
            "Array": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
            "Boolean": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
            "Secret": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
            "String": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
        };
        return badges[type] || badges["String"];
    },

    getConfigIcon(key) {
        const icons = {
            "DATABASE": "fa-database",
            "MAIL": "fa-envelope",
            "JWT": "fa-key",
            "SUPABASE": "fa-cloud",
            "MIDTRANS": "fa-credit-card",
            "GEMINI": "fa-brain",
            "PORT": "fa-network-wired",
            "HOST": "fa-server"
        };

        for (const [keyword, icon] of Object.entries(icons)) {
            if (key.toUpperCase().includes(keyword)) {
                return icon;
            }
        }
        return "fa-cog";
    }
};

export default EnvConfigView;