import { useFormContext } from 'react-hook-form';
import type { ReportData } from '../../schemas/reportSchema';
import { StepTitle } from '../layout/StepTitle';
import { formatDate } from '../../utils/formatDate';

export const Step02Rappel = () => {
  const { watch } = useFormContext<ReportData>();
  const v = watch();

  const Full = (s?: string) => (s && s.trim().length > 0 ? s : '—');

  return (
    <div className="space-y-4">
      <StepTitle
        step={2}
        title="Rappel & contexte"
        subtitle="Relecture du contexte de la mission avant le diagnostic."
      />
      <article className="rounded-xl border border-brand-100 bg-brand-50 p-5 text-sm leading-relaxed text-slate-800 md:p-6">
        <p className="mb-3">
          Suite à la demande de{' '}
          <strong className="text-brand-900">
            {Full(v.clientNom)} {Full(v.clientPrenom)}
          </strong>
          ,
        </p>
        <p className="mb-3">
          Il a été procédé à des opérations de diagnostic de l’humidité existante et/ou de la
          pollution de l’air intérieur par{' '}
          <strong className="text-brand-900">
            {Full(v.diagPrenom)} {Full(v.diagNom)}
          </strong>
          , le <strong>{formatDate(v.diagDate) || '—'}</strong>.
        </p>
        <p className="mb-3">
          Les opérations de diagnostic ont été réalisées à :{' '}
          <strong className="text-brand-900">
            {Full(v.clientAdresse)}, {Full(v.clientCP)} {Full(v.clientVille)}
          </strong>
          .
        </p>
        <p className="mb-3">
          Les opérations menées avaient pour but de répondre à la demande d’identification de
          l’origine des désordres, d’en déterminer la cause et les conséquences structurelles,
          économiques, financières et sanitaires, et enfin d’en déterminer les traitements possibles.
        </p>
        <p className="mt-4 font-semibold text-brand-900">Ces opérations sont basées sur :</p>
        <ul className="ml-5 list-disc italic text-slate-600">
          <li>les déclarations des personnes présentes,</li>
          <li>les observations du technicien,</li>
          <li>les relevés et prélèvements réalisés sur place,</li>
          <li>les éléments fournis (photos, plans, factures, expertises, constats…).</li>
        </ul>
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <strong>Avertissement : </strong>
          Les résultats peuvent être remis en cause en cas d’omission volontaire, de fausse
          déclaration ou d’intervention préalable masquant les désordres.
        </div>
        <p className="mt-4">
          <strong>Le demandeur déclare avoir respecté le protocole :</strong> Fenêtres fermées 24h
          avant, aucune trace nettoyée, aucune dissimulation, aucun incident ancien occulté, aucune
          fausse déclaration, aucune opposition à la visite.
        </p>
        <p className="mt-4 font-medium italic text-brand-700">
          Il ressort de ces opérations les éléments présentés dans les pages suivantes.
        </p>
      </article>
    </div>
  );
};
