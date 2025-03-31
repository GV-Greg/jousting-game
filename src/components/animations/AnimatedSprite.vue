<template>
  <div class="animated-sprite">
    <img :src="currentFrame" :alt="`${state} frame`" class="sprite-image" :class="{ 'transform scale-x-[-1]': direction === 'left' }" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  state: {
    type: String,
    required: true,
    validator: (value) => ['walk', 'attack', 'death', 'gallop', 'standing'].includes(value),
  },
  frames: {
    type: Array,
    required: true,
  },
  frameDuration: {
    type: Number,
    default: 100, // Durée de chaque frame en millisecondes
  },
  direction: {
    type: String,
    required: true,
    validator: (value) => ['left', 'right'].includes(value),
  },
});

const currentFrameIndex = ref(0);
const currentFrame = ref(props.frames[currentFrameIndex.value]);

// Gérer l'animation
let animationInterval;

const startAnimation = () => {
  animationInterval = setInterval(() => {
    currentFrameIndex.value = (currentFrameIndex.value + 1) % props.frames.length;
    currentFrame.value = props.frames[currentFrameIndex.value];
  }, props.frameDuration);
};

const stopAnimation = () => {
  clearInterval(animationInterval);
};

// Démarrer l'animation lorsque l'état change
watch(() => props.state, () => {
  currentFrameIndex.value = 0; // Réinitialiser l'animation
  startAnimation();
});

// Démarrer l'animation au montage du composant
onMounted(() => {
  startAnimation();
});

// Arrêter l'animation lorsque le composant est démonté
onUnmounted(() => {
  stopAnimation();
});
</script>

<style scoped>
.animated-sprite {
  display: inline-block;
}

.sprite-image {
  width: 100px; /* Ajuste la taille selon tes besoins */
  height: auto;
}
</style>
