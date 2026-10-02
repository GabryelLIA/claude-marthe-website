<script setup lang="ts">
defineProps<{ surtitre: string; intro?: string }>();
</script>

<template>
  <header class="entete-galerie">
    <div class="entete-galerie__titre">
      <p class="surtitre">{{ surtitre }}</p>
      <h1><slot /></h1>
    </div>
    <p v-if="intro" class="entete-galerie__intro">{{ intro }}</p>
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
  max-width: 26rem;
  color: var(--brume);
}
</style>
