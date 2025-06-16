import routes from "../scripts/routes/route.js";
import "../styles/style.css"; // jika pakai tailwind

const main = document.querySelector("#main-content");

const router = async () => {
  const url = window.location.hash.slice(1).toLowerCase() || "/";
  const page = routes[url] || (() => "<p>404 Not Found</p>");
  main.innerHTML = await page.render();
  if (page.afterRender) await page.afterRender();
};

window.addEventListener("hashchange", router);
window.addEventListener("load", router);
