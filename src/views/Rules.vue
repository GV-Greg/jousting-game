<script setup>

</script>

<template>
  <div class="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
    <h1 class="text-4xl font-bold mb-8">Règles du Jeu</h1>
    <div class="bg-gray-800 p-8 rounded-lg max-w-2xl">
      <h2 class="text-2xl font-semibold mb-4">Comment jouer ?</h2>
      <ul class="list-disc list-inside space-y-2">
        <li>Choisis ton chevalier et ton destrier.</li>
        <li>Affronte ton adversaire dans une joute épique.</li>
        <li>Utilise les boutons "Attaquer" et "Défendre" pour gagner des points.</li>
        <li>Le premier à 3 points remporte la victoire !</li>
      </ul>
      <router-link to="/" class="mt-8 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg transition duration-300">
        Retour à l'accueil
      </router-link>
    </div>
  </div>
</template>

<style scoped>

</style>
