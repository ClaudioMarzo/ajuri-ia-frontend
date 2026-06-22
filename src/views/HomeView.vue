<template>
  <div class="min-h-screen relative z-10 py-10 px-4">

    <!-- Hero -->
    <header class="text-center mb-12">
      <h1 class="text-5xl sm:text-6xl mb-4 tracking-tight"
          style="font-family:'Playfair Display',serif; color:#F4E9D8; text-shadow: 0 0 40px rgba(224,123,57,0.3);">
        AjuriIA
      </h1>
      <p class="text-sm sm:text-base max-w-xs sm:max-w-sm mx-auto leading-relaxed"
         style="color: rgba(248,244,239,0.6);">
        Inteligência artificial para a realidade amazônica. Escolha seu perfil.
      </p>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-20" style="color:rgba(248,244,239,0.4);">
      Carregando...
    </div>

    <!-- Erro -->
    <div v-else-if="error" class="text-center py-20 text-guarana text-sm">
      {{ error }}
    </div>

    <!-- Grid de perfis -->
    <div v-else
         class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
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
