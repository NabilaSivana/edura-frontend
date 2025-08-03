import Api from "../data/api.js";
import { showToastNotification } from "../utils/index.js";

function createMaterialCardItem({
  item,
  studyTypeContent,
  courseId,
  course,
  refreshData,
}) {
  const card = document.createElement("div");
  card.className =
    "bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow";

  const isReady = studyTypeContent[item.type]?.ready || false;
  const statusColor = isReady ? "text-green-600" : "text-yellow-600";
  const statusText = isReady ? "Ready" : "Not Ready";

  // Button text & action
  let buttonText = "Generate";
  let buttonAction = "generate";

  if (item.type === "flashcard" && isReady) {
    buttonText = "View";
    buttonAction = "view";
  } else if (item.type !== "flashcard") {
    buttonText = isReady ? "Start" : "Generate";
    buttonAction = isReady ? "start" : "generate";
  }

  card.innerHTML = `
    <div class="flex items-center mb-3">
      <img src="${item.icon}" alt="${item.name}" class="w-8 h-8 mr-3">
      <div class="flex-1">
        <h3 class="font-semibold text-gray-800 dark:text-white">${item.name}</h3>
        <p class="text-sm ${statusColor}">${statusText}</p>
      </div>
    </div>
    <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">${item.desc}</p>
    <button 
      id="btn-${item.type}" 
      class="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      data-action="${buttonAction}"
      data-type="${item.type}"
    >
      ${buttonText}
    </button>
  `;

  const button = card.querySelector(`#btn-${item.type}`);
  button.addEventListener("click", async () => {
    await handleMaterialAction({
      type: item.type,
      action: buttonAction,
      courseId,
      course,
      refreshData,
      button,
    });
  });

  return card;
}

async function handleMaterialAction({
  type,
  action,
  courseId,
  course,
  refreshData,
  button,
}) {
  const originalText = button.textContent;

  try {
    button.disabled = true;

    if (type === "flashcard") {
      if (action === "generate") {
        button.textContent = "Generating...";
        const response = await Api.generateFlashcards(courseId);

        if (
          response.status === "success" ||
          response.message?.includes("berhasil")
        ) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          await refreshData();
          showToastNotification("Flashcards berhasil digenerate!", "success");
        } else {
          throw new Error(response.message || "Gagal generate flashcards");
        }
      } else if (action === "view") {
        window.location.hash = `#/course/flashcards?course_id=${courseId}`;
      }
    } else if (type === "notes") {
      window.location.hash = "#/course/notes";
    } else if (type === "qa") {
      if (action === "generate") {
        button.textContent = "Generating...";

        try {
          const response = await Api.generateFinalExam(courseId);

          ////console.log("Generate Final Exam Response:", response);

          // Perbaiki kondisi pengecekan response
          // Sesuaikan dengan response: {"message":"Proses generate final exam dimulai.","status":"generating"}
          if (
            response.status === "generating" ||
            response.status === "success" ||
            response.message?.includes("dimulai") ||
            response.message?.includes("berhasil") ||
            response.message?.includes("final exam")
          ) {
            showToastNotification(
              "Final exam generation started successfully!",
              "success"
            );

            // Tunggu beberapa detik untuk proses generate selesai
            ////console.log("Waiting for generation to complete...");
            await new Promise((resolve) => setTimeout(resolve, 3000));

            // Refresh data berkali-kali untuk memastikan status terupdate
            ////console.log("Refreshing data...");
            await refreshData();

            // Tunggu lagi dan refresh sekali lagi jika perlu
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await refreshData();
          } else {
            throw new Error(
              response.message || "Failed to generate final exam"
            );
          }
        } catch (error) {
          console.error("Final exam generation error:", error);
          showToastNotification(
            error.message || "Failed to generate final exam",
            "error"
          );
          button.textContent = originalText;
        }
      } else if (action === "start") {
        window.location.hash = `#/course/final-exam?course_id=${courseId}`;
      }
    }
  } catch (error) {
    console.error(`Error handling ${type} ${action}:`, error);
    showToastNotification(error.message || `Gagal ${action} ${type}`, "error");
    button.textContent = originalText;
  } finally {
    button.disabled = false;
  }
}

export { createMaterialCardItem };

