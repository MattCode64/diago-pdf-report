import type { ReactNode } from 'react';

interface StepTitleProps {
  step: number;
  title: string;
  subtitle?: ReactNode;
}

export const StepTitle = ({ step, title, subtitle }: StepTitleProps) => (
  <div className="mb-6 border-b border-slate-200 pb-4">
    <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">Étape {step}</p>
    <h2
      className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl"
      style={{ fontFamily: 'var(--font-serif)' }}
    >
      {title}
    </h2>
    {subtitle && <p className="mt-2 text-sm text-slate-600">{subtitle}</p>}
  </div>
);
