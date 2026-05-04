import { View, Text } from '@react-pdf/renderer';
import { pdfStyles } from './styles';
import { COMPANY } from '../../data/constants';

export const PdfFooter = () => (
  <View style={pdfStyles.footer} fixed>
    <Text style={pdfStyles.footerLine}>
      {COMPANY.name} – Marque commerciale exploitée par {COMPANY.operator}
    </Text>
    <Text style={pdfStyles.footerLine}>
      {COMPANY.address} – Tél : {COMPANY.phone} – Email : {COMPANY.email}
    </Text>
    <Text style={pdfStyles.footerLine}>
      {COMPANY.rcs} – {COMPANY.iban}
    </Text>
    <Text style={pdfStyles.footerLine}>{COMPANY.website}</Text>
    <Text
      style={pdfStyles.pageNumber}
      render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`}
    />
  </View>
);
