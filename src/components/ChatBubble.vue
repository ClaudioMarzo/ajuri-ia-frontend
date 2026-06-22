<template>
  <!-- Mensagem do usuário: bolha verde à direita -->
  <div v-if="message.role === 'user'" class="flex justify-end mb-6">
    <div
      class="max-w-[80%] px-4 py-2.5 text-sm leading-relaxed"
      style="background:var(--color-bubble-user-bg); color:var(--color-bubble-user-text); border-radius:1.1rem 0.3rem 1.1rem 1.1rem;"
    >
      {{ message.content }}
    </div>
  </div>

  <!-- Mensagem da IA: avatar + bloco limpo à esquerda -->
  <div v-else class="flex items-start gap-3.5 mb-7">
    <span
      class="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-base mt-0.5"
      style="background:var(--color-surface-2); box-shadow:inset 0 0 0 1px var(--color-line);"
      role="img"
      aria-label="Assistente"
    >
      {{ profileIcon || '🌿' }}
    </span>
    <div class="min-w-0 flex-1 pt-0.5" style="line-height:1.7;">
      <StreamingText
        :content="message.content"
        :is-streaming="isStreaming && isLastAiMessage"
      />
      <LlmBadge :llm-used="message.llmUsed" />
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
  profileIcon:     { type: String,  default: '🌿' },
})
</script>
