<template>
  <button
    type="button"
    class="card text-left w-full cursor-pointer select-none flex items-center gap-4 p-5 sm:p-6"
    :style="{
      animation: `fadeSlideUp 0.5s ease-out ${index * 70}ms both`,
    }"
    @click="$emit('select', profile)"
  >
    <span
      class="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
      :style="{ background: tint.bg, boxShadow: `inset 0 0 0 1px ${tint.ring}` }"
      role="img"
      :aria-label="profile.nome"
    >
      {{ profile.icone }}
    </span>

    <span class="flex flex-col gap-0.5 min-w-0">
      <span
        class="font-semibold text-base leading-tight truncate"
        style="font-family:'Playfair Display',serif; color:var(--color-ink);"
      >
        {{ profile.nome }}
      </span>
      <span class="text-sm leading-snug" style="color:var(--color-ink-soft);">
        {{ profile.descricao }}
      </span>
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  profile: { type: Object, required: true },
  index:   { type: Number, default: 0 }
})
defineEmits(['select'])

// Ciclo de tints amazônicos por posição
const TINTS = [
  { bg: 'rgba(27,94,63,0.10)',  ring: 'rgba(27,94,63,0.22)'  }, // floresta
  { bg: 'rgba(217,100,26,0.10)', ring: 'rgba(217,100,26,0.24)' }, // guaraná
  { bg: 'rgba(33,136,166,0.10)', ring: 'rgba(33,136,166,0.24)' }, // rio
]
const tint = computed(() => TINTS[props.index % TINTS.length])
</script>
