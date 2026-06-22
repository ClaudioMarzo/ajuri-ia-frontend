<template>
  <div
    class="glass-card cursor-pointer select-none flex items-center gap-5 p-6 sm:p-8
           transition-all duration-300 ease-out"
    :style="{
      animationName: 'fadeSlideUp',
      animationDuration: '0.5s',
      animationTimingFunction: 'ease-out',
      animationFillMode: 'forwards',
      animationDelay: `${index * 80}ms`,
      opacity: 0,
      transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
      borderColor: hovered ? 'rgba(224,123,57,0.55)' : 'rgba(224,123,57,0.2)',
      boxShadow: hovered ? '0 8px 32px rgba(224,123,57,0.2), 0 0 0 1px rgba(224,123,57,0.1)' : 'none',
    }"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @click="$emit('select', profile)"
  >
    <div
      class="w-14 h-14 rounded-full flex items-center justify-center text-2xl shrink-0 transition-all duration-300"
      :style="{
        background: 'rgba(45,106,79,0.45)',
        boxShadow: hovered
          ? '0 0 0 2px rgba(224,123,57,0.5), 0 4px 16px rgba(45,106,79,0.4)'
          : '0 0 0 1px rgba(224,123,57,0.25)',
      }"
    >
      {{ profile.icone }}
    </div>

    <div class="flex flex-col gap-1 min-w-0">
      <h3
        class="text-areia font-semibold text-base leading-tight truncate"
        style="font-family:'Playfair Display',serif;"
      >
        {{ profile.nome }}
      </h3>
      <p class="text-sm leading-snug" style="color:rgba(244,233,216,0.6);">
        {{ profile.descricao }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  profile: { type: Object, required: true },
  index:   { type: Number, default: 0 }
})
defineEmits(['select'])

const hovered = ref(false)
</script>
