import { CheckboxGroupField } from '../form/fields/CheckboxGroupField';
import { SectionCard } from '../layout/SectionCard';
import { StepTitle } from '../layout/StepTitle';
import { ATTENTES } from '../../data/constants';

export const Step06Attentes = () => (
  <div className="space-y-6">
    <StepTitle step={6} title="Attentes" subtitle="Ce qui motive la demande de diagnostic." />
    <SectionCard>
      <CheckboxGroupField
        name="attentes"
        label="Attentes du demandeur"
        options={ATTENTES}
        columns={2}
      />
    </SectionCard>
  </div>
);
