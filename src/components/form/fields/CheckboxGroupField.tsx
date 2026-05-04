import { Controller, useFormContext } from 'react-hook-form';
import { FieldLabel } from './FieldLabel';
import type { ReportData } from '../../../schemas/reportSchema';
import { cn } from '../../../utils/cn';

type ArrayFieldName = {
  [K in keyof ReportData]: ReportData[K] extends string[] ? K : never;
}[keyof ReportData];

interface CheckboxGroupFieldProps {
  name: ArrayFieldName;
  label: string;
  options: readonly string[];
  columns?: 1 | 2 | 3;
}

export const CheckboxGroupField = ({
  name,
  label,
  options,
  columns = 2,
}: CheckboxGroupFieldProps) => {
  const { control } = useFormContext<ReportData>();

  return (
    <div className="w-full">
      <FieldLabel>{label}</FieldLabel>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const values = field.value ?? [];
          const toggle = (option: string) => {
            if (values.includes(option)) {
              field.onChange(values.filter((v) => v !== option));
            } else {
              field.onChange([...values, option]);
            }
          };

          return (
            <div
              className={cn(
                'grid gap-2',
                columns === 1 && 'grid-cols-1',
                columns === 2 && 'grid-cols-1 sm:grid-cols-2',
                columns === 3 && 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
              )}
            >
              {options.map((option) => {
                const checked = values.includes(option);
                return (
                  <label
                    key={option}
                    className={cn(
                      'flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition-colors',
                      checked
                        ? 'border-brand-500 bg-brand-50 text-brand-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50',
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(option)}
                      className="h-4 w-4 flex-shrink-0 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span className="leading-tight">{option}</span>
                  </label>
                );
              })}
            </div>
          );
        }}
      />
    </div>
  );
};
