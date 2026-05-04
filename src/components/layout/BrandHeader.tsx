import type { ReactNode } from 'react';
import { Droplets } from 'lucide-react';

interface BrandHeaderProps {
  step: number;
  total: number;
  actions?: ReactNode;
}

export const BrandHeader = ({ step, total, actions }: BrandHeaderProps) => {
  return (
    <header className="sticky top-0 z-40 border-b border-brand-900/10 bg-brand-900 text-white shadow-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3 md:py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
            <Droplets className="h-5 w-5 text-sky-200" />
          </div>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-widest md:text-base">DIAGO</h1>
            <p className="hidden text-xs text-sky-200 sm:block">Diagnostic Humidité</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {actions}
          <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium tabular-nums">
            Étape {step} / {total}
          </div>
        </div>
      </div>
      <div className="h-1 w-full bg-brand-950">
        <div
          className="h-full bg-sky-300 transition-[width] duration-300"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
    </header>
  );
};
