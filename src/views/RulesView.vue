<script setup>
import { useRouter } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'
import arenaBackground from '@/assets/arena-bg.png'

const router = useRouter()

const returnToHome = () => {
  router.push('/')
}
</script>

<template>
  <div
    class="min-h-screen p-6 pb-20 overflow-y-auto relative bg-cover bg-center"
    :style="{ backgroundImage: `url(${arenaBackground})` }"
  >
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/82 z-0"></div>

    <div class="max-w-4xl mx-auto relative z-10">
      <!-- Titre -->
      <h1 class="text-4xl font-medieval text-amber-400 text-center mb-8 drop-shadow-lg">
        ⚜ Règles de la Joute ⚜
      </h1>

      <!-- Objectif -->
      <section class="mb-6 medieval-section p-5 rounded-xl">
        <h2 class="text-2xl font-medieval text-amber-300 mb-3 flex items-center gap-2">
          <v-icon name="gi-archery-target" class="text-amber-400" /> Objectif
        </h2>
        <p class="text-parchment leading-relaxed">
          Remportez la joute en étant le premier à atteindre
          <span class="text-amber-400 font-bold">3 points</span> ou en
          <span class="text-red-400 font-bold">désarçonnant</span> votre adversaire (victoire
          immédiate).
        </p>
      </section>

      <!-- Déroulement -->
      <section class="mb-6 medieval-section p-5 rounded-xl">
        <h2 class="text-2xl font-medieval text-amber-300 mb-3 flex items-center gap-2">
          <v-icon name="gi-horse-head" class="text-amber-400" /> Déroulement d'une Passe
        </h2>
        <ol class="text-parchment space-y-2 list-decimal list-inside">
          <li>Les deux jouteurs partent de chaque extrémité de la lice</li>
          <li>Ils chargent l'un vers l'autre au galop</li>
          <li>Au croisement (milieu de la lice), le calcul de touche est effectué</li>
          <li>Les jouteurs continuent jusqu'à la fin de la piste</li>
          <li>À chaque nouvelle passe, les côtés sont échangés</li>
        </ol>
      </section>

      <!-- Système de points -->
      <section class="mb-6 medieval-section p-5 rounded-xl">
        <h2 class="text-2xl font-medieval text-amber-300 mb-3 flex items-center gap-2">
          <v-icon name="gi-crossed-swords" class="text-amber-400" /> Système de Points
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gray-900/50 p-4 rounded-lg border border-green-800">
            <h3 class="text-green-400 font-bold mb-2 flex items-center gap-1"><v-icon name="gi-check-mark" /> Touche</h3>
            <p class="text-gray-300 text-sm">+1 point pour le jouteur qui touche</p>
          </div>
          <div class="bg-gray-900/50 p-4 rounded-lg border border-yellow-800">
            <h3 class="text-yellow-400 font-bold mb-2 flex items-center gap-1"><v-icon name="gi-crossed-swords" /> Double Touche</h3>
            <p class="text-gray-300 text-sm">+1 point pour chaque jouteur</p>
          </div>
          <div class="bg-gray-900/50 p-4 rounded-lg border border-red-800">
            <h3 class="text-red-400 font-bold mb-2 flex items-center gap-1"><v-icon name="gi-crowned-explosion" /> Désarçonnement</h3>
            <p class="text-gray-300 text-sm">Victoire immédiate !</p>
          </div>
          <div class="bg-gray-900/50 p-4 rounded-lg border border-purple-800">
            <h3 class="text-purple-400 font-bold mb-2 flex items-center gap-1"><v-icon name="gi-death-skull" /> Double Désarçonnement</h3>
            <p class="text-gray-300 text-sm">Égalité, aucun point</p>
          </div>
        </div>
      </section>

      <!-- Statistiques du Chevalier -->
      <section class="mb-6 medieval-section p-5 rounded-xl">
        <h2 class="text-2xl font-medieval text-amber-300 mb-3 flex items-center gap-2">
          <v-icon name="gi-shield" class="text-amber-400" /> Statistiques du Chevalier
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-gray-900/50 p-4 rounded-lg">
            <div class="flex items-center gap-2 mb-2">
              <v-icon name="gi-battle-axe" class="text-red-400 text-2xl" />
              <h3 class="text-red-400 font-bold">Force</h3>
            </div>
            <p class="text-gray-300 text-sm">
              Augmente la puissance des coups et les chances de désarçonnement.
            </p>
          </div>
          <div class="bg-gray-900/50 p-4 rounded-lg">
            <div class="flex items-center gap-2 mb-2">
              <v-icon name="gi-brain" class="text-blue-400 text-2xl" />
              <h3 class="text-blue-400 font-bold">Intelligence</h3>
            </div>
            <p class="text-gray-300 text-sm">
              Améliore la précision des touches et la capacité à anticiper l'adversaire.
            </p>
          </div>
          <div class="bg-gray-900/50 p-4 rounded-lg">
            <div class="flex items-center gap-2 mb-2">
              <v-icon name="gi-crown" class="text-purple-400 text-2xl" />
              <h3 class="text-purple-400 font-bold">Charisme</h3>
            </div>
            <p class="text-gray-300 text-sm">
              Influence le moral et la résistance psychologique face à l'adversaire.
            </p>
          </div>
        </div>
      </section>

      <!-- Statistiques du Cheval -->
      <section class="mb-6 medieval-section p-5 rounded-xl">
        <h2 class="text-2xl font-medieval text-amber-300 mb-3 flex items-center gap-2">
          <v-icon name="gi-horse-head" class="text-amber-400" /> Statistiques du Destrier
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-gray-900/50 p-4 rounded-lg">
            <div class="flex items-center gap-2 mb-2">
              <v-icon name="gi-horse-head" class="text-amber-400 text-2xl" />
              <h3 class="text-amber-400 font-bold">Expérience</h3>
            </div>
            <p class="text-gray-300 text-sm">Stabilité en combat, réduit les risques de chute.</p>
          </div>
          <div class="bg-gray-900/50 p-4 rounded-lg">
            <div class="flex items-center gap-2 mb-2">
              <v-icon name="gi-lightning-storm" class="text-green-400 text-2xl" />
              <h3 class="text-green-400 font-bold">Vitesse</h3>
            </div>
            <p class="text-gray-300 text-sm">
              Rapidité de la charge, impacte la force de l'impact.
            </p>
          </div>
          <div class="bg-gray-900/50 p-4 rounded-lg">
            <div class="flex items-center gap-2 mb-2">
              <v-icon name="gi-muscle-up" class="text-cyan-400 text-2xl" />
              <h3 class="text-cyan-400 font-bold">Endurance</h3>
            </div>
            <p class="text-gray-300 text-sm">Résistance à la fatigue sur plusieurs passes.</p>
          </div>
        </div>
      </section>

      <!-- Niveaux de difficulté -->
      <section class="mb-6 medieval-section p-5 rounded-xl">
        <h2 class="text-2xl font-medieval text-amber-300 mb-3 flex items-center gap-2">
          <v-icon name="gi-trophy" class="text-amber-400" /> Niveaux de Difficulté
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-gray-900/50 p-4 rounded-lg border-l-4 border-green-500">
            <h3 class="text-green-400 font-bold mb-2 flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-green-400 inline-block"></span> Écuyer Novice</h3>
            <p class="text-gray-300 text-sm">
              IA prévisible avec des stats faibles. Idéal pour apprendre.
            </p>
          </div>
          <div class="bg-gray-900/50 p-4 rounded-lg border-l-4 border-yellow-500">
            <h3 class="text-yellow-400 font-bold mb-2 flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block"></span> Chevalier Errant</h3>
            <p class="text-gray-300 text-sm">
              IA équilibrée avec des tactiques variées. Défi modéré.
            </p>
          </div>
          <div class="bg-gray-900/50 p-4 rounded-lg border-l-4 border-purple-500">
            <h3 class="text-purple-400 font-bold mb-2 flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block"></span> Champion du Roi</h3>
            <p class="text-gray-300 text-sm">
              IA agressive avec des stats élevées. Pour les experts !
            </p>
          </div>
        </div>
      </section>

      <!-- Scénarios de combat -->
      <section class="mb-6 medieval-section p-5 rounded-xl">
        <h2 class="text-2xl font-medieval text-amber-300 mb-3 flex items-center gap-2">
          <v-icon name="gi-scroll-unfurled" class="text-amber-400" /> Scénarios de Combat
        </h2>
        <div class="space-y-3 text-parchment">
          <div class="flex items-start gap-3 bg-gray-900/30 p-3 rounded-lg">
            <v-icon name="gi-cross-mark" class="text-gray-400 text-xl mt-0.5" />
            <div>
              <span class="font-bold text-gray-400">Aucune touche :</span>
              Les deux jouteurs se manquent, aucun point marqué.
            </div>
          </div>
          <div class="flex items-start gap-3 bg-gray-900/30 p-3 rounded-lg">
            <v-icon name="gi-check-mark" class="text-green-400 text-xl mt-0.5" />
            <div>
              <span class="font-bold text-green-400">Touche simple :</span>
              Un jouteur touche, +1 point pour lui.
            </div>
          </div>
          <div class="flex items-start gap-3 bg-gray-900/30 p-3 rounded-lg">
            <v-icon name="gi-crossed-swords" class="text-yellow-400 text-xl mt-0.5" />
            <div>
              <span class="font-bold text-yellow-400">Double touche :</span>
              Les deux se touchent, +1 point chacun.
            </div>
          </div>
          <div class="flex items-start gap-3 bg-gray-900/30 p-3 rounded-lg">
            <v-icon name="gi-crowned-explosion" class="text-red-400 text-xl mt-0.5" />
            <div>
              <span class="font-bold text-red-400">Désarçonnement :</span>
              Un jouteur fait tomber l'autre, victoire immédiate !
            </div>
          </div>
          <div class="flex items-start gap-3 bg-gray-900/30 p-3 rounded-lg">
            <v-icon name="gi-death-skull" class="text-purple-400 text-xl mt-0.5" />
            <div>
              <span class="font-bold text-purple-400">Double désarçonnement :</span>
              Les deux tombent, égalité parfaite.
            </div>
          </div>
        </div>
      </section>

      <!-- Conseils -->
      <section class="mb-6 p-5 rounded-xl" style="background: rgba(80,30,0,0.4); border: 1px solid rgba(180,83,9,0.6); border-top: 2px solid rgba(217,119,6,0.7);">
        <h2 class="text-2xl font-medieval text-amber-300 mb-3 flex items-center gap-2">
          <v-icon name="gi-feather" class="text-amber-400" /> Conseils
        </h2>
        <ul class="text-amber-100 space-y-2">
          <li class="flex items-start gap-2">
            <span class="text-amber-500">✦</span>
            <span
              >Une haute <strong>Intelligence</strong> augmente vos chances de toucher
              l'adversaire.</span
            >
          </li>
          <li class="flex items-start gap-2">
            <span class="text-amber-500">✦</span>
            <span
              >La <strong>Force</strong> combinée à la <strong>Vitesse du cheval</strong> détermine
              la puissance de l'impact.</span
            >
          </li>
          <li class="flex items-start gap-2">
            <span class="text-amber-500">✦</span>
            <span>L'<strong>Endurance</strong> se récupère entre les passes, gérez-la bien !</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-amber-500">✦</span>
            <span
              >Équilibrez vos stats lors de la personnalisation, ne dépassez pas les points
              disponibles.</span
            >
          </li>
        </ul>
      </section>

      <!-- Bouton retour -->
      <div class="flex justify-center mb-12">
        <BaseButton
          @click="returnToHome"
          text="Retour à l'accueil"
          color="gold"
          icon="bi-arrow-left"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.medieval-section {
  background: linear-gradient(to bottom, rgba(20, 10, 2, 0.8), rgba(12, 6, 1, 0.88));
  border: 1px solid rgba(146, 64, 14, 0.45);
  border-top: 2px solid rgba(217, 119, 6, 0.4);
}
</style>
