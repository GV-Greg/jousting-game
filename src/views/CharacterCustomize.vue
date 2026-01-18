<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import { useSettingsStore } from '@/stores/settingsStore'
import BaseButton from '@/components/BaseButton.vue'
import ToastNotification from '@/components/ToastNotification.vue'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const gameStore = useGameStore()
const settingsStore = useSettingsStore()
const { toastState, error, warning, success, hideToast } = useToast()

// Vérifier qu'un chevalier a été sélectionné
if (!gameStore.player1.knight) {
  router.push('/select')
}

const selectedKnight = computed(() => gameStore.player1.knight)

// Stats du joueur
const playerStats = reactive({
  force: selectedKnight.value?.baseStats?.force || 150,
  intelligence: selectedKnight.value?.baseStats?.intelligence || 150,
  charisme: selectedKnight.value?.baseStats?.charisme || 150,
})

const playerHorse = reactive({
  experience: selectedKnight.value?.baseHorse?.experience || 30,
  speed: selectedKnight.value?.baseHorse?.speed || 170,
  endurance: selectedKnight.value?.baseHorse?.endurance || 180,
})

// Points disponibles
const totalStatPoints = 450
const totalHorsePoints = 380

const usedStatPoints = computed(
  () => playerStats.force + playerStats.intelligence + playerStats.charisme,
)
const usedHorsePoints = computed(
  () => playerHorse.experience + playerHorse.speed + playerHorse.endurance,
)

const remainingStatPoints = computed(() => totalStatPoints - usedStatPoints.value)
const remainingHorsePoints = computed(() => totalHorsePoints - usedHorsePoints.value)

const hasError = computed(() => remainingStatPoints.value < 0 || remainingHorsePoints.value < 0)

// Watcher pour afficher le toast quand les points deviennent négatifs
watch(remainingStatPoints, (newVal, oldVal) => {
  if (newVal < 0 && oldVal >= 0) {
    warning('Points du chevalier dépassés !')
  }
})

watch(remainingHorsePoints, (newVal, oldVal) => {
  if (newVal < 0 && oldVal >= 0) {
    warning('Points du destrier dépassés !')
  }
})

// Démarrer le jeu
const startGame = () => {
  if (remainingStatPoints.value < 0) {
    error(`Trop de points pour le chevalier ! (${Math.abs(remainingStatPoints.value)} en excès)`)
    return
  }
  if (remainingHorsePoints.value < 0) {
    error(`Trop de points pour le destrier ! (${Math.abs(remainingHorsePoints.value)} en excès)`)
    return
  }

  // Sauvegarder les stats
  settingsStore.setPlayerStats({
    ...playerStats,
    horse: { ...playerHorse },
  })

  // Mettre à jour le chevalier du joueur
  gameStore.setPlayer1Knight({
    ...selectedKnight.value,
    stats: { ...playerStats },
    horse: { ...playerHorse },
  })

  success('Que la joute commence !')

  setTimeout(() => {
    router.push('/game')
  }, 500)
}

const goBack = () => {
  router.push('/select')
}

// Config des stats
const statConfig = {
  force: { label: 'Force', icon: '⚔️', color: 'red', description: 'Puissance des coups' },
  intelligence: {
    label: 'Intelligence',
    icon: '🧠',
    color: 'blue',
    description: 'Tactique et précision',
  },
  charisme: { label: 'Charisme', icon: '👑', color: 'purple', description: 'Moral et résistance' },
}

const horseConfig = {
  experience: {
    label: 'Expérience',
    icon: '🏇',
    color: 'amber',
    description: 'Stabilité en combat',
  },
  speed: { label: 'Vitesse', icon: '⚡', color: 'green', description: 'Rapidité de charge' },
  endurance: {
    label: 'Endurance',
    icon: '💪',
    color: 'cyan',
    description: 'Résistance à la fatigue',
  },
}

const getSliderAccent = (color) =>
  ({
    red: 'accent-red-500',
    blue: 'accent-blue-500',
    purple: 'accent-purple-500',
    amber: 'accent-amber-500',
    green: 'accent-green-500',
    cyan: 'accent-cyan-500',
  })[color] || 'accent-gray-500'
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center p-6"
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
      <h1 class="text-4xl font-medieval text-amber-400 mb-2">Personnalisation</h1>
      <p class="text-gray-400">Ajustez les attributs de votre champion</p>
    </div>

    <!-- Info chevalier sélectionné -->
    <div v-if="selectedKnight" class="mb-6 text-center">
      <span
        class="text-2xl font-medieval"
        :class="selectedKnight.color === 'red' ? 'text-red-400' : 'text-blue-400'"
      >
        {{ selectedKnight.name }}
      </span>
    </div>

    <!-- Stats du chevalier -->
    <div class="bg-gray-800/80 p-6 rounded-2xl border-2 border-amber-700/50 mb-6 w-full max-w-2xl">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl text-gray-300 flex items-center gap-2">
          <span>🛡️</span> Attributs du Chevalier
        </h2>
        <span
          class="text-sm px-3 py-1 rounded font-bold"
          :class="
            remainingStatPoints >= 0
              ? 'bg-green-900/50 text-green-400'
              : 'bg-red-900/50 text-red-400 animate-pulse'
          "
        >
          {{ remainingStatPoints }} pts restants
        </span>
      </div>

      <div class="space-y-5">
        <div v-for="(config, stat) in statConfig" :key="stat" class="flex items-center gap-4">
          <span class="text-2xl w-10">{{ config.icon }}</span>
          <div class="w-28">
            <div class="text-gray-300">{{ config.label }}</div>
            <div class="text-gray-500 text-xs">{{ config.description }}</div>
          </div>
          <input
            type="range"
            v-model.number="playerStats[stat]"
            min="50"
            max="250"
            class="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-gray-700"
            :class="getSliderAccent(config.color)"
          />
          <span class="text-white font-bold w-14 text-center text-lg">{{ playerStats[stat] }}</span>
        </div>
      </div>
    </div>

    <!-- Stats du cheval -->
    <div class="bg-gray-800/80 p-6 rounded-2xl border-2 border-amber-700/50 mb-6 w-full max-w-2xl">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl text-gray-300 flex items-center gap-2">
          <span>🐴</span> Attributs du Destrier
        </h2>
        <span
          class="text-sm px-3 py-1 rounded font-bold"
          :class="
            remainingHorsePoints >= 0
              ? 'bg-green-900/50 text-green-400'
              : 'bg-red-900/50 text-red-400 animate-pulse'
          "
        >
          {{ remainingHorsePoints }} pts restants
        </span>
      </div>

      <div class="space-y-5">
        <div v-for="(config, stat) in horseConfig" :key="stat" class="flex items-center gap-4">
          <span class="text-2xl w-10">{{ config.icon }}</span>
          <div class="w-28">
            <div class="text-gray-300">{{ config.label }}</div>
            <div class="text-gray-500 text-xs">{{ config.description }}</div>
          </div>
          <input
            type="range"
            v-model.number="playerHorse[stat]"
            :min="stat === 'experience' ? 0 : 80"
            :max="stat === 'experience' ? 100 : 250"
            class="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-gray-700"
            :class="getSliderAccent(config.color)"
          />
          <span class="text-white font-bold w-14 text-center text-lg">{{ playerHorse[stat] }}</span>
        </div>
      </div>
    </div>

    <!-- Boutons -->
    <div class="flex gap-4">
      <BaseButton @click="startGame" text="En Lice !" color="gold" icon="gi-swordman" />
      <BaseButton @click="goBack" text="Retour" color="red" icon="bi-arrow-left" />
    </div>
  </div>
</template>

<style scoped>
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}
</style>
