<script setup>
  import { useRouter } from 'vue-router';
  import { ref, onMounted } from 'vue';
  import { useGameStore } from '@/stores/gameStore';
  import { useSettingsStore } from '@/stores/settingsStore';
  import Button from '@/components/Button.vue';
  import Icon from '@/components/Icon.vue';

  const router = useRouter();
  const gameStore = useGameStore();
  const settingsStore = useSettingsStore();
  const selectedKnight = ref(null);
  const errorMessage = ref('');

  // Récupérer la liste des chevaliers disponibles depuis le store des paramètres
  const knights = settingsStore.availableKnights;

  // Fonction pour jouer un effet sonore
  const playSoundEffect = (soundName) => {
    if (settingsStore.soundEnabled) {
      // Cette fonction est simulée car les sons ne sont pas encore implémentés
      console.log(`Son joué: ${soundName}`);
      // Ici on pourrait avoir: const sound = new Audio(`/src/assets/sounds/${soundName}.mp3`);
    }
  };

  // Sélectionner un chevalier
  const selectKnight = (knight) => {
    selectedKnight.value = knight;
    errorMessage.value = '';
    playSoundEffect('select');
  };

  // Démarrer la partie avec le chevalier choisi
  const startGame = () => {
    if (selectedKnight.value) {
      playSoundEffect('confirm');
      // Définir le chevalier pour le joueur 1
      gameStore.setKnight('player1', selectedKnight.value);

      // Si mode solo, sélectionner automatiquement un chevalier pour l'IA
      if (gameStore.gameMode === 'singlePlayer') {
        // Choisir l'autre chevalier pour l'IA
        const aiKnight = knights.find(k => k.id !== selectedKnight.value.id);
        if (aiKnight) {
          gameStore.setKnight('player2', aiKnight);
        }
      }

      router.push('/game');
    } else {
      errorMessage.value = 'Veuillez sélectionner un chevalier avant de commencer !';
      playSoundEffect('error');
      setTimeout(() => {
        errorMessage.value = '';
      }, 3000);
    }
  };

  // Retourner à l'écran d'accueil
  const returnToHome = () => {
    playSoundEffect('back');
    router.push('/');
  };

  onMounted(() => {
    // Jouer un son d'ambiance au chargement
    playSoundEffect('selection_ambient');
  });
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center text-white p-4">
    <h1 class="text-4xl font-medieval mb-8 text-yellow-400">Choisis ton chevalier</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
      <div v-for="knight in knights" :key="knight.id" @click="selectKnight(knight)"
        class="knight-card"
        :class="[selectedKnight?.id === knight.id ? `border-${knight.id}-500 shadow-lg shadow-${knight.id}-500/50` : 'border-gray-700']" >
        <div class="relative">
          <img :src="knight.image" :alt="knight.name" class="w-32 h-32 mx-auto mb-4 rounded-xl" />
          <Icon v-if="selectedKnight?.id === knight.id" name="hi-check" className="absolute top-0 right-0 text-green-500" scale="1.5" />
        </div>
        <h2 class="text-xl font-semibold text-center">{{ knight.name }}</h2>
        <p class="text-center text-gray-400 mb-4">{{ knight.description }}</p>

        <div class="stats grid grid-cols-3 gap-2 mb-4">
          <div class="stat flex flex-col items-center">
            <span class="text-xs uppercase">Force</span>
            <div class="flex mt-1">
              <span v-for="n in 10" :key="n" class="w-1.5 h-4 mx-0.5 rounded-sm"
                :class="n <= knight.stats.strength ? 'bg-red-500' : 'bg-gray-600'"></span>
            </div>
          </div>
          <div class="stat flex flex-col items-center">
            <span class="text-xs uppercase">Vitesse</span>
            <div class="flex mt-1">
              <span v-for="n in 10" :key="n" class="w-1.5 h-4 mx-0.5 rounded-sm"
                :class="n <= knight.stats.speed ? 'bg-blue-500' : 'bg-gray-600'"></span>
            </div>
          </div>
          <div class="stat flex flex-col items-center">
            <span class="text-xs uppercase">Endurance</span>
            <div class="flex mt-1">
              <span v-for="n in 10" :key="n" class="w-1.5 h-4 mx-0.5 rounded-sm"
                :class="n <= knight.stats.stamina ? 'bg-green-500' : 'bg-gray-600'"></span>
            </div>
          </div>
        </div>

        <div class="special-ability bg-gray-700 p-2 rounded text-center text-sm">
          <span class="text-yellow-300">Capacité spéciale:</span> {{ knight.special }}
        </div>
      </div>
    </div>

    <!-- Message d'erreur avec animation -->
    <div class="h-8 my-4">
      <p v-if="errorMessage" class="text-red-500 font-semibold animated-error">
        <Icon name="hi-x" scale="1.2" className="text-red-500 mr-2" />
        {{ errorMessage }}
      </p>
    </div>

    <div class="flex flex-col sm:flex-row gap-4 mt-4">
      <Button @click="returnToHome" text="Retour" color="blue" icon="bi-arrow-left" />
      <Button @click="startGame" text="Commencer la joute" color="gold" icon="gi-swordman" />
    </div>
  </div>
</template>

<style scoped>

</style>
