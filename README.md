# Jousting Game ⚔️

Jeu de joute médiévale en tour par tour, développé avec Vue 3 + Vite. Affronte une IA avec des niveaux de difficulté progressifs, personnalise ton chevalier et son cheval, et remporte le tournoi en désarçonnant ton adversaire.

---

## Gameplay

Chaque match se joue en passes successives (5 passes maximum). Pour chaque passe, tu choisis trois paramètres tactiques avant le choc :

| Paramètre | Options | Effet |
|-----------|---------|-------|
| **Style de lance** | Haute / Moyenne / Basse | Haute : +touche / Basse : +désarçonnement |
| **Posture** | Offensive / Équilibrée / Défensive | Offensive : +attaque / Défensive : +résistance |
| **Allure** | Rapide / Modérée / Lente | Rapide : +impact / Lente : +précision |

Le moteur calcule la probabilité de touche puis de désarçonnement en combinant tes choix tactiques avec les attributs de ton chevalier (force, précision, endurance, charisme) et de ton cheval (vitesse, stabilité, endurance). Le premier à désarçonner l'adversaire ou à cumuler le plus de touches sur les 5 passes gagne le round.

### Niveaux de difficulté IA

- **Facile** — IA prévisible, posture défensive, allure lente
- **Normal** — IA variée, choix aléatoires avec une tendance offensive
- **Difficile** — IA adaptative : elle surveille ton endurance, la sienne, et ajuste sa tactique en conséquence

---

## Stack technique

- **Vue 3.5** (Composition API) + **Vite 6**
- **Pinia** — state management (`gameStore`, `settingsStore`)
- **Vue Router 4**
- **Tailwind CSS 4** (`@tailwindcss/vite`)
- **GSAP** — animations des sprites
- **oh-vue-icons** — icônes
- **Vitest** + `@vue/test-utils` — tests unitaires (configurés)

---

## Installation

### Locale

```bash
npm install
npm run dev
```

L'app tourne sur [http://localhost:5173](http://localhost:5173).

### Docker

```bash
docker-compose up --build
```

L'app tourne sur [http://localhost:5173](http://localhost:5173). Le volume bind-mount permet le HMR (hot reload) depuis le conteneur.

---

## Commandes

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run preview      # Prévisualiser le build
npm run test:unit    # Tests Vitest
npm run lint         # ESLint --fix
npm run format       # Prettier
```

---

## Structure du projet

```
src/
├── engine/
│   └── joustEngine.js      # Moteur de calcul (touche, désarçonnement, endurance)
├── intelligence/
│   ├── aiPlayer.js          # Comportement de l'IA
│   └── strategies.js        # Stratégies par niveau (easy / normal / hard)
├── stores/
│   ├── gameStore.js         # État du jeu, joueurs, passes, match
│   └── settingsStore.js     # Préférences (difficulté, langue…)
├── composables/
│   ├── useGameState.js      # Store alternatif (état de jeu léger)
│   └── useToast.js          # Notifications toast
├── components/              # Sprites chevalier, boutons, toast…
├── views/
│   ├── HomeView.vue
│   ├── RulesView.vue
│   ├── CharacterSelectView.vue
│   ├── CharacterCustomizeView.vue
│   ├── GameView.vue
│   └── SettingsView.vue
└── assets/sprites/          # Animations chevalier (gallop, attack, death…)
```

---

## Dépôt

[GV-Greg/jousting-game](https://github.com/GV-Greg/jousting-game) — public, branche `main`
