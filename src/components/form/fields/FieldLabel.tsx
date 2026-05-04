import type { ReactNode } from 'react';

interface FieldLabelProps {
  htmlFor?: string;
  children: ReactNode;
  required?: boolean;
}

export const FieldLabel = ({ htmlFor, children, required }: FieldLabelProps) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700 mb-1.5">
    {children}
    {required && <span className="ml-1 text-red-600">*</span>}
  </label>
);
