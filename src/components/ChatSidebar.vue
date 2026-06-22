<template>
  <aside class="sidebar flex flex-col h-full w-[288px] shrink-0">
    <!-- Conteúdo superior -->
    <div class="flex-1 overflow-y-auto px-5 pt-5 flex flex-col gap-6">

      <!-- Marca -->
      <div class="flex items-center justify-between">
        <button type="button" class="brand text-gradient" style="font-family:'Playfair Display',serif;"
                @click="$emit('go-home')">
          AjuriIA
        </button>
        <button v-if="closable" type="button" class="icon-btn md:hidden" aria-label="Fechar menu"
                @click="$emit('close')">
          ✕
        </button>
      </div>

      <!-- Perfil + nova conversa -->
      <div class="flex flex-col gap-3">
        <div v-if="profile" class="profile-box flex items-center gap-3 p-3.5">
          <span class="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style="background:var(--color-surface); box-shadow:inset 0 0 0 1px var(--color-line);"
                role="img" :aria-label="profile.nome">
            {{ profile.icone }}
          </span>
          <span class="flex flex-col min-w-0">
            <span class="text-sm font-semibold truncate" style="font-family:'Playfair Display',serif; color:var(--color-ink);">
              {{ profile.nome }}
            </span>
            <span class="text-xs truncate" style="color:var(--color-ink-soft);">{{ profile.descricao }}</span>
          </span>
        </div>

        <button type="button" class="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2"
                @click="$emit('new-chat')">
          ＋ Nova conversa
        </button>
      </div>

      <!-- Sugestões -->
      <div v-if="suggestions?.length" class="flex flex-col gap-2.5">
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
    <div class="px-5 py-4 flex items-center justify-between" style="border-top:1px solid var(--color-line);">
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
  profile:     { type: Object, default: null },
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
.brand {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}
.profile-box {
  background: var(--color-surface-2);
  border: 1px solid var(--color-line);
  border-radius: 0.75rem;
}
.suggestion-item {
  background: transparent;
  border: 1px solid var(--color-line);
  border-radius: 0.65rem;
  padding: 0.7rem 0.9rem;
  color: var(--color-ink-soft);
  cursor: pointer;
  transition: all 0.18s ease;
  line-height: 1.35;
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
