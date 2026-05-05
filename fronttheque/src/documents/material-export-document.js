import { Document, Page, View, Text, Image, StyleSheet, Font } from '@react-pdf/renderer';

// Register Montserrat font from Google Fonts
Font.register({
  family: 'Montserrat',
  src: 'https://fonts.gstatic.com/s/montserrat/v15/JTURjIg1_i6t8kCHKm45_dJE3gTD_u50.woff2',
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'left',
    padding: 20,
  },
  title: {
    position: 'absolute',
    top : 2,
    fontSize: 20,
    marginBottom: 20,
    fontFamily: 'Montserrat', // Specify Montserrat font
  },
  row: {
    flexDirection: 'column',
    marginBottom: 5,
    width: '100%'
  },
  cell: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
    marginBottom: 20,
    fontFamily: 'Montserrat', // Specify Montserrat font
  },
});

export const MaterialListDoc = ({ materials }) => {
  const renderGrids = () => {
    return materials.map((material, index) => {
      const qrCodeDataURL = `data:image/png;base64,${material.qrcode}`;
      const material_number = `Matosthèque-${material.material_id.toString().padStart(3, '0')}`;
      
      return (
        <View key={index} style={styles.row}>
          <View style={styles.cell}>
            <Image src={qrCodeDataURL} style={{ width: '50px', height: '50px' }} />
            <Text>{material_number}</Text>
            <Text>{material.material_title}</Text>
            <Text>{material.owner_first_name} {material.owner_last_name}</Text>
            <Text>{material.owner_email}</Text>
            <Text>{material.loan_duration}</Text>
            <Text>{material.code_nacre}</Text>
            <Text>{material.purchase_price}</Text>
          </View>
        </View>
      );
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.cell}>
          <Text style={styles.title}>Material List</Text> {/* Add title */}
        </View>
        <View style={styles.row}>
          {renderGrids()}
        </View>
      </Page>
    </Document>
  );
};
