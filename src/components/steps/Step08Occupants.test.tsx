import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Step08Occupants } from './Step08Occupants';
import { renderWithForm } from '../../test/renderWithForm';

describe('Step08Occupants', () => {
  describe('rendering', () => {
    it('affiche le titre de l\'étape', () => {
      renderWithForm(<Step08Occupants />);
      expect(screen.getByText('Étape 8')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Occupants', level: 2 }),
      ).toBeInTheDocument();
    });

    it('affiche les deux champs Nombre d\'adultes et Nombre d\'enfants', () => {
      renderWithForm(<Step08Occupants />);
      expect(screen.getByLabelText("Nombre d'adultes")).toBeInTheDocument();
      expect(screen.getByLabelText("Nombre d'enfants")).toBeInTheDocument();
    });

    it('les deux champs ont type="number" et inputMode="numeric"', () => {
      renderWithForm(<Step08Occupants />);
      const adultes = screen.getByLabelText("Nombre d'adultes");
      const enfants = screen.getByLabelText("Nombre d'enfants");
      expect(adultes).toHaveAttribute('type', 'number');
      expect(adultes).toHaveAttribute('inputmode', 'numeric');
      expect(enfants).toHaveAttribute('type', 'number');
      expect(enfants).toHaveAttribute('inputmode', 'numeric');
    });
  });

  describe('valeurs par défaut et interactions', () => {
    it('a "0" comme valeur par défaut pour les deux champs', () => {
      renderWithForm(<Step08Occupants />);
      expect(screen.getByLabelText("Nombre d'adultes")).toHaveValue(0);
      expect(screen.getByLabelText("Nombre d'enfants")).toHaveValue(0);
    });

    it('pré-remplit les champs avec defaultValues', () => {
      renderWithForm(<Step08Occupants />, {
        defaultValues: { nbAdultes: '2', nbEnfants: '3' },
      });
      expect(screen.getByLabelText("Nombre d'adultes")).toHaveValue(2);
      expect(screen.getByLabelText("Nombre d'enfants")).toHaveValue(3);
    });

    it('met à jour nbAdultes quand on saisit une valeur', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step08Occupants />);

      const adultes = screen.getByLabelText("Nombre d'adultes");
      await user.clear(adultes);
      await user.type(adultes, '4');

      expect(methods.getValues('nbAdultes')).toBe('4');
    });

    it('met à jour nbEnfants quand on saisit une valeur', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step08Occupants />);

      const enfants = screen.getByLabelText("Nombre d'enfants");
      await user.clear(enfants);
      await user.type(enfants, '2');

      expect(methods.getValues('nbEnfants')).toBe('2');
    });

    it('permet de saisir des nombres à plusieurs chiffres', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step08Occupants />);

      const adultes = screen.getByLabelText("Nombre d'adultes");
      await user.clear(adultes);
      await user.type(adultes, '12');

      expect(methods.getValues('nbAdultes')).toBe('12');
    });

    it('met à jour les deux champs indépendamment', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step08Occupants />);

      const adultes = screen.getByLabelText("Nombre d'adultes");
      const enfants = screen.getByLabelText("Nombre d'enfants");

      await user.clear(adultes);
      await user.type(adultes, '3');
      await user.clear(enfants);
      await user.type(enfants, '1');

      const values = methods.getValues();
      expect(values.nbAdultes).toBe('3');
      expect(values.nbEnfants).toBe('1');
    });
  });
});
