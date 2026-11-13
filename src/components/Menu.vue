<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settingsStore'
import MedButton from '@/components/BaseButton.vue'

const router = useRouter()
const settingsStore = useSettingsStore()
const showOptions = ref(false)

// Son d'ambiance et effets sonores
const playSoundEffect = (soundName) => {
  if (settingsStore.soundEnabled) {
    const sound = new Audio(`/src/assets/sounds/${soundName}.mp3`)
    sound.volume = 0.6
    sound.play()
  }
}

// Navigation vers les différentes pages
const startGame = () => {
  playSoundEffect('button_click')
  router.push('/select')
}

const showRules = () => {
  playSoundEffect('page_turn')
  router.push('/rules')
}

const toggleOptions = () => {
  playSoundEffect('menu_open')
  showOptions.value = !showOptions.value
}

// Chargement des paramètres quand le composant est monté
onMounted(() => {
  settingsStore.loadSettings()

  // Effet sonore d'ambiance au chargement
  setTimeout(() => {
    playSoundEffect('home_ambient')
  }, 500)
})
</script>

<template>
  <div class="flex flex-col gap-4 w-full max-w-[250px] z-10">
    <MedButton
      text="Commencer"
      color="gold"
      icon="gi-swordman"
      @click="startGame"
      className="w-full"
    />

    <MedButton
      text="Règles"
      color="red"
      icon="gi-scroll-unfurled"
      @click="showRules"
      className="w-full"
    />

    <MedButton
      text="Options"
      color="blue"
      icon="gi-cog"
      @click="toggleOptions"
      className="w-full"
    />
  </div>

  <!-- Voile de fond -->
  <div v-if="showOptions" class="fixed inset-0 z-20 bg-black/70" @click="toggleOptions"></div>

  <!-- Panneau d'options -->
  <div
    v-if="showOptions"
    class="fixed z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-xs w-full"
    style="
      background: radial-gradient(ellipse at 50% 0%, rgba(45,18,2,0.98) 0%, rgba(12,4,1,0.995) 100%);
      box-shadow:
        0 0 0 2px rgba(192,156,39,0.85),
        0 0 0 5px rgba(5,2,0,0.98),
        0 0 0 7px rgba(192,156,39,0.45),
        0 0 0 9px rgba(0,0,0,0.65),
        0 40px 100px rgba(0,0,0,0.98);
    "
  >
    <!-- Coins ornementaux -->
    <div class="absolute pointer-events-none" style="top: 8px; left: 8px; width: 24px; height: 24px; border-top: 2px solid rgba(192,156,39,0.9); border-left: 2px solid rgba(192,156,39,0.9);"></div>
    <div class="absolute pointer-events-none" style="top: 8px; right: 8px; width: 24px; height: 24px; border-top: 2px solid rgba(192,156,39,0.9); border-right: 2px solid rgba(192,156,39,0.9);"></div>
    <div class="absolute pointer-events-none" style="bottom: 8px; left: 8px; width: 24px; height: 24px; border-bottom: 2px solid rgba(192,156,39,0.9); border-left: 2px solid rgba(192,156,39,0.9);"></div>
    <div class="absolute pointer-events-none" style="bottom: 8px; right: 8px; width: 24px; height: 24px; border-bottom: 2px solid rgba(192,156,39,0.9); border-right: 2px solid rgba(192,156,39,0.9);"></div>

    <div class="p-7">
      <div class="text-center mb-5">
        <div class="flex items-center gap-2 mb-2">
          <div style="flex: 1; height: 1px; background: linear-gradient(to right, transparent, rgba(192,156,39,0.55));"></div>
          <span style="color: rgba(192,156,39,0.65); font-size: 11px;">✦</span>
          <div style="flex: 1; height: 1px; background: linear-gradient(to left, transparent, rgba(192,156,39,0.55));"></div>
        </div>
        <h2 class="font-medieval text-2xl text-amber-400">Options</h2>
        <div class="flex items-center gap-2 mt-2 pb-4" style="border-bottom: 1px solid rgba(192,156,39,0.15);">
          <div style="flex: 1; height: 1px; background: linear-gradient(to right, transparent, rgba(192,156,39,0.3));"></div>
          <span style="color: rgba(192,156,39,0.4); font-size: 11px;">⚜</span>
          <div style="flex: 1; height: 1px; background: linear-gradient(to left, transparent, rgba(192,156,39,0.3));"></div>
        </div>
      </div>

      <div class="flex justify-between items-center mb-4 py-2" style="border-bottom: 1px solid rgba(146,64,14,0.2);">
        <span class="font-medieval text-parchment">Sons</span>
        <MedButton
          :text="settingsStore.soundEnabled ? 'Activés' : 'Désactivés'"
          :color="settingsStore.soundEnabled ? 'gold' : 'red'"
          @click="settingsStore.toggleSound()"
        />
      </div>

      <div class="flex justify-center mt-5">
        <MedButton text="Fermer" color="blue" @click="toggleOptions" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
