import { createRouter, createWebHistory } from 'vue-router';

import Home from '../views/Home.vue';
import CharacterSelection from '../views/CharacterSelect.vue';
import Game from '../views/Game.vue';
import Rules from '../views/Rules.vue';

// Configuration des routes
const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: 'Accueil - Jeu de Joutes',
      requiresAuth: false
    }
  },
  {
    path: '/select',
    name: 'character-selection',
    component: CharacterSelection,
    meta: {
      title: 'Sélection du Chevalier - Jeu de Joutes',
      requiresAuth: false
    }
  },
  {
    path: '/game',
    name: 'game',
    component: Game,
    meta: {
      title: 'En jeu - Jeu de Joutes',
      requiresAuth: false
    }
  },
  {
    path: '/rules',
    name: 'rules',
    component: Rules,
    meta: {
      title: 'Règles du jeu - Jeu de Joutes',
      requiresAuth: false
    }
  },
  // Route pour la gestion des pages non trouvées
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: { name: 'home' }
  }
];

// Création du routeur
const router = createRouter({
  history: createWebHistory(),
  routes,
  // Comportement de défilement lors de la navigation
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// Navigation Guards (middleware)
router.beforeEach((to, from, next) => {
  // Mise à jour du titre de la page
  document.title = to.meta.title || 'Jeu de Joutes Médiévales';

  // Vous pouvez ajouter d'autres logiques ici, comme:
  // - Vérification d'authentification
  // - Redirection basée sur l'état du jeu
  // - Tracking/analytics

  next();
});

export default router;
