import { View, Text } from '@react-pdf/renderer';
import { pdfStyles } from '../styles';
import type { ReportData } from '../../../schemas/reportSchema';

const SymptomsColumn = ({ title, items }: { title: string; items: string[] }) => (
  <View style={pdfStyles.symptomsCol}>
    <View style={pdfStyles.symptomsHeader}>
      <Text style={pdfStyles.symptomsHeaderText}>{title}</Text>
    </View>
    <View style={pdfStyles.symptomsBody}>
      {items.length > 0 ? (
        items.map((s) => (
          <View key={s} style={pdfStyles.listItem}>
            <Text style={pdfStyles.bullet}>•</Text>
            <Text style={pdfStyles.listText}>{s}</Text>
          </View>
        ))
      ) : (
        <Text style={pdfStyles.muted}>Aucun symptôme relevé</Text>
      )}
    </View>
  </View>
);

const ObsRow = ({
  label,
  value,
  italic,
  isLast,
}: {
  label: string;
  value: string;
  italic?: boolean;
  isLast?: boolean;
}) => (
  <View style={[pdfStyles.tableRow, isLast ? pdfStyles.tableRowLast : {}]}>
    <View style={[pdfStyles.tableCell, pdfStyles.tableCellLabel, { width: '25%' }]}>
      <Text style={pdfStyles.tdLabel}>{label}</Text>
    </View>
    <View style={[pdfStyles.tableCell, pdfStyles.tableCellLast, { width: '75%' }]}>
      <Text style={[pdfStyles.td, italic ? pdfStyles.tdMuted : {}]}>{value}</Text>
    </View>
  </View>
);

export const TechnicalFindings = ({ data }: { data: ReportData }) => (
  <View>
    <Text style={pdfStyles.sectionTitle}>II. Constats techniques</Text>

    <View style={pdfStyles.symptomsRow}>
      <SymptomsColumn title="Symptômes intérieurs" items={data.sympInt} />
      <View style={pdfStyles.symptomsColSpacer} />
      <SymptomsColumn title="Symptômes extérieurs" items={data.sympExt} />
    </View>

    <Text style={pdfStyles.subtitle}>Observations visuelles technicien</Text>
    <View style={pdfStyles.table}>
      <View style={[pdfStyles.tableRow, pdfStyles.tableHeaderRow]}>
        <View style={[pdfStyles.tableCell, { width: '25%' }]}>
          <Text style={pdfStyles.th}>Zone</Text>
        </View>
        <View style={[pdfStyles.tableCell, pdfStyles.tableCellLast, { width: '75%' }]}>
          <Text style={pdfStyles.th}>Observations détaillées</Text>
        </View>
      </View>
      <ObsRow
        label="Murs extérieurs"
        value={data.obsMurExt.length > 0 ? data.obsMurExt.join(', ') : 'R.A.S'}
      />
      <ObsRow
        label="Murs intérieurs"
        value={data.obsMurInt.length > 0 ? data.obsMurInt.join(', ') : 'R.A.S'}
      />
      <ObsRow
        label="Ventilation / air"
        value={data.obsAirInt.length > 0 ? data.obsAirInt.join(', ') : 'R.A.S'}
        isLast={!data.obsSupp}
      />
      {!!data.obsSupp && (
        <ObsRow label="Note complémentaire" value={data.obsSupp} italic isLast />
      )}
    </View>
  </View>
);
