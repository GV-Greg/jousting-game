/**
 * Applique une stratégie d'IA en fonction du niveau de difficulté
 * @param {Object} params - Paramètres de décision
 * @returns {Object} Action à effectuer
 */
export const applyStrategy = (params) => {
  const { difficultyLevel, aiState, playerState, gameState, distanceToPlayer } = params

  // Sélectionner la stratégie en fonction du niveau de difficulté
  switch (difficultyLevel) {
    case 'easy':
      return easyStrategy(aiState, playerState, gameState, distanceToPlayer)
    case 'medium':
      return mediumStrategy(aiState, playerState, gameState, distanceToPlayer)
    case 'hard':
      return hardStrategy(aiState, playerState, gameState, distanceToPlayer)
    default:
      return mediumStrategy(aiState, playerState, gameState, distanceToPlayer)
  }
}

/**
 * Stratégie de niveau facile
 * - Visée moins précise
 * - Temps de réaction plus lent
 * - Mouvements plus prévisibles
 */
const easyStrategy = (aiState, playerState, gameState, distanceToPlayer) => {
  // Pour le niveau facile, l'IA réagit plus lentement et fait des erreurs
  const action = {
    adjustLance: false,
    lanceAngle: 0,
    startCharging: false
  }

  // L'IA commence à charger après un délai aléatoire
  if (!aiState.isCharging && Math.random() > 0.7) {
    action.startCharging = true
  }

  // L'IA ajuste sa lance de façon imprécise
  if (distanceToPlayer < 50 && Math.random() > 0.5) {
    action.adjustLance = true
    // Ajouter un facteur d'imprécision (+/- 10 degrés)
    const targetAngle = calculateOptimalAngle(aiState, playerState)
    const imprecision = (Math.random() - 0.5) * 20
    action.lanceAngle = targetAngle + imprecision
  }

  return action
}

/**
 * Stratégie de niveau moyen
 * - Visée assez précise
 * - Bon timing de charge
 * - Adaptation modérée à la position du joueur
 */
const mediumStrategy = (aiState, playerState, gameState, distanceToPlayer) => {
  const action = {
    adjustLance: false,
    lanceAngle: 0,
    startCharging: false
  }

  // L'IA commence à charger rapidement
  if (!aiState.isCharging && gameState.roundStarted) {
    action.startCharging = true
  }

  // L'IA ajuste sa lance avec une précision modérée
  if (distanceToPlayer < 60) {
    action.adjustLance = true
    // Précision modérée (+/- 5 degrés)
    const targetAngle = calculateOptimalAngle(aiState, playerState)
    const imprecision = (Math.random() - 0.5) * 10
    action.lanceAngle = targetAngle + imprecision
  }

  return action
}

/**
 * Stratégie de niveau difficile
 * - Visée très précise
 * - Timing parfait
 * - Adaptation intelligente à la position et aux mouvements du joueur
 */
const hardStrategy = (aiState, playerState, gameState, distanceToPlayer) => {
  const action = {
    adjustLance: false,
    lanceAngle: 0,
    startCharging: false
  }

  // L'IA commence à charger au moment optimal
  if (!aiState.isCharging && gameState.roundStarted) {
    action.startCharging = true
  }

  // L'IA ajuste continuellement sa lance avec haute précision
  if (distanceToPlayer < 70) {
    action.adjustLance = true
    // Haute précision (+/- 2 degrés)
    const targetAngle = calculateOptimalAngle(aiState, playerState)
    const minorImprecision = (Math.random() - 0.5) * 4
    action.lanceAngle = targetAngle + minorImprecision

    // Prédiction des mouvements du joueur
    if (playerState.lastPositions && playerState.lastPositions.length > 1) {
      const playerMovementPattern = predictPlayerMovement(playerState.lastPositions)
      // Ajuster l'angle en fonction du mouvement prédit
      action.lanceAngle += playerMovementPattern * 2
    }
  }

  return action
}

/**
 * Calcule l'angle optimal de la lance pour toucher le joueur
 */
const calculateOptimalAngle = (aiState, playerState) => {
  // Différence de hauteur entre le cavalier IA et le joueur (pourrait varier selon le cheval)
  const heightDifference = (aiState.horse.stability - playerState.horse.stability) * 2

  // Distance horizontale restante
  const horizontalDistance = Math.abs(aiState.position - playerState.position)

  // Calculer l'angle optimal en fonction de la distance et de la différence de hauteur
  // Une formule simplifiée - dans un jeu réel, vous utiliseriez des calculs de physique plus précis
  let optimalAngle = Math.atan2(heightDifference, horizontalDistance) * (180 / Math.PI)

  // Limiter l'angle entre -45 et 45 degrés
  optimalAngle = Math.max(-45, Math.min(45, optimalAngle))

  return optimalAngle
}

/**
 * Prédit le mouvement du joueur basé sur ses positions précédentes
 */
const predictPlayerMovement = (lastPositions) => {
  // Calculer la tendance de mouvement du joueur
  const recentPositions = lastPositions.slice(-3) // Utiliser les 3 dernières positions

  if (recentPositions.length < 2) return 0

  // Calculer la direction moyenne du mouvement
  let movementSum = 0
  for (let i = 1; i < recentPositions.length; i++) {
    movementSum += recentPositions[i] - recentPositions[i-1]
  }

  const averageMovement = movementSum / (recentPositions.length - 1)

  // Normaliser la valeur pour qu'elle soit utilisable pour l'ajustement d'angle
  return averageMovement * 0.5
}
