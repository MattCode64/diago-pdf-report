import { test, expect } from '@playwright/test';
import { clearDraftStorage, goNext, readDraft, waitForDraftSave } from './helpers';

test.describe('Brouillon — sauvegarde et restauration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearDraftStorage(page);
    await page.reload();
  });

  test('sauvegarde automatiquement les saisies dans localStorage', async ({ page }) => {
    await page.getByLabel('Nom', { exact: true }).first().fill('Durand');
    await page.getByLabel('Email').fill('durand@example.com');
    await page.getByLabel('Code postal').fill('75001');

    await waitForDraftSave(page);

    const draft = await readDraft(page);
    expect(draft).toBeTruthy();
    expect(draft).toMatchObject({
      clientNom: 'Durand',
      clientEmail: 'durand@example.com',
      clientCP: '75001',
    });
  });

  test('restaure le brouillon au rechargement de la page', async ({ page }) => {
    // --- Premier passage : on remplit quelques champs et on passe à l'étape 3 ---
    await page.getByLabel('Nom', { exact: true }).first().fill('Restauré');
    await page.getByLabel('Prénom', { exact: true }).first().fill('Test');
    await page.getByLabel('Adresse').fill('99 boulevard du Brouillon');
    await page.getByLabel('Ville').fill('Lyon');

    await goNext(page); // -> 2
    await goNext(page); // -> 3
    await expect(
      page.getByRole('heading', { name: /Historique des symptômes/ }),
    ).toBeVisible();

    await page.getByLabel('Cuisine').check();
    await page.getByLabel('Sous-sol').check();
    await page
      .getByLabel("Observations sur l'historique")
      .fill('Apparu après les pluies de novembre');

    await waitForDraftSave(page);

    // --- Rechargement complet ---
    await page.reload();

    // --- On revient sur le step 1 (le numéro de step n'est pas persisté) ---
    await expect(
      page.getByRole('heading', { name: 'Informations générales' }),
    ).toBeVisible();
    await expect(page.getByLabel('Nom', { exact: true }).first()).toHaveValue('Restauré');
    await expect(page.getByLabel('Prénom', { exact: true }).first()).toHaveValue('Test');
    await expect(page.getByLabel('Adresse')).toHaveValue('99 boulevard du Brouillon');
    await expect(page.getByLabel('Ville')).toHaveValue('Lyon');

    // --- On navigue jusqu'au step 3 et on vérifie ces données aussi ---
    await goNext(page); // -> 2
    await goNext(page); // -> 3
    await expect(page.getByLabel('Cuisine')).toBeChecked();
    await expect(page.getByLabel('Sous-sol')).toBeChecked();
    await expect(page.getByLabel("Observations sur l'historique")).toHaveValue(
      'Apparu après les pluies de novembre',
    );
  });

  test('"Nouveau rapport" efface le brouillon localStorage', async ({ page }) => {
    await page.getByLabel('Nom', { exact: true }).first().fill('AEffacer');
    await waitForDraftSave(page);
    expect(await readDraft(page)).toMatchObject({ clientNom: 'AEffacer' });

    // Le bouton "Nouveau rapport" déclenche un window.confirm — on l'accepte.
    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: /Nouveau rapport/ }).click();

    // Après reset, le nom est vidé puis re-sauvegardé par le debounce
    await waitForDraftSave(page);
    const draftAfter = await readDraft(page);
    // Le draft peut être null (vidé) OU contenir un nouveau dossierRef généré.
    // Dans tous les cas, le nom client doit être vide.
    if (draftAfter !== null) {
      expect(draftAfter.clientNom).toBe('');
    }
    await expect(page.getByLabel('Nom', { exact: true }).first()).toHaveValue('');
  });
});
