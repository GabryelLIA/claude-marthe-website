export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      titleTemplate: '%s — Claude Marthe',
      title: 'Songes & terreurs nocturnes',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Site officiel de Claude Marthe, artiste-peintre. Tableaux, aquarelles et tirages fine art habités par les songes et les terreurs nocturnes.',
        },
        { name: 'theme-color', content: '#06090f' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/logo-claude-marthe.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:ital,wght@0,300;0,400;0,500;1,300&display=swap',
        },
      ],
    },
  },
});
