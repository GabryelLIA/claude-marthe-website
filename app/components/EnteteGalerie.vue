<script setup lang="ts">
const props = defineProps<{ surtitre: string; intro?: string; photo?: string }>();

const photoArtiste = computed(() =>
  props.photo ? usePhotoArtiste(props.photo) : undefined,
);
</script>

<template>
  <header class="entete-galerie" :class="{ 'avec-photo': !!photoArtiste }">
    <div class="entete-galerie__titre">
      <p class="surtitre">{{ surtitre }}</p>
      <h1><slot /></h1>
    </div>
    <p v-if="intro" class="entete-galerie__intro">{{ intro }}</p>
    <figure v-if="photoArtiste" class="entete-galerie__photo">
      <img
        :src="photoArtiste.moyenne"
        :alt="'Claude Marthe'"
        :width="photoArtiste.largeurMoyenne"
        loading="lazy"
        decoding="async"
      />
    </figure>
    <div v-if="$slots.actions" class="entete-galerie__actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<style scoped>
.entete-galerie {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.8rem var(--souffle);
  margin-block: calc(var(--respiration) * 0.5) var(--respiration);
}

.entete-galerie__titre {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  max-width: 34rem
}

.entete-galerie__intro {
  max-width:26rem;
  color: var(--brume);
}

/* Avec photo : grille à deux colonnes — surtitre, titre et actions à
   gauche, la photo à droite dans sa propre colonne, sur toute la hauteur */
.entete-galerie.avec-photo {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 26rem);
  align-items: end;
}

.entete-galerie.avec-photo .entete-galerie__titre,
.entete-galerie.avec-photo .entete-galerie__intro,
.entete-galerie.avec-photo .entete-galerie__actions {
  grid-column: 1;
}

.entete-galerie.avec-photo .entete-galerie__photo {
  grid-column: 2;
  grid-row: 1 / span 2;
  align-self: stretch;
}

.entete-galerie__photo {
  align-self: stretch;
  max-width: 26rem;
}

.entete-galerie__photo img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--rayon);
}

@media (width < 55rem) {
  .entete-galerie.avec-photo {
    grid-template-columns: minmax(0, 1fr);
  }

  .entete-galerie.avec-photo .entete-galerie__titre {
    grid-row: 1;
  }

  .entete-galerie.avec-photo .entete-galerie__photo {
    grid-column: 1;
    grid-row: 2;
  }

  .entete-galerie.avec-photo .entete-galerie__actions {
    grid-row: 3;
  }
}
</style>
