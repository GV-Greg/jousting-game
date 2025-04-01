<script setup>
  import Icon from './Icon.vue';

  defineProps({
    text: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    }
  });

  // Emits definition using the defineEmits macro
  const emit = defineEmits(['click']);

  // Handle click function
  const handleClick = (event) => {
    emit('click', event);
  };
</script>

<template>
  <button class='med-btn' :class="[color ? `med-btn-${color}` : '', className]" @click="handleClick" v-bind="$attrs">
    <Icon v-if="icon" :name="icon" className="mr-2" scale="1.5" />
    <span>{{ text }}</span>
  </button>
</template>
