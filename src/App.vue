<template>
  <BotanicalBackground />
  <RouterView v-slot="{ Component }">
    <Transition name="fade-slide" mode="out-in">
      <component :is="Component" :key="$route.path" />
    </Transition>
  </RouterView>
</template>

<script setup>
import BotanicalBackground from './components/BotanicalBackground.vue'
</script>
