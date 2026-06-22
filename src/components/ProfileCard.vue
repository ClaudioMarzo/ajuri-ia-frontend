<template>
  <div
    class="
      bg-verde-folha rounded-2xl p-8 cursor-pointer select-none
      border-2 border-transparent
      transition-all duration-300 ease-out
      hover:-translate-y-1.5 hover:border-guarana hover:shadow-xl
      opacity-0
    "
    :style="{
      animationName: 'fadeSlideUp',
      animationDuration: '0.5s',
      animationTimingFunction: 'ease-out',
      animationFillMode: 'forwards',
      animationDelay: `${index * 100}ms`
    }"
    @click="$emit('select', profile)"
  >
    <div class="text-5xl mb-4">{{ profile.icone }}</div>
    <h3 class="text-areia text-lg font-semibold mb-1" style="font-family: 'Playfair Display', serif">
      {{ profile.nome }}
    </h3>
    <p class="text-neblina text-sm">{{ profile.descricao }}</p>
  </div>
</template>

<script setup>
defineProps({
  profile: { type: Object,  required: true },
  index:   { type: Number,  default: 0 }
})
defineEmits(['select'])
</script>
