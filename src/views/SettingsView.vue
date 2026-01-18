<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settingsStore'
import BaseButton from '@/components/BaseButton.vue'

const router = useRouter()
const settingsStore = useSettingsStore()

const soundEnabled = ref(settingsStore.soundEnabled)
const musicEnabled = ref(settingsStore.musicEnabled)
const difficulty = ref(settingsStore.defaultDifficulty)

const difficulties = [
  { value: 'easy', label: 'Facile' },
  { value: 'medium', label: 'Normal' },
  { value: 'hard', label: 'Difficile' },
]

const saveSettings = () => {
  settingsStore.setSoundEnabled(soundEnabled.value)
  settingsStore.setMusicEnabled(musicEnabled.value)
  settingsStore.setDefaultDifficulty(difficulty.value)
  router.push('/')
}

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4"
  >
    <div class="bg-gray-800 p-8 rounded-lg border-2 border-amber-700 max-w-md w-full">
      <h1 class="text-3xl font-medieval text-amber-400 text-center mb-8">Paramètres</h1>

      <!-- Son -->
      <div class="mb-6">
        <label class="flex items-center justify-between text-white">
          <span class="font-medieval">Sons</span>
          <input v-model="soundEnabled" type="checkbox" class="w-6 h-6 accent-amber-500" />
        </label>
      </div>

      <!-- Musique -->
      <div class="mb-6">
        <label class="flex items-center justify-between text-white">
          <span class="font-medieval">Musique</span>
          <input v-model="musicEnabled" type="checkbox" class="w-6 h-6 accent-amber-500" />
        </label>
      </div>

      <!-- Difficulté -->
      <div class="mb-8">
        <label class="block text-white font-medieval mb-2">Difficulté</label>
        <select
          v-model="difficulty"
          class="w-full p-2 bg-gray-700 text-white rounded border border-amber-600 focus:border-amber-400"
        >
          <option v-for="d in difficulties" :key="d.value" :value="d.value">
            {{ d.label }}
          </option>
        </select>
      </div>

      <!-- Boutons -->
      <div class="flex justify-center gap-4">
        <BaseButton @click="saveSettings" text="Sauvegarder" color="gold" />
        <BaseButton @click="goBack" text="Retour" color="red" />
      </div>
    </div>
  </div>
</template>
