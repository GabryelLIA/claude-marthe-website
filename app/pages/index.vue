<script setup lang="ts">
const oeuvres = useOeuvres();
const diaporamaActif = ref(false);

useHead({
  title: 'Tableaux',
});
</script>

<template>
  <div class="page">
    <section class="conteneur">
      <EnteteGalerie surtitre="Claude Marthe · Artiste-peintre et sculptrice" intro="Figures surgies de la nuit, eaux sombres et tortueuses : chaque tableau est une veille où le songe et l’angoisse se tiennent côte à côte, sans jamais se révéler l’un à l’autre.">
        Songes <em>&amp;</em> terreurs nocturnes
        <template #actions>
          <button type="button" class="bouton" @click="diaporamaActif = true">
            ◈ Lancer le diaporama
          </button>
        </template>
      </EnteteGalerie>

      <GalerieRangees :oeuvres="oeuvres" />
    </section>

    <DiaporamaPleinEcran v-if="diaporamaActif" :oeuvres="oeuvres" @fermer="diaporamaActif = false" />
  </div>
</template>

