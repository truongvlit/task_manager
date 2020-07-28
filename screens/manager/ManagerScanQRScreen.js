import React, { useEffect } from 'react';
import { StyleSheet, View, Image, Text, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function ManagerScanQRScreen(props) {
  const [hasPermission, setHasPermission] = React.useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    props.navigation.navigate("UserDetails", {userId: data})
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>
      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        style={[StyleSheet.absoluteFill, styles.container]}
      >
        <Text style={styles.description}>Scan user QR code</Text>
        <Image
          style={styles.qr}
          source={require('../../assets/qr.png')}
        />
        <Text
          onPress={() => props.navigation.goBack()}
          style={styles.cancel}>
          Cancel
        </Text>
      </BarCodeScanner>
    </View>
  );
}

const opacity = 'rgba(0, 0, 0, .6)';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    opacity: 1
  },
  qr: {
    marginTop: '20%',
    marginBottom: '10%',
    width: 400,
    height: 400,
  },
  description: {
    fontSize: 30,
    marginTop: '10%',
    textAlign: 'center',
    width: '70%',
    color: 'white',
  },
  cancel: {
    fontSize: 30,
    textAlign: 'center',
    width: '70%',
    color: 'white',
  },
});