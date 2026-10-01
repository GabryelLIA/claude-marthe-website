<script setup lang="ts">
const liens = [
  { vers: '/', libelle: 'Tableaux' },
  { vers: '/aquarelles', libelle: 'Aquarelles' },
  { vers: '/tirages-fine-art', libelle: 'Tirages fine art' },
  { vers: '/contact', libelle: 'Contact' },
  { vers: '/a-propos', libelle: 'À propos de l’artiste' },
];
</script>

<template>
  <header class="entete">
    <div class="conteneur entete__interieur">
      <NuxtLink to="/" class="entete__logo" aria-label="Claude Marthe — accueil">
        <img src="/logo-claude-marthe.svg" alt="Logo Claude Marthe" />
      </NuxtLink>

      <nav aria-label="Navigation principale">
        <ul class="entete__liens">
          <li v-for="lien in liens" :key="lien.vers">
            <NuxtLink :to="lien.vers" :class="{ 'est-active': $route.path === lien.vers }">
              {{ lien.libelle }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.entete {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgb(6 9 15 / 0.82);
  backdrop-filter: blur(0.75rem);
  border-bottom: 1px solid var(--bordure);
}

.entete__interieur {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem var(--souffle);
  padding-block: 0.9rem;
}

.entete__logo img {
  height: 3.4rem;
  width: auto;
  opacity: 0.92;
  transition: opacity var(--vitesse) var(--easing);

  &:hover {
    opacity: 1;
  }
}

.entete__liens {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 1.8rem;
  list-style: none;
  padding: 0;
}

.entete__liens a {
  position: relative;
  padding-block: 0.35rem;
  font-size: 0.8rem;
  font-weight: 400;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--brume);
  transition: color var(--vitesse) var(--easing);

  /* Filet lunaire qui se dessine sous le lien */
  &::after {
    content: '';
    position: absolute;
    inset: auto 0 -1px;
    height: 1px;
    background: var(--argent);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform var(--vitesse) var(--easing);
  }

  &:hover {
    color: var(--lune);
  }

  &.est-active {
    color: var(--lune);

    &::after {
      transform: scaleX(1);
    }
  }
}
</style>
