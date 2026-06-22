<template>
  <div class="min-h-screen flex flex-col items-center px-4">

    <!-- Top bar -->
    <div class="w-full max-w-5xl flex items-center justify-end pt-4">
      <ThemeToggle />
    </div>

    <!-- Conteúdo centralizado verticalmente -->
    <div class="flex-1 w-full flex flex-col justify-center items-center pb-10">

      <!-- Hero -->
      <header class="w-full max-w-5xl text-center pt-8 pb-14 sm:pb-20">
        <h1
          class="text-gradient mb-5 tracking-tight leading-none"
          style="font-family:'Playfair Display',serif; font-size:clamp(3rem,9vw,5.5rem);"
        >
          AjuriIA
        </h1>
        <p class="text-base sm:text-lg max-w-md mx-auto leading-relaxed" style="color:var(--color-ink);">
          Inteligência artificial para a realidade amazônica.
        </p>
        <p class="text-sm mt-2" style="color:var(--color-ink-soft);">
          Escolha seu perfil para começar.
        </p>
      </header>

      <!-- Loading -->
      <div
        v-if="loading"
        role="status"
        aria-live="polite"
        class="flex items-center gap-3 py-10 text-sm"
        style="color:var(--color-ink-soft);"
      >
        <span class="inline-block w-4 h-4 rounded-full border-2 animate-spin"
              style="border-color:var(--color-floresta); border-top-color:transparent;"></span>
        Carregando perfis...
      </div>

      <!-- Erro -->
      <div
        v-else-if="error"
        role="alert"
        class="py-10 text-sm font-medium"
        style="color:#B91C1C;"
      >
        {{ error }}
      </div>

      <!-- Grid de perfis -->
      <div
        v-else
        class="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch"
      >
        <ProfileCard
          v-for="(profile, i) in profiles"
          :key="profile.id"
          :profile="profile"
          :index="i"
          @select="goToChat"
        />
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ProfileCard from '../components/ProfileCard.vue'
import ThemeToggle from '../components/ThemeToggle.vue'
import { fetchProfiles } from '../services/api.js'

const router   = useRouter()
const profiles = ref([])
const loading  = ref(true)
const error    = ref(null)

onMounted(async () => {
  try {
    profiles.value = await fetchProfiles()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})

function goToChat(profile) {
  router.push(`/chat/${profile.id}`)
}
</script>
