// === presenter/admin-course-presenter.js ===
import AdminCourseModel from "./model.js";

const AdminCoursePresenter = {
    async init() {
        await this.loadCourses();
    },

    async loadCourses() {
        const courseList = document.getElementById("course-list");
        const loading = document.getElementById("course-loading");
        loading.style.display = "block";

        try {
            const { data } = await AdminCourseModel.getAllCourses();
            loading.style.display = "none";
            courseList.innerHTML = data
                .map((course) => `
          <div class="p-4 border rounded shadow bg-white">
            <h2 class="font-semibold text-lg">${course.title}</h2>
            <p class="text-sm text-gray-600">${course.subject} • ${course.level}</p>
            <div class="mt-2 flex gap-2">
              <button data-id="${course.id}" class="view-btn text-blue-600">Lihat</button>
              <button data-id="${course.id}" class="delete-btn text-red-600">Hapus</button>
            </div>
          </div>
        `)
                .join("");

            document.querySelectorAll(".delete-btn").forEach((btn) => {
                btn.addEventListener("click", async (e) => {
                    const id = e.target.dataset.id;
                    await AdminCourseModel.deleteCourse(id);
                    await this.loadCourses();
                });
            });

            document.querySelectorAll(".view-btn").forEach((btn) => {
                btn.addEventListener("click", async (e) => {
                    const id = e.target.dataset.id;
                    const course = await AdminCourseModel.getCourseDetail(id);
                    alert(JSON.stringify(course, null, 2));
                });
            });
        } catch (err) {
            loading.innerText = err.message;
        }
    },
};

export default AdminCoursePresenter;
