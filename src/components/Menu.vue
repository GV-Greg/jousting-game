<script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useSettingsStore } from '@/stores/settingsStore';

  const router = useRouter();
  const settingsStore = useSettingsStore();
  const showOptions = ref(false);

  // Son d'ambiance et effets sonores
  const playSoundEffect = (soundName) => {
    if (settingsStore.soundEnabled) {
      const sound = new Audio(`/src/assets/sounds/${soundName}.mp3`);
      sound.volume = 0.6;
      sound.play();
    }
  };

  // Navigation vers les différentes pages
  const startGame = () => {
    playSoundEffect('button_click');
    router.push('/select');
  };

  const showRules = () => {
    playSoundEffect('page_turn');
    router.push('/rules');
  };

  const toggleOptions = () => {
    playSoundEffect('menu_open');
    showOptions.value = !showOptions.value;
  };

  // Chargement des paramètres quand le composant est monté
  onMounted(() => {
    settingsStore.loadSettings();

    // Effet sonore d'ambiance au chargement
    setTimeout(() => {
      playSoundEffect('home_ambient');
    }, 500);
  });
</script>

<template>
  <div class="flex flex-col gap-4 w-full max-w-[350px] z-10">
    <button @click="startGame" class="btn-medieval btn-medieval-primary">
      <v-icon name="gi-swordman" class="text-xl" /> Commencer
    </button>

    <button @click="showRules" class="btn-medieval btn-medieval-secondary">
      <v-icon name="gi-scroll-unfurled" class="text-xl" /> Règles
    </button>

    <button @click="toggleOptions" class="btn-medieval btn-medieval-tertiary">
      <v-icon name="gi-cog" class="text-xl" /> Options
    </button>
  </div>

 <!-- Panneau d'options -->
 <div v-if="showOptions" class="medieval-panel">
    <h2 class="medieval-title">
      Options
    </h2>

    <div class="flex justify-between items-center my-6">
      <label class="text-lg font-medieval">Sons</label>
      <button @click="settingsStore.toggleSound()" class="medieval-toggle" :class="{ 'active': settingsStore.soundEnabled }">
        {{ settingsStore.soundEnabled ? 'Activés' : 'Désactivés' }}
      </button>
    </div>

    <button @click="toggleOptions" class="medieval-toggle">
      Fermer
    </button>
  </div>
</template>



<style scoped>

</style>
