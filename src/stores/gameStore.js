import { defineStore } from 'pinia';

export const useGameStore = defineStore('game', {
  state: () => ({
    selectedKnight: null,
    isAttacking: false,
  }),
  actions: {
    startGame() {
      this.isAttacking = true;
    },
    resetGame() {
      this.isAttacking = false;
    },
    setKnight(knight) {
      this.selectedKnight = knight;
    },
  },
});
