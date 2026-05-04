import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import type { ReportData } from '../../schemas/reportSchema';
import { NITRATE_VALUES } from '../../data/constants';

export const NitrateTestList = () => {
  const { control, register } = useFormContext<ReportData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'testNitrateListe',
  });

  return (
    <div className="space-y-3">
      {fields.length === 0 && (
        <p className="text-sm italic text-slate-500">Aucun relevé ajouté pour le moment.</p>
      )}
      {fields.map((field, idx) => (
        <div
          key={field.id}
          className="grid grid-cols-[110px_1fr_auto] gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
        >
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Taux (mg)</label>
            <select
              {...register(`testNitrateListe.${idx}.valeur` as const)}
              className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
            >
              {NITRATE_VALUES.map((v) => (
                <option key={v} value={String(v)}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Lieu du prélèvement</label>
            <input
              type="text"
              {...register(`testNitrateListe.${idx}.lieu` as const)}
              placeholder="Ex. Mur Nord – pied de mur"
              className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => remove(idx)}
              aria-label="Supprimer ce relevé"
              className="flex h-9 w-9 items-center justify-center rounded-md text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ valeur: '0', lieu: '' })}
        className="inline-flex items-center gap-2 rounded-md border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-800 hover:bg-brand-100"
      >
        <Plus className="h-4 w-4" />
        Ajouter un relevé
      </button>
    </div>
  );
};
