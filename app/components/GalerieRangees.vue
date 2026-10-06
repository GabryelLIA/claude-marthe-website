<script setup lang="ts">
import type { Oeuvre } from '~/composables/useOeuvres';

const props = defineProps<{ oeuvres: Oeuvre[]; provenance?: string }>();

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
        <CarteOeuvre v-for="oeuvre in liste" :key="oeuvre.slug" :oeuvre="oeuvre" :provenance="provenance" />
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

/* Hauteurs et facteurs calibrés pour 3 œuvres par rangée de 96rem :
   hauteur_image × facteur × ratio_largeur ≤ ~28,8rem (budget par carte,
   padding de cadre et gouttières déduits) */
.galerie__rangee {
  --hauteur-image: 24rem; /* carrés : 3 × 24 + cadres + gouttières ≈ 82rem */
  --facteur: 1;

  &[data-categorie='vertical'] {
    --hauteur-image: 30rem;   /* × 1,35 → 40,5rem : 3 portraits (ratio ~0,7) */
    --facteur: 1.35;
  }

  &[data-categorie='horizontal'] {
    --hauteur-image: 25rem;   /* × 0,85 → 21,25rem : 3 paysages (ratio 1,34) */
    --facteur: 1.20;
  }

  &[data-categorie='vertical-narrow'] {
    --hauteur-image: 34rem;   /* × 1,6 → 54,4rem : 3 étroits (ratio 0,51) */
    --facteur: 1.6;
  }

  &[data-categorie='horizontal-wide'] {
    --hauteur-image: 22rem;
    --facteur: 2;
  }
}

.galerie__titre {
  margin-bottom: 1.6rem;
  font-size: 0.85rem;
  font-family: var(--police-texte);
  font-weight: 400;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--brume);
}

.galerie__oeuvres {
  /* Les rangées d'œuvres débordent du conteneur pour occuper jusqu'à 96rem,
     tout en restant centrées dessus (breakout) */
  --largeur-galerie: min(96rem, 100vw - 2 * var(--marge));
  width: var(--largeur-galerie);
  margin-inline: calc((100% - var(--largeur-galerie)) / 2);

  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: center; /* rangées équilibrées, œuvres au centre du regard */
  gap: 2.6rem;
}

@media (width < 45rem) {
  .galerie__rangee {
    --hauteur-image: min(20rem, 38vh);
  }
}
</style>
