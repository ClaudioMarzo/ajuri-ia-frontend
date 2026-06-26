<template>
  <aside class="sidebar flex flex-col h-full w-[288px] shrink-0">
    <!-- Conteúdo superior -->
    <div class="flex-1 overflow-y-auto px-6 pt-6 pb-5 flex flex-col gap-8">

      <!-- Marca -->
      <div class="brand-row">
        <button type="button" class="brand text-gradient" style="font-family:'Playfair Display',serif;"
                @click="$emit('go-home')">
          AjuriIA
        </button>
        <button v-if="closable" type="button" class="icon-btn brand-close md:hidden" aria-label="Fechar menu"
                @click="$emit('close')">
          ✕
        </button>
      </div>

      <!-- Nova conversa -->
      <div class="flex flex-col gap-4">
        <button type="button" class="new-chat-btn w-full flex items-center gap-2.5"
                @click="$emit('new-chat')">
          <span class="new-chat-btn__icon" aria-hidden="true">＋</span>
          <span>Nova conversa</span>
        </button>
      </div>

      <!-- Sugestões -->
      <div v-if="suggestions?.length" class="suggestion-panel flex flex-col gap-3.5">
        <span class="text-xs font-semibold uppercase tracking-wide px-1" style="color:var(--color-ink-soft); letter-spacing:0.06em;">
          Sugestões
        </span>
        <button v-for="chip in suggestions" :key="chip" type="button"
                class="suggestion-item text-left text-sm" @click="$emit('select-suggestion', chip)">
          {{ chip }}
        </button>
      </div>

    </div>

    <!-- Rodapé: tema + trocar perfil -->
    <div class="px-6 py-4.5 flex items-center justify-between" style="border-top:1px solid var(--color-line);">
      <button type="button" class="text-xs flex items-center gap-1.5 footer-link" @click="$emit('go-home')">
        ← Trocar perfil
      </button>
      <ThemeToggle />
    </div>
  </aside>
</template>

<script setup>
import ThemeToggle from './ThemeToggle.vue'

defineProps({
  suggestions: { type: Array,  default: () => [] },
  closable:    { type: Boolean, default: false },
})
defineEmits(['new-chat', 'select-suggestion', 'go-home', 'close'])
</script>

<style scoped>
.sidebar {
  background: var(--color-surface);
  border-right: 1px solid var(--color-line);
}
.brand-row {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;
}
.brand {
  font-size: 3.2rem;
  font-weight: 800;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  text-align: center;
}
.brand-close {
  position: absolute;
  right: 0;
}
.new-chat-btn {
  background: var(--color-surface-2);
  border: 1px solid var(--color-line);
  border-radius: 0.9rem;
  padding: 0.9rem 1rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-ink);
  cursor: pointer;
  transition: border-color 0.18s ease, background 0.18s ease, transform 0.18s ease;
}
.new-chat-btn:hover {
  border-color: color-mix(in srgb, var(--color-coral) 40%, transparent);
  background: var(--color-surface);
  transform: translateY(-1px);
}
.new-chat-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-coral) 20%, transparent);
}
.new-chat-btn__icon {
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  font-size: 1.05rem;
  line-height: 1;
  background: color-mix(in srgb, var(--color-coral) 16%, transparent);
  color: var(--color-coral);
  flex-shrink: 0;
}

.suggestion-panel {
  margin-top: -0.15rem;
  padding: 0.95rem 0.72rem 0.72rem;
  border: 1px solid var(--color-line);
  border-radius: 1rem;
  background: color-mix(in srgb, var(--color-surface-2) 45%, transparent);
}
.suggestion-item {
  background: transparent;
  border: 1px solid var(--color-line);
  border-radius: 0.78rem;
  padding: 0.86rem 1rem;
  color: var(--color-ink-soft);
  cursor: pointer;
  transition: all 0.18s ease;
  line-height: 1.4;
  font-size: 0.96rem;
}
.suggestion-item + .suggestion-item {
  margin-top: 0.16rem;
}
.suggestion-item:hover {
  color: var(--color-ink);
  border-color: color-mix(in srgb, var(--color-floresta) 40%, transparent);
  background: var(--color-surface-2);
}
.suggestion-item:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-floresta) 20%, transparent);
}
.footer-link {
  color: var(--color-ink-soft);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
  font-size: 0.85rem;
}
.footer-link:hover { color: var(--color-floresta); }
.icon-btn {
  width: 32px; height: 32px;
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: 0.5rem;
  color: var(--color-ink-soft);
  background: transparent;
  border: none;
  cursor: pointer;
}
.icon-btn:hover { background: var(--color-surface-2); color: var(--color-ink); }
</style>
