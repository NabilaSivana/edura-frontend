//src/scripts/index.js
import "../styles/style.css";
import routes from "./routes/route.js";
import UrlParser from "./routes/url-parser.js";
import AuthGuard from "./utils/auth-guard.js";

const App = {
  async renderPage() {
    const currentHash = window.location.hash.replace("#", "");

    // Middleware: Auth Guard
    if (AuthGuard.isBlockedAuthRoute()) {
      window.location.hash = "#/dashboard";
      return;
    }

    if (AuthGuard.isBlockedProtectedRoute()) {
      window.location.hash = "#/login";
      return;
    }

    // Ambil route & element utama
    const url = UrlParser.parseActiveUrlWithCombiner();
    const page = routes[url];

    const main = document.querySelector("#main-content");

    if (!main) return;

    if (!page) {
      // Development: fallback render halaman kosong dengan warning di console
      console.warn(`Route "${url}" belum tersedia di routes.`);
      main.innerHTML = `<div class="text-center p-10 text-gray-500">
        <p>Halaman ini belum tersedia.</p>
        <p><small>${url}</small></p>
      </div>`;
      return;
    }

    main.innerHTML = await page.render();
    if (page.afterRender) await page.afterRender();
  },
};

window.addEventListener("hashchange", App.renderPage);
window.addEventListener("load", App.renderPage);
