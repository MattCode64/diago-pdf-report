import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Step05IndicesExt } from './Step05IndicesExt';
import { renderWithForm } from '../../test/renderWithForm';
import { SYMPTOMES_EXTERIEUR } from '../../data/constants';

describe('Step05IndicesExt', () => {
  describe('rendering', () => {
    it('affiche le titre et le sous-titre de l\'étape', () => {
      renderWithForm(<Step05IndicesExt />);
      expect(screen.getByText('Étape 5')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Indices extérieurs', level: 2 }),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Symptômes relevés sur l'enveloppe extérieure du bâtiment."),
      ).toBeInTheDocument();
    });

    it('affiche les deux champs : Symptômes relevés et Observations', () => {
      renderWithForm(<Step05IndicesExt />);
      expect(screen.getByText('Symptômes relevés')).toBeInTheDocument();
      expect(
        screen.getByLabelText('Observations extérieures complémentaires'),
      ).toBeInTheDocument();
    });

    it('le textarea Observations a rows=4', () => {
      renderWithForm(<Step05IndicesExt />);
      expect(
        screen.getByLabelText('Observations extérieures complémentaires'),
      ).toHaveAttribute('rows', '4');
    });
  });

  describe('checkbox group SYMPTOMES_EXTERIEUR', () => {
    it('affiche une checkbox pour chacun des 11 symptômes extérieurs', () => {
      renderWithForm(<Step05IndicesExt />);
      expect(SYMPTOMES_EXTERIEUR.length).toBe(11);
      SYMPTOMES_EXTERIEUR.forEach((s) => {
        expect(screen.getByRole('checkbox', { name: s })).toBeInTheDocument();
      });
    });

    it('inclut une option "RAS" en premier', () => {
      renderWithForm(<Step05IndicesExt />);
      expect(screen.getByRole('checkbox', { name: 'RAS' })).toBeInTheDocument();
    });

    it('aucune case n\'est cochée par défaut', () => {
      renderWithForm(<Step05IndicesExt />);
      SYMPTOMES_EXTERIEUR.forEach((s) => {
        expect(screen.getByRole('checkbox', { name: s })).not.toBeChecked();
      });
    });

    it('pré-coche les symptômes présents dans defaultValues.sympExt', () => {
      renderWithForm(<Step05IndicesExt />, {
        defaultValues: { sympExt: ['Fissures', 'Salpêtre'] },
      });
      expect(screen.getByRole('checkbox', { name: 'Fissures' })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: 'Salpêtre' })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: 'Mousse' })).not.toBeChecked();
    });

    it('coche un symptôme au clic et l\'ajoute au form state', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step05IndicesExt />);

      await user.click(screen.getByRole('checkbox', { name: 'Peinture écaillée' }));

      expect(methods.getValues('sympExt')).toEqual(['Peinture écaillée']);
    });

    it('décoche un symptôme déjà coché', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step05IndicesExt />, {
        defaultValues: { sympExt: ['Mousse', 'Lichens sur murs'] },
      });

      await user.click(screen.getByRole('checkbox', { name: 'Mousse' }));

      expect(methods.getValues('sympExt')).toEqual(['Lichens sur murs']);
    });

    it('permet de cocher "RAS" comme un symptôme', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step05IndicesExt />);

      await user.click(screen.getByRole('checkbox', { name: 'RAS' }));

      expect(screen.getByRole('checkbox', { name: 'RAS' })).toBeChecked();
      expect(methods.getValues('sympExt')).toEqual(['RAS']);
    });

    it('coche plusieurs symptômes dans l\'ordre des clics', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step05IndicesExt />);

      await user.click(screen.getByRole('checkbox', { name: 'Pieds de murs humides' }));
      await user.click(screen.getByRole('checkbox', { name: 'Détachement du parement' }));
      await user.click(screen.getByRole('checkbox', { name: 'Chute de maçonnerie' }));

      expect(methods.getValues('sympExt')).toEqual([
        'Pieds de murs humides',
        'Détachement du parement',
        'Chute de maçonnerie',
      ]);
    });
  });

  describe('textarea Observations extérieures', () => {
    it('met à jour obsExt à la saisie', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step05IndicesExt />);

      await user.type(
        screen.getByLabelText('Observations extérieures complémentaires'),
        'Façade nord particulièrement dégradée',
      );

      expect(methods.getValues('obsExt')).toBe('Façade nord particulièrement dégradée');
    });

    it('pré-remplit la textarea avec defaultValues.obsExt', () => {
      renderWithForm(<Step05IndicesExt />, {
        defaultValues: { obsExt: 'Note préexistante' },
      });
      expect(
        screen.getByLabelText('Observations extérieures complémentaires'),
      ).toHaveValue('Note préexistante');
    });
  });

  describe('scénario complet', () => {
    it('permet de cocher plusieurs symptômes + saisir des observations', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step05IndicesExt />);

      await user.click(screen.getByRole('checkbox', { name: 'Fissures' }));
      await user.click(screen.getByRole('checkbox', { name: 'Taches assombrissantes' }));
      await user.type(
        screen.getByLabelText('Observations extérieures complémentaires'),
        'Très visible côté rue',
      );

      const values = methods.getValues();
      expect(values.sympExt).toEqual(['Fissures', 'Taches assombrissantes']);
      expect(values.obsExt).toBe('Très visible côté rue');
    });
  });
});
