import { View, Text, Image, Page } from '@react-pdf/renderer';
import { pdfStyles } from '../styles';
import { PdfHeader } from '../PdfHeader';
import { PdfFooter } from '../PdfFooter';
import type { ReportData } from '../../../schemas/reportSchema';

const PHOTOS_PER_PAGE = 4;

export const PhotoAnnex = ({ data }: { data: ReportData }) => {
  if (data.photos.length === 0) return null;

  const pages: string[][] = [];
  for (let i = 0; i < data.photos.length; i += PHOTOS_PER_PAGE) {
    pages.push(data.photos.slice(i, i + PHOTOS_PER_PAGE));
  }

  return (
    <>
      {pages.map((chunk, pageIdx) => (
        <Page key={pageIdx} size="A4" style={pdfStyles.page}>
          <PdfHeader date={data.diagDate} dossierRef={data.dossierRef} />
          {pageIdx === 0 && (
            <View style={pdfStyles.annexHeader}>
              <Text style={pdfStyles.annexTitle}>Annexes photographiques</Text>
              <Text style={pdfStyles.annexSubtitle}>Relevés visuels in-situ</Text>
            </View>
          )}
          <View style={pdfStyles.photoGrid}>
            {chunk.map((src, idx) => {
              const globalIdx = pageIdx * PHOTOS_PER_PAGE + idx;
              const isRightCol = idx % 2 === 1;
              return (
                <View
                  key={globalIdx}
                  style={[pdfStyles.photoCard, isRightCol ? pdfStyles.photoCardRight : {}]}
                  wrap={false}
                >
                  <View style={pdfStyles.photoImageBox}>
                    <Image src={src} style={pdfStyles.photoImage} />
                  </View>
                  <Text style={pdfStyles.photoCaption}>Photo N°{globalIdx + 1}</Text>
                </View>
              );
            })}
          </View>
          <PdfFooter />
        </Page>
      ))}
    </>
  );
};
