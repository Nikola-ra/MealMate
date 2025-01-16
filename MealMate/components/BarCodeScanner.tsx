import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { BarCodeScanner, BarCodeEvent } from "expo-barcode-scanner";

interface BarcodeScannerProps {
  onBarcodeScanned: (data: string) => void; // Callback when a barcode is scanned
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onBarcodeScanned,
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const handleBarCodeScanned = ({ type, data }: BarCodeEvent) => {
    setScanned(true);
    onBarcodeScanned(data); // Pass scanned data to parent
    Alert.alert("Scanned!", `Barcode type: ${type}\nData: ${data}`);
  };

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
