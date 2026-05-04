import { z } from 'zod';
import {
  PATHOLOGY_KEYS,
  PATHOLOGY_STATUSES,
  OUI_NON,
  TEST_NITRATE_OPTIONS,
} from '../data/constants';

const ouiNon = z.enum(OUI_NON);

const pathologyStatusEnum = z.enum(PATHOLOGY_STATUSES);

const nitrateTest = z.object({
  valeur: z.string(),
  lieu: z.string(),
});

const pathologiesStateSchema = z.object({
  remonteesCapillaires: pathologyStatusEnum,
  infiltrationMursEnterres: pathologyStatusEnum,
  contaminationElementsExterieurs: pathologyStatusEnum,
  condensation: pathologyStatusEnum,
  qualiteAir: pathologyStatusEnum,
  infiltrationFacade: pathologyStatusEnum,
  infiltrationToiture: pathologyStatusEnum,
  infiltrationTerrasses: pathologyStatusEnum,
});

export const reportSchema = z.object({
  // Étape 1 — Client + diagnostiqueur
  clientNom: z.string(),
  clientPrenom: z.string(),
  clientAdresse: z.string(),
  clientCP: z.string(),
  clientVille: z.string(),
  clientTel: z.string(),
  clientEmail: z.string(),
  clientQualite: z.string(),
  diagNom: z.string(),
  diagPrenom: z.string(),
  diagDate: z.string(),
  dossierRef: z.string(),

  // Étape 3 — Historique
  histDate: z.string(),
  histPieces: z.array(z.string()),
  histObs: z.string(),

  // Étape 4 — Indices intérieurs
  sympInt: z.array(z.string()),
  obsInt: z.string(),

  // Étape 5 — Indices extérieurs
  sympExt: z.array(z.string()),
  obsExt: z.string(),

  // Étape 6 — Attentes
  attentes: z.array(z.string()),

  // Étape 7 — Conséquences
  consequences: z.array(z.string()),

  // Étape 8 — Occupants
  nbAdultes: z.string(),
  nbEnfants: z.string(),

  // Étape 9 — Bâtiment
  batType: z.string(),
  batAnnee: z.string(),
  batMaconnerie: z.string(),
  batIsolation: z.array(z.string()),

  // Étape 10 — Visite technique
  visiteDebut: z.string(),
  visiteFin: z.string(),
  visiteComplete: z.boolean(),
  visiteMotif: z.string(),
  obsMurExt: z.array(z.string()),
  obsMurInt: z.array(z.string()),
  obsAirInt: z.array(z.string()),
  obsSupp: z.string(),

  // Étape 11 — Relevés
  testNitrate: z.enum(TEST_NITRATE_OPTIONS),
  testNitrateListe: z.array(nitrateTest),
  testT660: ouiNon,
  testT660Details: z.string(),
  testHygro: ouiNon,
  testHygroDetails: z.string(),
  testIgeres: ouiNon,
  testIgeresDetails: z.string(),
  obsFinales: z.string(),

  // Étape 12 — Pathologies
  pathologiesState: pathologiesStateSchema,
  risquesCoches: z.array(z.string()),
  conclusionPathologies: z.string(),
  texteManuel: z.string(),

  // Étape 13 — Signatures & photos
  signatureClientData: z.string().nullable(),
  signatureDiagData: z.string().nullable(),
  photos: z.array(z.string()),
});

export type ReportData = z.infer<typeof reportSchema>;

export type NitrateTest = z.infer<typeof nitrateTest>;

export const createDefaultReport = (): ReportData => {
  const defaultPathologies = Object.fromEntries(
    PATHOLOGY_KEYS.map((k) => [k, 'ras' as const]),
  ) as ReportData['pathologiesState'];

  return {
    clientNom: '',
    clientPrenom: '',
    clientAdresse: '',
    clientCP: '',
    clientVille: '',
    clientTel: '',
    clientEmail: '',
    clientQualite: '',
    diagNom: '',
    diagPrenom: '',
    diagDate: new Date().toISOString().split('T')[0],
    dossierRef: `Dossier Ref. ${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0')}`,

    histDate: '',
    histPieces: [],
    histObs: '',

    sympInt: [],
    obsInt: '',

    sympExt: [],
    obsExt: '',

    attentes: [],
    consequences: [],

    nbAdultes: '0',
    nbEnfants: '0',

    batType: '',
    batAnnee: '',
    batMaconnerie: '',
    batIsolation: [],

    visiteDebut: '',
    visiteFin: '',
    visiteComplete: true,
    visiteMotif: '',
    obsMurExt: [],
    obsMurInt: [],
    obsAirInt: [],
    obsSupp: '',

    testNitrate: 'Non',
    testNitrateListe: [],
    testT660: 'Non',
    testT660Details: '',
    testHygro: 'Non',
    testHygroDetails: '',
    testIgeres: 'Non',
    testIgeresDetails: '',
    obsFinales: '',

    pathologiesState: defaultPathologies,
    risquesCoches: [],
    conclusionPathologies: '',
    texteManuel: '',

    signatureClientData: null,
    signatureDiagData: null,
    photos: [],
  };
};

export const STEP_TITLES: Record<number, string> = {
  1: 'Informations générales',
  2: 'Rappel',
  3: 'Historique des symptômes',
  4: 'Indices intérieurs',
  5: 'Indices extérieurs',
  6: 'Attentes',
  7: 'Conséquences',
  8: 'Occupants',
  9: 'Le bâtiment',
  10: 'Visite technique',
  11: 'Relevés & prélèvements',
  12: 'Pathologies & risques',
  13: 'Validation & signature',
  14: 'Aperçu & téléchargement',
};

export const TOTAL_STEPS = 14;
