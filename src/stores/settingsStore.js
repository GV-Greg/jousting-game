import { defineStore } from 'pinia'

// Importer les images correctement pour Vite
const knightRedImage = new URL('@/assets/knight/knight_red.png', import.meta.url).href
const knightBlueImage = new URL('@/assets/knight/knight_blue.png', import.meta.url).href

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    // Préférences de jeu
    soundEnabled: true,
    fullscreen: false,

    // UI settings
    language: 'fr',
    showTutorial: true,

    // Configuration de difficulté par défaut
    defaultDifficulty: 'normal',
    defaultGameMode: 'singlePlayer',

    // Stats du joueur (nouvelles)
    playerStats: {
      force: 150,
      intelligence: 130,
      charisme: 120,
      horse: {
        experience: 10,
        vitesse: 140,
        endurance: 100,
      },
    },

    // Tactiques par défaut du joueur (nouvelles)
    playerTactics: {
      style: 'moyenne', // 'haute', 'moyenne', 'basse'
      posture: 'equilibree', // 'offensive', 'equilibree', 'defensive'
      allure: 'moderee', // 'rapide', 'moderee', 'lente'
    },

    // Liste des chevaliers disponibles
    availableKnights: [
      {
        id: 'red',
        name: 'Chevalier Rouge',
        description: 'Puissant et robuste',
        image: knightRedImage,
        stats: {
          strength: 8,
          speed: 6,
          stamina: 9,
        },
        special: 'Charge puissante',
      },
      {
        id: 'blue',
        name: 'Chevalier Bleu',
        description: 'Rapide et agile',
        image: knightBlueImage,
        stats: {
          strength: 6,
          speed: 9,
          stamina: 7,
        },
        special: 'Esquive rapide',
      },
    ],
  }),

  getters: {
    // Récupérer un chevalier par son ID
    getKnightById: (state) => (id) => {
      return state.availableKnights.find((knight) => knight.id === id)
    },
  },

  actions: {
    // Activer/désactiver le son
    toggleSound() {
      this.soundEnabled = !this.soundEnabled
      this.saveSettings()
    },

    // Changer la langue
    setLanguage(lang) {
      this.language = lang
      this.saveSettings()
    },

    // Activer/désactiver le mode plein écran
    toggleFullscreen() {
      this.fullscreen = !this.fullscreen

      if (this.fullscreen) {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen()
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        }
      }
    },

    // Définir la difficulté par défaut
    setDefaultDifficulty(difficulty) {
      if (['easy', 'normal', 'hard'].includes(difficulty)) {
        this.defaultDifficulty = difficulty
        this.saveSettings()
      }
    },

    // Définir les stats du joueur
    setPlayerStats(stats) {
      this.playerStats = { ...this.playerStats, ...stats }
      this.saveSettings()
    },

    // Définir les tactiques du joueur
    setPlayerTactics(tactics) {
      this.playerTactics = { ...this.playerTactics, ...tactics }
      this.saveSettings()
    },

    // Sauvegarder les paramètres dans le localStorage
    saveSettings() {
      const settings = {
        soundEnabled: this.soundEnabled,
        language: this.language,
        defaultDifficulty: this.defaultDifficulty,
        defaultGameMode: this.defaultGameMode,
        showTutorial: this.showTutorial,
        playerStats: this.playerStats,
        playerTactics: this.playerTactics,
      }

      localStorage.setItem('jousting-game-settings', JSON.stringify(settings))
    },

    // Charger les paramètres depuis le localStorage
    loadSettings() {
      const savedSettings = localStorage.getItem('jousting-game-settings')

      if (savedSettings) {
        const settings = JSON.parse(savedSettings)

        // Mettre à jour l'état avec les paramètres sauvegardés
        this.soundEnabled = settings.soundEnabled ?? true
        this.language = settings.language ?? 'fr'
        this.defaultDifficulty = settings.defaultDifficulty ?? 'normal'
        this.defaultGameMode = settings.defaultGameMode ?? 'singlePlayer'
        this.showTutorial = settings.showTutorial ?? true

        // Charger les nouvelles options
        this.playerStats = settings.playerStats ?? this.playerStats
        this.playerTactics = settings.playerTactics ?? this.playerTactics
      }
    },
  },
})
