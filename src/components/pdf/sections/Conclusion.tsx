import { View, Text } from '@react-pdf/renderer';
import { pdfStyles } from '../styles';
import { AUTO_TEXT_MARKER } from '../../../data/pathologyTexts';

export const Conclusion = ({ text }: { text: string }) => {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return (
      <View style={pdfStyles.conclusionWrap} wrap={false}>
        <View style={pdfStyles.conclusionHeader}>
          <Text style={pdfStyles.conclusionHeaderText}>
            Conclusion &amp; préconisations du technicien
          </Text>
        </View>
        <View style={pdfStyles.conclusionBody}>
          <Text style={[pdfStyles.conclusionParagraph, pdfStyles.muted]}>
            Aucune conclusion générale renseignée.
          </Text>
        </View>
      </View>
    );
  }

  // Split sur double-newline pour respecter les paragraphes voulus
  const paragraphs = trimmed.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <View style={pdfStyles.conclusionWrap}>
      {/* Header + premier paragraphe insécables (évite titre orphelin) */}
      <View wrap={false}>
        <View style={pdfStyles.conclusionHeader}>
          <Text style={pdfStyles.conclusionHeaderText}>
            Conclusion &amp; préconisations du technicien
          </Text>
        </View>
        <View style={[pdfStyles.conclusionBody, { borderBottomWidth: 0, paddingBottom: 4 }]}>
          {paragraphs[0] === AUTO_TEXT_MARKER ? (
            <Text style={pdfStyles.conclusionMarker}>{AUTO_TEXT_MARKER}</Text>
          ) : (
            <Text style={pdfStyles.conclusionParagraph}>{paragraphs[0]}</Text>
          )}
        </View>
      </View>

      {paragraphs.length > 1 && (
        <View style={[pdfStyles.conclusionBody, { borderTopWidth: 0, paddingTop: 4 }]}>
          {paragraphs.slice(1).map((p, idx) =>
            p === AUTO_TEXT_MARKER ? (
              <Text key={idx} style={pdfStyles.conclusionMarker}>
                {AUTO_TEXT_MARKER}
              </Text>
            ) : (
              <Text key={idx} style={pdfStyles.conclusionParagraph} wrap>
                {p}
              </Text>
            ),
          )}
        </View>
      )}
    </View>
  );
};
