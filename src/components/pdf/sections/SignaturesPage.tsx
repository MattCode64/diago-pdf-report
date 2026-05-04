import { View, Text, Image } from '@react-pdf/renderer';
import { pdfStyles } from '../styles';
import { formatDate } from '../../../utils/formatDate';
import type { ReportData } from '../../../schemas/reportSchema';

export const SignaturesPage = ({ data }: { data: ReportData }) => (
  <View wrap={false} style={{ marginTop: 14 }}>
    <Text style={pdfStyles.subtitle}>Obligation de conseil et d'information</Text>
    <View style={{ marginBottom: 10 }}>
      <Text style={pdfStyles.rappelText}>
        Ce document établi ce jour {formatDate(data.diagDate)} a pour objectif d'informer{' '}
        <Text style={pdfStyles.rappelStrong}>M. &amp; Mme {data.clientNom || '—'}</Text> sur les
        pathologies liées à l'humidité identifiées lors du contrôle et leurs risques associés.
      </Text>
      <Text style={pdfStyles.rappelText}>
        La société ne pourra en aucun cas être tenue pour responsable notamment en cas de visite
        partielle, vice caché, défaut d'information ou refus d'exploration ainsi que des
        conséquences sanitaires, structurelles et/ou économiques liées à l'absence de traitements
        ultérieurs des pathologies évolutives relevées.
      </Text>
      <Text style={[pdfStyles.rappelText, pdfStyles.bold, { color: '#1e3a8a' }]}>
        Les propriétaires par leur signature ci-dessous reconnaissent avoir été parfaitement
        informés et déchargent la société de sa responsabilité de conseil.
      </Text>
    </View>

    <View style={pdfStyles.signaturesRow}>
      <View style={[pdfStyles.signatureCell, pdfStyles.signatureCellDivider]}>
        <Text style={pdfStyles.signatureLabel}>Pour le client</Text>
        <Text style={pdfStyles.signatureHint}>Mention « Lu et approuvé »</Text>
        <View style={pdfStyles.signatureBox}>
          {data.signatureClientData ? (
            <Image src={data.signatureClientData} style={pdfStyles.signatureImage} />
          ) : (
            <Text style={pdfStyles.signaturePlaceholder}>Espace signature</Text>
          )}
        </View>
        <Text style={pdfStyles.signatureFooter}>
          Fait à {data.clientVille || '—'}, le {formatDate(data.diagDate)}
        </Text>
      </View>
      <View style={pdfStyles.signatureCell}>
        <Text style={pdfStyles.signatureLabel}>Le technicien</Text>
        <Text style={pdfStyles.signatureHint}>Cachet et signature</Text>
        <View style={pdfStyles.signatureBox}>
          {data.signatureDiagData ? (
            <Image src={data.signatureDiagData} style={pdfStyles.signatureImage} />
          ) : (
            <Text style={pdfStyles.signaturePlaceholder}>Espace signature</Text>
          )}
        </View>
      </View>
    </View>
  </View>
);
