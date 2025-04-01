<script setup>
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
  import { useRouter } from 'vue-router';
  import { useGameStore } from '@/stores/gameStore';
  import { useSettingsStore } from '@/stores/settingsStore';
  // import Tiltyard from '@/components/Tiltyard.vue';
  // import Interface from '@/components/Interface.vue';
  import Button from '@/components/Button.vue';
  import Icon from '@/components/Icon.vue';


  const router = useRouter();
  const gameStore = useGameStore();
  const settingsStore = useSettingsStore();

  // État du jeu
  const isPlaying = ref(false);
  const winner = ref(null);
  const gameEnded = ref(false);
  const countdown = ref(3);
  const roundNumber = ref(1);
  const showResults = ref(false);

  // Positions et états des chevaliers
  const player1Position = ref(10);
  const player2Position = ref(90);
  const player1State = ref('standing');
  const player2State = ref('standing');

  // Vitesse et états des joueurs
  const player1Speed = ref(0.5);
  const player2Speed = ref(0.5);

  // Animation et contrôle
  let animationFrameId = null;

  // Démarrer le compte à rebours avant la joute
  const startCountdown = () => {
    countdown.value = 3;
    const countInterval = setInterval(() => {
      countdown.value--;

      // Jouer un son pour chaque seconde du compte à rebours
      playSoundEffect('countdown');

      if (countdown.value <= 0) {
        clearInterval(countInterval);
        startJoust();
      }
    }, 1000);
  };

  // Fonction pour jouer un effet sonore
  const playSoundEffect = (soundName) => {
    if (settingsStore.soundEnabled) {
      // Cette fonction est simulée car les sons ne sont pas encore implémentés
      console.log(`Son joué: ${soundName}`);
    }
  };

  // Déplacer les chevaliers
  const moveKnights = () => {
    if (!isPlaying.value || gameEnded.value) {
      cancelAnimationFrame(animationFrameId);
      return;
    }

    // Déplacement progressif
    player1Position.value += player1Speed.value;
    player2Position.value -= player2Speed.value;

    // Vérifier la collision
    if (player1Position.value + 5 >= player2Position.value) {
      handleCollision();
      return;
    }

    // Vérifier si un chevalier a traversé tout le terrain
    if (player1Position.value >= 95) {
      declareWinner('player1');
      return;
    }
    if (player2Position.value <= 5) {
      declareWinner('player2');
      return;
    }

    // Continuer l'animation
    animationFrameId = requestAnimationFrame(moveKnights);
  };

  // Gérer une collision entre les chevaliers
  const handleCollision = () => {
    // Arrêter l'animation
    cancelAnimationFrame(animationFrameId);

    // Jouer un son de collision
    playSoundEffect('collision');

    // Animation de collision
    player1State.value = 'attack';
    player2State.value = 'attack';

    // Déterminer le vainqueur (simulation simple)
    setTimeout(() => {
      const randomWinner = Math.random() > 0.5 ? 'player1' : 'player2';
      declareWinner(randomWinner);
    }, 500);
  };

  // Déclarer un vainqueur
  const declareWinner = (player) => {
    isPlaying.value = false;
    gameEnded.value = true;

    // Mettre à jour le score dans le store
    if (player === 'player1') {
      gameStore.player1.score++;
      winner.value = 'Joueur 1';
      player2State.value = 'death';
      playSoundEffect('victory_player1');
    } else {
      gameStore.player2.score++;
      winner.value = 'Joueur 2';
      player1State.value = 'death';
      playSoundEffect('victory_player2');
    }

    // Afficher les résultats
    showResults.value = true;

    // Vérifier si un joueur a gagné la partie
    if (gameStore.player1.score >= 3) {
      // Le joueur 1 a gagné la partie
      setTimeout(() => {
        router.push('/');
      }, 5000);
    } else if (gameStore.player2.score >= 3) {
      // Le joueur 2 a gagné la partie
      setTimeout(() => {
        router.push('/');
      }, 5000);
    }
  };

  // Démarrer la joute
  const startJoust = () => {
    isPlaying.value = true;
    gameEnded.value = false;
    showResults.value = false;
    winner.value = null;

    // Réinitialiser les positions
    player1Position.value = 10;
    player2Position.value = 90;

    // Mettre les chevaliers en mouvement
    player1State.value = 'gallop';
    player2State.value = 'gallop';

    // Jouer un son de démarrage
    playSoundEffect('joust_start');

    // Démarrer l'animation
    animationFrameId = requestAnimationFrame(moveKnights);
  };

  // Passer au round suivant
  const nextRound = () => {
    roundNumber.value++;
    showResults.value = false;
    player1State.value = 'standing';
    player2State.value = 'standing';
    startCountdown();
  };

  // Quitter la partie
  const quitGame = () => {
    playSoundEffect('button_click');
    router.push('/');
  };

  // Initialiser le jeu au chargement
  onMounted(() => {
    // Jouer une musique d'ambiance
    playSoundEffect('game_ambient');

    // Vérifier si les joueurs ont sélectionné leurs chevaliers
    if (!gameStore.player1.knight || (gameStore.gameMode === 'twoPlayers' && !gameStore.player2.knight)) {
      router.push('/select');
      return;
    }

    // Démarrer le compte à rebours
    startCountdown();
  });

  // Nettoyer l'animation lors de la destruction du composant
  onBeforeUnmount(() => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  });
</script>

<template>
<div class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
    <!-- En-tête du jeu -->
    <div class="w-full max-w-4xl mb-4 flex justify-between items-center text-white">
      <div class="flex items-center">
        <div class="bg-red-900 p-2 rounded-lg mr-4">
          <span class="font-medieval">Joueur 1: {{ gameStore.player1.score }}</span>
        </div>
        <div class="h-3 w-24 bg-gray-700 rounded-full overflow-hidden">
          <div class="h-full bg-red-600" :style="{ width: `${gameStore.player1.stamina}%` }"></div>
        </div>
      </div>

      <div class="text-center">
        <h2 class="font-medieval text-xl text-yellow-400">Round {{ roundNumber }}</h2>
      </div>

      <div class="flex items-center">
        <div class="h-3 w-24 bg-gray-700 rounded-full overflow-hidden">
          <div class="h-full bg-blue-600" :style="{ width: `${gameStore.player2.stamina}%` }"></div>
        </div>
        <div class="bg-blue-900 p-2 rounded-lg ml-4">
          <span class="font-medieval">Joueur 2: {{ gameStore.player2.score }}</span>
        </div>
      </div>
    </div>

    <!-- Terrain de joute -->
    <div class="w-full max-w-4xl relative">
      <!-- Compte à rebours -->
      <div v-if="countdown > 0 && !isPlaying && !gameEnded"
           class="absolute inset-0 flex items-center justify-center z-10">
        <div class="text-8xl font-medieval text-yellow-400 animate-pulse">{{ countdown }}</div>
      </div>

      <!-- Message du vainqueur -->
      <div v-if="showResults" class="absolute inset-0 flex items-center justify-center z-10">
        <div class="bg-black/80 p-6 rounded-lg text-center">
          <h3 class="text-3xl font-medieval text-yellow-400 mb-4">{{ winner }} remporte la joute!</h3>
          <div class="flex justify-center space-x-4">
            <Button v-if="gameStore.player1.score < 3 && gameStore.player2.score < 3" @click="nextRound" text="Round suivant" color="gold" icon="gi-swordman" />
            <Button @click="quitGame" text="Quitter" color="red" icon="bi-arrow-left" />
          </div>
        </div>
      </div>

      <Tiltyard :player1Position="player1Position" :player2Position="player2Position" :player1State="player1State" :player2State="player2State" />
    </div>

    <!-- Contrôles du jeu -->
    <div class="w-full max-w-4xl mt-4 flex justify-center">
      <Button v-if="!isPlaying && !gameEnded && countdown === 0" @click="startJoust" text="Démarrer la joute" color="gold" icon="gi-swordman" />
      <Button v-if="!isPlaying && !gameEnded && !showResults" @click="quitGame" text="Abandonner" color="red" icon="bi-arrow-left" />
    </div>
  </div>
</template>

<style scoped>
  /* Animation de pulsation pour le compte à rebours */
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.8; }
  }

  .animate-pulse {
    animation: pulse 1s ease-in-out infinite;
  }
</style>
