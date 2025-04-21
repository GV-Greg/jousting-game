import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'

export const useGameState = defineStore('game', () => {
  // État du jeu
  const gameState = reactive({
    currentScreen: 'home', // 'home', 'characterSelect', 'game', 'rules'
    roundStarted: false,
    currentRound: 1,
    maxRounds: 5,
    roundsWon: {
      player: 0,
      ai: 0
    },
    countdown: 3,
    isCountingDown: false,
    isPaused: false,
    gameOver: false,
    winner: null, // 'player' ou 'ai'
    difficulty: 'medium' // 'easy', 'medium', 'hard'
  })

  // État du joueur
  const playerState = reactive({
    // Caractéristiques du chevalier
    knight: {
      name: '',
      strength: 7,
      precision: 7,
      endurance: 100
    },
    // Caractéristiques du cheval
    horse: {
      name: '',
      speed: 8,
      stability: 7,
      endurance: 100
    },
    // Position et état actuel
    position: 0, // Position sur le champ (0 à 100)
    lanceAngle: 0, // Angle de la lance (-45 à 45 degrés)
    isCharging: false, // En charge ou non
    lastPositions: [], // Historique des positions (pour l'IA prédictive)
    score: 0, // Score total
    roundScore: 0 // Score de la manche actuelle
  })

  // Fonctions de gestion du jeu

  /**
   * Démarre une nouvelle manche
   */
  const startRound = () => {
    gameState.isCountingDown = true
    gameState.countdown = 3

    // Compte à rebours
    const countdownInterval = setInterval(() => {
      gameState.countdown--

      if (gameState.countdown <= 0) {
        clearInterval(countdownInterval)
        gameState.isCountingDown = false
        gameState.roundStarted = true
      }
    }, 1000)
  }

  /**
   * Termine la manche actuelle et calcule les résultats
   */
  const endRound = (playerScore, aiScore) => {
    gameState.roundStarted = false

    // Déterminer le gagnant de la manche
    if (playerScore > aiScore) {
      gameState.roundsWon.player++
    } else if (aiScore > playerScore) {
      gameState.roundsWon.ai++
    }

    // Vérifier si le jeu est terminé
    if (gameState.roundsWon.player >= 3 || gameState.roundsWon.ai >= 3) {
      endGame()
    } else {
      // Passer à la manche suivante
      gameState.currentRound++
    }
  }

  /**
   * Termine le jeu et détermine le gagnant
   */
  const endGame = () => {
    gameState.gameOver = true
    gameState.winner = gameState.roundsWon.player > gameState.roundsWon.ai ? 'player' : 'ai'
  }

  /**
   * Réinitialise le jeu pour une nouvelle partie
   */
  const resetGame = () => {
    // Réinitialiser l'état du jeu
    gameState.roundStarted = false
    gameState.currentRound = 1
    gameState.roundsWon.player = 0
    gameState.roundsWon.ai = 0
    gameState.countdown = 3
    gameState.isCountingDown = false
    gameState.isPaused = false
    gameState.gameOver = false
    gameState.winner = null

    // Réinitialiser l'état du joueur
    playerState.position = 0
    playerState.lanceAngle = 0
    playerState.isCharging = false
    playerState.lastPositions = []
    playerState.score = 0
    playerState.roundScore = 0
    playerState.knight.endurance = 100
    playerState.horse.endurance = 100
  }

  /**
   * Met en pause ou reprend le jeu
   */
  const togglePause = () => {
    gameState.isPaused = !gameState.isPaused
  }

  /**
   * Change l'écran actuel
   */
  const changeScreen = (screen) => {
    gameState.currentScreen = screen
  }

  /**
   * Définit le niveau de difficulté
   */
  const setDifficulty = (level) => {
    gameState.difficulty = level
  }

  /**
   * Met à jour les caractéristiques du chevalier du joueur
   */
  const updatePlayerKnight = (knight) => {
    playerState.knight = { ...playerState.knight, ...knight }
  }

  /**
   * Met à jour les caractéristiques du cheval du joueur
   */
  const updatePlayerHorse = (horse) => {
    playerState.horse = { ...playerState.horse, ...horse }
  }

  /**
   * Met à jour la position du joueur et conserve un historique
   */
  const updatePlayerPosition = (position) => {
    // Ajouter la position actuelle à l'historique avant de la mettre à jour
    playerState.lastPositions.push(playerState.position)

    // Limiter la taille de l'historique à 10 positions
    if (playerState.lastPositions.length > 10) {
      playerState.lastPositions.shift()
    }

    // Mettre à jour la position
    playerState.position = position
  }

  /**
   * Calcule si une collision a lieu entre les joueurs
   */
  const checkCollision = (playerPos, aiPos, playerLanceAngle, aiLanceAngle, threshold = 5) => {
    // Vérifier si les positions sont suffisamment proches
    return Math.abs(playerPos - aiPos) < threshold
  }

  /**
   * Calcule les points marqués lors d'une collision
   */
  const calculateHitPoints = (attacker, defender, lanceAngle) => {
    // Précision de l'angle (une valeur parfaite serait 0, donc on mesure la déviation)
    const anglePrecision = 1 - Math.abs(lanceAngle) / 45 // Normalisé entre 0 et 1

    // Force effective de l'attaquant
    const effectiveStrength = attacker.knight.strength * (attacker.knight.endurance / 100)

    // Stabilité effective du défenseur
    const effectiveStability = defender.horse.stability * (defender.horse.endurance / 100)

    // Calculer les points de base
    let points = effectiveStrength * anglePrecision * 2

    // Ajuster en fonction de la stabilité du défenseur
    points = points * (1 - (effectiveStability / 15))

    // Arrondir à l'entier le plus proche
    return Math.round(points)
  }

  /**
   * Vérifie si le joueur a été désarçonné
   */
  const checkUnhorsed = (hitPoints, defenderStability) => {
    // Probabilité de désarçonnement basée sur les points de touche et la stabilité
    const unhorseProbability = hitPoints / 10 * (1 - defenderStability / 10)

    // Retourne true si le joueur est désarçonné
    return Math.random() < unhorseProbability
  }

  return {
    gameState,
    playerState,
    startRound,
    endRound,
    endGame,
    resetGame,
    togglePause,
    changeScreen,
    setDifficulty,
    updatePlayerKnight,
    updatePlayerHorse,
    updatePlayerPosition,
    checkCollision,
    calculateHitPoints,
    checkUnhorsed
  }
})
