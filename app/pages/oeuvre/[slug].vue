<script setup lang="ts">
const route = useRoute();
const oeuvres = useOeuvres();

const oeuvre = useOeuvre(String(route.params.slug));

if (!oeuvre) {
  throw createError({ statusCode: 404, statusMessage: 'Œuvre introuvable', fatal: true });
}

useHead(() => ({
  title: oeuvre.titre,
  meta: [{ name: 'description', content: `${oeuvre.titre} — ${oeuvre.technique}` }],
}));

/* Navigation parmi toutes les œuvres, dans l'ordre de la galerie */
const index = oeuvres.findIndex((o) => o.slug === oeuvre.slug);
const precedente = index > 0 ? oeuvres[index - 1] : null;
const suivante = index < oeuvres.length - 1 ? oeuvres[index + 1] : null;

const badge = computed(() => {
  if (estDisponible(oeuvre)) return { libelle: 'Original disponible', ton: 'disponible' };
  if (enTirage(oeuvre)) return { libelle: 'Original vendu · tirage fine art sur demande', ton: 'tirage' };
  return { libelle: oeuvre.disponibilite ?? '', ton: 'neutre' };
});
</script>

<template>
  <div v-if="oeuvre" class="page">
    <article class="conteneur oeuvre">
      <nav class="oeuvre__retour" aria-label="Retour">
        <NuxtLink to="/">← Retour aux tableaux</NuxtLink>
      </nav>

      <div class="oeuvre__scene" :data-categorie="oeuvre.categorie">
        <figure class="oeuvre__cadre">
          <img :src="oeuvre.image" :alt="oeuvre.titre" />
        </figure>

        <aside class="oeuvre__fiche">
          <p class="surtitre">{{ libelleCategorie(oeuvre.categorie) }}</p>
          <h1>{{ oeuvre.titre }}</h1>

          <p class="oeuvre__badge" :data-ton="badge.ton">{{ badge.libelle }}</p>

          <dl class="oeuvre__details">
            <div v-if="oeuvre.technique">
              <dt>Technique</dt>
              <dd>{{ oeuvre.technique }}</dd>
            </div>
            <div v-if="oeuvre.dimensions">
              <dt>Dimensions (l × H)</dt>
              <dd>{{ oeuvre.dimensions }}</dd>
            </div>
            <div v-if="oeuvre.type">
              <dt>Type</dt>
              <dd>{{ oeuvre.type }}</dd>
            </div>
            <div v-if="oeuvre.prix !== null">
              <dt>Prix</dt>
              <dd>{{ formatPrix(oeuvre.prix) }}</dd>
            </div>
          </dl>

          <p v-if="oeuvre.texte" class="oeuvre__texte">{{ oeuvre.texte }}</p>

          <NuxtLink to="/contact" class="bouton bouton--plein">
            Renseigner auprès de l’atelier
          </NuxtLink>
        </aside>
      </div>

      <nav class="oeuvre__circulation" aria-label="Œuvres voisines">
        <NuxtLink v-if="precedente" :to="`/oeuvre/${precedente.slug}`" class="oeuvre__voisine oeuvre__voisine--avant">
          <span>Précédente</span>
          {{ precedente.titre }}
        </NuxtLink>
        <span v-else />
        <NuxtLink v-if="suivante" :to="`/oeuvre/${suivante.slug}`" class="oeuvre__voisine oeuvre__voisine--apres">
          <span>Suivante</span>
          {{ suivante.titre }}
        </NuxtLink>
      </nav>
    </article>
  </div>
</template>

<style scoped>
.oeuvre__retour {
  margin-bottom: var(--petite-marge);

  a {
    font-size: 0.8rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--brume);
    transition: color var(--vitesse) var(--easing);

    &:hover {
      color: var(--lune);
    }
  }
}

.oeuvre__scene {
  /* Hauteur utile : tout ce que la fenêtre laisse sous le header compact */
  --hauteur-utile: calc(100dvh - 9rem);

  /* La scène déborde du conteneur des deux côtés (comme galerie__oeuvres) :
     l'œuvre gagne la largeur à gauche, la fiche déborde à droite */
  --largeur-scene: min(100vw - 2 * var(--marge), 100rem);
  width: var(--largeur-scene);
  margin-inline: calc((100% - var(--largeur-scene)) / 2);

  /* Facteur par catégorie, à l'identique de la galerie :
     les horizontaux (limités par la largeur de colonne) ont le plus gros
     facteur pour utiliser chaque pixel de hauteur que la largeur permet */
  --facteur: 1;

  &[data-categorie='horizontal'],
  &[data-categorie='horizontal-wide'] {
    --facteur: 1.5;
  }

  /* Verticaux : le cadre épouse l'œuvre (fini le padding horizontal
     ridicule), centré dans l'espace laissé devant la fiche */
  &[data-categorie='vertical'],
  &[data-categorie='vertical-narrow'] {
    --facteur: 1.05;
  }



  display: grid;
  grid-template-columns: minmax(0, 1fr) clamp(15rem, 22vw, 20rem);
  gap: var(--souffle); /* réduit : la scène profite à l'œuvre, pas aux marges */
  align-items: start;
}

.oeuvre__cadre {
  display: grid;
  place-items: center;
  min-height: var(--hauteur-utile); /* le cadre occupe toute la hauteur disponible */
  padding-block: 0.15rem;           /* quasi nul : l'œuvre touche presque le cadre */
  padding-inline: clamp(0.8rem, 2vw, 1.6rem);
  background: var(--encre);
  border: 1px solid var(--bordure);
  border-radius: var(--rayon);
  box-shadow: var(--halo-lune), var(--ombre-cadre);

  img {
    max-height: calc(var(--hauteur-utile) * var(--facteur, 1));
    width: auto;
    max-width: 100%;
    object-fit: contain;
  }
}

.oeuvre__fiche {
  position: sticky;
  top: 7rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  h1 {
    font-size: clamp(2rem, 4vw, 3rem);
  }
}

.oeuvre__badge {
  align-self: flex-start;
  padding: 0.4em 1em;
  border: 1px solid var(--bordure);
  border-radius: 999px;
  font-size: 0.74rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--brume);

  &[data-ton='disponible'] {
    border-color: rgb(185 197 218 / 0.4);
    color: var(--argent);
  }

  &[data-ton='tirage'] {
    border-color: rgb(126 67 86 / 0.7);
    color: color-mix(in srgb, var(--sang) 65%, var(--lune));
  }
}

.oeuvre__details {
  display: flex;
  flex-direction: column;

  div {
    display: flex;
    justify-content: space-between;
    gap: 1.5rem;
    padding-block: 0.7rem;
    border-bottom: 1px solid var(--bordure);
  }

  dt {
    font-size: 0.74rem;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: var(--ombre);
  }

  dd {
    margin: 0;
    text-align: right;
    color: var(--lune);
  }
}

.oeuvre__texte {
  color: var(--brume);
  font-style: italic;
}

.oeuvre__circulation {
  display: flex;
  justify-content: space-between;
  gap: var(--souffle);
  margin-top: var(--respiration);
  border-top: 1px solid var(--bordure);
  padding-top: 1.6rem;

  :last-child {
    text-align: right;
  }
}

.oeuvre__voisine {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-family: var(--police-titres);
  font-size: 1.25rem;
  color: var(--argent);
  transition: color var(--vitesse) var(--easing);

  span {
    font-family: var(--police-texte);
    font-size: 0.72rem;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: var(--ombre);
  }

  &:hover {
    color: var(--lune);
  }
}

@media (width < 55rem) {
  .oeuvre__scene {
    grid-template-columns: 1fr;

    /* En colonne, la fenêtre est entièrement dédiée à l'œuvre */
    --hauteur-utile: calc(100dvh - 12rem);
  }

  .oeuvre__fiche {
    position: static;
  }
}
</style>
