import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ImagePlus, Loader2, Trash2 } from 'lucide-react';
import type { ReportData } from '../../schemas/reportSchema';
import { compressImage } from '../../utils/compressImage';

export const PhotoUpload = () => {
  const { watch, setValue } = useFormContext<ReportData>();
  const photos = watch('photos');
  const [busy, setBusy] = useState(false);

  const onFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setBusy(true);
    try {
      const next = [...photos];
      for (const file of Array.from(fileList)) {
        try {
          const dataUrl = await compressImage(file);
          next.push(dataUrl);
        } catch (err) {
          console.error('Erreur compression image', err);
        }
      }
      setValue('photos', next, { shouldDirty: true });
    } finally {
      setBusy(false);
    }
  };

  const remove = (idx: number) => {
    setValue(
      'photos',
      photos.filter((_, i) => i !== idx),
      { shouldDirty: true },
    );
  };

  return (
    <div>
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition-colors hover:border-brand-400 hover:bg-brand-50">
        {busy ? (
          <>
            <Loader2 className="mb-2 h-8 w-8 animate-spin text-brand-600" />
            <span className="text-sm font-medium text-slate-700">Compression en cours…</span>
          </>
        ) : (
          <>
            <ImagePlus className="mb-2 h-8 w-8 text-brand-600" />
            <span className="text-sm font-medium text-slate-700">
              Ajouter des photos (JPG, PNG, HEIC…)
            </span>
            <span className="mt-1 text-xs text-slate-500">
              Les images sont automatiquement compressées avant ajout au PDF
            </span>
          </>
        )}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            void onFiles(e.target.files);
            e.target.value = '';
          }}
          disabled={busy}
          className="sr-only"
        />
      </label>

      {photos.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {photos.map((src, idx) => (
            <div
              key={`${idx}-${src.slice(-16)}`}
              className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
            >
              <img src={src} alt={`Annexe ${idx + 1}`} className="h-28 w-full object-cover" />
              <button
                type="button"
                onClick={() => remove(idx)}
                aria-label={`Supprimer la photo ${idx + 1}`}
                className="absolute right-1.5 top-1.5 rounded-full bg-red-600/90 p-1.5 text-white opacity-90 transition-opacity hover:bg-red-700 hover:opacity-100"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1 text-xs font-medium text-white">
                Annexe {idx + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
