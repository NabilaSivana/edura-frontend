import { createMaterialCardItem } from "./material-card-item.js";

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
      desc: "Read notes to prepare it",
      icon: "/notes.png",
      path: "/notes",
      type: "notes",
    },
    {
      name: "Flashcard",
      desc: "Flashcard to remember the concepts",
      icon: "/flashcard.png",
      path: "/flashcards",
      type: "flashcard",
    },
    {
      name: "Quiz",
      desc: "Great way to test your knowledge",
      icon: "/quiz.png",
      path: "/quiz",
      type: "quiz",
    },
    {
      name: "Question/Answer",
      desc: "Help to pratice your learning",
      icon: "/qa.png",
      path: "/qa",
      type: "qa",
    },
  ];

  const getStudyMaterial = async () => {
    try {
      const response = await fetch("/api/study-type", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: courseId, studyType: "ALL" }),
      });
      const data = await response.json();
      grid.innerHTML = "";

      MaterialList.forEach((item) => {
        const card = createMaterialCardItem({
          item,
          studyTypeContent: data,
          course,
          refreshData: getStudyMaterial,
        });
        grid.appendChild(card);
      });
    } catch (err) {
      console.error("Failed to fetch material:", err);
    }
  };

  getStudyMaterial();

  return container;
}

export { renderStudyMaterialSection };
