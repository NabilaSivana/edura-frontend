//component/courseCardItem.js
export function createCourseCard(course) {
  const card = document.createElement("div");
  card.className =
    "border rounded-lg shadow-md p-5 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:shadow-lg transition";

  const header = document.createElement("div");
  header.className = "flex justify-between items-center";

  const img = document.createElement("img");
  img.src = "/knowledge.png";
  img.alt = "Course Icon";
  img.width = 50;
  img.height = 50;

  const level = (course.level || "").toLowerCase();
  const levelColors = {
    beginner: "bg-blue-600",
    intermediate: "bg-orange-500",
    expert: "bg-red-600",
  };
  const badgeColor = levelColors[level] || "bg-gray-400";

  const label = document.createElement("span");
  label.className = `text-xs px-2 py-1 rounded-full text-white capitalize ${badgeColor}`;
  label.textContent = course.level || "unknown";

  header.appendChild(img);
  header.appendChild(label);
  card.appendChild(header);

  const title = document.createElement("h2");
  title.className =
    "mt-3 font-semibold text-md line-clamp-3 break-words text-gray-800 dark:text-white";
  title.textContent = course.title || "Untitled Course";
  card.appendChild(title);

  const verifyBadge = document.createElement("p");
  verifyBadge.className =
    "text-xs mt-1 rounded px-2 py-1 inline-block dark:text-white";
  if (course.is_verified) {
    verifyBadge.textContent = `Terverifikasi oleh ${course.verified_by} ✅`;
    verifyBadge.classList.add(
      "bg-green-100",
      "dark:bg-green-900",
      "text-green-700",
      "dark:text-green-300"
    );
  } else {
    verifyBadge.textContent = "Belum terverifikasi 🕗";
    verifyBadge.classList.add(
      "bg-yellow-100",
      "dark:bg-yellow-900",
      "text-yellow-700",
      "dark:text-yellow-300"
    );
  }
  card.appendChild(verifyBadge);

  const checkpoint = course.checkpoint ?? 0;
  const progressPercent = Math.min((checkpoint / 16) * 100, 100).toFixed(2);

  const progressLabel = document.createElement("p");
  progressLabel.className = "text-sm text-gray-600 dark:text-gray-300 mt-2";
  progressLabel.textContent = `Progress: ${progressPercent}%`;
  card.appendChild(progressLabel);

  const progressBar = document.createElement("div");
  progressBar.className =
    "w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1";

  const progress = document.createElement("div");
  progress.className = "h-2 rounded-full bg-blue-600 transition-all";
  progress.style.width = `${progressPercent}%`;
  progressBar.appendChild(progress);
  card.appendChild(progressBar);

  const totalSessions = document.createElement("p");
  totalSessions.className = "text-sm text-gray-500 dark:text-gray-300 mt-2";
  totalSessions.textContent = `Total Chapter: ${course.total_sessions ?? 0}`;
  card.appendChild(totalSessions);

  const status = document.createElement("p");
  status.className = "text-xs text-gray-500 dark:text-gray-400 italic mt-1";
  status.textContent = course.is_completed
    ? "Kursus selesai"
    : "Sedang berjalan";
  card.appendChild(status);

  const footer = document.createElement("div");
  footer.className = "mt-3 flex justify-end";

  const viewButton = document.createElement("button");

  if (course.isGenerating) {
    viewButton.innerHTML = `
      <span class="flex items-center justify-center gap-2">
        <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        Generating...
      </span>
    `;
    viewButton.disabled = true;
    viewButton.className =
      "bg-gray-400 text-white px-4 py-1 rounded flex items-center justify-center";
  } else {
    viewButton.className =
      "bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition";
    viewButton.textContent = course.is_completed
      ? "Lihat Hasil"
      : "Lanjut Belajar";

    viewButton.addEventListener("click", () => {
      sessionStorage.setItem("current_course_id", course.course_id);
      window.location.hash = "#/course";
    });
  }

  footer.appendChild(viewButton);
  card.appendChild(footer);

  return card;
}
