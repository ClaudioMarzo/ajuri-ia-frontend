<template>
  <div class="chat-shell flex h-[100dvh] overflow-hidden">

    <!-- Sidebar fixa (desktop) -->
    <ChatSidebar
      class="hidden md:flex"
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
      <header class="chat-header shrink-0 h-[72px] flex items-center gap-3 px-6 lg:px-9">
        <button type="button" class="hamburger md:hidden" aria-label="Abrir menu" @click="drawerOpen = true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        </button>

        <div v-if="profile" class="header-profile min-w-0">
          <span class="monogram monogram--floresta w-9 h-9 text-sm" aria-hidden="true">{{ initials }}</span>
          <span class="header-profile__name truncate" style="font-family:'Playfair Display',serif;">
            {{ profile.nome }}
          </span>
        </div>

        <div class="flex-1"></div>

        <!-- Indicador de health -->
        <div v-if="healthChecked" class="health-status" :title="apiOnline ? 'API online' : 'API offline'">
          <span class="health-dot" :class="apiOnline ? 'online' : 'offline'"></span>
          <span class="health-text hidden sm:inline">{{ apiOnline ? 'API online' : 'API offline' }}</span>
        </div>

        <ThemeToggle class="md:hidden" />
      </header>

      <!-- Mensagens -->
      <main ref="messagesEl" class="chat-main flex-1 overflow-y-auto px-6 lg:px-12 py-9 lg:py-11 flex flex-col items-center">
        <!-- Empty state -->
        <div v-if="!messages.length && profile"
              class="chat-empty min-h-full w-full flex flex-col items-center justify-center text-center gap-7 pb-12">
          <span class="monogram monogram--floresta text-4xl" style="width:5.25rem;height:5.25rem;" aria-hidden="true">
            {{ initials }}
          </span>
          <div>
            <h2 class="text-3xl font-semibold mb-2" style="font-family:'Playfair Display',serif; color:var(--color-ink);">
              {{ profile.nome }}
            </h2>
            <p class="text-base" style="color:var(--color-ink-soft);">Como posso te ajudar hoje?</p>
          </div>
          <div class="chat-empty__chips flex flex-wrap justify-center gap-3 max-w-2xl">
            <button v-for="chip in suggestions" :key="chip" type="button" class="chip" @click="useSuggestion(chip)">
              {{ chip }}
            </button>
          </div>
        </div>

        <!-- Conversa -->
        <div v-else class="chat-col chat-stream">
          <ChatBubble
            v-for="(msg, i) in messages"
            :key="i"
            :message="msg"
            :is-streaming="isStreaming"
            :is-last-ai-message="msg.role === 'ai' && i === messages.length - 1"
            :profile-initials="initials"
            :label-map="labelMap"
          />
        </div>
      </main>

      <!-- Erro -->
      <div v-if="error" role="alert" class="error-bar px-4 py-2.5 text-center text-sm font-medium">
        {{ error }}
      </div>

      <!-- Composer -->
        <footer class="chat-footer shrink-0 px-4 lg:px-11 pt-3 flex justify-center"
          style="padding-bottom:max(1.1rem, env(safe-area-inset-bottom));">
        <form class="composer-card chat-col chat-composer" @submit.prevent="handleSend">
          <label for="chat-input" class="sr-only">Mensagem</label>
          <textarea
            id="chat-input"
            ref="inputEl"
            v-model="inputText"
            rows="1"
            :disabled="isStreaming"
            placeholder="Pergunte ao AjuriIA…"
            class="composer-card__input"
            @input="autoGrow"
            @keydown.enter.exact.prevent="handleSend"
          ></textarea>
          <div class="composer-card__row">
            <div class="composer-meta flex items-center gap-2 min-w-0">
              <span class="composer-pill" v-if="profile">
                <span class="composer-pill__dot"></span>
                <span class="composer-pill__name">{{ profile.nome }}</span>
              </span>
              <ModelSelector
                v-if="availableModels.length"
                v-model="selectedModel"
                :models="availableModels"
              />
            </div>
            <!-- Parar streaming -->
            <button v-if="isStreaming" type="button" class="composer-stop" aria-label="Parar" @click="stop()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="4" y="4" width="16" height="16" rx="2"/>
              </svg>
            </button>
            <!-- Enviar -->
            <button v-else type="submit" class="composer-send" :disabled="!inputText.trim()" aria-label="Enviar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
            </button>
          </div>
        </form>
      </footer>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ChatBubble from '../components/ChatBubble.vue'
import ChatSidebar from '../components/ChatSidebar.vue'
import ThemeToggle from '../components/ThemeToggle.vue'
import ModelSelector from '../components/ModelSelector.vue'
import { useChat } from '../composables/useChat.js'
import { fetchProfiles, fetchModels, fetchHealth } from '../services/api.js'
import { monogram } from '../utils/monogram.js'

const STORAGE_KEY = 'ajuri:model'

const props = defineProps({ profileId: { type: String, required: true } })

const router     = useRouter()
const route      = useRoute()
const profile    = ref(null)
const initials   = computed(() => monogram(profile.value?.nome))
const inputText  = ref('')
const drawerOpen = ref(false)
const messagesEl = ref(null)
const inputEl    = ref(null)

// Modelos
const availableModels = ref([])
const selectedModel   = ref(localStorage.getItem(STORAGE_KEY) ?? null)
const labelMap        = ref({})
const activeModel     = computed(() => {
  if (!selectedModel.value) return undefined
  return availableModels.value.some(m => m.id === selectedModel.value)
    ? selectedModel.value
    : undefined
})

// Health
const apiOnline    = ref(true)
const healthChecked = ref(false)

const { messages, isStreaming, error, sendMessage, stop, clearMessages } = useChat()

const SUGGESTIONS_BY_ID = {
  'professor':    ['Me ajude a criar um plano de aula', 'Como engajar alunos em sala?', 'Atividade sobre a Amazônia'],
  'agente-saude': ['Como orientar sobre dengue?', 'Calendário de vacinação atualizado', 'Comunicado para a comunidade'],
  'produtor':     ['Qual o preço atual do guaraná?', 'Como aumentar minha produção?', 'Onde vender minha produção?'],
  'pescador':     ['Como identificar peixes mais vendáveis?', 'Qual época é melhor para pescar?', 'Como preservar o peixe fresco?'],
  'servidor':     ['Como redigir um ofício?', 'Modelo de ata de reunião', 'Como elaborar um relatório oficial?'],
  'empreendedor': ['Como montar um plano de negócio?', 'Como fazer um pitch rápido?', 'Ideias de negócio para a região'],
}
const DEFAULT_SUGGESTIONS = ['Como posso começar?', 'Quais são suas principais funções?', 'Me dê um exemplo prático']
const suggestions = computed(() => SUGGESTIONS_BY_ID[profile.value?.id] ?? DEFAULT_SUGGESTIONS)

// Persiste a escolha de modelo no localStorage
watch(selectedModel, val => {
  if (val) localStorage.setItem(STORAGE_KEY, val)
  else     localStorage.removeItem(STORAGE_KEY)
})

onMounted(async () => {
  // Carrega perfis, modelos e health em paralelo
  const [profiles, modelsData, healthy] = await Promise.all([
    fetchProfiles().catch(() => []),
    fetchModels().catch(() => null),
    fetchHealth(),
  ])

  apiOnline.value     = healthy
  healthChecked.value = true

  profile.value = profiles.find(p => p.id === props.profileId) ?? null
  if (!profile.value) { router.push('/'); return }

  if (modelsData) {
    availableModels.value = modelsData.models
    for (const m of modelsData.models) labelMap.value[m.id] = m.label
    // Usa o default da API se não houver escolha salva ou a salva for inválida
    const savedValid = modelsData.models.some(m => m.id === selectedModel.value)
    if (!savedValid) selectedModel.value = modelsData.default
  }

  // Pergunta vinda da Home (?q=...)
  const initial = route.query.q
  if (typeof initial === 'string' && initial.trim()) {
    router.replace({ path: route.path })
    await sendMessage(props.profileId, initial.trim(), activeModel.value)
  }
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

function autoGrow(e) {
  const el = e.target
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 200) + 'px'
}

async function handleSend() {
  const text = inputText.value.trim()
  if (!text || isStreaming.value) return
  inputText.value = ''
  if (inputEl.value) inputEl.value.style.height = 'auto'
  await sendMessage(props.profileId, text, activeModel.value)
}

watch(messages, async () => {
  await nextTick()
  if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
}, { deep: true })
</script>

<style scoped>
.chat-shell {
  background:
    radial-gradient(120% 120% at 50% -20%, color-mix(in srgb, var(--color-coral) 12%, transparent), transparent 45%),
    transparent;
}

.chat-col {
  width: 100%;
  max-width: 840px;
  margin-inline: auto;
}

.chat-header {
  background: color-mix(in srgb, var(--color-surface) 82%, transparent);
  border-bottom: 1px solid var(--color-line);
  backdrop-filter: blur(6px);
  box-shadow: 0 1px 0 color-mix(in srgb, var(--color-line) 80%, transparent);
}

.header-profile {
  display: inline-flex;
  align-items: center;
  gap: 0.72rem;
  min-width: 0;
  margin-left: 0.4rem;
  padding: 0.5rem 0.95rem;
  border: 1px solid var(--color-line);
  border-radius: 9999px;
  background: color-mix(in srgb, var(--color-surface-2) 62%, transparent);
  min-height: 42px;
}

.header-profile__name {
  color: var(--color-ink);
  font-weight: 600;
  font-size: 1.1rem;
  letter-spacing: -0.01em;
}

.chat-main {
  position: relative;
  padding-top: 2.3rem;
}

.chat-empty {
  animation: fadeSlideUp 0.35s ease-out both;
}

.chat-empty h2 {
  letter-spacing: -0.02em;
}

.chat-empty p {
  max-width: 34ch;
  margin-inline: auto;
}

.chat-empty__chips {
  padding: 0.35rem 0;
}

.chat-empty__chips :deep(.chip) {
  font-size: 0.95rem;
  padding: 0.64rem 1.1rem;
  border-radius: 9999px;
}

.chat-stream {
  padding-top: 1.3rem;
  padding-bottom: 1.25rem;
}

.chat-footer {
  position: relative;
}

.chat-footer::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(to top, color-mix(in srgb, var(--color-paper) 72%, transparent), transparent 70%);
}

.chat-composer {
  position: relative;
  border-color: color-mix(in srgb, var(--color-line) 82%, transparent);
  padding-top: 1.25rem;
  padding-bottom: 1.05rem;
  box-shadow: 0 16px 36px color-mix(in srgb, #000 16%, transparent);
}

.chat-composer .composer-card__row {
  align-items: center;
  gap: 1rem;
  margin-top: 0.95rem;
}

.composer-meta {
  min-height: 44px;
  gap: 0.65rem;
}

.chat-composer .composer-pill {
  max-width: 58%;
  font-size: 0.96rem;
  padding: 0.48rem 0.92rem;
}

.chat-composer .composer-card__input {
  font-size: 1.08rem;
  line-height: 1.58;
}

.chat-composer :deep(.model-sel__btn) {
  background: color-mix(in srgb, var(--color-surface-2) 62%, transparent);
  border-color: color-mix(in srgb, var(--color-line) 90%, transparent);
}

.chat-composer :deep(.model-sel__btn:hover) {
  border-color: color-mix(in srgb, var(--color-floresta) 42%, transparent);
}

/* Health indicator */
.health-status {
  display: inline-flex;
  align-items: center;
  gap: 0.62rem;
  padding: 0.56rem 1rem;
  border: 1px solid var(--color-line);
  border-radius: 9999px;
  background: color-mix(in srgb, var(--color-surface-2) 65%, transparent);
  min-height: 42px;
}

.health-text {
  font-size: 0.92rem;
  color: var(--color-ink-soft);
  font-weight: 600;
}

.health-dot {
  width: 9px; height: 9px;
  border-radius: 9999px;
  flex-shrink: 0;
}
.health-dot.online  { background: var(--color-floresta); }
.health-dot.offline { background: var(--color-coral); }

/* Botão parar (quadrado) */
.composer-stop {
  width: 44px; height: 44px;
  flex-shrink: 0;
  border-radius: 9999px;
  border: 1px solid var(--color-line);
  background: var(--color-surface-2);
  color: var(--color-ink-soft);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.composer-stop:hover { background: var(--color-coral); color: #fff; border-color: var(--color-coral); }

.hamburger {
  display: inline-flex; align-items: center; justify-content: center;
  width: 36px; height: 36px; margin-left: 0;
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

@media (max-width: 767px) {
  .chat-header {
    padding-inline: 1.4rem;
    height: 64px;
  }

  .chat-main {
    padding-top: 1.2rem;
  }

  .header-profile {
    margin-left: 0.48rem;
    padding: 0.42rem 0.74rem;
    min-height: 38px;
  }

  .header-profile__name {
    font-size: 1rem;
  }

  .chat-empty {
    gap: 1.35rem;
    padding-top: 1rem;
  }

  .chat-empty h2 {
    font-size: 2rem;
  }

  .chat-empty p {
    font-size: 1rem;
  }

  .chat-col {
    max-width: 100%;
  }

  .chat-composer {
    border-radius: 1rem;
    padding-top: 0.85rem;
  }

  .chat-composer .composer-card__input {
    font-size: 1rem;
  }

  .chat-composer .composer-card__row {
    align-items: flex-end;
  }

  .composer-meta {
    min-width: 0;
    overflow-x: auto;
    padding-bottom: 2px;
    scrollbar-width: none;
  }

  .composer-meta::-webkit-scrollbar {
    display: none;
  }

  .chat-composer .composer-pill {
    max-width: none;
  }
}
</style>
