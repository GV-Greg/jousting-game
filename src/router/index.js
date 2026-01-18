import { createRouter, createWebHistory } from 'vue-router'

import Rules from '@/views/RulesView.vue'

// Configuration des routes
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/select',
    name: 'select',
    component: () => import('@/views/CharacterSelect.vue'),
  },
  {
    path: '/customize',
    name: 'customize',
    component: () => import('@/views/CharacterCustomize.vue'),
  },
  {
    path: '/game',
    name: 'game',
    component: () => import('@/views/GameView.vue'),
  },
  {
    path: '/rules',
    name: 'rules',
    component: Rules,
    meta: {
      title: 'Règles du jeu - Jeu de Joutes',
      requiresAuth: false,
    },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/SettingsView.vue'),
  },
  {
    path: '/customize',
    name: 'customize',
    component: () => import('@/views/CharacterCustomize.vue'),
  },
  // Route pour la gestion des pages non trouvées
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: { name: 'home' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
