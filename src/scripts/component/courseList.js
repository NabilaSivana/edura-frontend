// course-list.js

// Simulasi data user (biasanya dari Clerk)
const user = {
  primaryEmailAddress: {
    emailAddress: "user@example.com",
  },
};

// Simulasi global state (CourseCountContext)
let totalCourse = 0;

function setTotalCourse(count) {
  totalCourse = count;
  console.log("Total course updated:", totalCourse);
}

// State
let courseList = [];
let loading = false;

// Ambil list course dari API
async function GetCourseList() {
  if (!user) return;

  loading = true;
  renderCourseList(); // update tampilan loading

  try {
    const response = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        createdBy: user.primaryEmailAddress.emailAddress,
      }),
    });

    const data = await response.json();
    courseList = data.result || [];
    setTotalCourse(courseList.length);
  } catch (error) {
    console.error("Error fetching courses:", error);
    courseList = [];
  }

  loading = false;
  renderCourseList(); // update tampilan akhir
}

function renderCourseList() {
  const container = document.getElementById("course-container");
  container.innerHTML = ""; // reset

  // Judul dan tombol
  const header = document.createElement("h2");
  header.className = "font-bold text-2xl flex justify-between items-center";

  const title = document.createElement("span");
  title.textContent = "Your Study Material";

  const refreshBtn = document.createElement("button");
  refreshBtn.className =
    "border border-blue-600 text-blue-600 px-3 py-1 rounded flex items-center gap-2";
  refreshBtn.innerHTML = "🔄 Refresh";
  refreshBtn.addEventListener("click", GetCourseList);

  header.appendChild(title);
  header.appendChild(refreshBtn);
  container.appendChild(header);

  // Grid container
  const grid = document.createElement("div");
  grid.className = "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 mt-2 gap-5";

  if (loading) {
    // Skeleton loading
    for (let i = 0; i < 6; i++) {
      const skeleton = document.createElement("div");
      skeleton.className = "h-56 w-full bg-slate-200 rounded-lg animate-pulse";
      grid.appendChild(skeleton);
    }
  } else {
    courseList.forEach((course) => {
      const card = document.createElement("div");
      card.className = "border p-3 rounded shadow";
      card.innerHTML = `
        <h3 class="font-semibold text-lg mb-2">${
          course.title || "Untitled"
        }</h3>
        <p>${course.description || "No description available."}</p>
      `;
      grid.appendChild(card);
    });
  }

  container.appendChild(grid);
}

// Jalankan saat halaman siap
document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");

  const container = document.createElement("div");
  container.id = "course-container";
  container.className = "mt-10";

  app.appendChild(container);

  GetCourseList();
});
