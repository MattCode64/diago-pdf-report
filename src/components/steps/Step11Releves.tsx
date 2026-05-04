import { useFormContext } from 'react-hook-form';
import { Info } from 'lucide-react';
import { RadioGroupField } from '../form/fields/RadioGroupField';
import { SelectField } from '../form/fields/SelectField';
import { TextAreaField } from '../form/fields/TextAreaField';
import { NitrateTestList } from '../form/NitrateTestList';
import { SectionCard } from '../layout/SectionCard';
import { StepTitle } from '../layout/StepTitle';
import { OUI_NON, TEST_NITRATE_OPTIONS } from '../../data/constants';
import type { ReportData } from '../../schemas/reportSchema';

export const Step11Releves = () => {
  const { watch } = useFormContext<ReportData>();
  const nitrate = watch('testNitrate');
  const t660 = watch('testT660');
  const hygro = watch('testHygro');
  const igeres = watch('testIgeres');

  return (
    <div className="space-y-6">
      <StepTitle step={11} title="Relevés & prélèvements" subtitle="Mesures effectuées sur place." />

      <SectionCard title="Test nitrate">
        <RadioGroupField name="testNitrate" label="Test effectué ?" options={TEST_NITRATE_OPTIONS} />
        {nitrate === 'Oui' && <NitrateTestList />}
      </SectionCard>

      <SectionCard title="Tests d'humidité">
        <div className="flex items-start gap-2 rounded-md bg-sky-50 p-3 text-xs text-sky-900 ring-1 ring-sky-200">
          <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <div className="space-y-1">
            <p>
              <strong>T660 :</strong> valeurs en digit de 0 à 200. {'<'} 60 = pas d'humidité.
            </p>
            <p>
              <strong>Hygromètre :</strong> taux d'humidité dans l'air. {'>'} 50 % = anormal.
            </p>
            <p>
              <strong>IGERESS :</strong> évalue la pollution de l'air (COV).
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <SelectField name="testT660" label="Humidimètre T660" options={OUI_NON} />
            {t660 === 'Oui' && (
              <TextAreaField name="testT660Details" rows={3} placeholder="Notes / relevés T660…" />
            )}
          </div>
          <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <SelectField name="testHygro" label="Hygromètre" options={OUI_NON} />
            {hygro === 'Oui' && (
              <TextAreaField name="testHygroDetails" rows={3} placeholder="Taux d'humidité…" />
            )}
          </div>
          <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <SelectField name="testIgeres" label="IGERESS" options={OUI_NON} />
            {igeres === 'Oui' && (
              <TextAreaField name="testIgeresDetails" rows={3} placeholder="Résultats COV…" />
            )}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Synthèse">
        <TextAreaField
          name="obsFinales"
          label="Observations finales / synthèse des mesures"
          rows={5}
        />
      </SectionCard>
    </div>
  );
};
