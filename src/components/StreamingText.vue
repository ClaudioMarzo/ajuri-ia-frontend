<template>
  <div class="prose prose-invert max-w-none streaming-text">
    <span v-html="renderedHtml" />
    <span
      v-if="isStreaming"
      class="inline-block w-[2px] h-4 bg-areia ml-0.5 align-middle"
      style="animation: blink 1s infinite"
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
.streaming-text :deep(h1),
.streaming-text :deep(h2),
.streaming-text :deep(h3) {
  font-family: 'Playfair Display', serif;
  margin: 0.75em 0 0.4em;
  color: #F4E9D8;
}
.streaming-text :deep(p) {
  margin: 0.4em 0;
  line-height: 1.65;
}
.streaming-text :deep(ul),
.streaming-text :deep(ol) {
  margin: 0.4em 0 0.4em 1.4em;
}
.streaming-text :deep(li) {
  margin: 0.15em 0;
}
.streaming-text :deep(strong) {
  color: #F4E9D8;
  font-weight: 600;
}
.streaming-text :deep(code) {
  background: rgba(72, 202, 228, 0.15);
  padding: 0.1em 0.3em;
  border-radius: 3px;
  font-size: 0.85em;
}
</style>
