import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { Step02Rappel } from './Step02Rappel';
import { renderWithForm } from '../../test/renderWithForm';

describe('Step02Rappel', () => {
  describe('rendering — éléments statiques', () => {
    it('affiche le titre et le sous-titre de l\'étape', () => {
      renderWithForm(<Step02Rappel />);
      expect(screen.getByText('Étape 2')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Rappel & contexte', level: 2 }),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Relecture du contexte de la mission avant le diagnostic.'),
      ).toBeInTheDocument();
    });

    it('affiche le bloc d\'avertissement', () => {
      renderWithForm(<Step02Rappel />);
      expect(screen.getByText(/Avertissement/)).toBeInTheDocument();
      expect(
        screen.getByText(/omission volontaire, de fausse déclaration/),
      ).toBeInTheDocument();
    });

    it('affiche la liste des sources sur lesquelles l\'opération est basée', () => {
      renderWithForm(<Step02Rappel />);
      expect(screen.getByText(/déclarations des personnes présentes/)).toBeInTheDocument();
      expect(screen.getByText(/observations du technicien/)).toBeInTheDocument();
      expect(
        screen.getByText(/relevés et prélèvements réalisés sur place/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/photos, plans, factures, expertises, constats/),
      ).toBeInTheDocument();
    });

    it('affiche le paragraphe sur le protocole respecté', () => {
      renderWithForm(<Step02Rappel />);
      expect(
        screen.getByText(/Le demandeur déclare avoir respecté le protocole/),
      ).toBeInTheDocument();
      expect(screen.getByText(/Fenêtres fermées 24h avant/)).toBeInTheDocument();
    });

    it('affiche la phrase de clôture', () => {
      renderWithForm(<Step02Rappel />);
      expect(
        screen.getByText(/Il ressort de ces opérations les éléments présentés/),
      ).toBeInTheDocument();
    });
  });

  describe('placeholders quand le formulaire est vide', () => {
    it('affiche "—" pour le nom et prénom client manquants', () => {
      const { container } = renderWithForm(<Step02Rappel />, {
        defaultValues: {
          clientNom: '',
          clientPrenom: '',
          clientAdresse: '',
          clientCP: '',
          clientVille: '',
          diagNom: '',
          diagPrenom: '',
          diagDate: '',
        },
      });
      // Le placeholder '—' doit apparaître à plusieurs endroits
      const dashes = container.querySelectorAll('strong');
      const dashedTexts = Array.from(dashes).map((el) => el.textContent ?? '');
      expect(dashedTexts.some((t) => t.includes('—'))).toBe(true);
    });

    it('affiche "—" pour la date quand diagDate est vide', () => {
      renderWithForm(<Step02Rappel />, {
        defaultValues: { diagDate: '' },
      });
      // La date dans le 2e paragraphe doit être '—'
      const strongs = screen.getAllByText('—');
      expect(strongs.length).toBeGreaterThan(0);
    });

    it('traite une chaîne de seulement des espaces comme vide', () => {
      const { container } = renderWithForm(<Step02Rappel />, {
        defaultValues: {
          clientNom: '   ',
          clientPrenom: '   ',
        },
      });
      // Le bloc nom+prénom est rendu dans un <strong>{Full(nom)} {Full(prénom)}</strong>
      // => "— —" doit apparaître dans le DOM
      expect(container.textContent).toMatch(/— —/);
    });
  });

  describe('rendu dynamique avec données client', () => {
    it('affiche le nom et prénom du client', () => {
      renderWithForm(<Step02Rappel />, {
        defaultValues: {
          clientNom: 'Dupont',
          clientPrenom: 'Marie',
        },
      });
      expect(screen.getByText(/Dupont/)).toBeInTheDocument();
      expect(screen.getByText(/Marie/)).toBeInTheDocument();
    });

    it('affiche le nom et prénom du diagnostiqueur', () => {
      renderWithForm(<Step02Rappel />, {
        defaultValues: {
          diagNom: 'Da Cruz',
          diagPrenom: 'Steven',
        },
      });
      expect(screen.getByText(/Steven Da Cruz/)).toBeInTheDocument();
    });

    it('affiche l\'adresse complète du client', () => {
      renderWithForm(<Step02Rappel />, {
        defaultValues: {
          clientAdresse: '12 rue de la Paix',
          clientCP: '75002',
          clientVille: 'Paris',
        },
      });
      expect(
        screen.getByText(/12 rue de la Paix, 75002 Paris/),
      ).toBeInTheDocument();
    });

    it('formate la date du diagnostic au format français', () => {
      renderWithForm(<Step02Rappel />, {
        defaultValues: { diagDate: '2026-05-20' },
      });
      // formatDate utilise toLocaleDateString('fr-FR') => "20/05/2026"
      expect(screen.getByText('20/05/2026')).toBeInTheDocument();
    });

    it('affiche "—" quand la date est invalide', () => {
      renderWithForm(<Step02Rappel />, {
        defaultValues: { diagDate: 'not-a-date' },
      });
      // formatDate retourne '' pour une date invalide, fallback => '—'
      expect(screen.getAllByText('—').length).toBeGreaterThan(0);
    });
  });

  describe('mise à jour réactive', () => {
    it('reflète les valeurs courantes du formulaire au moment du rendu', () => {
      renderWithForm(<Step02Rappel />, {
        defaultValues: {
          clientNom: 'Martin',
          clientPrenom: 'Sophie',
          clientAdresse: '5 avenue Foch',
          clientCP: '69001',
          clientVille: 'Lyon',
          diagNom: 'Frade',
          diagPrenom: 'Paul',
          diagDate: '2026-01-15',
        },
      });
      expect(screen.getByText(/Martin Sophie/)).toBeInTheDocument();
      expect(screen.getByText(/Paul Frade/)).toBeInTheDocument();
      expect(screen.getByText(/5 avenue Foch, 69001 Lyon/)).toBeInTheDocument();
      expect(screen.getByText('15/01/2026')).toBeInTheDocument();
    });

    it('mélange placeholders et valeurs partielles', () => {
      renderWithForm(<Step02Rappel />, {
        defaultValues: {
          clientNom: 'Durand',
          clientPrenom: '',
          clientAdresse: '8 rue Mozart',
          clientCP: '',
          clientVille: 'Bordeaux',
        },
      });
      expect(screen.getByText(/Durand/)).toBeInTheDocument();
      expect(screen.getByText(/8 rue Mozart, — Bordeaux/)).toBeInTheDocument();
    });
  });
});
