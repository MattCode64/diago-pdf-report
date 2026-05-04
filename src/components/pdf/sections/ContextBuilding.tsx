import { View, Text } from '@react-pdf/renderer';
import { pdfStyles } from '../styles';
import type { ReportData } from '../../../schemas/reportSchema';

interface CellSpec {
  width: string;
  label?: boolean;
  text: string;
  italic?: boolean;
  isLast?: boolean;
}

const Row = ({ cells, isLast }: { cells: CellSpec[]; isLast?: boolean }) => (
  <View style={[pdfStyles.tableRow, isLast ? pdfStyles.tableRowLast : {}]}>
    {cells.map((cell, idx) => (
      <View
        key={idx}
        style={[
          pdfStyles.tableCell,
          { width: cell.width },
          cell.label ? pdfStyles.tableCellLabel : {},
          idx === cells.length - 1 ? pdfStyles.tableCellLast : {},
        ]}
      >
        <Text
          style={[
            cell.label ? pdfStyles.tdLabel : pdfStyles.td,
            cell.italic ? pdfStyles.tdMuted : {},
          ]}
        >
          {cell.text}
        </Text>
      </View>
    ))}
  </View>
);

export const ContextBuilding = ({ data }: { data: ReportData }) => (
  <View>
    <Text style={pdfStyles.sectionTitle}>I. Contexte &amp; caractéristiques</Text>

    <View style={pdfStyles.table}>
      <Row
        cells={[
          { width: '25%', label: true, text: 'Type de bien' },
          { width: '25%', text: data.batType || 'N/A' },
          { width: '25%', label: true, text: 'Année const.' },
          { width: '25%', text: data.batAnnee || 'N/A' },
        ]}
      />
      <Row
        cells={[
          { width: '25%', label: true, text: 'Maçonnerie' },
          { width: '25%', text: data.batMaconnerie || 'Non précisée' },
          { width: '25%', label: true, text: 'Isolation' },
          {
            width: '25%',
            text: data.batIsolation.length > 0 ? data.batIsolation.join(', ') : 'Non précisée',
          },
        ]}
      />
      <Row
        isLast
        cells={[
          { width: '25%', label: true, text: 'Occupation' },
          {
            width: '75%',
            text: `${data.nbAdultes} adulte(s), ${data.nbEnfants} enfant(s)`,
          },
        ]}
      />
    </View>

    <Text style={pdfStyles.subtitle}>Historique des désordres (déclaratif)</Text>
    <View style={pdfStyles.table}>
      <Row
        cells={[
          { width: '25%', label: true, text: 'Apparition' },
          { width: '75%', text: data.histDate || 'Non précisée' },
        ]}
      />
      <Row
        cells={[
          { width: '25%', label: true, text: 'Localisation' },
          {
            width: '75%',
            text:
              data.histPieces.length > 0 ? data.histPieces.join(', ') : 'Non précisée',
          },
        ]}
      />
      <Row
        isLast
        cells={[
          { width: '25%', label: true, text: 'Note client' },
          {
            width: '75%',
            italic: true,
            text: data.histObs || 'Aucune observation particulière.',
          },
        ]}
      />
    </View>
  </View>
);
