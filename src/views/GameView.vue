<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import { useSettingsStore } from '@/stores/settingsStore'
import {
  calculateHit,
  calculateUnhorse,
  calculateEnduranceLoss,
  calculateEnduranceRecovery,
  generateAITactics,
} from '@/engine/joustEngine'
import BaseButton from '@/components/BaseButton.vue'
import JousterSprite from '@/components/JousterSprite.vue'
import arenaBackground from '@/assets/arena-bg.png'

const router = useRouter()
const gameStore = useGameStore()
const settingsStore = useSettingsStore()

// État du jeu
const isPlaying = ref(false)
const showResults = ref(false)
const gameEnded = ref(false)
const matchEnded = ref(false)
const countdown = ref(3)
const currentRound = ref(1)

// Effets visuels
const showImpact = ref(false)
const impactType = ref('') // 'hit', 'unhorse', 'double_hit', 'miss'
const player1Hit = ref(false)
const player2Hit = ref(false)
const screenShake = ref(false)

// Scores des joueurs
const scores = reactive({
  player1: 0,
  player2: 0,
})

// Points du round actuel
const roundPoints = reactive({
  player1: 0,
  player2: 0,
})

// État des joueurs
const player1 = reactive({
  position: 10,
  state: 'standing',
  speed: 0.6,
  stamina: 100,
  hasHit: false,
  isUnhorsed: false,
  passedOpponent: false,
})

const player2 = reactive({
  position: 10,
  state: 'standing',
  speed: 0.6,
  stamina: 100,
  hasHit: false,
  isUnhorsed: false,
  passedOpponent: false,
})

// État de la joute
const joustState = reactive({
  collisionOccurred: false,
  collisionPosition: 0,
  roundCompleted: false,
  currentPass: 0,
  player1Side: 'left', // Alterne après chaque passe
})

// Résultat de la passe actuelle
const passResult = reactive({
  player1Hit: false,
  player2Hit: false,
  player1Unhorse: false,
  player2Unhorse: false,
})

// Message de résultat du round
const roundResultMessage = computed(() => {
  if (passResult.player1Unhorse && passResult.player2Unhorse) {
    return '💥 Double désarçonnement ! Égalité !'
  } else if (passResult.player1Unhorse) {
    return '🏆 Vous avez désarçonné votre adversaire !'
  } else if (passResult.player2Unhorse) {
    return '💀 Vous avez été désarçonné !'
  } else if (passResult.player1Hit && passResult.player2Hit) {
    return '⚔️ Double touche ! +1 point chacun'
  } else if (passResult.player1Hit) {
    return '✅ Vous avez touché ! +1 point'
  } else if (passResult.player2Hit) {
    return "❌ L'adversaire vous a touché !"
  } else {
    return "😶 Aucun jouteur n'a touché !"
  }
})

// Animation et contrôle
let animationFrameId = null
let lastTimestamp = 0
const FPS = 60
const frameInterval = 1000 / FPS
const deceleration = 0.02
const minSpeed = 0.1

// Sons - Créer les objets Audio
const sounds = {
  hit: null,
  unhorse: null,
  miss: null,
  collision: null,
  countdown: null,
  victory: null,
  defeat: null,
}

// Initialiser les sons
const initSounds = () => {
  if (typeof Audio !== 'undefined') {
    try {
      sounds.hit = new Audio('/sounds/hit.mp3')
      sounds.unhorse = new Audio('/sounds/unhorse.mp3')
      sounds.miss = new Audio('/sounds/miss.mp3')
      sounds.collision = new Audio('/sounds/collision.mp3')
      sounds.countdown = new Audio('/sounds/countdown.mp3')
      sounds.victory = new Audio('/sounds/victory.mp3')
      sounds.defeat = new Audio('/sounds/defeat.mp3')

      // Régler le volume et gérer les erreurs de chargement
      Object.entries(sounds).forEach(([key, sound]) => {
        if (sound) {
          sound.volume = 0.5
          sound.onerror = () => {
            console.warn(`Son non trouvé: ${key}`)
            sounds[key] = null
          }
        }
      })
    } catch (e) {
      console.warn('Impossible de charger les sons:', e)
    }
  }
}

// Jouer un son
const playSoundEffect = (soundName) => {
  if (settingsStore.soundEnabled && sounds[soundName]) {
    sounds[soundName].currentTime = 0
    sounds[soundName].play().catch(() => {
      // Ignorer les erreurs de lecture audio
      console.log(`Son: ${soundName}`)
    })
  } else {
    console.log(`Son joué: ${soundName}`)
  }
}

// Afficher l'effet d'impact
const showImpactEffect = (type) => {
  impactType.value = type
  showImpact.value = true

  // Effet de secousse pour les touches
  if (type === 'hit' || type === 'unhorse' || type === 'double_hit') {
    screenShake.value = true
    setTimeout(() => {
      screenShake.value = false
    }, 300)
  }

  // Masquer l'effet après un délai
  setTimeout(() => {
    showImpact.value = false
  }, 1000)
}

// Démarrer le compte à rebours
const startCountdown = () => {
  countdown.value = 3
  const countInterval = setInterval(() => {
    countdown.value--
    playSoundEffect('countdown')

    if (countdown.value <= 0) {
      clearInterval(countInterval)
      startJoust()
    }
  }, 1000)
}

// Démarrer la joute
const startJoust = () => {
  isPlaying.value = true
  showResults.value = false

  resetPlayerStates()

  // Générer les tactiques IA selon la difficulté
  const aiTactics = generateAITactics(
    settingsStore.defaultDifficulty,
    gameStore.player2,
    gameStore.player1,
  )
  gameStore.setPlayer2Tactics(aiTactics)

  joustState.collisionOccurred = false
  joustState.collisionPosition = 0
  joustState.roundCompleted = false

  roundPoints.player1 = 0
  roundPoints.player2 = 0

  // Reset du résultat de passe
  passResult.player1Hit = false
  passResult.player2Hit = false
  passResult.player1Unhorse = false
  passResult.player2Unhorse = false

  player1.state = 'gallop'
  player2.state = 'gallop'

  playSoundEffect('joust_start')

  lastTimestamp = performance.now()
  animationFrameId = requestAnimationFrame(gameLoop)
}

// Réinitialiser l'état des joueurs avec échange de côtés
const resetPlayerStates = () => {
  // Position selon le côté actuel
  if (joustState.player1Side === 'left') {
    player1.position = 10
    player2.position = 10
  } else {
    player1.position = 10
    player2.position = 10
  }

  player1.state = 'standing'
  player1.speed = 0.6
  player1.hasHit = false
  player1.isUnhorsed = false
  player1.passedOpponent = false

  player2.state = 'standing'
  player2.speed = 0.6
  player2.hasHit = false
  player2.isUnhorsed = false
  player2.passedOpponent = false
}

// Animation principale
const gameLoop = (timestamp) => {
  if (!isPlaying.value || joustState.roundCompleted) {
    return
  }

  const elapsed = timestamp - lastTimestamp

  if (elapsed > frameInterval) {
    lastTimestamp = timestamp - (elapsed % frameInterval)
    updatePositions()
    checkCollision()
    checkRoundEnd()
  }

  if (isPlaying.value && !joustState.roundCompleted) {
    animationFrameId = requestAnimationFrame(gameLoop)
  }
}

// Mettre à jour les positions des joueurs
const updatePositions = () => {
  if (!player1.isUnhorsed) {
    player1.position += player1.speed
    if (joustState.collisionOccurred) {
      player1.speed = Math.max(minSpeed, player1.speed - deceleration)
    }
  }

  if (!player2.isUnhorsed) {
    player2.position += player2.speed
    if (joustState.collisionOccurred) {
      player2.speed = Math.max(minSpeed, player2.speed - deceleration)
    }
  }
}

// Vérifier collision au centre (50%)
const checkCollision = () => {
  if (joustState.collisionOccurred) return

  // Calculer les positions réelles sur le terrain
  const player1RealPos =
    joustState.player1Side === 'left' ? player1.position : 100 - player1.position

  const player2RealPos =
    joustState.player1Side === 'left' ? 100 - player2.position : player2.position

  // Collision quand les deux joueurs atteignent le centre (environ 45-55%)
  if (player1RealPos >= 45 && player2RealPos <= 55) {
    handleCollision()
  }
}

// Gérer la collision avec le nouveau système
const handleCollision = () => {
  joustState.collisionOccurred = true

  player1.state = 'attack'
  player2.state = 'attack'

  // Utiliser le moteur de joute pour calculer le résultat
  const p1 = gameStore.player1
  const p2 = gameStore.player2
  const t1 = gameStore.player1Tactics
  const t2 = gameStore.player2Tactics

  // Calcul des touches
  passResult.player1Hit = calculateHit(p1, p2, t1, t2)
  passResult.player2Hit = calculateHit(p2, p1, t2, t1)

  // Calcul des désarçonnements (si touche)
  if (passResult.player1Hit) {
    passResult.player1Unhorse = calculateUnhorse(p1, p2, t1, t2)
  }
  if (passResult.player2Hit) {
    passResult.player2Unhorse = calculateUnhorse(p2, p1, t2, t1)
  }

  // Petit délai pour que l'animation d'attaque commence avant l'effet
  setTimeout(() => {
    // Effets visuels et sonores selon le résultat
    player1Hit.value = passResult.player2Hit
    player2Hit.value = passResult.player1Hit

    // Jouer le son de collision
    playSoundEffect('collision')

    // Déterminer le type d'impact pour les effets
    if (passResult.player1Unhorse || passResult.player2Unhorse) {
      showImpactEffect('unhorse')
      playSoundEffect('unhorse')
    } else if (passResult.player1Hit && passResult.player2Hit) {
      showImpactEffect('double_hit')
      playSoundEffect('hit')
    } else if (passResult.player1Hit || passResult.player2Hit) {
      showImpactEffect('hit')
      playSoundEffect('hit')
    } else {
      showImpactEffect('miss')
      playSoundEffect('miss')
    }

    // Réinitialiser les effets de touche après un délai
    setTimeout(() => {
      player1Hit.value = false
      player2Hit.value = false
    }, 500)
  }, 150) // Délai de 150ms pour synchroniser avec le croisement visuel

  // Appliquer les résultats visuels de désarçonnement
  if (passResult.player2Unhorse) {
    player2.isUnhorsed = true
    setTimeout(() => {
      player2.state = 'death'
      player2.speed = 0
    }, 500)
  }

  if (passResult.player1Unhorse) {
    player1.isUnhorsed = true
    setTimeout(() => {
      player1.state = 'death'
      player1.speed = 0
    }, 500)
  }

  // Réduire l'endurance
  const p1Loss = calculateEnduranceLoss(p1, t1)
  const p2Loss = calculateEnduranceLoss(p2, t2)
  gameStore.reduceEndurance(1, p1Loss)
  gameStore.reduceEndurance(2, p2Loss)

  // Continuer si pas de désarçonnement
  if (!player1.isUnhorsed && !player2.isUnhorsed) {
    setTimeout(() => {
      player1.state = 'gallop'
      player2.state = 'gallop'
      player1.speed *= 0.7
      player2.speed *= 0.7
    }, 500)
  }

  calculateRoundPoints()
}

// Calculer les points selon les nouvelles règles
const calculateRoundPoints = () => {
  roundPoints.player1 = 0
  roundPoints.player2 = 0

  // Double désarçonnement = 0 point
  if (passResult.player1Unhorse && passResult.player2Unhorse) {
    return
  }

  // Désarçonnement = victoire immédiate (géré dans endRound)
  if (passResult.player1Unhorse || passResult.player2Unhorse) {
    return
  }

  // Touches simples
  if (passResult.player1Hit) roundPoints.player1 = 1
  if (passResult.player2Hit) roundPoints.player2 = 1
}

// Mettre à jour les scores
const updateScores = () => {
  // Double désarçonnement = égalité, pas de points
  if (passResult.player1Unhorse && passResult.player2Unhorse) {
    matchEnded.value = true
    gameEnded.value = true
    return
  }

  // Désarçonnement = victoire immédiate
  if (passResult.player1Unhorse) {
    scores.player1 = 3 // Victoire immédiate
    matchEnded.value = true
    gameEnded.value = true
    return
  }

  if (passResult.player2Unhorse) {
    scores.player2 = 3
    matchEnded.value = true
    gameEnded.value = true
    return
  }

  // Sinon, ajouter les points des touches
  scores.player1 += roundPoints.player1
  scores.player2 += roundPoints.player2

  // Vérifier victoire à 3 points
  if (scores.player1 >= 3 || scores.player2 >= 3) {
    matchEnded.value = true
    gameEnded.value = true
  }
}

// Message du vainqueur du match
const matchWinnerMessage = computed(() => {
  if (passResult.player1Unhorse && passResult.player2Unhorse) {
    return '🤝 Double désarçonnement ! Égalité !'
  }
  if (scores.player1 > scores.player2) {
    return '🏆 Joueur 1 remporte la joute !'
  } else if (scores.player2 > scores.player1) {
    return '💀 Joueur 2 remporte la joute !'
  } else {
    return '🤝 Égalité !'
  }
})

// Vérifier si le round est terminé
const checkRoundEnd = () => {
  const player1ReachedEnd = player1.position >= 90
  const player2ReachedEnd = player2.position >= 90

  if (player1ReachedEnd && !player1.passedOpponent) {
    player1.passedOpponent = true
    player1.state = 'standing'
  }

  if (player2ReachedEnd && !player2.passedOpponent) {
    player2.passedOpponent = true
    player2.state = 'standing'
  }

  if (
    (player1.isUnhorsed && player2.isUnhorsed) ||
    (player1.isUnhorsed && player2ReachedEnd) ||
    (player2.isUnhorsed && player1ReachedEnd) ||
    (player1ReachedEnd && player2ReachedEnd)
  ) {
    setTimeout(() => {
      endRound()
    }, 1000)

    joustState.roundCompleted = true
  }
}

// Gérer la fin d'un cycle d'animation pour le joueur 1
const onPlayer1AnimationCompleted = (state) => {
  if (state === 'attack' && !player1.isUnhorsed && !joustState.roundCompleted) {
    player1.state = 'gallop'
  }
}

// Gérer la fin d'un cycle d'animation pour le joueur 2
const onPlayer2AnimationCompleted = (state) => {
  if (state === 'attack' && !player2.isUnhorsed && !joustState.roundCompleted) {
    player2.state = 'gallop'
  }
}

// Terminer le round
const endRound = () => {
  isPlaying.value = false

  calculateRoundPoints()
  updateScores()

  // Ajouter à l'historique
  gameStore.addPassToHistory({
    player1Hit: passResult.player1Hit,
    player2Hit: passResult.player2Hit,
    player1Unhorse: passResult.player1Unhorse,
    player2Unhorse: passResult.player2Unhorse,
  })

  showResults.value = true

  gameStore.player1.score = scores.player1
  gameStore.player2.score = scores.player2

  // Sons de fin de round
  if (player1.isUnhorsed && !player2.isUnhorsed) {
    playSoundEffect('defeat')
  } else if (player2.isUnhorsed && !player1.isUnhorsed) {
    playSoundEffect('victory')
  }
}

// Passer au round suivant avec échange de côtés
const nextRound = () => {
  currentRound.value++
  joustState.currentPass++

  // Échanger les côtés
  joustState.player1Side = joustState.player1Side === 'left' ? 'right' : 'left'

  // Reset complet des positions AVANT tout
  player1.position = 10
  player2.position = 10
  player1.state = 'standing'
  player2.state = 'standing'
  player1.speed = 0.6
  player2.speed = 0.6
  player1.hasHit = false
  player2.hasHit = false
  player1.isUnhorsed = false
  player2.isUnhorsed = false
  player1.passedOpponent = false
  player2.passedOpponent = false

  // Reset des résultats de passe
  passResult.player1Hit = false
  passResult.player2Hit = false
  passResult.player1Unhorse = false
  passResult.player2Unhorse = false

  // Reset de l'état de la joute
  joustState.collisionOccurred = false
  joustState.roundCompleted = false

  // Récupération d'endurance entre les passes
  const p1Recovery = calculateEnduranceRecovery(gameStore.player1)
  const p2Recovery = calculateEnduranceRecovery(gameStore.player2)
  gameStore.recoverEndurance(1, p1Recovery)
  gameStore.recoverEndurance(2, p2Recovery)

  showResults.value = false

  // Délai pour que Vue mette à jour le DOM avant le compte à rebours
  setTimeout(() => {
    startCountdown()
  }, 100)
}

// Réinitialiser le jeu pour un nouveau match
const resetGame = () => {
  currentRound.value = 1
  joustState.currentPass = 0
  joustState.player1Side = 'left'
  joustState.collisionOccurred = false
  joustState.roundCompleted = false

  scores.player1 = 0
  scores.player2 = 0

  roundPoints.player1 = 0
  roundPoints.player2 = 0

  passResult.player1Hit = false
  passResult.player2Hit = false
  passResult.player1Unhorse = false
  passResult.player2Unhorse = false

  player1.position = 10
  player2.position = 10
  player1.state = 'standing'
  player2.state = 'standing'
  player1.speed = 0.6
  player2.speed = 0.6
  player1.hasHit = false
  player2.hasHit = false
  player1.isUnhorsed = false
  player2.isUnhorsed = false
  player1.passedOpponent = false
  player2.passedOpponent = false

  gameEnded.value = false
  matchEnded.value = false
  showResults.value = false

  gameStore.player1.score = 0
  gameStore.player2.score = 0
  gameStore.player1.endurance = 100
  gameStore.player2.endurance = 100

  // Délai pour que Vue mette à jour le DOM
  setTimeout(() => {
    startCountdown()
  }, 100)
}

// Quitter la partie
const quitGame = () => {
  playSoundEffect('button_click')
  router.push('/')
}

// Initialiser le jeu
onMounted(() => {
  initSounds()

  if (
    !gameStore.player1.knight ||
    (gameStore.gameMode === 'twoPlayers' && !gameStore.player2.knight)
  ) {
    router.push('/select')
    return
  }

  // Initialiser les stats du match
  gameStore.initMatchStats(
    settingsStore.playerStats,
    settingsStore.playerTactics,
    settingsStore.defaultDifficulty,
  )

  startCountdown()
})

onBeforeUnmount(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})

// Labels et couleurs des joueurs
const player1Label = computed(() => {
  const knight = gameStore.player1.knight
  return knight ? knight.name : 'Joueur 1'
})

const player2Label = computed(() => {
  const knight = gameStore.player2.knight
  return knight ? knight.name : 'IA'
})

const player1BadgeColor = computed(() => {
  return gameStore.player1.knight?.color || 'red'
})

const player2BadgeColor = computed(() => {
  return gameStore.player2.knight?.color || 'gray'
})
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center p-4 relative bg-cover bg-center"
    :style="{ backgroundImage: `url(${arenaBackground})` }"
    :class="{ 'animate-shake': screenShake }"
  >
    <div class="absolute inset-0 bg-black/75 z-0"></div>
    <div class="relative z-10 w-full flex flex-col items-center justify-center">
    <!-- Bannière héraldique du tournoi -->
    <div class="w-full max-w-4xl mb-4">
      <div class="flex items-stretch gap-1.5">
        <!-- Blason rouge — Joueur -->
        <div class="flex-1 py-2 px-3" style="background: linear-gradient(135deg, rgba(80,10,0,0.9), rgba(50,5,0,0.95)); border: 1px solid rgba(220,38,38,0.35); border-top: 2px solid rgba(248,113,113,0.5);">
          <div class="font-medieval text-sm text-red-300 truncate leading-tight">{{ player1Label }}</div>
          <div class="flex gap-1 my-1">
            <span v-for="i in 3" :key="i" class="text-base" :class="i <= scores.player1 ? 'text-amber-400' : 'text-gray-700'">⚜</span>
          </div>
          <div class="text-[10px] text-amber-800 font-medieval mb-0.5">Vigueur</div>
          <div class="h-1.5 bg-gray-900 overflow-hidden" style="border: 1px solid rgba(146,64,14,0.4);">
            <div class="h-full transition-all" style="background: linear-gradient(to right, #991b1b, #ef4444);" :style="{ width: `${gameStore.player1.endurance}%` }"></div>
          </div>
        </div>

        <!-- Parchemin central — Proclamation -->
        <div class="text-center px-3 py-2 flex flex-col justify-center" style="background: linear-gradient(to bottom, rgba(50,20,0,0.95), rgba(25,10,0,0.98)); border: 1px solid rgba(192,156,39,0.5); border-top: 2px solid rgba(192,156,39,0.8); min-width: 130px;">
          <div class="text-amber-600/70 text-[9px] font-medieval tracking-wider mb-0.5">⚜ TOURNOI ROYAL ⚜</div>
          <div class="font-medieval text-2xl text-amber-400 leading-none">Passe {{ joustState.currentPass + 1 }}</div>
          <div class="text-[10px] text-amber-700 font-body italic mt-1">{{ joustState.player1Side === 'left' ? '← Vous' : 'Vous →' }}</div>
        </div>

        <!-- Blason bleu — IA -->
        <div class="flex-1 py-2 px-3 text-right" style="background: linear-gradient(225deg, rgba(0,20,80,0.9), rgba(0,10,50,0.95)); border: 1px solid rgba(37,99,235,0.35); border-top: 2px solid rgba(96,165,250,0.5);">
          <div class="font-medieval text-sm text-blue-300 truncate leading-tight">{{ player2Label }}</div>
          <div class="flex gap-1 my-1 justify-end">
            <span v-for="i in 3" :key="i" class="text-base" :class="i <= scores.player2 ? 'text-amber-400' : 'text-gray-700'">⚜</span>
          </div>
          <div class="text-[10px] text-amber-800 font-medieval mb-0.5">Vigueur</div>
          <div class="h-1.5 bg-gray-900 overflow-hidden" style="border: 1px solid rgba(146,64,14,0.4);">
            <div class="h-full transition-all" style="background: linear-gradient(to right, #1d4ed8, #3b82f6);" :style="{ width: `${gameStore.player2.endurance}%` }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Terrain de joute -->
    <div
      class="w-full max-w-4xl h-56 relative rounded-lg overflow-hidden border-4 border-amber-900 shadow-2xl"
    >
      <!-- Ciel atmosphérique -->
      <div class="absolute inset-0 bg-gradient-to-b from-indigo-900 via-sky-500 to-amber-100"></div>

      <!-- Brume à l'horizon -->
      <div
        class="absolute top-[28%] left-0 right-0 h-16 pointer-events-none"
        style="background: linear-gradient(to bottom, transparent, rgba(254,243,199,0.35)); filter: blur(6px);"
      ></div>

      <!-- Nuages -->
      <div class="absolute top-2 left-10 w-14 h-4 bg-white/50 rounded-full blur-sm"></div>
      <div class="absolute top-4 right-20 w-16 h-5 bg-white/40 rounded-full blur-sm"></div>
      <div class="absolute top-2 left-1/3 w-12 h-3 bg-white/35 rounded-full blur-sm"></div>

      <!-- Château distant (silhouette) -->
      <div class="absolute top-[3%] left-1/2 -translate-x-1/2 w-28 pointer-events-none" style="opacity: 0.18;">
        <svg viewBox="0 0 120 55" xmlns="http://www.w3.org/2000/svg" fill="#0f172a">
          <rect x="40" y="20" width="40" height="35"/>
          <rect x="37" y="12" width="8" height="10"/><rect x="49" y="10" width="8" height="12"/>
          <rect x="61" y="12" width="8" height="10"/><rect x="73" y="10" width="8" height="12"/>
          <rect x="18" y="24" width="24" height="31"/><rect x="16" y="17" width="6" height="8"/>
          <rect x="24" y="15" width="6" height="10"/><rect x="32" y="17" width="6" height="8"/>
          <rect x="78" y="24" width="24" height="31"/><rect x="78" y="17" width="6" height="8"/>
          <rect x="86" y="15" width="6" height="10"/><rect x="94" y="17" width="6" height="8"/>
          <rect x="58" y="4" width="2" height="12"/>
          <polygon points="60,4 70,8 60,12" fill="#8B0000"/>
        </svg>
      </div>

      <!-- Tribunes gauche -->
      <div class="absolute top-[7%] left-0 w-[18%] h-[40%] pointer-events-none" style="opacity: 0.65;">
        <svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="22" width="100" height="38" fill="#5a3a1a"/>
          <rect x="0" y="22" width="100" height="8" fill="#7a4a1a"/>
          <rect x="0" y="32" width="100" height="8" fill="#6a3a1a"/>
          <ellipse cx="10" cy="21" rx="5" ry="6" fill="#1a0a00"/>
          <ellipse cx="22" cy="18" rx="5" ry="6" fill="#1a0a00"/>
          <ellipse cx="34" cy="21" rx="5" ry="6" fill="#1a0a00"/>
          <ellipse cx="46" cy="17" rx="5" ry="6" fill="#1a0a00"/>
          <ellipse cx="58" cy="20" rx="5" ry="6" fill="#1a0a00"/>
          <ellipse cx="70" cy="18" rx="5" ry="6" fill="#1a0a00"/>
          <ellipse cx="82" cy="21" rx="5" ry="6" fill="#1a0a00"/>
          <ellipse cx="94" cy="17" rx="5" ry="6" fill="#1a0a00"/>
          <rect x="0" y="14" width="100" height="8" fill="#8B4513"/>
          <rect x="0" y="12" width="100" height="2" fill="#c08020"/>
        </svg>
      </div>

      <!-- Tribunes droite -->
      <div class="absolute top-[7%] right-0 w-[18%] h-[40%] pointer-events-none" style="opacity: 0.65;">
        <svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="22" width="100" height="38" fill="#5a3a1a"/>
          <rect x="0" y="22" width="100" height="8" fill="#7a4a1a"/>
          <rect x="0" y="32" width="100" height="8" fill="#6a3a1a"/>
          <ellipse cx="10" cy="21" rx="5" ry="6" fill="#1a0a00"/>
          <ellipse cx="22" cy="18" rx="5" ry="6" fill="#1a0a00"/>
          <ellipse cx="34" cy="21" rx="5" ry="6" fill="#1a0a00"/>
          <ellipse cx="46" cy="17" rx="5" ry="6" fill="#1a0a00"/>
          <ellipse cx="58" cy="20" rx="5" ry="6" fill="#1a0a00"/>
          <ellipse cx="70" cy="18" rx="5" ry="6" fill="#1a0a00"/>
          <ellipse cx="82" cy="21" rx="5" ry="6" fill="#1a0a00"/>
          <ellipse cx="94" cy="17" rx="5" ry="6" fill="#1a0a00"/>
          <rect x="0" y="14" width="100" height="8" fill="#8B4513"/>
          <rect x="0" y="12" width="100" height="2" fill="#c08020"/>
        </svg>
      </div>

      <!-- Piste de sable -->
      <div
        class="absolute top-[50%] bottom-0 left-0 right-0 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700"
      ></div>
      <!-- Traces de sabots (lignes de profondeur) -->
      <div class="absolute top-[55%] left-0 right-0 h-px bg-amber-900/35 pointer-events-none"></div>
      <div class="absolute top-[72%] left-0 right-0 h-px bg-amber-900/25 pointer-events-none"></div>

      <!-- Tilt central — lice de joute : poteaux verticaux + 2 rails, hauteur ventre cheval -->
      <div class="absolute left-0 right-0 z-10 pointer-events-none" style="top: 46%;">
        <!-- Pennons au-dessus du rail (rouge jouer 1, doré central, bleu joueur 2) -->
        <div class="absolute" style="top: -18px; left: 20%; transform: translateX(-50%);">
          <div style="width: 2px; height: 18px; background: #5a2008;"></div>
          <div class="absolute" style="top: 0; left: 2px; width: 0; height: 0; border-top: 5px solid transparent; border-bottom: 5px solid transparent; border-left: 10px solid #9B0000;"></div>
        </div>
        <div class="absolute" style="top: -22px; left: 50%; transform: translateX(-50%);">
          <div style="width: 3px; height: 22px; background: linear-gradient(to right, #5a2008, #8B4513, #5a2008);"></div>
          <div class="absolute" style="top: 0; left: 3px; width: 0; height: 0; border-top: 6px solid transparent; border-bottom: 6px solid transparent; border-left: 13px solid #c09c27;"></div>
        </div>
        <div class="absolute" style="top: -18px; left: 80%; transform: translateX(-50%);">
          <div style="width: 2px; height: 18px; background: #5a2008;"></div>
          <div class="absolute" style="top: 0; left: 2px; width: 0; height: 0; border-top: 5px solid transparent; border-bottom: 5px solid transparent; border-left: 10px solid #1d4ed8;"></div>
        </div>
        <!-- Lice : 2 rails + poteaux verticaux entre eux (hauteur ventre cheval) -->
        <div class="relative w-full" style="height: 16px;">
          <!-- Rail supérieur -->
          <div class="absolute top-0 w-full" style="height: 3px; background: linear-gradient(to bottom, #9B4515, #6B2808, #8B4513); box-shadow: 0 1px 2px rgba(0,0,0,0.5);"></div>
          <!-- Fond sombre entre les 2 rails -->
          <div class="absolute w-full" style="top: 3px; bottom: 3px; background: rgba(0,0,0,0.6);"></div>
          <!-- Poteaux verticaux simulés par gradient répétitif -->
          <div class="absolute w-full" style="top: 3px; bottom: 3px; background: repeating-linear-gradient(90deg, #6B2808 0px, #9B4513 1px, #9B4513 5px, #5a2008 6px, transparent 6px, transparent 12px);"></div>
          <!-- Rail inférieur -->
          <div class="absolute bottom-0 w-full" style="height: 3px; background: linear-gradient(to bottom, #6B2808, #3a1000, #5a2008); box-shadow: 0 2px 5px rgba(0,0,0,0.6);"></div>
        </div>
      </div>

      <!-- Effet d'impact au centre -->
      <div
        v-if="showImpact"
        class="absolute left-1/2 top-[50%] transform -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none"
      >
        <div v-if="impactType === 'unhorse'" class="text-4xl animate-impact-unhorse">💥</div>
        <div
          v-else-if="impactType === 'hit' || impactType === 'double_hit'"
          class="text-3xl animate-impact-hit"
        >
          ⚔️
        </div>
        <div v-else-if="impactType === 'miss'" class="text-2xl animate-impact-miss text-gray-400">
          💨
        </div>
      </div>

      <!-- Jouteur 1 (au-dessus de la lice) -->
      <JousterSprite
        :position="joustState.player1Side === 'left' ? 'left' : 'right'"
        :positionValue="player1.position"
        :state="player1.state"
        :movingDirection="joustState.player1Side === 'left' ? 'right' : 'left'"
        :class="{ 'jouster-hit': player1Hit }"
        verticalPosition="top"
        :scale="1"
        :playerLabel="player1Label"
        :badgeColor="player1BadgeColor"
        @animationCompleted="onPlayer1AnimationCompleted"
      />

      <!-- Jouteur 2 (en-dessous de la lice) -->
      <JousterSprite
        :position="joustState.player1Side === 'left' ? 'right' : 'left'"
        :positionValue="player2.position"
        :state="player2.state"
        :movingDirection="joustState.player1Side === 'left' ? 'left' : 'right'"
        :class="{ 'jouster-hit': player2Hit }"
        verticalPosition="bottom"
        :scale="1"
        :playerLabel="player2Label"
        :badgeColor="player2BadgeColor"
        @animationCompleted="onPlayer2AnimationCompleted"
      />

      <!-- Compte à rebours -->
      <div
        v-if="countdown > 0 && !isPlaying && !gameEnded"
        class="absolute inset-0 flex items-center justify-center z-50 bg-black/30"
      >
        <div class="text-6xl font-medieval text-yellow-400 animate-pulse drop-shadow-lg">
          {{ countdown }}
        </div>
      </div>
    </div>

    <!-- Contrôles -->
    <div class="w-full max-w-4xl mt-4 flex justify-center gap-4">
      <BaseButton
        v-if="!isPlaying && !gameEnded && countdown === 0 && !showResults"
        @click="startJoust"
        text="Jouter !"
        color="gold"
        icon="gi-swordman"
      />
      <BaseButton
        v-if="!isPlaying && !gameEnded && !showResults"
        @click="quitGame"
        text="Abandonner"
        color="red"
        icon="bi-arrow-left"
      />
    </div>

    <!-- Parchemin des résultats -->
    <div v-if="showResults" class="fixed inset-0 flex items-center justify-center z-50 bg-black/75">
      <div
        class="p-6 text-center max-w-md w-full relative"
        style="
          background: radial-gradient(ellipse at 50% 0%, rgba(45,18,2,0.98) 0%, rgba(12,4,1,0.995) 100%);
          box-shadow:
            0 0 0 2px rgba(192,156,39,0.85),
            0 0 0 5px rgba(5,2,0,0.98),
            0 0 0 7px rgba(192,156,39,0.45),
            0 0 0 9px rgba(0,0,0,0.65),
            0 40px 100px rgba(0,0,0,0.98);
        "
      >
        <!-- Coins ornementaux -->
        <div class="absolute pointer-events-none" style="top: 8px; left: 8px; width: 24px; height: 24px; border-top: 2px solid rgba(192,156,39,0.9); border-left: 2px solid rgba(192,156,39,0.9);"></div>
        <div class="absolute pointer-events-none" style="top: 8px; right: 8px; width: 24px; height: 24px; border-top: 2px solid rgba(192,156,39,0.9); border-right: 2px solid rgba(192,156,39,0.9);"></div>
        <div class="absolute pointer-events-none" style="bottom: 8px; left: 8px; width: 24px; height: 24px; border-bottom: 2px solid rgba(192,156,39,0.9); border-left: 2px solid rgba(192,156,39,0.9);"></div>
        <div class="absolute pointer-events-none" style="bottom: 8px; right: 8px; width: 24px; height: 24px; border-bottom: 2px solid rgba(192,156,39,0.9); border-right: 2px solid rgba(192,156,39,0.9);"></div>
        <div class="text-amber-700/60 text-xs font-medieval mb-2 tracking-widest">— Résultat de la Passe —</div>
        <h3 class="text-2xl font-medieval text-amber-400 mb-4">{{ roundResultMessage }}</h3>

        <div class="mb-4 grid grid-cols-2 gap-3">
          <div class="p-3 text-center" style="background: rgba(80,10,0,0.6); border: 1px solid rgba(220,38,38,0.3); border-top: 2px solid rgba(248,113,113,0.4);">
            <div class="font-medieval text-red-300 text-sm mb-1">{{ player1Label }}</div>
            <div class="text-xl font-medieval text-parchment leading-tight">
              <template v-if="passResult.player1Unhorse && !passResult.player2Unhorse">
                <span class="text-amber-400 text-base">Désarçonnement !</span>
              </template>
              <template v-else>
                {{ roundPoints.player1 }} <span class="text-sm text-parchment-muted">pt</span>
              </template>
            </div>
            <div class="flex justify-center gap-0.5 my-1">
              <span v-for="i in 3" :key="i" class="text-xs" :class="i <= scores.player1 ? 'text-amber-400' : 'text-gray-700'">⚜</span>
            </div>
            <div class="text-[10px] text-amber-800 font-medieval">Vigueur : {{ Math.round(gameStore.player1.endurance) }}%</div>
          </div>
          <div class="p-3 text-center" style="background: rgba(0,20,80,0.6); border: 1px solid rgba(37,99,235,0.3); border-top: 2px solid rgba(96,165,250,0.4);">
            <div class="font-medieval text-blue-300 text-sm mb-1">{{ player2Label }}</div>
            <div class="text-xl font-medieval text-parchment leading-tight">
              <template v-if="passResult.player2Unhorse && !passResult.player1Unhorse">
                <span class="text-amber-400 text-base">Désarçonnement !</span>
              </template>
              <template v-else>
                {{ roundPoints.player2 }} <span class="text-sm text-parchment-muted">pt</span>
              </template>
            </div>
            <div class="flex justify-center gap-0.5 my-1">
              <span v-for="i in 3" :key="i" class="text-xs" :class="i <= scores.player2 ? 'text-amber-400' : 'text-gray-700'">⚜</span>
            </div>
            <div class="text-[10px] text-amber-800 font-medieval">Vigueur : {{ Math.round(gameStore.player2.endurance) }}%</div>
          </div>
        </div>

        <div v-if="matchEnded" class="my-4 text-xl text-yellow-300 font-medieval border-t border-amber-900/40 pt-4">
          {{ matchWinnerMessage }}
        </div>

        <div class="flex justify-center space-x-4 mt-6">
          <BaseButton
            v-if="!matchEnded"
            @click="nextRound"
            text="Passe suivante"
            color="gold"
            icon="gi-swordman"
          />
          <BaseButton
            v-if="matchEnded"
            @click="resetGame"
            text="Nouvelle joute"
            color="gold"
            icon="gi-swordman"
          />
          <BaseButton @click="quitGame" text="Quitter" color="red" icon="bi-arrow-left" />
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<style scoped>
/* Effet de flash sur le jouteur touché - appliqué directement */
.jouster-hit {
  animation: hit-flash 0.4s ease-in-out;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.animate-pulse {
  animation: pulse 1s ease-in-out infinite;
}

/* Effet de secousse de l'écran */
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-5px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(5px);
  }
}

.animate-shake {
  animation: shake 0.3s ease-in-out;
}

/* Effet de flash rouge quand touché */
@keyframes hit-flash {
  0%,
  100% {
    filter: brightness(1);
  }
  25%,
  75% {
    filter: brightness(2) sepia(1) saturate(5) hue-rotate(-20deg);
  }
  50% {
    filter: brightness(0.5);
  }
}

.animate-hit-flash {
  animation: hit-flash 0.4s ease-in-out;
}

/* Effet d'impact - désarçonnement */
@keyframes impact-unhorse {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  30% {
    transform: scale(1.5);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-impact-unhorse {
  animation: impact-unhorse 0.8s ease-out forwards;
}

/* Effet d'impact - touche */
@keyframes impact-hit {
  0% {
    transform: scale(0.8) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(15deg);
    opacity: 1;
  }
  100% {
    transform: scale(0.8) rotate(-15deg);
    opacity: 0;
  }
}

.animate-impact-hit {
  animation: impact-hit 0.5s ease-out forwards;
}

/* Effet d'impact - raté */
@keyframes impact-miss {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.5) translateY(-20px);
    opacity: 0;
  }
}

.animate-impact-miss {
  animation: impact-miss 0.6s ease-out forwards;
}
</style>
