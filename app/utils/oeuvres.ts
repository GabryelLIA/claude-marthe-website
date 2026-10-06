import type { Oeuvre } from '~/composables/useOeuvres';

/** Libellés français des catégories (une rangée de galerie par catégorie) */
export const libellesCategories: Record<string, string> = {
  vertical: 'Verticaux',
  horizontal: 'Horizontaux',
  square: 'Carrés',
  'vertical-narrow': 'Verticaux étroits',
  'horizontal-wide': 'Panoramiques',
};

export const libelleCategorie = (categorie: string): string =>
  libellesCategories[categorie] ?? categorie;

const formatMontant = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

export const formatPrix = (prix: number | null): string | null =>
  prix === null ? null : formatMontant.format(prix);

/** Original encore disponible ? */
export const estDisponible = (oeuvre: Oeuvre): boolean =>
  (oeuvre.disponibilite ?? '').trim().toLowerCase() === 'original';

/** Vendu mais disponible en tirage fine art ? */
export const enTirage = (oeuvre: Oeuvre): boolean =>
  /tirage/i.test(oeuvre.disponibilite ?? '');

/** Mention d'un tirage fine art, avec son prix : « 59,4 x 42 cm (A2) · 120 € » */
export const mentionTirage = (tirage: Oeuvre['tiragesFineArt'][number]): string => {
  const format = tirage.formatCourt ? ` (${tirage.formatCourt})` : '';
  const prix = tirage.prix !== null ? ` · ${formatPrix(tirage.prix)}` : '';
  return `${tirage.dimensions}${format}${prix}`;
};

/** Mentions des tirages fine art disponibles, jointes : « 59,4 x 42 cm (A2) · 120 € — ... */
export const mentionTirages = (tirages: Oeuvre['tiragesFineArt']): string =>
  tirages.map(mentionTirage).join(' — ');

/** Regroupe les œuvres par catégorie en conservant l'ordre du CSV */
export const groupeParCategorie = (oeuvres: Oeuvre[]): Array<[string, Oeuvre[]]> => {
  const groupes = new Map<string, Oeuvre[]>();
  for (const oeuvre of oeuvres) {
    const liste = groupes.get(oeuvre.categorie) ?? [];
    liste.push(oeuvre);
    groupes.set(oeuvre.categorie, liste);
  }
  return [...groupes.entries()];
};
