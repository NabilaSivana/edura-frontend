// file: src/scripts/component/loading-screen.js
export function showLoadingScreen(message = "Loading...") {
  // Hindari duplikat
  if (document.getElementById("global-loading-screen")) return;

  const overlay = document.createElement("div");
  overlay.id = "global-loading-screen";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = "9999";

  const spinner = document.createElement("div");
  spinner.className = "spinner";
  spinner.style.border = "8px solid #f3f3f3";
  spinner.style.borderTop = "8px solid #3498db";
  spinner.style.borderRadius = "50%";
  spinner.style.width = "60px";
  spinner.style.height = "60px";
  spinner.style.animation = "spin 1s linear infinite";

  const text = document.createElement("div");
  text.textContent = message;
  text.style.marginTop = "20px";
  text.style.fontSize = "18px";
  text.style.fontWeight = "bold";
  text.style.color = "#333";

  // ✅ PERBAIKAN: Pindahkan pengecekan dark mode setelah text dibuat
  if (document.documentElement.classList.contains("dark")) {
    overlay.style.backgroundColor = "rgba(31, 41, 55, 0.8)"; // dark:bg-gray-800/80
    text.style.color = "#fff";
  }

  overlay.appendChild(spinner);
  overlay.appendChild(text);
  document.body.appendChild(overlay);

  // Inject style if not already
  if (!document.getElementById("global-loading-style")) {
    const style = document.createElement("style");
    style.id = "global-loading-style";
    style.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
}

export function hideLoadingScreen() {
  const overlay = document.getElementById("global-loading-screen");
  if (overlay) {
    overlay.remove();
  }
}

// file: src/scripts/component/loading-element.js
export function showElementLoading(containerId, message = "Loading...") {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="flex justify-center items-center py-10">
      <div class="text-center text-gray-600 dark:text-gray-300 animate-pulse">
        <div class="loader mb-2 w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p class="text-sm">${message}</p>
      </div>
    </div>
  `;
}

export function hideElementLoading(containerId) {
  const container = document.getElementById(containerId);
  if (container) container.innerHTML = "";
}