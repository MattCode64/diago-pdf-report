import { type ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form';
import { createDefaultReport, type ReportData } from '../schemas/reportSchema';

interface RenderWithFormOptions extends Omit<RenderOptions, 'wrapper'> {
  defaultValues?: Partial<ReportData>;
}

interface RenderWithFormResult {
  methods: UseFormReturn<ReportData>;
  rerender: (ui: ReactNode) => void;
  unmount: () => void;
  container: HTMLElement;
}

export const renderWithForm = (
  ui: ReactNode,
  { defaultValues, ...options }: RenderWithFormOptions = {},
): RenderWithFormResult => {
  let capturedMethods: UseFormReturn<ReportData> | null = null;

  const Wrapper = ({ children }: { children: ReactNode }) => {
    const methods = useForm<ReportData>({
      defaultValues: { ...createDefaultReport(), ...defaultValues },
      mode: 'onBlur',
    });
    capturedMethods = methods;
    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  const result = render(ui, { wrapper: Wrapper, ...options });

  return {
    get methods() {
      if (!capturedMethods) throw new Error('Form methods not yet initialized');
      return capturedMethods;
    },
    rerender: result.rerender,
    unmount: result.unmount,
    container: result.container,
  };
};
