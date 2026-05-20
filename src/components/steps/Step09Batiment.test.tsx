import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Step09Batiment } from './Step09Batiment';
import { renderWithForm } from '../../test/renderWithForm';
import { TYPE_BATIMENT, TYPE_MACONNERIE, ISOLATION } from '../../data/constants';

describe('Step09Batiment', () => {
  describe('rendering', () => {
    it('affiche le titre et le sous-titre de l\'étape', () => {
      renderWithForm(<Step09Batiment />);
      expect(screen.getByText('Étape 9')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Le bâtiment', level: 2 }),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Caractéristiques physiques du bien.'),
      ).toBeInTheDocument();
    });

    it('affiche les quatre champs', () => {
      renderWithForm(<Step09Batiment />);
      expect(screen.getByLabelText('Type de bâtiment')).toBeInTheDocument();
      expect(screen.getByLabelText('Année de construction (ou ± 10 ans)')).toBeInTheDocument();
      expect(screen.getByLabelText('Type de maçonnerie')).toBeInTheDocument();
      expect(screen.getByText('Isolation existante')).toBeInTheDocument();
    });
  });

  describe('select Type de bâtiment', () => {
    it('contient toutes les options TYPE_BATIMENT', () => {
      renderWithForm(<Step09Batiment />);
      const select = screen.getByLabelText('Type de bâtiment') as HTMLSelectElement;
      const optionValues = within(select)
        .getAllByRole('option')
        .map((o) => (o as HTMLOptionElement).value);
      TYPE_BATIMENT.forEach((t) => expect(optionValues).toContain(t));
    });

    it('met à jour batType à la sélection', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step09Batiment />);

      await user.selectOptions(screen.getByLabelText('Type de bâtiment'), 'Maison');

      expect(methods.getValues('batType')).toBe('Maison');
    });
  });

  describe('select Type de maçonnerie', () => {
    it('contient toutes les options TYPE_MACONNERIE', () => {
      renderWithForm(<Step09Batiment />);
      const select = screen.getByLabelText('Type de maçonnerie') as HTMLSelectElement;
      const optionValues = within(select)
        .getAllByRole('option')
        .map((o) => (o as HTMLOptionElement).value);
      TYPE_MACONNERIE.forEach((t) => expect(optionValues).toContain(t));
    });

    it('met à jour batMaconnerie à la sélection', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step09Batiment />);

      await user.selectOptions(screen.getByLabelText('Type de maçonnerie'), 'Pierre dure');

      expect(methods.getValues('batMaconnerie')).toBe('Pierre dure');
    });
  });

  describe('champ Année de construction', () => {
    it('met à jour batAnnee à la saisie', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step09Batiment />);

      await user.type(
        screen.getByLabelText('Année de construction (ou ± 10 ans)'),
        '1965',
      );

      expect(methods.getValues('batAnnee')).toBe('1965');
    });

    it('pré-remplit la valeur depuis defaultValues', () => {
      renderWithForm(<Step09Batiment />, {
        defaultValues: { batAnnee: '1920' },
      });
      expect(
        screen.getByLabelText('Année de construction (ou ± 10 ans)'),
      ).toHaveValue('1920');
    });
  });

  describe('checkbox group Isolation', () => {
    it('affiche une checkbox pour chacune des 12 isolations', () => {
      renderWithForm(<Step09Batiment />);
      expect(ISOLATION.length).toBe(12);
      ISOLATION.forEach((i) => {
        expect(screen.getByRole('checkbox', { name: i })).toBeInTheDocument();
      });
    });

    it('aucune isolation cochée par défaut', () => {
      renderWithForm(<Step09Batiment />);
      ISOLATION.forEach((i) => {
        expect(screen.getByRole('checkbox', { name: i })).not.toBeChecked();
      });
    });

    it('pré-coche les isolations depuis defaultValues', () => {
      renderWithForm(<Step09Batiment />, {
        defaultValues: { batIsolation: ['Laine de verre', 'Polystyrène'] },
      });
      expect(screen.getByRole('checkbox', { name: 'Laine de verre' })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: 'Polystyrène' })).toBeChecked();
    });

    it('coche et décoche une isolation', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step09Batiment />);

      const cb = screen.getByRole('checkbox', { name: 'Brique' });
      await user.click(cb);
      expect(methods.getValues('batIsolation')).toEqual(['Brique']);

      await user.click(cb);
      expect(methods.getValues('batIsolation')).toEqual([]);
    });

    it('coche plusieurs types d\'isolation', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step09Batiment />);

      await user.click(screen.getByRole('checkbox', { name: 'Combles: plaques' }));
      await user.click(screen.getByRole('checkbox', { name: 'Combles: ouate' }));
      await user.click(screen.getByRole('checkbox', { name: 'Sous-toiture: laine roche' }));

      expect(methods.getValues('batIsolation')).toEqual([
        'Combles: plaques',
        'Combles: ouate',
        'Sous-toiture: laine roche',
      ]);
    });
  });

  describe('scénario complet', () => {
    it('remplit tous les champs du bâtiment', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step09Batiment />);

      await user.selectOptions(screen.getByLabelText('Type de bâtiment'), 'Appartement');
      await user.type(
        screen.getByLabelText('Année de construction (ou ± 10 ans)'),
        '1985',
      );
      await user.selectOptions(screen.getByLabelText('Type de maçonnerie'), 'Béton vibré');
      await user.click(screen.getByRole('checkbox', { name: 'Doublage mur' }));
      await user.click(screen.getByRole('checkbox', { name: 'Film' }));

      const values = methods.getValues();
      expect(values.batType).toBe('Appartement');
      expect(values.batAnnee).toBe('1985');
      expect(values.batMaconnerie).toBe('Béton vibré');
      expect(values.batIsolation).toEqual(['Doublage mur', 'Film']);
    });
  });
});
