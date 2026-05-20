import { describe, it, expect } from 'vitest';
import { act, render } from '@testing-library/react';
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form';
import { createDefaultReport, type ReportData } from '../schemas/reportSchema';
import { usePathologyAutoText } from './usePathologyAutoText';
import { PATHOLOGY_AUTO_TEXTS, AUTO_TEXT_MARKER } from '../data/pathologyTexts';

const RAS_PATHOLOGIES: ReportData['pathologiesState'] = {
  remonteesCapillaires: 'ras',
  infiltrationMursEnterres: 'ras',
  contaminationElementsExterieurs: 'ras',
  condensation: 'ras',
  qualiteAir: 'ras',
  infiltrationFacade: 'ras',
  infiltrationToiture: 'ras',
  infiltrationTerrasses: 'ras',
};

// Harnais React : un composant qui appelle le hook et expose les
// méthodes du formulaire pour que les tests pilotent le state.
// Indispensable : le hook s'abonne via watch(), donc il doit
// vivre dans un composant qui re-render à chaque setValue.
const renderHarness = (initial?: Partial<ReportData>) => {
  const captured: { methods: UseFormReturn<ReportData> | null } = { methods: null };

  const Harness = () => {
    const methods = useForm<ReportData>({
      defaultValues: { ...createDefaultReport(), ...initial },
    });
    captured.methods = methods;
    usePathologyAutoText(methods);
    return <FormProvider {...methods}>{null}</FormProvider>;
  };

  render(<Harness />);

  return {
    get methods() {
      if (!captured.methods) throw new Error('Form not initialized');
      return captured.methods;
    },
  };
};

describe('usePathologyAutoText', () => {
  describe('génération automatique', () => {
    it('n\'écrit rien quand aucune pathologie n\'est en necessaire/urgente', () => {
      const { methods } = renderHarness();
      expect(methods.getValues('conclusionPathologies')).toBe('');
    });

    it('écrit le texte auto dès qu\'une pathologie passe à "urgente"', () => {
      const { methods } = renderHarness();

      act(() => {
        methods.setValue('pathologiesState', {
          ...RAS_PATHOLOGIES,
          remonteesCapillaires: 'urgente',
        });
      });

      expect(methods.getValues('conclusionPathologies')).toBe(
        PATHOLOGY_AUTO_TEXTS.remonteesCapillaires,
      );
    });

    it('écrit le texte auto pour "necessaire" aussi', () => {
      const { methods } = renderHarness();

      act(() => {
        methods.setValue('pathologiesState', {
          ...RAS_PATHOLOGIES,
          condensation: 'necessaire',
        });
      });

      expect(methods.getValues('conclusionPathologies')).toBe(
        PATHOLOGY_AUTO_TEXTS.condensation,
      );
    });

    it('n\'écrit rien pour les statuts non-trigger (ras, correct, surveiller)', () => {
      const { methods } = renderHarness();

      act(() => {
        methods.setValue('pathologiesState', {
          ...RAS_PATHOLOGIES,
          remonteesCapillaires: 'surveiller',
          condensation: 'correct',
        });
      });

      expect(methods.getValues('conclusionPathologies')).toBe('');
    });

    it('concatène plusieurs pathologies en triggered dans l\'ordre des PATHOLOGY_AUTO_TEXTS', () => {
      const { methods } = renderHarness();

      act(() => {
        methods.setValue('pathologiesState', {
          ...RAS_PATHOLOGIES,
          remonteesCapillaires: 'urgente',
          condensation: 'necessaire',
        });
      });

      const value = methods.getValues('conclusionPathologies');
      expect(value).toContain(PATHOLOGY_AUTO_TEXTS.remonteesCapillaires);
      expect(value).toContain(PATHOLOGY_AUTO_TEXTS.condensation);
      const idxRemontees = value.indexOf(PATHOLOGY_AUTO_TEXTS.remonteesCapillaires ?? '');
      const idxCondensation = value.indexOf(PATHOLOGY_AUTO_TEXTS.condensation ?? '');
      expect(idxRemontees).toBeLessThan(idxCondensation);
    });

    it('ignore les pathologies sans texte auto (qualiteAir, façade, toiture…)', () => {
      const { methods } = renderHarness();

      act(() => {
        methods.setValue('pathologiesState', {
          ...RAS_PATHOLOGIES,
          qualiteAir: 'urgente',
          infiltrationFacade: 'necessaire',
        });
      });

      expect(methods.getValues('conclusionPathologies')).toBe('');
    });
  });

  describe('intégration avec texteManuel', () => {
    it('précède le texte auto par le texte manuel + marqueur', () => {
      const { methods } = renderHarness();

      act(() => {
        methods.setValue('texteManuel', 'Note du diagnostiqueur');
      });
      act(() => {
        methods.setValue('pathologiesState', {
          ...RAS_PATHOLOGIES,
          remonteesCapillaires: 'urgente',
        });
      });

      const value = methods.getValues('conclusionPathologies');
      expect(value.startsWith('Note du diagnostiqueur')).toBe(true);
      expect(value).toContain(AUTO_TEXT_MARKER);
      expect(value).toContain(PATHOLOGY_AUTO_TEXTS.remonteesCapillaires);
    });

    it('utilise uniquement le texte manuel si aucune pathologie en triggered', () => {
      const { methods } = renderHarness();

      act(() => {
        methods.setValue('texteManuel', 'Texte personnel seul');
      });

      expect(methods.getValues('conclusionPathologies')).toBe('Texte personnel seul');
    });

    it('met à jour la conclusion quand le texte manuel change', () => {
      const { methods } = renderHarness();

      act(() => {
        methods.setValue('texteManuel', 'V1');
      });
      expect(methods.getValues('conclusionPathologies')).toBe('V1');

      act(() => {
        methods.setValue('texteManuel', 'V2');
      });
      expect(methods.getValues('conclusionPathologies')).toBe('V2');
    });
  });

  describe('régression : ne pas écraser l\'édition manuelle de la conclusion', () => {
    // Avant le fix, l'utilisateur qui éditait `conclusionPathologies` voyait
    // sa modification effacée dès qu'un autre champ (texteManuel ou pathologie)
    // changeait. Ce bloc verrouille le comportement attendu.

    it('respecte une édition manuelle de conclusionPathologies après une auto-génération', () => {
      const { methods } = renderHarness();

      // 1. Auto-génère un texte
      act(() => {
        methods.setValue('pathologiesState', {
          ...RAS_PATHOLOGIES,
          remonteesCapillaires: 'urgente',
        });
      });
      expect(methods.getValues('conclusionPathologies')).toBe(
        PATHOLOGY_AUTO_TEXTS.remonteesCapillaires,
      );

      // 2. L'utilisateur édite manuellement le texte final
      act(() => {
        methods.setValue('conclusionPathologies', 'TEXTE ÉDITÉ MANUELLEMENT');
      });

      // 3. Une autre pathologie change => le hook NE DOIT PAS écraser
      act(() => {
        methods.setValue('pathologiesState', {
          ...RAS_PATHOLOGIES,
          remonteesCapillaires: 'urgente',
          condensation: 'urgente',
        });
      });

      expect(methods.getValues('conclusionPathologies')).toBe('TEXTE ÉDITÉ MANUELLEMENT');
    });

    it('respecte une édition manuelle même quand texteManuel change ensuite', () => {
      const { methods } = renderHarness();

      act(() => {
        methods.setValue('pathologiesState', {
          ...RAS_PATHOLOGIES,
          condensation: 'urgente',
        });
      });

      act(() => {
        methods.setValue('conclusionPathologies', 'Édition manuelle après auto');
      });

      act(() => {
        methods.setValue('texteManuel', "Une note tapée par l'utilisateur");
      });

      expect(methods.getValues('conclusionPathologies')).toBe('Édition manuelle après auto');
    });
  });

  describe('sync inverse — pathologies en moins', () => {
    it('décroît correctement la conclusion quand on retire le statut "urgente"', () => {
      const { methods } = renderHarness();

      act(() => {
        methods.setValue('pathologiesState', {
          ...RAS_PATHOLOGIES,
          remonteesCapillaires: 'urgente',
        });
      });
      expect(methods.getValues('conclusionPathologies')).toBe(
        PATHOLOGY_AUTO_TEXTS.remonteesCapillaires,
      );

      act(() => {
        methods.setValue('pathologiesState', RAS_PATHOLOGIES);
      });
      expect(methods.getValues('conclusionPathologies')).toBe('');
    });
  });
});
