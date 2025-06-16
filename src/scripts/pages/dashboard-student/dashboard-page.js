import DashboardStudentPresenter from "../dashboard-student/dashboard-student-presenter.js";
import createSidebar from "../../component/sidebar.js";
import WelcomeBanner from "../../component/wellcome-banner.js";
import { renderCourseCards } from "../../component/courseCardItem.js";

const DashboardStudentPage = {
  async render() {
    return `
      <div class="flex w-screen h-screen">
        <!-- Sidebar -->
        <div id="sidebar-container"></div>

        <!-- Main Content -->
        <main class="flex-1 p-10 bg-gray-50">
          <div id="welcome-container" class="mb-6"></div>

          <section class="mt-8">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold">Your Study Material</h2>
              <button id="refresh-courses" class="border border-blue-600 text-blue-600 px-3 py-1 rounded hover:bg-blue-50">Refresh</button>
            </div>
            <div id="course-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <!-- Course cards will be inserted here -->
            </div>
          </section>
        </main>
      </div>
    `;
  },

  async afterRender() {
     const footer = document.querySelector("footer");
    if (footer) footer.style.display = "none";
    // Sidebar
    document.getElementById("sidebar-container").appendChild(createSidebar());

    // Welcome banner
    document
      .getElementById("welcome-container")
      .appendChild(WelcomeBanner("Nabila Ihza"));

    // Render Courses
    const courseList = await DashboardStudentPresenter.getCourses();
    renderCourseCards(courseList);

    // Refresh handler
    document
      .getElementById("refresh-courses")
      .addEventListener("click", async () => {
        const updatedCourses = await DashboardStudentPresenter.getCourses();
        renderCourseCards(updatedCourses);
      });
  },
};

export default DashboardStudentPage;
