function createMaterialCardItem({
  item,
  studyTypeContent,
  courseId,
  course,
  refreshData,
}) {
  const container = document.createElement("div");
  const isReady = studyTypeContent?.[item.type]?.ready === true;

  container.className = `
    border rounded-lg shadow-md p-5 flex flex-col items-center transition
    bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700
    text-gray-800 dark:text-white ${isReady ? "" : "grayscale opacity-60"}
  `;

  const statusTag = document.createElement("h2");
  statusTag.className = "p-1 px-2 text-white rounded-full text-[10px] mb-2";
  statusTag.innerText = isReady ? "Ready" : "Generate";
  statusTag.classList.add(isReady ? "bg-green-500" : "bg-gray-500");
  container.appendChild(statusTag);

  const iconImg = document.createElement("img");
  iconImg.src = item.icon;
  iconImg.alt = item.name;
  iconImg.width = 50;
  iconImg.height = 50;
  container.appendChild(iconImg);

  const title = document.createElement("h2");
  title.className = "font-medium mt-3";
  title.innerText = item.name;
  container.appendChild(title);

  const desc = document.createElement("p");
  desc.className = "text-gray-500 dark:text-gray-300 text-sm text-center";
  desc.innerText = item.desc;
  container.appendChild(desc);

  const button = document.createElement("button");
  button.className = `
    mt-3 w-full border px-4 py-2 rounded text-sm 
    text-gray-700 dark:text-white border-gray-300 dark:border-gray-600 
    hover:bg-gray-100 dark:hover:bg-gray-700 transition
  `;

  if (!isReady) {
    button.innerText = "Generate";
    button.onclick = async () => {
      button.disabled = true;
      button.innerText = "Generating...";

      try {
        const validSession = [...(course.sessions || [])]
          .filter((s) => s.session_number <= (course.progress?.checkpoint || 0))
          .find((s) => s.content);

        if (item.type === "flashcard" && !validSession) {
          alert("Tidak ada sesi yang valid untuk generate " + item.name);
          return;
        }

        if (item.type === "flashcard") {
          await Api.generateFlashcard(courseId, validSession.session_number);
        } else if (item.type === "qa") {
          await Api.generateFinalExam(courseId);
        }

        alert(`${item.name} berhasil dibuat.`);
        await refreshData();
      } catch (error) {
        console.error(error);
        alert("Gagal generate " + item.name);
      } finally {
        button.disabled = false;
        button.innerText = "Generate";
      }
    };
  } else {
    const link = document.createElement("a");
    link.href = `#/course${item.path}`;
    link.innerText = "View";
    link.className = "block text-center w-full";
    button.appendChild(link);
  }

  container.appendChild(button);
  return container;
}

export { createMaterialCardItem };
