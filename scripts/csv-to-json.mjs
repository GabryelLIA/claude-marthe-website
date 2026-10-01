/**
 * Sérialisation de ClaudeMartheDetailsSite.csv en JSON, exécutée à chaque build.
 * Les titres du CSV correspondent exactement aux fichiers de images/.
 * Produit ClaudeMartheDetailsSite.json et copie les images (renommées par slug)
 * dans public/images/.
 */
import { readFileSync, writeFileSync, copyFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const racine = dirname(dirname(fileURLToPath(import.meta.url)));
const csvPath = join(racine, 'ClaudeMartheDetailsSite.csv');
const jsonPath = join(racine, 'ClaudeMartheDetailsSite.json');
const imagesSource = join(racine, 'images');
const imagesPublic = join(racine, 'public', 'images');
const logoSource = join(racine, 'logos', 'Logo Claude Marthe Blanc.svg');
const logoPublic = join(racine, 'public', 'logo-claude-marthe.svg');

/** minuscules, sans accents ni signes */
const normaliser = (texte) =>
  texte
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const lignes = readFileSync(csvPath, 'utf8')
  .replace(/^\uFEFF/, '')
  .split(/\r?\n/)
  .filter((ligne) => ligne.trim());

const oeuvres = lignes.slice(1).map((ligne, index) => {
  const champs = ligne.split(',');
  const valeur = (i) => (champs[i] ?? '').trim();
  const titre = valeur(0);
  const slug = normaliser(titre) || `oeuvre-${index + 1}`;

  copyFileSync(join(imagesSource, `${titre}.webp`), join(imagesPublic, `${slug}.webp`));

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
  };
});

// Catégories dans l'ordre de première apparition (une rangée de galerie chacune)
const categories = [...new Set(oeuvres.map((o) => o.categorie))];

mkdirSync(imagesPublic, { recursive: true });
copyFileSync(logoSource, logoPublic);
writeFileSync(
  jsonPath,
  JSON.stringify({ genereLe: new Date().toISOString(), categories, oeuvres }, null, 2) + '\n',
);

console.log(
  `✔ ${oeuvres.length} œuvres sérialisées dans ${jsonPath} (${categories.length} catégories : ${categories.join(', ')})`,
);
