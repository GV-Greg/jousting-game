
<script setup>
  import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue';
  import { useRouter } from 'vue-router';
  import { useGameStore } from '@/stores/gameStore';
  import { useSettingsStore } from '@/stores/settingsStore';
  import Button from '@/components/Button.vue';
  import Jouster from '@/components/Jouster.vue';

  const router = useRouter();
  const gameStore = useGameStore();
  const settingsStore = useSettingsStore();

  // État du jeu
  const isPlaying = ref(false);
  const showResults = ref(false);
  const gameEnded = ref(false);
  const matchEnded = ref(false);
  const countdown = ref(3);
  const currentRound = ref(1);

  // Scores des joueurs
  const scores = reactive({
    player1: 0,
    player2: 0
  });

  // Points du round actuel
  const roundPoints = reactive({
    player1: 0,
    player2: 0
  });

  // État des joueurs
  const player1 = reactive({
    position: 10,          // Position depuis la gauche en %
    state: 'standing',     // État d'animation
    speed: 0.6,            // Vitesse initiale
    stamina: 100,          // Endurance
    hasHit: false,         // A touché l'adversaire
    isUnhorsed: false,     // Est tombé du cheval
    passedOpponent: false  // A dépassé l'adversaire
  });

  const player2 = reactive({
    position: 10,          // Position depuis la droite en %
    state: 'standing',     // État d'animation
    speed: 0.6,            // Vitesse initiale
    stamina: 100,          // Endurance
    hasHit: false,         // A touché l'adversaire
    isUnhorsed: false,     // Est tombé du cheval
    passedOpponent: false  // A dépassé l'adversaire
  });

  // État de la joute
  const joustState = reactive({
    collisionOccurred: false,
    collisionPosition: 0,
    roundCompleted: false
  });

  // Message de résultat du round
  const roundResultMessage = computed(() => {
    if (player1.isUnhorsed && player2.isUnhorsed) {
      return "Les deux jouteurs sont tombés ! Match nul !";
    } else if (player1.isUnhorsed) {
      return "Joueur 2 a désarçonné son adversaire !";
    } else if (player2.isUnhorsed) {
      return "Joueur 1 a désarçonné son adversaire !";
    } else if (player1.hasHit && !player2.hasHit) {
      return "Joueur 1 touche son adversaire !";
    } else if (!player1.hasHit && player2.hasHit) {
      return "Joueur 2 touche son adversaire !";
    } else if (player1.hasHit && player2.hasHit) {
      return "Les deux jouteurs se touchent !";
    } else {
      return "Aucun jouteur n'a touché son adversaire !";
    }
  });

  // Animation et contrôle
  let animationFrameId = null;
  let lastTimestamp = 0;
  const FPS = 60;
  const frameInterval = 1000 / FPS;

  // Coefficient de décélération
  const deceleration = 0.02;
  const minSpeed = 0.1;
  const fieldWidth = 80; // Largeur utile du terrain en %

  // Sons
  const playSoundEffect = (soundName) => {
    if (settingsStore.soundEnabled) {
      console.log(`Son joué: ${soundName}`);
      // Dans une implémentation réelle:
      // const sound = new Audio(`/src/assets/sounds/${soundName}.mp3`);
      // sound.play();
    }
  };

  // Démarrer le compte à rebours
  const startCountdown = () => {
    countdown.value = 3;
    const countInterval = setInterval(() => {
      countdown.value--;
      playSoundEffect('countdown');

      if (countdown.value <= 0) {
        clearInterval(countInterval);
        startJoust();
      }
    }, 1000);
  };

  // Démarrer la joute
  const startJoust = () => {
    // Réinitialiser l'état du jeu
    isPlaying.value = true;
    showResults.value = false;

    // Réinitialiser l'état des joueurs
    resetPlayerStates();

    // Réinitialiser l'état de la joute
    joustState.collisionOccurred = false;
    joustState.collisionPosition = 0;
    joustState.roundCompleted = false;

    // Réinitialiser les points du round
    roundPoints.player1 = 0;
    roundPoints.player2 = 0;

    // Commencer le mouvement
    player1.state = 'gallop';
    player2.state = 'gallop';

    playSoundEffect('joust_start');

    // Démarrer l'animation
    lastTimestamp = performance.now();
    animationFrameId = requestAnimationFrame(gameLoop);
  };

  // Réinitialiser l'état des joueurs
  const resetPlayerStates = () => {
    // Joueur 1
    player1.position = 10;
    player1.state = 'standing';
    player1.speed = 0.6;
    player1.stamina = 100;
    player1.hasHit = false;
    player1.isUnhorsed = false;
    player1.passedOpponent = false;

    // Joueur 2
    player2.position = 10;
    player2.state = 'standing';
    player2.speed = 0.6;
    player2.stamina = 100;
    player2.hasHit = false;
    player2.isUnhorsed = false;
    player2.passedOpponent = false;
  };

  // Animation principale
  const gameLoop = (timestamp) => {
    if (!isPlaying.value || joustState.roundCompleted) {
      return;
    }

    const elapsed = timestamp - lastTimestamp;

    if (elapsed > frameInterval) {
      lastTimestamp = timestamp - (elapsed % frameInterval);

      updatePositions();
      checkCollision();
      checkRoundEnd();
    }

    if (isPlaying.value && !joustState.roundCompleted) {
      animationFrameId = requestAnimationFrame(gameLoop);
    }
  };

  // Mettre à jour les positions des joueurs
  const updatePositions = () => {
    // Ne pas déplacer les joueurs désarçonnés
    if (!player1.isUnhorsed) {
      player1.position += player1.speed;

      // Réduire progressivement la vitesse après une collision
      if (joustState.collisionOccurred) {
        player1.speed = Math.max(minSpeed, player1.speed - deceleration);
      }
    }

    if (!player2.isUnhorsed) {
      player2.position += player2.speed;

      // Réduire progressivement la vitesse après une collision
      if (joustState.collisionOccurred) {
        player2.speed = Math.max(minSpeed, player2.speed - deceleration);
      }
    }

    // Réduire l'endurance pendant le galop
    if (player1.state === 'gallop') {
      player1.stamina = Math.max(0, player1.stamina - 0.1);
    }

    if (player2.state === 'gallop') {
      player2.stamina = Math.max(0, player2.stamina - 0.1);
    }
  };

  // Vérifier s'il y a une collision
  const checkCollision = () => {
    if (joustState.collisionOccurred) return;

    // Calculer les positions relatives des joueurs sur le terrain
    const player1RightEdge = player1.position + 8; // Ajuster selon la taille du sprite
    const player2LeftEdge = 100 - player2.position - 8;

    // Vérifier si les joueurs se croisent
    if (player1RightEdge >= player2LeftEdge) {
      handleCollision();
    }
  };

  // Gérer une collision
  const handleCollision = () => {
    joustState.collisionOccurred = true;
    joustState.collisionPosition = (player1.position + (100 - player2.position)) / 2;

    playSoundEffect('collision');

    // Animation d'attaque
    player1.state = 'attack';
    player2.state = 'attack';

    // Déterminer le résultat de la collision
    determineCollisionOutcome();
  };

  // Déterminer le résultat de la collision
  const determineCollisionOutcome = () => {
    // Facteurs influençant l'issue: stats du chevalier, vitesse, angle, etc.
    const player1Strength = gameStore.player1.knight?.stats?.strength || 7;
    const player2Strength = gameStore.player2.knight?.stats?.strength || 7;

    // Calcul prenant en compte la force, la vitesse et un facteur aléatoire significatif
    const player1Roll = player1Strength + player1.speed * 3 + Math.random() * 10;
    const player2Roll = player2Strength + player2.speed * 3 + Math.random() * 10;

    // Rendre les touches moins fréquentes en augmentant le seuil
    const hitThreshold = 12;  // Valeur plus élevée = touches moins fréquentes

    // Seuil pour déterminer si un joueur est désarçonné (plus élevé)
    const unhorsedThreshold = 5;

    console.log("Joueur 1 roll:", player1Roll, "- Seuil:", hitThreshold);
    console.log("Joueur 2 roll:", player2Roll, "- Seuil:", hitThreshold);

    // Déterminer si les joueurs se touchent - moins probable maintenant
    player1.hasHit = player1Roll > hitThreshold;
    player2.hasHit = player2Roll > hitThreshold;

    // Introduire une variation pour limiter les situations où les deux touchent
    if (player1.hasHit && player2.hasHit) {
      // Introduire une compétition directe - un seul peut toucher efficacement
      if (Math.abs(player1Roll - player2Roll) < 2) {
        // Très proche, les deux peuvent toucher
      } else if (player1Roll > player2Roll) {
        // Joueur 1 plus efficace, joueur 2 a moins de chance de toucher
        player2.hasHit = Math.random() > 0.7;
      } else {
        // Joueur 2 plus efficace, joueur 1 a moins de chance de toucher
        player1.hasHit = Math.random() > 0.7;
      }
    }

    // Déterminer si un joueur est désarçonné
    if (player1.hasHit && player1Roll > player2Roll + unhorsedThreshold) {
      player2.isUnhorsed = true;
      setTimeout(() => {
        player2.state = 'death';
        player2.speed = 0;
      }, 500);
    }

    if (player2.hasHit && player2Roll > player1Roll + unhorsedThreshold) {
      player1.isUnhorsed = true;
      setTimeout(() => {
        player1.state = 'death';
        player1.speed = 0;
      }, 500);
    }

    // Si aucun joueur n'est désarçonné, ils continuent leur course
    if (!player1.isUnhorsed && !player2.isUnhorsed) {
      setTimeout(() => {
        player1.state = 'gallop';
        player2.state = 'gallop';

        // Réduire la vitesse après l'impact
        player1.speed *= 0.7;
        player2.speed *= 0.7;
      }, 500);
    }

    // Calculer les points pour ce round
    calculateRoundPoints();
  };

  // Calculer les points du round
  const calculateRoundPoints = () => {
    // Réinitialiser les points
    roundPoints.player1 = 0;
    roundPoints.player2 = 0;

    // Points pour avoir touché l'adversaire
    if (player1.hasHit) roundPoints.player1 += 1;
    if (player2.hasHit) roundPoints.player2 += 1;

    // Points supplémentaires pour avoir désarçonné l'adversaire
    if (player1.hasHit && player2.isUnhorsed) roundPoints.player1 += 2;
    if (player2.hasHit && player1.isUnhorsed) roundPoints.player2 += 2;
  };

  // Mettre à jour les scores globaux à la fin du round
  const updateScores = () => {
    // Si un joueur désarçonne l'autre, il gagne directement la manche
    if (player1.hasHit && player2.isUnhorsed) {
      scores.player1 += 1;
      return;
    }

    if (player2.hasHit && player1.isUnhorsed) {
      scores.player2 += 1;
      return;
    }

    // Si les deux joueurs sont désarçonnés, match nul
    if (player1.isUnhorsed && player2.isUnhorsed) {
      // Aucun point attribué
      return;
    }

    // Si aucun n'est désarçonné, on attribue les points selon les touches
    scores.player1 += roundPoints.player1;
    scores.player2 += roundPoints.player2;
  };

  // Message du vainqueur du match
  const matchWinnerMessage = computed(() => {
    if (scores.player1 > scores.player2) {
      return 'Joueur 1 remporte la joute !';
    } else if (scores.player2 > scores.player1) {
      return 'Joueur 2 remporte la joute !';
    } else {
      return 'Égalité parfaite ! Les deux jouteurs sont à la hauteur !';
    }
  });

  // Vérifier si le round est terminé
  const checkRoundEnd = () => {
    // Le round est terminé si:
    // 1. Les deux joueurs sont tombés
    // 2. Un joueur est tombé et l'autre a atteint l'extrémité
    // 3. Les deux joueurs ont atteint l'extrémité opposée

    const player1ReachedEnd = player1.position >= 90;
    const player2ReachedEnd = player2.position >= 90;

    if (player1ReachedEnd && !player1.passedOpponent) {
      player1.passedOpponent = true;
      player1.state = 'standing';
    }

    if (player2ReachedEnd && !player2.passedOpponent) {
      player2.passedOpponent = true;
      player2.state = 'standing';
    }

    // Vérifier les conditions de fin
    if ((player1.isUnhorsed && player2.isUnhorsed) ||
        (player1.isUnhorsed && player2ReachedEnd) ||
        (player2.isUnhorsed && player1ReachedEnd) ||
        (player1ReachedEnd && player2ReachedEnd)) {

      // Attendre un peu avant d'afficher les résultats
      setTimeout(() => {
        endRound();
      }, 1000);

      joustState.roundCompleted = true;
    }
  };

  // Gérer la fin d'un cycle d'animation pour le joueur 1
  const onPlayer1AnimationCompleted = (state) => {
    // Transition après l'animation d'attaque
    if (state === 'attack' && !player1.isUnhorsed && !joustState.roundCompleted) {
      player1.state = 'gallop';
    }
  };

  // Gérer la fin d'un cycle d'animation pour le joueur 2
  const onPlayer2AnimationCompleted = (state) => {
    // Transition après l'animation d'attaque
    if (state === 'attack' && !player2.isUnhorsed && !joustState.roundCompleted) {
      player2.state = 'gallop';
    }
  };

  // Terminer le round
  const endRound = () => {
    isPlaying.value = false;

    // Calculer et attribuer les points
    calculateRoundPoints();
    updateScores();

    showResults.value = true;

    // Vérifier si le match est terminé (un joueur a 3 points ou plus)
    if (scores.player1 >= 3 || scores.player2 >= 3) {
      matchEnded.value = true;
      gameEnded.value = true;
    }

    // Mise à jour du score dans le store global
    gameStore.player1.score = scores.player1;
    gameStore.player2.score = scores.player2;

    // Jouer un son approprié
    if (player1.isUnhorsed) {
      playSoundEffect('player1_defeated');
    } else if (player2.isUnhorsed) {
      playSoundEffect('player2_defeated');
    } else {
      playSoundEffect('round_end');
    }
  };

  // Réinitialiser le jeu pour un nouveau match
  const resetGame = () => {
    currentRound.value = 1;
    scores.player1 = 0;
    scores.player2 = 0;
    resetPlayerStates();
    gameEnded.value = false;
    matchEnded.value = false;
    showResults.value = false;

    // Mise à jour du score dans le store global
    gameStore.player1.score = 0;
    gameStore.player2.score = 0;
  };

  // Passer au round suivant
  const nextRound = () => {
    currentRound.value++;
    showResults.value = false;
    startCountdown();
  };

  // Quitter la partie
  const quitGame = () => {
    playSoundEffect('button_click');
    router.push('/');
  };

  // Initialiser le jeu
  onMounted(() => {
    playSoundEffect('game_ambient');

    // Vérifier si les joueurs ont sélectionné leurs chevaliers
    if (!gameStore.player1.knight || (gameStore.gameMode === 'twoPlayers' && !gameStore.player2.knight)) {
      router.push('/select');
      return;
    }

    startCountdown();
  });

  // Nettoyer à la destruction
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
          <span class="font-medieval">Joueur 1: {{ scores.player1 }}</span>
        </div>
        <div class="h-3 w-24 bg-gray-700 rounded-full overflow-hidden">
          <div class="h-full bg-red-600" :style="{ width: `${player1.stamina}%` }"></div>
        </div>
      </div>

      <div class="text-center">
        <h2 class="font-medieval text-xl text-yellow-400">Manche {{ currentRound }}</h2>
      </div>

      <div class="flex items-center">
        <div class="h-3 w-24 bg-gray-700 rounded-full overflow-hidden">
          <div class="h-full bg-blue-600" :style="{ width: `${player2.stamina}%` }"></div>
        </div>
        <div class="bg-blue-900 p-2 rounded-lg ml-4">
          <span class="font-medieval">Joueur 2: {{ scores.player2 }}</span>
        </div>
      </div>
    </div>

    <!-- Terrain de joute -->
    <div class="w-full max-w-4xl h-64 bg-gradient-to-b from-green-900 to-green-800 relative rounded-lg overflow-hidden">
      <!-- Lice (barrière centrale) -->
      <div class="absolute left-1/2 top-0 h-full w-2 bg-brown-600 transform -translate-x-1/2 z-10"></div>

      <!-- Jouteurs -->
      <Jouster position="left" :positionValue="player1.position" :state="player1.state" movingDirection="right" @animationCompleted="onPlayer1AnimationCompleted" />
      <Jouster position="right" :positionValue="player2.position" :state="player2.state" movingDirection="left" @animationCompleted="onPlayer2AnimationCompleted" />

      <!-- Compte à rebours -->
      <div v-if="countdown > 0 && !isPlaying && !gameEnded"
           class="absolute inset-0 flex items-center justify-center z-30">
        <div class="text-8xl font-medieval text-yellow-400 animate-pulse">{{ countdown }}</div>
      </div>
    </div>

    <!-- Contrôles du jeu -->
    <div class="w-full max-w-4xl mt-4 flex justify-center">
      <Button v-if="!isPlaying && !gameEnded && countdown === 0 && !showResults" @click="startJoust" text="Démarrer la joute" color="gold" icon="gi-swordman" />
      <Button v-if="!isPlaying && !gameEnded && !showResults" @click="quitGame" text="Abandonner" color="red" icon="bi-arrow-left" />
    </div>

    <!-- Overlay des résultats - Maintenant sur toute la page avec z-index supérieur -->
    <div v-if="showResults" class="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
      <div class="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-lg text-center border-2 border-amber-700 max-w-md w-full shadow-xl">
        <h3 class="text-3xl font-medieval text-amber-400 mb-4">{{ roundResultMessage }}</h3>

        <div class="mb-4 grid grid-cols-2 gap-4 text-white">
          <div class="bg-red-900/50 p-2 rounded">
            <div class="font-medieval">Joueur 1</div>
            <div class="text-xl">{{ roundPoints.player1 }} point(s)</div>
            <div class="mt-2 text-amber-400">Total: {{ scores.player1 }}/3</div>
          </div>
          <div class="bg-blue-900/50 p-2 rounded">
            <div class="font-medieval">Joueur 2</div>
            <div class="text-xl">{{ roundPoints.player2 }} point(s)</div>
            <div class="mt-2 text-amber-400">Total: {{ scores.player2 }}/3</div>
          </div>
        </div>

        <div v-if="matchEnded" class="my-4 text-xl text-yellow-300 font-medieval">
          {{ matchWinnerMessage }}
        </div>

        <div class="flex justify-center space-x-4 mt-6">
          <Button v-if="!matchEnded" @click="nextRound" text="Manche suivante" color="gold" icon="gi-swordman" />
          <Button v-if="matchEnded" @click="resetGame" text="Nouvelle joute" color="gold" icon="gi-swordman" />
          <Button  @click="quitGame" text="Quitter" color="red" icon="bi-arrow-left" />
        </div>
      </div>
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
