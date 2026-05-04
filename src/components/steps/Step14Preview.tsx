import { useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { PDFViewer, pdf } from '@react-pdf/renderer';
import { Download, Share2, Loader2 } from 'lucide-react';
import { ReportDocument } from '../pdf/ReportDocument';
import { StepTitle } from '../layout/StepTitle';
import { SectionCard } from '../layout/SectionCard';
import { clearDraft } from '../../hooks/usePersistedDraft';
import type { ReportData } from '../../schemas/reportSchema';

export const Step14Preview = () => {
  const { watch } = useFormContext<ReportData>();
  const data = watch();
  const [busy, setBusy] = useState<'download' | 'share' | null>(null);

  const canShare =
    typeof navigator !== 'undefined' &&
    typeof navigator.share === 'function' &&
    typeof navigator.canShare === 'function';

  const fileName = useMemo(
    () => `Rapport_Diagnostic_${(data.clientNom || 'Client').replace(/\s+/g, '_')}.pdf`,
    [data.clientNom],
  );

  const buildBlob = async (): Promise<Blob> => {
    const instance = pdf(<ReportDocument data={data} />);
    return await instance.toBlob();
  };

  const onDownload = async () => {
    setBusy('download');
    try {
      const blob = await buildBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      clearDraft();
    } finally {
      setBusy(null);
    }
  };

  const onShare = async () => {
    setBusy('share');
    try {
      const blob = await buildBlob();
      const file = new File([blob], fileName, { type: 'application/pdf' });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Diagnostic humidité',
          text: 'Rapport de diagnostic DIAGO',
        });
        clearDraft();
      }
    } catch (err) {
      if ((err as { name?: string }).name !== 'AbortError') {
        console.error('Erreur partage', err);
      }
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-6">
      <StepTitle
        step={14}
        title="Aperçu & téléchargement"
        subtitle="Vérifiez le rendu avant de télécharger ou partager le PDF."
      />

      <SectionCard title="Actions">
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onDownload}
            disabled={busy !== null}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-70"
          >
            {busy === 'download' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Télécharger le PDF
          </button>
          {canShare && (
            <button
              type="button"
              onClick={onShare}
              disabled={busy !== null}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-brand-600 bg-white px-4 py-3 text-sm font-semibold text-brand-700 shadow-sm transition-colors hover:bg-brand-50 disabled:cursor-wait disabled:opacity-70"
            >
              {busy === 'share' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
              Partager
            </button>
          )}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Le brouillon local est effacé automatiquement après téléchargement ou partage réussi.
        </p>
      </SectionCard>

      <SectionCard title="Aperçu">
        <div className="-mx-4 h-[75vh] overflow-hidden bg-slate-200 md:mx-0 md:rounded-lg">
          <PDFViewer width="100%" height="100%" showToolbar>
            <ReportDocument data={data} />
          </PDFViewer>
        </div>
      </SectionCard>
    </div>
  );
};
