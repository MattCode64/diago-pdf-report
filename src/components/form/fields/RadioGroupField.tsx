import { Controller, useFormContext } from 'react-hook-form';
import type { FieldPath } from 'react-hook-form';
import { FieldLabel } from './FieldLabel';
import type { ReportData } from '../../../schemas/reportSchema';
import { cn } from '../../../utils/cn';

interface RadioGroupFieldProps {
  name: FieldPath<ReportData>;
  label: string;
  options: readonly string[];
}

export const RadioGroupField = ({ name, label, options }: RadioGroupFieldProps) => {
  const { control } = useFormContext<ReportData>();

  return (
    <div className="w-full">
      <FieldLabel>{label}</FieldLabel>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <div className="flex flex-wrap gap-2">
            {options.map((option) => {
              const checked = field.value === option;
              return (
                <label
                  key={option}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition-colors',
                    checked
                      ? 'border-brand-500 bg-brand-50 text-brand-900 font-medium'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50',
                  )}
                >
                  <input
                    type="radio"
                    checked={checked}
                    onChange={() => field.onChange(option)}
                    className="h-3.5 w-3.5 border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  {option}
                </label>
              );
            })}
          </div>
        )}
      />
    </div>
  );
};
