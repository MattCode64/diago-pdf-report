import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Step07Consequences } from './Step07Consequences';
import { renderWithForm } from '../../test/renderWithForm';
import { CONSEQUENCES } from '../../data/constants';

describe('Step07Consequences', () => {
  describe('rendering', () => {
    it('affiche le titre et le sous-titre de l\'étape', () => {
      renderWithForm(<Step07Consequences />);
      expect(screen.getByText('Étape 7')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Conséquences', level: 2 }),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Conséquences redoutées ou déjà constatées.'),
      ).toBeInTheDocument();
    });

    it('affiche un label "Conséquences"', () => {
      renderWithForm(<Step07Consequences />);
      // Le titre h2 + le label du checkbox group s'appellent tous deux "Conséquences"
      expect(screen.getAllByText('Conséquences').length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('checkbox group CONSEQUENCES', () => {
    it('affiche une checkbox pour chacune des 13 conséquences', () => {
      renderWithForm(<Step07Consequences />);
      expect(CONSEQUENCES.length).toBe(13);
      CONSEQUENCES.forEach((c) => {
        expect(screen.getByRole('checkbox', { name: c })).toBeInTheDocument();
      });
    });

    it('aucune case n\'est cochée par défaut', () => {
      renderWithForm(<Step07Consequences />);
      CONSEQUENCES.forEach((c) => {
        expect(screen.getByRole('checkbox', { name: c })).not.toBeChecked();
      });
    });

    it('pré-coche les conséquences présentes dans defaultValues.consequences', () => {
      renderWithForm(<Step07Consequences />, {
        defaultValues: {
          consequences: ['Dégradation', 'Inondation'],
        },
      });
      expect(screen.getByRole('checkbox', { name: 'Dégradation' })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: 'Inondation' })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: "Pas d'avis" })).not.toBeChecked();
    });

    it('coche une conséquence au clic et l\'ajoute au form state', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step07Consequences />);

      await user.click(screen.getByRole('checkbox', { name: 'Revente impossible' }));

      expect(methods.getValues('consequences')).toEqual(['Revente impossible']);
    });

    it('décoche une conséquence déjà cochée', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step07Consequences />, {
        defaultValues: {
          consequences: ['Perte de revenus locatifs', 'Interdiction de louer'],
        },
      });

      await user.click(screen.getByRole('checkbox', { name: 'Interdiction de louer' }));

      expect(methods.getValues('consequences')).toEqual(['Perte de revenus locatifs']);
    });

    it('gère les libellés avec apostrophe', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step07Consequences />);

      await user.click(screen.getByRole('checkbox', { name: "Insalubrité ou risque d'insalubrité" }));

      expect(methods.getValues('consequences')).toEqual([
        "Insalubrité ou risque d'insalubrité",
      ]);
    });

    it('coche les options "Risque de maladie grave" et "Risque de maladie chronique" indépendamment', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step07Consequences />);

      await user.click(screen.getByRole('checkbox', { name: 'Risque de maladie grave' }));
      await user.click(screen.getByRole('checkbox', { name: 'Risque de maladie chronique' }));

      expect(methods.getValues('consequences')).toEqual([
        'Risque de maladie grave',
        'Risque de maladie chronique',
      ]);
    });

    it('permet de cocher toutes les conséquences', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step07Consequences />);

      for (const c of CONSEQUENCES) {
        await user.click(screen.getByRole('checkbox', { name: c }));
      }

      expect(methods.getValues('consequences')).toEqual([...CONSEQUENCES]);
    });
  });
});
