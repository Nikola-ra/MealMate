import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import React, { useEffect, useRef } from "react"
import LottieView from "lottie-react-native"

export default function ErrorModal({
  isVisible,
  onClose,
  additionalText,
}: {
  isVisible: boolean
  onClose: () => void
  additionalText?: string
}) {
  const animation = useRef<LottieView>(null)
  //animation
  useEffect(() => {
    animation.current?.play()
  }, [])

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-6 rounded-2xl w-4/5 h-1/2">
          <Text className="text-2xl font-semibold text-gray-900 mb-4 text-center">
            Oops... Something Went Wrong!{" "}
          </Text>
          <Text className="text-center opacity-50">{additionalText}</Text>
          <View className="w-full flex-1 flex items-center justify-center">
            <LottieView
              ref={animation}
              source={require("@/assets/animations/error.json")}
              autoPlay
              loop
              style={styles.lottie}
            />
          </View>
          <View className="flex-row justify-between mt-6">
            <TouchableOpacity
              className="w-1/2 bg-gray-300 p-3 rounded-lg mx-auto items-center"
              onPress={() => {
                onClose()
              }}
            >
              <Text className="text-gray-800 font-medium">Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const { width } = Dimensions.get("window")
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  lottie: {
    width: width * 0.8,
    height: width * 0.8,
  },
})
