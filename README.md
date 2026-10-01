# Claude Marthe — Songes & terreurs nocturnes

Site-vitrine sobre et sombre pour l'artiste-peintre Claude Marthe.
Nuxt 4 · Vue 3 · CSS (variables + nesting, très peu de JS).

## Commandes

```bash
npm install        # installation
npm run dev        # développement  (sérialise le CSV puis lance Nuxt)
npm run build      # production     (sérialise le CSV puis build Nuxt)
node .output/server/index.mjs   # prévisualisation du build
```

## Données

- `ClaudeMartheDetailsSite.csv` — source de vérité (titres, catégories, dimensions, prix…).
- `scripts/csv-to-json.mjs` — exécuté à chaque build/dev (`predev`, `prebuild`, `pregenerate`) :
  sérialise le CSV en `ClaudeMartheDetailsSite.json`, associe chaque œuvre à son image,
  copie les images renommées par slug dans `public/images/` et le logo dans `public/`.
  Gère les écarts CSV ↔ fichiers (accents, parenthèses, triptyque « Point de vue
  Intergénérationnel » aux titres partiels).

## Pages

| Route            | Contenu                                                            |
| ---------------- | ------------------------------------------------------------------ |
| `/`              | **Tableaux** — galerie principale, une rangée par catégorie (CATEGORIE) |
| `/aquarelles`    | Aquarelles (filtre `TYPE DE TABLEAU = Aquarelle`)                   |
| `/tirages-fine-art` | Œuvres vendues disponibles en tirage (filtre `DISPONIBILITE`)    |
| `/contact`       | Coordonnées + formulaire (mailto)                                   |
| `/a-propos`      | Biographie de l'artiste                                             |
| `/oeuvre/[slug]` | Page dédiée : image, fiche technique, prix, badge, précédente/suivante |

## Diaporama

Bouton « Lancer le diaporama » en tête des galeries. Plein écran, fondu enchaîné
et dérive lente en CSS ; le JS se limite à l'index actif, la pause et le clavier
(←, →, Échap).
