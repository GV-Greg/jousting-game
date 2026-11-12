# CLAUDE.md — jousting game

## Contexte du projet

Jeu de **joute médiévale** (Vue 3 + Vite), développé par Greg. À l'origine un terrain d'expérimentation, mais réellement entamé : moteur de jeu, IA adverse et animations fonctionnels. **Priorité basse.** Voir `roadmap.md` — à consulter avant de commencer.

**Dossier de dev de référence** : **`D:\01_WEB\_IA\jousting-game`** (depuis le 19/07/2026). L'ancien dossier `D:\01_WEB\_DEV\jousting-game` est **abandonné** — ne plus l'utiliser. `.git` est conservé et relié au dépôt ; lancer `npm install` pour régénérer `node_modules` (non copié).

---

## Structure du workspace

```
D:\01_WEB\_IA\jousting-game\    ← DOSSIER DE DEV DE RÉFÉRENCE (+ CLAUDE.md, roadmap.md)
├── engine/joustEngine.js       ← ⚠️ doublon de src/engine (à consolider)
├── map/structure.txt
├── src/
│   ├── engine/joustEngine.js   ← moteur de joute
│   ├── intelligence/           ← aiPlayer.js, strategies.js
│   ├── composables/            ← useGameState, useToast
│   ├── stores/                 ← gameStore, settingsStore (Pinia)
│   ├── components/             ← sprites, Menu, BaseButton, Toast…
│   ├── views/                  ← Home, Rules, CharacterSelect, Customize, Game, Settings
│   └── assets/sprites/         ← chevalier : attack, death, gallop, walk, standing
├── Dockerfile.dev + docker-compose.yml
```

Dépôt : [GV-Greg/jousting-game](https://github.com/GV-Greg/jousting-game) — **public** (conservé public), branche `main`.

---

## Stack technique

- **Vue 3.5** (Composition API) + Vite 6 + Vue Router + Pinia
- **Tailwind CSS 4** (`@tailwindcss/vite`)
- **GSAP** (animations), **oh-vue-icons** (icônes)
- **Tests** : Vitest + @vue/test-utils (configurés, mais quasi pas utilisés)

---

## Commandes courantes

```bash
npm install
npm run dev          # serveur de dev Vite
npm run build        # build de prod
npm run test:unit    # Vitest
npm run lint         # ESLint --fix
npm run format       # Prettier
```

---

## Mécanique de jeu (moteur)

`joustEngine.js` calcule touche et désarçonnement selon des **tactiques** :
- **Style de lance** : haute / moyenne / basse (bonus touche / désarçonnement)
- **Posture** : offensive / équilibrée / défensive (attaque / défense)
- **Allure** : rapide / modérée / lente (impact / précision)
Attributs : chevalier (force, précision, endurance) + cheval (vitesse, stabilité, endurance). IA (`aiPlayer.js` + `strategies.js`) : niveaux de difficulté + stratégies.

---

## Workflow Git

- Branche principale : `main`
- Une branche par fonctionnalité : `feat/<nom>`, `fix/<nom>`, `chore/<nom>`
- **Commits et push uniquement à la demande explicite de Greg**
- Dépôt **public** (choix assumé, contrairement aux autres projets)

---

## Contraintes / dette technique à connaître

- ⚠️ **Moteur dupliqué** : `engine/joustEngine.js` (racine) et `src/engine/joustEngine.js` divergent — consolider en une seule source avant d'étendre la logique.
- **Tests manquants** : seul `HelloWorld.spec.js` (scaffold) subsiste ; ajouter des tests Vitest sur le moteur/IA est la priorité technique.
- Restes de scaffold à nettoyer : composant `HelloWorld`, `README.md` par défaut, `debug_structure.log`.
- Le dev se fait désormais dans `_IA/jousting-game/` ; l'ancien `_DEV/jousting-game` est abandonné.
