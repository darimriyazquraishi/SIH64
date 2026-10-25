import { ref } from 'vue';
const currentTheme = ref('light');
export function useTheme() {
    function setTheme(theme) {
        currentTheme.value = theme;
        localStorage.setItem('aicte_theme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        }
        else {
            document.documentElement.classList.remove('dark');
        }
    }
    function toggleTheme() {
        setTheme(currentTheme.value === 'dark' ? 'light' : 'dark');
    }
    function initTheme() {
        const saved = localStorage.getItem('aicte_theme');
        if (saved === 'dark' || saved === 'light') {
            setTheme(saved);
        }
        else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark');
        }
        else {
            setTheme('light');
        }
    }
    return {
        theme: currentTheme,
        setTheme,
        toggleTheme,
        initTheme,
    };
}
