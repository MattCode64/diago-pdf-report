import { View, Text, Svg, Path } from '@react-pdf/renderer';
import { pdfStyles } from './styles';
import { formatDate } from '../../utils/formatDate';

interface PdfHeaderProps {
  date: string;
  dossierRef: string;
}

export const PdfHeader = ({ date, dossierRef }: PdfHeaderProps) => (
  <View style={pdfStyles.header} fixed>
    <View style={pdfStyles.headerLeft}>
      <Svg style={pdfStyles.headerLogo} viewBox="0 0 100 130">
        <Path
          d="M 50 5 C 30 30, 0 60, 5 90 C 10 120, 45 135, 70 120 C 50 125, 20 110, 20 85 C 20 55, 45 30, 50 5 Z"
          fill="#1d4ed8"
        />
        <Path
          d="M 50 5 C 70 40, 95 70, 85 100 C 80 115, 65 122, 55 122 C 75 115, 80 95, 75 80 C 65 55, 55 25, 50 5 Z"
          fill="#0f3a5d"
        />
      </Svg>
      <View style={pdfStyles.headerTextBlock}>
        <Text style={pdfStyles.headerBrand}>DIAGO</Text>
        <Text style={pdfStyles.headerTagline}>Diagnostic humidité</Text>
      </View>
    </View>
    <View style={pdfStyles.headerRight}>
      <Text style={pdfStyles.headerDate}>{formatDate(date)}</Text>
      <Text style={pdfStyles.headerRef}>{dossierRef}</Text>
    </View>
  </View>
);
