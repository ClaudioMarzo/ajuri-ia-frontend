<template>
  <div class="flex flex-col h-[100dvh]">

    <!-- Header -->
    <header
      class="shrink-0 h-14 flex items-center px-4 relative"
      style="background:var(--color-surface); border-bottom:1px solid var(--color-line);"
    >
      <button
        type="button"
        class="back-btn text-sm flex items-center gap-1.5 rounded-lg px-2 py-1 -ml-2"
        @click="router.push('/')"
      >
        ← Voltar
      </button>

      <div v-if="profile" class="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
        <span class="text-lg leading-none" role="img" :aria-label="profile.nome">{{ profile.icone }}</span>
        <span class="font-semibold text-sm" style="font-family:'Playfair Display',serif; color:var(--color-ink);">
          {{ profile.nome }}
        </span>
      </div>
    </header>

    <!-- Mensagens -->
    <main ref="messagesEl" class="flex-1 overflow-y-auto px-4 py-6">
      <div class="max-w-[720px] mx-auto">

        <!-- Empty state -->
        <div
          v-if="!messages.length && profile"
          class="flex flex-col items-center text-center pt-12 sm:pt-20 pb-10 gap-5"
        >
          <span
            class="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
            style="background:var(--color-surface); box-shadow:var(--shadow-card); border:1px solid var(--color-line);"
            role="img"
            :aria-label="profile.nome"
          >
            {{ profile.icone }}
          </span>

          <div>
            <h2 class="text-xl font-semibold mb-1" style="font-family:'Playfair Display',serif; color:var(--color-ink);">
              {{ profile.nome }}
            </h2>
            <p class="text-sm" style="color:var(--color-ink-soft);">Como posso te ajudar hoje?</p>
          </div>

          <div class="flex flex-wrap justify-center gap-2 max-w-md">
            <button
              v-for="chip in suggestions"
              :key="chip"
              type="button"
              class="chip"
              @click="useSuggestion(chip)"
            >
              {{ chip }}
            </button>
          </div>
        </div>

        <!-- Mensagens -->
        <ChatBubble
          v-for="(msg, i) in messages"
          :key="i"
          :message="msg"
          :is-streaming="isStreaming"
          :is-last-ai-message="msg.role === 'ai' && i === messages.length - 1"
          :profile-icon="profile?.icone ?? '🌿'"
        />

      </div>
    </main>

    <!-- Erro -->
    <div
      v-if="error"
      role="alert"
      class="px-4 py-2.5 text-center text-sm font-medium"
      style="background:#FEF2F2; border-top:1px solid #FCA5A5; color:#B91C1C;"
    >
      {{ error }}
    </div>

    <!-- Composer -->
    <footer
      class="shrink-0 px-4 pt-3"
      style="background:var(--color-surface); box-shadow:var(--shadow-float); padding-bottom:max(0.75rem, env(safe-area-inset-bottom));"
    >
      <form class="max-w-[720px] mx-auto flex gap-2.5 items-end" @submit.prevent="handleSend">
        <label for="chat-input" class="sr-only">Mensagem</label>
        <input
          id="chat-input"
          ref="inputEl"
          v-model="inputText"
          :disabled="isStreaming"
          placeholder="Digite sua mensagem..."
          class="composer-input flex-1 px-4 py-3 text-sm"
          style="min-height:48px;"
          autocomplete="off"
        />
        <button
          type="submit"
          :disabled="isStreaming || !inputText.trim()"
          class="btn-primary px-5 py-3 text-sm shrink-0"
          style="min-height:48px;"
        >
          {{ isStreaming ? 'Enviando…' : 'Enviar' }}
        </button>
      </form>
    </footer>

  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ChatBubble from '../components/ChatBubble.vue'
import { useChat } from '../composables/useChat.js'
import { fetchProfiles } from '../services/api.js'

const props = defineProps({ profileId: { type: String, required: true } })

const router     = useRouter()
const profile    = ref(null)
const inputText  = ref('')
const messagesEl = ref(null)
const inputEl    = ref(null)

const { messages, isStreaming, error, sendMessage } = useChat()

const SUGGESTIONS_MAP = {
  'pescador':     ['Como identificar peixes mais vendáveis?', 'Qual época é melhor para pescar?', 'Como preservar o peixe fresco?'],
  'agricultor':   ['Como planejar minha safra?', 'Quais adubos naturais posso usar?', 'Como lidar com pragas sem agrotóxico?'],
  'guarana':      ['Qual o preço atual do guaraná?', 'Como aumentar minha produção?', 'Onde vender minha produção?'],
  'professor':    ['Me ajude a criar um plano de aula', 'Como engajar alunos em sala?', 'Atividade sobre a Amazônia'],
  'saude':        ['Como orientar sobre dengue?', 'Calendário de vacinação atualizado', 'Comunicado para a comunidade'],
  'servidor':     ['Como redigir um ofício?', 'Modelo de ata de reunião', 'Como elaborar um relatório oficial?'],
  'empreendedor': ['Como montar um plano de negócio?', 'Como fazer um pitch rápido?', 'Ideias de negócio para a região'],
}

const DEFAULT_SUGGESTIONS = ['Como posso começar?', 'Quais são suas principais funções?', 'Me dê um exemplo prático']

const suggestions = computed(() => {
  if (!profile.value) return DEFAULT_SUGGESTIONS
  const id = (profile.value.id ?? '').toLowerCase()
  const nome = (profile.value.nome ?? '').toLowerCase()
  for (const [key, chips] of Object.entries(SUGGESTIONS_MAP)) {
    if (id.includes(key) || nome.includes(key)) return chips
  }
  return DEFAULT_SUGGESTIONS
})

onMounted(async () => {
  const profiles = await fetchProfiles().catch(() => [])
  profile.value  = profiles.find(p => p.id === props.profileId) ?? null
  if (!profile.value) router.push('/')
})

function useSuggestion(chip) {
  inputText.value = chip
  nextTick(() => inputEl.value?.focus())
}

async function handleSend() {
  const text = inputText.value.trim()
  if (!text || isStreaming.value) return
  inputText.value = ''
  await sendMessage(props.profileId, text)
}

watch(messages, async () => {
  await nextTick()
  if (messagesEl.value)
    messagesEl.value.scrollTop = messagesEl.value.scrollHeight
}, { deep: true })
</script>

<style scoped>
.back-btn {
  color: var(--color-ink-soft);
  transition: color 0.2s ease, background 0.2s ease;
}
.back-btn:hover {
  color: var(--color-floresta);
  background: var(--color-surface-2);
}
.back-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(27,94,63,0.18);
}
.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
}
</style>
