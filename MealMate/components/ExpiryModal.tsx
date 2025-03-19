import React, { useState } from "react"
import { Modal, Text, TouchableOpacity, View } from "react-native"
import DateTimePickerModal from "react-native-modal-datetime-picker"

export default function ExpiryModal({
  isVisible,
  onClose,
  onSubmit,
  productId,
}: {
  isVisible: boolean
  onClose: () => void
  onSubmit: (productId: string, date: Date | null) => void
  productId: string
}) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isDatePickerVisible, setDatePickerVisible] = useState(false)

  function handleConfirm(date: Date) {
    setSelectedDate(date)
    setDatePickerVisible(false)
  }

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
            Set Expiry Date
          </Text>

          {/* Open Date Picker */}
          <TouchableOpacity
            className="bg-gray-200 p-3 rounded-lg mb-4 items-center"
            onPress={() => setDatePickerVisible(true)}
          >
            <Text className="text-gray-800">
              {selectedDate ? selectedDate.toDateString() : "Select a Date"}
            </Text>
          </TouchableOpacity>

          {/* Date Picker Modal */}
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={() => setDatePickerVisible(false)}
          />

          <View className="flex-row justify-between mt-6">
            <TouchableOpacity
              className="flex-1 bg-gray-300 p-3 rounded-lg mr-2 items-center"
              onPress={() => {
                onSubmit(productId, null)
                onClose()
              }}
            >
              <Text className="text-gray-800 font-medium">Skip</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-green-600 p-3 rounded-lg items-center"
              onPress={() => {
                onSubmit(productId, selectedDate)
                onClose()
              }}
            >
              <Text className="text-white font-medium">Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}
