import { ref, computed } from 'vue'
import { useGameState } from '../composables/useGameState'
import { applyStrategy } from './strategies'

export const useAIPlayer = (difficultyLevel = 'medium') => {
  const { gameState, playerState } = useGameState()

  const aiState = ref({
    // Caractéristiques du chevalier IA
    knight: {
      strength: getDifficultyAttribute(difficultyLevel, 'strength'),
      precision: getDifficultyAttribute(difficultyLevel, 'precision'),
      endurance: 100, // Valeur initiale
    },
    // Caractéristiques du cheval IA
    horse: {
      speed: getDifficultyAttribute(difficultyLevel, 'speed'),
      stability: getDifficultyAttribute(difficultyLevel, 'stability'),
      endurance: 100, // Valeur initiale
    },
    // Position et état actuel
    position: 0, // Position sur le champ (0 à 100)
    lanceAngle: 0, // Angle de la lance (-45 à 45 degrés)
    isCharging: false, // En charge ou non
    strategy: difficultyLevel, // Stratégie basée sur la difficulté
  })

  // Calcule la prochaine action de l'IA en fonction de l'état actuel du jeu
  const decideNextAction = () => {
    // Obtenir l'état actuel du joueur pour informer la décision de l'IA
    const playerPosition = playerState.position
    const distanceToPlayer = Math.abs(aiState.value.position - playerPosition)

    // Appliquer la stratégie en fonction du niveau de difficulté
    const action = applyStrategy({
      difficultyLevel: aiState.value.strategy,
      aiState: aiState.value,
      playerState,
      gameState,
      distanceToPlayer
    })

    // Mettre à jour l'état de l'IA avec l'action décidée
    updateAIState(action)

    return action
  }

  // Met à jour l'état de l'IA en fonction de l'action décidée
  const updateAIState = (action) => {
    // Mettre à jour l'angle de la lance
    if (action.adjustLance) {
      aiState.value.lanceAngle = action.lanceAngle
    }

    // Mettre à jour la vitesse/position
    if (action.startCharging && !aiState.value.isCharging) {
      aiState.value.isCharging = true
    }

    // Simuler la diminution d'endurance lors de la charge
    if (aiState.value.isCharging) {
      aiState.value.horse.endurance = Math.max(0, aiState.value.horse.endurance - 0.2)
    }
  }

  // Simule la progression de l'IA pendant la joute
  const simulateJoust = (deltaTime) => {
    if (aiState.value.isCharging) {
      // Calculer la nouvelle position en fonction de la vitesse et du temps écoulé
      const speedFactor = aiState.value.horse.speed * (aiState.value.horse.endurance / 100)
      aiState.value.position += speedFactor * deltaTime

      // Appeler la fonction de décision pour ajuster l'angle de la lance, etc.
      decideNextAction()
    }
  }

  // Réinitialiser l'état de l'IA pour une nouvelle manche
  const resetForNewRound = () => {
    aiState.value.position = 0
    aiState.value.lanceAngle = 0
    aiState.value.isCharging = false
    aiState.value.horse.endurance = 100 // Réinitialiser l'endurance
    aiState.value.knight.endurance = 100
  }

  // Modifier le niveau de difficulté
  const setDifficulty = (newLevel) => {
    aiState.value.strategy = newLevel
    aiState.value.knight.strength = getDifficultyAttribute(newLevel, 'strength')
    aiState.value.knight.precision = getDifficultyAttribute(newLevel, 'precision')
    aiState.value.horse.speed = getDifficultyAttribute(newLevel, 'speed')
    aiState.value.horse.stability = getDifficultyAttribute(newLevel, 'stability')
  }

  // Propriétés calculées pour déterminer les modifications d'attributs en fonction de l'état
  const effectiveAttributes = computed(() => {
    return {
      precision: calculateEffectivePrecision(),
      power: calculateEffectivePower(),
      speed: calculateEffectiveSpeed()
    }
  })

  // Fonctions auxiliaires pour calculer les attributs effectifs
  const calculateEffectivePrecision = () => {
    // La précision diminue avec la fatigue
    return aiState.value.knight.precision * (aiState.value.knight.endurance / 100)
  }

  const calculateEffectivePower = () => {
    // La puissance est influencée par la force et l'élan (vitesse)
    return aiState.value.knight.strength * (aiState.value.horse.speed / 10)
  }

  const calculateEffectiveSpeed = () => {
    // La vitesse est affectée par l'endurance du cheval
    return aiState.value.horse.speed * (aiState.value.horse.endurance / 100)
  }

  // Fonction utilitaire pour définir les attributs en fonction du niveau de difficulté
  function getDifficultyAttribute(level, attribute) {
    const difficultySettings = {
      easy: {
        strength: 6,
        precision: 5,
        speed: 7,
        stability: 6
      },
      medium: {
        strength: 7,
        precision: 7,
        speed: 8,
        stability: 7
      },
      hard: {
        strength: 9,
        precision: 8,
        speed: 9,
        stability: 8
      }
    }

    return difficultySettings[level]?.[attribute] || difficultySettings.medium[attribute]
  }

  return {
    aiState,
    decideNextAction,
    simulateJoust,
    resetForNewRound,
    setDifficulty,
    effectiveAttributes
  }
}
