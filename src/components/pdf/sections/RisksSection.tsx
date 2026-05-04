import { View, Text } from '@react-pdf/renderer';
import { pdfStyles } from '../styles';

export const RisksSection = ({ risks }: { risks: string[] }) => {
  if (risks.length === 0) return null;
  return (
    <View style={pdfStyles.risksBox} wrap={false}>
      <View style={pdfStyles.risksHeader}>
        <Text style={pdfStyles.risksHeaderText}>
          Facteurs de risques identifiés ({risks.length})
        </Text>
      </View>
      <View style={pdfStyles.risksBody}>
        {risks.map((r) => (
          <Text key={r} style={pdfStyles.riskItem}>
            • {r}
          </Text>
        ))}
      </View>
    </View>
  );
};
