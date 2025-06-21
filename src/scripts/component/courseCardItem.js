export function createCourseCard(course) {
  const card = document.createElement("div");
  card.className = "border rounded-lg shadow-md p-5 bg-white hover:shadow-lg transition";

  // Header
  const header = document.createElement("div");
  header.className = "flex justify-between items-center";

  const img = document.createElement("img");
  img.src = "/knowledge.png";
  img.alt = "Course Icon";
  img.width = 50;
  img.height = 50;

  // Badge with color by level
  const level = (course.level || "").toLowerCase();
  const levelColors = {
    beginner: "bg-blue-600",
    intermediate: "bg-orange-500",
    advanced: "bg-red-600",
  };
  const badgeColor = levelColors[level] || "bg-gray-400";

  const label = document.createElement("span");
  label.className = `text-xs px-2 py-1 rounded-full text-white capitalize ${badgeColor}`;
  label.textContent = course.level || "unknown";

  header.appendChild(img);
  header.appendChild(label);
  card.appendChild(header);

  // Title
  const title = document.createElement("h2");
  title.className = "mt-3 font-semibold text-md line-clamp-3 break-words";
  title.textContent = course.title || "Untitled Course";
  card.appendChild(title);

  // Progress %
  const checkpoint = course.checkpoint ?? 0;
  const progressPercent = Math.min((checkpoint / 16) * 100, 100).toFixed(2);

  const progressLabel = document.createElement("p");
  progressLabel.className = "text-sm text-gray-600 mt-2";
  progressLabel.textContent = `Progress: ${progressPercent}%`;
  card.appendChild(progressLabel);

  // Progress bar visual
  const progressBar = document.createElement("div");
  progressBar.className = "w-full bg-gray-200 rounded-full h-2 mt-1";

  const progress = document.createElement("div");
  progress.className = "h-2 rounded-full bg-blue-600 transition-all";
  progress.style.width = `${progressPercent}%`;
  progressBar.appendChild(progress);
  card.appendChild(progressBar);

  // Session info
  const totalSessions = document.createElement("p");
  totalSessions.className = "text-sm text-gray-500 mt-2";
  totalSessions.textContent = `Chapter saat ini: ${course.total_sessions ?? 0}`;
  card.appendChild(totalSessions);

  // Status
  const status = document.createElement("p");
  status.className = "text-xs text-gray-500 italic mt-1";
  status.textContent = course.is_completed ? "Kursus selesai" : "Sedang berjalan";
  card.appendChild(status);

  // Footer
  const footer = document.createElement("div");
  footer.className = "mt-3 flex justify-end";

  const viewLink = document.createElement("a");
  viewLink.href = `/course/${course.course_id}`;

  const viewButton = document.createElement("button");
  viewButton.className = "bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition";
  viewButton.textContent = course.is_completed ? "Lihat Hasil" : "Lanjut Belajar";

  viewLink.appendChild(viewButton);
  footer.appendChild(viewLink);
  card.appendChild(footer);

  return card;
}
