import { STEP_TITLES } from '../../schemas/reportSchema';
import { cn } from '../../utils/cn';

interface StepperProps {
  current: number;
  total: number;
  onJump?: (step: number) => void;
}

export const Stepper = ({ current, total, onJump }: StepperProps) => {
  return (
    <nav aria-label="Navigation des étapes" className="mx-auto max-w-4xl px-4 pt-4">
      <div className="hidden md:block">
        <ol className="flex flex-wrap gap-1 text-xs">
          {Array.from({ length: total }, (_, i) => i + 1).map((n) => {
            const isCurrent = n === current;
            const isDone = n < current;
            return (
              <li key={n}>
                <button
                  type="button"
                  onClick={() => onJump?.(n)}
                  className={cn(
                    'rounded-full border px-3 py-1 font-medium transition-colors',
                    isCurrent && 'border-brand-600 bg-brand-600 text-white',
                    isDone && !isCurrent && 'border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100',
                    !isCurrent && !isDone && 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50',
                  )}
                >
                  <span className="tabular-nums">{n}.</span>{' '}
                  <span className="hidden lg:inline">{STEP_TITLES[n]}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="md:hidden">
        <p className="text-sm font-semibold text-brand-900">{STEP_TITLES[current]}</p>
      </div>
    </nav>
  );
};
