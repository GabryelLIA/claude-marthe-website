/**
 * Œuvres de Claude Marthe — données sérialisées depuis le CSV à chaque build
 * par scripts/csv-to-json.mjs.
 */
import donnees from '../../ClaudeMartheDetailsSite.json';

export interface Oeuvre {
  slug: string;
  titre: string;
  categorie: string;
  dimensions: string;
  technique: string;
  type: string | null;
  prix: number | null;
  disponibilite: string | null;
  texte: string | null;
  image: string;
  largeur: number;
  miniature: string;
  largeurMiniature: number;
  moyenne: string;
  largeurMoyenne: number;
}

export const useOeuvres = (): Oeuvre[] => donnees.oeuvres as Oeuvre[];

export const useOeuvre = (slug: string): Oeuvre | undefined =>
  useOeuvres().find((oeuvre) => oeuvre.slug === slug);
