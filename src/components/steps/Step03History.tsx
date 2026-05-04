import { SelectField } from '../form/fields/SelectField';
import { CheckboxGroupField } from '../form/fields/CheckboxGroupField';
import { TextAreaField } from '../form/fields/TextAreaField';
import { SectionCard } from '../layout/SectionCard';
import { StepTitle } from '../layout/StepTitle';
import { DATE_APPARITION, PIECES } from '../../data/constants';

export const Step03History = () => (
  <div className="space-y-6">
    <StepTitle
      step={3}
      title="Historique des symptômes & localisation"
      subtitle="Quand les symptômes ont été constatés et où ils se situent."
    />
    <SectionCard>
      <SelectField name="histDate" label="Date d'apparition des symptômes" options={DATE_APPARITION} />
      <CheckboxGroupField name="histPieces" label="Pièces concernées" options={PIECES} columns={3} />
      <TextAreaField name="histObs" label="Observations sur l'historique" rows={4} />
    </SectionCard>
  </div>
);
