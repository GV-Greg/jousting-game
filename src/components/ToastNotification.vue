<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  message: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'error',
    validator: (value) => ['error', 'success', 'warning', 'info'].includes(value),
  },
  duration: {
    type: Number,
    default: 3000,
  },
  show: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const isVisible = ref(props.show)

watch(
  () => props.show,
  (newVal) => {
    isVisible.value = newVal
    if (newVal && props.duration > 0) {
      setTimeout(() => {
        isVisible.value = false
        emit('close')
      }, props.duration)
    }
  },
)

const close = () => {
  isVisible.value = false
  emit('close')
}

const typeConfig = {
  error: {
    border: 'border-red-500',
    icon: '❌',
    iconBg: 'bg-red-500/20',
    text: 'text-red-400',
  },
  success: {
    border: 'border-green-500',
    icon: '✅',
    iconBg: 'bg-green-500/20',
    text: 'text-green-400',
  },
  warning: {
    border: 'border-amber-500',
    icon: '⚠️',
    iconBg: 'bg-amber-500/20',
    text: 'text-amber-400',
  },
  info: {
    border: 'border-blue-500',
    icon: 'ℹ️',
    iconBg: 'bg-blue-500/20',
    text: 'text-blue-400',
  },
}

const config = typeConfig[props.type] || typeConfig.error
</script>

<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="isVisible" class="fixed top-4 right-4 z-[100] max-w-sm">
        <div
          class="flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border-l-4 backdrop-blur-sm bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95"
          :class="config.border"
        >
          <!-- Icône -->
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center text-xl"
            :class="config.iconBg"
          >
            {{ config.icon }}
          </div>

          <!-- Message -->
          <p class="font-medium flex-1" :class="config.text">{{ message }}</p>

          <!-- Bouton fermer -->
          <button
            @click="close"
            class="text-gray-500 hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-700/50"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.toast-enter-active {
  animation: toast-in 0.3s ease-out;
}

.toast-leave-active {
  animation: toast-out 0.3s ease-in;
}

@keyframes toast-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes toast-out {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}
</style>
