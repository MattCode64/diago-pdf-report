import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithForm } from '../../test/renderWithForm';

// Mock @react-pdf/renderer : PDFViewer = placeholder, pdf().toBlob() = Blob factice
const toBlobMock = vi.fn().mockResolvedValue(new Blob(['fake-pdf'], { type: 'application/pdf' }));
vi.mock('@react-pdf/renderer', () => ({
  PDFViewer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pdf-viewer">{children}</div>
  ),
  pdf: () => ({ toBlob: toBlobMock }),
  // Composants utilisés par ReportDocument — on les stube tous comme passthrough
  Document: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Page: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  View: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  Image: () => <span />,
  StyleSheet: { create: <T,>(s: T) => s, hairlineWidth: 1 },
  Font: { register: () => undefined, registerHyphenationCallback: () => undefined },
  Link: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  Svg: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  Path: () => <span />,
  Defs: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  LinearGradient: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  Stop: () => <span />,
}));

// Mock clearDraft pour ne pas toucher localStorage
const clearDraftMock = vi.fn();
vi.mock('../../hooks/usePersistedDraft', () => ({
  clearDraft: () => clearDraftMock(),
  usePersistedDraft: () => undefined,
}));

import { Step14Preview } from './Step14Preview';

describe('Step14Preview', () => {
  beforeEach(() => {
    toBlobMock.mockClear();
    clearDraftMock.mockClear();
    // Stub URL APIs
    if (!URL.createObjectURL) {
      URL.createObjectURL = vi.fn(() => 'blob:mock');
    } else {
      vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock');
    }
    if (!URL.revokeObjectURL) {
      URL.revokeObjectURL = vi.fn();
    } else {
      vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
    }
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Cleanup navigator stubs si on les a mis
    delete (navigator as unknown as { share?: unknown }).share;
    delete (navigator as unknown as { canShare?: unknown }).canShare;
  });

  describe('rendering', () => {
    it('affiche le titre et le sous-titre de l\'étape', () => {
      renderWithForm(<Step14Preview />);
      expect(screen.getByText('Étape 14')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Aperçu & téléchargement', level: 2 }),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Vérifiez le rendu avant de télécharger ou partager le PDF.'),
      ).toBeInTheDocument();
    });

    it('affiche les sections Actions et Aperçu', () => {
      renderWithForm(<Step14Preview />);
      expect(
        screen.getByRole('heading', { name: 'Actions', level: 3 }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Aperçu', level: 3 }),
      ).toBeInTheDocument();
    });

    it('affiche le bouton Télécharger le PDF', () => {
      renderWithForm(<Step14Preview />);
      expect(
        screen.getByRole('button', { name: /Télécharger le PDF/ }),
      ).toBeInTheDocument();
    });

    it('affiche le mock du PDFViewer dans la section Aperçu', () => {
      renderWithForm(<Step14Preview />);
      expect(screen.getByTestId('pdf-viewer')).toBeInTheDocument();
    });

    it('affiche le message d\'info sur l\'effacement automatique du brouillon', () => {
      renderWithForm(<Step14Preview />);
      expect(
        screen.getByText(/Le brouillon local est effacé automatiquement/),
      ).toBeInTheDocument();
    });
  });

  describe('bouton Partager — conditionnel', () => {
    it('n\'affiche pas le bouton Partager si navigator.share n\'existe pas', () => {
      // Par défaut, jsdom n'a pas navigator.share
      renderWithForm(<Step14Preview />);
      expect(screen.queryByRole('button', { name: /Partager/ })).not.toBeInTheDocument();
    });

    it('affiche le bouton Partager si navigator.share et navigator.canShare existent', () => {
      (navigator as unknown as { share: unknown }).share = vi.fn();
      (navigator as unknown as { canShare: unknown }).canShare = vi.fn(() => true);

      renderWithForm(<Step14Preview />);
      expect(screen.getByRole('button', { name: /Partager/ })).toBeInTheDocument();
    });
  });

  describe('action Télécharger', () => {
    it('appelle pdf().toBlob() et clearDraft() au clic', async () => {
      const user = userEvent.setup();
      renderWithForm(<Step14Preview />);

      await user.click(screen.getByRole('button', { name: /Télécharger le PDF/ }));

      expect(toBlobMock).toHaveBeenCalledTimes(1);
      expect(clearDraftMock).toHaveBeenCalledTimes(1);
    });

    it('crée une URL d\'objet pour le blob et la révoque ensuite', async () => {
      const user = userEvent.setup();
      const createSpy = vi.spyOn(URL, 'createObjectURL');
      const revokeSpy = vi.spyOn(URL, 'revokeObjectURL');

      renderWithForm(<Step14Preview />);
      await user.click(screen.getByRole('button', { name: /Télécharger le PDF/ }));

      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(revokeSpy).toHaveBeenCalledWith('blob:mock');
    });

    it('utilise le nom du client dans le nom de fichier', async () => {
      const user = userEvent.setup();

      // On capture l'élément <a> créé par onDownload pour vérifier son attribut download
      const appendChildSpy = vi.spyOn(document.body, 'appendChild');

      renderWithForm(<Step14Preview />, {
        defaultValues: { clientNom: 'Martin Dupont' },
      });

      await user.click(screen.getByRole('button', { name: /Télécharger le PDF/ }));

      const aTags = appendChildSpy.mock.calls
        .map((c) => c[0])
        .filter((n): n is HTMLAnchorElement => n instanceof HTMLAnchorElement);
      expect(aTags.length).toBeGreaterThan(0);
      expect(aTags[0].download).toBe('Rapport_Diagnostic_Martin_Dupont.pdf');
    });

    it('utilise "Client" comme fallback dans le nom de fichier quand clientNom est vide', async () => {
      const user = userEvent.setup();
      const appendChildSpy = vi.spyOn(document.body, 'appendChild');

      renderWithForm(<Step14Preview />, { defaultValues: { clientNom: '' } });

      await user.click(screen.getByRole('button', { name: /Télécharger le PDF/ }));

      const aTags = appendChildSpy.mock.calls
        .map((c) => c[0])
        .filter((n): n is HTMLAnchorElement => n instanceof HTMLAnchorElement);
      expect(aTags[0].download).toBe('Rapport_Diagnostic_Client.pdf');
    });
  });

  describe('action Partager', () => {
    it('appelle navigator.share avec le PDF généré', async () => {
      const shareMock = vi.fn().mockResolvedValue(undefined);
      (navigator as unknown as { share: unknown }).share = shareMock;
      (navigator as unknown as { canShare: unknown }).canShare = vi.fn(() => true);

      const user = userEvent.setup();
      renderWithForm(<Step14Preview />, { defaultValues: { clientNom: 'Durand' } });

      await user.click(screen.getByRole('button', { name: /Partager/ }));

      expect(toBlobMock).toHaveBeenCalled();
      expect(shareMock).toHaveBeenCalledTimes(1);
      const arg = shareMock.mock.calls[0][0] as {
        files: File[];
        title: string;
        text: string;
      };
      expect(arg.title).toBe('Diagnostic humidité');
      expect(arg.text).toBe('Rapport de diagnostic DIAGO');
      expect(arg.files).toHaveLength(1);
      expect(arg.files[0]).toBeInstanceOf(File);
      expect(arg.files[0].name).toBe('Rapport_Diagnostic_Durand.pdf');
      expect(arg.files[0].type).toBe('application/pdf');
    });

    it('clearDraft est appelé après un partage réussi', async () => {
      (navigator as unknown as { share: unknown }).share = vi.fn().mockResolvedValue(undefined);
      (navigator as unknown as { canShare: unknown }).canShare = vi.fn(() => true);

      const user = userEvent.setup();
      renderWithForm(<Step14Preview />);

      await user.click(screen.getByRole('button', { name: /Partager/ }));

      expect(clearDraftMock).toHaveBeenCalledTimes(1);
    });

    it('ne plante pas si l\'utilisateur annule le partage (AbortError)', async () => {
      const abortErr = Object.assign(new Error('aborted'), { name: 'AbortError' });
      (navigator as unknown as { share: unknown }).share = vi.fn().mockRejectedValue(abortErr);
      (navigator as unknown as { canShare: unknown }).canShare = vi.fn(() => true);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

      const user = userEvent.setup();
      renderWithForm(<Step14Preview />);

      await user.click(screen.getByRole('button', { name: /Partager/ }));

      // AbortError ne doit PAS produire d'erreur console
      expect(consoleSpy).not.toHaveBeenCalled();
      // clearDraft ne doit PAS être appelé sur abort
      expect(clearDraftMock).not.toHaveBeenCalled();
    });

    it('logue un autre type d\'erreur (non AbortError)', async () => {
      const err = new Error('network');
      (navigator as unknown as { share: unknown }).share = vi.fn().mockRejectedValue(err);
      (navigator as unknown as { canShare: unknown }).canShare = vi.fn(() => true);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

      const user = userEvent.setup();
      renderWithForm(<Step14Preview />);

      await user.click(screen.getByRole('button', { name: /Partager/ }));

      expect(consoleSpy).toHaveBeenCalledWith('Erreur partage', err);
    });
  });
});
