<template>
  <div class="min-h-screen flex flex-col items-center px-4">

    <!-- Hero -->
    <header class="w-full max-w-5xl text-center pt-16 pb-10 sm:pt-24 sm:pb-14">
      <h1
        class="text-gradient mb-4 tracking-tight leading-none"
        style="font-family:'Playfair Display',serif; font-size:clamp(3rem,9vw,5.5rem);"
      >
        AjuriIA
      </h1>
      <p class="text-base sm:text-lg max-w-md mx-auto leading-relaxed" style="color:var(--color-ink);">
        Inteligência artificial para a realidade amazônica.
      </p>
      <p class="text-sm mt-1" style="color:var(--color-ink-soft);">
        Escolha seu perfil para começar.
      </p>
    </header>

    <!-- Loading -->
    <div
      v-if="loading"
      role="status"
      aria-live="polite"
      class="flex items-center gap-3 py-20 text-sm"
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
      class="py-20 text-sm font-medium"
      style="color:#B91C1C;"
    >
      {{ error }}
    </div>

    <!-- Grid de perfis -->
    <div
      v-else
      class="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-16"
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ProfileCard from '../components/ProfileCard.vue'
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
