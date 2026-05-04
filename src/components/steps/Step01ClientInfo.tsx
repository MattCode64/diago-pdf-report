import { TextField } from '../form/fields/TextField';
import { SelectField } from '../form/fields/SelectField';
import { SectionCard } from '../layout/SectionCard';
import { StepTitle } from '../layout/StepTitle';
import { QUALITE_DEMANDEUR, DIAG_NOMS, DIAG_PRENOMS } from '../../data/constants';

export const Step01ClientInfo = () => (
  <div className="space-y-6">
    <StepTitle step={1} title="Informations générales" subtitle="Identité du demandeur et du technicien." />

    <div className="grid gap-6 md:grid-cols-2">
      <SectionCard title="Client">
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField name="clientNom" label="Nom" />
          <TextField name="clientPrenom" label="Prénom" />
        </div>
        <TextField name="clientAdresse" label="Adresse" />
        <div className="grid grid-cols-[1fr_2fr] gap-3">
          <TextField name="clientCP" label="Code postal" inputMode="numeric" />
          <TextField name="clientVille" label="Ville" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField name="clientTel" label="Portable" type="tel" inputMode="tel" />
          <TextField name="clientEmail" label="Email" type="email" inputMode="email" />
        </div>
        <SelectField name="clientQualite" label="Qualité" options={QUALITE_DEMANDEUR} />
      </SectionCard>

      <SectionCard title="Diagnostiqueur">
        <div className="grid gap-3 sm:grid-cols-2">
          <SelectField name="diagNom" label="Nom" options={DIAG_NOMS} />
          <SelectField name="diagPrenom" label="Prénom" options={DIAG_PRENOMS} />
        </div>
        <TextField name="diagDate" label="Date du diagnostic" type="date" />
        <TextField name="dossierRef" label="Référence dossier" />
      </SectionCard>
    </div>
  </div>
);
