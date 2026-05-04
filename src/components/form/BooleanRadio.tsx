import { Controller, useFormContext } from 'react-hook-form';
import type { FieldPath } from 'react-hook-form';
import { FieldLabel } from './fields/FieldLabel';
import type { ReportData } from '../../schemas/reportSchema';
import { cn } from '../../utils/cn';

interface BooleanRadioProps {
  name: FieldPath<ReportData>;
  label: string;
  trueLabel?: string;
  falseLabel?: string;
  onFalseSelected?: () => void;
}

export const BooleanRadio = ({
  name,
  label,
  trueLabel = 'Oui',
  falseLabel = 'Non',
  onFalseSelected,
}: BooleanRadioProps) => {
  const { control } = useFormContext<ReportData>();

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const value = Boolean(field.value);
          return (
            <div className="flex gap-2">
              {[
                { label: trueLabel, v: true },
                { label: falseLabel, v: false },
              ].map((opt) => {
                const checked = value === opt.v;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => {
                      field.onChange(opt.v);
                      if (opt.v === false) onFalseSelected?.();
                    }}
                    className={cn(
                      'flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
                      checked
                        ? 'border-brand-500 bg-brand-50 text-brand-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          );
        }}
      />
    </div>
  );
};
