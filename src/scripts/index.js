import '@fortawesome/fontawesome-free/css/all.min.css';import "../styles/style.css";import navbar from "./component/navbar.js";import routes from "./routes/route.js";import UrlParser from "./routes/url-parser.js";import NotFoundPage from "./utils/404.js";import UnauthorizedPage from "./utils/401.js";import ForbiddenPage from "./utils/403.js";import AuthGuard from "./utils/auth-guard.js";const App={isRendering:!1,currentRoute:null,currentContent:null,currentFullHash:'',navigationState:{lastHash:'',lastNavbarState:null,lastSidebarState:null},initializeRoute(){let currentHash=window.location.hash;if(!currentHash||currentHash==='#'||currentHash===''){console.log('No hash found, redirecting to landing page');window.location.hash='#/';return!0}
return!1},isDynamicRoute(route){const dynamicRoutes=['/course/session','/course/flashcards','/course/final-exam','/teacher/course-detail'];return dynamicRoutes.includes(route)},getFullRouteKey(){const hash=window.location.hash;return hash},async renderPage(){if(this.isRendering){return}
if(this.initializeRoute()){return}
const currentHash=window.location.hash;const currentFullKey=this.getFullRouteKey();if(currentHash===this.navigationState.lastHash){return}
this.isRendering=!0;try{const hideNavbarRoutes=["#/login","#/register","#/otp","#/verify-email","#/forgot-password","#/reset-password","#/setup-teacher-password","#/resend-teacher-setup","#/401","#/403","#/404"];if(AuthGuard.handleOtpRedirect()){this.navigationState.lastHash=currentHash;return}
const currentRoute=currentHash.replace("#","");const access=AuthGuard.checkRouteAccess(currentRoute);const navbarElement=document.querySelector("navbar");const main=document.querySelector("#main-content");if(!main){console.warn("Element #main-content tidak ditemukan");return}
if(!access.allowed){await this.renderAccessDeniedPage(access.reason,navbarElement,main);this.navigationState.lastHash=currentHash;return}
await this.updateNavbarOptimized(navbarElement,hideNavbarRoutes,currentHash);await this.renderNormalPageOptimized(main,navbarElement,currentRoute,currentFullKey);this.navigationState.lastHash=currentHash}catch(error){console.error('Error in renderPage:',error);const main=document.querySelector("#main-content");if(main){this.showFallbackError(main,"Critical Error",error.message)}}finally{this.isRendering=!1}},async updateNavbarOptimized(navbarElement,hideNavbarRoutes,currentHash){if(!navbarElement)return;const shouldHide=hideNavbarRoutes.includes(currentHash);const currentNavbarState={hidden:shouldHide,hash:currentHash};if(this.navigationState.lastNavbarState&&this.navigationState.lastNavbarState.hidden===currentNavbarState.hidden&&this.navigationState.lastNavbarState.hash===currentNavbarState.hash){return}
if(shouldHide){if(navbarElement.style.display!=="none"){navbarElement.style.display="none";navbarElement.innerHTML=""}}else{if(navbarElement.style.display==="none"){navbarElement.style.display="block"}
const navbarComponent=navbar();const newContent=navbarComponent.render();if(navbarElement.innerHTML!==newContent){navbarElement.innerHTML=newContent;if(typeof navbarComponent.afterRender==='function'){try{await navbarComponent.afterRender()}catch(error){console.warn('Navbar afterRender error:',error)}}}}
this.navigationState.lastNavbarState=currentNavbarState},async renderNormalPageOptimized(main,navbarElement,currentRoute,currentFullKey){const url=UrlParser.parseActiveUrlWithCombiner();const page=routes[url];const shouldSkipRender=this.currentRoute===url&&this.currentContent&&this.currentFullHash===currentFullKey&&!this.isDynamicRoute(url);if(shouldSkipRender){console.log(`Skipping render for static route: ${url}`);return}
if(this.isDynamicRoute(url)||this.currentFullHash!==currentFullKey){console.log(`Force re-render for dynamic route or hash change: ${url}`);this.currentRoute=null;this.currentContent=null}
if(!page){console.warn(`Route "${url}" belum tersedia di routes.`);if(navbarElement&&navbarElement.style.display!=="none"){navbarElement.style.display="none"}
try{const content=NotFoundPage.render();if(main.innerHTML!==content){main.innerHTML=content}
if(typeof NotFoundPage.afterRender==='function'){try{await NotFoundPage.afterRender()}catch(error){console.error('Error in 404 afterRender:',error)}}}catch(error){console.error('Error rendering 404 page:',error);this.showFallbackError(main,"404 - Page Not Found",error.message)}
this.currentRoute=url;this.currentContent=main.innerHTML;this.currentFullHash=currentFullKey;return}
try{let newContent=null;if(typeof page.render==="function"){if(this.isDynamicRoute(url)){console.log(`Rendering dynamic route: ${url} with hash: ${currentFullKey}`)}
newContent=await page.render();if(newContent&&main.innerHTML!==newContent){const fragment=document.createDocumentFragment();const tempDiv=document.createElement('div');tempDiv.innerHTML=newContent;while(tempDiv.firstChild){fragment.appendChild(tempDiv.firstChild)}
main.innerHTML='';main.appendChild(fragment)}}else{await page.render();newContent=main.innerHTML}
if(typeof page.afterRender==="function"){try{await page.afterRender()}catch(error){console.error(`Error in afterRender for page "${url}":`,error)}}
this.currentRoute=url;this.currentContent=newContent||main.innerHTML;this.currentFullHash=currentFullKey}catch(error){console.error(`Error rendering page "${url}":`,error);this.showFallbackError(main,"Halaman Bermasalah",error.message)}},async renderAccessDeniedPage(reason,navbarElement,main){if(navbarElement&&navbarElement.style.display!=="none"){navbarElement.style.display="none";navbarElement.innerHTML=""}
try{let pageComponent;switch(reason){case "already_authenticated":window.location.hash="#/dashboard";return;case "not_authenticated":pageComponent=UnauthorizedPage;break;case "insufficient_role":pageComponent=ForbiddenPage;break;default:console.warn(`Unknown access denial reason: ${reason}`);this.showFallbackError(main,`Access Denied: ${reason}`);return}
const content=pageComponent.render();if(main.innerHTML!==content){main.innerHTML=content}
if(typeof pageComponent.afterRender==='function'){try{await pageComponent.afterRender()}catch(error){console.error(`Error in ${reason} afterRender:`,error)}}}catch(error){console.error(`Error rendering access denied page for reason "${reason}":`,error);this.showFallbackError(main,"Access Denied",error.message)}},showFallbackError(container,title,message=null){const errorContent=`
      <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div class="text-center max-w-md px-4">
          <div class="bg-red-100 dark:bg-red-900/20 rounded-full p-4 w-20 h-20 mx-auto mb-4">
            <svg class="w-12 h-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">${title}</h2>
          ${message ? `<p class="text-gray-600 dark:text-gray-400 mb-6 text-sm">${message}</p>` : ''}
          <p class="text-gray-600 dark:text-gray-400 mb-6">Terjadi kesalahan saat memuat halaman ini.</p>
          <div class="space-y-2">
            <button 
              onclick="location.reload()"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full justify-center"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Muat Ulang
            </button>
            <button 
              onclick="window.location.hash = '#/dashboard'"
              class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition w-full justify-center"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
              </svg>
              Ke Dashboard
            </button>
          </div>
        </div>
      </div>
    `;if(container.innerHTML!==errorContent){container.innerHTML=errorContent}},clearNavigationCache(){this.currentRoute=null;this.currentContent=null;this.currentFullHash='';this.navigationState={lastHash:'',lastNavbarState:null,lastSidebarState:null}},forceReRender(){this.currentRoute=null;this.currentContent=null;this.currentFullHash=''}};let renderTimeout;let isInitialized=!1;const debouncedRender=()=>{if(renderTimeout){clearTimeout(renderTimeout)}
renderTimeout=setTimeout(async()=>{try{await App.renderPage()}catch(error){console.error('Error during page render:',error);const main=document.querySelector("#main-content");if(main){App.showFallbackError(main,"Critical Error","Unable to render page")}}},5)};document.addEventListener("DOMContentLoaded",()=>{if(isInitialized)return;isInitialized=!0;window.addEventListener("hashchange",(event)=>{console.log("Hash changed to:",window.location.hash);if(event.preventDefault){event.preventDefault()}
const currentHash=window.location.hash;const isDynamicRoute=currentHash.includes('/course/session')||currentHash.includes('/course/flashcards')||currentHash.includes('/course/final-exam');if(isDynamicRoute){console.log('Dynamic route detected, forcing re-render');App.forceReRender()}
debouncedRender()});console.log("Initial page load, hash:",window.location.hash);debouncedRender()});window.addEventListener('unhandledrejection',(event)=>{console.error('Unhandled promise rejection:',event.reason);event.preventDefault()});window.addEventListener('error',(event)=>{console.error('JavaScript error:',event.error)});window.addEventListener('clear-navigation-cache',()=>{App.clearNavigationCache()});window.addEventListener('force-rerender',()=>{App.forceReRender();debouncedRender()});export default App