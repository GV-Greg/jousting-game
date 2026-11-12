# Roadmap — jousting game

> Mise à jour : 19 juillet 2026

---

## Nature du projet

Jeu de **joute médiévale** (Vue 3 + Vite), à l'origine un terrain d'expérimentation. **Priorité : basse** (décision Greg, 19/07/2026), mais le projet est réellement entamé — moteur de jeu, IA et animations fonctionnels.

- **Dépôt** : [GV-Greg/jousting-game](https://github.com/GV-Greg/jousting-game) — public, branche `main`, 10 commits
- **Dossier de dev de référence** : `D:\01_WEB\_IA\jousting-game` (depuis le 19/07/2026, `.git` conservé et relié au dépôt ; `node_modules` à régénérer via `npm install`). L'ancien `D:\01_WEB\_DEV\jousting-game` est **abandonné**. L'ancienne copie obsolète `_IA\Cline\` a été supprimée.

> Répartition des rôles : ce fichier (roadmap) est administratif. Toute modification de code est faite par Claude Code, directement dans `_IA\jousting-game`.

---

## État des lieux — juillet 2026

### Ce qui existe et fonctionne ✅
- **Moteur de joute** (`src/engine/joustEngine.js`) : calculs de touche/désarçonnement selon des tactiques — style de lance (haute/moyenne/basse), posture (offensive/équilibrée/défensive), allure (rapide/modérée/lente), avec bonus/malus et influence des attributs
- **IA adverse** (`src/intelligence/aiPlayer.js` + `strategies.js`) : chevalier IA avec niveaux de difficulté et stratégies
- **Attributs personnalisables** : force, précision, endurance (chevalier) ; vitesse, stabilité, endurance (cheval)
- **Vues** : Home, Rules, CharacterSelect, CharacterCustomize, GameView, Settings
- **State** : stores Pinia (`gameStore`, `settingsStore`) + composables (`useGameState`, `useToast`)
- **Animations** : sprites de chevalier (attaque, mort, galop, marche, standing) + GSAP ; UI Tailwind 4, `oh-vue-icons`
- **Docker** : `Dockerfile.dev` + `docker-compose.yml`

### Points faibles / dette technique ⚠️
- **Moteur dupliqué** : `engine/joustEngine.js` (190 lignes, racine) **et** `src/engine/joustEngine.js` (150 lignes) coexistent → risque de divergence, à consolider en une seule source
- **Tests quasi inexistants** : seul reste `HelloWorld.spec.js` (test du scaffold), aucun test sur le moteur ou l'IA alors que Vitest est configuré
- **Restes de scaffold** : composant `HelloWorld`, `README.md` = texte template Vite par défaut
- `debug_structure.log` traîne à la racine (fichier de debug à ignorer/supprimer)

---

## Pistes (non priorisées — à traiter par Claude Code si le projet remonte)

- [ ] **Consolider le moteur** : supprimer la duplication `engine/` vs `src/engine/`, garder une seule source
- [ ] **Ajouter des tests Vitest** sur `joustEngine` (touche, désarçonnement, modificateurs) et sur l'IA — le plus rentable vu la logique déjà en place
- [ ] Nettoyer le scaffold résiduel (`HelloWorld`, README réel décrivant le jeu, retirer `debug_structure.log`)
- [ ] Définir la boucle de jeu complète visée (nb de passes, conditions de victoire, progression) si ce n'est pas déjà figé
---

## Décisions / points ouverts

- ✅ Dépôt **public** conservé (décision Greg, 19/07/2026) — contrairement à laravel-cms/ame-etheree qui passent en privé.
- ✅ Priorité **basse** maintenue.
- [ ] À revisiter : reprise plus sérieuse justifiée par l'avancement (moteur + IA + animations déjà là) ?
