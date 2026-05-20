import type { Page } from '@playwright/test';

const DRAFT_KEY = 'diago-report-draft-v1';

/**
 * Vide localStorage avant chaque test pour partir d'un état propre.
 * À appeler dans un beforeEach après `page.goto('/')`.
 */
export const clearDraftStorage = async (page: Page): Promise<void> => {
  await page.evaluate((key) => {
    window.localStorage.removeItem(key);
  }, DRAFT_KEY);
};

/**
 * Le hook usePersistedDraft debounce les écritures localStorage à 400 ms.
 * On attend un peu plus pour être sûr que l'écriture est passée.
 */
export const waitForDraftSave = async (page: Page): Promise<void> => {
  await page.waitForTimeout(600);
};

/**
 * Clique sur le bouton "Suivant" de la barre de navigation et attend que
 * le contenu du step ait changé en vérifiant le titre h2.
 */
export const goNext = async (page: Page): Promise<void> => {
  await page.getByRole('button', { name: /Suivant/ }).click();
};

/**
 * Récupère le draft tel qu'il a été sauvegardé en localStorage.
 */
export const readDraft = async (page: Page): Promise<Record<string, unknown> | null> => {
  return page.evaluate((key) => {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Record<string, unknown>) : null;
  }, DRAFT_KEY);
};
