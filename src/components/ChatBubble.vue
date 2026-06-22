<template>
  <div class="flex w-full mb-4" :class="message.role === 'user' ? 'justify-end' : 'justify-start'">
    <div
      class="max-w-[75%] px-5 py-3 text-sm leading-relaxed"
      :class="message.role === 'user'
        ? 'bg-areia text-verde-mata rounded-tl-2xl rounded-b-2xl'
        : 'bg-verde-folha text-areia rounded-tr-2xl rounded-b-2xl'"
    >
      <template v-if="message.role === 'user'">
        {{ message.content }}
      </template>
      <template v-else>
        <StreamingText :content="message.content" :is-streaming="isStreaming && isLastAiMessage" />
        <LlmBadge :llm-used="message.llmUsed" />
      </template>
    </div>
  </div>
</template>

<script setup>
import StreamingText from './StreamingText.vue'
import LlmBadge from './LlmBadge.vue'

const props = defineProps({
  message:          { type: Object,  required: true },
  isStreaming:      { type: Boolean, default: false },
  isLastAiMessage:  { type: Boolean, default: false }
})
</script>
