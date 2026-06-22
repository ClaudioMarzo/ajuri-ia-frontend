<template>
  <div class="prose prose-invert max-w-none streaming-text">
    <span v-html="renderedHtml" />
    <span
      v-if="isStreaming"
      class="inline-block w-[2px] h-4 ml-0.5 align-middle"
      style="background:#E07B39; animation:blink 1s infinite;"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const props = defineProps({
  content:     { type: String,  default: '' },
  isStreaming: { type: Boolean, default: false }
})

marked.setOptions({ breaks: true })

const renderedHtml = computed(() =>
  DOMPurify.sanitize(marked.parse(props.content))
)
</script>

<style scoped>
/* Overrides além do que o plugin Typography cobre */
.streaming-text :deep(h1),
.streaming-text :deep(h2),
.streaming-text :deep(h3),
.streaming-text :deep(h4) {
  font-family: 'Playfair Display', serif;
}

.streaming-text :deep(code) {
  background: rgba(72, 202, 228, 0.12);
  color: #48CAE4;
  padding: 0.15em 0.4em;
  border-radius: 4px;
  font-size: 0.85em;
}

.streaming-text :deep(pre) {
  background: rgba(7, 15, 9, 0.85);
  border: 1px solid rgba(45, 106, 79, 0.4);
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
}

.streaming-text :deep(pre code) {
  background: transparent;
  padding: 0;
  color: #F4E9D8;
}

.streaming-text :deep(blockquote) {
  border-left-color: rgba(224, 123, 57, 0.5);
  background: rgba(224, 123, 57, 0.05);
  border-radius: 0 0.5rem 0.5rem 0;
  padding: 0.5rem 1rem;
}
</style>
