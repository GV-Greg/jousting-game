<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import { useSettingsStore } from '@/stores/settingsStore'
import BaseButton from '@/components/BaseButton.vue'
import ToastNotification from '@/components/ToastNotification.vue'
import { useToast } from '@/composables/useToast'

// Images des chevaliers
import knightRed from '@/assets/knight/knight_red.png'
import knightBlue from '@/assets/knight/knight_blue.png'

const router = useRouter()
const gameStore = useGameStore()
const settingsStore = useSettingsStore()
const { toastState, warning, hideToast } = useToast()

// Chevaliers disponibles
const knights = [
  {
    id: 'red',
    name: 'Chevalier Rouge',
    color: 'red',
    image: knightRed,
    baseStats: { force: 180, intelligence: 120, charisme: 150 },
    baseHorse: { experience: 40, speed: 160, endurance: 170 },
  },
  {
    id: 'blue',
    name: 'Chevalier Bleu',
    color: 'blue',
    image: knightBlue,
    baseStats: { force: 140, intelligence: 190, charisme: 160 },
    baseHorse: { experience: 50, speed: 180, endurance: 160 },
  },
]

// Difficulté avec couleur pour l'IA
const selectedDifficulty = ref(null)
const difficulties = [
  { value: 'easy', label: 'Écuyer', color: 'green', aiColor: 'green' },
  { value: 'medium', label: 'Chevalier', color: 'yellow', aiColor: 'yellow' },
  { value: 'hard', label: 'Champion', color: 'purple', aiColor: 'purple' },
]

// Chevalier sélectionné
const selectedKnight = ref(null)

// Sélectionner un chevalier
const selectKnight = (knight) => {
  selectedKnight.value = knight
}

// Démarrer - rediriger vers la personnalisation
const startGame = () => {
  if (!selectedKnight.value) {
    warning('Veuillez sélectionner un chevalier !')
    return
  }
  if (!selectedDifficulty.value) {
    warning('Veuillez sélectionner un niveau de difficulté !')
    return
  }

  settingsStore.setDefaultDifficulty(selectedDifficulty.value)

  gameStore.setPlayer1Knight({ ...selectedKnight.value })

  // Trouver la difficulté sélectionnée pour récupérer la couleur IA
  const selectedDiff = difficulties.find((d) => d.value === selectedDifficulty.value)

  const aiProfile = settingsStore.aiProfiles?.[selectedDifficulty.value] || {
    stats: { force: 150, intelligence: 150, charisme: 150 },
    horse: { experience: 30, speed: 170, endurance: 180 },
  }

  // L'IA a un nom et une couleur selon la difficulté
  const aiNames = {
    easy: 'Écuyer Novice',
    medium: 'Chevalier Errant',
    hard: 'Champion du Roi',
  }

  gameStore.setPlayer2Knight({
    id: 'ai',
    name: aiNames[selectedDifficulty.value] || 'IA',
    color: selectedDiff?.aiColor || 'gray',
    stats: { ...aiProfile.stats },
    horse: { ...aiProfile.horse },
  })

  gameStore.setGameMode('singlePlayer')
  router.push('/customize')
}

const goBack = () => {
  router.push('/')
}

// Config des stats
const statConfig = {
  force: { label: 'Force', icon: '⚔️', color: 'red' },
  intelligence: { label: 'Intelligence', icon: '🧠', color: 'blue' },
  charisme: { label: 'Charisme', icon: '👑', color: 'purple' },
}

const horseConfig = {
  experience: { label: 'Expérience', icon: '🏇', color: 'amber' },
  speed: { label: 'Vitesse', icon: '⚡', color: 'green' },
  endurance: { label: 'Endurance', icon: '💪', color: 'cyan' },
}

const getBarColor = (color) =>
  ({
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    amber: 'bg-amber-500',
    green: 'bg-green-500',
    cyan: 'bg-cyan-500',
  })[color] || 'bg-gray-500'
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center p-4 overflow-y-auto"
  >
    <!-- Toast -->
    <ToastNotification
      :show="toastState.show"
      :message="toastState.message"
      :type="toastState.type"
      :duration="toastState.duration"
      @close="hideToast"
    />

    <!-- Titre -->
    <div class="text-center mb-6">
      <h1 class="text-4xl font-medieval text-amber-400 mb-2">Choisissez votre Champion</h1>
      <p class="text-gray-400">Sélectionnez votre chevalier</p>
    </div>

    <!-- Sélection de la difficulté -->
    <div class="mb-6 bg-gray-800/50 p-4 rounded-xl border border-gray-700">
      <h2 class="text-lg text-amber-300 text-center mb-3 font-medieval">Niveau de l'Adversaire</h2>
      <div class="flex gap-3">
        <button
          v-for="diff in difficulties"
          :key="diff.value"
          class="px-5 py-2 rounded-lg border-2 transition-all font-bold min-w-[100px]"
          :class="
            selectedDifficulty === diff.value
              ? `bg-${diff.color}-600/80 border-${diff.color}-400 text-white shadow-lg`
              : 'border-gray-600 text-gray-400 hover:border-gray-500 hover:bg-gray-700/50'
          "
          @click="selectedDifficulty = diff.value"
        >
          {{ diff.label }}
        </button>
      </div>
    </div>

    <!-- Cartes des chevaliers -->
    <div class="flex gap-6 mb-6">
      <div
        v-for="knight in knights"
        :key="knight.id"
        class="relative w-72 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105"
        :class="[
          selectedKnight?.id === knight.id
            ? knight.color === 'red'
              ? 'ring-4 ring-red-400 shadow-2xl shadow-red-500/40'
              : 'ring-4 ring-blue-400 shadow-2xl shadow-blue-500/40'
            : 'ring-2 ring-gray-600 hover:ring-gray-500',
        ]"
        @click="selectKnight(knight)"
      >
        <!-- Header avec image -->
        <div
          class="h-40 flex items-center justify-center p-4"
          :class="
            knight.color === 'red'
              ? 'bg-gradient-to-b from-red-800 via-red-700 to-red-900'
              : 'bg-gradient-to-b from-blue-800 via-blue-700 to-blue-900'
          "
        >
          <div
            v-if="selectedKnight?.id === knight.id"
            class="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl shadow-lg animate-pulse"
            :class="knight.color === 'red' ? 'bg-red-500' : 'bg-blue-500'"
          >
            ✓
          </div>
          <img
            :src="knight.image"
            :alt="knight.name"
            class="h-full object-contain drop-shadow-lg"
          />
        </div>

        <!-- Corps de la carte -->
        <div class="bg-gray-800 p-4">
          <h3
            class="text-xl font-medieval text-center mb-4"
            :class="knight.color === 'red' ? 'text-red-400' : 'text-blue-400'"
          >
            {{ knight.name }}
          </h3>

          <!-- Stats de base -->
          <div class="space-y-2">
            <div
              v-for="(value, stat) in knight.baseStats"
              :key="stat"
              class="flex items-center gap-2"
            >
              <span class="text-lg w-6">{{ statConfig[stat].icon }}</span>
              <span class="text-gray-400 text-xs w-20">{{ statConfig[stat].label }}</span>
              <div class="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  class="h-full transition-all"
                  :class="getBarColor(statConfig[stat].color)"
                  :style="{ width: `${(value / 250) * 100}%` }"
                ></div>
              </div>
              <span class="text-gray-300 text-xs w-8 text-right">{{ value }}</span>
            </div>
          </div>

          <div class="my-3 border-t border-gray-700"></div>

          <!-- Stats du cheval -->
          <div class="space-y-2">
            <div
              v-for="(value, stat) in knight.baseHorse"
              :key="stat"
              class="flex items-center gap-2"
            >
              <span class="text-lg w-6">{{ horseConfig[stat].icon }}</span>
              <span class="text-gray-400 text-xs w-20">{{ horseConfig[stat].label }}</span>
              <div class="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  class="h-full transition-all"
                  :class="getBarColor(horseConfig[stat].color)"
                  :style="{ width: `${(value / 250) * 100}%` }"
                ></div>
              </div>
              <span class="text-gray-300 text-xs w-8 text-right">{{ value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Boutons -->
    <div class="flex gap-4">
      <BaseButton
        :disabled="!selectedKnight"
        @click="startGame"
        text="Personnaliser"
        color="gold"
        icon="gi-swordman"
      />
      <BaseButton @click="goBack" text="Retour" color="red" icon="bi-arrow-left" />
    </div>
  </div>
</template>

<style scoped>
.bg-green-600\/80 {
  background-color: rgba(22, 163, 74, 0.8);
}
.border-green-400 {
  border-color: rgb(74, 222, 128);
}
.bg-yellow-600\/80 {
  background-color: rgba(202, 138, 4, 0.8);
}
.border-yellow-400 {
  border-color: rgb(250, 204, 21);
}
.bg-purple-600\/80 {
  background-color: rgba(147, 51, 234, 0.8);
}
.border-purple-400 {
  border-color: rgb(192, 132, 252);
}
.bg-red-600\/80 {
  background-color: rgba(220, 38, 38, 0.8);
}
.border-red-400 {
  border-color: rgb(248, 113, 113);
}
</style>
