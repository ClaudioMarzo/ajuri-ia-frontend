<template>
  <div
    class="glass-card p-6 cursor-pointer select-none flex flex-col gap-3
           transition-all duration-300 ease-out
           hover:scale-[1.02] hover:shadow-lg"
    :style="{
      animationName: 'fadeSlideUp',
      animationDuration: '0.5s',
      animationTimingFunction: 'ease-out',
      animationFillMode: 'forwards',
      animationDelay: `${index * 100}ms`,
      opacity: 0,
      '--tw-shadow-color': 'rgba(224,123,57,0.2)',
      borderColor: hovered ? 'rgba(224,123,57,0.55)' : 'rgba(224,123,57,0.25)',
    }"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @click="$emit('select', profile)"
  >
    <div class="w-14 h-14 rounded-full flex items-center justify-center text-3xl shrink-0"
         style="background: rgba(45,106,79,0.4); box-shadow: 0 0 0 1px rgba(224,123,57,0.3);">
      {{ profile.icone }}
    </div>
    <div>
      <h3 class="text-areia font-semibold text-base leading-tight"
          style="font-family: 'Playfair Display', serif;">
        {{ profile.nome }}
      </h3>
      <p class="text-sm mt-1" style="color: rgba(248,244,239,0.6);">
        {{ profile.descricao }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  profile: { type: Object,  required: true },
  index:   { type: Number,  default: 0 }
})
defineEmits(['select'])

const hovered = ref(false)
</script>
