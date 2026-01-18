/**
 * Moteur de calcul pour les joutes
 */

// Modificateurs tactiques
const STYLE_MODIFIERS = {
  haute: { touchBonus: 10, unhorsePenalty: -5 },
  moyenne: { touchBonus: 0, unhorsePenalty: 0 },
  basse: { touchBonus: -10, unhorseBonus: 10 },
}

const POSTURE_MODIFIERS = {
  offensive: { attack: 15, defense: -15 },
  equilibree: { attack: 0, defense: 0 },
  defensive: { attack: -15, defense: 15 },
}

const ALLURE_MODIFIERS = {
  rapide: { impact: 20, precision: -15 },
  moderee: { impact: 0, precision: 0 },
  lente: { impact: -15, precision: 20 },
}

/**
 * Calcule si une touche est réussie
 */
export function calculateHit(attacker, defender, attackerTactics, defenderTactics) {
  const baseChance = 50

  // Bonus d'intelligence (précision)
  const intBonus = (attacker.intelligence - defender.intelligence) / 10

  // Bonus tactiques
  const styleBonus = STYLE_MODIFIERS[attackerTactics.style]?.touchBonus || 0
  const postureBonus = POSTURE_MODIFIERS[attackerTactics.posture]?.attack || 0
  const allureBonus = ALLURE_MODIFIERS[attackerTactics.allure]?.precision || 0

  // Malus défense adverse
  const defenderPosture = POSTURE_MODIFIERS[defenderTactics.posture]?.defense || 0

  // Bonus expérience cheval
  const horseBonus = Math.min(attacker.horse.experience / 10, 15)

  // Malus endurance
  const enduranceMalus = (100 - attacker.endurance) / 5

  // Intimidation (charisme)
  const intimidation = Math.max(0, (attacker.charisme - defender.charisme) / 20)

  const finalChance =
    baseChance +
    intBonus +
    styleBonus +
    postureBonus +
    allureBonus -
    defenderPosture +
    horseBonus -
    enduranceMalus +
    intimidation

  const roll = Math.random() * 100
  return roll < Math.min(95, Math.max(5, finalChance))
}

/**
 * Calcule si un désarçonnement se produit (après une touche réussie)
 */
export function calculateUnhorse(attacker, defender, attackerTactics, defenderTactics) {
  const baseChance = 15

  // Bonus de force
  const forceBonus = (attacker.force - defender.force) / 8

  // Bonus tactiques
  const styleBonus =
    STYLE_MODIFIERS[attackerTactics.style]?.unhorseBonus ||
    STYLE_MODIFIERS[attackerTactics.style]?.unhorsePenalty ||
    0
  const postureBonus = POSTURE_MODIFIERS[attackerTactics.posture]?.attack || 0
  const impactBonus = ALLURE_MODIFIERS[attackerTactics.allure]?.impact || 0

  // Résistance défenseur
  const defenderStability = defender.horse.experience / 15
  const defenderPosture = POSTURE_MODIFIERS[defenderTactics.posture]?.defense || 0

  // Malus endurance défenseur (plus fatigué = plus facile à désarçonner)
  const defenderEnduranceMalus = (100 - defender.endurance) / 10

  const finalChance =
    baseChance +
    forceBonus +
    styleBonus +
    postureBonus +
    impactBonus -
    defenderStability -
    defenderPosture +
    defenderEnduranceMalus

  const roll = Math.random() * 100
  return roll < Math.min(40, Math.max(2, finalChance))
}

/**
 * Calcule l'endurance perdue après une passe
 */
export function calculateEnduranceLoss(knight, tactics) {
  let loss = 10 // Perte de base

  // Allure rapide = plus de fatigue
  if (tactics.allure === 'rapide') loss += 5
  if (tactics.allure === 'lente') loss -= 3

  // Posture offensive = plus de fatigue
  if (tactics.posture === 'offensive') loss += 3
  if (tactics.posture === 'defensive') loss -= 2

  // Récupération charisme
  const charismeRecovery = knight.charisme / 50

  return Math.max(5, loss - charismeRecovery)
}

/**
 * Récupère l'endurance entre les passes (basé sur charisme)
 */
export function calculateEnduranceRecovery(knight) {
  return Math.min(5, knight.charisme / 30)
}

/**
 * Génère les tactiques IA selon la difficulté
 */
export function generateAITactics(difficulty, currentPass, aiKnight, playerKnight) {
  const tactics = {
    style: 'moyenne',
    posture: 'equilibree',
    allure: 'moderee',
  }

  if (difficulty === 'facile') {
    // IA prévisible et peu agressive
    tactics.posture = 'defensive'
    tactics.allure = 'lente'
  } else if (difficulty === 'moyen') {
    // IA équilibrée avec un peu de variété
    const styles = ['haute', 'moyenne', 'basse']
    tactics.style = styles[Math.floor(Math.random() * 3)]
    tactics.posture = Math.random() > 0.5 ? 'equilibree' : 'offensive'
  } else if (difficulty === 'difficile') {
    // IA intelligente qui s'adapte
    if (aiKnight.endurance < 40) {
      tactics.posture = 'defensive'
      tactics.allure = 'lente'
    } else if (playerKnight.endurance < 50) {
      tactics.posture = 'offensive'
      tactics.allure = 'rapide'
    } else {
      tactics.style = aiKnight.force > playerKnight.force ? 'haute' : 'basse'
      tactics.posture = 'offensive'
    }
  }

  return tactics
}

/**
 * Génère les stats d'un chevalier IA selon la difficulté
 */
export function generateAIStats(difficulty) {
  const baseStats = {
    facile: { min: 80, max: 120 },
    moyen: { min: 100, max: 160 },
    difficile: { min: 140, max: 200 },
  }

  const range = baseStats[difficulty] || baseStats.moyen
  const randomStat = () => Math.floor(Math.random() * (range.max - range.min) + range.min)

  return {
    force: randomStat(),
    intelligence: randomStat(),
    charisme: randomStat(),
    endurance: 100,
    horse: {
      experience: difficulty === 'facile' ? 5 : difficulty === 'moyen' ? 15 : 30,
      vitesse: randomStat(),
      endurance: 100,
    },
  }
}
