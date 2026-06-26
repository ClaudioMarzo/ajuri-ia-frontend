<template>
  <button
    type="button"
    class="theme-toggle"
    :aria-label="isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'"
    :title="isDark ? 'Tema claro' : 'Tema escuro'"
    @click="toggleTheme"
  >
    <!-- Sol -->
    <svg v-if="isDark" width="18" height="18" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
    <!-- Lua -->
    <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  </button>
</template>

<script setup>
import { onMounted } from 'vue'
import { useTheme } from '../composables/useTheme.js'

const { isDark, initTheme, toggleTheme } = useTheme()
onMounted(initTheme)
</script>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 0.6rem;
  color: var(--color-ink-soft);
  background: transparent;
  border: 1px solid var(--color-line);
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease;
}
.theme-toggle:hover {
  color: var(--color-coral);
  border-color: color-mix(in srgb, var(--color-coral) 45%, transparent);
  background: var(--color-surface-2);
}
.theme-toggle:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-coral) 22%, transparent);
}
</style>
