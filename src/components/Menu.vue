<script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useSettingsStore } from '@/stores/settingsStore';
  import MedButton from '@/components/Button.vue';

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
  <div class="flex flex-col gap-4 w-full max-w-[250px] z-10">
    <MedButton text="Commencer" color="gold" icon="gi-swordman" @click="startGame" className="w-full" />

    <MedButton text="Règles" color="red" icon="gi-scroll-unfurled" @click="showRules" className="w-full" />

    <MedButton text="Options" color="blue" icon="gi-cog" @click="toggleOptions" className="w-full" />
  </div>

 <!-- Panneau d'options -->
 <div v-if="showOptions" class="medieval-panel">
    <h2 class="medieval-title">
      Options
    </h2>

    <div class="flex justify-between items-center my-6">
      <label class="text-lg font-medieval">Sons</label>
      <MedButton :text="settingsStore.soundEnabled ? 'Activés' : 'Désactivés'" :color="settingsStore.soundEnabled ? 'success' : 'danger'" @click="settingsStore.toggleSound()" className="text-sm" />
    </div>

    <MedButton text="Fermer" color="info" @click="toggleOptions" className="mt-4" />
  </div>
</template>



<style scoped>

</style>
