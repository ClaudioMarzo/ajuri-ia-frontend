import { ref } from 'vue'

const STORAGE_KEY = 'ajuri-theme'
const isDark = ref(false)

function apply(dark) {
  isDark.value = dark
  document.documentElement.classList.toggle('dark', dark)
  try {
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
  } catch (e) { /* ignora storage indisponível */ }
}

// Sincroniza o estado com o que o script anti-FOUC (index.html) já aplicou
function initTheme() {
  isDark.value = document.documentElement.classList.contains('dark')
}

function toggleTheme() {
  apply(!isDark.value)
}

export function useTheme() {
  return { isDark, initTheme, toggleTheme }
}
