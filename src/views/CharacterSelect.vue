<script setup>
  import { useRouter } from 'vue-router';
  import { ref } from 'vue';
  import { useGameStore } from '@/stores/gameStore';

  const router = useRouter();
  const gameStore = useGameStore();
  const selectedKnight = ref(null);
  const errorMessage = ref('');

  const knights = [
    {
      name: 'Chevalier Rouge',
      description: 'Puissant et robuste',
      image: new URL('@/assets/knight/knight_red.png', import.meta.url).href,
      borderColor: 'border-red-500',
    },
    {
      name: 'Chevalier Bleu',
      description: 'Rapide et agile',
      image: new URL('@/assets/knight/knight_blue.png', import.meta.url).href,
      borderColor: 'border-blue-500',
    },
  ];

  // Sélectionner un chevalier
  const selectKnight = (knight) => {
    selectedKnight.value = knight;
    errorMessage.value = '';
  };

  // Démarrer la partie avec le chevalier choisi
  const startGame = () => {
    if (selectedKnight.value) {
      gameStore.setKnight(selectedKnight.value);
      router.push('/game');
    } else {
      errorMessage.value = 'Veuillez sélectionner un chevalier avant de commencer !';
      setTimeout(() => {
        errorMessage.value = '';
      }, 3000);
    }
  };
</script>

<template>
  <div class="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
    <h1 class="text-4xl font-bold mb-8">Choisis ton chevalier</h1>

    <div class="grid grid-cols-2 gap-8">
      <div v-for="(knight, index) in knights" :key="index" @click="selectKnight(knight)"
        class="bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700 transition duration-300 border-4"
        :class="{ [knight.borderColor]: selectedKnight?.name === knight.name }" >
        <img :src="knight.image" :alt="knight.name" class="w-32 h-32 mx-auto mb-4" />
        <h2 class="text-xl font-semibold text-center">{{ knight.name }}</h2>
        <p class="text-center text-gray-400">{{ knight.description }}</p>
      </div>
    </div>

    <!-- Message d'erreur stylisé -->
    <p v-if="errorMessage" class="mt-4 text-red-500 font-semibold">{{ errorMessage }}</p>

    <button @click="startGame" class="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg transition duration-300" >
      Commencer la joute
    </button>
  </div>
</template>

<style scoped>

</style>
