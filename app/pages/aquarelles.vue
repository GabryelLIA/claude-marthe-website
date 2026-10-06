<script setup lang="ts">
const aquarelles = useOeuvres().filter((oeuvre) => oeuvre.type === 'Aquarelle');
const diaporamaActif = ref(false);

useHead({
  title: 'Aquarelles',
});
</script>

<template>
  <div class="page">
    <section class="conteneur">
      <EnteteGalerie surtitre="Encre de Chine &amp; lavis" intro="L’eau conduit la nuit : l’encre se répand, hésite, se reprend — comme une mémoire qui remonte à la surface du songe.">
        Aquarelles
        <template #actions>
          <button type="button" class="bouton" @click="diaporamaActif = true">
            ◈ Lancer le diaporama
          </button>
        </template>
      </EnteteGalerie>

      <GalerieRangees :oeuvres="aquarelles" provenance="aquarelles" />
    </section>

    <DiaporamaPleinEcran v-if="diaporamaActif" :oeuvres="aquarelles" @fermer="diaporamaActif = false" />
  </div>
</template>

