import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Step03History } from './Step03History';
import { renderWithForm } from '../../test/renderWithForm';
import { DATE_APPARITION, PIECES } from '../../data/constants';

describe('Step03History', () => {
  describe('rendering', () => {
    it('affiche le titre et le sous-titre de l\'étape', () => {
      renderWithForm(<Step03History />);
      expect(screen.getByText('Étape 3')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', {
          name: 'Historique des symptômes & localisation',
          level: 2,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Quand les symptômes ont été constatés et où ils se situent.'),
      ).toBeInTheDocument();
    });

    it('affiche les trois champs principaux', () => {
      renderWithForm(<Step03History />);
      expect(screen.getByLabelText("Date d'apparition des symptômes")).toBeInTheDocument();
      expect(screen.getByText('Pièces concernées')).toBeInTheDocument();
      expect(screen.getByLabelText("Observations sur l'historique")).toBeInTheDocument();
    });

    it('le textarea Observations a rows=4', () => {
      renderWithForm(<Step03History />);
      expect(screen.getByLabelText("Observations sur l'historique")).toHaveAttribute(
        'rows',
        '4',
      );
    });
  });

  describe('select Date d\'apparition', () => {
    it('contient toutes les options DATE_APPARITION + un placeholder vide', () => {
      renderWithForm(<Step03History />);
      const select = screen.getByLabelText(
        "Date d'apparition des symptômes",
      ) as HTMLSelectElement;
      const optionValues = within(select)
        .getAllByRole('option')
        .map((o) => (o as HTMLOptionElement).value);
      expect(optionValues).toContain('');
      DATE_APPARITION.forEach((d) => expect(optionValues).toContain(d));
    });

    it('met à jour le formulaire à la sélection', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step03History />);

      await user.selectOptions(
        screen.getByLabelText("Date d'apparition des symptômes"),
        '< 6 mois',
      );

      expect(methods.getValues('histDate')).toBe('< 6 mois');
    });
  });

  describe('checkbox group Pièces concernées', () => {
    it('affiche une checkbox pour chaque pièce de la liste PIECES', () => {
      renderWithForm(<Step03History />);
      PIECES.forEach((piece) => {
        expect(screen.getByRole('checkbox', { name: piece })).toBeInTheDocument();
      });
    });

    it('aucune case n\'est cochée par défaut', () => {
      renderWithForm(<Step03History />);
      PIECES.forEach((piece) => {
        expect(screen.getByRole('checkbox', { name: piece })).not.toBeChecked();
      });
    });

    it('pré-coche les pièces présentes dans defaultValues.histPieces', () => {
      renderWithForm(<Step03History />, {
        defaultValues: { histPieces: ['Chambre', 'Salon'] },
      });
      expect(screen.getByRole('checkbox', { name: 'Chambre' })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: 'Salon' })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: 'Cuisine' })).not.toBeChecked();
    });

    it('coche une pièce au clic et l\'ajoute au form state', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step03History />);

      await user.click(screen.getByRole('checkbox', { name: 'Cuisine' }));

      expect(screen.getByRole('checkbox', { name: 'Cuisine' })).toBeChecked();
      expect(methods.getValues('histPieces')).toEqual(['Cuisine']);
    });

    it('décoche une pièce déjà cochée et la retire du form state', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step03History />, {
        defaultValues: { histPieces: ['Chambre', 'Salon', 'Cuisine'] },
      });

      await user.click(screen.getByRole('checkbox', { name: 'Salon' }));

      expect(screen.getByRole('checkbox', { name: 'Salon' })).not.toBeChecked();
      expect(methods.getValues('histPieces')).toEqual(['Chambre', 'Cuisine']);
    });

    it('coche plusieurs pièces dans l\'ordre où on clique', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step03History />);

      await user.click(screen.getByRole('checkbox', { name: 'Garage' }));
      await user.click(screen.getByRole('checkbox', { name: 'Combles' }));
      await user.click(screen.getByRole('checkbox', { name: 'Sous-sol' }));

      expect(methods.getValues('histPieces')).toEqual(['Garage', 'Combles', 'Sous-sol']);
    });

    it('toggle un même item plusieurs fois sans corrompre le state', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step03History />);

      const checkbox = screen.getByRole('checkbox', { name: 'Toilettes' });
      await user.click(checkbox);
      await user.click(checkbox);
      await user.click(checkbox);

      expect(methods.getValues('histPieces')).toEqual(['Toilettes']);
    });
  });

  describe('textarea Observations', () => {
    it('met à jour histObs à la saisie', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step03History />);

      const textarea = screen.getByLabelText("Observations sur l'historique");
      await user.type(textarea, 'Apparu après gros orage de janvier');

      expect(methods.getValues('histObs')).toBe('Apparu après gros orage de janvier');
    });

    it('pré-remplit la textarea avec defaultValues.histObs', () => {
      renderWithForm(<Step03History />, {
        defaultValues: { histObs: 'Note préexistante' },
      });
      expect(screen.getByLabelText("Observations sur l'historique")).toHaveValue(
        'Note préexistante',
      );
    });
  });

  describe('scénario complet', () => {
    it('permet de remplir tous les champs ensemble', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step03History />);

      await user.selectOptions(
        screen.getByLabelText("Date d'apparition des symptômes"),
        '+ 1 an',
      );
      await user.click(screen.getByRole('checkbox', { name: 'Salle de bain' }));
      await user.click(screen.getByRole('checkbox', { name: 'Cuisine' }));
      await user.type(
        screen.getByLabelText("Observations sur l'historique"),
        'Humidité persistante',
      );

      const values = methods.getValues();
      expect(values.histDate).toBe('+ 1 an');
      expect(values.histPieces).toEqual(['Salle de bain', 'Cuisine']);
      expect(values.histObs).toBe('Humidité persistante');
    });
  });
});
