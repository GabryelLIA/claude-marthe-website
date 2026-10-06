<script setup lang="ts">
/* Toute œuvre éditée en tirages fine art, original encore disponible ou non */
const tirages = useOeuvres().filter((oeuvre) => oeuvre.tiragesFineArt.length > 0);

useHead({
  title: 'Tirages fine art',
});
</script>

<template>
  <div class="page">
    <section class="conteneur">
      <header class="titre-section">
        <p class="surtitre">L’original poursuivi</p>
        <h1>Tirages fine art</h1>
        <p class="intro">
          Ces œuvres ont trouvé preneur, mais la nuit se copie mal — et pourtant.
          Elles sont éditées en tirages fine art sur papier d’art, numérotés et
          signés. <NuxtLink to="/contact" class="lien-lune">Demander un tirage</NuxtLink>.
        </p>
      </header>

      <div class="tirages">
        <NuxtLink
          v-for="oeuvre in tirages"
          :key="oeuvre.slug"
          :to="`/oeuvre/${oeuvre.slug}`"
          class="tirage"
        >
          <img
            :src="oeuvre.miniature"
            :srcset="`${oeuvre.miniature} ${oeuvre.largeurMiniature}w, ${oeuvre.moyenne} ${oeuvre.largeurMoyenne}w`"
            sizes="(width < 55rem) 45vw, 20rem"
            :alt="oeuvre.titre"
            loading="lazy"
            decoding="async"
          />
          <span class="tirage__voile">
            <span class="tirage__titre">{{ oeuvre.titre }}</span>
            <span class="tirage__mention">
              <!-- tirage fine art 1 puis 2, empilés -->
              <span v-if="oeuvre.tiragesFineArt[0]">{{ mentionTirage(oeuvre.tiragesFineArt[0]) }}</span>
              <span v-if="oeuvre.tiragesFineArt[1]">{{ mentionTirage(oeuvre.tiragesFineArt[1]) }}</span>
            </span>
          </span>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.titre-section .intro {
  max-width: 40rem;
  color: var(--brume);
}

.titre-section .lien-lune {
  color: var(--argent);
  border-bottom: 1px solid var(--bordure-forte);
  transition: border-color var(--vitesse) var(--easing);

  &:hover {
    border-color: var(--argent);
  }
}

.tirages {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  gap: 2rem;
}

.tirage {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--bordure);
  border-radius: var(--rayon);
  background: var(--encre);

  img {
    aspect-ratio: 4 / 5;
    width: 100%;
    object-fit: cover;
    filter: saturate(0.9) brightness(0.9);
    transition: filter var(--vitesse) var(--easing), transform 1.2s var(--easing);
  }

  &:hover img,
  &:focus-visible img {
    filter: none;
    transform: scale(1.03);
  }
}

.tirage__voile {
  position: absolute;
  inset: auto 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 2.5rem 1.2rem 1rem;
  background: linear-gradient(to top, rgb(3 5 10 / 0.9), transparent);
}

.tirage__titre {
  font-family: var(--police-titres);
  font-size: 1.2rem;
  letter-spacing: 0.04em;
  color: var(--lune);
}

.tirage__mention {
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--brume);

  span {
    display: block;
  }
}
</style>
