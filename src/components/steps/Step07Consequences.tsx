import { CheckboxGroupField } from '../form/fields/CheckboxGroupField';
import { SectionCard } from '../layout/SectionCard';
import { StepTitle } from '../layout/StepTitle';
import { CONSEQUENCES } from '../../data/constants';

export const Step07Consequences = () => (
  <div className="space-y-6">
    <StepTitle
      step={7}
      title="Conséquences"
      subtitle="Conséquences redoutées ou déjà constatées."
    />
    <SectionCard>
      <CheckboxGroupField
        name="consequences"
        label="Conséquences"
        options={CONSEQUENCES}
        columns={2}
      />
    </SectionCard>
  </div>
);
