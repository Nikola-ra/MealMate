import React, { useState, useEffect } from "react"
import { Text, Pressable, View, StyleSheet } from "react-native"
import { CameraView, useCameraPermissions } from "expo-camera"

export default function ScanButton() {
  const [permission, requestPermission] = useCameraPermissions()
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission()
    }
  }, [permission])

  if (!permission) return null

  if (!permission.granted) {
    return (
      <Pressable style={styles.permissionButton} onPress={requestPermission}>
        <Text style={styles.buttonText}>Grant Camera Permission</Text>
      </Pressable>
    )
  }

  return (
    <>
      <Pressable style={styles.scanButton} onPress={() => setScanning(true)}>
        <Text style={styles.buttonText}>Scan Product</Text>
      </Pressable>

      {scanning && (
        <View style={styles.cameraOverlay}>
          <CameraView
            style={styles.camera}
            barcodeScannerSettings={{ barcodeTypes: ["qr", "ean13", "upc_a"] }}
            onBarcodeScanned={({ data }) => {
              setScanning(false)
              alert(`Scanned: ${data}`)
            }}
          />
          <Pressable
            style={styles.closeButton}
            onPress={() => setScanning(false)}
          >
            <Text style={styles.buttonText}>Close</Text>
          </Pressable>
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  scanButton: {
    backgroundColor: "green",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  permissionButton: {
    backgroundColor: "red",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  cameraOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  closeButton: {
    position: "absolute",
    bottom: 100,
    backgroundColor: "red",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
})
