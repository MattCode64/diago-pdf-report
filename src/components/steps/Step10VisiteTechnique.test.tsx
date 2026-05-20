import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Step10VisiteTechnique } from './Step10VisiteTechnique';
import { renderWithForm } from '../../test/renderWithForm';
import { OBS_MURS_EXT, OBS_MURS_INT, OBS_AIR } from '../../data/constants';

describe('Step10VisiteTechnique', () => {
  describe('rendering', () => {
    it('affiche le titre de l\'étape', () => {
      renderWithForm(<Step10VisiteTechnique />);
      expect(screen.getByText('Étape 10')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Visite technique', level: 2 }),
      ).toBeInTheDocument();
    });

    it('affiche les deux sections', () => {
      renderWithForm(<Step10VisiteTechnique />);
      expect(
        screen.getByRole('heading', { name: 'Horaires & périmètre', level: 3 }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Observations visuelles', level: 3 }),
      ).toBeInTheDocument();
    });

    it('affiche les champs heure de début et fin avec type="time"', () => {
      renderWithForm(<Step10VisiteTechnique />);
      expect(screen.getByLabelText('Heure de début')).toHaveAttribute('type', 'time');
      expect(screen.getByLabelText('Heure de fin')).toHaveAttribute('type', 'time');
    });

    it('affiche la question Visite complète et ses boutons Oui/Non', () => {
      renderWithForm(<Step10VisiteTechnique />);
      expect(screen.getByText('Visite complète du bien ?')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Oui' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Non' })).toBeInTheDocument();
    });
  });

  describe('horaires de visite', () => {
    it('met à jour visiteDebut à la saisie', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step10VisiteTechnique />);

      await user.type(screen.getByLabelText('Heure de début'), '09:30');

      expect(methods.getValues('visiteDebut')).toBe('09:30');
    });

    it('met à jour visiteFin à la saisie', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step10VisiteTechnique />);

      await user.type(screen.getByLabelText('Heure de fin'), '11:15');

      expect(methods.getValues('visiteFin')).toBe('11:15');
    });
  });

  describe('BooleanRadio visiteComplete', () => {
    it('a "Oui" coché par défaut (visiteComplete: true)', () => {
      renderWithForm(<Step10VisiteTechnique />);
      // Le bouton actif a la classe brand
      const oui = screen.getByRole('button', { name: 'Oui' });
      expect(oui.className).toMatch(/border-brand-500|bg-brand-50/);
    });

    it('cache le champ "Motif de la visite partielle" tant que visiteComplete=true', () => {
      renderWithForm(<Step10VisiteTechnique />);
      expect(
        screen.queryByLabelText('Motif de la visite partielle'),
      ).not.toBeInTheDocument();
    });

    it('affiche le champ "Motif de la visite partielle" quand on clique sur Non', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step10VisiteTechnique />);

      await user.click(screen.getByRole('button', { name: 'Non' }));

      expect(methods.getValues('visiteComplete')).toBe(false);
      expect(screen.getByLabelText('Motif de la visite partielle')).toBeInTheDocument();
    });

    it('pré-remplit le motif avec "{clientNom} a voulu se concentrer sur le problème" quand on clique sur Non', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step10VisiteTechnique />, {
        defaultValues: { clientNom: 'Durand' },
      });

      await user.click(screen.getByRole('button', { name: 'Non' }));

      expect(methods.getValues('visiteMotif')).toBe(
        'Durand a voulu se concentrer sur le problème',
      );
    });

    it('utilise "Le client" comme fallback quand clientNom est vide', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step10VisiteTechnique />, {
        defaultValues: { clientNom: '' },
      });

      await user.click(screen.getByRole('button', { name: 'Non' }));

      expect(methods.getValues('visiteMotif')).toBe(
        'Le client a voulu se concentrer sur le problème',
      );
    });

    it('repasse à visite complète quand on reclique sur Oui', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step10VisiteTechnique />);

      await user.click(screen.getByRole('button', { name: 'Non' }));
      await user.click(screen.getByRole('button', { name: 'Oui' }));

      expect(methods.getValues('visiteComplete')).toBe(true);
      expect(
        screen.queryByLabelText('Motif de la visite partielle'),
      ).not.toBeInTheDocument();
    });
  });

  describe('checkbox groups observations visuelles', () => {
    it('affiche toutes les options OBS_MURS_EXT', () => {
      renderWithForm(<Step10VisiteTechnique />);
      OBS_MURS_EXT.forEach((opt) => {
        expect(screen.getAllByRole('checkbox', { name: opt }).length).toBeGreaterThan(0);
      });
    });

    it('affiche toutes les options OBS_MURS_INT', () => {
      renderWithForm(<Step10VisiteTechnique />);
      OBS_MURS_INT.forEach((opt) => {
        expect(screen.getAllByRole('checkbox', { name: opt }).length).toBeGreaterThan(0);
      });
    });

    it('affiche toutes les options OBS_AIR', () => {
      renderWithForm(<Step10VisiteTechnique />);
      OBS_AIR.forEach((opt) => {
        expect(screen.getAllByRole('checkbox', { name: opt }).length).toBeGreaterThan(0);
      });
    });

    it('coche une option dans Murs extérieurs et la sauvegarde dans obsMurExt', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step10VisiteTechnique />);

      // "Lichens" n'existe que dans OBS_MURS_EXT, donc unique
      await user.click(screen.getByRole('checkbox', { name: 'Lichens' }));

      expect(methods.getValues('obsMurExt')).toEqual(['Lichens']);
    });

    it('coche une option dans Murs intérieurs et la sauvegarde dans obsMurInt', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step10VisiteTechnique />);

      // "Fuite" n'existe que dans OBS_MURS_INT
      await user.click(screen.getByRole('checkbox', { name: 'Fuite' }));

      expect(methods.getValues('obsMurInt')).toEqual(['Fuite']);
    });

    it('coche une option dans Air intérieur et la sauvegarde dans obsAirInt', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step10VisiteTechnique />);

      // "Aspergillus" n'existe que dans OBS_AIR
      await user.click(screen.getByRole('checkbox', { name: 'Aspergillus' }));

      expect(methods.getValues('obsAirInt')).toEqual(['Aspergillus']);
    });
  });

  describe('textarea obsSupp', () => {
    it('met à jour obsSupp à la saisie', async () => {
      const user = userEvent.setup();
      const { methods } = renderWithForm(<Step10VisiteTechnique />);

      await user.type(
        screen.getByLabelText('Observations supplémentaires'),
        'Ventilation absente dans la SDB',
      );

      expect(methods.getValues('obsSupp')).toBe('Ventilation absente dans la SDB');
    });

    it('a rows=4', () => {
      renderWithForm(<Step10VisiteTechnique />);
      expect(screen.getByLabelText('Observations supplémentaires')).toHaveAttribute(
        'rows',
        '4',
      );
    });
  });
});
