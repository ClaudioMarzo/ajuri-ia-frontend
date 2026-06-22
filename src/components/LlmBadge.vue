<template>
  <div
    class="text-xs text-guarana mt-2 transition-opacity duration-500"
    :class="llmUsed ? 'opacity-100' : 'opacity-0'"
  >
    ✦ Respondido por {{ llmUsed ?? '' }}
  </div>
</template>

<script setup>
defineProps({ llmUsed: { default: null } })
</script>
