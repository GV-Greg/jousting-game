<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    // Nom de l'icône (obligatoire)
    name: {
      type: String,
      required: true
    },
    // Taille de l'icône (1 = taille par défaut)
    scale: {
      type: [Number, String],
      default: 1
    },
    // Animation (none, spin, pulse, flip)
    animation: {
      type: String,
      default: ''
    },
    // Vitesse d'animation (normal, slow, fast)
    speed: {
      type: String,
      default: 'normal'
    },
    // Animation au survol
    hover: {
      type: Boolean,
      default: false
    },
    // Retournement (horizontal, vertical)
    flip: {
      type: String,
      default: ''
    },
    // Remplissage de l'icône
    fill: {
      type: Boolean,
      default: false
    },
    // Label pour l'accessibilité
    label: {
      type: String,
      default: ''
    },
    // Titre pour l'infobulle
    title: {
      type: String,
      default: ''
    },
    // Couleur de l'icône
    color: {
      type: String,
      default: ''
    },
    // Classes CSS supplémentaires
    className: {
      type: String,
      default: ''
    },
    // Rendre l'icône cliquable
    clickable: {
      type: Boolean,
      default: false
    }
  });

  // Styles personnalisés
  const customStyle = computed(() => {
    const style = {};

    if (props.color) {
      style.color = props.color;
    }

    return style;
  });
</script>

<template>
  <v-icon
    :name="name"
    :scale="scale" 
    :style="customStyle"
    :class="['icon', className]"
  />
</template>
