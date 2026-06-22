<template>
  <div class="min-h-screen bg-verde-mata flex flex-col">

    <!-- Header -->
    <header class="bg-verde-folha px-5 py-4 flex items-center gap-4 shrink-0 shadow-md">
      <button
        class="text-neblina hover:text-areia transition-colors text-sm"
        @click="router.push('/')"
      >
        ← Voltar
      </button>
      <div v-if="profile" class="flex items-center gap-3">
        <span class="text-2xl">{{ profile.icone }}</span>
        <span class="text-areia font-semibold" style="font-family: 'Playfair Display', serif">
          {{ profile.nome }}
        </span>
      </div>
    </header>

    <!-- Área de mensagens -->
    <main ref="messagesEl" class="flex-1 overflow-y-auto px-4 py-6 space-y-1">
      <div v-if="!messages.length" class="text-center text-neblina text-sm mt-16 opacity-60">
        Faça sua primeira pergunta...
      </div>

      <ChatBubble
        v-for="(msg, i) in messages"
        :key="i"
        :message="msg"
        :is-streaming="isStreaming"
        :is-last-ai-message="msg.role === 'ai' && i === messages.length - 1"
      />
    </main>

    <!-- Erro -->
    <div v-if="error" class="px-4 py-2 bg-red-900/30 text-red-300 text-sm text-center">
      {{ error }}
    </div>

    <!-- Input -->
    <footer class="px-4 py-4 bg-verde-folha shrink-0">
      <form class="flex gap-3 max-w-3xl mx-auto" @submit.prevent="handleSend">
        <input
          v-model="inputText"
          :disabled="isStreaming"
          placeholder="Digite sua mensagem..."
          class="
            flex-1 bg-verde-mata text-areia placeholder-neblina/50
            rounded-xl px-4 py-3 text-sm outline-none
            border border-transparent focus:border-rio-azul
            transition-colors disabled:opacity-50
          "
        />
        <button
          type="submit"
          :disabled="isStreaming || !inputText.trim()"
          class="
            bg-guarana text-white rounded-xl px-5 py-3 text-sm font-semibold
            hover:brightness-110 transition-all
            disabled:opacity-40 disabled:cursor-not-allowed
          "
        >
          {{ isStreaming ? '...' : 'Enviar' }}
        </button>
      </form>
    </footer>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ChatBubble from '../components/ChatBubble.vue'
import { useChat } from '../composables/useChat.js'
import { fetchProfiles } from '../services/api.js'

const props = defineProps({ profileId: { type: String, required: true } })

const router      = useRouter()
const profile     = ref(null)
const inputText   = ref('')
const messagesEl  = ref(null)

const { messages, isStreaming, error, sendMessage } = useChat()

onMounted(async () => {
  const profiles = await fetchProfiles().catch(() => [])
  profile.value  = profiles.find(p => p.id === props.profileId) ?? null
  if (!profile.value) router.push('/')
})

async function handleSend() {
  const text = inputText.value.trim()
  if (!text || isStreaming.value) return
  inputText.value = ''
  await sendMessage(props.profileId, text)
}

// Scroll automático ao fim após cada mensagem
watch(messages, async () => {
  await nextTick()
  if (messagesEl.value) {
    messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  }
}, { deep: true })
</script>
