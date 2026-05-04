import { TextField } from '../form/fields/TextField';
import { SelectField } from '../form/fields/SelectField';
import { CheckboxGroupField } from '../form/fields/CheckboxGroupField';
import { SectionCard } from '../layout/SectionCard';
import { StepTitle } from '../layout/StepTitle';
import { TYPE_BATIMENT, TYPE_MACONNERIE, ISOLATION } from '../../data/constants';

export const Step09Batiment = () => (
  <div className="space-y-6">
    <StepTitle step={9} title="Le bâtiment" subtitle="Caractéristiques physiques du bien." />
    <SectionCard>
      <div className="grid gap-4 md:grid-cols-2">
        <SelectField name="batType" label="Type de bâtiment" options={TYPE_BATIMENT} />
        <TextField name="batAnnee" label="Année de construction (ou ± 10 ans)" />
      </div>
      <SelectField name="batMaconnerie" label="Type de maçonnerie" options={TYPE_MACONNERIE} />
      <CheckboxGroupField
        name="batIsolation"
        label="Isolation existante"
        options={ISOLATION}
        columns={3}
      />
    </SectionCard>
  </div>
);
