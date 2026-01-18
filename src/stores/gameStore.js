import { defineStore } from 'pinia'
import { generateAIStats } from '@/engine/joustEngine'

export const useGameStore = defineStore('game', {
  state: () => ({
    // Paramètres du jeu
    gameMode: 'singlePlayer', // 'singlePlayer', 'twoPlayers'
    difficulty: 'normal', // 'easy', 'normal', 'hard'
    roundsToWin: 3, // Nombre de rounds nécessaires pour gagner

    // État général du jeu
    isPlaying: false,
    currentRound: 1,
    winner: null, // null, 'player1', 'player2'
    gameOver: false,

    // Joueur 1 (joueur humain)
    player1: {
      name: 'Joueur 1',
      knight: null, // Stocke l'objet chevalier sélectionné
      position: 10, // Position sur le terrain (%)
      speed: 0.5,
      score: 0,
      stamina: 100,
      state: 'standing', // 'standing', 'walk', 'gallop', 'attack', 'death'
      isAttacking: false,
      direction: 'right',
      // Stats étendues
      force: 150,
      intelligence: 130,
      charisme: 120,
      endurance: 100,
      horse: { experience: 10, vitesse: 140, endurance: 100 },
    },

    // Joueur 2 (joueur humain ou IA)
    player2: {
      name: 'Joueur 2',
      knight: null,
      position: 90,
      speed: 0.5,
      score: 0,
      stamina: 100,
      state: 'standing',
      isAttacking: false,
      direction: 'left',
      // Stats étendues
      force: 140,
      intelligence: 140,
      charisme: 130,
      endurance: 100,
      horse: { experience: 15, vitesse: 135, endurance: 100 },
    },

    // Tactiques
    player1Tactics: { style: 'moyenne', posture: 'equilibree', allure: 'moderee' },
    player2Tactics: { style: 'moyenne', posture: 'equilibree', allure: 'moderee' },

    // État du match (joute avec passes)
    match: {
      currentPass: 0,
      maxPasses: 5,
      player1Side: 'left',
      winReason: null,
    },

    // Historique des passes
    passHistory: [],

    // IA settings
    aiSettings: {
      easy: {
        reactionTime: 1000, // ms
        accuracy: 0.6, // 60% de précision
        aggression: 0.3, // 30% d'agressivité
      },
      normal: {
        reactionTime: 600,
        accuracy: 0.75,
        aggression: 0.5,
      },
      hard: {
        reactionTime: 300,
        accuracy: 0.9,
        aggression: 0.7,
      },
    },

    // Cache pour l'animation
    animationId: null,
  }),

  getters: {
    // Vérifier si c'est un match contre l'IA
    isAgainstAI: (state) => state.gameMode === 'singlePlayer',

    // Obtenir les paramètres de l'IA en fonction de la difficulté
    currentAiSettings: (state) => state.aiSettings[state.difficulty],

    // Vérifier si les joueurs sont en collision
    arePlayersColliding: (state) => {
      const distance = Math.abs(state.player1.position - state.player2.position)
      return distance < 10 // Collision si à moins de 10% de distance
    },

    // Vérifier si un joueur a gagné la partie
    matchWinner: (state) => {
      if (state.player1.score >= state.roundsToWin) return 'player1'
      if (state.player2.score >= state.roundsToWin) return 'player2'
      return null
    },

    // Joueur actuellement à gauche
    getLeftPlayer: (state) => {
      return state.match.player1Side === 'left' ? state.player1 : state.player2
    },

    // Joueur actuellement à droite
    getRightPlayer: (state) => {
      return state.match.player1Side === 'left' ? state.player2 : state.player1
    },

    // Vérifier si le match est terminé
    isMatchOver: (state) => {
      return (
        state.player1.score >= state.roundsToWin ||
        state.player2.score >= state.roundsToWin ||
        state.match.currentPass >= state.match.maxPasses ||
        state.match.winReason === 'unhorse' ||
        state.match.winReason === 'double_unhorse'
      )
    },
  },

  actions: {
    // Initialiser un nouveau jeu
    initGame(gameMode = 'singlePlayer', difficulty = 'normal') {
      this.gameMode = gameMode
      this.difficulty = difficulty
      this.isPlaying = false
      this.currentRound = 1
      this.winner = null
      this.gameOver = false

      // Réinitialiser les joueurs
      this.resetPlayers()
    },

    // Réinitialiser les joueurs pour un nouveau round
    resetPlayers() {
      // Joueur 1
      this.player1.position = 10
      this.player1.stamina = 100
      this.player1.state = 'standing'
      this.player1.isAttacking = false

      // Joueur 2
      this.player2.position = 90
      this.player2.stamina = 100
      this.player2.state = 'standing'
      this.player2.isAttacking = false

      // Annuler toute animation en cours
      if (this.animationId) {
        cancelAnimationFrame(this.animationId)
        this.animationId = null
      }
    },
    // Définir le chevalier du joueur
    setKnight(player, knight) {
      this[player].knight = knight

      // Ajuster les statistiques en fonction du chevalier choisi
      if (knight.name === 'Chevalier Rouge') {
        // Le chevalier rouge est plus robuste
        this[player].stamina = 120
      } else if (knight.name === 'Chevalier Bleu') {
        // Le chevalier bleu est plus rapide
        this[player].speed = 0.65
      }
    },

    setPlayer1Knight(knight) {
      this.player1.knight = knight
      if (knight.stats) {
        this.player1.stats = knight.stats
      }
      if (knight.horse) {
        this.player1.horse = knight.horse
      }
    },

    setPlayer2Knight(knight) {
      this.player2.knight = knight
      if (knight.stats) {
        this.player2.stats = knight.stats
      }
      if (knight.horse) {
        this.player2.horse = knight.horse
      }
    },

    // Démarrer un round
    startRound() {
      this.isPlaying = true
      this.winner = null

      // Mettre les joueurs en mouvement
      this.player1.state = 'gallop'
      this.player2.state = 'gallop'

      // Démarrer l'animation du jeu
      this.animateGame()
    },

    // Terminer un round avec un gagnant
    endRound(winner) {
      this.isPlaying = false
      this.winner = winner

      // Mettre à jour le score
      if (winner === 'player1') {
        this.player1.score++
      } else if (winner === 'player2') {
        this.player2.score++
      }

      // Vérifier si la partie est terminée
      if (this.player1.score >= this.roundsToWin || this.player2.score >= this.roundsToWin) {
        this.gameOver = true
      } else {
        // Passer au round suivant
        this.currentRound++
      }

      // Arrêter l'animation
      if (this.animationId) {
        cancelAnimationFrame(this.animationId)
        this.animationId = null
      }
    },

    // Animation principale du jeu
    animateGame() {
      // Si le jeu n'est pas en cours, ne rien faire
      if (!this.isPlaying) return

      // Mettre à jour les positions
      if (this.player1.state === 'gallop') {
        this.player1.position += this.player1.speed
        this.player1.stamina = Math.max(0, this.player1.stamina - 0.1)
      }

      if (this.player2.state === 'gallop') {
        this.player2.position -= this.player2.speed
        this.player2.stamina = Math.max(0, this.player2.stamina - 0.1)
      }

      // Vérifier les collisions
      if (this.arePlayersColliding && !this.winner) {
        this.handleCollision()
      }

      // Vérifier si un joueur a traversé tout le terrain
      if (this.player1.position >= 100) {
        this.endRound('player1')
        return
      } else if (this.player2.position <= 0) {
        this.endRound('player2')
        return
      }

      // Continuer l'animation
      this.animationId = requestAnimationFrame(() => this.animateGame())
    },

    // Gérer une collision entre les joueurs
    handleCollision() {
      // Si un joueur attaque et l'autre non, l'attaquant gagne
      if (this.player1.isAttacking && !this.player2.isAttacking) {
        this.endRound('player1')
      } else if (!this.player1.isAttacking && this.player2.isAttacking) {
        this.endRound('player2')
      } else if (this.player1.isAttacking && this.player2.isAttacking) {
        // Si les deux attaquent, comparer les statistiques
        const p1Force = this.player1.speed * 0.7 + this.player1.stamina * 0.3
        const p2Force = this.player2.speed * 0.7 + this.player2.stamina * 0.3

        if (p1Force > p2Force) {
          this.endRound('player1')
        } else if (p2Force > p1Force) {
          this.endRound('player2')
        } else {
          // Match nul - continuer
          this.player1.position -= 10
          this.player2.position += 10
        }
      } else {
        // Collision sans attaque - les deux reculent
        this.player1.position -= 5
        this.player2.position += 5
      }
    },

    // Actions des joueurs
    playerAttack(player) {
      if (this[player].stamina >= 20) {
        this[player].isAttacking = true
        this[player].state = 'attack'
        this[player].stamina -= 20

        // Réinitialiser après l'animation d'attaque
        setTimeout(() => {
          this[player].isAttacking = false
          if (this.isPlaying) this[player].state = 'gallop'
        }, 800)
      }
    },

    // Méthode pour l'IA
    aiTakeTurn() {
      if (!this.isPlaying || !this.isAgainstAI) return

      const settings = this.currentAiSettings
      const distance = Math.abs(this.player1.position - this.player2.position)

      // L'IA décide quoi faire en fonction de la distance et des paramètres
      setTimeout(() => {
        // Si le joueur 1 attaque et l'IA est assez précise, elle essaie d'éviter
        if (this.player1.isAttacking && Math.random() < settings.accuracy) {
          // Reculer pour éviter l'attaque
          this.player2.position += 5
        }
        // Sinon, elle décide d'attaquer à une distance optimale
        else if (distance < 30 && Math.random() < settings.aggression) {
          this.playerAttack('player2')
        }
      }, settings.reactionTime)
    },

    // Initialiser les stats pour un nouveau match
    initMatchStats(playerStats, playerTactics, difficulty) {
      this.match = { currentPass: 0, maxPasses: 5, player1Side: 'left', winReason: null }

      // Stats joueur 1
      if (playerStats) {
        Object.assign(this.player1, playerStats)
      }
      this.player1.endurance = 100
      this.player1.score = 0

      // Tactiques joueur 1
      if (playerTactics) {
        this.player1Tactics = { ...playerTactics }
      }

      // Stats IA
      const aiStats = generateAIStats(difficulty || this.difficulty)
      Object.assign(this.player2, aiStats)
      this.player2.score = 0

      this.passHistory = []
    },

    setGameMode(mode) {
      this.gameMode = mode
    },

    setPlayer1Tactics(tactics) {
      this.player1Tactics = tactics
    },

    setPlayer2Tactics(tactics) {
      this.player2Tactics = tactics
    },

    swapSides() {
      this.match.player1Side = this.match.player1Side === 'left' ? 'right' : 'left'
    },

    nextPass() {
      this.match.currentPass++
      this.swapSides()
    },

    reduceEndurance(player, amount) {
      const p = player === 1 ? this.player1 : this.player2
      p.endurance = Math.max(0, p.endurance - amount)
    },

    recoverEndurance(player, amount) {
      const p = player === 1 ? this.player1 : this.player2
      p.endurance = Math.min(100, p.endurance + amount)
    },

    setUnhorseWinner(winner) {
      this.winner = winner
      this.match.winReason = winner === 'draw' ? 'double_unhorse' : 'unhorse'
      this.gameOver = true
    },

    addPassToHistory(result) {
      this.passHistory.push({ pass: this.match.currentPass, ...result })
    },
  },
})
