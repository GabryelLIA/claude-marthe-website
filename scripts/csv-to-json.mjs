/**
 * Sérialisation de ClaudeMartheDetailsSite.csv en JSON, exécutée à chaque build.
 *
 * - Nettoie les données brutes (BOM, #N/A, lignes du triptyque sans titre).
 * - Associe à chaque œuvre son fichier image (public/images), renommé par slug.
 * - Produit ClaudeMartheDetailsSite.json à la racine.
 */
import { readFileSync, writeFileSync, readdirSync, copyFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const racine = dirname(dirname(fileURLToPath(import.meta.url)));
const csvPath = join(racine, 'ClaudeMartheDetailsSite.csv');
const jsonPath = join(racine, 'ClaudeMartheDetailsSite.json');
const imagesSource = join(racine, 'images');
const imagesPublic = join(racine, 'public', 'images');
const logoSource = join(racine, 'logos', 'Logo Claude Marthe Blanc.svg');
const logoPublic = join(racine, 'public', 'logo-claude-marthe.svg');

/* ---------------------------------- outils --------------------------------- */

/** minuscules, sans accents ni signes : base du slug et des rapprochements */
const normaliser = (texte) =>
  texte
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const versNombre = (texte) => {
  const valeur = Number.parseFloat(texte.replace(',', '.'));
  return Number.isFinite(valeur) ? valeur : null;
};

const propre = (texte) => texte.trim() || null;

/* ---------------------- rapprochement titres / fichiers --------------------- */

/**
 * Le CSV et les noms de fichiers diffèrent parfois (accents, parenthèses,
 * coquilles). Table d'exceptions : clé = titre CSV normalisé, valeur = fichier.
 */
const EXCEPTIONS_FICHIERS = {
  'poesie-de-l-eau': "Poësie de l'Eau.webp",
  'point-de-vue-intergenerationnel-vue-d-ensemble': "Point de vue Intergénarationnel - Vue d'ensemble.webp",
  'sans-titre-5': 'Sans titre 5.webp',
  'sans-titre-1': 'Sans Titre 1.webp',
  'sans-titre-2': 'Sans Titre 2.webp',
  'songe-lunaire': 'Songe Lunaire.webp',
};

/** Panneaux du triptyque (titres vides dans le CSV), dans l'ordre des lignes */
const TRIPTYQUE = {
  titre: 'Point de vue Intergénérationnel',
  fichiers: [
    'Point de vue Intergénarationnel 1.webp',
    'Point de vue Intergénarationnel 2.webp',
    'Point de vue Intergénarationnel 3.webp',
  ],
  numeros: ['I', 'II', 'III'],
};

let rangTriptyque = 0;

/** Index des fichiers réels, normalisés NFC (certains disques stockent en NFD) */
const fichiersDisponibles = readdirSync(imagesSource).map((nom) => nom.normalize('NFC'));

function fichierPour(titreCsv) {
  const cle = normaliser((titreCsv ?? '').replace(/\s*\([^)]*\)\s*/g, ' ').trim());

  // Triptyque : premier panneau titré, les suivants sans titre dans le CSV
  if (!titreCsv || cle === normaliser(TRIPTYQUE.titre)) {
    const fichier = TRIPTYQUE.fichiers[rangTriptyque];
    const numero = TRIPTYQUE.numeros[rangTriptyque];
    rangTriptyque += 1;
    return { fichier, titre: `${TRIPTYQUE.titre} — Panneau ${numero}` };
  }

  // Titre sans la mention entre parenthèses (« Sans titre 5 (bouquet) »…)
  const fichier =
    EXCEPTIONS_FICHIERS[cle] ??
    fichiersDisponibles.find((nom) => normaliser(nom.replace(/\.webp$/, '')) === cle) ??
    `${titreCsv}.webp`;
  return { fichier, titre: titreCsv };
}

/* --------------------------------- lecture --------------------------------- */

const lignes = readFileSync(csvPath, 'utf8')
  .replace(/^\uFEFF/, '')
  .split(/\r?\n/)
  .filter((ligne) => ligne.trim());

const entetes = lignes[0].split(',').map((e) => e.trim());
const [TITRE, CATEGORIE, DIMENSIONS, TECHNIQUE, TYPE, PRIX, DISPONIBILITE, TEXTE] = entetes;

mkdirSync(imagesPublic, { recursive: true });
copyFileSync(logoSource, logoPublic);

const oeuvres = lignes.slice(1).map((ligne, index) => {
  const champs = ligne.split(',');
  const valeur = (i) => propre(champs[i] ?? '') ?? '';
  const brutTitre = valeur(0);
  const { fichier, titre } = fichierPour(brutTitre);
  const categorie = normaliser(valeur(1));
  const slug = normaliser(titre) || `oeuvre-${index + 1}`;

  copyFileSync(join(imagesSource, fichier), join(imagesPublic, `${slug}.webp`));

  return {
    slug,
    titre,
    categorie,
    dimensions: valeur(2),
    technique: valeur(3),
    type: valeur(4) || null,
    prix: versNombre(valeur(5) === '#N/A' ? '' : valeur(5)),
    disponibilite: valeur(6) || null,
    texte: valeur(7) || null,
    image: `/images/${slug}.webp`,
  };
});

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
