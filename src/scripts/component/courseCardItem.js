// course-card-item.js

export function createCourseCard(course) {
  const card = document.createElement("div");
  card.className = "border rounded-lg shadow-md p-5";

  // Header: icon + date
  const header = document.createElement("div");
  header.className = "flex justify-between items-center";

  const img = document.createElement("img");
  img.src = "/knowledge.png";
  img.alt = "other";
  img.width = 50;
  img.height = 50;

  const date = document.createElement("h2");
  date.className = "text-[10px] p-1 px-2 rounded-full bg-blue-600 text-white";

  const rawDate = course?.createdAt || course?.timestamp || Date.now();
  const formattedDate = new Date(rawDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  date.textContent = formattedDate;

  header.appendChild(img);
  header.appendChild(date);
  card.appendChild(header);

  // Title
  const title = document.createElement("h2");
  title.className = "mt-3 font-medium text-lg";
  title.textContent =
    course?.courseLayout?.course_title ||
    course?.courseLayout?.courseTitle ||
    "Untitled Course";
  card.appendChild(title);

  // Summary
  const summary = document.createElement("p");
  summary.className = "text-sm text-gray-500 mt-2";
  summary.textContent = course?.courseLayout?.summary || "No description";
  card.appendChild(summary);

  // Placeholder for future Progress bar
  const progressWrapper = document.createElement("div");
  progressWrapper.className = "mt-3";
  card.appendChild(progressWrapper);

  // Footer (button/status)
  const footer = document.createElement("div");
  footer.className = "mt-3 flex justify-end";

  if (course?.status === "Generating") {
    const status = document.createElement("h2");
    status.className =
      "text-sm p-1 px-2 flex gap-2 items-center rounded-full bg-gray-400 text-white";

    // Icon as emoji or SVG if needed
    status.innerHTML = `<span class="animate-spin">🔄</span> Generating...`;
    footer.appendChild(status);
  } else {
    const viewLink = document.createElement("a");
    viewLink.href = "/course/" + course?.courseId;

    const viewButton = document.createElement("button");
    viewButton.className = "bg-blue-600 text-white px-4 py-1 rounded";
    viewButton.textContent = "View";

    viewLink.appendChild(viewButton);
    footer.appendChild(viewLink);
  }

  card.appendChild(footer);

  return card;
}
export function renderCourseCards(courseList) {
  const container = document.getElementById("course-container");
  container.innerHTML = ""; // Clear previous content

  if (!courseList || courseList.length === 0) {
    const noCourses = document.createElement("p");
    noCourses.textContent = "No courses available.";
    container.appendChild(noCourses);
    return;
  }

  courseList.forEach((course) => {
    const card = createCourseCard(course);
    container.appendChild(card);
  });
}
