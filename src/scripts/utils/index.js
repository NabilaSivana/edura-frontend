//utils/index.js
// Buat container toast sekali
function ensureToastContainer() {
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        container.className = "fixed top-5 right-5 z-50 flex flex-col gap-3";
        document.body.appendChild(container);
    }
    return container;
}

// Fungsi utama
export function showToastNotification(message, type = "success", duration = 3000) {
    const container = ensureToastContainer();

    const bgColors = {
        success: "bg-green-500 text-white",
        error: "bg-red-500 text-white",
        warning: "bg-yellow-400 text-black",
        confirm: "bg-blue-500 text-white",
    };

    const toast = document.createElement("div");
    toast.className = `
        px-4 py-3 rounded-lg shadow-md flex items-center justify-between gap-4 min-w-[250px]
        ${bgColors[type] || bgColors.success} animate-slide-in-right
    `;

    toast.innerHTML = `
        <span class="flex-1">${message}</span>
        <button class="text-lg font-bold focus:outline-none">&times;</button>
    `;

    // Tombol close
    toast.querySelector("button").onclick = () => toast.remove();

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, duration);
}
