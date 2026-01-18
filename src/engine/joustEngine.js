/**
 * Moteur de calcul pour les joutes
 */

const STYLE_MODIFIERS = {
  haute: { touchBonus: 10, unhorseBonus: -5 },
  moyenne: { touchBonus: 0, unhorseBonus: 0 },
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
  const intBonus = ((attacker.intelligence || 100) - (defender.intelligence || 100)) / 10
  const styleBonus = STYLE_MODIFIERS[attackerTactics?.style]?.touchBonus || 0
  const postureBonus = POSTURE_MODIFIERS[attackerTactics?.posture]?.attack || 0
  const allureBonus = ALLURE_MODIFIERS[attackerTactics?.allure]?.precision || 0
  const defenderPosture = POSTURE_MODIFIERS[defenderTactics?.posture]?.defense || 0
  const horseBonus = Math.min((attacker.horse?.experience || 0) / 10, 15)
  const enduranceMalus = (100 - (attacker.endurance || 100)) / 5
  const intimidation = Math.max(0, ((attacker.charisme || 100) - (defender.charisme || 100)) / 20)

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

  return Math.random() * 100 < Math.min(95, Math.max(5, finalChance))
}

/**
 * Calcule si un désarçonnement se produit
 */
export function calculateUnhorse(attacker, defender, attackerTactics, defenderTactics) {
  const baseChance = 15

  const forceBonus = ((attacker.force || 100) - (defender.force || 100)) / 8
  const styleBonus = STYLE_MODIFIERS[attackerTactics?.style]?.unhorseBonus || 0
  const postureBonus = POSTURE_MODIFIERS[attackerTactics?.posture]?.attack || 0
  const impactBonus = ALLURE_MODIFIERS[attackerTactics?.allure]?.impact || 0
  const defenderStability = (defender.horse?.experience || 0) / 15
  const defenderPosture = POSTURE_MODIFIERS[defenderTactics?.posture]?.defense || 0
  const defenderEnduranceMalus = (100 - (defender.endurance || 100)) / 10

  const finalChance =
    baseChance +
    forceBonus +
    styleBonus +
    postureBonus +
    impactBonus -
    defenderStability -
    defenderPosture +
    defenderEnduranceMalus

  return Math.random() * 100 < Math.min(40, Math.max(2, finalChance))
}

/**
 * Calcule l'endurance perdue après une passe
 */
export function calculateEnduranceLoss(knight, tactics) {
  let loss = 10
  if (tactics?.allure === 'rapide') loss += 5
  if (tactics?.allure === 'lente') loss -= 3
  if (tactics?.posture === 'offensive') loss += 3
  if (tactics?.posture === 'defensive') loss -= 2
  const charismeRecovery = (knight.charisme || 100) / 50
  return Math.max(5, loss - charismeRecovery)
}

/**
 * Calcule la récupération d'endurance après une passe
 */
export function calculateEnduranceRecovery(knight) {
  return Math.min(5, (knight.charisme || 100) / 30)
}

/**
 * Génère les tactiques IA selon la difficulté
 */
export function generateAITactics(difficulty, aiKnight, playerKnight) {
  const tactics = { style: 'moyenne', posture: 'equilibree', allure: 'moderee' }

  if (difficulty === 'easy') {
    tactics.posture = 'defensive'
    tactics.allure = 'lente'
  } else if (difficulty === 'normal') {
    const styles = ['haute', 'moyenne', 'basse']
    tactics.style = styles[Math.floor(Math.random() * 3)]
    tactics.posture = Math.random() > 0.5 ? 'equilibree' : 'offensive'
  } else if (difficulty === 'hard') {
    if ((aiKnight?.endurance || 100) < 40) {
      tactics.posture = 'defensive'
      tactics.allure = 'lente'
    } else if ((playerKnight?.endurance || 100) < 50) {
      tactics.posture = 'offensive'
      tactics.allure = 'rapide'
    } else {
      tactics.style = (aiKnight?.force || 100) > (playerKnight?.force || 100) ? 'haute' : 'basse'
      tactics.posture = 'offensive'
    }
  }

  return tactics
}

/**
 * Génère les stats d'un chevalier IA
 */
export function generateAIStats(difficulty) {
  const ranges = {
    easy: { min: 80, max: 120 },
    normal: { min: 100, max: 160 },
    hard: { min: 140, max: 200 },
  }
  const range = ranges[difficulty] || ranges.normal
  const randomStat = () => Math.floor(Math.random() * (range.max - range.min) + range.min)

  return {
    force: randomStat(),
    intelligence: randomStat(),
    charisme: randomStat(),
    endurance: 100,
    horse: {
      experience: difficulty === 'easy' ? 5 : difficulty === 'normal' ? 15 : 30,
      vitesse: randomStat(),
      endurance: 100,
    },
  }
}
