//component/courseList.js
import CONFIG from "../config.js";
import { createCourseCard } from "./courseCardItem.js";

let loading = false;

export async function renderCourseList(
  containerId = "course-container",
  externalCourses = null
) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = ""; // Kosongkan isi sebelumnya

  const grid = document.createElement("div");
  grid.className = `
    grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6
  `;

  try {
    let courses;

    if (externalCourses) {
      courses = externalCourses;
    } else {
      // Tampilkan skeleton
      for (let i = 0; i < 6; i++) {
        const skeleton = document.createElement("div");
        skeleton.className =
          "h-56 w-full bg-slate-200 rounded-xl animate-pulse shadow-inner";
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
      courses = Array.isArray(data) ? data : [];
    }

    grid.innerHTML = ""; // Clear skeleton

    if (courses.length === 0) {
      container.innerHTML = `
        <div class="text-center w-full p-10 bg-white rounded-lg shadow text-gray-500">
          <p class="text-lg font-medium">Belum ada kursus</p>
          <p class="text-sm mt-2">Yuk mulai dengan membuat kursus pertama kamu!</p>
        </div>
      `;
      return;
    }

    courses.forEach((course) => {
      const card = createCourseCard(course);
      grid.appendChild(card);
    });

    container.innerHTML = "";
    container.appendChild(grid);
  } catch (error) {
    container.innerHTML = `
      <div class="text-center w-full p-6 bg-red-100 text-red-700 rounded-md shadow">
        <p class="font-semibold">Gagal memuat kursus</p>
        <p class="text-sm mt-1">Silakan coba lagi nanti.</p>
      </div>
    `;
  }
}
