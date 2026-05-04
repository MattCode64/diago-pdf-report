export const DIAG_NOMS = ['Frade', 'Da Cruz'] as const;
export const DIAG_PRENOMS = ['Paul', 'Steven'] as const;

export const QUALITE_DEMANDEUR = [
  'Propriétaire',
  'Bailleur',
  'Syndic',
  'Copropriétaire',
  'Gestionnaire',
  'Locataire',
  'Architecte',
  'Expert',
  'Agent immobilier',
  'Assureur',
  'Promoteur',
] as const;

export const DATE_APPARITION = ['< 3 mois', '< 6 mois', '< 1 an', '+ 1 an'] as const;

export const PIECES = [
  'Chambre',
  'Salon',
  'Salle de bain',
  'Toilettes',
  'Cuisine',
  'Sous-sol',
  'Combles',
  'Garage',
  'Couloir',
] as const;

export const SYMPTOMES_INTERIEUR = [
  'Dégradation des murs',
  'Buée / condensation',
  'Moisissures',
  'Taches / auréoles',
  'Champignons',
  'Mauvaises odeurs',
  'Infiltrations',
  'Sensation de froid',
  'Chauffage excessif',
  'Problèmes électriques',
  'Mauvaise santé',
  'Asthme / bronchites / rhinite',
  'Arthrite / arthrose',
  'Eczéma',
  'Radon',
  "Pollution de l'air intérieur",
] as const;

export const SYMPTOMES_EXTERIEUR = [
  'RAS',
  'Fissures',
  'Salpêtre',
  'Peinture écaillée',
  'Taches assombrissantes',
  'Pieds de murs humides',
  'Mousse',
  'Lichens sur murs',
  'Détachement du parement',
  'Chute de maçonnerie',
  'Pourrissement du bois',
] as const;

export const ATTENTES = [
  'Plainte locataire / voisin',
  'Demande du médecin',
  'Problèmes de santé',
  'Allergies, eczéma',
  "Pollution de l'air intérieur",
  'Radon',
  'Moisissures / champignons',
  'Mise aux normes',
  'Entretien du bâtiment',
  "Recherche d'une maison saine",
  'Difficultés à revendre',
  'Difficultés à louer',
  'Projet de revente',
  'Projet de location',
  "Protéger l'investissement",
] as const;

export const CONSEQUENCES = [
  "Pas d'avis",
  'Dégradation',
  'Perte de revenus locatifs',
  'Interdiction de louer',
  "Insalubrité ou risque d'insalubrité",
  'Perte à la revente',
  'Revente impossible',
  'Risque de maladie grave',
  'Risque de maladie chronique',
  'Risque de déménagement',
  'Risque destruction / effondrement',
  'Risques électriques',
  'Inondation',
] as const;

export const TYPE_BATIMENT = [
  'Appartement',
  'Maison',
  'Bureau',
  'Commerce',
  'Industrie',
  'Vide sanitaire',
  'Sous-sol',
  'Cave',
  'Terre-plein',
] as const;

export const TYPE_MACONNERIE = [
  'Parpaing',
  'Brique',
  'Pierre tendre',
  'Pierre dure',
  'Béton cellulaire',
  'Béton vibré',
  'Mâchefer',
  'Torchis',
  'Bois pan.',
  'Métal',
  'Verre',
  'Mixte',
] as const;

export const ISOLATION = [
  'Doublage mur',
  'Brique',
  'Laine de verre',
  'Laine de roche',
  'Polystyrène',
  'Combles: plaques',
  'Combles: ouate',
  'Combles: coton',
  'Sous-toiture: plaques',
  'Sous-toiture: laine verre',
  'Sous-toiture: laine roche',
  'Film',
] as const;

export const OBS_MURS_EXT = [
  'R.A.S',
  'Salpêtre',
  'Moisissures',
  'Champignons',
  'Mousse',
  'Lichens',
  'Cloques',
  'Pourriture',
  "Chute d'enduit",
  'Fissures',
  'Taches',
] as const;

export const OBS_MURS_INT = [
  'Salpêtre',
  'Moisissures',
  'Fuite',
  'Dégradation de la peinture',
  'Dégradation du plâtre',
  'Condensation',
  'Mérule',
  'Infiltrations',
  'Cloques',
  'Tâches',
  'Fissures',
] as const;

export const OBS_AIR = [
  'Mauvaise odeur',
  'Moisissures',
  'Aspergillus',
  'Acariens',
  'Absence de ventilation',
  'Composant Organique Volatile',
  'Mérule',
  'Radon',
] as const;

export const RISQUES = [
  'Chocs électriques',
  'Suspicion de mérule',
  'Aspergillus',
  'Pourrissement des bois',
  'Moisissure excessive',
  'Risques structurels',
  'Infiltration / inondation',
  'Risque Sanitaire',
] as const;

export const NITRATE_VALUES = [0, 10, 25, 50, 100, 250, 500] as const;

export const TEST_NITRATE_OPTIONS = ['Oui', 'Non', 'Non nécessaire'] as const;

export const OUI_NON = ['Non', 'Oui'] as const;

export const PATHOLOGY_KEYS = [
  'remonteesCapillaires',
  'infiltrationMursEnterres',
  'contaminationElementsExterieurs',
  'condensation',
  'qualiteAir',
  'infiltrationFacade',
  'infiltrationToiture',
  'infiltrationTerrasses',
] as const;

export type PathologyKey = (typeof PATHOLOGY_KEYS)[number];

export const PATHOLOGY_LABELS: Record<PathologyKey, string> = {
  remonteesCapillaires: 'Remontées capillaires',
  infiltrationMursEnterres: 'Infiltration de murs enterrés',
  contaminationElementsExterieurs: 'Contamination d’éléments extérieurs',
  condensation: 'Condensation',
  qualiteAir: 'Qualité d’air',
  infiltrationFacade: 'Infiltration de façade',
  infiltrationToiture: 'Infiltration de toiture',
  infiltrationTerrasses: 'Infiltration de terrasses',
};

export const PATHOLOGY_STATUSES = ['ras', 'correct', 'surveiller', 'necessaire', 'urgente'] as const;

export type PathologyStatus = (typeof PATHOLOGY_STATUSES)[number];

export interface PathologyStatusOption {
  value: PathologyStatus;
  label: string;
  bg: string;
  fg: string;
  border: string;
  pdfBg: string;
  pdfFg: string;
}

export const PATHOLOGY_STATUS_OPTIONS: PathologyStatusOption[] = [
  {
    value: 'ras',
    label: 'RAS',
    bg: 'bg-slate-50',
    fg: 'text-slate-700',
    border: 'border-slate-200',
    pdfBg: '#f8fafc',
    pdfFg: '#64748b',
  },
  {
    value: 'correct',
    label: 'Correct',
    bg: 'bg-emerald-50',
    fg: 'text-emerald-800',
    border: 'border-emerald-200',
    pdfBg: '#ecfdf5',
    pdfFg: '#065f46',
  },
  {
    value: 'surveiller',
    label: 'À surveiller',
    bg: 'bg-amber-50',
    fg: 'text-amber-800',
    border: 'border-amber-200',
    pdfBg: '#fffbeb',
    pdfFg: '#92400e',
  },
  {
    value: 'necessaire',
    label: 'Intervention nécessaire',
    bg: 'bg-orange-50',
    fg: 'text-orange-900',
    border: 'border-orange-300',
    pdfBg: '#fff7ed',
    pdfFg: '#9a3412',
  },
  {
    value: 'urgente',
    label: 'Intervention urgente',
    bg: 'bg-red-50',
    fg: 'text-red-900',
    border: 'border-red-300',
    pdfBg: '#fef2f2',
    pdfFg: '#991b1b',
  },
];

export const COMPANY = {
  name: 'DIAGO HUMIDITÉ',
  operator: 'M.P.C',
  address: '60 RUE FRANCOIS 1ER, 75008 PARIS',
  phone: '06 82 53 39 50',
  email: 'contact@diago-humidite.fr',
  rcs: '984 496 083 R.C.S. Paris',
  iban: 'IBAN : FR76 3000 3008 4600 0201 8171 781 - BIC : SOGEFRPP',
  website: 'www.diago-humidite.fr',
} as const;
