import { ref, onMounted } from 'vue'

export type Theme = 'light' | 'dark'

const currentTheme = ref<Theme>('light')

export function useTheme() {
  function setTheme(theme: Theme) {
    currentTheme.value = theme
    localStorage.setItem('aicte_theme', theme)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  function toggleTheme() {
    setTheme(currentTheme.value === 'dark' ? 'light' : 'dark')
  }

  function initTheme() {
    document.documentElement.classList.remove('dark')
    currentTheme.value = 'light'
    localStorage.removeItem('aicte_theme')
  }

  return {
    theme: currentTheme,
    setTheme,
    toggleTheme,
    initTheme,
  }
}
