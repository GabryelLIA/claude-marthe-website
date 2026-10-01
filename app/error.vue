<script setup lang="ts">
import type { NuxtError } from '#app';

defineProps<{ error: NuxtError }>();

const revenir = () => clearError({ redirect: '/' });

useHead({ title: 'Page introuvable' });
</script>

<template>
  <div class="erreur">
    <p class="surtitre">{{ error.statusCode === 404 ? 'Égaré dans la nuit' : 'Un songe interrompu' }}</p>
    <h1>{{ error.statusCode === 404 ? 'Cette page sombre dans l’ombre.' : 'Quelque chose s’est déréglé.' }}</h1>
    <button type="button" class="bouton" @click="revenir">Revenir aux tableaux</button>
  </div>
</template>

<style scoped>
.erreur {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  min-height: 100dvh;
  padding: var(--souffle);
  text-align: center;

  h1 {
    max-width: 30rem;
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    color: var(--brume);
  }
}
</style>
