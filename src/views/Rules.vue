<script setup>
  import { onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useSettingsStore } from '@/stores/settingsStore';
  import Button from '@/components/Button.vue';
  import Icon from '@/components/Icon.vue';

  const router = useRouter();
  const settingsStore = useSettingsStore();

  // Fonction pour jouer un effet sonore
  const playSoundEffect = (soundName) => {
    if (settingsStore.soundEnabled) {
      // Cette fonction est simulée car les sons ne sont pas encore implémentés
      console.log(`Son joué: ${soundName}`);
    }
  };

  // Retourner à l'écran d'accueil
  const returnToHome = () => {
    playSoundEffect('page_turn');
    router.push('/');
  };

  onMounted(() => {
    // Jouer un son d'ambiance au chargement
    playSoundEffect('rules_ambient');
  });
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
    <div class="bg-gradient-to-b from-stone-800 to-stone-900 border-4 border-amber-900 rounded-lg max-w-6xl w-full shadow-xl p-6">
      <div class="flex flex-col h-full">
        <!-- Titre et contenu principal -->
        <div class="flex flex-col md:flex-row gap-6">
          <!-- Titre et section Comment jouer -->
          <div class="md:w-1/2">
            <h1 class="text-4xl font-medieval text-center md:text-left text-yellow-400 mb-4">Règles du Jeu</h1>

            <section>
              <h2 class="text-xl font-medieval text-amber-400 mb-3">Comment jouer ?</h2>
              <ul class="space-y-2 text-white">
                <li class="flex items-start">
                  <Icon name="gi-swordman" className="text-amber-500 mr-2 mt-1 flex-shrink-0" scale="0.9" />
                  <span>Choisis ton chevalier avec ses statistiques uniques.</span>
                </li>
                <li class="flex items-start">
                  <Icon name="hi-check" className="text-amber-500 mr-2 mt-1 flex-shrink-0" scale="0.9" />
                  <span>Affronte ton adversaire. Contrôle ta vitesse et ton timing.</span>
                </li>
                <li class="flex items-start">
                  <Icon name="gi-cog" className="text-amber-500 mr-2 mt-1 flex-shrink-0" scale="0.9" />
                  <span>Utilise "Attaquer" et "Défendre" au moment opportun.</span>
                </li>
                <li class="flex items-start">
                  <Icon name="gi-scroll-unfurled" className="text-amber-500 mr-2 mt-1 flex-shrink-0" scale="0.9" />
                  <span>Le premier à 3 victoires gagne le tournoi!</span>
                </li>
              </ul>
            </section>

            <!-- Astuces -->
            <section class="mt-4 border-t border-amber-900 pt-4">
              <h2 class="text-xl font-medieval text-amber-400 mb-3">Astuces</h2>
              <div class="bg-gray-900/50 p-3 rounded-lg border border-amber-900/30">
                <ul class="space-y-2 text-amber-100 italic text-sm">
                  <li class="flex items-start">
                    <span class="text-amber-500 mr-2">✦</span>
                    <span>Attaquer au bon moment peut renverser l'adversaire plus fort.</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-amber-500 mr-2">✦</span>
                    <span>Observe ton adversaire pour anticiper ses mouvements.</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-amber-500 mr-2">✦</span>
                    <span>Économise ton endurance pour les moments critiques.</span>
                  </li>
                </ul>
              </div>
            </section>
          </div>

          <!-- Statistiques et détails du jeu -->
          <div class="md:w-1/2">
            <section>
              <h2 class="text-xl font-medieval text-amber-400 mb-3">Statistiques des Chevaliers</h2>
              <div class="grid grid-cols-3 gap-3">
                <div class="bg-gray-900 p-3 rounded-lg">
                  <h3 class="text-center text-amber-500 font-medieval">Force</h3>
                  <p class="text-white text-sm text-center">Puissance d'impact lors des collisions.</p>
                </div>
                <div class="bg-gray-900 p-3 rounded-lg">
                  <h3 class="text-center text-amber-500 font-medieval">Vitesse</h3>
                  <p class="text-white text-sm text-center">Déplacement sur le terrain.</p>
                </div>
                <div class="bg-gray-900 p-3 rounded-lg">
                  <h3 class="text-center text-amber-500 font-medieval">Endurance</h3>
                  <p class="text-white text-sm text-center">Maintien d'effort soutenu.</p>
                </div>
              </div>
            </section>

            <!-- Chevaliers disponibles -->
            <section class="mt-4">
              <h2 class="text-xl font-medieval text-amber-400 mb-3">Chevaliers Disponibles</h2>
              <div class="grid grid-cols-2 gap-3">
                <div class="bg-gray-900 p-3 rounded-lg border border-red-800">
                  <h3 class="text-center text-red-500 font-medieval">Chevalier Rouge</h3>
                  <p class="text-white text-sm text-center">Puissant et robuste. Force supérieure, vitesse moyenne.</p>
                  <div class="flex justify-center mt-2">
                    <div class="w-1/3">
                      <div class="text-xs text-center text-gray-400">Force</div>
                      <div class="h-2 bg-red-800 rounded-full"></div>
                    </div>
                    <div class="w-1/3 mx-1">
                      <div class="text-xs text-center text-gray-400">Vit.</div>
                      <div class="h-2 bg-red-800 rounded-full w-2/3"></div>
                    </div>
                    <div class="w-1/3">
                      <div class="text-xs text-center text-gray-400">End.</div>
                      <div class="h-2 bg-red-800 rounded-full w-4/5"></div>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-900 p-3 rounded-lg border border-blue-800">
                  <h3 class="text-center text-blue-500 font-medieval">Chevalier Bleu</h3>
                  <p class="text-white text-sm text-center">Rapide et agile. Vitesse supérieure, force moyenne.</p>
                  <div class="flex justify-center mt-2">
                    <div class="w-1/3">
                      <div class="text-xs text-center text-gray-400">Force</div>
                      <div class="h-2 bg-blue-800 rounded-full w-2/3"></div>
                    </div>
                    <div class="w-1/3 mx-1">
                      <div class="text-xs text-center text-gray-400">Vit.</div>
                      <div class="h-2 bg-blue-800 rounded-full"></div>
                    </div>
                    <div class="w-1/3">
                      <div class="text-xs text-center text-gray-400">End.</div>
                      <div class="h-2 bg-blue-800 rounded-full w-3/5"></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Modes de jeu -->
            <section class="mt-4">
              <h2 class="text-xl font-medieval text-amber-400 mb-3">Modes de Jeu</h2>
              <div class="grid grid-cols-2 gap-3">
                <div class="bg-gray-900 p-3 rounded-lg border border-gray-700">
                  <h3 class="text-center text-amber-500 font-medieval">Solo</h3>
                  <p class="text-white text-sm text-center">Affronte l'IA à différents niveaux de difficulté.</p>
                </div>
                <div class="bg-gray-900 p-3 rounded-lg border border-gray-700">
                  <h3 class="text-center text-amber-500 font-medieval">2 Joueurs</h3>
                  <p class="text-white text-sm text-center">Joue contre un ami sur le même écran.</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        <!-- Bouton de retour -->
        <div class="flex justify-center mt-6">
          <Button @click="returnToHome" text="Retour à l'accueil" color="blue" icon="bi-arrow-left" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
