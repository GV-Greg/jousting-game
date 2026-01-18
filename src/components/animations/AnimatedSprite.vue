<template>
  <div class="animated-sprite" :class="{ 'flip-horizontal': flipHorizontal }">
    <img v-if="currentFrame" :src="currentFrame" alt="sprite" class="sprite-image" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'

const props = defineProps({
  state: {
    type: String,
    required: true,
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
  },
})

const emit = defineEmits(['animationCompleted'])

const currentFrameIndex = ref(0)
let animationInterval = null

// Seule l'animation "death" ne doit pas boucler
const shouldLoop = computed(() => {
  return props.state !== 'death'
})

const currentFrame = computed(() => {
  if (props.frames.length === 0) return ''
  return props.frames[currentFrameIndex.value] || props.frames[0]
})

// Démarrer l'animation
const startAnimation = () => {
  stopAnimation()
  currentFrameIndex.value = 0

  if (props.frames.length <= 1) return

  // Configurer l'intervalle d'animation
  animationInterval = setInterval(() => {
    if (currentFrameIndex.value < props.frames.length - 1) {
      // Avancer à la frame suivante
      currentFrameIndex.value++
    } else {
      // Animation terminée
      emit('animationCompleted', props.state)

      if (shouldLoop.value) {
        // Boucler : revenir au début
        currentFrameIndex.value = 0
      } else {
        // Ne pas boucler : rester sur la dernière frame
        stopAnimation()
      }
    }
  }, props.frameDuration)
}

// Arrêter l'animation
const stopAnimation = () => {
  if (animationInterval) {
    clearInterval(animationInterval)
    animationInterval = null
  }
}

// Redémarrer l'animation quand l'état change
watch(
  () => props.state,
  () => {
    startAnimation()
  },
  { immediate: false },
)

// Redémarrer si les frames changent
watch(
  () => props.frames,
  () => {
    startAnimation()
  },
  { deep: true },
)

onMounted(() => {
  startAnimation()
})

onBeforeUnmount(() => {
  stopAnimation()
})
</script>

<style scoped>
.animated-sprite {
  display: inline-block;
}

.flip-horizontal {
  transform: scaleX(-1);
}

.sprite-image {
  display: block;
  max-width: none;
  height: auto;
}
</style>
