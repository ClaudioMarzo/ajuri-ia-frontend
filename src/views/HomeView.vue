<template>
  <div class="home-root">

    <!-- Theme toggle flutuante (não afeta o fluxo) -->
    <div class="home-toggle">
      <ThemeToggle />
    </div>

    <!-- Hero -->
    <h1 class="wordmark" style="font-family:'Playfair Display',serif;">
      Ajuri<span style="color:var(--color-coral);">IA</span>
    </h1>
    <p class="subtitle">
      Inteligência artificial para a realidade amazônica. Pergunte ou escolha um perfil.
    </p>

    <!-- Loading -->
    <div
      v-if="loading"
      role="status"
      aria-live="polite"
      class="flex items-center gap-3 mt-10 text-sm"
      style="color:var(--color-ink-soft);"
    >
      <span class="inline-block w-4 h-4 rounded-full border-2 animate-spin"
            style="border-color:var(--color-coral); border-top-color:transparent;"></span>
      Carregando perfis...
    </div>

    <!-- Erro -->
    <div
      v-else-if="error"
      role="alert"
      class="mt-10 text-sm font-medium"
      style="color:var(--color-coral);"
    >
      {{ error }}
    </div>

    <template v-else>
      <!-- Composer -->
      <form class="composer-card home-composer" @submit.prevent="askFromHome">
        <textarea
          ref="homeInput"
          v-model="homeText"
          rows="1"
          placeholder="Como o AjuriIA pode ajudar hoje?"
          class="composer-card__input"
          @input="autoGrow"
          @keydown.enter.exact.prevent="askFromHome"
        ></textarea>
        <div class="composer-card__row home-composer__row">
          <div class="profile-dd">
            <button type="button" class="composer-pill profile-dd__btn" :aria-expanded="dropOpen"
                    aria-haspopup="listbox" @click="dropOpen = !dropOpen">
              <span class="composer-pill__dot"></span>
              <span style="color:var(--color-ink-soft);">Perfil:</span>
              <span class="profile-dd__value">{{ selectedName }}</span>
              <svg class="profile-dd__chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <ul v-if="dropOpen" class="profile-dd__menu" role="listbox">
              <li v-for="p in profiles" :key="p.id" role="option"
                  :aria-selected="p.id === selectedProfileId"
                  class="profile-dd__item" :class="{ active: p.id === selectedProfileId }"
                  @click="selectProfile(p.id)">
                {{ p.nome }}
              </li>
            </ul>
          </div>
          <button type="submit" class="composer-send" :disabled="!homeText.trim()" aria-label="Enviar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
          </button>
        </div>
      </form>

      <!-- Fecha o dropdown ao clicar fora -->
      <div v-if="dropOpen" class="profile-dd__backdrop" @click="dropOpen = false"></div>

      <!-- Seleção de perfil -->
      <p class="pick-label">Ou escolha um perfil</p>
      <div class="profile-grid">
        <ProfileCard
          v-for="(profile, i) in profiles"
          :key="profile.id"
          :profile="profile"
          :index="i"
          @select="goToChat"
        />
      </div>
    </template>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ProfileCard from '../components/ProfileCard.vue'
import ThemeToggle from '../components/ThemeToggle.vue'
import { fetchBootstrap } from '../services/api.js'

const router    = useRouter()
const profiles  = ref([])
const loading   = ref(true)
const error     = ref(null)
const homeText  = ref('')
const homeInput = ref(null)
const selectedProfileId = ref('')
const dropOpen  = ref(false)

const selectedName = computed(() =>
  profiles.value.find(p => p.id === selectedProfileId.value)?.nome ?? 'Selecione'
)

function selectProfile(id) {
  selectedProfileId.value = id
  dropOpen.value = false
}

onMounted(async () => {
  try {
    const bootstrap = await fetchBootstrap()
    profiles.value = bootstrap.profiles
    selectedProfileId.value = profiles.value[0]?.id ?? ''
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})

function autoGrow(e) {
  const el = e.target
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 200) + 'px'
}

function goToChat(profile) {
  router.push(`/chat/${profile.id}`)
}

function askFromHome() {
  const text = homeText.value.trim()
  if (!text || !selectedProfileId.value) return
  router.push({ path: `/chat/${selectedProfileId.value}`, query: { q: text } })
}
</script>

<style scoped>
.home-root {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* centraliza verticalmente; cresce/rola se faltar espaço */
  text-align: center;
  padding: 56px 24px;
}
.home-toggle {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.wordmark {
  font-weight: 600;
  letter-spacing: -0.035em;
  line-height: 1;
  color: var(--color-ink);
  font-size: clamp(2.75rem, 7vw, 3.75rem); /* 60px no desktop */
}
.subtitle {
  margin-top: 18px;
  max-width: 30ch;
  font-size: 1.0625rem; /* 17px */
  line-height: 1.5;
  color: var(--color-ink-soft);
}

.home-composer { margin-top: 34px; width: 100%; max-width: 660px; }

.pick-label {
  margin-top: 40px;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-ink-soft);
}

.profile-grid {
  margin-top: 18px;
  width: 100%;
  max-width: 792px; /* limite: até 3 cards por linha; mais que isso, quebra centralizado */
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;
  gap: 16px;
}

/* Dropdown customizado de perfil */
.home-composer__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.75rem;
  padding-left: 0;
}

.profile-dd {
  position: relative;
  justify-self: start;
}

.home-composer__row .composer-send { justify-self: end; }
.profile-dd__btn {
  gap: 0.4rem;
  cursor: pointer;
  background: var(--color-surface);
}
.profile-dd__btn:hover { border-color: color-mix(in srgb, var(--color-coral) 35%, transparent); }
.profile-dd__value {
  color: var(--color-ink);
  font-weight: 500;
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}
.profile-dd__chev { color: var(--color-ink-soft); transition: transform 0.2s ease; flex-shrink: 0; }
.profile-dd__btn[aria-expanded="true"] .profile-dd__chev { transform: rotate(180deg); }

.profile-dd__backdrop { position: fixed; inset: 0; z-index: 40; }
.profile-dd__menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 50;
  min-width: 240px;
  max-height: 280px;
  overflow-y: auto;
  margin: 0;
  padding: 6px;
  list-style: none;
  text-align: left;
  background: var(--color-surface);
  border: 1px solid var(--color-line);
  border-radius: 0.9rem;
  box-shadow: var(--shadow-hover);
}
.profile-dd__item {
  padding: 9px 12px;
  border-radius: 0.6rem;
  font-size: 0.875rem;
  color: var(--color-ink);
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s ease, color 0.15s ease;
}
.profile-dd__item:hover { background: var(--color-surface-2); }
.profile-dd__item.active { color: var(--color-coral); font-weight: 600; }
</style>
