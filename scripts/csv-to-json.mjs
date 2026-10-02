/**
 * Sérialisation de ClaudeMartheDetailsSite.csv en JSON, exécutée à chaque build.
 * Les titres du CSV correspondent exactement aux fichiers de images/.
 *
 * Produit :
 * - ClaudeMartheDetailsSite.json (œuvres + variantes d'images et leurs largeurs)
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
const imagesPublic = join(racine, 'public', 'images');
const logoSource = join(racine, 'logos', 'Logo Claude Marthe Blanc.svg');
const logoPublic = join(racine, 'public', 'logo-claude-marthe.svg');

const LARGEUR_MINIATURE = 900;
const LARGEUR_MOYENNE = 1800;
const QUALITE = 82;

/** minuscules, sans accents ni signes */
const normaliser = (texte) =>
  texte
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** Redimensionne une image et renvoie sa largeur réelle */
async function variante(source, destination, largeur) {
  const info = await sharp(source)
    .resize({ width: largeur, withoutEnlargement: true })
    .webp({ quality: QUALITE })
    .toFile(destination);
  return info.width;
}

const lignes = readFileSync(csvPath, 'utf8')
  .replace(/^\uFEFF/, '')
  .split(/\r?\n/)
  .filter((ligne) => ligne.trim());

mkdirSync(join(imagesPublic, 'mini'), { recursive: true });
mkdirSync(join(imagesPublic, 'moy'), { recursive: true });

const donnees = lignes.slice(1).map((ligne, index) => {
  const champs = ligne.split(',');
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
    texte: valeur(7) || null,
    image: `/images/${slug}.webp`,
    source: join(imagesSource, `${titre}.webp`),
  };
});

const oeuvres = await Promise.all(
  donnees.map(async ({ source, ...oeuvre }) => {
    copyFileSync(source, join(imagesPublic, `${oeuvre.slug}.webp`));

    const [largeur, largeurMiniature, largeurMoyenne] = await Promise.all([
      sharp(source).metadata().then((m) => m.width),
      variante(source, join(imagesPublic, 'mini', `${oeuvre.slug}.webp`), LARGEUR_MINIATURE),
      variante(source, join(imagesPublic, 'moy', `${oeuvre.slug}.webp`), LARGEUR_MOYENNE),
    ]);

    return {
      ...oeuvre,
      largeur,
      miniature: `/images/mini/${oeuvre.slug}.webp`,
      largeurMiniature,
      moyenne: `/images/moy/${oeuvre.slug}.webp`,
      largeurMoyenne,
    };
  }),
);

// Catégories dans l'ordre de première apparition (une rangée de galerie chacune)
const categories = [...new Set(oeuvres.map((o) => o.categorie))];

copyFileSync(logoSource, logoPublic);
writeFileSync(
  jsonPath,
  JSON.stringify({ genereLe: new Date().toISOString(), categories, oeuvres }, null, 2) + '\n',
);

console.log(
  `✔ ${oeuvres.length} œuvres sérialisées dans ${jsonPath} (${categories.length} catégories : ${categories.join(', ')})`,
);
