<script setup lang="ts">
import type { Oeuvre } from '~/composables/useOeuvres';

defineProps<{ oeuvre: Oeuvre }>();
</script>

<template>
  <NuxtLink :to="`/oeuvre/${oeuvre.slug}`" class="carte">
    <span class="carte__cadre">
      <img
        :src="oeuvre.miniature"
        :srcset="`${oeuvre.miniature} ${oeuvre.largeurMiniature}w, ${oeuvre.moyenne} ${oeuvre.largeurMoyenne}w, ${oeuvre.image} ${oeuvre.largeur}w`"
        sizes="(width < 45rem) 85vw, 45rem"
        :alt="oeuvre.titre"
        loading="lazy"
        decoding="async"
      />
    </span>
    <span class="carte__legende">
      <span class="carte__titre">{{ oeuvre.titre }}</span>
      <span v-if="oeuvre.prix !== null" class="carte__prix">{{ formatPrix(oeuvre.prix) }}</span>
      <span v-else-if="enTirage(oeuvre)" class="carte__prix">Tirage fine art</span>
    </span>
  </NuxtLink>
</template>

<style scoped>
.carte {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.carte__cadre {
  display: block;
  padding: 0.7rem;
  background: var(--encre);
  border: 1px solid var(--bordure);
  border-radius: var(--rayon);
  box-shadow: var(--ombre-cadre);
  overflow: hidden; /* le zoom de l'œuvre reste dans le cadre */
  transition:
    transform var(--vitesse) var(--easing),
    box-shadow var(--vitesse) var(--easing),
    border-color var(--vitesse) var(--easing);

  img {
    /* Hauteur de rangée × facteur par catégorie (calibré pour 3 œuvres par rangée) */
    height: calc(var(--hauteur-image, 24rem) * var(--facteur, 1));
    width: auto;
    max-width: 100%;
    margin-inline: auto;
    object-fit: contain;
    filter: saturate(0.96) brightness(0.98); /* l'œuvre reste éclatante au repos */
    transition: filter var(--vitesse) var(--easing), transform 1.4s var(--easing);
  }
}

/* L'œuvre s'éveille au survol : halo de lune + zoom lent */
.carte:hover .carte__cadre,
.carte:focus-visible .carte__cadre {
  border-color: var(--bordure-forte);
  box-shadow: var(--halo-lune), var(--ombre-cadre);
  transform: translateY(-0.35rem);

  img {
    filter: none;
    transform: scale(1.04);
  }
}

.carte__legende {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
}

.carte__titre {
  font-family: var(--police-titres);
  font-size: 1.4rem;
  letter-spacing: 0.04em;
  color: var(--argent);
}

.carte__prix {
  font-size: 0.85rem;
  letter-spacing: 0.14em;
  color: var(--brume);
  white-space: nowrap;
}
</style>
