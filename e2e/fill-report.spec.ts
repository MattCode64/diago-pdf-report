import { test, expect } from '@playwright/test';
import { clearDraftStorage, goNext } from './helpers';

test.describe('Remplir un rapport — parcours principal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearDraftStorage(page);
    await page.reload();
  });

  test('remplit le step 1 et voit le récap dans le step 2', async ({ page }) => {
    // --- Step 1 : informations client + diagnostiqueur ---
    await expect(
      page.getByRole('heading', { name: 'Informations générales' }),
    ).toBeVisible();

    await page.getByLabel('Nom', { exact: true }).first().fill('Durand');
    await page.getByLabel('Prénom', { exact: true }).first().fill('Sophie');
    await page.getByLabel('Adresse').fill('12 rue de la Paix');
    await page.getByLabel('Code postal').fill('75002');
    await page.getByLabel('Ville').fill('Paris');
    await page.getByLabel('Portable').fill('0612345678');
    await page.getByLabel('Email').fill('sophie@durand.fr');
    await page.getByLabel('Qualité').selectOption('Propriétaire');
    // Le 2e champ "Nom" est le select Diagnostiqueur
    await page.getByLabel('Nom', { exact: true }).nth(1).selectOption('Da Cruz');
    await page.getByLabel('Prénom', { exact: true }).nth(1).selectOption('Steven');

    // --- Aller au Step 2 ---
    await goNext(page);
    await expect(page.getByRole('heading', { name: 'Rappel & contexte' })).toBeVisible();

    // Le récap doit refléter les informations saisies au step 1
    const article = page.locator('article').first();
    await expect(article).toContainText('Durand Sophie');
    await expect(article).toContainText('Steven Da Cruz');
    await expect(article).toContainText('12 rue de la Paix, 75002 Paris');
  });

  test('navigue à travers plusieurs steps et conserve les données saisies', async ({
    page,
  }) => {
    // Step 1
    await page.getByLabel('Nom', { exact: true }).first().fill('Martin');
    await page.getByLabel('Prénom', { exact: true }).first().fill('Paul');
    await goNext(page); // -> 2

    // Step 2 : juste vérifier l'affichage
    await expect(page.getByRole('heading', { name: 'Rappel & contexte' })).toBeVisible();
    await goNext(page); // -> 3

    // Step 3 : sélection date d'apparition + 2 pièces
    await expect(
      page.getByRole('heading', { name: /Historique des symptômes/ }),
    ).toBeVisible();
    await page.getByLabel("Date d'apparition des symptômes").selectOption('< 6 mois');
    await page.getByLabel('Chambre').check();
    await page.getByLabel('Salle de bain').check();
    await goNext(page); // -> 4

    // Step 4 : symptômes intérieurs
    await expect(page.getByRole('heading', { name: 'Indices intérieurs' })).toBeVisible();
    await page.getByLabel('Moisissures').first().check();
    await page.getByLabel('Buée / condensation').check();
    await goNext(page); // -> 5

    // Step 5 : symptômes extérieurs
    await expect(page.getByRole('heading', { name: 'Indices extérieurs' })).toBeVisible();
    await page.getByLabel('Salpêtre').check();
    await goNext(page); // -> 6

    // Step 6 : attentes
    await expect(page.getByRole('heading', { name: 'Attentes' })).toBeVisible();
    await page.getByLabel('Plainte locataire / voisin').check();

    // Revenir en arrière jusqu'au step 3 et vérifier que les cases restent cochées
    await page.getByRole('button', { name: /Précédent/ }).click(); // -> 5
    await page.getByRole('button', { name: /Précédent/ }).click(); // -> 4
    await page.getByRole('button', { name: /Précédent/ }).click(); // -> 3
    await expect(
      page.getByRole('heading', { name: /Historique des symptômes/ }),
    ).toBeVisible();
    await expect(page.getByLabel('Chambre')).toBeChecked();
    await expect(page.getByLabel('Salle de bain')).toBeChecked();
    await expect(page.getByLabel("Date d'apparition des symptômes")).toHaveValue(
      '< 6 mois',
    );
  });
});
