import { CheckboxGroupField } from '../form/fields/CheckboxGroupField';
import { TextAreaField } from '../form/fields/TextAreaField';
import { SectionCard } from '../layout/SectionCard';
import { StepTitle } from '../layout/StepTitle';
import { SYMPTOMES_EXTERIEUR } from '../../data/constants';

export const Step05IndicesExt = () => (
  <div className="space-y-6">
    <StepTitle
      step={5}
      title="Indices extérieurs"
      subtitle="Symptômes relevés sur l'enveloppe extérieure du bâtiment."
    />
    <SectionCard>
      <CheckboxGroupField
        name="sympExt"
        label="Symptômes relevés"
        options={SYMPTOMES_EXTERIEUR}
        columns={2}
      />
      <TextAreaField name="obsExt" label="Observations extérieures complémentaires" rows={4} />
    </SectionCard>
  </div>
);
