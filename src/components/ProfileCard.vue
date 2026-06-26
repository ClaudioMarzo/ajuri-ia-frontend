<template>
  <button
    type="button"
    class="profile-card"
    :class="tintClass"
    :style="{ animation: `fadeSlideUp 0.5s ease-out ${index * 70}ms both` }"
    @click="$emit('select', profile)"
  >
    <span class="pc-mono monogram" :class="tintClass" aria-hidden="true">{{ initials }}</span>

    <span class="pc-text">
      <span class="pc-name">{{ profile.nome }}</span>
      <span class="pc-desc">{{ profile.descricao }}</span>
    </span>

    <svg class="pc-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { monogram, monogramTint } from '../utils/monogram.js'

const props = defineProps({
  profile: { type: Object, required: true },
  index:   { type: Number, default: 0 }
})
defineEmits(['select'])

const initials  = computed(() => monogram(props.profile.nome))
const tintClass = computed(() => monogramTint(props.index))
</script>

<style scoped>
.profile-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  width: 244px;
  max-width: 100%;
  text-align: left;
  cursor: pointer;
  user-select: none;
  padding: 18px;
  background: var(--color-surface);
  border: 1px solid var(--color-line);
  border-radius: 0.875rem;
  box-shadow: var(--shadow-card);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
/* Faixa de acento à esquerda, na cor do tint */
.profile-card::before {
  content: "";
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  border-radius: 3px 0 0 3px;
  transform: scaleY(0);
  transform-origin: center;
  transition: transform 0.2s ease;
}
.profile-card.monogram--floresta::before { background: var(--color-floresta); }
.profile-card.monogram--coral::before    { background: var(--color-coral); }

.profile-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-hover);
  border-color: color-mix(in srgb, var(--color-coral) 50%, transparent);
}
.profile-card:hover::before { transform: scaleY(1); }
.profile-card:focus-visible {
  outline: none;
  border-color: var(--color-coral);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-coral) 22%, transparent), var(--shadow-card);
}

.pc-mono {
  width: 46px; height: 46px;
  font-size: 1.05rem;
  transition: transform 0.2s ease;
}
.profile-card.monogram--floresta .pc-mono { box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color-floresta) 30%, transparent); }
.profile-card.monogram--coral .pc-mono    { box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color-coral) 32%, transparent); }
.profile-card:hover .pc-mono { transform: scale(1.06); }

.pc-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; }
.pc-name {
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  font-size: 0.95rem;
  line-height: 1.2;
  color: var(--color-ink);
}
.pc-desc {
  font-size: 0.8rem;
  line-height: 1.4;
  color: var(--color-ink-soft);
}

.pc-arrow {
  flex-shrink: 0;
  color: var(--color-coral);
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.profile-card:hover .pc-arrow { opacity: 1; transform: translateX(0); }

@media (prefers-reduced-motion: reduce) {
  .profile-card, .profile-card *, .pc-arrow { transition: none; animation: none !important; }
}
</style>
