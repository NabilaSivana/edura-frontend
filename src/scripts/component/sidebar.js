function createSidebar(totalCourse = 0) {
  const container = document.createElement("div");
  container.className = "h-screen shadow-md p-5 relative";

  // Logo
  const logoWrapper = document.createElement("div");
  logoWrapper.className = "flex gap-2 items-center";
  const logoImg = document.createElement("img");
  logoImg.src = "/logo.png";
  logoImg.alt = "logo";
  logoImg.width = 250;
  logoImg.height = 250;
  logoWrapper.appendChild(logoImg);
  container.appendChild(logoWrapper);

  // Create Button
  const createLink = document.createElement("a");
  createLink.href = "#/create";
  createLink.className = "w-full block mt-10";

  const createBtn = document.createElement("button");
  createBtn.className =
    "w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50";
  createBtn.textContent = "+ Create New";
  if (totalCourse >= 5) {
    createBtn.disabled = true;
  }

  createLink.appendChild(createBtn);
  container.appendChild(createLink);

  // Menu List
  const menuList = [
    { name: "Dashboard", icon: "📊", path: "#/dashboard" },
    { name: "Upgrade", icon: "🛡️", path: "#/upgrade" },
    { name: "Profile", icon: "👤", path: "#/profile" },
  ];

  const menuWrapper = document.createElement("div");
  menuWrapper.className = "mt-5";
  const currentPath = window.location.pathname;

  menuList.forEach((menu) => {
    const link = document.createElement("a");
    link.href = menu.path;
    const item = document.createElement("div");
    item.className = `flex gap-5 items-center p-3 hover:bg-slate-200 rounded-lg cursor-pointer mt-3 ${
      currentPath === menu.path ? "bg-slate-200" : ""
    }`;

    const icon = document.createElement("span");
    icon.textContent = menu.icon;

    const label = document.createElement("h2");
    label.textContent = menu.name;

    item.appendChild(icon);
    item.appendChild(label);
    link.appendChild(item);
    menuWrapper.appendChild(link);
  });

  container.appendChild(menuWrapper);

  // Credit Info
  const creditBox = document.createElement("div");
  creditBox.className =
    "border p-3 bg-slate-100 rounded-lg absolute bottom-10 w-[85%]";
  const availableText = document.createElement("h2");
  availableText.className = "text-lg mb-2";
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
  upgradeLink.className = "text-blue-600 text-xs mt-3 inline-block";
  upgradeLink.textContent = "Upgrade to create more";
  creditBox.appendChild(upgradeLink);

  container.appendChild(creditBox);

  return container;
}

export default createSidebar;
