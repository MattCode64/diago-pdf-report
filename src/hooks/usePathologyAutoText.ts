import { useEffect, useMemo, useRef } from 'react';
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

  const lastAutoWrittenRef = useRef<string | null>(null);

  useEffect(() => {
    const current = methods.getValues('conclusionPathologies');
    const userEdited =
      lastAutoWrittenRef.current !== null && current !== lastAutoWrittenRef.current;
    if (userEdited) return;
    if (current !== merged) {
      methods.setValue('conclusionPathologies', merged, {
        shouldDirty: true,
        shouldValidate: false,
      });
      lastAutoWrittenRef.current = merged;
    }
  }, [merged, methods]);
};
