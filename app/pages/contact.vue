<script setup lang="ts">
const champs = reactive({ nom: '', email: '', message: '' });

const envoyer = () => {
  const objet = encodeURIComponent(`Site Claude Marthe — message de ${champs.nom}`);
  const corps = encodeURIComponent(`${champs.message}\n\n— ${champs.nom} (${champs.email})`);
  window.location.href = `mailto:contact@claudemarthe.art?subject=${objet}&body=${corps}`;
};

useHead({
  title: 'Contact',
});
</script>

<template>
  <div class="page">
    <section class="conteneur contact">
      <header class="titre-section">
        <p class="surtitre">Faire passer un message dans la nuit</p>
        <h1>Contact</h1>
      </header>

      <div class="contact__colonnes">
        <div class="contact__infos">
          <p>
            Pour l’acquisition d’un original ou d’un tirage fine art, une commande
            particulière, une exposition ou une collaboration, écrivez-moi.
          </p>
          <dl>
            <div>
              <dt>Atelier</dt>
              <dd>Sur rendez-vous, Bordeaux</dd>
            </div>
            <div>
              <dt>Courriel</dt>
              <dd><a href="mailto:contact@claudemarthe.art">contact@claudemarthe.art</a></dd>
            </div>
            <div>
              <dt>Réponse</dt>
              <dd>Sous quelques lunes — trois à cinq jours</dd>
            </div>
          </dl>
        </div>

        <form class="formulaire" @submit.prevent="envoyer">
          <label>
            <span>Votre nom</span>
            <input v-model="champs.nom" type="text" name="nom" required autocomplete="name" />
          </label>
          <label>
            <span>Votre courriel</span>
            <input v-model="champs.email" type="email" name="email" required autocomplete="email" />
          </label>
          <label>
            <span>Votre message</span>
            <textarea v-model="champs.message" name="message" rows="6" required />
          </label>
          <button type="submit" class="bouton bouton--plein">Envoyer</button>
        </form>
      </div>
    </section>
  </div>
</template>

<style scoped>
.contact__colonnes {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
  gap: var(--respiration);

  @media (width < 55rem) {
    grid-template-columns: 1fr;
  }
}

.contact__infos {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  color: var(--brume);

  dl {
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    border-left: 1px solid var(--bordure);
    padding-left: 1.1rem;
  }

  dt {
    font-size: 0.72rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--ombre);
  }

  dd {
    margin: 0;
    color: var(--lune);
  }

  a {
    border-bottom: 1px solid var(--bordure);
    transition: border-color var(--vitesse) var(--easing);

    &:hover {
      border-color: var(--argent);
    }
  }
}

.formulaire {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;

  label {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  span {
    font-size: 0.72rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--brume);
  }

  input,
  textarea {
    padding: 0.8rem 1rem;
    border: 1px solid var(--bordure);
    border-radius: var(--rayon);
    background: var(--encre);
    color: var(--lune);
    font: inherit;
    font-weight: 300;
    resize: vertical;
    transition: border-color var(--vitesse) var(--easing);

    &::placeholder {
      color: var(--ombre);
    }

    &:focus {
      outline: none;
      border-color: var(--argent);
    }
  }

  .bouton {
    align-self: flex-start;
  }
}
</style>
