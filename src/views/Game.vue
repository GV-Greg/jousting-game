<script setup>
import { ref, computed } from 'vue';
import { useGameStore } from '@/stores/gameStore';
import Tiltyard from '@/components/Tiltyard.vue';
import Interface from '@/components/Interface.vue';

const gameStore = useGameStore();

// État du jeu
const isPlaying = ref(false);
const winner = ref(null);

// Positions et états des chevaliers
const player1Position = ref(5);  // Bien à gauche
const player2Position = ref(90); // Bien à droite
const player1State = ref('gallop');
const player2State = ref('gallop');

// Vitesse initiale des chevaliers
const player1Speed = ref(0.5);
const player2Speed = ref(0.5);
const isPlayer1Stopped = ref(false);
const isPlayer2Stopped = ref(false);

// Déplacer les chevaliers
const moveKnights = () => {
  if (!isPlaying.value || winner.value) return;

  // Déplacement progressif
  if (!isPlayer1Stopped.value) player1Position.value += player1Speed.value;
  if (!isPlayer2Stopped.value) player2Position.value -= player2Speed.value;

  // Vérifier la collision
  if (player1Position.value + 5 >= player2Position.value && !winner.value) {
    setTimeout(() => {
      const winnerKnight = Math.random() > 0.5 ? 'red' : 'blue';

      if (winnerKnight === 'red') {
        winner.value = 'Chevalier Rouge';
        isPlayer2Stopped.value = true;
        player1State.value = 'gallop'; // Continuer jusqu'à la fin
      } else {
        winner.value = 'Chevalier Bleu';
        isPlayer1Stopped.value = true;
        player2State.value = 'gallop'; // Continuer jusqu'à la fin
      }
    }, 200);
  }

  // Vérifier si un chevalier a traversé sans être touché
  if (player1Position.value >= 100) {
    winner.value = 'Chevalier Rouge';
    isPlaying.value = false;
  }
  if (player2Position.value <= 0) {
    winner.value = 'Chevalier Bleu';
    isPlaying.value = false;
  }

  if (!winner.value) {
    requestAnimationFrame(moveKnights);
  }
};

// Démarrer la joute
const startJoust = () => {
  isPlaying.value = true;
  winner.value = null;
  isPlayer1Stopped.value = false;
  isPlayer2Stopped.value = false;
  player1Position.value = 5;
  player2Position.value = 95;
  player1Speed.value = 0.5;
  player2Speed.value = 0.5;
  moveKnights();
};

// Réinitialiser
const resetGame = () => {
  isPlaying.value = false;
  winner.value = null;
  isPlayer1Stopped.value = false;
  isPlayer2Stopped.value = false;
  player1Position.value = 5;
  player2Position.value = 95;
  player1Speed.value = 0.5;
  player2Speed.value = 0.5;
};
</script>

<template>
  <div class="game-container">
    <h1>Joute Médiévale</h1>

    <button @click="startJoust" v-if="!isPlaying">Démarrer la joute</button>
    <button @click="resetGame" v-if="isPlaying">Réinitialiser</button>

    <p v-if="winner" class="winner-text">🏆 {{ winner }} a gagné ! 🏆</p>

    <Tiltyard
      :player1Position="player1Position"
      :player2Position="player2Position"
      :player1State="player1State"
      :player2State="player2State"
    />

    <Interface :player1="{ score: 0, stamina: 100 }" :player2="{ score: 0, stamina: 100 }" />

  </div>
</template>

<style scoped>
.game-container {
  text-align: center;
}

.winner-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: gold;
  margin-top: 10px;
}
</style>
