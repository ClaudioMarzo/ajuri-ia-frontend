<template>
  <div
    v-if="llmUsed"
    class="text-xs mt-2 flex items-center gap-1"
    style="color:var(--color-ink-soft);"
  >
    <span aria-hidden="true" style="color:var(--color-guarana);">✦</span>
    Respondido por {{ llmUsed }}
  </div>
</template>

<script setup>
defineProps({ llmUsed: { default: null } })
</script>
