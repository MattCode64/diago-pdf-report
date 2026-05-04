import { CheckboxGroupField } from '../form/fields/CheckboxGroupField';
import { TextAreaField } from '../form/fields/TextAreaField';
import { SectionCard } from '../layout/SectionCard';
import { StepTitle } from '../layout/StepTitle';
import { SYMPTOMES_INTERIEUR } from '../../data/constants';

export const Step04IndicesInt = () => (
  <div className="space-y-6">
    <StepTitle
      step={4}
      title="Indices intérieurs"
      subtitle="Symptômes relevés à l'intérieur du bâtiment."
    />
    <SectionCard>
      <CheckboxGroupField
        name="sympInt"
        label="Symptômes relevés"
        options={SYMPTOMES_INTERIEUR}
        columns={2}
      />
      <TextAreaField name="obsInt" label="Observations intérieures complémentaires" rows={4} />
    </SectionCard>
  </div>
);
