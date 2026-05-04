import { useFormContext } from 'react-hook-form';
import { SectionCard } from '../layout/SectionCard';
import { StepTitle } from '../layout/StepTitle';
import { SignaturePad } from '../form/SignaturePad';
import { PhotoUpload } from '../form/PhotoUpload';
import { todayFr } from '../../utils/formatDate';
import type { ReportData } from '../../schemas/reportSchema';

export const Step13Signatures = () => {
  const { watch } = useFormContext<ReportData>();
  const clientNom = watch('clientNom');

  return (
    <div className="space-y-6">
      <StepTitle
        step={13}
        title="Validation & signature"
        subtitle="Obligation de conseil, signatures, photos annexes."
      />

      <SectionCard title="Obligation de conseil et d'information">
        <div className="space-y-3 text-sm leading-relaxed text-slate-700">
          <p>
            Ce document établi ce jour <strong>{todayFr()}</strong> a pour objectif d'informer{' '}
            <strong>M. &amp; Mme {clientNom || '—'}</strong> sur les pathologies liées à l'humidité
            identifiées lors du contrôle et leurs risques associés.
          </p>
          <p>
            La société ne pourra en aucun cas être tenue pour responsable notamment en cas de visite
            partielle, vice caché, défaut d'information ou refus d'exploration ainsi que des
            conséquences sanitaires, structurelles et/ou économiques liées à l'absence de
            traitements ultérieurs des pathologies évolutives relevées.
          </p>
          <p className="font-semibold text-brand-900">
            Les propriétaires par leur signature ci-dessous reconnaissent avoir été parfaitement
            informés et déchargent la société de sa responsabilité de conseil.
          </p>
        </div>
      </SectionCard>

      <div className="grid gap-6 md:grid-cols-2">
        <SectionCard title="Signature du client">
          <SignaturePad name="signatureClientData" label="Signez ci-dessous" />
        </SectionCard>
        <SectionCard title="Signature du technicien">
          <SignaturePad name="signatureDiagData" label="Signez ci-dessous" />
        </SectionCard>
      </div>

      <SectionCard title="Pièces jointes (photos)" description="Elles apparaîtront en annexe du PDF.">
        <PhotoUpload />
      </SectionCard>
    </div>
  );
};
