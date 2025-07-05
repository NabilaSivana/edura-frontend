// File: src/scripts/component/studyMaterialSection.js
import { createMaterialCardItem } from "./material-card-item.js";
import Api from "../data/api.js"; // pastikan path sesuai

function renderStudyMaterialSection(courseId, course) {
  const container = document.createElement("div");
  container.className = "mt-5";

  const heading = document.createElement("h2");
  heading.className = "font-medium text-xl";
  heading.innerText = "Study Material";
  container.appendChild(heading);

  const grid = document.createElement("div");
  grid.className = "grid grid-cols-2 md:grid-cols-4 gap-5 mt-3";
  container.appendChild(grid);

  const MaterialList = [
    {
      name: "Notes/Chapters",
      desc: "Baca notes untuk mempersiapkan ini",
      icon: "/notes.png",
      path: "/notes",
      type: "notes",
    },
    {
      name: "Flashcard",
      desc: "Flashcard untuk mengingat konsep",
      icon: "/flashcard.png",
      path: "/flashcards",
      type: "flashcard",
    },
    {
      name: "Final Exam",
      desc: "Membantu praktik belajar anda",
      icon: "/qa.png",
      path: "/final-exam",
      type: "qa",
    },
  ];

  const getStudyMaterial = async () => {
    try {
      const courseStatus = await Api.getStudentCourseStatus(courseId);
      const studyTypeContent = {
        notes: { ready: true }, // catatan dianggap selalu ready
        quiz: { ready: courseStatus.quiz_ready },
        flashcard: { ready: courseStatus.flashcard_ready },
        qa: { ready: courseStatus.final_exam_ready },
      };

      grid.innerHTML = "";
      MaterialList.forEach((item) => {
        const card = createMaterialCardItem({
          item,
          studyTypeContent,
          courseId,
          course,
          refreshData: getStudyMaterial,
        });
        grid.appendChild(card);
      });
    } catch (err) {
      console.error("Gagal memuat study material:", err);
    }
  };

  getStudyMaterial();

  return container;
}

export { renderStudyMaterialSection };
