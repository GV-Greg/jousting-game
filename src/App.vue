<script setup>
  // Composant racine de l'application
  import { onMounted, provide } from 'vue'

  // Fournir des paramètres globaux si nécessaire
  provide('gameVersion', '0.0.1')
  provide('gameMode', 'development')

  // Actions d'initialisation au chargement de l'application
  onMounted(() => {
    console.log('App chargée')

    // Préchargement des ressources ou autres initialisations globales peuvent être ajoutés ici
  })
</script>

<template>
  <div id="app" class="relative min-h-screen">
    <router-view v-slot="{ Component }">
      <transition name="page-transition" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <!-- Signature/crédit -->
    <div class="absolute bottom-4 left-0 right-0 text-center text-white text-opacity-60 text-sm z-10">
      <p>CreaCube © 2025 - jeu de Joute Médiévale</p>
    </div>
  </div>
</template>

<style scoped>
  /* Animation pour les transitions entre les pages */
  .page-transition-enter-active,
  .page-transition-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  .page-transition-enter-from {
    opacity: 0;
    transform: translateY(20px);
  }

  .page-transition-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }
</style>
