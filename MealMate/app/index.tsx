import { BarcodeScanner } from "@/components/BarCodeScanner";
import React, { useState } from "react";
import { View, Text, Button, Modal, StyleSheet } from "react-native";

export function IndexPage()  {
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [scannedData, setScannedData] = useState<string | null>(null);

  const handleBarcodeScanned = (data: string) => {
    setScannedData(data);
    setIsScannerOpen(false);
    // TODO: Use scannedData to fetch product info
    console.log("Scanned Barcode Data:", data);
  };

  return (
    <View style={styles.container}>
      <Text>Tab [Home|Settings]</Text>
      <Button title="Scan Barcode" onPress={() => setIsScannerOpen(true)} />

      {scannedData && <Text>Scanned Product Data: {scannedData}</Text>}

      <Modal visible={isScannerOpen} animationType="slide">
        <BarcodeScanner onBarcodeScanned={handleBarcodeScanned} />
      </Modal>
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
