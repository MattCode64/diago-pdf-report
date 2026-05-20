import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Step06Attentes } from './Step06Attentes';
import { renderWithForm } from '../../test/renderWithForm';
import { ATTENTES } from '../../data/constants';

describe('Step06Attentes', () => {
  describe('rendering', () => {
    it('affiche le titre et le sous-titre de l\'étape', () => {
      renderWithForm(<Step06Attentes />);
      expect(screen.getByText('Étape 6')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Attentes', level: 2 }),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Ce qui motive la demande de diagnostic.'),
      ).toBeInTheDocument();
    });

    it('affiche le label "Attentes du demandeur"', () => {
      renderWithForm(<Step06Attentes />);
      expect(screen.getByText('Attentes du demandeur')).toBeInTheDocument();
    });

    it('n\'affiche pas de textarea (cette étape n\'a que des cases à cocher)', () => {
      renderWithForm(<Step06Attentes />);
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });
  });

  describe('checkbox group ATTENTES', () => {
    it('affiche une checkbox pour chacune des 15 attentes', () => {
      renderWithForm(<Step06Attentes />);
      expect(ATTENTES.length).toBe(15);
      ATTENTES.forEach((a) => {
        expect(screen.getByRole('checkbox', { name: a })).toBeInTheDocument();
      });
    });

    it('aucune case n\'est cochée par défaut', () => {
      renderWithForm(<Step06Attentes />);
      ATTENTES.forEach((a) => {
        expect(screen.getByRole('checkbox', { name: a })).not.toBeChecked();
      });
    });

    it('pré-coche les attentes présentes dans defaultValues.attentes', () => {
      renderWithForm(<Step06Attentes />, {
        defaultValues: {
          attentes: ['Plainte locataire / voisin', 'Demande du médecin'],
        },
      });
      expect(
        screen.getByRole('checkbox', { name: 'Plainte locataire / voisin' }),
      ).toBeChecked();
      expect(
        screen.getByRole('checkbox', { name: 'Demande du médecin' }),
      ).toBeChecked();
      expect(
        screen.getByRole('checkbox', { name: 'Problèmes de santé' }),
      ).not.toBeChecked();
    });

    it('coche une attente au clic et l\'ajoute au form state', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step06Attentes />);

      await user.click(screen.getByRole('checkbox', { name: 'Mise aux normes' }));

      expect(methods.getValues('attentes')).toEqual(['Mise aux normes']);
    });

    it('décoche une attente déjà cochée et la retire du state', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step06Attentes />, {
        defaultValues: {
          attentes: ['Allergies, eczéma', 'Radon', 'Moisissures / champignons'],
        },
      });

      await user.click(screen.getByRole('checkbox', { name: 'Radon' }));

      expect(methods.getValues('attentes')).toEqual([
        'Allergies, eczéma',
        'Moisissures / champignons',
      ]);
    });

    it('gère correctement les libellés avec apostrophe', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step06Attentes />);

      const cb = screen.getByRole('checkbox', { name: "Pollution de l'air intérieur" });
      await user.click(cb);

      expect(cb).toBeChecked();
      expect(methods.getValues('attentes')).toEqual(["Pollution de l'air intérieur"]);
    });

    it('coche plusieurs attentes dans l\'ordre des clics', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step06Attentes />);

      await user.click(screen.getByRole('checkbox', { name: 'Projet de revente' }));
      await user.click(screen.getByRole('checkbox', { name: 'Difficultés à louer' }));
      await user.click(screen.getByRole('checkbox', { name: "Protéger l'investissement" }));

      expect(methods.getValues('attentes')).toEqual([
        'Projet de revente',
        'Difficultés à louer',
        "Protéger l'investissement",
      ]);
    });

    it('toggle une même attente plusieurs fois sans corrompre le state', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step06Attentes />);

      const cb = screen.getByRole('checkbox', { name: "Recherche d'une maison saine" });
      await user.click(cb);
      await user.click(cb);
      await user.click(cb);

      expect(methods.getValues('attentes')).toEqual(["Recherche d'une maison saine"]);
    });

    it('permet de cocher toutes les attentes', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step06Attentes />);

      for (const a of ATTENTES) {
        await user.click(screen.getByRole('checkbox', { name: a }));
      }

      expect(methods.getValues('attentes')).toEqual([...ATTENTES]);
    });
  });
});
