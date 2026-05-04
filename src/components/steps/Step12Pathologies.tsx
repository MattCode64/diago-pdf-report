import { Controller, useFormContext } from 'react-hook-form';
import { AlertTriangle, BadgeCheck, ClipboardList } from 'lucide-react';
import { SectionCard } from '../layout/SectionCard';
import { StepTitle } from '../layout/StepTitle';
import { TextAreaField } from '../form/fields/TextAreaField';
import {
  PATHOLOGY_KEYS,
  PATHOLOGY_LABELS,
  PATHOLOGY_STATUS_OPTIONS,
  RISQUES,
} from '../../data/constants';
import type { ReportData } from '../../schemas/reportSchema';
import { cn } from '../../utils/cn';

export const Step12Pathologies = () => {
  const { control, watch, setValue, register } = useFormContext<ReportData>();
  const risques = watch('risquesCoches');

  const toggleRisque = (r: string) => {
    const next = risques.includes(r) ? risques.filter((x) => x !== r) : [...risques, r];
    setValue('risquesCoches', next, { shouldDirty: true });
  };

  return (
    <div className="space-y-6">
      <StepTitle
        step={12}
        title="Pathologies & risques"
        subtitle="Qualifiez chaque pathologie et cochez les risques identifiés."
      />

      <div className="flex items-start gap-2 rounded-lg border border-brand-200 bg-brand-50 p-3 text-sm text-brand-900">
        <BadgeCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-600" />
        <p>
          Lorsqu'une pathologie est marquée{' '}
          <strong>Intervention nécessaire</strong> ou <strong>Intervention urgente</strong>, la
          conclusion technique pré-remplie est automatiquement injectée dans la zone de conclusion
          (séparée par un marqueur).
        </p>
      </div>

      <SectionCard title="État des pathologies">
        <div className="grid gap-3 md:grid-cols-2">
          {PATHOLOGY_KEYS.map((key) => (
            <Controller
              key={key}
              control={control}
              name={`pathologiesState.${key}`}
              render={({ field }) => {
                const opt = PATHOLOGY_STATUS_OPTIONS.find((o) => o.value === field.value);
                return (
                  <div
                    className={cn(
                      'flex flex-col gap-2 rounded-xl border p-4 transition-colors',
                      opt?.bg,
                      opt?.fg,
                      opt?.border,
                    )}
                  >
                    <label className="text-sm font-semibold leading-tight">
                      {PATHOLOGY_LABELS[key]}
                    </label>
                    <select
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900"
                    >
                      {PATHOLOGY_STATUS_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }}
            />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Risques immédiats">
        <div className="flex items-start gap-2 text-sm text-slate-600">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
          <p>Cochez les risques potentiels ou avérés identifiés pendant la visite.</p>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          {RISQUES.map((risk) => {
            const checked = risques.includes(risk);
            return (
              <label
                key={risk}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors',
                  checked
                    ? 'border-red-300 bg-red-50 font-medium text-red-900'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleRisque(risk)}
                  className="h-4 w-4 flex-shrink-0 rounded border-slate-300 text-red-600 focus:ring-red-500"
                />
                <span>{risk}</span>
              </label>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Conclusion & préconisations">
        <div className="flex items-start gap-2 text-sm text-slate-600">
          <ClipboardList className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-600" />
          <p>
            Saisissez votre texte personnel au-dessus. Les analyses techniques automatiques (si
            pathologies urgentes/nécessaires) seront concaténées automatiquement en dessous.
          </p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Votre texte personnel</label>
          <textarea
            {...register('texteManuel')}
            rows={5}
            placeholder="Saisissez votre conclusion personnelle…"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <TextAreaField
          name="conclusionPathologies"
          label="Texte final (assemblé automatiquement, éditable si besoin)"
          rows={10}
          className="[&_textarea]:font-mono [&_textarea]:text-xs"
        />
      </SectionCard>
    </div>
  );
};
