import { createMaterialCardItem } from "./material-card-item.js";
import Api from "../data/api.js";

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
      console.log("Fetching study material status...");

      // Get course status
      const courseStatus = await Api.getStudentCourseStatus(courseId);
      console.log("Course Status:", courseStatus);

      // Get flashcard status specifically
      let flashcardReady = false;
      try {
        const flashcardStatus = await Api.getFlashcardStatus(courseId);
        console.log("Flashcard Status:", flashcardStatus);
        flashcardReady =
          flashcardStatus.status === "done" || flashcardStatus.ready === true;
      } catch (error) {
        console.log("Flashcard status check failed, assuming not ready");
        flashcardReady = false;
      }

      // Check final exam status dengan berbagai kemungkinan field name dan API call tambahan
      let finalExamReady = false;

      // Cek dari course status terlebih dahulu
      if (courseStatus.final_exam_ready !== undefined) {
        finalExamReady = courseStatus.final_exam_ready;
      } else if (courseStatus.finalExamReady !== undefined) {
        finalExamReady = courseStatus.finalExamReady;
      } else if (courseStatus.qa_ready !== undefined) {
        finalExamReady = courseStatus.qa_ready;
      } else if (courseStatus.exam_ready !== undefined) {
        finalExamReady = courseStatus.exam_ready;
      }

      // Jika belum ketemu, coba call API final exam status langsung
      if (finalExamReady === false || finalExamReady === undefined) {
        try {
          console.log("Checking final exam status via dedicated API...");
          const finalExamStatus = await Api.checkFinalExamStatus(courseId);
          console.log("Final Exam Status Response:", finalExamStatus);

          // Berbagai kemungkinan response format
          if (
            finalExamStatus.status === "ready" ||
            finalExamStatus.status === "done"
          ) {
            finalExamReady = true;
          } else if (finalExamStatus.ready === true) {
            finalExamReady = true;
          } else if (
            finalExamStatus.data &&
            finalExamStatus.data.ready === true
          ) {
            finalExamReady = true;
          } else if (finalExamStatus.final_exam_ready === true) {
            finalExamReady = true;
          }
        } catch (error) {
          console.log(
            "Final exam status check failed, checking if exam exists..."
          );

          // Fallback: coba check apakah final exam sudah tersedia
          try {
            const finalExamData = await Api.checkFinalExam(courseId);
            console.log("Final Exam Check Response:", finalExamData);

            // Jika ada data exam, berarti ready
            if (
              finalExamData &&
              (finalExamData.questions || finalExamData.data)
            ) {
              finalExamReady = true;
            }
          } catch (finalError) {
            console.log("Final exam check also failed, assuming not ready");
            finalExamReady = false;
          }
        }
      }

      console.log("Final Exam Ready Status:", finalExamReady);

      const studyTypeContent = {
        notes: { ready: true }, // catatan dianggap selalu ready
        quiz: { ready: courseStatus.quiz_ready },
        flashcard: { ready: flashcardReady },
        qa: { ready: finalExamReady },
      };

      console.log("Study Type Content:", studyTypeContent);

      // Clear grid dan render ulang
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

      // Fallback: render dengan status default
      const studyTypeContent = {
        notes: { ready: true },
        quiz: { ready: false },
        flashcard: { ready: false },
        qa: { ready: false },
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

      showToastNotification("Gagal memuat study material", "error");
    }
  };

  // Initial load
  getStudyMaterial();

  return container;
}

export { renderStudyMaterialSection };
