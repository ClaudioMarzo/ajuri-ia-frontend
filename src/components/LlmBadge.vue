<template>
  <div v-if="llmUsed" class="llm-badge">
    <span class="llm-badge__spark" aria-hidden="true">✦</span>
    <span v-if="isFallback" class="llm-badge__fallback">
      {{ requestedLabel }} indisponível · respondido por <strong>{{ usedLabel }}</strong>
    </span>
    <span v-else>Respondido por {{ usedLabel }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  llmUsed:        { default: null },
  requestedModel: { default: null },
  labelMap:       { type: Object, default: () => ({}) },
})

const isFallback = computed(() =>
  props.requestedModel && props.llmUsed && props.requestedModel !== props.llmUsed
)

const usedLabel      = computed(() => label(props.llmUsed))
const requestedLabel = computed(() => label(props.requestedModel))

function label(id) {
  if (!id) return ''
  return props.labelMap[id] ?? id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}
</script>

<style scoped>
.llm-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.58rem;
  padding: 0.24rem 0.6rem;
  border: 1px solid var(--color-line);
  border-radius: 9999px;
  background: color-mix(in srgb, var(--color-surface-2) 56%, transparent);
  font-size: 0.76rem;
  font-weight: 500;
  line-height: 1.3;
  color: var(--color-ink-soft);
}
.llm-badge__spark { color: var(--color-coral); font-size: 0.66rem; }
.llm-badge__fallback { color: var(--color-ink-soft); }
.llm-badge__fallback strong { color: var(--color-floresta); font-weight: 600; }
</style>
