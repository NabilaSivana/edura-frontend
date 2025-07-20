// toast.js

export function showToast(message, type = "info") {
    // Remove existing toast if any
    const existing = document.getElementById("toast-notification");
    if (existing) existing.remove();

    // Toast colors based on type
    const typeStyles = {
        info: "bg-blue-500",
        success: "bg-green-500",
        error: "bg-red-500",
        warning: "bg-yellow-500 text-black"
    };

    // Create toast element
    const toast = document.createElement("div");
    toast.id = "toast-notification";
    toast.className = `
        fixed top-5 right-5 z-50 px-4 py-2 rounded shadow-lg text-white
        ${typeStyles[type] || typeStyles.info}
        animate-fade-in
    `;
    toast.innerText = message;

    // Add fade-in animation (Tailwind doesn't have built-in, so add via style)
    const style = document.createElement("style");
    style.innerHTML = `
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s; }
    `;
    document.head.appendChild(style);

    // Append toast to body
    document.body.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.remove();
        style.remove();
    }, 3000);
}