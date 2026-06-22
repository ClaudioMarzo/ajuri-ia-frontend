<template>
  <div
    class="flex w-full mb-5"
    :class="message.role === 'user' ? 'justify-end' : 'justify-start items-start gap-3'"
  >
    <!-- Avatar da IA -->
    <div
      v-if="message.role !== 'user'"
      class="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-base mt-1"
      style="background:rgba(45,106,79,0.45); box-shadow:0 0 0 1px rgba(45,106,79,0.6);"
    >
      {{ profileIcon }}
    </div>

    <!-- Conteúdo da bolha -->
    <div
      class="px-5 py-4 text-sm leading-relaxed text-areia"
      :class="message.role === 'user' ? 'max-w-[75%]' : 'max-w-[90%] sm:max-w-[85%]'"
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
  isLastAiMessage: { type: Boolean, default: false },
  profileIcon:     { type: String,  default: '🤖' },
})

const userStyle = {
  background:    'rgba(224,123,57,0.13)',
  border:        '1px solid rgba(224,123,57,0.3)',
  borderRadius:  '1.25rem 0.25rem 1.25rem 1.25rem',
  backdropFilter: 'blur(8px)',
}

const aiStyle = {
  background:    'rgba(45,106,79,0.15)',
  border:        '1px solid rgba(45,106,79,0.25)',
  borderRadius:  '0.25rem 1.25rem 1.25rem 1.25rem',
  backdropFilter: 'blur(8px)',
}
</script>
