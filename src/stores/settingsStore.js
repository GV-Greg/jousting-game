import { defineStore } from 'pinia';

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

    // Liste des chevaliers disponibles
    availableKnights: [
      {
        id: 'red',
        name: 'Chevalier Rouge',
        description: 'Puissant et robuste',
        image: '/src/assets/knight/knight_red.png',
        stats: {
          strength: 8,
          speed: 6,
          stamina: 9
        },
        special: 'Charge puissante'
      },
      {
        id: 'blue',
        name: 'Chevalier Bleu',
        description: 'Rapide et agile',
        image: '/src/assets/knight/knight_blue.png',
        stats: {
          strength: 6,
          speed: 9,
          stamina: 7
        },
        special: 'Esquive rapide'
      }
    ]
  }),

  getters: {
    // Récupérer un chevalier par son ID
    getKnightById: (state) => (id) => {
      return state.availableKnights.find(knight => knight.id === id);
    }
  },

  actions: {
    // Activer/désactiver le son
    toggleSound() {
      this.soundEnabled = !this.soundEnabled;
      this.saveSettings();
    },

    // Changer la langue
    setLanguage(lang) {
      this.language = lang;
      this.saveSettings();
    },

    // Activer/désactiver le mode plein écran
    toggleFullscreen() {
      this.fullscreen = !this.fullscreen;

      if (this.fullscreen) {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    },

    // Définir la difficulté par défaut
    setDefaultDifficulty(difficulty) {
      if (['easy', 'normal', 'hard'].includes(difficulty)) {
        this.defaultDifficulty = difficulty;
        this.saveSettings();
      }
    },

    // Sauvegarder les paramètres dans le localStorage
    saveSettings() {
      const settings = {
        soundEnabled: this.soundEnabled,
        language: this.language,
        defaultDifficulty: this.defaultDifficulty,
        defaultGameMode: this.defaultGameMode,
        showTutorial: this.showTutorial
      };

      localStorage.setItem('jousting-game-settings', JSON.stringify(settings));
    },

    // Charger les paramètres depuis le localStorage
    loadSettings() {
      const savedSettings = localStorage.getItem('jousting-game-settings');

      if (savedSettings) {
        const settings = JSON.parse(savedSettings);

        // Mettre à jour l'état avec les paramètres sauvegardés
        this.soundEnabled = settings.soundEnabled ?? true;
        this.language = settings.language ?? 'fr';
        this.defaultDifficulty = settings.defaultDifficulty ?? 'normal';
        this.defaultGameMode = settings.defaultGameMode ?? 'singlePlayer';
        this.showTutorial = settings.showTutorial ?? true;
      }
    }
  }
});
