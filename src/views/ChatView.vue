<template>
  <div class="flex flex-col min-h-screen relative z-10">

    <!-- Header glassmorphism -->
    <header
      class="shrink-0 h-14 flex items-center px-4 relative"
      style="background:rgba(7,15,9,0.82); backdrop-filter:blur(16px); border-bottom:1px solid rgba(224,123,57,0.15);"
    >
      <button
        class="text-sm flex items-center gap-1.5 transition-colors duration-200"
        style="color:rgba(244,233,216,0.5);"
        @mouseover="$event.currentTarget.style.color='#E07B39'"
        @mouseleave="$event.currentTarget.style.color='rgba(244,233,216,0.5)'"
        @click="router.push('/')"
      >
        ← Voltar
      </button>

      <div
        v-if="profile"
        class="absolute left-1/2 -translate-x-1/2 flex items-center gap-2"
      >
        <span class="text-lg leading-none">{{ profile.icone }}</span>
        <span
          class="text-areia font-semibold text-sm"
          style="font-family:'Playfair Display',serif;"
        >
          {{ profile.nome }}
        </span>
      </div>
    </header>

    <!-- Mensagens -->
    <main
      ref="messagesEl"
      class="flex-1 overflow-y-auto px-4 py-6"
      style="scroll-behavior:smooth;"
    >
      <div class="max-w-2xl mx-auto">

        <!-- Estado vazio -->
        <div
          v-if="!messages.length && profile"
          class="flex flex-col items-center justify-center text-center pt-16 pb-10 gap-5"
        >
          <div
            class="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
            style="background:rgba(45,106,79,0.35); box-shadow:0 0 0 1px rgba(45,106,79,0.5), 0 8px 32px rgba(45,106,79,0.2);"
          >
            {{ profile.icone }}
          </div>

          <div>
            <h2
              class="text-areia text-xl font-semibold mb-1"
              style="font-family:'Playfair Display',serif;"
            >
              {{ profile.nome }}
            </h2>
            <p class="text-sm" style="color:rgba(244,233,216,0.45);">
              Como posso te ajudar hoje?
            </p>
          </div>

          <div class="flex flex-wrap justify-center gap-2 max-w-md">
            <button
              v-for="chip in suggestions"
              :key="chip"
              class="chip-btn rounded-full px-4 py-2 text-sm transition-all duration-200"
              @click="inputText = chip"
            >
              {{ chip }}
            </button>
          </div>
        </div>

        <!-- Mensagens do chat -->
        <ChatBubble
          v-for="(msg, i) in messages"
          :key="i"
          :message="msg"
          :is-streaming="isStreaming"
          :is-last-ai-message="msg.role === 'ai' && i === messages.length - 1"
          :profile-icon="profile?.icone ?? '🤖'"
        />

      </div>
    </main>

    <!-- Erro -->
    <div
      v-if="error"
      class="px-4 py-2 text-center text-sm"
      style="background:rgba(220,38,38,0.12); border-top:1px solid rgba(220,38,38,0.25); color:#fca5a5;"
    >
      {{ error }}
    </div>

    <!-- Input footer -->
    <footer
      class="shrink-0 px-4 py-4"
      style="background:rgba(7,15,9,0.88); backdrop-filter:blur(16px); border-top:1px solid rgba(45,106,79,0.2);"
    >
      <form class="max-w-2xl mx-auto flex gap-3" @submit.prevent="handleSend">
        <input
          v-model="inputText"
          :disabled="isStreaming"
          placeholder="Digite sua mensagem..."
          class="flex-1 rounded-xl px-4 py-3 text-sm text-areia outline-none transition-all duration-200 disabled:opacity-50"
          style="background:rgba(45,106,79,0.1); border:1px solid rgba(45,106,79,0.3); min-height:48px;"
          @focus="$event.target.style.borderColor='rgba(224,123,57,0.55)'"
          @blur="$event.target.style.borderColor='rgba(45,106,79,0.3)'"
        />
        <button
          type="submit"
          :disabled="isStreaming || !inputText.trim()"
          class="rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 hover:brightness-110"
          style="background:#E07B39; box-shadow:0 4px 20px rgba(224,123,57,0.35);"
        >
          {{ isStreaming ? '···' : 'Enviar' }}
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
.chip-btn {
  border: 1px solid rgba(224,123,57,0.3);
  color: rgba(244,233,216,0.7);
  background: rgba(45,106,79,0.08);
}
.chip-btn:hover {
  border-color: rgba(224,123,57,0.65);
  color: #F4E9D8;
  background: rgba(45,106,79,0.15);
}
</style>
