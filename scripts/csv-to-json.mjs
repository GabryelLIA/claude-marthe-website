/**
 * Sérialisation de ClaudeMartheDetailsSite.csv en JSON, exécutée à chaque build.
 * Les titres du CSV correspondent exactement aux fichiers de images/paintings/.
 * Les photos de l'artiste viennent de images/claudeMarthePhotosArtiste/ et le
 * logo de images/logos/.
 *
 * Produit :
 * - ClaudeMartheDetailsSite.json (œuvres + photos de l'artiste + variantes d'images et leurs largeurs)
 * - public/images/{slug}.webp            (original, copié tel quel)
 * - public/images/mini/{slug}.webp       (miniature, pour les cartes de galerie)
 * - public/images/moy/{slug}.webp        (taille moyenne, pour les pages de détail)
 * - public/logo-claude-marthe.svg
 */
import { readFileSync, writeFileSync, copyFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const racine = dirname(dirname(fileURLToPath(import.meta.url)));
const csvPath = join(racine, 'ClaudeMartheDetailsSite.csv');
const jsonPath = join(racine, 'ClaudeMartheDetailsSite.json');
const imagesSource = join(racine, 'images');
const peinturesSource = join(imagesSource, 'paintings');
const photosArtisteSource = join(imagesSource, 'claudeMarthePhotosArtiste');
const logosSource = join(imagesSource, 'logos');
const imagesPublic = join(racine, 'public', 'images');
const logoPublic = join(racine, 'public', 'logo-claude-marthe.svg');

const LARGEUR_MINIATURE = 900;
const LARGEUR_MOYENNE = 1800;
const QUALITE = 82;

/** Colonnes « FINE ART n » du CSV : décalages de FORMAT, DIMENSIONS (i+1) et PRIX (i+2) */
const COLONNES_FINE_ART = [7, 9];

/** Dimensions reconnues → format court (comparées sans tenir compte de l'ordre l x H) */
const FORMATS_COURTS = {
  A2: [59.4, 42],
  A3: [42, 29.7],
  A4: [29.7, 21],
  A5: [20.8, 14.7],
};

/** Photos de l'artiste exposées sur le site (slug → fichier source) */
const PHOTOS_ARTISTE = [
  { slug: 'photo-contact-claude-marthe', fichier: 'PhotoContactClaudeMarthe.webp' },
  { slug: 'photo-homepage-claude-marthe', fichier: 'PhotoHomepageClaudeMarthe.webp' },
];

/** minuscules, sans accents ni signes */
const normaliser = (texte) =>
  texte
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** Découpe une ligne CSV en champs (gère les guillemets autour des valeurs à virgule) */
const extraireChamps = (ligne) => {
  const champs = [];
  let champ = '';
  let entreGuillemets = false;
  for (const caractere of ligne) {
    if (caractere === '"') {
      entreGuillemets = !entreGuillemets;
    } else if (caractere === ',' && !entreGuillemets) {
      champs.push(champ);
      champ = '';
    } else {
      champ += caractere;
    }
  }
  champs.push(champ);
  return champs;
};

/** '59,4 x 42 cm' → 'A2' (tolérance d'un dixième de centimètre) */
const formatCourt = (dimensions) => {
  const mesure = dimensions
    .replace(/cm/gi, '')
    .split('x')
    .map((nombre) => Math.round(Number.parseFloat(nombre.replace(',', '.')) * 10))
    .filter((nombre) => !Number.isNaN(nombre))
    .sort((a, b) => a - b);
  for (const [format, [a, b]] of Object.entries(FORMATS_COURTS)) {
    const [petit, grand] = [Math.round(a * 10), Math.round(b * 10)].sort((x, y) => x - y);
    if (mesure.length === 2 && mesure[0] === petit && mesure[1] === grand) {
      return format;
    }
  }
  return null;
};

/** Redimensionne une image et renvoie sa largeur réelle */
async function variante(source, destination, largeur) {
  const info = await sharp(source)
    .resize({ width: largeur, withoutEnlargement: true })
    .webp({ quality: QUALITE })
    .toFile(destination);
  return info.width;
}

/** Copie l'original en public/ et génère ses variantes mini/moy avec leurs largeurs */
async function traiterImage(source, slug) {
  copyFileSync(source, join(imagesPublic, `${slug}.webp`));

  const [largeur, largeurMiniature, largeurMoyenne] = await Promise.all([
    sharp(source).metadata().then((m) => m.width),
    variante(source, join(imagesPublic, 'mini', `${slug}.webp`), LARGEUR_MINIATURE),
    variante(source, join(imagesPublic, 'moy', `${slug}.webp`), LARGEUR_MOYENNE),
  ]);

  return {
    image: `/images/${slug}.webp`,
    largeur,
    miniature: `/images/mini/${slug}.webp`,
    largeurMiniature,
    moyenne: `/images/moy/${slug}.webp`,
    largeurMoyenne,
  };
}

const lignes = readFileSync(csvPath, 'utf8')
  .replace(/^\uFEFF/, '')
  .split(/\r?\n/)
  .filter((ligne) => ligne.trim());

mkdirSync(join(imagesPublic, 'mini'), { recursive: true });
mkdirSync(join(imagesPublic, 'moy'), { recursive: true });

const donnees = lignes.slice(1).map((ligne, index) => {
  const champs = extraireChamps(ligne);
  const valeur = (i) => (champs[i] ?? '').trim();
  const titre = valeur(0);
  const slug = normaliser(titre) || `oeuvre-${index + 1}`;

  return {
    slug,
    titre,
    categorie: normaliser(valeur(1)),
    dimensions: valeur(2),
    technique: valeur(3),
    type: valeur(4) || null,
    // '' et '#N/A' donnent NaN, sérialisé en null
    prix: Number.parseFloat(valeur(5).replace(',', '.')) || null,
    disponibilite: valeur(6) || null,
    tiragesFineArt: COLONNES_FINE_ART.flatMap((i) => {
      const dimensions = valeur(i);
      if (!dimensions) return [];
      // '' et '#N/A' donnent NaN, sérialisé en null
      const prix = Number.parseFloat(valeur(i + 1).replace(',', '.')) || null;
      return [{ dimensions, formatCourt: formatCourt(dimensions), prix }];
    }),
    source: join(peinturesSource, `${titre}.webp`),
  };
});

const oeuvres = await Promise.all(
  donnees.map(async ({ source, ...oeuvre }) => ({
    ...oeuvre,
    ...(await traiterImage(source, oeuvre.slug)),
  })),
);

const photosArtiste = await Promise.all(
  PHOTOS_ARTISTE.map(async ({ slug, fichier }) => ({
    slug,
    ...(await traiterImage(join(photosArtisteSource, fichier), slug)),
  })),
);

// Catégories dans l'ordre de première apparition (une rangée de galerie chacune)
const categories = [...new Set(oeuvres.map((o) => o.categorie))];

copyFileSync(join(logosSource, 'Logo Claude Marthe Blanc.svg'), logoPublic);
writeFileSync(
  jsonPath,
  JSON.stringify({ genereLe: new Date().toISOString(), categories, oeuvres, photosArtiste }, null, 2) + '\n',
);

console.log(
  `✔ ${oeuvres.length} œuvres et ${photosArtiste.length} photos de l'artiste sérialisées dans ${jsonPath}` +
    ` (${categories.length} catégories : ${categories.join(', ')})`,
);
