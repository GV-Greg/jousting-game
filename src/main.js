import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import { OhVueIcon, addIcons } from 'oh-vue-icons'
import {
  GiSwordman, GiScrollUnfurled, GiCog,
  // Ajoutez d'autres icônes que vous pourriez utiliser
} from 'oh-vue-icons/icons'

// Enregistrer les icônes que vous utiliserez
addIcons(
  GiSwordman, GiScrollUnfurled, GiCog
);

const app = createApp(App)

app.component("v-icon", OhVueIcon);

app.use(createPinia())
app.use(router)
app.mount('#app')
