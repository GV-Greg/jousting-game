<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settingsStore'
import BaseButton from '@/components/BaseButton.vue'
import arenaBackground from '@/assets/arena-bg.png'

const router = useRouter()
const settingsStore = useSettingsStore()

const soundEnabled = ref(settingsStore.soundEnabled)
const musicEnabled = ref(settingsStore.musicEnabled)
const difficulty = ref(settingsStore.defaultDifficulty)

const difficulties = [
  { value: 'easy', label: 'Facile' },
  { value: 'normal', label: 'Normal' },
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
    class="min-h-screen flex flex-col items-center justify-center p-4 relative bg-cover bg-center"
    :style="{ backgroundImage: `url(${arenaBackground})` }"
  >
    <div class="absolute inset-0 bg-black/80 z-0"></div>
    <div class="relative z-10 p-8 rounded-xl max-w-md w-full" style="background: rgba(15,8,2,0.85); border: 1px solid rgba(146,64,14,0.5); border-top: 2px solid rgba(217,119,6,0.4);">
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

