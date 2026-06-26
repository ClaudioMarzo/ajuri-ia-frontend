<template>
  <div class="model-sel" v-if="models.length">
    <button type="button" class="model-sel__btn" :aria-expanded="open" aria-haspopup="listbox"
            @click="open = !open">
      <svg class="model-sel__icon" width="13" height="13" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.5V12h2a2 2 0 0 1 2 2v1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1v-1a2 2 0 0 1 2-2h2V9.5A4 4 0 0 1 8 6a4 4 0 0 1 4-4z"/>
      </svg>
      <span class="model-sel__label">{{ selectedLabel }}</span>
      <svg class="model-sel__chev" :class="{ open }" width="12" height="12" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
        <path d="M6 9l6 6 6-6"/>
      </svg>
    </button>

    <div v-if="open" class="model-sel__backdrop" @click="open = false"></div>
    <ul v-if="open" class="model-sel__menu" role="listbox">
      <li v-for="m in models" :key="m.id" role="option"
          :aria-selected="m.id === modelValue"
          class="model-sel__item" :class="{ active: m.id === modelValue }"
          @click="select(m.id)">
        {{ m.label }}
        <svg v-if="m.id === modelValue" width="13" height="13" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: null },
  models:     { type: Array,  default: () => [] },
})
const emit = defineEmits(['update:modelValue'])

const open = ref(false)

const selectedLabel = computed(() =>
  props.models.find(m => m.id === props.modelValue)?.label ?? props.modelValue ?? 'Modelo'
)

function select(id) {
  emit('update:modelValue', id)
  open.value = false
}
</script>

<style scoped>
.model-sel { position: relative; }

.model-sel__btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  background: transparent;
  border: 1px solid var(--color-line);
  border-radius: 9999px;
  font-family: var(--font-family-inter);
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--color-ink-soft);
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}
.model-sel__btn:hover {
  border-color: color-mix(in srgb, var(--color-coral) 40%, transparent);
  color: var(--color-ink);
  background: color-mix(in srgb, var(--color-surface-2) 55%, transparent);
}
.model-sel__btn[aria-expanded="true"] {
  border-color: color-mix(in srgb, var(--color-floresta) 42%, transparent);
  color: var(--color-ink);
}
.model-sel__icon { flex-shrink: 0; opacity: .7; }
.model-sel__chev { flex-shrink: 0; transition: transform .2s ease; }
.model-sel__chev.open { transform: rotate(180deg); }
.model-sel__label { white-space: nowrap; max-width: 140px; overflow: hidden; text-overflow: ellipsis; }

.model-sel__backdrop { position: fixed; inset: 0; z-index: 40; }
.model-sel__menu {
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  z-index: 50;
  min-width: 220px;
  margin: 0;
  padding: 6px;
  list-style: none;
  background: var(--color-surface);
  border: 1px solid var(--color-line);
  border-radius: 0.85rem;
  box-shadow: var(--shadow-hover);
  backdrop-filter: blur(6px);
}
.model-sel__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 0.55rem;
  font-size: 0.9rem;
  color: var(--color-ink);
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
}
.model-sel__item:hover { background: var(--color-surface-2); }
.model-sel__item.active { color: var(--color-coral); font-weight: 600; }
</style>
