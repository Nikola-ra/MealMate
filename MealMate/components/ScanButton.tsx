import React, { useState, useEffect } from "react"
import { Text, Pressable, View, StyleSheet } from "react-native"
import { CameraView, Camera, useCameraPermissions } from "expo-camera"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { cn } from "@/lib/utils"

export default function ScanButton({ className = "" }: { className?: string }) {
  const [permission, requestPermission] = useCameraPermissions()
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission()
    }
  }, [permission])

  if (!permission?.granted) {
    return (
      <Pressable
        className="bg-red-500 px-6 py-3 rounded-lg mt-4"
        onPress={requestPermission}
      >
        <Text className="text-white font-bold text-lg text-center">
          Grant Camera Permission
        </Text>
      </Pressable>
    )
  }

  return (
    <>
      {/* Scan Button */}
      <Pressable
        className={cn(
          "bg-green-500 px-6 py-5 rounded-lg flex flex-row items-center justify-center gap-2",
          className
        )}
        onPress={() => setScanning(true)}
      >
        <FontAwesome name="barcode" size={20} color="white" />
        <Text className="text-white font-bold text-lg">Scan Product</Text>
      </Pressable>

      {/* Camera Modal */}
      {scanning && (
        <View className="absolute top-0 left-0 w-full h-full bg-black flex justify-center items-center">
          {/* Styled CameraView */}
          <CameraView
            style={styles.camera}
            onBarcodeScanned={({ data }) => {
              setScanning(false)
              alert(`Scanned: ${data}`)
            }}
          />
          {/* Close Button */}
          <Pressable
            className="absolute bottom-10 bg-red-500 px-6 py-3 rounded-lg z-50"
            onPress={() => setScanning(false)}
          >
            <Text className="text-white font-bold text-lg text-center">
              Close
            </Text>
          </Pressable>
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 50,
  },
})
