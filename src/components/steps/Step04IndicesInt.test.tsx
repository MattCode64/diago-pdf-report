import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Step04IndicesInt } from './Step04IndicesInt';
import { renderWithForm } from '../../test/renderWithForm';
import { SYMPTOMES_INTERIEUR } from '../../data/constants';

describe('Step04IndicesInt', () => {
  describe('rendering', () => {
    it('affiche le titre et le sous-titre de l\'étape', () => {
      renderWithForm(<Step04IndicesInt />);
      expect(screen.getByText('Étape 4')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Indices intérieurs', level: 2 }),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Symptômes relevés à l'intérieur du bâtiment."),
      ).toBeInTheDocument();
    });

    it('affiche les deux champs : Symptômes relevés et Observations', () => {
      renderWithForm(<Step04IndicesInt />);
      expect(screen.getByText('Symptômes relevés')).toBeInTheDocument();
      expect(
        screen.getByLabelText('Observations intérieures complémentaires'),
      ).toBeInTheDocument();
    });

    it('le textarea Observations a rows=4', () => {
      renderWithForm(<Step04IndicesInt />);
      expect(
        screen.getByLabelText('Observations intérieures complémentaires'),
      ).toHaveAttribute('rows', '4');
    });
  });

  describe('checkbox group SYMPTOMES_INTERIEUR', () => {
    it('affiche une checkbox pour chacun des 16 symptômes intérieurs', () => {
      renderWithForm(<Step04IndicesInt />);
      expect(SYMPTOMES_INTERIEUR.length).toBe(16);
      SYMPTOMES_INTERIEUR.forEach((s) => {
        expect(screen.getByRole('checkbox', { name: s })).toBeInTheDocument();
      });
    });

    it('aucune case n\'est cochée par défaut', () => {
      renderWithForm(<Step04IndicesInt />);
      SYMPTOMES_INTERIEUR.forEach((s) => {
        expect(screen.getByRole('checkbox', { name: s })).not.toBeChecked();
      });
    });

    it('pré-coche les symptômes présents dans defaultValues.sympInt', () => {
      renderWithForm(<Step04IndicesInt />, {
        defaultValues: { sympInt: ['Moisissures', 'Mauvaises odeurs'] },
      });
      expect(screen.getByRole('checkbox', { name: 'Moisissures' })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: 'Mauvaises odeurs' })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: 'Champignons' })).not.toBeChecked();
    });

    it('coche un symptôme au clic et l\'ajoute au form state', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step04IndicesInt />);

      await user.click(screen.getByRole('checkbox', { name: 'Dégradation des murs' }));

      expect(methods.getValues('sympInt')).toEqual(['Dégradation des murs']);
    });

    it('décoche un symptôme déjà coché', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step04IndicesInt />, {
        defaultValues: { sympInt: ['Radon', 'Eczéma'] },
      });

      await user.click(screen.getByRole('checkbox', { name: 'Radon' }));

      expect(methods.getValues('sympInt')).toEqual(['Eczéma']);
    });

    it('gère correctement les libellés avec apostrophe', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step04IndicesInt />);

      const cb = screen.getByRole('checkbox', { name: "Pollution de l'air intérieur" });
      await user.click(cb);

      expect(cb).toBeChecked();
      expect(methods.getValues('sympInt')).toEqual(["Pollution de l'air intérieur"]);
    });

    it('coche plusieurs symptômes dans l\'ordre des clics', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step04IndicesInt />);

      await user.click(screen.getByRole('checkbox', { name: 'Infiltrations' }));
      await user.click(screen.getByRole('checkbox', { name: 'Sensation de froid' }));
      await user.click(screen.getByRole('checkbox', { name: 'Asthme / bronchites / rhinite' }));

      expect(methods.getValues('sympInt')).toEqual([
        'Infiltrations',
        'Sensation de froid',
        'Asthme / bronchites / rhinite',
      ]);
    });
  });

  describe('textarea Observations intérieures', () => {
    it('met à jour obsInt à la saisie', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step04IndicesInt />);

      await user.type(
        screen.getByLabelText('Observations intérieures complémentaires'),
        "Présence d'auréoles brunes sur le plafond de la chambre",
      );

      expect(methods.getValues('obsInt')).toBe(
        "Présence d'auréoles brunes sur le plafond de la chambre",
      );
    });

    it('pré-remplit la textarea avec defaultValues.obsInt', () => {
      renderWithForm(<Step04IndicesInt />, {
        defaultValues: { obsInt: 'Observation initiale' },
      });
      expect(
        screen.getByLabelText('Observations intérieures complémentaires'),
      ).toHaveValue('Observation initiale');
    });
  });

  describe('scénario complet', () => {
    it('permet de cocher plusieurs symptômes + saisir des observations', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step04IndicesInt />);

      await user.click(screen.getByRole('checkbox', { name: 'Buée / condensation' }));
      await user.click(screen.getByRole('checkbox', { name: 'Taches / auréoles' }));
      await user.type(
        screen.getByLabelText('Observations intérieures complémentaires'),
        'Surtout en hiver',
      );

      const values = methods.getValues();
      expect(values.sympInt).toEqual(['Buée / condensation', 'Taches / auréoles']);
      expect(values.obsInt).toBe('Surtout en hiver');
    });
  });
});
