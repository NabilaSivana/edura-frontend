// src/scripts/index.js
import "../styles/style.css";
import navbar from "./component/navbar.js";
import routes from "./routes/route.js";
import UrlParser from "./routes/url-parser.js";
import AuthGuard from "./utils/auth-guard.js";

const App = {
  async renderPage() {
    const currentHash = window.location.hash;
    const hideNavbarRoutes = ["#/login", "#/register"];

    const navbarElement = document.querySelector("navbar");

    if (navbarElement) {
      if (hideNavbarRoutes.includes(currentHash)) {
        navbarElement.innerHTML = "";
        navbarElement.style.display = "none";
      } else {
        navbarElement.style.display = "block";
        const navbarComponent = navbar();
        navbarElement.innerHTML = navbarComponent.render();
        await navbarComponent.afterRender?.();
      }
    }

    // Auth guard
    if (AuthGuard.isBlockedAuthRoute()) {
      window.location.hash = "#/dashboard";
      return;
    }

    if (AuthGuard.isBlockedProtectedRoute()) {
      window.location.hash = "#/login";
      return;
    }

    // Routing
    const url = UrlParser.parseActiveUrlWithCombiner();
    const page = routes[url];
    const main = document.querySelector("#main-content");

    if (!main) {
      console.warn("Element #main-content tidak ditemukan");
      return;
    }

    if (!page) {
      console.warn(`Route "${url}" belum tersedia di routes.`);
      main.innerHTML = `<div class="text-center p-10 text-gray-500">
        <p>Halaman ini belum tersedia.</p>
        <p><small>${url}</small></p>
      </div>`;
      return;
    }

    // Jika page.render adalah function yang mengembalikan string (seperti halaman login)
    if (typeof page.render === "function") {
      const content = await page.render();
      if (content) main.innerHTML = content;
    }

    // Jika page.render tidak mengembalikan string (imperatif, manipulasi DOM)
    else {
      await page.render();
    }

    if (typeof page.afterRender === "function") {
      await page.afterRender();
    }
  }
};

// ✅ Pastikan DOM benar-benar siap sebelum attach event
document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("hashchange", App.renderPage);
  App.renderPage(); // render pertama kali
});
