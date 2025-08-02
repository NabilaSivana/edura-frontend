// utils/theme.js
export const ThemeManager = {
    // Initialize theme on app start
    init() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                // Only auto-switch if user hasn't set a preference
                if (e.matches) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
        });
    },

    // Toggle theme
    toggle() {
        const isDark = document.documentElement.classList.contains('dark');

        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }

        // Dispatch event
        window.dispatchEvent(new CustomEvent('themechange', {
            detail: { isDark: !isDark }
        }));

        return !isDark;
    },

    // Get current theme
    current() {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    },

    // Set specific theme
    set(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }

        window.dispatchEvent(new CustomEvent('themechange', {
            detail: { isDark: theme === 'dark' }
        }));
    },

    // Check if dark mode is active
    isDark() {
        return document.documentElement.classList.contains('dark');
    }
};

// Export as default
export default ThemeManager;