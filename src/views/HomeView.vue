<template>
  <div class="min-h-screen relative z-10 flex flex-col items-center px-4">

    <!-- Hero -->
    <header class="w-full max-w-5xl text-center pt-16 pb-10 sm:pt-24 sm:pb-14">
      <h1
        class="text-gradient mb-4 tracking-tight leading-none"
        style="font-family:'Playfair Display',serif; font-size:clamp(3.5rem,10vw,6rem);"
      >
        AjuriIA
      </h1>
      <p
        class="text-base sm:text-lg max-w-sm mx-auto leading-relaxed"
        style="color:rgba(244,233,216,0.65);"
      >
        Inteligência artificial para a realidade amazônica.
      </p>
      <p
        class="text-sm mt-1"
        style="color:rgba(244,233,216,0.4);"
      >
        Escolha seu perfil para começar.
      </p>

      <div class="mt-8 mx-auto max-w-xs" style="height:1px; background:linear-gradient(90deg,transparent,rgba(224,123,57,0.35),transparent);"></div>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="py-20" style="color:rgba(244,233,216,0.35);">
      <div class="flex items-center gap-3 text-sm">
        <span class="inline-block w-4 h-4 rounded-full border-2 border-guarana border-t-transparent animate-spin"></span>
        Carregando perfis...
      </div>
    </div>

    <!-- Erro -->
    <div v-else-if="error" class="py-20 text-sm" style="color:#fca5a5;">
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
