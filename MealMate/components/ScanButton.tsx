import React, { useState, useEffect } from "react"
import { Text, Pressable, View, StyleSheet } from "react-native"
import { CameraView, useCameraPermissions } from "expo-camera"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { cn } from "@/lib/utils"

export default function ScanButton({
  className = "",
  userId,
  refreshProducts,
  setModalVisible,
  setCurrentProductId,
  setErrorModalVisible,
}: {
  className?: string
  userId: string
  refreshProducts: () => void
  setModalVisible: (visible: boolean) => void
  setCurrentProductId: (value: string | null) => void
  setErrorModalVisible: (visible: boolean) => void
}) {
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
      <Pressable
        className={cn(
          "bg-green-500 px-6 py-5 rounded-xl flex flex-row items-center justify-center gap-2",
          className
        )}
        onPress={() => setScanning(true)}
      >
        <FontAwesome name="barcode" size={20} color="white" />
        <Text className="text-white font-bold text-lg">Scan Product</Text>
      </Pressable>

      {scanning && (
        <View className="absolute top-0 left-0 w-full h-full bg-black flex justify-center items-center">
          <CameraView
            style={styles.camera}
            onBarcodeScanned={({ data }) => {
              // console.log(data)
              setScanning(false)
              fetch(`${process.env.EXPO_PUBLIC_NGROK}/products`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  barCode: data,
                  userId: userId,
                }),
              })
                .then(response => response.json())
                .then(result => {
                  // console.log(result.product)
                  setCurrentProductId(result.product._id) // Update the currentProductId state
                  setModalVisible(true)
                  refreshProducts()
                })
                .catch(error => {
                  console.error("Error:", error)
                  setErrorModalVisible(true)
                })
            }}
          />

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
