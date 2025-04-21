<template>
  <div class="animated-sprite">
    <img
      :src="currentFrame"
      :alt="`${state} animation`"
      class="sprite-image"
      :class="{ 'flip-horizontal': shouldFlip }"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';

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
    default: 100,
  },
  flipHorizontal: {
    type: Boolean,
    default: false,
  }
});

// Émettre des événements
const emit = defineEmits(['animationCompleted']);

const currentFrameIndex = ref(0);
const currentFrame = ref('');
const shouldFlip = computed(() => props.flipHorizontal);

// Animation timer
let animationInterval = null;

// Démarrer l'animation
const startAnimation = () => {
  if (props.frames.length === 0) return;

  stopAnimation();

  // Initialiser avec la première frame
  currentFrameIndex.value = 0;
  currentFrame.value = props.frames[0];

  // Configurer l'intervalle d'animation
  animationInterval = setInterval(() => {
    // Avancer à la frame suivante
    currentFrameIndex.value = (currentFrameIndex.value + 1) % props.frames.length;
    currentFrame.value = props.frames[currentFrameIndex.value];

    // Émettre un événement quand un cycle d'animation est terminé
    if (currentFrameIndex.value === props.frames.length - 1) {
      emit('animationCompleted', props.state);
    }
  }, props.frameDuration);
};

// Arrêter l'animation
const stopAnimation = () => {
  if (animationInterval) {
    clearInterval(animationInterval);
    animationInterval = null;
  }
};

// Réagir aux changements d'état ou de frames
watch(() => [props.state, props.frames], () => {
  if (props.frames.length > 0) {
    // Réinitialiser l'animation avec les nouvelles frames
    currentFrameIndex.value = 0;
    currentFrame.value = props.frames[0];
    startAnimation();
  }
}, { immediate: false });

// Initialiser l'animation au montage
onMounted(() => {
  if (props.frames.length > 0) {
    currentFrame.value = props.frames[0];
    startAnimation();
  }
});

// Nettoyer à la destruction
onUnmounted(() => {
  stopAnimation();
});
</script>

<style scoped>
.animated-sprite {
  display: inline-block;
}

.sprite-image {
  width: 100px;
  height: auto;
}

.flip-horizontal {
  transform: scaleX(-1);
}
</style>
