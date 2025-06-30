function createMaterialCardItem({
  item,
  studyTypeContent,
  course,
  refreshData,
}) {
  const container = document.createElement("div");
  container.className = `border shadow-md rounded-lg p-5 flex flex-col items-center ${
    studyTypeContent?.[item.type]?.length === 0 ? "grayscale" : ""
  }`;

  const statusTag = document.createElement("h2");
  statusTag.className = "p-1 px-2 text-white rounded-full text-[10px] mb-2";
  if (studyTypeContent?.[item.type]?.length === 0) {
    statusTag.classList.add("bg-gray-500");
    statusTag.innerText = "Generate";
  } else {
    statusTag.classList.add("bg-green-500");
    statusTag.innerText = "Ready";
  }
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
  desc.className = "text-gray-500 text-sm text-center";
  desc.innerText = item.desc;
  container.appendChild(desc);

  const button = document.createElement("button");
  button.className = "mt-3 w-full border px-4 py-2 rounded";

  if (studyTypeContent?.[item.type]?.length === 0) {
    button.innerText = "Generate";
    button.onclick = async () => {
      alert("Generating your content...");
      let chapters = "";
      course?.courseLayout.chapters.forEach((chapter) => {
        chapters =
          (chapter.chapter_title || chapter.chapterTitle) + "," + chapters;
      });

      try {
        await fetch("/api/study-type-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId: course?.courseId,
            type: item.name,
            chapters: chapters,
          }),
        });
        alert("Your content is ready to view");
        refreshData(true);
      } catch (error) {
        console.error(error);
        alert("Failed to generate content");
      }
    };
  } else {
    const link = document.createElement("a");
    link.href = "/course/" + course?.courseId + item.path;
    link.innerText = "View";
    button.appendChild(link);
  }

  container.appendChild(button);

  return container;
}

export { createMaterialCardItem };
