import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StepNavigationProps {
  step: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  nextLabel?: string;
}

export const StepNavigation = ({
  step,
  total,
  onPrev,
  onNext,
  onReset,
  nextLabel,
}: StepNavigationProps) => {
  const isLast = step === total;

  return (
    <nav className="sticky bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-4xl items-center gap-2 px-4 py-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={step === 1}
          className={cn(
            'flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
            step === 1
              ? 'cursor-not-allowed border-slate-200 text-slate-300'
              : 'border-slate-300 text-slate-700 hover:bg-slate-50',
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Précédent</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="ml-auto flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 hover:text-red-600"
          title="Réinitialiser le formulaire"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="hidden md:inline">Nouveau rapport</span>
        </button>

        {!isLast && (
          <button
            type="button"
            onClick={onNext}
            className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
          >
            {nextLabel ?? 'Suivant'}
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </nav>
  );
};
