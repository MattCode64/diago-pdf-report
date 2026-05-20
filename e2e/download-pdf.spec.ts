import { test, expect } from '@playwright/test';
import { clearDraftStorage } from './helpers';

test.describe('Téléchargement du PDF', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearDraftStorage(page);
    await page.reload();
  });

  test('génère et télécharge un vrai PDF depuis le step 14', async ({ page }) => {
    // On utilise le bouton "Données démo" (visible en dev) qui pré-remplit
    // un dossier complet et saute directement au step 14.
    await page.getByRole('button', { name: /Données démo/ }).click();
    await expect(
      page.getByRole('heading', { name: 'Aperçu & téléchargement' }),
    ).toBeVisible();

    // Inspecte le DOM pour vérifier que l'attribut `download` est bien posé
    // sur le <a> AVANT que le navigateur ne déclenche le téléchargement.
    // Chromium remplace ensuite le filename par un UUID pour les blob URLs
    // d'application/pdf (quirk headless) — c'est ce qu'on contourne.
    let capturedDownloadAttr: string | null = null;
    await page.exposeFunction('__captureDownloadAttr', (attr: string) => {
      capturedDownloadAttr = attr;
    });
    await page.evaluate(() => {
      const originalAppendChild = document.body.appendChild.bind(document.body);
      document.body.appendChild = function (node: Node) {
        if (node instanceof HTMLAnchorElement && node.download) {
          (window as unknown as { __captureDownloadAttr: (s: string) => void }).__captureDownloadAttr(
            node.download,
          );
        }
        return originalAppendChild(node) as ReturnType<typeof originalAppendChild>;
      } as typeof document.body.appendChild;
    });

    // Attend l'événement de téléchargement déclenché par le clic.
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 60_000 }),
      page.getByRole('button', { name: /Télécharger le PDF/ }).click(),
    ]);

    // Le nom de fichier proposé par le code respecte le pattern attendu.
    expect(capturedDownloadAttr).toMatch(/^Rapport_Diagnostic_.+\.pdf$/);

    // Vérifie aussi que le fichier téléchargé est un vrai PDF
    // (signature magique %PDF- au début du flux).
    const stream = await download.createReadStream();
    expect(stream).not.toBeNull();
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk as Buffer);
      if (Buffer.concat(chunks).byteLength > 1024) break;
    }
    const header = Buffer.concat(chunks).subarray(0, 5).toString('utf8');
    expect(header).toBe('%PDF-');
  });

  test('le brouillon local est effacé après un téléchargement réussi', async ({ page }) => {
    await page.getByRole('button', { name: /Données démo/ }).click();
    await expect(
      page.getByRole('heading', { name: 'Aperçu & téléchargement' }),
    ).toBeVisible();

    // S'assurer qu'un brouillon existe avant le clic
    await page.waitForFunction(
      () => window.localStorage.getItem('diago-report-draft-v1') !== null,
      { timeout: 5_000 },
    );

    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 60_000 }),
      page.getByRole('button', { name: /Télécharger le PDF/ }).click(),
    ]);
    await download.cancel().catch(() => undefined);

    // clearDraft() est appelé tout de suite après le déclenchement.
    // Le draft sera ensuite re-sauvegardé par le debounce si l'app
    // continue de "watcher" les changements, mais à cet instant T il
    // doit être null. On vérifie via un waitFor strict.
    await page.waitForFunction(
      () => window.localStorage.getItem('diago-report-draft-v1') === null,
      { timeout: 5_000 },
    );
  });
});
