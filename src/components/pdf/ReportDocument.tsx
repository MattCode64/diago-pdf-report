import { Document, Page } from '@react-pdf/renderer';
import './hyphenation';
import { pdfStyles } from './styles';
import { PdfHeader } from './PdfHeader';
import { PdfFooter } from './PdfFooter';
import { CoverAndClient } from './sections/CoverAndClient';
import { ContextBuilding } from './sections/ContextBuilding';
import { TechnicalFindings } from './sections/TechnicalFindings';
import { Measurements } from './sections/Measurements';
import { Diagnosis } from './sections/Diagnosis';
import { RisksSection } from './sections/RisksSection';
import { Conclusion } from './sections/Conclusion';
import { SignaturesPage } from './sections/SignaturesPage';
import { PhotoAnnex } from './sections/PhotoAnnex';
import type { ReportData } from '../../schemas/reportSchema';

export const ReportDocument = ({ data }: { data: ReportData }) => (
  <Document
    title={`Rapport diagnostic humidité – ${data.clientNom || 'Client'}`}
    author="DIAGO Humidité"
    subject="Diagnostic humidité et pathologies"
  >
    {/* Page 1 — Couverture + Demandeur/Technicien + Rappel */}
    <Page size="A4" style={pdfStyles.page}>
      <PdfHeader date={data.diagDate} dossierRef={data.dossierRef} />
      <CoverAndClient data={data} />
      <PdfFooter />
    </Page>

    {/* Page 2 — I. Contexte & caractéristiques + historique */}
    <Page size="A4" style={pdfStyles.page}>
      <PdfHeader date={data.diagDate} dossierRef={data.dossierRef} />
      <ContextBuilding data={data} />
      <PdfFooter />
    </Page>

    {/* Page 3 — II. Constats techniques */}
    <Page size="A4" style={pdfStyles.page}>
      <PdfHeader date={data.diagDate} dossierRef={data.dossierRef} />
      <TechnicalFindings data={data} />
      <PdfFooter />
    </Page>

    {/* Page 4 — Relevés métrologiques */}
    <Page size="A4" style={pdfStyles.page}>
      <PdfHeader date={data.diagDate} dossierRef={data.dossierRef} />
      <Measurements data={data} />
      <PdfFooter />
    </Page>

    {/* Page 5 — III. Diagnostic + risques */}
    <Page size="A4" style={pdfStyles.page}>
      <PdfHeader date={data.diagDate} dossierRef={data.dossierRef} />
      <Diagnosis data={data} />
      <RisksSection risks={data.risquesCoches} />
      <PdfFooter />
    </Page>

    {/* Page 6+ — Conclusion technique (wrappe automatiquement si > 1 page) */}
    <Page size="A4" style={pdfStyles.page}>
      <PdfHeader date={data.diagDate} dossierRef={data.dossierRef} />
      <Conclusion text={data.conclusionPathologies} />
      <PdfFooter />
    </Page>

    {/* Page suivante — Signatures & obligation de conseil */}
    <Page size="A4" style={pdfStyles.page}>
      <PdfHeader date={data.diagDate} dossierRef={data.dossierRef} />
      <SignaturesPage data={data} />
      <PdfFooter />
    </Page>

    {/* Annexes photographiques (n pages selon nb photos) */}
    <PhotoAnnex data={data} />
  </Document>
);
