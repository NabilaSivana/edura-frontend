import API from "../../../data/api.js";

class FlashcardModel {
  constructor() {
    this.flashcards = [];
    this.currentIndex = 0;
    this.isFlipped = false;
    this.courseId = null;
    this.isLoading = false;
    this.error = null;
  }

  setCourseId(courseId) {
    this.courseId = courseId;
  }

  getCurrentFlashcard() {
    if (this.flashcards.length === 0) return null;
    return this.flashcards[this.currentIndex];
  }

  getTotalFlashcards() {
    return this.flashcards.length;
  }

  getCurrentIndex() {
    return this.currentIndex;
  }

  getIsFlipped() {
    return this.isFlipped;
  }

  setFlipped(flipped) {
    this.isFlipped = flipped;
  }

  toggleFlip() {
    this.isFlipped = !this.isFlipped;
    return this.isFlipped;
  }

  goToNext() {
    if (this.currentIndex < this.flashcards.length - 1) {
      this.currentIndex++;
      this.isFlipped = false;
      return true;
    }
    return false;
  }

  goToPrevious() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.isFlipped = false;
      return true;
    }
    return false;
  }

  canGoNext() {
    return this.currentIndex < this.flashcards.length - 1;
  }

  canGoPrevious() {
    return this.currentIndex > 0;
  }

  async loadFlashcards() {
    if (!this.courseId) {
      throw new Error("Course ID is required");
    }

    this.isLoading = true;
    this.error = null;

    try {
      const response = await API.getFlashcards(this.courseId);

      if (response.flashcards && Array.isArray(response.flashcards)) {
        this.flashcards = response.flashcards.flatMap((session) =>
          (session.cards || []).map((card) => ({
            ...card,
            session_number: session.session_number,
          }))
        );
      } else {
        this.flashcards = [];
      }

      this.currentIndex = 0;
      this.isFlipped = false;
      this.isLoading = false;

      return this.flashcards;
    } catch (error) {
      this.error = error.message || "Failed to load flashcards";
      this.isLoading = false;
      throw error;
    }
  }

  async generateFlashcards() {
    if (!this.courseId) {
      throw new Error("Course ID is required");
    }

    this.isLoading = true;
    this.error = null;

    try {
      const response = await API.generateFlashcards(this.courseId);
      this.isLoading = false;
      return response;
    } catch (error) {
      this.error = error.message || "Failed to generate flashcards";
      this.isLoading = false;
      throw error;
    }
  }

  async checkGenerationStatus() {
    if (!this.courseId) {
      throw new Error("Course ID is required");
    }

    try {
      const response = await API.getFlashcardStatus(this.courseId);
      return response;
    } catch (error) {
      console.error("Failed to check flashcard status:", error);
      throw error;
    }
  }

  getIsLoading() {
    return this.isLoading;
  }

  getError() {
    return this.error;
  }

  clearError() {
    this.error = null;
  }

  reset() {
    this.flashcards = [];
    this.currentIndex = 0;
    this.isFlipped = false;
    this.isLoading = false;
    this.error = null;
  }
}

export default FlashcardModel;
