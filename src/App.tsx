import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BrandHeader } from './components/layout/BrandHeader';
import { Stepper } from './components/layout/Stepper';
import { StepNavigation } from './components/layout/StepNavigation';
import {
  reportSchema,
  createDefaultReport,
  TOTAL_STEPS,
} from './schemas/reportSchema';
import type { ReportData } from './schemas/reportSchema';
import { usePersistedDraft, loadDraft, clearDraft } from './hooks/usePersistedDraft';
import { usePathologyAutoText } from './hooks/usePathologyAutoText';
import { Step01ClientInfo } from './components/steps/Step01ClientInfo';
import { Step02Rappel } from './components/steps/Step02Rappel';
import { Step03History } from './components/steps/Step03History';
import { Step04IndicesInt } from './components/steps/Step04IndicesInt';
import { Step05IndicesExt } from './components/steps/Step05IndicesExt';
import { Step06Attentes } from './components/steps/Step06Attentes';
import { Step07Consequences } from './components/steps/Step07Consequences';
import { Step08Occupants } from './components/steps/Step08Occupants';
import { Step09Batiment } from './components/steps/Step09Batiment';
import { Step10VisiteTechnique } from './components/steps/Step10VisiteTechnique';
import { Step11Releves } from './components/steps/Step11Releves';
import { Step12Pathologies } from './components/steps/Step12Pathologies';
import { Step13Signatures } from './components/steps/Step13Signatures';
import { Step14Preview } from './components/steps/Step14Preview';
import { Sparkles } from 'lucide-react';
import { buildMockReport } from './data/mockReport';

const mergeDraft = (): ReportData => {
  const base = createDefaultReport();
  const draft = loadDraft();
  if (!draft) return base;
  return {
    ...base,
    ...draft,
    pathologiesState: { ...base.pathologiesState, ...(draft.pathologiesState ?? {}) },
  };
};

const renderStep = (step: number) => {
  switch (step) {
    case 1:
      return <Step01ClientInfo />;
    case 2:
      return <Step02Rappel />;
    case 3:
      return <Step03History />;
    case 4:
      return <Step04IndicesInt />;
    case 5:
      return <Step05IndicesExt />;
    case 6:
      return <Step06Attentes />;
    case 7:
      return <Step07Consequences />;
    case 8:
      return <Step08Occupants />;
    case 9:
      return <Step09Batiment />;
    case 10:
      return <Step10VisiteTechnique />;
    case 11:
      return <Step11Releves />;
    case 12:
      return <Step12Pathologies />;
    case 13:
      return <Step13Signatures />;
    case 14:
      return <Step14Preview />;
    default:
      return null;
  }
};

const App = () => {
  const [step, setStep] = useState(1);
  const methods = useForm<ReportData>({
    resolver: zodResolver(reportSchema),
    defaultValues: mergeDraft(),
    mode: 'onChange',
  });

  usePersistedDraft(methods);
  usePathologyAutoText(methods);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const goNext = () => setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  const goPrev = () => setStep((s) => Math.max(1, s - 1));

  const handleReset = () => {
    if (!window.confirm('Réinitialiser le formulaire et repartir de zéro ?')) return;
    clearDraft();
    methods.reset(createDefaultReport());
    setStep(1);
  };

  const handleLoadMock = () => {
    methods.reset(buildMockReport());
    setStep(14);
  };

  const showDemoButton =
    import.meta.env.DEV ||
    (typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).has('demo'));

  const devActions = showDemoButton ? (
    <button
      type="button"
      onClick={handleLoadMock}
      title="Charger un jeu de données réaliste et sauter à l'aperçu PDF"
      className="flex items-center gap-1.5 rounded-full bg-amber-400/90 px-3 py-1 text-xs font-bold text-amber-950 shadow-sm transition-colors hover:bg-amber-300"
    >
      <Sparkles className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">Données démo</span>
    </button>
  ) : null;

  return (
    <FormProvider {...methods}>
      <div className="flex min-h-dvh flex-col bg-slate-50">
        <BrandHeader step={step} total={TOTAL_STEPS} actions={devActions} />
        <Stepper current={step} total={TOTAL_STEPS} onJump={setStep} />
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 md:py-8">
          {renderStep(step)}
        </main>
        <StepNavigation
          step={step}
          total={TOTAL_STEPS}
          onPrev={goPrev}
          onNext={goNext}
          onReset={handleReset}
        />
      </div>
    </FormProvider>
  );
};

export default App;
