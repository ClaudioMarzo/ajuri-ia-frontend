<template>
  <div class="min-h-screen bg-verde-mata px-6 py-12">
    <header class="text-center mb-14">
      <h1 class="text-areia text-4xl mb-3" style="font-family: 'Playfair Display', serif">
        AjuriIA
      </h1>
      <p class="text-neblina text-base max-w-md mx-auto">
        Inteligência artificial para a realidade amazônica. Escolha seu perfil.
      </p>
    </header>

    <div v-if="loading" class="text-center text-neblina text-sm">
      Carregando perfis...
    </div>

    <div v-else-if="error" class="text-center text-guarana text-sm">
      {{ error }}
    </div>

    <div v-else class="grid grid-cols-2 gap-5 max-w-2xl mx-auto md:grid-cols-3">
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
