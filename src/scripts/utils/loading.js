//src/scripts/utils/loading.js
// Variation 1: Book/Learning Theme
const bookLoadingAnimation = `
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="text-center">
      <!-- Book icon with animation -->
      <div class="relative w-24 h-24 mx-auto mb-6">
        <div class="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-lg animate-pulse"></div>
        <svg class="relative z-10 w-24 h-24 text-blue-600 dark:text-blue-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>
      </div>
      
      <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">Memuat Konten Pembelajaran</h3>
      <p class="text-gray-600 dark:text-gray-400">Menyiapkan materi untuk Anda...</p>
      
      <!-- Progress bar -->
      <div class="w-48 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mt-4 overflow-hidden">
        <div class="h-full bg-blue-600 rounded-full animate-progress"></div>
      </div>
    </div>
  </div>
  
  <style>
    @keyframes progress {
      0% { width: 0%; }
      50% { width: 70%; }
      100% { width: 100%; }
    }
    .animate-progress {
      animation: progress 2s ease-in-out infinite;
    }
  </style>
`;

// Variation 2: Cards Flip Animation
const cardsLoadingAnimation = `
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="text-center">
      <!-- Cards animation -->
      <div class="flex justify-center space-x-3 mb-6">
        <div class="w-16 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg animate-flip shadow-lg" style="animation-delay: 0ms"></div>
        <div class="w-16 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg animate-flip shadow-lg" style="animation-delay: 200ms"></div>
        <div class="w-16 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-lg animate-flip shadow-lg" style="animation-delay: 400ms"></div>
      </div>
      
      <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">Menyiapkan Kursus</h3>
      <p class="text-gray-600 dark:text-gray-400">Konten pembelajaran sedang dimuat...</p>
    </div>
  </div>
  
  <style>
    @keyframes flip {
      0%, 100% { transform: rotateY(0deg); }
      50% { transform: rotateY(180deg); }
    }
    .animate-flip {
      animation: flip 2s ease-in-out infinite;
      transform-style: preserve-3d;
    }
  </style>
`;

// Variation 3: Skeleton Loading (lebih UX friendly)
const skeletonLoadingAnimation = `
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="container mx-auto px-4">
      <!-- Header skeleton -->
      <div class="mb-8 animate-pulse">
        <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-4"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
      </div>
      
      <!-- Course cards skeleton -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${[1, 2, 3, 4, 5, 6].map(() => `
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse">
            <div class="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
            <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
            <div class="flex justify-between">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
`;

// Variation 4: Modern Gradient Orb
const orbLoadingAnimation = `
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="text-center">
      <!-- Gradient orb -->
      <div class="relative w-32 h-32 mx-auto mb-8">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full animate-spin-slow opacity-75 blur-xl"></div>
        <div class="absolute inset-2 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 rounded-full animate-spin-reverse opacity-80 blur-lg"></div>
        <div class="absolute inset-4 bg-white dark:bg-gray-800 rounded-full"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <svg class="w-12 h-12 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
        </div>
      </div>
      
      <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">Memuat Dashboard</h3>
      <p class="text-gray-600 dark:text-gray-400">Mohon tunggu sebentar...</p>
    </div>
  </div>
  
  <style>
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes spin-reverse {
      from { transform: rotate(360deg); }
      to { transform: rotate(0deg); }
    }
    .animate-spin-slow {
      animation: spin-slow 8s linear infinite;
    }
    .animate-spin-reverse {
      animation: spin-reverse 6s linear infinite;
    }
  </style>
`;

// Default loading animation
const defaultLoadingAnimation = `
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="text-center">
      <div class="relative">
        <div class="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900/20 animate-pulse"></div>
        </div>
      </div>
      <div class="mt-6 space-y-2">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-white">Memuat</h3>
        <p class="text-gray-600 dark:text-gray-400">Menyiapkan konten untuk Anda...</p>
      </div>
      <div class="flex justify-center items-center mt-4 space-x-2">
        <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
        <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
        <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
      </div>
    </div>
  </div>
`;

// Inline loading for sections
const inlineLoadingAnimation = `
  <div class="flex items-center justify-center p-8">
    <div class="text-center">
      <div class="inline-flex items-center">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-gray-600 dark:text-gray-400">Memuat...</span>
      </div>
    </div>
  </div>
`;

// Card loading skeleton
const cardLoadingSkeleton = `
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse">
    <div class="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
    <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
    <div class="flex justify-between">
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
    </div>
  </div>
`;

// Helper function to use different loading animations
export function getLoadingAnimation(type = 'default', options = {}) {
  const { title, subtitle } = options;

  let animation;
  switch (type) {
    case 'book':
      animation = bookLoadingAnimation;
      break;
    case 'cards':
      animation = cardsLoadingAnimation;
      break;
    case 'skeleton':
      animation = skeletonLoadingAnimation;
      break;
    case 'orb':
      animation = orbLoadingAnimation;
      break;
    case 'inline':
      return inlineLoadingAnimation;
    case 'card-skeleton':
      return cardLoadingSkeleton;
    default:
      animation = defaultLoadingAnimation;
  }

  // Replace title and subtitle if provided
  if (title || subtitle) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = animation;

    if (title) {
      const titleEl = tempDiv.querySelector('h3');
      if (titleEl) titleEl.textContent = title;
    }

    if (subtitle) {
      const subtitleEl = tempDiv.querySelector('p');
      if (subtitleEl) subtitleEl.textContent = subtitle;
    }

    return tempDiv.innerHTML;
  }

  return animation;
}

// Helper function to show loading with promise
export async function withLoading(promise, container, type = 'default', options = {}) {
  const originalContent = container.innerHTML;
  container.innerHTML = getLoadingAnimation(type, options);

  try {
    const result = await promise;
    return result;
  } finally {
    // Content will be replaced by the calling function
  }
}

// Loading manager for managing multiple loading states
export class LoadingManager {
  constructor() {
    this.loadingStates = new Map();
  }

  showLoading(elementId, type = 'default', options = {}) {
    const element = document.getElementById(elementId);
    if (!element) return;

    // Save original content
    this.loadingStates.set(elementId, element.innerHTML);

    // Show loading animation
    element.innerHTML = getLoadingAnimation(type, options);
  }

  hideLoading(elementId, newContent = null) {
    const element = document.getElementById(elementId);
    if (!element) return;

    if (newContent !== null) {
      element.innerHTML = newContent;
    } else {
      // Restore original content
      const originalContent = this.loadingStates.get(elementId);
      if (originalContent) {
        element.innerHTML = originalContent;
      }
    }

    this.loadingStates.delete(elementId);
  }

  isLoading(elementId) {
    return this.loadingStates.has(elementId);
  }
}

// Export singleton instance
export const loadingManager = new LoadingManager();

// Quick loading overlay functions
export function showLoadingOverlay(message = 'Memuat...') {
  const overlay = document.createElement('div');
  overlay.id = 'loading-overlay';
  overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  overlay.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
      <div class="flex items-center space-x-3">
        <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-gray-700 dark:text-gray-300">${message}</span>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

export function hideLoadingOverlay() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.remove();
  }
}

// Export all animations as constants for direct access
export const LOADING_ANIMATIONS = {
  DEFAULT: defaultLoadingAnimation,
  BOOK: bookLoadingAnimation,
  CARDS: cardsLoadingAnimation,
  SKELETON: skeletonLoadingAnimation,
  ORB: orbLoadingAnimation,
  INLINE: inlineLoadingAnimation,
  CARD_SKELETON: cardLoadingSkeleton
};