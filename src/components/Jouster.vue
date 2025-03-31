<script setup>
import { computed } from 'vue';
import AnimatedSprite from '@/components/animations/AnimatedSprite.vue';

const props = defineProps({
  position: {
    type: String,
    required: true,
    validator: (value) => ['left', 'right'].includes(value),
  },
  positionValue: {
    type: Number,
    required: true,
  },
  state: {
    type: String,
    required: true,
    validator: (value) => ['walk', 'attack', 'death', 'gallop', 'standing'].includes(value),
  },
  direction: {
    type: String,
    required: true,
    validator: (value) => ['left', 'right'].includes(value),
  },
});

// Importer les images correctement
const attackFrames = import.meta.glob('@/assets/sprites/attack/*.png', { eager: true });
const deathFrames = import.meta.glob('@/assets/sprites/death/*.png', { eager: true });
const gallopFrames = import.meta.glob('@/assets/sprites/gallop/*.png', { eager: true });
const standingFrames = import.meta.glob('@/assets/sprites/standing/*.png', { eager: true });
const walkFrames = import.meta.glob('@/assets/sprites/walk/*.png', { eager: true });

const frames = {
  attack: Object.values(attackFrames).map((module) => module.default),
  death: Object.values(deathFrames).map((module) => module.default),
  gallop: Object.values(gallopFrames).map((module) => module.default),
  standing: Object.values(standingFrames).map((module) => module.default),
  walk: Object.values(walkFrames).map((module) => module.default),
};

// Gérer la position du chevalier
const positionStyle = computed(() => ({
  left: props.position === 'left' ? `${props.positionValue}vw` : 'auto',
  right: props.position === 'right' ? `${props.positionValue}vw` : 'auto',
}));

const currentFrames = computed(() => frames[props.state]);
</script>

<template>
  <div :class="['jouster', position === 'left' ? 'left-0' : 'right-0']" :style="positionStyle" class="absolute top-1/2 transform -translate-y-1/2">
    <AnimatedSprite :state="state" :frames="currentFrames" :frameDuration="100" :direction="direction" />
  </div>
</template>


<style scoped>
.jouster {
  transition: transform 0.2s linear;
}
</style>
