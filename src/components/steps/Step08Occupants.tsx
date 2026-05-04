import { TextField } from '../form/fields/TextField';
import { SectionCard } from '../layout/SectionCard';
import { StepTitle } from '../layout/StepTitle';

export const Step08Occupants = () => (
  <div className="space-y-6">
    <StepTitle step={8} title="Occupants" />
    <SectionCard>
      <div className="grid grid-cols-2 gap-4">
        <TextField name="nbAdultes" label="Nombre d'adultes" type="number" inputMode="numeric" />
        <TextField name="nbEnfants" label="Nombre d'enfants" type="number" inputMode="numeric" />
      </div>
    </SectionCard>
  </div>
);
