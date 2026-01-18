<script setup>
import { ref, onMounted, computed } from 'vue'
import Menu from '../components/Menu.vue'
import { useSettingsStore } from '@/stores/settingsStore'

// Référence au titre pour les animations
const titleRef = ref(null)
const bannerRef = ref(null)

// Source de l'image de fond
const backgroundUrl = new URL('@/assets/arena-bg.png', import.meta.url).href

// Animation du titre avec une animation simple
const animateTitle = () => {
  if (!titleRef.value) return

  // Animation simple avec transform
  titleRef.value.classList.add('animate-title')
}

// Chargement des paramètres et animations quand le composant est monté
onMounted(() => {
  animateTitle()
})

const settingsStore = useSettingsStore()

const difficultyLabel = computed(() => {
  const labels = {
    easy: 'Facile',
    medium: 'Normal',
    hard: 'Difficile',
  }
  return labels[settingsStore.defaultDifficulty] || 'Normal'
})
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center relative p-4 bg-cover bg-center"
    :style="{ backgroundImage: `url(${backgroundUrl})` }"
  >
    <!-- Overlay pour assombrir l'arrière-plan -->
    <div class="absolute inset-0 bg-black/75 z-0"></div>

    <!-- Bannière de titre -->
    <div ref="bannerRef" class="text-center z-10 mb-16">
      <h1
        ref="titleRef"
        class="text-5xl md:text-6xl text-yellow-400 font-bold mb-4 tracking-wider uppercase font-medieval"
      >
        <span class="letter inline-block">J</span>
        <span class="letter inline-block">O</span>
        <span class="letter inline-block">U</span>
        <span class="letter inline-block">S</span>
        <span class="letter inline-block">T</span>
        <span class="letter inline-block">I</span>
        <span class="letter inline-block">N</span>
        <span class="letter inline-block">G</span>
      </h1>
      <p class="text-xl text-white font-medieval">Un jeu de joute médiévale équestre</p>
    </div>

    <Menu />

    <div class="flex flex-col gap-4">
      <BaseButton
        @click="$router.push('/settings')"
        text="Paramètres"
        color="gray"
        icon="bi-gear"
      />
    </div>

    <!-- Afficher la difficulté actuelle -->
    <div class="mt-4 text-gray-400 text-sm">Difficulté: {{ difficultyLabel }}</div>
  </div>
</template>

<style scoped>
/* Animation du titre */
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-title .letter {
  animation: fadeInUp 0.5s ease forwards;
  opacity: 0;
}

.animate-title .letter:nth-child(1) {
  animation-delay: 0.1s;
}
.animate-title .letter:nth-child(2) {
  animation-delay: 0.2s;
}
.animate-title .letter:nth-child(3) {
  animation-delay: 0.3s;
}
.animate-title .letter:nth-child(4) {
  animation-delay: 0.4s;
}
.animate-title .letter:nth-child(5) {
  animation-delay: 0.5s;
}
.animate-title .letter:nth-child(6) {
  animation-delay: 0.6s;
}
.animate-title .letter:nth-child(7) {
  animation-delay: 0.7s;
}
.animate-title .letter:nth-child(8) {
  animation-delay: 0.8s;
}
</style>
