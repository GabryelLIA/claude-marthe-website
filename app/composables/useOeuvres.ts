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
  tiragesFineArt: Array<{
    dimensions: string;
    formatCourt: string | null;
    prix: number | null;
  }>;
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

/** Photo de l'artiste (hors œuvres), sérialisée par scripts/csv-to-json.mjs */
export interface PhotoArtiste {
  slug: string;
  image: string;
  largeur: number;
  miniature: string;
  largeurMiniature: number;
  moyenne: string;
  largeurMoyenne: number;
}

export const usePhotoArtiste = (slug: string): PhotoArtiste | undefined =>
  (donnees.photosArtiste as PhotoArtiste[]).find((photo) => photo.slug === slug);
