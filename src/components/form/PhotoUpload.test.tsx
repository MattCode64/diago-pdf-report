import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithForm } from '../../test/renderWithForm';

// Le composant utilise compressImage (browser-image-compression) — on stube.
vi.mock('../../utils/compressImage', () => ({
  compressImage: vi.fn(async (file: File) => `data:image/jpeg;base64,fake-${file.name}`),
}));

import { PhotoUpload } from './PhotoUpload';

describe('PhotoUpload', () => {
  describe('rendering', () => {
    it('affiche le label d\'ajout de photos', () => {
      renderWithForm(<PhotoUpload />);
      expect(
        screen.getByText('Ajouter des photos (JPG, PNG, HEIC…)'),
      ).toBeInTheDocument();
    });

    it('affiche le message d\'aide sur la compression', () => {
      renderWithForm(<PhotoUpload />);
      expect(
        screen.getByText(/Les images sont automatiquement compressées/),
      ).toBeInTheDocument();
    });

    it('contient un input type="file" accept="image/*" multiple', () => {
      const { container } = renderWithForm(<PhotoUpload />);
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      expect(input).toBeInTheDocument();
      expect(input.accept).toBe('image/*');
      expect(input.multiple).toBe(true);
    });
  });

  describe('bug iOS — ouverture de la galerie photo', () => {
    it('l\'input ne doit PAS avoir d\'attribut "capture" — sinon iOS Safari force la caméra et bloque la galerie', () => {
      // Régression : Steven (utilisateur iOS) ne pouvait pas ouvrir sa galerie photo
      // tant que `capture="environment"` était présent.
      const { container } = renderWithForm(<PhotoUpload />);
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      expect(input).not.toHaveAttribute('capture');
    });
  });

  describe('grille des photos existantes', () => {
    it('n\'affiche pas de grille quand il n\'y a aucune photo', () => {
      const { container } = renderWithForm(<PhotoUpload />);
      expect(container.querySelectorAll('img').length).toBe(0);
    });

    it('affiche une vignette par photo présente dans le form state', () => {
      const { container } = renderWithForm(<PhotoUpload />, {
        defaultValues: {
          photos: ['data:image/jpeg;base64,one', 'data:image/jpeg;base64,two'],
        },
      });
      const imgs = container.querySelectorAll('img');
      expect(imgs.length).toBe(2);
      expect(imgs[0]).toHaveAttribute('alt', 'Annexe 1');
      expect(imgs[1]).toHaveAttribute('alt', 'Annexe 2');
    });

    it('affiche un bouton de suppression accessible par photo', () => {
      renderWithForm(<PhotoUpload />, {
        defaultValues: {
          photos: ['data:image/jpeg;base64,a', 'data:image/jpeg;base64,b'],
        },
      });
      expect(
        screen.getByRole('button', { name: 'Supprimer la photo 1' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Supprimer la photo 2' }),
      ).toBeInTheDocument();
    });
  });
});
