<script setup lang="ts">
const songeLunaire = useOeuvre('songe-lunaire');

useHead({
  title: 'À propos de l’artiste',
});
</script>

<template>
  <div class="page">
    <article class="conteneur propos">
      <header class="titre-section">
        <p class="surtitre">La main qui veille</p>
        <h1>À propos de l’artiste</h1>
      </header>

      <div class="propos__corps">
        <figure v-if="songeLunaire" class="propos__portrait">
          <img :src="songeLunaire.image" :alt="songeLunaire.titre" loading="lazy" />
          <figcaption>{{ songeLunaire.titre }} — {{ songeLunaire.technique }}</figcaption>
        </figure>

        <div class="propos__texte">
          <p>
            Claude Marthe peint la nuit — non pas celle qui repose, mais celle qui
            travaille. Ses toiles rassemblent ce que le jour dissout : des figures
            aux contours hésitants, des seuils entrevecrés, des eaux où se reflète
            quelque chose qui n’est pas exactement un visage.
          </p>
          <p>
            Formée à l’aquarelle et à l’encre de Chine, elle a appris des lavis la
            patience des choses qui apparaissent lentement. Ses œuvres majeures,
            à la technique mixte, étendent ce souffle à plus grand : « Songe
            lunaire », « Entre Deux-Mondes », « Dépression » — des titres qui
            disent moins des sujets que des états.
          </p>
          <p>
            Son œuvre habite un territoire feutré, entre le songe et les terreurs
            nocturnes : jamais le cri, toujours le frisson. Ce qui intéresse
            l’artiste, c’est l’instant où l’ombre n’est plus décor mais présence —
            où l’on comprend que la nuit nous regarde aussi.
          </p>
          <p class="propos__exergue">
            « Je ne peins pas des cauchemars. Je peins ce qui reste, au matin,
            de leur passage. »
          </p>
        </div>
      </div>
    </article>
  </div>
</template>

<style scoped>
.propos__corps {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: var(--respiration);
  align-items: start;

  @media (width < 55rem) {
    grid-template-columns: 1fr;
  }
}

.propos__portrait {
  position: sticky;
  top: 7rem;

  img {
    width: 100%;
    border: 1px solid var(--bordure);
    box-shadow: var(--halo-lune), var(--ombre-cadre);
  }

  figcaption {
    margin-top: 0.8rem;
    font-size: 0.78rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--ombre);
  }

  @media (width < 55rem) {
    position: static;
    max-width: 30rem;
  }
}

.propos__texte {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  color: var(--brume);

  p:first-child::first-letter {
    font-family: var(--police-titres);
    font-size: 3.4rem;
    line-height: 0.9;
    float: left;
    padding-right: 0.6rem;
    color: var(--argent);
  }
}

.propos__exergue {
  margin-top: 0.8rem;
  padding-left: 1.4rem;
  border-left: 1px solid var(--bordure-forte);
  font-family: var(--police-titres);
  font-size: 1.45rem;
  font-style: italic;
  color: var(--lune);
}
</style>
