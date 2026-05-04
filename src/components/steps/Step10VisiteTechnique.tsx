import { useFormContext } from 'react-hook-form';
import { TextField } from '../form/fields/TextField';
import { CheckboxGroupField } from '../form/fields/CheckboxGroupField';
import { TextAreaField } from '../form/fields/TextAreaField';
import { BooleanRadio } from '../form/BooleanRadio';
import { SectionCard } from '../layout/SectionCard';
import { StepTitle } from '../layout/StepTitle';
import { OBS_MURS_EXT, OBS_MURS_INT, OBS_AIR } from '../../data/constants';
import type { ReportData } from '../../schemas/reportSchema';

export const Step10VisiteTechnique = () => {
  const { watch, setValue, getValues } = useFormContext<ReportData>();
  const visiteComplete = watch('visiteComplete');

  const fillDefaultMotif = () => {
    const nom = getValues('clientNom') || 'Le client';
    setValue('visiteMotif', `${nom} a voulu se concentrer sur le problème`, { shouldDirty: true });
  };

  return (
    <div className="space-y-6">
      <StepTitle step={10} title="Visite technique" />

      <SectionCard title="Horaires & périmètre">
        <div className="grid grid-cols-2 gap-4">
          <TextField name="visiteDebut" label="Heure de début" type="time" />
          <TextField name="visiteFin" label="Heure de fin" type="time" />
        </div>
        <BooleanRadio
          name="visiteComplete"
          label="Visite complète du bien ?"
          onFalseSelected={fillDefaultMotif}
        />
        {!visiteComplete && (
          <TextField name="visiteMotif" label="Motif de la visite partielle" />
        )}
      </SectionCard>

      <SectionCard title="Observations visuelles">
        <CheckboxGroupField name="obsMurExt" label="Murs extérieurs" options={OBS_MURS_EXT} columns={2} />
        <CheckboxGroupField name="obsMurInt" label="Murs intérieurs" options={OBS_MURS_INT} columns={2} />
        <CheckboxGroupField name="obsAirInt" label="Air intérieur" options={OBS_AIR} columns={2} />
        <TextAreaField name="obsSupp" label="Observations supplémentaires" rows={4} />
      </SectionCard>
    </div>
  );
};
