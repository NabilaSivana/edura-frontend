// courseList.js
import CONFIG from "../config.js";
import { createCourseCard } from "./courseCardItem.js";

let loading = false;

export async function renderCourseList(containerId = "course-container") {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = ""; // Bersihkan kontainer

  const grid = document.createElement("div");
  grid.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";

  try {
    loading = true;

    // Skeleton Loading
    for (let i = 0; i < 6; i++) {
      const skeleton = document.createElement("div");
      skeleton.className = "h-56 w-full bg-slate-200 rounded-lg animate-pulse";
      grid.appendChild(skeleton);
    }
    container.appendChild(grid);

    const token = localStorage.getItem("token");
    const response = await fetch(`${CONFIG.BASE_URL}/student/courses`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Gagal mengambil data kursus");

    const data = await response.json();
    const courses = Array.isArray(data) ? data : [];

    loading = false;
    grid.innerHTML = ""; // Clear skeletons

    if (courses.length === 0) {
      const emptyText = document.createElement("p");
      emptyText.textContent = "Kamu belum terdaftar dalam kursus apapun.";
      container.innerHTML = "";
      container.appendChild(emptyText);
      return;
    }

    courses.forEach((course) => {
      const card = createCourseCard(course);
      grid.appendChild(card);
    });

    container.innerHTML = "";
    container.appendChild(grid);
  } catch (error) {
    loading = false;
    console.error("Gagal mengambil kursus:", error.message);
    container.innerHTML = "<p class='text-red-500'>Gagal memuat kursus. Coba lagi nanti.</p>";
  }
}
