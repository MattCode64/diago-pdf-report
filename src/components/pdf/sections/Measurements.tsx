import { View, Text } from '@react-pdf/renderer';
import { pdfStyles, colors } from '../styles';
import type { ReportData } from '../../../schemas/reportSchema';

interface MeasureRowProps {
  label: string;
  result: string;
  details: string;
  isLast?: boolean;
}

const MeasureRow = ({ label, result, details, isLast }: MeasureRowProps) => {
  const isYes = result === 'Oui';
  return (
    <View style={[pdfStyles.tableRow, isLast ? pdfStyles.tableRowLast : {}]}>
      <View style={[pdfStyles.tableCell, pdfStyles.tableCellLabel, { width: '25%' }]}>
        <Text style={pdfStyles.tdLabel}>{label}</Text>
      </View>
      <View
        style={[
          pdfStyles.tableCell,
          {
            width: '15%',
            alignItems: 'center',
            backgroundColor: isYes ? colors.red50 : colors.white,
          },
        ]}
      >
        <Text
          style={[
            pdfStyles.td,
            pdfStyles.bold,
            { color: isYes ? colors.red700 : colors.slate700 },
          ]}
        >
          {result}
        </Text>
      </View>
      <View style={[pdfStyles.tableCell, pdfStyles.tableCellLast, { width: '60%' }]}>
        <Text style={pdfStyles.td}>{details}</Text>
      </View>
    </View>
  );
};

export const Measurements = ({ data }: { data: ReportData }) => {
  const nitrateDetails =
    data.testNitrate === 'Oui' && data.testNitrateListe.length > 0
      ? data.testNitrateListe
          .map((t) => `• ${t.valeur} mg (${t.lieu || '—'})`)
          .join('\n')
      : data.testNitrate === 'Oui'
        ? 'Aucun relevé saisi'
        : 'N/A';

  return (
    <View>
      <Text style={pdfStyles.subtitle}>Relevés métrologiques</Text>

      <View style={pdfStyles.legendBox} wrap={false}>
        <View style={pdfStyles.legendItem}>
          <Text style={pdfStyles.legendBullet}>•</Text>
          <Text style={pdfStyles.legendText}>
            <Text style={pdfStyles.bold}>Le T660</Text> donne des valeurs en digit allant de 0
            à 200. Une valeur inférieure à 60 indique qu'il n'y a pas d'humidité.
          </Text>
        </View>
        <View style={pdfStyles.legendItem}>
          <Text style={pdfStyles.legendBullet}>•</Text>
          <Text style={pdfStyles.legendText}>
            <Text style={pdfStyles.bold}>L'hygromètre</Text> indique un taux d'humidité dans
            l'air. Un taux supérieur à 50 % est un taux anormal.
          </Text>
        </View>
        <View style={[pdfStyles.legendItem, pdfStyles.legendItemLast]}>
          <Text style={pdfStyles.legendBullet}>•</Text>
          <Text style={pdfStyles.legendText}>
            <Text style={pdfStyles.bold}>L'IGERESS</Text> permet d'évaluer la pollution dans
            l'air (Composant Organique Volatile).
          </Text>
        </View>
      </View>

      <View style={pdfStyles.table}>
        <View style={[pdfStyles.tableRow, pdfStyles.tableHeaderRow]}>
          <View style={[pdfStyles.tableCell, { width: '25%' }]}>
            <Text style={pdfStyles.th}>Type de mesure</Text>
          </View>
          <View style={[pdfStyles.tableCell, { width: '15%', alignItems: 'center' }]}>
            <Text style={pdfStyles.th}>Résultat</Text>
          </View>
          <View style={[pdfStyles.tableCell, pdfStyles.tableCellLast, { width: '60%' }]}>
            <Text style={pdfStyles.th}>Détails / localisation</Text>
          </View>
        </View>
        <MeasureRow label="Test nitrates" result={data.testNitrate} details={nitrateDetails} />
        <MeasureRow
          label="Humidimètre T660"
          result={data.testT660}
          details={data.testT660Details || '—'}
        />
        <MeasureRow
          label="Hygrométrie"
          result={data.testHygro}
          details={data.testHygroDetails || '—'}
        />
        <MeasureRow
          label="IGERESS (COV)"
          result={data.testIgeres}
          details={data.testIgeresDetails || '—'}
          isLast
        />
      </View>

      {!!data.obsFinales && (
        <View style={pdfStyles.syntheseBox}>
          <Text style={pdfStyles.syntheseLabel}>Synthèse des mesures</Text>
          <Text style={pdfStyles.syntheseText}>{data.obsFinales}</Text>
        </View>
      )}
    </View>
  );
};
