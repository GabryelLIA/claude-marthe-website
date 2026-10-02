<script setup lang="ts">
import type { Oeuvre } from '~/composables/useOeuvres';

const props = defineProps<{ oeuvres: Oeuvre[] }>();
const emit = defineEmits<{ fermer: [] }>();

const index = ref(0);
const enPause = ref(false);

const duree = 5000;
let minuterie: ReturnType<typeof setInterval> | undefined;

const suivant = () => {
  index.value = (index.value + 1) % props.oeuvres.length;
};

const precedent = () => {
  index.value = (index.value - 1 + props.oeuvres.length) % props.oeuvres.length;
};

const demarrer = () => {
  clearInterval(minuterie);
  if (!enPause.value) {
    minuterie = setInterval(suivant, duree);
  }
};

watch(enPause, demarrer, { immediate: true });
onUnmounted(() => clearInterval(minuterie));

const oeuvreActive = computed(() => props.oeuvres[index.value]);
const oeuvreSuivante = computed(() => props.oeuvres[(index.value + 1) % props.oeuvres.length]);

/* L'œuvre suivante est préchargée : les fondu enchaînés sont instantanés */
useHead({
  link: computed(() => [{ rel: 'preload', as: 'image', href: oeuvreSuivante.value.image }]),
});

const surTouche = (evenement: KeyboardEvent) => {
  const actions: Record<string, () => void> = {
    ArrowRight: suivant,
    ArrowLeft: precedent,
    Escape: () => emit('fermer'),
  };
  actions[evenement.key]?.();
};

onMounted(() => {
  document.documentElement.classList.add('sans-defilement');
  window.addEventListener('keydown', surTouche);
});

onBeforeUnmount(() => {
  document.documentElement.classList.remove('sans-defilement');
  window.removeEventListener('keydown', surTouche);
});
</script>

<template>
  <Teleport to="body">
    <div
      class="diaporama"
      role="dialog"
      aria-modal="true"
      aria-label="Diaporama des œuvres"
      @click.self="emit('fermer')"
    >
      <Transition name="voile" mode="out-in">
        <figure :key="index" class="diaporama__scene">
          <img
            :src="oeuvreActive.image"
            :alt="oeuvreActive.titre"
            :class="{ 'est-en-mouvement': !enPause }"
          />
        </figure>
      </Transition>

      <Transition name="voile" mode="out-in">
        <figcaption :key="index" class="diaporama__legende">
          <span class="diaporama__titre">{{ oeuvreActive.titre }}</span>
          <span v-if="oeuvreActive.technique" class="diaporama__detail">
            {{ oeuvreActive.technique }}<template v-if="oeuvreActive.dimensions">
              · {{ oeuvreActive.dimensions }}</template
            >
          </span>
        </figcaption>
      </Transition>

      <div class="diaporama__commandes">
        <button type="button" class="diaporama__bouton" aria-label="Œuvre précédente" @click="precedent">
          ‹
        </button>
        <button
          type="button"
          class="diaporama__bouton"
          :aria-label="enPause ? 'Reprendre le diaporama' : 'Mettre en pause'"
          @click="enPause = !enPause"
        >
          {{ enPause ? '▶' : '❚❚' }}
        </button>
        <span class="diaporama__compteur" aria-live="polite">
          {{ index + 1 }} / {{ oeuvres.length }}
        </span>
        <button type="button" class="diaporama__bouton" aria-label="Œuvre suivante" @click="suivant">
          ›
        </button>
        <button type="button" class="diaporama__bouton diaporama__bouton--fermer" aria-label="Fermer le diaporama" @click="emit('fermer')">
          ✕
        </button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.diaporama {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  background: rgb(3 5 10 / 0.96);
  backdrop-filter: blur(0.4rem);
  animation: surgir 0.6s var(--easing);
}

.diaporama__scene {
  place-self: center;
  margin: 0;

  img {
    max-height: 76dvh;
    max-width: min(88vw, 70rem);
    margin-inline: auto;
    object-fit: contain;
    box-shadow: var(--halo-lune), var(--ombre-cadre);
  }

  /* Dérive lente, comme un songe */
  img.est-en-mouvement {
    animation: deriver 9s ease-out forwards;
  }
}

.diaporama__legende {
  position: absolute;
  inset: auto 0 5.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  text-align: center;
  pointer-events: none;
}

.diaporama__titre {
  font-family: var(--police-titres);
  font-size: 1.7rem;
  font-style: italic;
  letter-spacing: 0.05em;
  color: var(--lune);
}

.diaporama__detail {
  font-size: 0.8rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--brume);
}

.diaporama__commandes {
  position: absolute;
  inset: auto 0 1.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
}

.diaporama__bouton {
  display: grid;
  place-items: center;
  min-width: 2.6rem;
  min-height: 2.6rem;
  padding: 0 0.6rem;
  border: 1px solid var(--bordure);
  border-radius: 50%;
  background: rgb(12 17 27 / 0.7);
  color: var(--argent);
  font-size: 1rem;
  cursor: pointer;
  transition:
    border-color var(--vitesse) var(--easing),
    color var(--vitesse) var(--easing);

  &:hover {
    border-color: var(--argent);
    color: var(--lune);
  }
}

.diaporama__bouton--fermer {
  position: absolute;
  top: 1.6rem;
  right: 1.6rem;
}

.diaporama__compteur {
  min-width: 4rem;
  text-align: center;
  font-size: 0.8rem;
  letter-spacing: 0.2em;
  color: var(--brume);
}

@keyframes deriver {
  from {
    transform: scale(1);
  }

  to {
    transform: scale(1.045);
  }
}

@keyframes surgir {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.voile-enter-active,
.voile-leave-active {
  transition: opacity 1.1s ease, transform 1.1s ease;
}

.voile-enter-from {
  opacity: 0;
  transform: scale(0.985);
}

.voile-leave-to {
  opacity: 0;
  transform: scale(1.015);
}
</style>
