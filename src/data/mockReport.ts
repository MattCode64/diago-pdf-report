import type { ReportData } from '../schemas/reportSchema';
import { mergeConclusion } from '../utils/conclusionText';

// Synthétise une signature manuscrite plausible via canvas → dataURL PNG
const fakeSignature = (seed: number): string | null => {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 180;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2.4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  let x = 30 + seed * 11;
  let y = 100;
  ctx.moveTo(x, y);
  for (let i = 0; i < 90; i++) {
    x += 3.5;
    y = 100 + Math.sin(i * 0.35 + seed) * 22 + (i > 60 ? -25 : 0);
    ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(60, 130);
  ctx.lineTo(330, 130);
  ctx.stroke();
  return canvas.toDataURL('image/png');
};

// Petite photo "in-situ" générée procéduralement (mur avec tache)
const fakePhoto = (label: string): string | null => {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  // Mur clair
  const gradient = ctx.createLinearGradient(0, 0, 0, 600);
  gradient.addColorStop(0, '#e2e8f0');
  gradient.addColorStop(1, '#94a3b8');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 800, 600);
  // Tache d'humidité
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = `rgba(${50 + i * 8}, ${40 + i * 6}, ${30 + i * 4}, 0.18)`;
    ctx.beginPath();
    ctx.ellipse(150 + i * 60, 350 + i * 20, 90 + i * 15, 60 + i * 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // Plinthe
  ctx.fillStyle = '#475569';
  ctx.fillRect(0, 540, 800, 60);
  // Label
  ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
  ctx.fillRect(20, 20, 360, 36);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText(label, 32, 44);
  return canvas.toDataURL('image/jpeg', 0.85);
};

const MOCK_PATHOLOGIES: ReportData['pathologiesState'] = {
  remonteesCapillaires: 'urgente',
  infiltrationMursEnterres: 'surveiller',
  contaminationElementsExterieurs: 'ras',
  condensation: 'necessaire',
  qualiteAir: 'necessaire',
  infiltrationFacade: 'ras',
  infiltrationToiture: 'ras',
  infiltrationTerrasses: 'ras',
};

const MOCK_MANUAL_TEXT =
  "Le diagnostic met en évidence deux phénomènes simultanés et distincts : (1) des remontées capillaires actives sur les murs périphériques nord et ouest, et (2) une condensation chronique liée à un renouvellement d'air défaillant. Les deux pathologies doivent être traitées de manière concomitante pour rétablir un environnement sain.";

export const buildMockReport = (): ReportData => ({
  clientNom: 'Dupuis',
  clientPrenom: 'Marie',
  clientAdresse: '12 rue des Fleurs',
  clientCP: '75011',
  clientVille: 'Paris',
  clientTel: '06 12 34 56 78',
  clientEmail: 'marie.dupuis@example.com',
  clientQualite: 'Propriétaire',
  diagNom: 'Frade',
  diagPrenom: 'Paul',
  diagDate: new Date().toISOString().split('T')[0],
  dossierRef: `Dossier Ref. ${new Date().getFullYear()}-DEMO`,

  histDate: '< 1 an',
  histPieces: ['Chambre', 'Salle de bain', 'Sous-sol'],
  histObs:
    "Apparition progressive de taches d'humidité au pied des murs nord. Phénomène aggravé après l'hiver dernier, particulièrement humide. Les peintures se décollent en plusieurs zones.",

  sympInt: ['Dégradation des murs', 'Moisissures', 'Mauvaises odeurs', "Pollution de l'air intérieur"],
  obsInt: 'Forte sensation de froid sur les murs périphériques. Plâtre dégradé sur 40 cm en pied de mur dans la chambre nord.',

  sympExt: ['Salpêtre', 'Pieds de murs humides', 'Mousse', 'Peinture écaillée'],
  obsExt:
    'Façade nord particulièrement exposée. Présence de mousse continue le long du soubassement. Aucun système de drainage périphérique visible.',

  attentes: ['Problèmes de santé', 'Moisissures / champignons', 'Entretien du bâtiment'],
  consequences: ['Dégradation', 'Risque de maladie chronique', 'Perte à la revente'],

  nbAdultes: '2',
  nbEnfants: '1',

  batType: 'Maison',
  batAnnee: '1962',
  batMaconnerie: 'Pierre tendre',
  batIsolation: ['Doublage mur', 'Combles: ouate'],

  visiteDebut: '09:30',
  visiteFin: '11:45',
  visiteComplete: true,
  visiteMotif: '',
  obsMurExt: ['Salpêtre', 'Mousse', 'Fissures'],
  obsMurInt: ['Salpêtre', 'Moisissures', 'Dégradation de la peinture', 'Cloques'],
  obsAirInt: ['Mauvaise odeur', 'Moisissures', 'Absence de ventilation'],
  obsSupp:
    'La VMC simple flux est non fonctionnelle (encrassée, bouches obstruées). Aucun renouvellement d\'air mécanique opérationnel.',

  testNitrate: 'Oui',
  testNitrateListe: [
    { valeur: '250', lieu: 'Mur Nord – chambre, pied de mur' },
    { valeur: '100', lieu: 'Mur Ouest – sous-sol' },
    { valeur: '25', lieu: 'Mur Sud – salon, mi-hauteur (témoin)' },
  ],
  testT660: 'Oui',
  testT660Details:
    'Mur Nord chambre : 110-140 digits sur les 60 premiers cm.\nMur Ouest sous-sol : 160-180 digits.\nMur Sud salon : 35-45 digits (zone saine).',
  testHygro: 'Oui',
  testHygroDetails:
    'Hygrométrie ambiante chambre : 72 %.\nSalle de bain (au repos) : 78 %.\nSalon : 58 %. Toutes les valeurs sont au-dessus du seuil de 50 %.',
  testIgeres: 'Non',
  testIgeresDetails: '',
  obsFinales:
    "Les mesures convergent vers un diagnostic mixte : remontées capillaires actives sur le mur nord (digits > 100, salpêtre confirmé) et condensation chronique liée à l'absence de renouvellement d'air (hygrométrie ambiante > 70 %).",

  pathologiesState: MOCK_PATHOLOGIES,
  risquesCoches: ['Moisissure excessive', 'Risque Sanitaire', 'Pourrissement des bois'],
  conclusionPathologies: mergeConclusion(MOCK_PATHOLOGIES, MOCK_MANUAL_TEXT),
  texteManuel: MOCK_MANUAL_TEXT,

  signatureClientData: fakeSignature(0),
  signatureDiagData: fakeSignature(7),
  photos: [
    fakePhoto('Photo 1 — Pied de mur nord (chambre)'),
    fakePhoto('Photo 2 — Soubassement façade nord'),
    fakePhoto('Photo 3 — Sous-sol mur ouest'),
  ].filter((p): p is string => p !== null),
});
