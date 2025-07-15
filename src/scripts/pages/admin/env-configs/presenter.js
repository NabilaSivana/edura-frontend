import EnvConfigModel from "./model.js";

const SENSITIVE_KEYS = [
    "MAIL_PASS", "JWT_SECRET", "SUPABASE_SERVICE_ROLE_KEY",
    "MIDTRANS_SERVER_KEY", "MIDTRANS_CLIENT_KEY"
];

const EnvConfigPresenter = {
    async init() {
        try {
            this.envList = await EnvConfigModel.fetchEnv();
            this.render();
        } catch (err) {
            alert("Gagal memuat konfigurasi: " + err.message);
        }
    },

    render() {
        const container = document.getElementById("env-config-container");
        container.innerHTML = "";

        this.envList.forEach((item) => {
            const isArray = Array.isArray(item.value);
            const isBoolean = typeof item.value === "boolean";
            const isSensitive = SENSITIVE_KEYS.includes(item.key);

            const wrapper = document.createElement("div");
            wrapper.className = "border border-gray-300 rounded p-4 bg-white dark:bg-gray-800";
            wrapper.innerHTML = `
        <div class="flex justify-between items-center mb-2">
          <h2 class="font-semibold text-lg">${item.key}</h2>
          <button class="text-red-500 hover:underline" data-delete="${item.key}">Hapus</button>
        </div>
        <div class="space-y-2" id="field-${item.key}"></div>
        <button class="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700" data-save="${item.key}">Simpan</button>
      `;

            container.appendChild(wrapper);
            const field = wrapper.querySelector(`#field-${item.key}`);

            // GEMINI_API_KEYS (Array Special Case)
            if (isArray && item.key === "GEMINI_API_KEYS") {
                const list = document.createElement("div");
                list.className = "flex flex-col gap-2";
                list.id = `sortable-${item.key}`;
                field.appendChild(list);

                item.value.forEach((val, idx) => {
                    const row = document.createElement("div");
                    row.className = "flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-2 rounded";

                    row.innerHTML = `
            <i class="fa-solid fa-bars cursor-move text-gray-500"></i>
            <input type="text" class="flex-1 border rounded px-2 py-1 bg-white text-black" value="${val.api_key || ''}" data-idx="${idx}" />
            <label class="text-sm">
              <input type="radio" name="active-gemini" value="${val.api_key}" ${val.set_active ? 'checked' : ''}/> Aktif
            </label>
            <button class="text-sm text-red-600" data-remove="${idx}"><i class="fa-solid fa-trash"></i></button>
          `;
                    list.appendChild(row);
                });

                const addBtn = document.createElement("button");
                addBtn.textContent = "+ Tambah API Key";
                addBtn.className = "text-blue-600 text-sm hover:underline";
                addBtn.onclick = () => {
                    item.value.push({ api_key: "", set_active: false });
                    this.render(); // rerender semua
                };
                field.appendChild(addBtn);

                // Aktifkan drag-and-drop
                new Sortable(list, {
                    animation: 150,
                    onEnd: (evt) => {
                        const moved = item.value.splice(evt.oldIndex, 1)[0];
                        item.value.splice(evt.newIndex, 0, moved);
                        this.render(); // re-render to preserve order
                    }
                });

                // Listener aktivasi API Key
                field.querySelectorAll("input[type=radio]").forEach(radio => {
                    radio.addEventListener("change", async () => {
                        await EnvConfigModel.setActiveGeminiKey(radio.value);
                        alert("Gemini API key diaktifkan");
                        await this.init();
                    });
                });

                // Listener hapus row
                field.querySelectorAll("button[data-remove]").forEach(btn => {
                    const idx = Number(btn.dataset.remove);
                    btn.addEventListener("click", () => {
                        if (confirm(`Hapus API Key "${item.value[idx].api_key}"?`)) {
                            item.value.splice(idx, 1);
                            this.render();
                        }
                    });
                });

            } else if (item.key === "MAIL_SECURE" || isBoolean) {
                const select = document.createElement("select");
                select.className = "border px-3 py-2 rounded bg-white text-black";
                ["true", "false", "null"].forEach(opt => {
                    const option = document.createElement("option");
                    option.value = opt;
                    option.textContent = opt;
                    if (String(item.value) === opt) option.selected = true;
                    select.appendChild(option);
                });
                field.appendChild(select);

            } else {
                const inputWrapper = document.createElement("div");
                inputWrapper.className = "relative";

                const input = document.createElement("input");
                input.type = isSensitive ? "password" : "text";
                input.value = item.value ?? "";
                input.className = "w-full border px-3 py-2 rounded bg-white text-black pr-10";
                inputWrapper.appendChild(input);

                if (isSensitive) {
                    const toggleBtn = document.createElement("button");
                    toggleBtn.type = "button";
                    toggleBtn.className = "absolute top-2 right-3 text-gray-500 text-sm";
                    toggleBtn.innerHTML = '<i class="fa-solid fa-eye"></i>';

                    toggleBtn.addEventListener("click", () => {
                        const hidden = input.type === "password";
                        input.type = hidden ? "text" : "password";
                        toggleBtn.innerHTML = hidden
                            ? '<i class="fa-solid fa-eye-slash"></i>'
                            : '<i class="fa-solid fa-eye"></i>';
                    });

                    inputWrapper.appendChild(toggleBtn);
                }

                field.appendChild(inputWrapper);
            }

            // Save Button
            wrapper.querySelector(`[data-save="${item.key}"]`).addEventListener("click", async () => {
                let newValue;

                if (Array.isArray(item.value) && item.key === "GEMINI_API_KEYS") {
                    const rows = wrapper.querySelectorAll("input[type=text]");
                    const active = wrapper.querySelector("input[type=radio]:checked")?.value;
                    newValue = Array.from(rows).map((inp) => ({
                        api_key: inp.value.trim(),
                        set_active: inp.value.trim() === active,
                    }));

                    const keysOnly = newValue.map(k => k.api_key);
                    const hasDuplicate = keysOnly.length !== new Set(keysOnly).size;

                    if (hasDuplicate) {
                        alert("Terdapat duplicate API Key!");
                        return;
                    }

                } else if (item.key === "MAIL_SECURE") {
                    const val = wrapper.querySelector("select").value;
                    newValue = val === "null" ? null : val === "true";
                } else {
                    newValue = wrapper.querySelector("input")?.value ?? "";
                }

                try {
                    await EnvConfigModel.updateEnvByKey(item.key, newValue);
                    alert("Berhasil disimpan");
                    await this.init();
                } catch (err) {
                    alert("Gagal menyimpan: " + err.message);
                }
            });

            // Delete
            wrapper.querySelector(`[data-delete="${item.key}"]`).addEventListener("click", async () => {
                if (!confirm(`Hapus konfigurasi ${item.key}?`)) return;
                try {
                    await EnvConfigModel.deleteEnvByKey(item.key);
                    alert("Berhasil dihapus");
                    await this.init();
                } catch (err) {
                    alert("Gagal menghapus: " + err.message);
                }
            });
        });
    }
};

export default EnvConfigPresenter;
