<template>
  <footer class="pied">
    <div class="conteneur pied__interieur">
      <p class="pied__signature">Claude Marthe · Artiste-peintre et sculptrice <span>—</span> Songes &amp; terreurs nocturnes</p>
      <p class="pied__mention">
        <NuxtLink to="/contact">me contacter</NuxtLink>
      </p>
    </div>
  </footer>
</template>

<style scoped>
.pied {
  margin-top: var(--respiration);
  border-top: 1px solid var(--bordure);
  background: var(--nuit-profonde);
}

.pied__interieur {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.5rem var(--souffle);
  padding-block: 1.6rem;
}

.pied__signature {
  font-family: var(--police-titres);
  font-size: 1.05rem;
  letter-spacing: 0.08em;

  span {
    color: var(--ombre);
  }
}

.pied__mention {
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  color: var(--ombre);

  a {
    color: var(--brume);
    transition: color var(--vitesse) var(--easing);

    &:hover {
      color: var(--lune);
    }
  }
}
</style>
