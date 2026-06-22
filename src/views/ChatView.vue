<template>
  <div class="flex flex-col min-h-screen relative z-10">

    <!-- Header glassmorphism -->
    <header class="shrink-0 px-4 py-3 flex items-center gap-3"
            style="background:rgba(45,106,79,0.15); backdrop-filter:blur(12px); border-bottom:1px solid rgba(224,123,57,0.2);">
      <button class="text-sm transition-colors"
              style="color:rgba(248,244,239,0.6);"
              @mouseover="$event.target.style.color='#F4E9D8'"
              @mouseleave="$event.target.style.color='rgba(248,244,239,0.6)'"
              @click="router.push('/')">
        ← Voltar
      </button>
      <div v-if="profile" class="flex items-center gap-2">
        <span class="text-xl">{{ profile.icone }}</span>
        <span class="text-areia font-semibold text-sm"
              style="font-family:'Playfair Display',serif;">
          {{ profile.nome }}
        </span>
      </div>
    </header>

    <!-- Mensagens -->
    <main ref="messagesEl"
          class="flex-1 overflow-y-auto px-3 sm:px-6 py-6">
      <div v-if="!messages.length"
           class="text-center mt-20 text-sm"
           style="color:rgba(248,244,239,0.35);">
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
    <div v-if="error"
         class="px-4 py-2 text-center text-sm"
         style="background:rgba(220,38,38,0.15); border-top:1px solid rgba(220,38,38,0.3); color:#fca5a5;">
      {{ error }}
    </div>

    <!-- Input footer -->
    <footer class="shrink-0 px-3 sm:px-6 py-3"
            style="background:rgba(7,15,9,0.85); backdrop-filter:blur(12px); border-top:1px solid rgba(45,106,79,0.25);">
      <form class="flex gap-2 max-w-3xl mx-auto" @submit.prevent="handleSend">
        <input
          v-model="inputText"
          :disabled="isStreaming"
          placeholder="Digite sua mensagem..."
          class="flex-1 rounded-xl px-4 py-3 text-sm text-areia outline-none transition-all disabled:opacity-50"
          style="background:rgba(45,106,79,0.12); border:1px solid rgba(45,106,79,0.3);"
          @focus="$event.target.style.borderColor='rgba(224,123,57,0.6)'"
          @blur="$event.target.style.borderColor='rgba(45,106,79,0.3)'"
        />
        <button
          type="submit"
          :disabled="isStreaming || !inputText.trim()"
          class="rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          style="background:#E07B39; box-shadow:0 4px 15px rgba(224,123,57,0.3);"
          @mouseover="onSendHover($event)"
          @mouseleave="$event.target.style.filter='none'"
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

const router     = useRouter()
const profile    = ref(null)
const inputText  = ref('')
const messagesEl = ref(null)

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

function onSendHover(e) {
  if (!isStreaming.value && inputText.value.trim())
    e.target.style.filter = 'brightness(1.1)'
}

watch(messages, async () => {
  await nextTick()
  if (messagesEl.value)
    messagesEl.value.scrollTop = messagesEl.value.scrollHeight
}, { deep: true })
</script>
