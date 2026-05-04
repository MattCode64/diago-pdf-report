import { View, Text } from '@react-pdf/renderer';
import { pdfStyles } from '../styles';
import { formatDate } from '../../../utils/formatDate';
import type { ReportData } from '../../../schemas/reportSchema';

const orNone = (s: string | undefined | null, placeholder = '—') =>
  s && s.trim().length > 0 ? s : placeholder;

export const CoverAndClient = ({ data }: { data: ReportData }) => (
  <View>
    <View style={pdfStyles.coverBlock}>
      <Text style={pdfStyles.coverTitle}>Rapport de diagnostic</Text>
      <Text style={pdfStyles.coverSubtitle}>Diagnostic humidité &amp; pathologies</Text>
      <View style={pdfStyles.coverRule} />
    </View>

    <View style={pdfStyles.infoRow}>
      <View style={pdfStyles.infoCol}>
        <Text style={pdfStyles.subtitle}>Demandeur</Text>
        <View style={[pdfStyles.infoBlock, pdfStyles.infoBlockPrimary]}>
          <Text style={pdfStyles.infoName}>
            {orNone(data.clientNom).toUpperCase()} {orNone(data.clientPrenom)}
          </Text>
          <Text style={pdfStyles.infoRole}>
            {orNone(data.clientQualite, 'Qualité non précisée')}
          </Text>
          <Text style={pdfStyles.infoLine}>{orNone(data.clientAdresse)}</Text>
          <Text style={pdfStyles.infoLine}>
            {orNone(data.clientCP)} {orNone(data.clientVille)}
          </Text>
          <View style={pdfStyles.infoSeparator} />
          <Text style={pdfStyles.infoLine}>Tél : {orNone(data.clientTel)}</Text>
          <Text style={pdfStyles.infoLine}>Email : {orNone(data.clientEmail)}</Text>
        </View>
      </View>
      <View style={pdfStyles.infoColSpacer} />
      <View style={pdfStyles.infoCol}>
        <Text style={pdfStyles.subtitle}>Technicien en charge</Text>
        <View style={pdfStyles.infoBlock}>
          <Text style={pdfStyles.infoName}>
            {orNone(data.diagNom).toUpperCase()} {orNone(data.diagPrenom)}
          </Text>
          <Text style={pdfStyles.infoRole}>
            Technicien bâtiment – analyse de l'humidité
          </Text>
          <Text style={pdfStyles.infoLine}>
            <Text style={pdfStyles.bold}>Date visite : </Text>
            {formatDate(data.diagDate)}
          </Text>
          <Text style={pdfStyles.infoLine}>
            <Text style={pdfStyles.bold}>Créneau : </Text>
            {orNone(data.visiteDebut)} – {orNone(data.visiteFin)}
          </Text>
        </View>
      </View>
    </View>

    <View style={pdfStyles.rappelBox}>
      <Text style={pdfStyles.subtitle}>Rappel &amp; contexte de la mission</Text>
      <Text style={pdfStyles.rappelText}>
        Suite à la demande de{' '}
        <Text style={pdfStyles.rappelStrong}>
          {orNone(data.clientNom)} {orNone(data.clientPrenom)}
        </Text>
        , il a été procédé à des opérations de diagnostic de l'humidité existante et/ou de la
        pollution de l'air intérieur par{' '}
        <Text style={pdfStyles.rappelStrong}>
          {orNone(data.diagPrenom)} {orNone(data.diagNom)}
        </Text>
        , le <Text style={pdfStyles.rappelStrong}>{formatDate(data.diagDate)}</Text>.
      </Text>
      <Text style={pdfStyles.rappelText}>
        Les opérations de diagnostic ont été réalisées à :{' '}
        <Text style={pdfStyles.rappelStrong}>
          {orNone(data.clientAdresse)}, {orNone(data.clientCP)} {orNone(data.clientVille)}
        </Text>
        .
      </Text>
      <Text style={pdfStyles.rappelText}>
        Les opérations menées avaient pour but de répondre à la demande d'identification de
        l'origine des désordres, d'en déterminer la cause et les conséquences structurelles,
        économiques, financières et sanitaires, et enfin d'en déterminer les traitements possibles.
      </Text>
      <Text style={[pdfStyles.subtitle, { marginTop: 4 }]}>Ces opérations sont basées sur :</Text>
      <View style={pdfStyles.list}>
        {[
          'les déclarations des personnes présentes',
          'les observations du technicien',
          'les relevés et prélèvements réalisés sur place',
          'les éléments fournis (photos, plans, factures, expertises, constats…)',
        ].map((s) => (
          <View key={s} style={pdfStyles.listItem}>
            <Text style={pdfStyles.bullet}>•</Text>
            <Text style={pdfStyles.listText}>{s}</Text>
          </View>
        ))}
      </View>
      <View style={pdfStyles.warningBox}>
        <Text style={pdfStyles.warningText}>
          <Text style={pdfStyles.bold}>Avertissement : </Text>
          Les résultats peuvent être remis en cause en cas d'omission volontaire, de fausse
          déclaration ou d'intervention préalable masquant les désordres.
        </Text>
      </View>
      <Text style={[pdfStyles.rappelText, { marginTop: 8 }]}>
        <Text style={pdfStyles.rappelStrong}>
          Le demandeur déclare avoir respecté le protocole :{' '}
        </Text>
        Fenêtres fermées 24 h avant, aucune trace nettoyée, aucune dissimulation, aucun incident
        ancien occulté, aucune fausse déclaration, aucune opposition à la visite.
      </Text>
    </View>
  </View>
);
