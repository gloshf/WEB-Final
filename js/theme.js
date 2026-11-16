(function () {
    'use strict';

    const KEY = 'movieverse_theme_v1';
    let selected = 'dark';

    try {
        const stored = localStorage.getItem(KEY);

        if (stored === 'light' || stored === 'dark') {
            selected = stored;
        }
    } catch (error) {
        // Storage may be unavailable.
    }

    document.documentElement.setAttribute('data-theme', selected);

    function applyTheme(theme) {
        selected = theme;

        document.documentElement.setAttribute('data-theme', theme);

        const button = document.getElementById('themeToggle');

        if (button) {
            const isLight = theme === 'light';

            button.textContent = isLight ? '☀ Light' : '☾ Dark';

            button.setAttribute(
                'aria-label',
                isLight ? 'Switch to dark theme' : 'Switch to light theme'
            );

            button.setAttribute('aria-pressed', String(isLight));

            button.title = isLight
                ? 'Switch to dark mode'
                : 'Switch to light mode';
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        applyTheme(selected);

        const button = document.getElementById('themeToggle');

        if (!button) return;

        button.addEventListener('click', function () {
            const next = selected === 'dark' ? 'light' : 'dark';

            applyTheme(next);

            try {
                localStorage.setItem(KEY, next);
            } catch (error) {
                // Storage may be unavailable.
            }
        });
    });
})();