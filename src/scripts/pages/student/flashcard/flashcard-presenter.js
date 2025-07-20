class FlashcardPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.courseId = null;

    // Optional binding jika method tersedia di view
    if (typeof this.view.bindFlipCard === "function") {
      this.view.bindFlipCard(() => this.flipCard());
    }
    if (typeof this.view.bindNext === "function") {
      this.view.bindNext(() => this.nextCard());
    }
    if (typeof this.view.bindPrev === "function") {
      this.view.bindPrev(() => this.prevCard());
    }
  }

  async setCourseId(courseId) {
    this.courseId = courseId;
    this.model.setCourseId(courseId);
  }

  async loadFlashcards() {
    try {
      this.flashcards = await this.model.loadFlashcards();

      if (!this.flashcards || this.flashcards.length === 0) {
        if (typeof this.view.showEmptyMessage === "function") {
          this.view.showEmptyMessage("Tidak ada flashcard untuk modul ini.");
        }
        return;
      }

      this.showCurrentCard(false);
    } catch (error) {
      console.error("Gagal memuat flashcards:", error);
      if (typeof this.view.showErrorMessage === "function") {
        this.view.showErrorMessage("Terjadi kesalahan saat memuat flashcards.");
      }
    }
  }

  showCurrentCard(isFlipped = false) {
    const card = this.flashcards?.[this.model.getCurrentIndex()] || null;

    this.model.setFlipped(isFlipped);
    if (typeof this.view.updateCard === "function") {
      this.view.updateCard(card);
    }

    if (typeof this.view.updateNavigation === "function") {
      this.view.updateNavigation(
        this.model.getCurrentIndex(),
        this.flashcards.length
      );
    }
  }

  nextCard() {
    if (this.model.goToNext()) {
      this.showCurrentCard(false);
    }
  }

  prevCard() {
    if (this.model.goToPrevious()) {
      this.showCurrentCard(false);
    }
  }

  flipCard() {
    const flipped = this.model.toggleFlip();
    if (typeof this.view.toggleCardFlip === "function") {
      this.view.toggleCardFlip(flipped);
    }
  }
}

export default FlashcardPresenter;
