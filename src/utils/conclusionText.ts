import type { PathologyKey } from '../data/constants';
import { PATHOLOGY_AUTO_TEXTS, AUTO_TEXT_MARKER } from '../data/pathologyTexts';
import type { ReportData } from '../schemas/reportSchema';

const TRIGGER_STATUSES: ReadonlyArray<ReportData['pathologiesState'][PathologyKey]> = [
  'necessaire',
  'urgente',
];

export const buildAutoConclusionText = (
  pathologies: ReportData['pathologiesState'],
): string => {
  const parts: string[] = [];
  (Object.keys(PATHOLOGY_AUTO_TEXTS) as PathologyKey[]).forEach((key) => {
    const status = pathologies[key];
    if (status && TRIGGER_STATUSES.includes(status)) {
      const text = PATHOLOGY_AUTO_TEXTS[key];
      if (text) parts.push(text);
    }
  });
  return parts.join('\n\n');
};

export const mergeConclusion = (
  pathologies: ReportData['pathologiesState'],
  manualText: string,
): string => {
  const autoText = buildAutoConclusionText(pathologies);
  if (!manualText) return autoText;
  if (!autoText) return manualText;
  return `${manualText}\n\n${AUTO_TEXT_MARKER}\n\n${autoText}`;
};
