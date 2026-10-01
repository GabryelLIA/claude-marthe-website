<script setup lang="ts">
import type { Oeuvre } from '~/composables/useOeuvres';

defineProps<{ oeuvre: Oeuvre }>();
</script>

<template>
  <NuxtLink :to="`/oeuvre/${oeuvre.slug}`" class="carte">
    <span class="carte__cadre">
      <img
        :src="oeuvre.image"
        :alt="oeuvre.titre"
        loading="lazy"
        :width="800"
        :height="1000"
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
  gap: 0.9rem;
}

.carte__cadre {
  display: block;
  padding: 0.55rem;
  background: var(--encre);
  border: 1px solid var(--bordure);
  border-radius: var(--rayon);
  box-shadow: var(--ombre-cadre);
  transition:
    transform var(--vitesse) var(--easing),
    box-shadow var(--vitesse) var(--easing),
    border-color var(--vitesse) var(--easing);

  img {
    height: var(--hauteur-image, 20rem);
    width: auto;
    max-width: 100%;
    margin-inline: auto;
    object-fit: contain;
    filter: saturate(0.92) brightness(0.96);
    transition: filter var(--vitesse) var(--easing);
  }
}

/* L'œuvre s'éveille au survol : halo de lune */
.carte:hover .carte__cadre,
.carte:focus-visible .carte__cadre {
  border-color: var(--bordure-forte);
  box-shadow: var(--halo-lune), var(--ombre-cadre);
  transform: translateY(-0.3rem);

  img {
    filter: none;
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
  font-size: 1.15rem;
  letter-spacing: 0.04em;
  color: var(--argent);
}

.carte__prix {
  font-size: 0.8rem;
  letter-spacing: 0.14em;
  color: var(--brume);
  white-space: nowrap;
}
</style>
