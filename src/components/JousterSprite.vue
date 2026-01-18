<template>
  <div class="jouster" :style="positionStyle">
    <!-- Badge indicateur du joueur -->
    <div
      v-if="playerLabel"
      class="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded-lg text-xs font-bold whitespace-nowrap z-20 border-2 shadow-lg"
      :class="badgeColorClass"
    >
      <span class="text-white drop-shadow">{{ playerLabel }}</span>
    </div>

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
import { computed } from 'vue'
import AnimatedSprite from '@/components/animations/AnimatedSprite.vue'

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
  },
  movingDirection: {
    type: String,
    required: true,
  },
  scale: {
    type: Number,
    default: 1,
  },
  verticalPosition: {
    type: String,
    default: 'center',
  },
  // Nouveau: label du joueur
  playerLabel: {
    type: String,
    default: null,
  },
  // Nouveau: couleur du badge
  badgeColor: {
    type: String,
    default: 'gray',
  },
})

const emit = defineEmits(['animationCompleted'])

// Charger les images pour les différents états
const attackFrames = import.meta.glob('@/assets/sprites/attack/*.png', { eager: true })
const deathFrames = import.meta.glob('@/assets/sprites/death/*.png', { eager: true })
const gallopFrames = import.meta.glob('@/assets/sprites/gallop/*.png', { eager: true })
const standingFrames = import.meta.glob('@/assets/sprites/standing/*.png', { eager: true })
const walkFrames = import.meta.glob('@/assets/sprites/walk/*.png', { eager: true })

// Fonction pour trier les frames par numéro
const sortFramesByNumber = (framesObj) => {
  return Object.entries(framesObj)
    .sort(([pathA], [pathB]) => {
      const numA = parseInt(pathA.match(/(\d+)\.png$/)?.[1] || '0')
      const numB = parseInt(pathB.match(/(\d+)\.png$/)?.[1] || '0')
      return numA - numB
    })
    .map(([, module]) => module.default)
}

const frames = {
  attack: sortFramesByNumber(attackFrames),
  death: sortFramesByNumber(deathFrames),
  gallop: sortFramesByNumber(gallopFrames),
  standing: sortFramesByNumber(standingFrames),
  walk: sortFramesByNumber(walkFrames),
}

const currentFrames = computed(() => frames[props.state] || [])

const frameDuration = computed(() => {
  switch (props.state) {
    case 'gallop':
      return 80
    case 'attack':
      return 100
    case 'death':
      return 120
    default:
      return 120
  }
})

// Style de positionnement - ancrage par le bas du sprite
const positionStyle = computed(() => {
  const style = {
    position: 'absolute',
    // Jouteur du haut (top) = derrière la lice (z-index 5)
    // Jouteur du bas (bottom) = devant la lice (z-index 15)
    zIndex: props.verticalPosition === 'top' ? 5 : 15,
    transform: `scale(${props.scale})`,
    transformOrigin: 'bottom center',
  }

  // Position verticale
  if (props.verticalPosition === 'top') {
    // Jouteur du haut : pieds juste au-dessus de la lice
    style.bottom = '48%'
  } else if (props.verticalPosition === 'bottom') {
    // Jouteur du bas : pieds juste en-dessous de la lice
    style.bottom = '43%'
  } else {
    style.bottom = '50%'
  }

  // Position horizontale
  if (props.position === 'left') {
    style.left = `${props.positionValue}%`
  } else {
    style.right = `${props.positionValue}%`
  }

  return style
})

const shouldBeFlipped = computed(() => {
  return props.movingDirection === 'left'
})

const onAnimationCompleted = (state) => {
  emit('animationCompleted', state)
}

// Classe de couleur pour le badge
const badgeColorClass = computed(() => {
  const colors = {
    red: 'bg-red-600 border-red-400',
    blue: 'bg-blue-600 border-blue-400',
    green: 'bg-green-600 border-green-400',
    yellow: 'bg-yellow-500 border-yellow-400',
    purple: 'bg-purple-600 border-purple-400',
    gray: 'bg-gray-600 border-gray-400',
  }
  return colors[props.badgeColor] || colors.gray
})
</script>

<style scoped>
.jouster {
  position: absolute;
  transition:
    left 0.1s linear,
    right 0.1s linear;
}
</style>
