import React from 'react';
import { Document, Page, View, Image, StyleSheet, Text } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Spread grids evenly horizontally
    marginBottom: 10, // Add margin between rows
  },
  grid: {
    width: '30%', // Each grid takes up 30% of the available width
    height: 175, // Fixed height for the grids
    border: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelText: {
    fontSize: 10,
    bottom: 25
  },
  infoText : {
    top: -5,
    fontSize: 9
  },
  
  frame: {
    padding: 0,
    position: 'relative',
    width: '80%',
    height: '80%',
    marginTop: 2,
    border: '1 dotted black', // border around the frame
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export const MaterialQRCodeDoc = ({documentData}) => {
  const renderGrids = () => {
    const grids = [];
    for (let i = 0; i <= documentData.length-1; i++) {
      console.log(documentData[i]);
      let qrCodeDataURL = `data:image/png;base64,${documentData[i].qrCodeData}`;
      let material_number = `Matosthèque-${documentData[i].material_id.toString().padStart(3, '0')}`;
        grids.push(
          <View key={i} style={styles.grid}>
            <Text style={styles.infoText}>Material: {documentData[i].material_title}</Text>
            <View style={styles.frame}>
              <Image src={qrCodeDataURL} style={{ width: '100%', height: '100%' }} />
              <Text style={styles.labelText}>{material_number}</Text>
            </View>
          </View>
        );
    }
    return grids;
  };
  

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.page}>
          {/* Row 1 */}
          <View style={styles.row}>
            {renderGrids().slice(0, 3)}
          </View>
          {/* Row 2 */}
          <View style={styles.row}>
            {renderGrids().slice(3, 6)}
          </View>
          {/* Row 3 */}
          <View style={styles.row}>
            {renderGrids().slice(6, 9)}
          </View>
          {/* Row 4 */}
          <View style={styles.row}>
            {renderGrids().slice(9, 12)}
          </View>
        </View>
      </Page>
    </Document>
  );
};
