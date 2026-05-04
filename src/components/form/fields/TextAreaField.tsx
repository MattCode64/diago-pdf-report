import type { TextareaHTMLAttributes } from 'react';
import { useId } from 'react';
import { useFormContext } from 'react-hook-form';
import { FieldLabel } from './FieldLabel';
import type { ReportData } from '../../../schemas/reportSchema';
import { cn } from '../../../utils/cn';

type TextAreaName = {
  [K in keyof ReportData]: ReportData[K] extends string ? K : never;
}[keyof ReportData];

interface TextAreaFieldProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'> {
  name: TextAreaName;
  label?: string;
  rows?: number;
}

export const TextAreaField = ({
  name,
  label,
  rows = 4,
  className,
  ...rest
}: TextAreaFieldProps) => {
  const id = useId();
  const { register } = useFormContext<ReportData>();

  return (
    <div className={cn('w-full', className)}>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <textarea
        id={id}
        rows={rows}
        {...register(name)}
        {...rest}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
      />
    </div>
  );
};
