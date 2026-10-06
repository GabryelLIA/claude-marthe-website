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
      <EnteteGalerie surtitre="Claude Marthe · Artiste-peintre et sculptrice" photo="photo-homepage-claude-marthe">
        Entre Songes <em>&amp;</em> rêves nébuleux 
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

