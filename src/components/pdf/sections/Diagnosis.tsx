import { View, Text } from '@react-pdf/renderer';
import { pdfStyles, colors } from '../styles';
import {
  PATHOLOGY_KEYS,
  PATHOLOGY_LABELS,
  PATHOLOGY_STATUS_OPTIONS,
} from '../../../data/constants';
import type { ReportData } from '../../../schemas/reportSchema';

export const Diagnosis = ({ data }: { data: ReportData }) => (
  <View>
    <Text style={pdfStyles.sectionTitle}>III. Diagnostic &amp; conclusions</Text>

    <View style={pdfStyles.table}>
      <View style={[pdfStyles.tableRow, pdfStyles.tableHeaderRow]}>
        <View style={[pdfStyles.tableCell, { width: '60%' }]}>
          <Text style={pdfStyles.th}>Pathologie analysée</Text>
        </View>
        <View style={[pdfStyles.tableCell, pdfStyles.tableCellLast, { width: '40%', alignItems: 'center' }]}>
          <Text style={pdfStyles.th}>Évaluation technique</Text>
        </View>
      </View>
      {PATHOLOGY_KEYS.map((key, i) => {
        const status = data.pathologiesState[key];
        const opt = PATHOLOGY_STATUS_OPTIONS.find((o) => o.value === status);
        const isLast = i === PATHOLOGY_KEYS.length - 1;
        return (
          <View
            key={key}
            style={[
              pdfStyles.tableRow,
              isLast ? pdfStyles.tableRowLast : {},
              { backgroundColor: opt?.pdfBg ?? colors.white },
            ]}
          >
            <View style={[pdfStyles.tableCell, { width: '60%' }]}>
              <Text style={[pdfStyles.td, { color: opt?.pdfFg ?? colors.slate700 }]}>
                {PATHOLOGY_LABELS[key]}
              </Text>
            </View>
            <View
              style={[
                pdfStyles.tableCell,
                pdfStyles.tableCellLast,
                { width: '40%', alignItems: 'center' },
              ]}
            >
              <Text
                style={[
                  pdfStyles.td,
                  pdfStyles.bold,
                  {
                    color: opt?.pdfFg ?? colors.slate700,
                    textTransform: 'uppercase',
                    letterSpacing: 0.8,
                    fontSize: 8.5,
                  },
                ]}
              >
                {opt?.label ?? 'Non évalué'}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  </View>
);
