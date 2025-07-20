import FlashcardModel from "./flashcard-model.js";
import FlashcardPresenter from "./flashcard-presenter.js";

class FlashcardPage {
  constructor() {
    this.model = new FlashcardModel();
    this.presenter = new FlashcardPresenter(this.model, this);
    this.container = null;
    this.isFlipped = false;
  }

  async render(courseId) {
    const main = document.getElementById("main-content");
    if (!main) return;

    main.innerHTML = `
      <div class="w-full min-h-screen bg-white flex flex-col items-center px-4 py-6">
        <button onclick="window.history.back()" class="self-start mb-6 px-4 py-2 bg-white border rounded shadow hover:bg-gray-100 text-sm font-semibold">
          ← Back to Dashboard
        </button>

        <h1 class="text-3xl font-bold mb-1 text-center text-gray-800 drop-shadow">Flashcard</h1>
        <p class="text-base text-gray-600 mb-10 text-center">Flashcard Untuk Mengingat Konsep</p>

        <div class="w-full max-w-7xl flex flex-col md:flex-row items-center justify-center gap-6 relative">
          <button id="prev-btn" class="text-2xl bg-white border rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 shadow disabled:opacity-50 disabled:cursor-not-allowed md:static absolute left-4 top-1/2 -translate-y-1/2 md:translate-y-0 z-10">
            &#8592;
          </button>

          <div class="relative flex items-center justify-center md:justify-between">
            <div class="relative bg-blue-600 text-white rounded-xl shadow-lg cursor-pointer transition-all duration-500 
                        w-[210.44px] h-[346.45px] md:w-[335.52px] md:h-[481px]" id="flashcard">
              <div id="card-front" class="w-full h-full flex items-center justify-center text-center px-4 py-6 
                          text-[12px] md:text-[24px] font-semibold">
                Loading...
              </div>
              <div id="card-back" class="absolute top-0 left-0 w-full h-full bg-blue-100 text-black rounded-xl 
                          flex items-center justify-center text-center px-4 py-6 text-[12px] md:text-[24px] font-medium hidden">
                Loading...
              </div>
              <img id="flashcard-maskot" src="./maskot6.png" alt="robot"
                  class="absolute -top-10 right-[-30px] w-[80px] h-[78px] md:hidden z-10" />
            </div>

            <img id="flashcard-maskot-desktop" src="./maskot6.png" alt="robot"
                class="hidden md:block md:w-[300px] md:h-auto md:ml-6 transition-all duration-300" />
          </div>

          <button id="next-btn" class="text-2xl bg-white border rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 shadow disabled:opacity-50 disabled:cursor-not-allowed md:static absolute right-4 top-1/2 -translate-y-1/2 md:translate-y-0 z-10">
            &#8594;
          </button>
        </div>
      </div>
    `;

    this.bindEvents();

    try {
      await this.presenter.setCourseId(courseId);
      await this.presenter.loadFlashcards();
    } catch (error) {
      console.error("Failed to load flashcards:", error);
    }
  }

  bindEvents() {
    const flashcard = document.getElementById("flashcard");
    const nextBtn = document.getElementById("next-btn");
    const prevBtn = document.getElementById("prev-btn");

    if (flashcard) {
      flashcard.addEventListener("click", () => {
        this.isFlipped = !this.isFlipped;
        this.presenter.showCurrentCard(this.isFlipped);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        this.isFlipped = false;
        this.presenter.nextCard();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        this.isFlipped = false;
        this.presenter.prevCard();
      });
    }
  }

  updateCard(card) {
    const front = document.getElementById("card-front");
    const back = document.getElementById("card-back");
    const maskotMobile = document.getElementById("flashcard-maskot");
    const maskotDesktop = document.getElementById("flashcard-maskot-desktop");

    if (!card) {
      front.textContent = "Tidak ada kartu.";
      back.textContent = "";
      return;
    }

    front.textContent =
      card.question || card.pertanyaan || "Pertanyaan tidak tersedia";
    back.textContent = card.answer || card.jawaban || "Jawaban tidak tersedia";

    if (this.isFlipped) {
      front.classList.add("hidden");
      back.classList.remove("hidden");
      if (maskotMobile) maskotMobile.src = "./maskot7.png";
      if (maskotDesktop) maskotDesktop.src = "./maskot7.png";
    } else {
      front.classList.remove("hidden");
      back.classList.add("hidden");
      if (maskotMobile) maskotMobile.src = "./maskot6.png";
      if (maskotDesktop) maskotDesktop.src = "./maskot6.png";
    }
  }

  updateNavigation(currentIndex, totalLength) {
    const nextBtn = document.getElementById("next-btn");
    const prevBtn = document.getElementById("prev-btn");

    if (prevBtn) {
      prevBtn.disabled = currentIndex === 0;
    }
    if (nextBtn) {
      nextBtn.disabled = currentIndex === totalLength - 1;
    }
  }
}

export default FlashcardPage;
