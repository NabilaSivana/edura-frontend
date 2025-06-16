// import RegisterPresenter from "./register-presenter";
// import LoginPresenter from "./login-presenter";

// class App {
//   constructor({ baseUrl }) {
//     this._baseUrl = baseUrl;
//     this._registerPresenter = new RegisterPresenter({ baseUrl });
//     this._loginPresenter = new LoginPresenter({ baseUrl });
//   }

//   render() {
//     // You can implement page routing here
//     // For now, we'll just initialize both presenters
//     this._registerPresenter.init();
//     this._loginPresenter.init();
//   }
// }

// export default App;

// // app.js
// import routes from "../routes/route.js";
// import UrlParser from "../routes/url-parser.js";
// import AuthGuard from "../utils/auth-guard.js";

// const App = {
//     async renderPage() {
//         const url = UrlParser.parseActiveUrlWithCombiner();
//         const page = routes[url];

//         AuthGuard.blockAuthRoutesWhenLoggedIn();
//         AuthGuard.blockProtectedRoutesWhenNotLoggedIn();

//         const main = document.querySelector("#main-content");

//         if (!page || !main) {
//             main.innerHTML = "<h1>404 Page Not Found</h1>";
//             return;
//         }

//         main.innerHTML = await page.render();
//         if (page.afterRender) await page.afterRender();
//     },
// };

// export default App;
