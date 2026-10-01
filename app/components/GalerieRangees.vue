<script setup lang="ts">
import type { Oeuvre } from '~/composables/useOeuvres';

const props = defineProps<{ oeuvres: Oeuvre[] }>();

const { oeuvres } = toRefs(props);

/**
 * Une rangée de galerie ne présente que des œuvres d'une même catégorie
 * (champ CATEGORIE), pour des formats homogènes côte à côte.
 */
const rangees = computed(() => groupeParCategorie(oeuvres.value));
</script>

<template>
  <div class="galerie">
    <section v-for="[categorie, liste] in rangees" :key="categorie" class="galerie__rangee" :data-categorie="categorie">
      <h2 class="galerie__titre">{{ libelleCategorie(categorie) }}</h2>
      <div class="galerie__oeuvres">
        <CarteOeuvre v-for="oeuvre in liste" :key="oeuvre.slug" :oeuvre="oeuvre" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.galerie {
  display: flex;
  flex-direction: column;
  gap: var(--respiration);
}

/* Hauteur d'image homogène par rangée, ajustée au format */
.galerie__rangee {
  --hauteur-image: 20rem;

  &[data-categorie='vertical-narrow'] {
    --hauteur-image: 22rem;
  }

  &[data-categorie='horizontal-wide'] {
    --hauteur-image: 15rem;
  }

  &[data-categorie='horizontal'] {
    --hauteur-image: 17rem;
  }
}

.galerie__titre {
  margin-bottom: 1.4rem;
  font-size: 0.85rem;
  font-family: var(--police-texte);
  font-weight: 400;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--brume);
}

.galerie__oeuvres {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 2.2rem;
}

@media (width < 45rem) {
  .galerie__rangee {
    --hauteur-image: 15rem;
  }
}
</style>
