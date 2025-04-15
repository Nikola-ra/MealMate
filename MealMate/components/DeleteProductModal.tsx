import React from "react"
import { Modal, Text, TouchableOpacity, View } from "react-native"

export default function DeleteProductModal({
  isVisible,
  onDelete,
  onClose,
}: {
  isVisible: boolean
  onDelete: () => void
  onClose: () => void
}) {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-6 rounded-2xl w-4/5">
          <Text className="text-xl font-semibold text-gray-900 mb-4 text-center">
            Are you sure?{" "}
          </Text>
          <View className="flex-row justify-between mt-6">
            <TouchableOpacity
              className="flex-1 bg-gray-300 p-3 rounded-lg mr-2 items-center"
              onPress={() => {
                onClose()
              }}
            >
              <Text className="text-gray-800 font-medium">Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-red-600 p-3 rounded-lg items-center"
              onPress={() => {
                onDelete()
                onClose()
              }}
            >
              <Text className="text-white font-medium">Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}
