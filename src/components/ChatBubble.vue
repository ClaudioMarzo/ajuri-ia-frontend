<template>
  <!-- Mensagem do usuário: bolha suave à direita -->
  <div v-if="message.role === 'user'" class="bubble-row bubble-row--user">
    <div class="bubble-user">
      {{ message.content }}
    </div>
  </div>

  <!-- Mensagem da IA: avatar (monograma) + bloco limpo à esquerda -->
  <div v-else class="bubble-row bubble-row--ai">
    <span class="bubble-ai__avatar monogram monogram--floresta w-8 h-8 text-xs mt-0.5" aria-hidden="true">
      {{ profileInitials }}
    </span>
    <div class="bubble-ai">
      <StreamingText
        :content="message.content"
        :is-streaming="isStreaming && isLastAiMessage"
      />
      <LlmBadge
        :llm-used="message.llmUsed"
        :requested-model="message.requestedModel"
        :label-map="labelMap"
      />
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
  profileInitials: { type: String,  default: 'IA' },
  labelMap:        { type: Object,  default: () => ({}) },
})
</script>

<style scoped>
.bubble-row {
  margin-bottom: 1.6rem;
}

.bubble-row--user {
  display: flex;
  justify-content: flex-end;
}

.bubble-user {
  max-width: 80%;
  padding: 0.86rem 1.08rem;
  line-height: 1.68;
  background: var(--color-bubble-user-bg);
  color: var(--color-bubble-user-text);
  border: 1px solid var(--color-line);
  border-radius: 18px;
  font-size: 1rem;
  box-shadow: 0 8px 22px color-mix(in srgb, var(--color-coral) 6%, transparent);
}

.bubble-row--ai {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
}

.bubble-ai__avatar {
  margin-top: 0.2rem;
}

.bubble-ai {
  min-width: 0;
  flex: 1;
  padding-top: 0.08rem;
  line-height: 1.76;
  font-size: 1.02rem;
  color: var(--color-ink);
}

@media (max-width: 767px) {
  .bubble-user {
    max-width: 88%;
    font-size: 0.98rem;
  }

  .bubble-ai {
    font-size: 1rem;
  }
}
</style>
