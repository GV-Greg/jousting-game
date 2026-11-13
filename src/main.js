import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

import { OhVueIcon, addIcons } from 'oh-vue-icons';
import {
  GiSwordman, GiScrollUnfurled, GiCog, BiArrowLeft, GiCheckMark, GiCrossMark,
  HiCheck, HiX,
  GiCrossedSwords, GiShield, GiCrown, GiHorseHead, GiArcheryTarget,
  GiTrophy, GiFeather, GiBrain, GiLightningStorm, GiMuscleUp,
  GiCrownedExplosion, GiDeathSkull, GiKnightBanner, GiBattleAxe
} from 'oh-vue-icons/icons';

addIcons(
  GiSwordman, GiScrollUnfurled, GiCog, BiArrowLeft, GiCheckMark, GiCrossMark,
  HiCheck, HiX,
  GiCrossedSwords, GiShield, GiCrown, GiHorseHead, GiArcheryTarget,
  GiTrophy, GiFeather, GiBrain, GiLightningStorm, GiMuscleUp,
  GiCrownedExplosion, GiDeathSkull, GiKnightBanner, GiBattleAxe
);

const app = createApp(App);

app.component('v-icon', OhVueIcon);

app.use(createPinia());
app.use(router);
app.mount('#app');
