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
    <button @click="startGame"
      class="flex items-center justify-center gap-2 px-8 py-4 text-lg font-medieval text-white bg-red-900 border-2 border-red-700 transition duration-300 hover:translate-y-[-3px] hover:shadow-lg active:translate-y-0 active:shadow-md">
      <oh-vue-icon name="gi-swordman" class="text-xl" /> Commencer
    </button>

    <button @click="showRules"
      class="flex items-center justify-center gap-2 px-8 py-4 text-lg font-medieval text-white bg-amber-900 border-2 border-amber-800 transition duration-300 hover:translate-y-[-3px] hover:shadow-lg active:translate-y-0 active:shadow-md">
      <oh-vue-icon name="gi-scroll-unfurled" class="text-xl" /> Règles
    </button>

    <button @click="toggleOptions"
      class="flex items-center justify-center gap-2 px-8 py-4 text-lg font-medieval text-white bg-gray-700 border-2 border-gray-600 transition duration-300 hover:translate-y-[-3px] hover:shadow-lg active:translate-y-0 active:shadow-md">
      <oh-vue-icon name="gi-cog" class="text-xl" /> Options
    </button>
  </div>

 <!-- Panneau d'options -->
 <div v-if="showOptions" class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-gray-900 bg-opacity-90 border-2 border-red-800 rounded p-8 z-50 text-white">
    <h2 class="text-center text-xl text-yellow-400 border-b border-yellow-400 pb-2 mb-6 font-medieval">
      Options
    </h2>

    <div class="flex justify-between items-center my-6">
      <label class="text-lg">Sons</label>
      <button @click="settingsStore.toggleSound()" class="px-4 py-2 bg-gray-800 border border-gray-600 transition duration-200"
        :class="{ 'bg-red-800 border-red-700': settingsStore.soundEnabled }">
        {{ settingsStore.soundEnabled ? 'Activés' : 'Désactivés' }}
      </button>
    </div>

    <button @click="toggleOptions" class="w-full py-3 bg-gray-800 border border-gray-600 mt-4 hover:bg-gray-700 transition duration-200">
      Fermer
    </button>
  </div>
</template>



<style scoped>

</style>
