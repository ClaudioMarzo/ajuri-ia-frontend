<template>
  <div class="flex h-[100dvh] overflow-hidden">

    <!-- Sidebar fixa (desktop) -->
    <ChatSidebar
      class="hidden md:flex"
      :profile="profile"
      :suggestions="suggestions"
      @new-chat="handleNewChat"
      @select-suggestion="useSuggestion"
      @go-home="router.push('/')"
    />

    <!-- Drawer (mobile) -->
    <Transition name="drawer">
      <div v-if="drawerOpen" class="md:hidden fixed inset-0 z-40 flex">
        <div class="drawer-overlay absolute inset-0" @click="drawerOpen = false"></div>
        <ChatSidebar
          class="relative z-10 flex"
          closable
          :profile="profile"
          :suggestions="suggestions"
          @new-chat="handleNewChat"
          @select-suggestion="useSuggestion"
          @go-home="router.push('/')"
          @close="drawerOpen = false"
        />
      </div>
    </Transition>

    <!-- Área principal -->
    <div class="flex-1 flex flex-col min-w-0">

      <!-- Header -->
      <header class="shrink-0 h-16 flex items-center gap-2 px-6 lg:px-8"
              style="background:var(--color-surface); border-bottom:1px solid var(--color-line);">
        <button type="button" class="hamburger md:hidden" aria-label="Abrir menu" @click="drawerOpen = true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        </button>

        <div v-if="profile" class="flex items-center gap-2 min-w-0">
          <span class="text-xl leading-none md:hidden" role="img" :aria-label="profile.nome">{{ profile.icone }}</span>
          <span class="font-semibold text-base truncate" style="font-family:'Playfair Display',serif; color:var(--color-ink);">
            {{ profile.nome }}
          </span>
        </div>

        <div class="flex-1"></div>
        <ThemeToggle class="md:hidden" />
      </header>

      <!-- Mensagens -->
      <main ref="messagesEl" class="flex-1 overflow-y-auto px-6 lg:px-10 py-8 lg:py-10">
        <!-- Empty state (centralizado verticalmente) -->
        <div v-if="!messages.length && profile"
             class="min-h-full flex flex-col items-center justify-center text-center gap-6 pb-10">
          <span class="w-18 h-18 rounded-2xl flex items-center justify-center text-4xl"
                style="width:4.5rem;height:4.5rem;background:var(--color-surface); box-shadow:var(--shadow-card); border:1px solid var(--color-line);"
                role="img" :aria-label="profile.nome">
            {{ profile.icone }}
          </span>
          <div>
            <h2 class="text-2xl font-semibold mb-1.5" style="font-family:'Playfair Display',serif; color:var(--color-ink);">
              {{ profile.nome }}
            </h2>
            <p class="text-sm" style="color:var(--color-ink-soft);">Como posso te ajudar hoje?</p>
          </div>
          <div class="flex flex-wrap justify-center gap-2.5 max-w-lg">
            <button v-for="chip in suggestions" :key="chip" type="button" class="chip" @click="useSuggestion(chip)">
              {{ chip }}
            </button>
          </div>
        </div>

        <!-- Conversa -->
        <div v-else class="max-w-[var(--reading)] mx-auto">
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
      <div v-if="error" role="alert" class="error-bar px-4 py-2.5 text-center text-sm font-medium">
        {{ error }}
      </div>

      <!-- Composer -->
      <footer class="shrink-0 px-6 lg:px-10 pt-4"
              style="background:var(--color-surface); box-shadow:var(--shadow-float); padding-bottom:max(1rem, env(safe-area-inset-bottom));">
        <form class="max-w-[var(--reading)] mx-auto flex gap-3 items-end" @submit.prevent="handleSend">
          <label for="chat-input" class="sr-only">Mensagem</label>
          <input
            id="chat-input"
            ref="inputEl"
            v-model="inputText"
            :disabled="isStreaming"
            placeholder="Digite sua mensagem..."
            class="composer-input flex-1 px-4 text-sm"
            style="min-height:52px;"
            autocomplete="off"
          />
          <button type="submit" :disabled="isStreaming || !inputText.trim()"
                  class="btn-primary px-6 text-sm shrink-0" style="min-height:52px;">
            {{ isStreaming ? 'Enviando…' : 'Enviar' }}
          </button>
        </form>
      </footer>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ChatBubble from '../components/ChatBubble.vue'
import ChatSidebar from '../components/ChatSidebar.vue'
import ThemeToggle from '../components/ThemeToggle.vue'
import { useChat } from '../composables/useChat.js'
import { fetchProfiles } from '../services/api.js'

const props = defineProps({ profileId: { type: String, required: true } })

const router     = useRouter()
const profile    = ref(null)
const inputText  = ref('')
const drawerOpen = ref(false)
const messagesEl = ref(null)
const inputEl    = ref(null)

const { messages, isStreaming, error, sendMessage, clearMessages } = useChat()

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
  drawerOpen.value = false
  nextTick(() => inputEl.value?.focus())
}

function handleNewChat() {
  clearMessages()
  inputText.value = ''
  drawerOpen.value = false
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
  if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
}, { deep: true })
</script>

<style scoped>
.hamburger {
  display: inline-flex; align-items: center; justify-content: center;
  width: 36px; height: 36px; margin-left: -0.5rem;
  border-radius: 0.5rem; border: none; cursor: pointer;
  color: var(--color-ink-soft); background: transparent;
  transition: background 0.2s ease, color 0.2s ease;
}
.hamburger:hover { background: var(--color-surface-2); color: var(--color-ink); }

.drawer-overlay { background: rgba(0,0,0,0.45); }

.drawer-enter-active, .drawer-leave-active { transition: opacity 0.25s ease; }
.drawer-enter-active .sidebar, .drawer-leave-active .sidebar { transition: transform 0.25s ease; }
.drawer-enter-from, .drawer-leave-to { opacity: 0; }
.drawer-enter-from .sidebar, .drawer-leave-to .sidebar { transform: translateX(-100%); }
</style>
