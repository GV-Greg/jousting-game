import { ref } from 'vue'

const toastState = ref({
  show: false,
  message: '',
  type: 'error',
  duration: 3000,
})

export function useToast() {
  const showToast = (message, type = 'error', duration = 3000) => {
    toastState.value = {
      show: true,
      message,
      type,
      duration,
    }
  }

  const hideToast = () => {
    toastState.value.show = false
  }

  const error = (message, duration = 3000) => showToast(message, 'error', duration)
  const success = (message, duration = 3000) => showToast(message, 'success', duration)
  const warning = (message, duration = 3000) => showToast(message, 'warning', duration)
  const info = (message, duration = 3000) => showToast(message, 'info', duration)

  return {
    toastState,
    showToast,
    hideToast,
    error,
    success,
    warning,
    info,
  }
}
