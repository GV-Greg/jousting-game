<script setup>
  import Menu from '../components/Menu.vue';

  const backgroundUrl = new URL('@/assets/arena-bg.png', import.meta.url).href;
</script>

<template>
  <div class="menu min-h-screen flex flex-col items-center justify-center text-white bg-cover bg-center"
    :style="{ backgroundImage: `url(${backgroundUrl})` }">
    <h1 class="text-6xl font-bold mb-8">Jousting Game</h1>
    <p class="text-xl mb-16">Un jeu de joute médiéval immersif</p>

    <Menu />
  </div>
</template>

<style scoped>

</style>
