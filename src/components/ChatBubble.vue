<template>
  <div class="flex w-full mb-3"
       :class="message.role === 'user' ? 'justify-end' : 'justify-start'">
    <div
      class="max-w-[88%] sm:max-w-[78%] px-4 py-3 text-sm leading-relaxed text-areia"
      :style="message.role === 'user' ? userStyle : aiStyle"
    >
      <template v-if="message.role === 'user'">
        {{ message.content }}
      </template>
      <template v-else>
        <StreamingText
          :content="message.content"
          :is-streaming="isStreaming && isLastAiMessage"
        />
        <LlmBadge :llm-used="message.llmUsed" />
      </template>
    </div>
  </div>
</template>

<script setup>
import StreamingText from './StreamingText.vue'
import LlmBadge from './LlmBadge.vue'

defineProps({
  message:         { type: Object,  required: true },
  isStreaming:     { type: Boolean, default: false },
  isLastAiMessage: { type: Boolean, default: false }
})

const userStyle = {
  background: 'rgba(224,123,57,0.15)',
  border: '1px solid rgba(224,123,57,0.35)',
  borderRadius: '1.25rem 0.25rem 1.25rem 1.25rem',
  backdropFilter: 'blur(8px)',
}

const aiStyle = {
  background: 'rgba(45,106,79,0.18)',
  border: '1px solid rgba(45,106,79,0.4)',
  borderRadius: '0.25rem 1.25rem 1.25rem 1.25rem',
  backdropFilter: 'blur(8px)',
}
</script>
