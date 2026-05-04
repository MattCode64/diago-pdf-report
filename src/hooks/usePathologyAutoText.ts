import { useEffect, useMemo } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { ReportData } from '../schemas/reportSchema';
import { mergeConclusion } from '../utils/conclusionText';

export const usePathologyAutoText = (methods: UseFormReturn<ReportData>): void => {
  const pathologies = methods.watch('pathologiesState');
  const manualText = methods.watch('texteManuel');

  const merged = useMemo(
    () => mergeConclusion(pathologies, manualText),
    [pathologies, manualText],
  );

  useEffect(() => {
    const current = methods.getValues('conclusionPathologies');
    if (current !== merged) {
      methods.setValue('conclusionPathologies', merged, {
        shouldDirty: true,
        shouldValidate: false,
      });
    }
  }, [merged, methods]);
};
