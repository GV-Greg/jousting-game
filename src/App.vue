<script setup>
  // Composant racine de l'application
  import { onMounted, provide } from 'vue'

  // Fournir des paramètres globaux si nécessaire
  provide('gameVersion', '0.0.1')
  provide('gameMode', 'development')

  // Actions d'initialisation au chargement de l'application
  onMounted(() => {
    console.log('Application de joute médiévale chargée')

    // Préchargement des ressources ou autres initialisations globales peuvent être ajoutés ici
  })
</script>

<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <transition name="page-transition" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style scoped>
  /* Styles spécifiques au composant App.vue */
  /* Les styles de base sont déjà importés via main.js -> main.css -> base.css */

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
