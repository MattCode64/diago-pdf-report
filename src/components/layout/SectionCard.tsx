import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface SectionCardProps {
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const SectionCard = ({ title, description, children, className }: SectionCardProps) => (
  <section
    className={cn(
      'rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-6',
      className,
    )}
  >
    {title && <h3 className="mb-1 text-base font-bold text-brand-900">{title}</h3>}
    {description && <p className="mb-4 text-sm text-slate-500">{description}</p>}
    <div className="space-y-4">{children}</div>
  </section>
);
