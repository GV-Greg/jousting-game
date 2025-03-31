<script setup>
defineProps({
  player1: {
    type: Object,
    required: true,
  },
  player2: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="hud p-4 bg-black bg-opacity-50 text-white flex justify-between z-10">
    <div v-if="player1">
      <p>Joueur 1: {{ player1.score }}</p>
      <p>Endurance: {{ player1.stamina }}</p>
    </div>
    <div v-if="player2">
      <p>Joueur 2: {{ player2.score }}</p>
      <p>Endurance: {{ player2.stamina }}</p>
    </div>
  </div>
</template>

<style scoped>
.hud {
  z-index: 10;
  font-size: 1.2rem;
}
</style>
