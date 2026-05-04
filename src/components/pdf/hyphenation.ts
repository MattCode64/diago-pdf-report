import { Font } from '@react-pdf/renderer';

// Découpe les "mots" qui n'ont pas d'espace pour permettre le wrap dans les cellules
// étroites. Sans ça, un texte comme "FreireFreireFreire..." (saisie utilisateur sans
// espaces) reste un bloc indivisible et déborde du tableau / de la page.
const MAX_WORD_LENGTH = 22;

Font.registerHyphenationCallback((word: string) => {
  if (word.length <= MAX_WORD_LENGTH) return [word];
  const chunks: string[] = [];
  for (let i = 0; i < word.length; i += MAX_WORD_LENGTH) {
    chunks.push(word.substring(i, i + MAX_WORD_LENGTH));
  }
  return chunks;
});

// Sentinelle pour s'assurer que le module est exécuté au moins une fois
export const HYPHENATION_REGISTERED = true;
