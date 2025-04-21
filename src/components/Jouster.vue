<template>
  <div class="jouster" :style="positionStyle">
    <AnimatedSprite
      :state="state"
      :frames="currentFrames"
      :frameDuration="frameDuration"
      :flipHorizontal="shouldBeFlipped"
      @animationCompleted="onAnimationCompleted"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import AnimatedSprite from '@/components/animations/AnimatedSprite.vue';

const props = defineProps({
  // Position sur le terrain ('left' ou 'right')
  position: {
    type: String,
    required: true,
    validator: (value) => ['left', 'right'].includes(value),
  },
  // Position en % (depuis la gauche ou la droite selon position)
  positionValue: {
    type: Number,
    required: true,
  },
  // État d'animation actuel
  state: {
    type: String,
    required: true,
    validator: (value) => ['walk', 'attack', 'death', 'gallop', 'standing'].includes(value),
  },
  // Direction de déplacement
  movingDirection: {
    type: String,
    required: true,
    validator: (value) => ['left', 'right'].includes(value),
  },
  // Échelle du sprite (taille)
  scale: {
    type: Number,
    default: 1,
  }
});

// Émettre des événements
const emit = defineEmits(['animationCompleted']);

// Charger les images pour les différents états
const attackFrames = import.meta.glob('@/assets/sprites/attack/*.png', { eager: true });
const deathFrames = import.meta.glob('@/assets/sprites/death/*.png', { eager: true });
const gallopFrames = import.meta.glob('@/assets/sprites/gallop/*.png', { eager: true });
const standingFrames = import.meta.glob('@/assets/sprites/standing/*.png', { eager: true });
const walkFrames = import.meta.glob('@/assets/sprites/walk/*.png', { eager: true });

// Organiser les frames par état
const frames = {
  attack: Object.values(attackFrames).map((module) => module.default).sort(),
  death: Object.values(deathFrames).map((module) => module.default).sort(),
  gallop: Object.values(gallopFrames).map((module) => module.default).sort(),
  standing: Object.values(standingFrames).map((module) => module.default).sort(),
  walk: Object.values(walkFrames).map((module) => module.default).sort(),
};

// Frames actuelles basées sur l'état
const currentFrames = computed(() => frames[props.state] || []);

// Vitesse d'animation selon l'état
const frameDuration = computed(() => {
  switch (props.state) {
    case 'gallop': return 80; // Plus rapide pour le galop
    case 'attack': return 100;
    case 'death': return 150; // Plus lent pour la mort
    default: return 120;
  }
});

// Style de positionnement
const positionStyle = computed(() => {
  const style = {
    top: '50%',
    transform: `translateY(-50%) scale(${props.scale})`,
    zIndex: 10
  };

  // Positionner depuis la gauche ou la droite selon la position
  if (props.position === 'left') {
    style.left = `${props.positionValue}%`;
  } else {
    style.right = `${props.positionValue}%`;
  }

  return style;
});

// Déterminer si le sprite doit être retourné horizontalement
const shouldBeFlipped = computed(() => {
  // Les sprites sont orientés vers la droite par défaut
  // Si le jouteur se déplace vers la gauche, on retourne l'image
  return props.movingDirection === 'left';
});

// Gérer la fin d'un cycle d'animation
const onAnimationCompleted = (state) => {
  emit('animationCompleted', state);
};
</script>

<style scoped>
.jouster {
  position: absolute;
  transition: left 0.1s linear, right 0.1s linear;
}
</style>
