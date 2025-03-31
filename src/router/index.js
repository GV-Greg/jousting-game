import { createRouter, createWebHistory } from 'vue-router';

import Home from '../views/Home.vue';
import CharacterSelection from '../views/CharacterSelection.vue';
import Game from '../views/Game.vue';
import Rules from '../views/Rules.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/select', component: CharacterSelection },
  { path: '/game', component: Game },
  { path: '/rules', component: Rules },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
