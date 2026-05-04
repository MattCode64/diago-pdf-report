import { useEffect, useRef } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { ReportData } from '../schemas/reportSchema';

const DEBOUNCE_MS = 400;

export const DRAFT_STORAGE_KEY = 'diago-report-draft-v1';

export const loadDraft = (): Partial<ReportData> | null => {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<ReportData>;
  } catch {
    return null;
  }
};

export const clearDraft = (): void => {
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    // noop
  }
};

export const usePersistedDraft = (methods: UseFormReturn<ReportData>): void => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const subscription = methods.watch((value) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        try {
          localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(value));
        } catch {
          // Quota exceeded — silent fail, user still has in-memory data
        }
      }, DEBOUNCE_MS);
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [methods]);
};
