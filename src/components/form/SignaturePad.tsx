import { useEffect, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Eraser } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import type { ReportData } from '../../schemas/reportSchema';
import { FieldLabel } from './fields/FieldLabel';

type SignatureFieldName = 'signatureClientData' | 'signatureDiagData';

interface SignaturePadProps {
  name: SignatureFieldName;
  label: string;
}

export const SignaturePad = ({ name, label }: SignaturePadProps) => {
  const ref = useRef<SignatureCanvas | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { watch, setValue } = useFormContext<ReportData>();
  const value = watch(name);

  useEffect(() => {
    const canvas = ref.current?.getCanvas();
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      const { width } = container.getBoundingClientRect();
      canvas.width = width * ratio;
      canvas.height = 180 * ratio;
      const ctx = canvas.getContext('2d');
      ctx?.scale(ratio, ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = '180px';
      if (value && ref.current) {
        ref.current.fromDataURL(value);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (value && ref.current && ref.current.isEmpty()) {
      ref.current.fromDataURL(value);
    }
  }, [value]);

  const handleEnd = () => {
    const canvas = ref.current;
    if (!canvas || canvas.isEmpty()) return;
    setValue(name, canvas.toDataURL('image/png'), { shouldDirty: true });
  };

  const handleClear = () => {
    ref.current?.clear();
    setValue(name, null, { shouldDirty: true });
  };

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-lg border-2 border-dashed border-slate-300 bg-slate-50"
      >
        <SignatureCanvas
          ref={ref}
          penColor="#0f172a"
          canvasProps={{
            className: 'w-full touch-none cursor-crosshair bg-white',
            style: { display: 'block', height: 180 },
          }}
          onEnd={handleEnd}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-slate-500">
          {value ? 'Signature enregistrée' : 'Signez directement sur la zone ci-dessus'}
        </span>
        <button
          type="button"
          onClick={handleClear}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-red-600 hover:bg-red-50"
        >
          <Eraser className="h-3.5 w-3.5" />
          Effacer
        </button>
      </div>
    </div>
  );
};
