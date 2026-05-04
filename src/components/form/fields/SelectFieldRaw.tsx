import { useId } from 'react';
import { FieldLabel } from './FieldLabel';
import { cn } from '../../../utils/cn';

interface SelectFieldRawProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: ReadonlyArray<{ value: string; label: string }>;
  className?: string;
}

export const SelectFieldRaw = ({
  label,
  value,
  onChange,
  options,
  className,
}: SelectFieldRawProps) => {
  const id = useId();
  return (
    <div className={cn('w-full', className)}>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-lg border border-slate-300 bg-white bg-[url('data:image/svg+xml;utf8,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20viewBox=%220%200%2020%2020%22%20fill=%22none%22%20stroke=%22%2364748b%22%20stroke-width=%222%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22><polyline%20points=%226%209%2010%2013%2014%209%22/></svg>')] bg-[length:14px_14px] bg-[right_12px_center] bg-no-repeat px-3 py-2 pr-10 text-sm text-slate-900 shadow-sm transition-colors hover:border-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
