<template>
  <div class="tiltyard relative w-full h-96 bg-gray-800 rounded-lg overflow-hidden">
    <!-- Ligne médiane du champ de joute -->
    <div class="absolute inset-y-1/2 left-0 right-0 h-1 bg-white"></div>

    <!-- Joueur 1 -->
    <Jouster
      :position="'left'"
      :positionValue="player1Position"
      :state="player1State"
      :direction="'right'"
      class="absolute left-0"
    />

    <!-- Joueur 2 -->
    <Jouster
      :position="'right'"
      :positionValue="player2Position"
      :state="player2State"
      :direction="'left'"
      class="absolute left-0"
    />
  </div>
</template>

<script setup>
import Jouster from '@/components/Jouster.vue';

defineProps({
  player1Position: {
    type: Number,
    required: true,
  },
  player2Position: {
    type: Number,
    required: true,
  },
  player1State: {
    type: String,
    required: true,
  },
  player2State: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.tiltyard {
  background-image: url('@/assets/arena-bg.png');
  background-size: cover;
  background-position: center;
}
</style>
