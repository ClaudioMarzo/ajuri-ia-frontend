<template>
  <div class="prose prose-sm sm:prose-base max-w-none streaming-text">
    <span v-html="renderedHtml" />
    <span
      v-if="isStreaming"
      class="inline-block w-[2px] h-4 ml-0.5 align-middle"
      style="background:var(--color-coral); animation:blink 1s infinite;"
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
.streaming-text :deep(h3),
.streaming-text :deep(h4) {
  font-family: 'Playfair Display', serif;
}

.streaming-text :deep(code) {
  background: color-mix(in srgb, var(--color-coral) 12%, transparent);
  color: var(--color-coral);
  padding: 0.15em 0.4em;
  border-radius: 4px;
  font-size: 0.85em;
  font-weight: 500;
}

.streaming-text :deep(pre) {
  background: var(--tw-prose-pre-bg, #211D19);
  border: 1px solid var(--color-line);
  border-radius: 0.7rem;
  padding: 1rem;
  overflow-x: auto;
}

.streaming-text :deep(pre code) {
  background: transparent;
  padding: 0;
  color: var(--tw-prose-pre-code, #ECEAE3);
}

.streaming-text :deep(blockquote) {
  border-left: 3px solid var(--color-coral);
  background: color-mix(in srgb, var(--color-coral) 6%, transparent);
  border-radius: 0 0.5rem 0.5rem 0;
  padding: 0.5rem 1rem;
  font-style: normal;
}

.streaming-text :deep(a) {
  text-decoration: underline;
  text-underline-offset: 2px;
}
</style>
