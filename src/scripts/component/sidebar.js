function createSidebar(totalCourse = 0) {
  const wrapper = document.createElement("div");
  wrapper.className = "relative h-full";

  const sidebar = document.createElement("div");
  sidebar.id = "sidebar";
  sidebar.className = `
    h-full w-64 bg-white shadow-md p-5 z-50 
    flex flex-col gap-6 overflow-y-auto
    fixed md:relative top-0 left-0
    transform -translate-x-full md:translate-x-0 
    transition-transform duration-300 ease-in-out
  `;

  // Logo
  const logoWrapper = document.createElement("div");
  logoWrapper.className = "flex items-center gap-2 mb-4";
  const logoImg = document.createElement("img");
  logoImg.src = "/logo2.png";
  logoImg.alt = "logo";
  logoImg.className = "w-10 h-10 object-contain";
  const logoText = document.createElement("h1");
  logoText.className = "text-xl font-semibold";
  logoText.textContent = "EduraApp";
  logoWrapper.appendChild(logoImg);
  logoWrapper.appendChild(logoText);
  sidebar.appendChild(logoWrapper);

  // Tombol Create
  const createLink = document.createElement("a");
  createLink.href = "#/create";
  createLink.className = "w-full";

  const createBtn = document.createElement("button");
  createBtn.className =
    "w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50";
  createBtn.textContent = "+ Create New";
  if (totalCourse >= 5) createBtn.disabled = true;

  createLink.appendChild(createBtn);
  sidebar.appendChild(createLink);

  // Menu Navigasi
  const menuList = [
    { name: "Dashboard", icon: "📊", path: "#/dashboard" },
    { name: "Upgrade", icon: "🛡️", path: "#/upgrade" },
    { name: "Profile", icon: "👤", path: "#/profile" },
  ];

  const menuWrapper = document.createElement("div");
  menuWrapper.className = "flex flex-col gap-2";
  const currentPath = window.location.hash;

  menuList.forEach((menu) => {
    const link = document.createElement("a");
    link.href = menu.path;
    const item = document.createElement("div");
    item.className = `flex gap-4 items-center p-3 hover:bg-slate-200 rounded-lg cursor-pointer ${
      currentPath === menu.path ? "bg-slate-200" : ""
    }`;

    const icon = document.createElement("span");
    icon.textContent = menu.icon;

    const label = document.createElement("h2");
    label.textContent = menu.name;
    label.className = "text-base";

    item.appendChild(icon);
    item.appendChild(label);
    link.appendChild(item);
    menuWrapper.appendChild(link);
  });

  sidebar.appendChild(menuWrapper);

  // Info Kredit
  const creditBox = document.createElement("div");
  creditBox.className =
    "border p-4 bg-slate-100 rounded-lg mt-auto w-full text-sm";
  const availableText = document.createElement("h2");
  availableText.className = "text-base font-semibold mb-2";
  availableText.textContent = `Available Credits: ${5 - totalCourse}`;
  creditBox.appendChild(availableText);

  const progressBar = document.createElement("div");
  progressBar.className = "w-full h-2 bg-gray-300 rounded mb-2";
  const progress = document.createElement("div");
  progress.className = "h-full bg-blue-500 rounded";
  progress.style.width = `${(totalCourse / 5) * 100}%`;
  progressBar.appendChild(progress);
  creditBox.appendChild(progressBar);

  const usedText = document.createElement("h2");
  usedText.className = "text-sm";
  usedText.textContent = `${totalCourse} Out of 5 Credits Used`;
  creditBox.appendChild(usedText);

  const upgradeLink = document.createElement("a");
  upgradeLink.href = "/dashboard/upgrade";
  upgradeLink.className = "text-blue-600 text-xs mt-2 inline-block";
  upgradeLink.textContent = "Upgrade to create more";
  creditBox.appendChild(upgradeLink);

  sidebar.appendChild(creditBox);

  // Overlay untuk mobile
  const overlay = document.createElement("div");
  overlay.id = "sidebar-overlay";
  overlay.className =
    "fixed inset-0 bg-black bg-opacity-30 z-40 hidden md:hidden";
  overlay.addEventListener("click", () => {
    sidebar.classList.add("-translate-x-full");
    overlay.classList.add("hidden");
  });

  sidebar.addEventListener("transitionend", () => {
    const isOpen = !sidebar.classList.contains("-translate-x-full");
    overlay.classList.toggle("hidden", !isOpen);
  });

  wrapper.appendChild(overlay);
  wrapper.appendChild(sidebar);

  return wrapper;
}

export default createSidebar;
 