import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithForm } from '../../test/renderWithForm';

// SignaturePad utilise react-signature-canvas qui requiert un vrai canvas — on le stube
vi.mock('../form/SignaturePad', () => ({
  SignaturePad: ({ name, label }: { name: string; label: string }) => (
    <div data-testid={`signature-pad-${name}`} data-label={label}>
      SignaturePad mock
    </div>
  ),
}));

// PhotoUpload : on stube aussi pour isoler la logique du Step13
vi.mock('../form/PhotoUpload', () => ({
  PhotoUpload: () => <div data-testid="photo-upload">PhotoUpload mock</div>,
}));

import { Step13Signatures } from './Step13Signatures';

describe('Step13Signatures', () => {
  describe('rendering', () => {
    it('affiche le titre et le sous-titre de l\'étape', () => {
      renderWithForm(<Step13Signatures />);
      expect(screen.getByText('Étape 13')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Validation & signature', level: 2 }),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Obligation de conseil, signatures, photos annexes.'),
      ).toBeInTheDocument();
    });

    it('affiche les quatre sections', () => {
      renderWithForm(<Step13Signatures />);
      expect(
        screen.getByRole('heading', {
          name: "Obligation de conseil et d'information",
          level: 3,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Signature du client', level: 3 }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Signature du technicien', level: 3 }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Pièces jointes (photos)', level: 3 }),
      ).toBeInTheDocument();
    });

    it('affiche la description des pièces jointes', () => {
      renderWithForm(<Step13Signatures />);
      expect(screen.getByText('Elles apparaîtront en annexe du PDF.')).toBeInTheDocument();
    });
  });

  describe('texte de l\'obligation de conseil', () => {
    it('affiche la date du jour au format français', () => {
      renderWithForm(<Step13Signatures />);
      // todayFr retourne une date au format DD/MM/YYYY
      const dateRegex = /\d{2}\/\d{2}\/\d{4}/;
      const dates = screen.getAllByText(dateRegex);
      expect(dates.length).toBeGreaterThan(0);
    });

    it('affiche "M. & Mme —" quand clientNom est vide', () => {
      const { container } = renderWithForm(<Step13Signatures />, {
        defaultValues: { clientNom: '' },
      });
      // M. &amp; Mme {clientNom || '—'}  =>  "M. & Mme —" dans textContent
      expect(container.textContent).toContain('M. & Mme —');
    });

    it('affiche "M. & Mme {clientNom}" quand renseigné', () => {
      const { container } = renderWithForm(<Step13Signatures />, {
        defaultValues: { clientNom: 'Dupont' },
      });
      expect(container.textContent).toContain('M. & Mme Dupont');
    });

    it('contient le texte de décharge de responsabilité', () => {
      renderWithForm(<Step13Signatures />);
      expect(
        screen.getByText(/déchargent la société de sa responsabilité de conseil/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/La société ne pourra en aucun cas être tenue pour responsable/),
      ).toBeInTheDocument();
    });

    it('affiche le préambule sur l\'identification des pathologies', () => {
      renderWithForm(<Step13Signatures />);
      expect(
        screen.getByText(/sur les pathologies liées à l'humidité identifiées lors du contrôle/),
      ).toBeInTheDocument();
    });
  });

  describe('signatures', () => {
    it('affiche un SignaturePad pour le client', () => {
      renderWithForm(<Step13Signatures />);
      const pad = screen.getByTestId('signature-pad-signatureClientData');
      expect(pad).toBeInTheDocument();
      expect(pad.getAttribute('data-label')).toBe('Signez ci-dessous');
    });

    it('affiche un SignaturePad pour le diagnostiqueur', () => {
      renderWithForm(<Step13Signatures />);
      const pad = screen.getByTestId('signature-pad-signatureDiagData');
      expect(pad).toBeInTheDocument();
      expect(pad.getAttribute('data-label')).toBe('Signez ci-dessous');
    });

    it('les deux pads sont rendus côte à côte', () => {
      renderWithForm(<Step13Signatures />);
      const all = screen.getAllByText('SignaturePad mock');
      expect(all).toHaveLength(2);
    });
  });

  describe('photos annexes', () => {
    it('affiche le composant PhotoUpload', () => {
      renderWithForm(<Step13Signatures />);
      expect(screen.getByTestId('photo-upload')).toBeInTheDocument();
    });
  });
});
