// courseCardItem.js
export function createCourseCard(course) {
  const card = document.createElement("div");
  card.className = "border rounded-lg shadow-md p-5";

  // Header
  const header = document.createElement("div");
  header.className = "flex justify-between items-center";

  const img = document.createElement("img");
  img.src = "/knowledge.png";
  img.alt = "Course Icon";
  img.width = 50;
  img.height = 50;

  const label = document.createElement("span");
  label.className = "text-[10px] p-1 px-2 rounded-full bg-blue-600 text-white capitalize";
  label.textContent = course.level || "unknown";

  header.appendChild(img);
  header.appendChild(label);
  card.appendChild(header);

  // Title
  const title = document.createElement("h2");
  title.className = "mt-3 font-medium text-lg";
  title.textContent = course.title || "Untitled Course";
  card.appendChild(title);

  // Checkpoint
  const checkpoint = document.createElement("p");
  checkpoint.className = "text-sm text-gray-600 mt-2";
  // Calculate checkpoint percentage
  const checkpointPercentage = course.checkpoint ? (course.checkpoint / 16) * 100 : 0;
  checkpoint.textContent = `Progress: (${checkpointPercentage.toFixed(2)}%)`;
  // Fallback if checkpoint is not available
  if (course.checkpoint === undefined) {
    checkpoint.textContent = "Checkpoint tidak tersedia";
  }
  card.appendChild(checkpoint);

  // Sessions
  const totalSessions = document.createElement("p");
  totalSessions.className = "text-sm text-gray-500";
  totalSessions.textContent = `Chapter saat ini: ${course.total_sessions ?? 0}`;
  card.appendChild(totalSessions);

  // Status
  const status = document.createElement("p");
  status.className = "text-xs text-gray-500 mt-1 italic";
  status.textContent = course.is_completed ? "Kursus selesai" : "Sedang berjalan";
  card.appendChild(status);

  // Footer
  const footer = document.createElement("div");
  footer.className = "mt-3 flex justify-end";

  const viewLink = document.createElement("a");
  viewLink.href = `/course/${course.course_id}`;

  const viewButton = document.createElement("button");
  viewButton.className = "bg-blue-600 text-white px-4 py-1 rounded";
  viewButton.textContent = course.is_completed ? "Lihat Hasil" : "Lanjut Belajar";

  viewLink.appendChild(viewButton);
  footer.appendChild(viewLink);
  card.appendChild(footer);

  return card;
}
