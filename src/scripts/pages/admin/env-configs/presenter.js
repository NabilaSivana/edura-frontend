import EnvConfigModel from "./model.js";

const EnvConfigPresenter = {
    originalEnv: {},
    currentEnv: {},

    async init() {
        await this.fetchEnv();
        this.renderEnvFields();
        this.handleSave();
    },

    async fetchEnv() {
        const env = await EnvConfigModel.fetchEnv();
        this.originalEnv = { ...env };
        this.currentEnv = { ...env };
    },

    renderEnvFields() {
        const container = document.getElementById("env-fields");
        container.innerHTML = "";

        Object.entries(this.currentEnv).forEach(([key, value]) => {
            if (key === "GEMINI_API_KEYS" || key === "MAIL_SECURE") return;

            const wrapper = document.createElement("div");
            wrapper.dataset.key = key;
            wrapper.className = "mb-4";

            const label = document.createElement("label");
            label.textContent = key;
            label.className = "block font-medium mb-1";

            const inputWrapper = document.createElement("div");
            inputWrapper.className = "relative";

            const input = document.createElement("input");
            input.className = "w-full border rounded px-3 py-2 pr-10";
            input.dataset.envKey = key;
            input.value = value ?? "";
            input.type = typeof value === "string" && value.length > 0 && value.includes("*") ? "password" : "text";

            // Tombol mata untuk field sensitif
            const sensitive = ["MAIL_PASS", "JWT_SECRET", "SUPABASE_SERVICE_ROLE_KEY", "MIDTRANS_SERVER_KEY"];
            if (sensitive.includes(key)) {
                const toggle = document.createElement("button");
                toggle.type = "button";
                toggle.className = "absolute right-2 top-2 text-gray-500";
                toggle.innerHTML = '<i class="fa-solid fa-eye"></i>';

                toggle.addEventListener("click", () => {
                    input.type = input.type === "password" ? "text" : "password";
                    toggle.innerHTML = input.type === "password"
                        ? '<i class="fa-solid fa-eye"></i>'
                        : '<i class="fa-solid fa-eye-slash"></i>';
                });

                inputWrapper.appendChild(toggle);
            }

            input.addEventListener("input", () => this.checkChanges());
            inputWrapper.appendChild(input);

            wrapper.appendChild(label);
            wrapper.appendChild(inputWrapper);
            container.appendChild(wrapper);
        });

        this.renderMailSecureDropdown();
        this.renderGeminiKeyList();
    },

    renderMailSecureDropdown() {
        const key = "MAIL_SECURE";

        const wrapper = document.createElement("div");
        wrapper.className = "mb-4";
        wrapper.dataset.key = key;

        const label = document.createElement("label");
        label.textContent = key;
        label.className = "block font-medium mb-1";

        const select = document.createElement("select");
        select.className = "w-full border rounded px-3 py-2";

        ["null", "true", "false"].forEach(val => {
            const opt = document.createElement("option");
            opt.value = val;
            opt.textContent = val;
            if (String(this.currentEnv[key]) === val) opt.selected = true;
            select.appendChild(opt);
        });

        select.addEventListener("change", () => {
            this.currentEnv[key] = select.value === "null" ? null : select.value;
            this.checkChanges();
        });

        wrapper.appendChild(label);
        wrapper.appendChild(select);
        document.getElementById("env-fields").appendChild(wrapper);
    },

    renderGeminiKeyList() {
        const wrapper = document.createElement("div");
        wrapper.className = "mb-4";

        const label = document.createElement("label");
        label.textContent = "GEMINI_API_KEYS";
        label.className = "block font-medium mb-1";

        const list = document.createElement("div");
        list.id = "gemini-key-list";
        list.className = "flex flex-col gap-2 mb-2";

        const keys = Array.isArray(this.currentEnv.GEMINI_API_KEYS)
            ? [...this.currentEnv.GEMINI_API_KEYS]
            : [];

        keys.forEach((key, idx) => {
            const row = document.createElement("div");
            row.className = "flex gap-2 items-center";

            const input = document.createElement("input");
            input.type = "text";
            input.className = "w-full border rounded px-3 py-2";
            input.value = key;

            input.addEventListener("input", () => {
                keys[idx] = input.value;
                this.currentEnv.GEMINI_API_KEYS = keys;
                this.checkChanges();
            });

            const removeBtn = document.createElement("button");
            removeBtn.type = "button";
            removeBtn.innerHTML = '<i class="fa-solid fa-trash text-red-500"></i>';
            removeBtn.addEventListener("click", () => {
                keys.splice(idx, 1);
                this.currentEnv.GEMINI_API_KEYS = keys;
                this.renderEnvFields();
                this.checkChanges();
            });

            row.appendChild(input);
            row.appendChild(removeBtn);
            list.appendChild(row);
        });

        const addBtn = document.createElement("button");
        addBtn.type = "button";
        addBtn.className = "text-blue-600 text-sm mt-2";
        addBtn.textContent = "+ Tambah API Key";
        addBtn.addEventListener("click", () => {
            keys.push("");
            this.currentEnv.GEMINI_API_KEYS = keys;
            this.renderEnvFields();
            this.checkChanges();
        });

        wrapper.appendChild(label);
        wrapper.appendChild(list);
        wrapper.appendChild(addBtn);

        document.getElementById("env-fields").appendChild(wrapper);
    },

    handleSave() {
        const form = document.getElementById("env-config-form");
        const btn = document.getElementById("save-button");
        btn.disabled = true;

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const payload = {};

            document.querySelectorAll("[data-env-key]").forEach((input) => {
                const key = input.dataset.envKey;
                payload[key] = input.value ?? "";
            });

            payload.MAIL_SECURE = this.currentEnv.MAIL_SECURE;
            payload.GEMINI_API_KEYS = this.currentEnv.GEMINI_API_KEYS;

            try {
                await EnvConfigModel.updateEnv(payload);
                alert("Konfigurasi berhasil diperbarui.");
                location.reload();
            } catch (err) {
                alert("Gagal menyimpan perubahan: " + err.message);
            }
        });
    },

    checkChanges() {
        const btn = document.getElementById("save-button");
        let changed = false;

        document.querySelectorAll("[data-env-key]").forEach((input) => {
            const key = input.dataset.envKey;
            if (input.value !== String(this.originalEnv[key])) changed = true;
        });

        if (JSON.stringify(this.currentEnv.GEMINI_API_KEYS) !== JSON.stringify(this.originalEnv.GEMINI_API_KEYS)) {
            changed = true;
        }

        if (this.currentEnv.MAIL_SECURE !== this.originalEnv.MAIL_SECURE) {
            changed = true;
        }

        btn.disabled = !changed;
    },
};

export default EnvConfigPresenter;
