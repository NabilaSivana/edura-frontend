import FlashcardModel from "./flashcard-model.js";
import FlashcardPresenter from "./flashcard-presenter.js";

class FlashcardPage {
  constructor() {
    this.model = new FlashcardModel();
    this.presenter = new FlashcardPresenter(this.model, this);
    this.container = null;
    this.isFlipped = false;
    this.darkMode = false;
  }

  async render(courseId) {
    const main = document.getElementById("main-content");
    if (!main) return;

    main.innerHTML = `
      <div class="w-full min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center px-4 py-6 transition-colors duration-300">
        <div class="w-full max-w-7xl flex justify-between items-center mb-6">
          <button onclick="window.history.back()" class="px-4 py-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-semibold dark:text-white transition-colors duration-300">
            ← Back to Dashboard
          </button>
        
        </div>

        <h1 class="text-3xl font-bold mb-1 text-center text-gray-800 dark:text-white drop-shadow">Flashcard</h1>
        <p class="text-base text-gray-600 dark:text-gray-300 mb-10 text-center">Flashcard Untuk Mengingat Konsep</p>

        <div class="w-full max-w-7xl flex flex-col md:flex-row items-center justify-center gap-6 relative">
          <button id="prev-btn" class="text-2xl bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 shadow disabled:opacity-50 disabled:cursor-not-allowed md:static absolute left-4 top-1/2 -translate-y-1/2 md:translate-y-0 z-10 dark:text-white transition-colors duration-300">
            &#8592;
          </button>

          <div class="relative flex items-center justify-center md:justify-between">
            <div class="relative w-[210.44px] h-[346.45px] md:w-[335.52px] md:h-[481px] cursor-pointer group" id="flashcard">
              <div id="flashcard-inner" class="w-full h-full transition-transform duration-500 transform-style-preserve-3d">
                <!-- Front Card (Tertutup) - Warna berbeda untuk light/dark mode -->
                <div id="card-front" class="absolute bg-blue-600 dark:bg-indigo-800 text-white shadow-xl w-full h-full flex items-center justify-center text-center px-4 py-6 text-[12px] md:text-[24px] font-semibold backface-visibility-hidden transform-rotate-y-0 rounded-xl border-2 border-blue-700 dark:border-indigo-900">
                  Loading...
                </div>
                <!-- Back Card (Terbuka) - Warna berbeda untuk light/dark mode -->
                <div id="card-back" class="absolute bg-blue-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-xl w-full h-full flex items-center justify-center text-center px-4 py-6 text-[12px] md:text-[24px] font-medium backface-visibility-hidden transform-rotate-y-180 rounded-xl border-2 border-blue-100 dark:border-gray-600">
                  Loading...
                </div>
              </div>
              <img id="flashcard-maskot" src="./maskot6.png" alt="robot"
                   class="absolute -top-10 right-[-30px] w-[80px] h-[78px] md:hidden z-10 transition-all duration-300" />
            </div>

            <img id="flashcard-maskot-desktop" src="./maskot6.png" alt="robot"
                 class="hidden md:block md:w-[300px] md:h-auto md:ml-6 transition-all duration-300" />
          </div>

          <button id="next-btn" class="text-2xl bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 shadow disabled:opacity-50 disabled:cursor-not-allowed md:static absolute right-4 top-1/2 -translate-y-1/2 md:translate-y-0 z-10 dark:text-white transition-colors duration-300">
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
    const darkModeToggle = document.getElementById("dark-mode-toggle");

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

    if (darkModeToggle) {
      darkModeToggle.addEventListener("click", () => {
        this.toggleDarkMode();
      });
    }
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    document.documentElement.classList.toggle('dark', this.darkMode);
    
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    if (darkModeToggle) {
      darkModeToggle.textContent = this.darkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
    }
    
    // Simpan preferensi dark mode di localStorage
    localStorage.setItem('darkMode', this.darkMode);
  }

  updateCard(card) {
    const front = document.getElementById("card-front");
    const back = document.getElementById("card-back");
    const innerCard = document.getElementById("flashcard-inner");
    const maskotMobile = document.getElementById("flashcard-maskot");
    const maskotDesktop = document.getElementById("flashcard-maskot-desktop");

    if (!card) {
      front.textContent = "Tidak ada kartu.";
      back.textContent = "";
      return;
    }

    front.textContent = card.question || "Pertanyaan tidak tersedia";
    back.textContent = card.answer || "Jawaban tidak tersedia";

    if (this.isFlipped) {
      innerCard.classList.add("is-flipped");
      if (maskotMobile) maskotMobile.src = "./maskot7.png";
      if (maskotDesktop) maskotDesktop.src = "./maskot7.png";
    } else {
      innerCard.classList.remove("is-flipped");
      if (maskotMobile) maskotMobile.src = "./maskot6.png";
      if (maskotDesktop) maskotDesktop.src = "./maskot6.png";
    }
    
  if (card) {
    front.innerHTML = `<div class="text-balance p-4">${card.question || "Pertanyaan tidak tersedia"}</div>`;
    back.innerHTML = `<div class="text-balance p-4 text-left"><pre class="whitespace-pre-wrap font-sans">${card.answer || "Jawaban tidak tersedia"}</pre></div>`;
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